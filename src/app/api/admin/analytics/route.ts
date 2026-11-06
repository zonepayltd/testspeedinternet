import { sourceKind } from "@/lib/sources";
import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";
import { parseUA, SEARCH_ENGINES } from "@/lib/ua";
import { csv, DAY, fail, iso, ms, resolveRange, splitLang } from "@/components/admin/analytics/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/analytics?range=today|7d|30d|90d  (or &from=YYYY-MM-DD&to=YYYY-MM-DD)  [&tz=-60] [&format=csv]
// Aggregates page views (`visits`) in memory. Capped so a single request stays cheap.
const CAP = 25_000;
const ENGINES = new Set<string>(SEARCH_ENGINES);



const normSource = (s: string) => (!s || s === "Internal" ? "Direct" : s);
const hostOf = (ref: string) => {
  try {
    return new URL(ref).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

function inc(map: Map<string, number>, k: string, n = 1) {
  map.set(k, (map.get(k) || 0) + n);
}
function addSet(map: Map<string, Set<string>>, k: string, v: string) {
  let s = map.get(k);
  if (!s) map.set(k, (s = new Set()));
  s.add(v);
}
const pct = (cur: number, prev: number) => (prev > 0 ? ((cur - prev) / prev) * 100 : cur > 0 ? null : 0);

async function fetchVisits(from: number, to: number, fields: string[]) {
  const snap = await adminDb()
    .collection("visits")
    .where("ts", ">=", Timestamp.fromMillis(from))
    .where("ts", "<", Timestamp.fromMillis(to))
    .orderBy("ts", "desc")
    .select(...fields)
    .limit(CAP)
    .get();
  return snap.docs.map((d) => {
    const x = d.data();
    return {
      visitorId: x.visitorId || d.id,
      sessionId: x.sessionId || x.visitorId || d.id,
      path: x.path || "/",
      referrer: x.referrer || "",
      source: normSource(x.source || ""),
      countryCode: (x.countryCode || "").toUpperCase(),
      country: x.country || "",
      city: x.city || "",
      ua: x.ua || "",
      ts: ms(x.ts),
      ip: x.ip || "",
      screen: x.screen || "",
    };
  });
}

export async function GET(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" });

  const sp = new URL(request.url).searchParams;
  const { from, to, tz, range, startOfDay } = resolveRange(sp, "30d");
  const span = to - from;

  try {
    if (sp.get("format") === "csv") {
      const rows = await fetchVisits(from, to, ["visitorId", "sessionId", "path", "referrer", "source", "country", "countryCode", "city", "ip", "ua", "screen", "ts"]);
      return csv(
        [
          ["time", "path", "source", "referrer", "country", "countryCode", "city", "ip", "device", "os", "browser", "screen", "visitorId", "sessionId"],
          ...rows.map((v) => {
            const u = parseUA(v.ua);
            return [iso(v.ts), v.path, v.source, v.referrer, v.country, v.countryCode, v.city, v.ip, u.device, u.os, u.browser, v.screen, v.visitorId, v.sessionId];
          }),
        ],
        `page-views-${new Date(from).toISOString().slice(0, 10)}_${new Date(to).toISOString().slice(0, 10)}.csv`,
      );
    }

    const db = adminDb();
    const fields = ["visitorId", "sessionId", "path", "referrer", "source", "country", "countryCode", "city", "ua", "ts"];
    const [visits, prevVisits, newCount] = await Promise.all([
      fetchVisits(from, to, fields),
      from > 0 ? fetchVisits(Math.max(0, from - span), from, ["visitorId", "sessionId", "source", "ts"]) : Promise.resolve([] as Awaited<ReturnType<typeof fetchVisits>>),
      db
        .collection("visitors")
        .where("firstSeen", ">=", Timestamp.fromMillis(from))
        .where("firstSeen", "<", Timestamp.fromMillis(to))
        .count()
        .get()
        .then((s) => s.data().count)
        .catch(() => 0),
    ]);

    // ---------- buckets (hourly for ≤ 2 days, otherwise daily) ----------
    const hourly = span <= 2 * DAY;
    const step = hourly ? 3_600_000 : DAY;
    const effFrom = from || (visits.length ? startOfDay(visits[visits.length - 1].ts) : startOfDay(Date.now()));
    const first = hourly ? effFrom - (effFrom % 3_600_000) : startOfDay(effFrom);
    const nb = Math.max(1, Math.min(400, Math.ceil((to - first) / step)));
    const bucketOf = (t: number) => Math.min(nb - 1, Math.max(0, Math.floor((t - first) / step)));
    const series = Array.from({ length: nb }, (_, i) => ({ t: first + i * step, visitors: new Set<string>(), sessions: new Set<string>(), pageviews: 0 }));

    // ---------- aggregates ----------
    const visitorSet = new Set<string>();
    const sessions = new Map<string, { n: number; first: number; last: number; entry: string }>();
    const srcVisits = new Map<string, number>();
    const srcVisitors = new Map<string, Set<string>>();
    const engineSeries = new Map<string, number[]>();
    const refHosts = new Map<string, number>();
    const refHostSrc = new Map<string, string>();
    const pages = new Map<string, number>();
    const pageVisitors = new Map<string, Set<string>>();
    const pagesGrouped = new Map<string, number>();
    const pagesGroupedVisitors = new Map<string, Set<string>>();
    const pagesGroupedLangs = new Map<string, Set<string>>();
    const langs = new Map<string, number>();
    const langVisitors = new Map<string, Set<string>>();
    const countries = new Map<string, number>();
    const countryVisitors = new Map<string, Set<string>>();
    const countryNames = new Map<string, string>();
    const cities = new Map<string, number>();
    const visitorUA = new Map<string, string>();
    const heat = Array.from({ length: 7 }, () => Array(24).fill(0) as number[]);
    const hours = Array(24).fill(0) as number[];

    for (const v of visits) {
      visitorSet.add(v.visitorId);
      const b = series[bucketOf(v.ts)];
      b.pageviews++;
      b.visitors.add(v.visitorId);
      b.sessions.add(v.sessionId);

      const s = sessions.get(v.sessionId);
      if (!s) sessions.set(v.sessionId, { n: 1, first: v.ts, last: v.ts, entry: v.path });
      else {
        s.n++;
        if (v.ts < s.first) {
          s.first = v.ts;
          s.entry = v.path;
        }
        if (v.ts > s.last) s.last = v.ts;
      }

      inc(srcVisits, v.source);
      addSet(srcVisitors, v.source, v.visitorId);
      if (ENGINES.has(v.source)) {
        let arr = engineSeries.get(v.source);
        if (!arr) engineSeries.set(v.source, (arr = Array(nb).fill(0)));
        arr[bucketOf(v.ts)]++;
      }
      const host = hostOf(v.referrer);
      if (host && v.source !== "Direct") {
        inc(refHosts, host);
        refHostSrc.set(host, v.source);
      }

      inc(pages, v.path);
      addSet(pageVisitors, v.path, v.visitorId);
      const { lang, path } = splitLang(v.path);
      inc(pagesGrouped, path);
      addSet(pagesGroupedVisitors, path, v.visitorId);
      addSet(pagesGroupedLangs, path, lang);
      inc(langs, lang);
      addSet(langVisitors, lang, v.visitorId);

      const cc = v.countryCode || "??";
      inc(countries, cc);
      addSet(countryVisitors, cc, v.visitorId);
      if (v.country) countryNames.set(cc, v.country);
      if (v.city) inc(cities, `${cc}|${v.city}`);
      if (!visitorUA.has(v.visitorId)) visitorUA.set(v.visitorId, v.ua);

      const local = new Date(v.ts - tz * 60_000);
      const dow = (local.getUTCDay() + 6) % 7; // Mon = 0
      heat[dow][local.getUTCHours()]++;
      hours[local.getUTCHours()]++;
    }

    // previous period
    const prevVisitorSet = new Set<string>();
    const prevSessions = new Set<string>();
    const prevSrc = new Map<string, number>();
    for (const v of prevVisits) {
      prevVisitorSet.add(v.visitorId);
      prevSessions.add(v.sessionId);
      inc(prevSrc, v.source);
    }

    const devices = new Map<string, number>();
    const oses = new Map<string, number>();
    const browsers = new Map<string, number>();
    for (const ua of visitorUA.values()) {
      const u = parseUA(ua);
      inc(devices, u.device);
      inc(oses, u.os);
      inc(browsers, u.browser);
    }

    const top = (m: Map<string, number>, n = 50) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
    const sessionList = [...sessions.values()];
    const bounces = sessionList.filter((s) => s.n === 1).length;
    const multi = sessionList.filter((s) => s.n > 1);
    const entries = new Map<string, number>();
    sessionList.forEach((s) => inc(entries, s.entry));

    const pageviews = visits.length;
    const searchVisits = [...srcVisits.entries()].filter(([k]) => ENGINES.has(k)).reduce((a, [, n]) => a + n, 0);
    const prevSearch = [...prevSrc.entries()].filter(([k]) => ENGINES.has(k)).reduce((a, [, n]) => a + n, 0);

    // Always show the main engines, plus any others that sent traffic.
    const engineNames = new Set<string>(["Google", "Bing", "DuckDuckGo", "Yahoo", "Yandex"]);
    for (const k of srcVisits.keys()) if (ENGINES.has(k)) engineNames.add(k);
    for (const k of prevSrc.keys()) if (ENGINES.has(k)) engineNames.add(k);
    const searchEngines = [...engineNames]
      .map((name) => {
        const cur = srcVisits.get(name) || 0;
        const prev = prevSrc.get(name) || 0;
        return {
          name,
          visits: cur,
          visitors: srcVisitors.get(name)?.size || 0,
          share: searchVisits ? (cur / searchVisits) * 100 : 0,
          shareOfAll: pageviews ? (cur / pageviews) * 100 : 0,
          prev,
          delta: pct(cur, prev),
          spark: engineSeries.get(name) || Array(nb).fill(0),
        };
      })
      .sort((a, b) => b.visits - a.visits || a.name.localeCompare(b.name));

    const kinds = new Map<string, number>();
    for (const [k, n] of srcVisits) inc(kinds, sourceKind(k), n);

    const uniq = visitorSet.size;
    // Returning = first seen before this range, or came back in more than one session.
    const visitorSessions = new Map<string, Set<string>>();
    for (const v of visits) addSet(visitorSessions, v.visitorId, v.sessionId);
    let multiSession = 0;
    for (const s of visitorSessions.values()) if (s.size > 1) multiSession++;
    const returning = Math.min(uniq, Math.max(uniq - Math.min(newCount, uniq), multiSession));
    const newVisitors = uniq - returning;

    return Response.json({
      ok: true,
      range,
      from,
      to,
      bucket: hourly ? "hour" : "day",
      capped: visits.length >= CAP,
      totals: {
        pageviews,
        visitors: uniq,
        sessions: sessions.size,
        bounceRate: sessions.size ? (bounces / sessions.size) * 100 : 0,
        viewsPerSession: sessions.size ? pageviews / sessions.size : 0,
        avgSessionSec: multi.length ? multi.reduce((a, s) => a + Math.min(s.last - s.first, 1_800_000), 0) / multi.length / 1000 : 0,
        searchVisits,
        searchShare: pageviews ? (searchVisits / pageviews) * 100 : 0,
      },
      prev: {
        pageviews: prevVisits.length,
        visitors: prevVisitorSet.size,
        sessions: prevSessions.size,
        searchVisits: prevSearch,
      },
      series: series.map((b) => ({ t: b.t, pageviews: b.pageviews, visitors: b.visitors.size, sessions: b.sessions.size })),
      searchEngines,
      sourceKinds: top(kinds).map(([kind, visits]) => ({ kind, visits })),
      sources: top(srcVisits).map(([name, n]) => ({ name, kind: sourceKind(name), visits: n, visitors: srcVisitors.get(name)?.size || 0, prev: prevSrc.get(name) || 0, delta: pct(n, prevSrc.get(name) || 0) })),
      referrers: top(refHosts).map(([host, visits]) => ({ host, visits, source: refHostSrc.get(host) || host })),
      pages: top(pages).map(([path, visits]) => ({ path, lang: splitLang(path).lang, base: splitLang(path).path, visits, visitors: pageVisitors.get(path)?.size || 0 })),
      pagesGrouped: top(pagesGrouped).map(([path, visits]) => ({ path, visits, visitors: pagesGroupedVisitors.get(path)?.size || 0, langs: [...(pagesGroupedLangs.get(path) || [])].sort() })),
      entryPages: top(entries).map(([path, visits]) => ({ path, lang: splitLang(path).lang, base: splitLang(path).path, visits })),
      countries: top(countries, 100).map(([code, visits]) => ({ code: code === "??" ? "" : code, name: countryNames.get(code) || (code === "??" ? "Unknown" : code), visits, visitors: countryVisitors.get(code)?.size || 0 })),
      cities: top(cities).map(([k, visits]) => {
        const [code, city] = k.split("|");
        return { code: code === "??" ? "" : code, city, visits };
      }),
      languages: top(langs).map(([lang, visits]) => ({ lang, visits, visitors: langVisitors.get(lang)?.size || 0 })),
      devices: top(devices).map(([name, visitors]) => ({ name, visitors })),
      os: top(oses).map(([name, visitors]) => ({ name, visitors })),
      browsers: top(browsers).map(([name, visitors]) => ({ name, visitors })),
      hours,
      heatmap: heat,
      newVsReturning: { new: newVisitors, returning },
    });
  } catch (err) {
    return fail(err);
  }
}
