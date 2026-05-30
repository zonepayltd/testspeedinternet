// Resolves an IP "reputation" report: is it a proxy / VPN / Tor, what kind of
// connection (residential, data center…) and a 0-100 risk score.
// Uses proxycheck.io (works without a key; set PROXYCHECK_API_KEY to raise limits).
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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

async function publicIp(): Promise<string> {
  // Try several providers so it works on any network (some block ip-api).
  const sources: [string, (d: Record<string, unknown>) => unknown][] = [
    ["https://get.geojs.io/v1/ip.json", (d) => d.ip],
    ["https://freeipapi.com/api/json", (d) => d.ipAddress],
    ["http://ip-api.com/json/?fields=query", (d) => d.query],
  ];
  for (const [url, pick] of sources) {
    try {
      const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(4000) });
      if (!res.ok) continue;
      const data = await res.json();
      const ip = pick(data);
      if (typeof ip === "string" && ip) return ip;
    } catch {
      /* next provider */
    }
  }
  return "";
}

export async function GET(request: Request) {
  const fwd = request.headers.get("x-forwarded-for") ?? "";
  let ip =
    (fwd.split(",")[0] ||
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-real-ip") ||
      "").trim();

  // On localhost there is no public client IP in the headers — resolve ours.
  if (isPrivate(ip)) ip = await publicIp();
  if (!ip) {
    return Response.json({ ok: false }, { headers: { "Cache-Control": "no-store" } });
  }

  const key = process.env.PROXYCHECK_API_KEY ?? "";
  const keyParam = key ? `&key=${key}` : "";

  try {
    const res = await fetch(
      `https://proxycheck.io/v2/${ip}?vpn=1&risk=1&asn=1${keyParam}`,
      { cache: "no-store", signal: AbortSignal.timeout(5000) }
    );
    const data = await res.json();

    if (data?.status !== "ok") {
      return Response.json({ ok: false }, { headers: { "Cache-Control": "no-store" } });
    }

    const rec = data[ip] ?? {};
    const type: string = rec.type ?? "Unknown";
    const isProxy = rec.proxy === "yes";
    const risk = typeof rec.risk === "number" ? rec.risk : null;
    const t = type.toLowerCase();

    return Response.json(
      {
        ok: true,
        ip,
        proxy: isProxy,
        vpn: t.includes("vpn") || isProxy,
        tor: t.includes("tor"),
        type, // Residential, VPN, TOR, Data Center, Business, etc.
        risk,
        provider: rec.provider ?? rec.organisation ?? "",
        country: rec.country ?? "",
        countryCode: rec.isocode ?? "",
        city: rec.city ?? "",
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return Response.json({ ok: false }, { headers: { "Cache-Control": "no-store" } });
  }
}
