import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";
import { csv, DAY, deleteQuery, deleteRefs, fail, iso, ms, ok, readJson, resolveRange } from "@/components/admin/analytics/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/tests?range=7d|30d|90d|all|today (or from&to) &status &mode &country &device &q &page &limit [&format=csv] [&tz]
//   → { summary (whole range), tests (filtered page), total, facets }
// DELETE /api/admin/tests   body { ids: string[] } | { all: true } | { olderThanDays: number }
const CAP = 15_000;

type T = {
  id: string; status: string; mode: string; visitorId: string; path: string; locale: string; isp: string; ispBrand: string; ip: string;
  countryCode: string; city: string; server: string; device: string; os: string; browser: string; ts: number; finishedAt: number;
  download: number | null; upload: number | null; ping: number | null; jitter: number | null; durationMs: number | null; error: string;
};
const n = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);
const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const median = (xs: number[]) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

function group(tests: T[], key: (t: T) => string, limit = 30) {
  const m = new Map<string, T[]>();
  for (const t of tests) {
    const k = key(t) || "";
    let a = m.get(k);
    if (!a) m.set(k, (a = []));
    a.push(t);
  }
  return [...m.entries()]
    .map(([k, list]) => {
      const done = list.filter((t) => t.status === "completed");
      const dl = done.map((t) => t.download).filter((x): x is number => x != null);
      return {
        key: k,
        tests: list.length,
        completed: done.length,
        avgDownload: avg(dl),
        medianDownload: median(dl),
        avgUpload: avg(done.map((t) => t.upload).filter((x): x is number => x != null)),
        avgPing: avg(done.map((t) => t.ping).filter((x): x is number => x != null)),
        city: list.find((t) => t.city)?.city || "",
      };
    })
    .sort((a, b) => b.tests - a.tests)
    .slice(0, limit);
}

export async function GET(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured", tests: [] });

  const sp = new URL(request.url).searchParams;
  const { from, to, tz, startOfDay } = resolveRange(sp, "30d");

  try {
    const snap = await adminDb()
      .collection("tests")
      .where("ts", ">=", Timestamp.fromMillis(from))
      .where("ts", "<", Timestamp.fromMillis(to))
      .orderBy("ts", "desc")
      .limit(CAP)
      .get();

    const all: T[] = snap.docs.map((d) => {
      const x = d.data();
      return {
        id: d.id,
        status: x.status || "started",
        mode: x.mode || "full",
        visitorId: x.visitorId || "",
        path: x.path || "/",
        locale: x.locale || "",
        isp: x.isp || "",
        ispBrand: x.ispBrand || x.isp || "",
        ip: x.ip || "",
        countryCode: (x.countryCode || "").toUpperCase(),
        city: x.city || "",
        server: x.server || "",
        device: x.device || "",
        os: x.os || "",
        browser: x.browser || "",
        ts: ms(x.ts) || ms(x.startedAt),
        finishedAt: ms(x.finishedAt),
        download: n(x.download),
        upload: n(x.upload),
        ping: n(x.ping),
        jitter: n(x.jitter),
        durationMs: n(x.durationMs),
        error: x.error || "",
      };
    });

    // ---------- filters ----------
    const status = sp.get("status") || "";
    const mode = sp.get("mode") || "";
    const country = (sp.get("country") || "").toUpperCase();
    const device = sp.get("device") || "";
    const q = (sp.get("q") || "").trim().toLowerCase();
    const filtered = all.filter(
      (t) =>
        (!status || t.status === status) &&
        (!mode || t.mode === mode) &&
        (!country || t.countryCode === country) &&
        (!device || t.device === device) &&
        (!q || [t.ip, t.city, t.ispBrand, t.isp, t.countryCode, t.server, t.visitorId, t.id, t.error].some((f) => f.toLowerCase().includes(q))),
    );

    if (sp.get("format") === "csv") {
      return csv(
        [
          ["time", "status", "mode", "download_mbps", "upload_mbps", "ping_ms", "jitter_ms", "duration_ms", "country", "city", "isp_brand", "isp", "ip", "server", "device", "os", "browser", "path", "locale", "error", "visitorId", "id"],
          ...filtered.map((t) => [iso(t.ts), t.status, t.mode, t.download, t.upload, t.ping, t.jitter, t.durationMs, t.countryCode, t.city, t.ispBrand, t.isp, t.ip, t.server, t.device, t.os, t.browser, t.path, t.locale, t.error, t.visitorId, t.id]),
        ],
        `speed-tests-${new Date().toISOString().slice(0, 10)}.csv`,
      );
    }

    const limit = Math.min(200, Math.max(5, Number(sp.get("limit")) || 25));
    const page = Math.max(1, Number(sp.get("page")) || 1);
    const pageItems = filtered.slice((page - 1) * limit, page * limit);

    // ---------- summary over the whole range ----------
    const done = all.filter((t) => t.status === "completed");
    const nums = (k: "download" | "upload" | "ping" | "jitter") => done.map((t) => t[k]).filter((x): x is number => x != null);
    const dl = nums("download");

    const effFrom = from || (all.length ? all[all.length - 1].ts : Date.now());
    const firstDay = startOfDay(effFrom);
    const days = Math.max(1, Math.min(400, Math.ceil((to - firstDay) / DAY)));
    const perDay = Array.from({ length: days }, (_, i) => ({ t: firstDay + i * DAY, started: 0, completed: 0, cancelled: 0, error: 0 }));
    for (const t of all) {
      const i = Math.min(days - 1, Math.max(0, Math.floor((t.ts - firstDay) / DAY)));
      perDay[i].started++;
      if (t.status === "completed") perDay[i].completed++;
      else if (t.status === "cancelled") perDay[i].cancelled++;
      else if (t.status === "error") perDay[i].error++;
    }

    // download histogram with "nice" bin edges
    const edges = [0, 5, 10, 25, 50, 75, 100, 150, 200, 300, 500, 1000];
    const histogram = edges.map((lo, i) => {
      const hi = edges[i + 1] ?? Infinity;
      return { label: hi === Infinity ? `${lo}+` : `${lo}–${hi}`, lo, hi: hi === Infinity ? null : hi, count: dl.filter((x) => x >= lo && x < hi).length };
    });
    while (histogram.length > 4 && histogram[histogram.length - 1].count === 0) histogram.pop();

    const count = (s: string) => all.filter((t) => t.status === s).length;
    const errorsByType = group(all.filter((t) => t.status === "error"), (t) => t.error || "unknown", 10).map((g) => ({ key: g.key, count: g.tests }));
    const hours = Array(24).fill(0) as number[];
    for (const t of all) hours[new Date(t.ts - tz * 60_000).getUTCHours()]++;

    return ok({
      from,
      to,
      capped: all.length >= CAP,
      summary: {
        started: all.length,
        completed: done.length,
        cancelled: count("cancelled"),
        errors: count("error"),
        inProgress: count("started"),
        completionRate: all.length ? (done.length / all.length) * 100 : 0,
        avgDownload: avg(dl),
        medianDownload: median(dl),
        avgUpload: avg(nums("upload")),
        avgPing: avg(nums("ping")),
        avgJitter: avg(nums("jitter")),
        avgDurationSec: avg(done.map((t) => t.durationMs).filter((x): x is number => x != null).map((x) => x / 1000)),
        uniqueVisitors: new Set(all.map((t) => t.visitorId).filter(Boolean)).size,
      },
      perDay,
      histogram,
      hours,
      errorsByType,
      byCountry: group(all, (t) => t.countryCode, 50),
      byIsp: group(all, (t) => (t.ispBrand ? `${t.ispBrand}|${t.countryCode}` : ""), 50).map((g) => {
        const [brand, cc] = g.key.split("|");
        return { ...g, key: brand || "", countryCode: cc || "" };
      }),
      byMode: group(all, (t) => t.mode, 10),
      byDevice: group(all, (t) => t.device, 10),
      byServer: group(all, (t) => t.server, 30),
      facets: {
        countries: [...new Set(all.map((t) => t.countryCode).filter(Boolean))].sort(),
        devices: [...new Set(all.map((t) => t.device).filter(Boolean))].sort(),
      },
      total: filtered.length,
      page,
      pages: Math.max(1, Math.ceil(filtered.length / limit)),
      tests: pageItems,
    });
  } catch (err) {
    return fail(err);
  }
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" });

  const body = await readJson<{ ids?: unknown; all?: unknown; olderThanDays?: unknown }>(request);
  const db = adminDb();
  try {
    if (Array.isArray(body.ids)) {
      const ids = body.ids.filter((x): x is string => typeof x === "string" && !!x && !x.includes("/")).slice(0, 5000);
      const deleted = await deleteRefs(db, ids.map((id) => db.collection("tests").doc(id)));
      return ok({ deleted });
    }
    if (body.all === true) {
      return ok({ deleted: await deleteQuery(db, db.collection("tests")) });
    }
    const days = Number(body.olderThanDays);
    if (Number.isFinite(days) && days >= 1) {
      const cutoff = Timestamp.fromMillis(Date.now() - days * DAY);
      return ok({ deleted: await deleteQuery(db, db.collection("tests").where("ts", "<", cutoff)) });
    }
    return Response.json({ ok: false, error: "Provide ids, all:true or olderThanDays" }, { status: 400 });
  } catch (err) {
    return fail(err);
  }
}
