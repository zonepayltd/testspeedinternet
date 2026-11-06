import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";
import { parseUA } from "@/lib/ua";
import { sourceKind } from "@/lib/sources";
import { identifyBot } from "@/lib/bots";
import { csv, deleteQuery, deleteVisitorCascade, fail, iso, ms, ok, readJson } from "@/components/admin/analytics/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET    /api/admin/visitors?q&source&kind&country&device&page&limit [&format=csv]
//        → { visitors (page), total, pages, totalAll, facets }
//        Reads the most recent visitors (by lastSeen, capped) and filters in memory, so no composite indexes are needed.
// DELETE /api/admin/visitors   body { ids: string[] } (cascades to visits, tests, presence) | { all: true } (visitors + visits + presence)
const CAP = 5_000;

export async function GET(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured", visitors: [] });

  const sp = new URL(request.url).searchParams;
  const q = (sp.get("q") || "").trim().toLowerCase();
  const source = sp.get("source") || "";
  const country = (sp.get("country") || "").toUpperCase();
  const device = sp.get("device") || "";
  const kind = sp.get("kind") || ""; // search | direct | social | ai | referral
  const limit = Math.min(200, Math.max(5, Number(sp.get("limit")) || 25));
  const page = Math.max(1, Number(sp.get("page")) || 1);

  try {
    const db = adminDb();
    const [snap, totalAll, presence] = await Promise.all([
      db.collection("visitors").orderBy("lastSeen", "desc").limit(CAP).get(),
      db.collection("visitors").count().get().then((s) => s.data().count),
      db.collection("presence").where("lastSeen", ">=", new Date(Date.now() - 60_000)).select().get(),
    ]);
    const online = new Set(presence.docs.map((d) => d.id));

    // Bots are listed separately (Bots tab), never as visitors.
    const all = snap.docs.filter((d) => { const ua = d.get("ua"); return !ua || !identifyBot(ua); }).map((d) => {
      const x = d.data();
      const ua = x.ua || "";
      const src = x.source === "Internal" || !x.source ? "Direct" : x.source;
      return {
        id: d.id,
        visits: x.visits || 0,
        firstSeen: ms(x.firstSeen),
        lastSeen: ms(x.lastSeen),
        country: x.country || "",
        countryCode: (x.countryCode || "").toUpperCase(),
        city: x.city || "",
        ip: x.ip || "",
        source: src as string,
        kind: sourceKind(src),
        lastPath: x.lastPath || "/",
        online: online.has(d.id),
        ...parseUA(ua),
      };
    });

    const filtered = all.filter(
      (v) =>
        (!source || v.source === source) &&
        (!kind || v.kind === kind) &&
        (!country || v.countryCode === country) &&
        (!device || v.device === device) &&
        (!q || [v.id, v.ip, v.city, v.country, v.countryCode, v.source, v.lastPath].some((f) => f.toLowerCase().includes(q))),
    );

    if (sp.get("format") === "csv") {
      return csv(
        [
          ["visitorId", "firstSeen", "lastSeen", "visits", "source", "type", "country", "countryCode", "city", "ip", "lastPath", "device", "os", "browser"],
          ...filtered.map((v) => [v.id, iso(v.firstSeen), iso(v.lastSeen), v.visits, v.source, v.kind, v.country, v.countryCode, v.city, v.ip, v.lastPath, v.device, v.os, v.browser]),
        ],
        `visitors-${new Date().toISOString().slice(0, 10)}.csv`,
      );
    }

    const countBy = (key: (v: (typeof all)[number]) => string) => {
      const m = new Map<string, number>();
      for (const v of all) {
        const k = key(v);
        if (k) m.set(k, (m.get(k) || 0) + 1);
      }
      return [...m.entries()].sort((a, b) => b[1] - a[1]).map(([value, count]) => ({ value, count }));
    };

    return ok({
      visitors: filtered.slice((page - 1) * limit, page * limit),
      total: filtered.length,
      page,
      pages: Math.max(1, Math.ceil(filtered.length / limit)),
      totalAll,
      capped: all.length >= CAP,
      onlineNow: online.size,
      facets: {
        sources: countBy((v) => v.source),
        kinds: countBy((v) => v.kind),
        countries: countBy((v) => v.countryCode).map((c) => ({ ...c, name: all.find((v) => v.countryCode === c.value)?.country || c.value })),
        devices: countBy((v) => v.device),
      },
    });
  } catch (err) {
    return fail(err);
  }
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" });

  const body = await readJson<{ ids?: unknown; all?: unknown }>(request);
  const db = adminDb();
  try {
    if (Array.isArray(body.ids)) {
      const ids = body.ids.filter((x): x is string => typeof x === "string" && !!x && !x.includes("/")).slice(0, 500);
      let visits = 0;
      let tests = 0;
      for (const id of ids) {
        const r = await deleteVisitorCascade(db, id);
        visits += r.visits;
        tests += r.tests;
      }
      return ok({ deleted: { visitors: ids.length, visits, tests } });
    }
    if (body.all === true) {
      const visitors = await deleteQuery(db, db.collection("visitors"));
      const visits = await deleteQuery(db, db.collection("visits"));
      const presence = await deleteQuery(db, db.collection("presence"));
      return ok({ deleted: { visitors, visits, presence } });
    }
    return Response.json({ ok: false, error: "Provide ids or all:true" }, { status: 400 });
  } catch (err) {
    return fail(err);
  }
}
