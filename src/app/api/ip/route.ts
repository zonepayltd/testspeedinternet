// Resolves the visitor's connection info (IP, ISP, country, city, geo).
// Robust like the big speed-test sites: reads the real client IP from edge
// headers and falls back across multiple geolocation providers that work
// server-side (IPv4 + IPv6), so detection keeps working on any network.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Geo = {
  ip: string;
  isp: string;
  org: string;
  as: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  zip: string;
  lat: number | null;
  lon: number | null;
  timezone: string;
};

function isPrivate(ip: string): boolean {
  if (!ip) return true;
  return (
    ip === "::1" ||
    ip === "localhost" ||
    ip.startsWith("127.") ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
    ip.startsWith("fc") ||
    ip.startsWith("fd")
  );
}

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for") || "";
  return (
    fwd.split(",")[0].trim() ||
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    ""
  );
}

const numify = (v: unknown): number | null => {
  const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) ? n : null;
};

async function getJson(url: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

// Provider 1 — geojs.io (HTTPS, no key, works server-side, has ISP/ASN).
async function fromGeoJs(ip: string): Promise<Geo | null> {
  const d = await getJson(ip ? `https://get.geojs.io/v1/ip/geo/${ip}.json` : "https://get.geojs.io/v1/ip/geo.json");
  if (!d || !d.ip) return null;
  return {
    ip: String(d.ip),
    isp: String(d.organization_name || d.organization || "Unknown provider"),
    org: String(d.organization_name || ""),
    as: d.asn ? `AS${d.asn}` : "",
    country: String(d.country || ""),
    countryCode: String(d.country_code || ""),
    region: String(d.region || ""),
    city: String(d.city || ""),
    zip: "",
    lat: numify(d.latitude),
    lon: numify(d.longitude),
    timezone: String(d.timezone || ""),
  };
}

// Provider 2 — ip-api.com (rich data; great from cloud hosts like Vercel).
async function fromIpApi(ip: string): Promise<Geo | null> {
  const d = await getJson(
    `http://ip-api.com/json/${ip}?fields=status,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as,query`
  );
  if (!d || d.status !== "success") return null;
  return {
    ip: String(d.query || ip),
    isp: String(d.isp || d.org || "Unknown provider"),
    org: String(d.org || ""),
    as: String(d.as || ""),
    country: String(d.country || ""),
    countryCode: String(d.countryCode || ""),
    region: String(d.regionName || ""),
    city: String(d.city || ""),
    zip: String(d.zip || ""),
    lat: numify(d.lat),
    lon: numify(d.lon),
    timezone: String(d.timezone || ""),
  };
}

// Provider 3 — freeipapi.com (last-resort fallback).
async function fromFreeIpApi(ip: string): Promise<Geo | null> {
  const d = await getJson(ip ? `https://freeipapi.com/api/json/${ip}` : "https://freeipapi.com/api/json");
  if (!d || !d.ipAddress) return null;
  return {
    ip: String(d.ipAddress),
    isp: String(d.isp || "Unknown provider"),
    org: "",
    as: String(d.asn || ""),
    country: String(d.countryName || ""),
    countryCode: String(d.countryCode || ""),
    region: String(d.regionName || ""),
    city: String(d.cityName || ""),
    zip: String(d.zipCode || ""),
    lat: numify(d.latitude),
    lon: numify(d.longitude),
    timezone: String(d.timeZone || ""),
  };
}

export async function GET(request: Request) {
  const raw = clientIp(request);
  const ip = isPrivate(raw) ? "" : raw;

  const geo =
    (await fromGeoJs(ip)) || (await fromIpApi(ip)) || (await fromFreeIpApi(ip));

  if (!geo) {
    return Response.json({ ok: false }, { headers: { "Cache-Control": "no-store" } });
  }
  return Response.json({ ok: true, ...geo }, { headers: { "Cache-Control": "no-store" } });
}
