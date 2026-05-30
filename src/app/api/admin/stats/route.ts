import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) {
    return Response.json({ ok: false, error: "Firebase not configured" }, { status: 200 });
  }

  const now = Date.now();
  const dayMs = 86_400_000;
  const since7d = Timestamp.fromMillis(now - 7 * dayMs);
  const startToday = new Date();
  startToday.setHours(0, 0, 0, 0);

  try {
    const db = adminDb();

    // Pull the last 7 days of visits (cap for cost) and aggregate in memory.
    const snap = await db
      .collection("visits")
      .where("ts", ">=", since7d)
      .orderBy("ts", "desc")
      .limit(3000)
      .get();

    type V = { visitorId: string; path: string; source: string; country: string; ts: number };
    const visits: V[] = snap.docs.map((d) => {
      const x = d.data();
      const ts: Timestamp | undefined = x.ts;
      return {
        visitorId: x.visitorId || "",
        path: x.path || "/",
        source: x.source || "Direct",
        country: x.country || "",
        ts: ts ? ts.toMillis() : 0,
      };
    });

    const liveUserSet = new Set<string>();
    const todayVisitorSet = new Set<string>();
    const sources: Record<string, number> = {};
    const pages: Record<string, number> = {};
    const countries: Record<string, number> = {};
    const perDay: Record<string, number> = {};
    let visitsToday = 0;
    let searchToday = 0;

    const liveCutoff = now - 5 * 60_000;
    const startTodayMs = startToday.getTime();
    const SEARCH = new Set(["Google", "Bing", "DuckDuckGo", "Yahoo", "Yandex"]);

    for (const v of visits) {
      if (v.ts >= liveCutoff) liveUserSet.add(v.visitorId);
      const src = v.source === "Internal" ? "Direct" : v.source;
      sources[src] = (sources[src] || 0) + 1;
      pages[v.path] = (pages[v.path] || 0) + 1;
      if (v.country) countries[v.country] = (countries[v.country] || 0) + 1;
      const dayKey = new Date(v.ts).toISOString().slice(0, 10);
      perDay[dayKey] = (perDay[dayKey] || 0) + 1;
      if (v.ts >= startTodayMs) {
        visitsToday++;
        todayVisitorSet.add(v.visitorId);
        if (SEARCH.has(src)) searchToday++;
      }
    }

    const topList = (obj: Record<string, number>, n = 6) =>
      Object.entries(obj)
        .sort((a, b) => b[1] - a[1])
        .slice(0, n)
        .map(([key, count]) => ({ key, count }));

    // 7-day series (oldest → newest)
    const series: { day: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const key = new Date(now - i * dayMs).toISOString().slice(0, 10);
      series.push({ day: key, count: perDay[key] || 0 });
    }

    const totalVisitors = (await db.collection("visitors").count().get()).data().count;

    return Response.json({
      ok: true,
      liveUsers: liveUserSet.size,
      visitsToday,
      visitorsToday: todayVisitorSet.size,
      searchToday,
      visits7d: visits.length,
      totalVisitors,
      sources: topList(sources),
      topPages: topList(pages),
      countries: topList(countries),
      series,
      recent: visits.slice(0, 15),
    });
  } catch (err) {
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to load stats" },
      { status: 200 }
    );
  }
}
