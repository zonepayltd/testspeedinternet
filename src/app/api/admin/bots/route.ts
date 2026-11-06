import { Timestamp } from "firebase-admin/firestore";
import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";
import { botDomain } from "@/lib/bots";
import { DAY, deleteQuery, fail, ms, ok, readJson, resolveRange } from "@/components/admin/analytics/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET    /api/admin/bots?range=today|7d|30d|90d [&tz]
//        → { total, byKind, bots: [...per bot], recent: [...latest hits], daily: [{ t, hits }] }
// DELETE /api/admin/bots  body { all: true } | { olderThanDays: N }
const CAP = 10_000;

const fileOf = (path: string) =>
  path === "/robots.txt" ? "robots" : path === "/sitemap.xml" || path.startsWith("/sitemaps/") ? "sitemap" : path === "/ads.txt" ? "adsTxt" : "";

type Bot = {
  name: string; kind: string; domain: string; hits: number; pages: number; lastSeen: number; lastPath: string;
  robotsAt: number; sitemapAt: number; adsTxtAt: number; countries: Record<string, number>;
};

export async function GET(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" });
  const { from, to, startOfDay } = resolveRange(new URL(request.url).searchParams, "7d");

  try {
    const snap = await adminDb()
      .collection("bots")
      .where("ts", ">=", Timestamp.fromMillis(from))
      .orderBy("ts", "desc")
      .limit(CAP)
      .get();

    const bots = new Map<string, Bot>();
    const byKind = new Map<string, number>();
    const daily = new Map<number, number>();
    const paths = new Map<string, number>();
    const recent: { id: string; name: string; kind: string; domain: string; path: string; ip: string; countryCode: string; ts: number }[] = [];

    for (const d of snap.docs) {
      const x = d.data();
      const ts = ms(x.ts);
      if (ts > to) continue;
      const name = String(x.name || "Unknown bot");
      const kind = String(x.kind || "other");
      const path = String(x.path || "/");
      const cc = String(x.countryCode || "");
      let b = bots.get(name);
      if (!b) {
        b = { name, kind, domain: botDomain(name), hits: 0, pages: 0, lastSeen: 0, lastPath: "", robotsAt: 0, sitemapAt: 0, adsTxtAt: 0, countries: {} };
        bots.set(name, b);
      }
      b.hits++;
      const f = fileOf(path);
      if (!f) b.pages++;
      else if (!b[`${f}At` as "robotsAt"]) b[`${f}At` as "robotsAt"] = ts;
      if (ts > b.lastSeen) {
        b.lastSeen = ts;
        b.lastPath = path;
      }
      if (cc) b.countries[cc] = (b.countries[cc] || 0) + 1;
      byKind.set(kind, (byKind.get(kind) || 0) + 1);
      const day = startOfDay(ts);
      daily.set(day, (daily.get(day) || 0) + 1);
      if (!f) paths.set(path, (paths.get(path) || 0) + 1);
      if (recent.length < 60) recent.push({ id: d.id, name, kind, domain: botDomain(name), path, ip: String(x.ip || ""), countryCode: cc, ts });
    }

    // Continuous day series (zeros included) for the chart.
    const series: { t: number; hits: number }[] = [];
    for (let t = startOfDay(Math.max(from, to - 90 * DAY)); t < to; t += DAY) series.push({ t, hits: daily.get(t) || 0 });

    return ok({
      total: snap.size,
      capped: snap.size >= CAP,
      byKind: [...byKind.entries()].sort((a, b) => b[1] - a[1]).map(([kind, hits]) => ({ kind, hits })),
      bots: [...bots.values()].sort((a, b) => b.hits - a.hits),
      topPaths: [...paths.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([path, hits]) => ({ path, hits })),
      recent,
      daily: series,
    });
  } catch (err) {
    return fail(err);
  }
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" });
  const body = await readJson<{ all?: unknown; olderThanDays?: unknown }>(request);
  const db = adminDb();
  try {
    if (body.all === true) return ok({ deleted: await deleteQuery(db, db.collection("bots")) });
    const days = Number(body.olderThanDays);
    if (Number.isFinite(days) && days > 0) {
      return ok({ deleted: await deleteQuery(db, db.collection("bots").where("ts", "<", Timestamp.fromMillis(Date.now() - days * DAY))) });
    }
    return Response.json({ ok: false, error: "Provide all:true or olderThanDays" }, { status: 400 });
  } catch (err) {
    return fail(err);
  }
}
