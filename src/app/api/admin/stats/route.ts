import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { Timestamp, type QueryDocumentSnapshot } from "firebase-admin/firestore";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";
import { parseUA, SEARCH_ENGINES } from "@/lib/ua";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/stats?range=today|7d|30d|90d&tz=<Date#getTimezoneOffset()>
 *
 * Everything the Overview dashboard needs in one call. The current period is
 * [start, now]; the previous period is the same window shifted back by the
 * range length (e.g. "today so far" vs "yesterday up to the same time").
 * Visits/tests are read with range queries (field-masked, capped) and
 * aggregated in memory.
 */

const DAY = 86_400_000;
const HOUR = 3_600_000;
const RANGES = { today: 1, "7d": 7, "30d": 30, "90d": 90 } as const;
type Range = keyof typeof RANGES;
const VISIT_CAP = 20_000;
const TEST_CAP = 10_000;
const SE = new Set<string>(SEARCH_ENGINES);

const ms = (t?: Timestamp) => (t && typeof t.toMillis === "function" ? t.toMillis() : 0);
const pct = (a: number, b: number) => (b > 0 ? ((a - b) / b) * 100 : a > 0 ? 100 : 0);
const inc = (m: Map<string, number>, k: string, n = 1) => m.set(k, (m.get(k) || 0) + n);
const top = (m: Map<string, number>, n: number) =>
  [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([name, count]) => ({ name, count }));
const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);

export async function GET(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" });

  const url = new URL(request.url);
  const rawRange = url.searchParams.get("range") || "7d";
  const range: Range = rawRange in RANGES ? (rawRange as Range) : "7d";
  const days = RANGES[range];
  const tz = Math.max(-840, Math.min(840, Number(url.searchParams.get("tz")) || 0)); // minutes, UTC − local

  const now = Date.now();
  const off = tz * 60_000;
  const todayStart = Math.floor((now - off) / DAY) * DAY + off; // local midnight in the viewer's timezone
  const start = todayStart - (days - 1) * DAY;
  const span = days * DAY;
  const prevStart = start - span;
  const prevEnd = now - span;
  const hourly = range === "today";
  const bucketMs = hourly ? HOUR : DAY;

  try {
    const db = adminDb();
    const ts = (n: number) => Timestamp.fromMillis(n);
    const visitsQ = (a: number, b: number) =>
      db.collection("visits").where("ts", ">=", ts(a)).where("ts", "<=", ts(b)).orderBy("ts", "desc");
    const testsQ = (a: number, b: number) =>
      db.collection("tests").where("ts", ">=", ts(a)).where("ts", "<=", ts(b)).orderBy("ts", "desc");

    const [vSnap, pvSnap, tSnap, ptSnap, unreadAgg, msgSnap, presSnap, recentTestSnap] = await Promise.all([
      visitsQ(start, now).select("visitorId", "path", "source", "country", "countryCode", "ua", "ts").limit(VISIT_CAP).get(),
      visitsQ(prevStart, prevEnd).select("visitorId", "source").limit(VISIT_CAP).get(),
      testsQ(start, now).select("status", "download", "upload", "ping", "jitter", "ts").limit(TEST_CAP).get(),
      testsQ(prevStart, prevEnd).select("status", "download", "upload", "ping").limit(TEST_CAP).get(),
      db.collection("messages").where("read", "==", false).count().get().catch(() => null),
      db.collection("messages").orderBy("ts", "desc").limit(5).get().catch(() => null),
      db.collection("presence").where("lastSeen", ">=", ts(now - 60_000)).orderBy("lastSeen", "desc").limit(200).get().catch(() => null),
      db.collection("tests").orderBy("ts", "desc").limit(8).get().catch(() => null),
    ]);

    /* ---------------- visits (current period) ---------------- */
    const nBuckets = hourly ? 24 : days;
    const buckets = Array.from({ length: nBuckets }, (_, i) => ({
      t: start + i * bucketMs,
      pageViews: 0,
      started: 0,
      completed: 0,
      v: new Set<string>(),
    }));
    const bucketOf = (t: number) => Math.min(nBuckets - 1, Math.max(0, Math.floor((t - start) / bucketMs)));

    const visitorSet = new Set<string>();
    const sources = new Map<string, number>();
    const pages = new Map<string, number>();
    const countryVisitors = new Map<string, Set<string>>();
    const countryNames = new Map<string, string>();
    const devices = new Map<string, number>();
    const browsers = new Map<string, number>();
    const oses = new Map<string, number>();
    let searchVisits = 0;

    for (const d of vSnap.docs) {
      const x = d.data();
      const vid = String(x.visitorId || d.id);
      const b = buckets[bucketOf(ms(x.ts))];
      b.pageViews++;
      b.v.add(vid);
      inc(pages, String(x.path || "/"));
      const src = String(x.source || "Direct");
      if (src !== "Internal") inc(sources, src); // landings only
      if (SE.has(src)) searchVisits++;
      const cc = String(x.countryCode || "").toUpperCase();
      if (cc) {
        if (!countryVisitors.has(cc)) countryVisitors.set(cc, new Set());
        countryVisitors.get(cc)!.add(vid);
        if (x.country) countryNames.set(cc, String(x.country));
      }
      if (!visitorSet.has(vid)) {
        // devices / browsers / OS counted once per visitor
        const p = parseUA(String(x.ua || ""));
        inc(devices, p.device);
        inc(browsers, p.browser);
        inc(oses, p.os);
      }
      visitorSet.add(vid);
    }

    /* ---------------- visits (previous period) ---------------- */
    const prevVisitors = new Set<string>();
    let prevSearch = 0;
    for (const d of pvSnap.docs) {
      const x = d.data();
      prevVisitors.add(String(x.visitorId || d.id));
      if (SE.has(String(x.source || ""))) prevSearch++;
    }

    /* ---------------- tests ---------------- */
    const testAgg = (docs: QueryDocumentSnapshot[], withSeries: boolean) => {
      let started = 0, completed = 0, errors = 0, cancelled = 0;
      const dl: number[] = [], ul: number[] = [], pg: number[] = [], jt: number[] = [];
      for (const d of docs) {
        const x = d.data();
        started++;
        const st = String(x.status || "started");
        if (st === "completed") {
          completed++;
          const a = num(x.download), b = num(x.upload), c = num(x.ping), j = num(x.jitter);
          if (a != null) dl.push(a);
          if (b != null) ul.push(b);
          if (c != null) pg.push(c);
          if (j != null) jt.push(j);
        } else if (st === "error") errors++;
        else if (st === "cancelled") cancelled++;
        if (withSeries) {
          const s = buckets[bucketOf(ms(x.ts))];
          s.started++;
          if (st === "completed") s.completed++;
        }
      }
      return {
        started,
        completed,
        errors,
        cancelled,
        completionRate: started ? (completed / started) * 100 : null,
        download: avg(dl),
        upload: avg(ul),
        ping: avg(pg),
        jitter: avg(jt),
      };
    };
    const tests = testAgg(tSnap.docs, true);
    const prevTests = testAgg(ptSnap.docs, false);

    /* ---------------- assemble ---------------- */
    const totals = {
      visitors: visitorSet.size,
      pageViews: vSnap.size,
      searchVisits,
      testsStarted: tests.started,
      testsCompleted: tests.completed,
      completionRate: tests.completionRate,
    };
    const prev = {
      visitors: prevVisitors.size,
      pageViews: pvSnap.size,
      searchVisits: prevSearch,
      testsStarted: prevTests.started,
      testsCompleted: prevTests.completed,
      completionRate: prevTests.completionRate,
    };
    const change = {
      visitors: pct(totals.visitors, prev.visitors),
      pageViews: pct(totals.pageViews, prev.pageViews),
      searchVisits: pct(totals.searchVisits, prev.searchVisits),
      testsStarted: pct(totals.testsStarted, prev.testsStarted),
      testsCompleted: pct(totals.testsCompleted, prev.testsCompleted),
    };

    const presence = (presSnap?.docs || []).map((d) => {
      const x = d.data();
      return {
        id: d.id,
        lastSeen: ms(x.lastSeen),
        path: String(x.path || "/"),
        locale: String(x.locale || ""),
        device: String(x.device || "desktop"),
        os: String(x.os || ""),
        browser: String(x.browser || ""),
        countryCode: String(x.countryCode || ""),
        city: String(x.city || ""),
        country: String(x.country || ""),
        region: String(x.region || ""),
        isp: String(x.isp || ""),
        lat: typeof x.lat === "number" ? x.lat : null,
        lon: typeof x.lon === "number" ? x.lon : null,
      };
    });

    const recentTests = (recentTestSnap?.docs || []).map((d) => {
      const x = d.data();
      return {
        id: d.id,
        status: String(x.status || "started"),
        mode: String(x.mode || "full"),
        ts: ms(x.ts),
        countryCode: String(x.countryCode || ""),
        city: String(x.city || ""),
        isp: String(x.ispBrand || x.isp || ""),
        device: String(x.device || ""),
        download: num(x.download),
        upload: num(x.upload),
        ping: num(x.ping),
      };
    });

    const recentMessages = (msgSnap?.docs || []).map((d) => {
      const x = d.data();
      return {
        id: d.id,
        name: String(x.name || ""),
        email: String(x.email || ""),
        subject: String(x.subject || ""),
        message: String(x.message || "").slice(0, 160),
        read: x.read === true,
        ts: ms(x.ts),
      };
    });

    return Response.json({
      ok: true,
      range,
      now,
      start,
      prevStart,
      prevEnd,
      bucket: hourly ? "hour" : "day",
      truncated: vSnap.size >= VISIT_CAP || tSnap.size >= TEST_CAP,
      totals,
      prev,
      change,
      series: buckets.map((b) => ({ t: b.t, pageViews: b.pageViews, visitors: b.v.size, started: b.started, completed: b.completed })),
      sources: top(sources, 12).map((s) => ({ ...s, search: SE.has(s.name) })),
      searchEngines: SEARCH_ENGINES.map((name) => ({ name, count: sources.get(name) || 0 }))
        .filter((x) => x.count > 0)
        .sort((a, b) => b.count - a.count),
      pages: top(pages, 10),
      countries: [...countryVisitors.entries()]
        .map(([cc, set]) => ({ cc, name: countryNames.get(cc) || cc, count: set.size }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      devices: top(devices, 4),
      browsers: top(browsers, 6),
      os: top(oses, 6),
      tests: { ...tests, prev: { download: prevTests.download, upload: prevTests.upload, ping: prevTests.ping } },
      unread: unreadAgg ? unreadAgg.data().count : 0,
      recentMessages,
      recentTests,
      online: { count: presence.length, list: presence.slice(0, 12) },
    });
  } catch (err) {
    return Response.json({ ok: false, error: err instanceof Error ? err.message : "Failed to load stats" });
  }
}
