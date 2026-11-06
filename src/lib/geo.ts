// IP → country / city / provider, for admin analytics (online users, visits).
// Uses the host's edge headers when present (Vercel/Cloudflare), otherwise one
// lookup per IP (cached in memory for 12 h) via ip-api.com, then geojs.io.
import "server-only";

export type Geo = { countryCode: string; country: string; city: string; region: string; isp: string; lat: number | null; lon: number | null };
const num = (v: unknown) => { const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : NaN; return Number.isFinite(n) ? n : null; };

const g = globalThis as unknown as { __tsiGeoCache?: Map<string, { geo: Geo; at: number }> };
const cache = (g.__tsiGeoCache ??= new Map());
const TTL = 12 * 3600_000;

const isPrivate = (ip: string) =>
  !ip || ip === "::1" || ip.startsWith("127.") || ip.startsWith("10.") || ip.startsWith("192.168.") || /^172\.(1[6-9]|2\d|3[01])\./.test(ip) || /^f[cd]/i.test(ip) || ip.startsWith("::ffff:127.");

export function clientIp(req: Request): string {
  return (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || "";
}

async function json(url: string): Promise<Record<string, unknown> | null> {
  try {
    const r = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(3500) });
    return r.ok ? ((await r.json()) as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** Country/city for the request: edge headers first, then a cached IP lookup. */
export async function geoForRequest(req: Request): Promise<Geo | null> {
  const hcc = req.headers.get("cf-ipcountry") || req.headers.get("x-vercel-ip-country") || "";
  const hcity = decodeURIComponent(req.headers.get("x-vercel-ip-city") || "");
  const raw = clientIp(req);
  const ip = isPrivate(raw) ? "" : raw; // localhost → look up the server's public IP (useful in development)
  const key = ip || "self";

  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return { ...hit.geo, ...(hcc ? { countryCode: hcc } : {}), ...(hcity ? { city: hcity } : {}) };

  let geo: Geo | null = null;
  const a = await json(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,regionName,city,isp,lat,lon`);
  if (a && a.status === "success") {
    geo = { countryCode: String(a.countryCode || ""), country: String(a.country || ""), city: String(a.city || ""), region: String(a.regionName || ""), isp: String(a.isp || ""), lat: num(a.lat), lon: num(a.lon) };
  } else {
    const b = await json(ip ? `https://get.geojs.io/v1/ip/geo/${ip}.json` : "https://get.geojs.io/v1/ip/geo.json");
    if (b && b.country_code) geo = { countryCode: String(b.country_code), country: String(b.country || ""), city: String(b.city || ""), region: String(b.region || ""), isp: String(b.organization_name || ""), lat: num(b.latitude), lon: num(b.longitude) };
  }
  if (!geo && hcc) geo = { countryCode: hcc, country: "", city: hcity, region: "", isp: "", lat: num(req.headers.get("x-vercel-ip-latitude")), lon: num(req.headers.get("x-vercel-ip-longitude")) };
  if (geo) {
    if (cache.size > 5000) cache.clear();
    cache.set(key, { geo, at: Date.now() });
    if (hcc) geo = { ...geo, countryCode: hcc };
    if (hcity) geo = { ...geo, city: hcity };
  }
  return geo;
}
