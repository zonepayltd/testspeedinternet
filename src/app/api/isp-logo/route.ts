import { KNOWN_ISP_DOMAINS } from "@/lib/isp";

// Serves an ISP's current logo: GET /api/isp-logo?d=iam.ma
// Sources, best first: Logo.dev (if a token is configured) -> the icons the
// provider's own website declares (apple-touch-icon / largest icon) -> Google's
// favicon service. Only domains from our ISP list are allowed (no open proxy).
export const runtime = "nodejs";

const TOKEN = process.env.NEXT_PUBLIC_LOGODEV_TOKEN || process.env.LOGODEV_TOKEN || "";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

type Img = { body: ArrayBuffer; type: string };
const cache = new Map<string, { img: Img | null; at: number }>();
const TTL = 24 * 3600 * 1000;

/** Check the file really is an image (PNG, JPEG, GIF, WebP, ICO or SVG). */
function looksLikeImage(b: Uint8Array): boolean {
  const hex = (n: number) => Array.from(b.slice(0, n), (x) => x.toString(16).padStart(2, "0")).join("");
  const head = hex(12);
  if (head.startsWith("89504e470d0a1a0a") || head.startsWith("ffd8ff") || head.startsWith("47494638") || head.startsWith("00000100")) return true;
  if (head.startsWith("52494646") && head.slice(16, 24) === "57454250") return true; // RIFF....WEBP
  const text = new TextDecoder().decode(b.slice(0, 400)).trimStart().toLowerCase();
  return text.startsWith("<svg") || (text.startsWith("<?xml") && text.includes("<svg"));
}

/** Official logo from the company's English Wikipedia page (only if the file is clearly a logo). */
async function wikipediaLogo(title: string): Promise<Img | null> {
  try {
    const api = `https://en.wikipedia.org/w/api.php?action=query&redirects=1&format=json&prop=pageimages&piprop=thumbnail|name&pithumbsize=256&titles=${encodeURIComponent(title)}`;
    const res = await fetch(api, { headers: { "User-Agent": "TestSpeedInternet/1.0 (https://www.testspeedinternet.com)" }, signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    const data = (await res.json()) as { query?: { pages?: Record<string, { pageimage?: string; thumbnail?: { source: string } }> } };
    const page = Object.values(data.query?.pages || {})[0];
    const file = page?.pageimage || "";
    if (!page?.thumbnail?.source || !/logo|brandmark|wordmark|\.svg$/i.test(file)) return null;
    return fetchImage(page.thumbnail.source, 200);
  } catch {
    return null;
  }
}

async function fetchImage(url: string, minBytes = 300): Promise<Img | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(6000), redirect: "follow" });
    if (!res.ok) return null;
    const type = (res.headers.get("content-type") || "").split(";")[0].trim();
    if (!type.startsWith("image/")) return null;
    const body = await res.arrayBuffer();
    if (body.byteLength < minBytes || body.byteLength > 2_000_000) return null;
    if (!looksLikeImage(new Uint8Array(body))) return null;
    return { body, type };
  } catch {
    return null;
  }
}

/** Icons declared in the site's HTML, best (largest / touch icon) first. */
async function siteIcons(domain: string): Promise<string[]> {
  for (const base of [`https://www.${domain}`, `https://${domain}`]) {
    try {
      const res = await fetch(base, { headers: { "User-Agent": UA, Accept: "text/html" }, signal: AbortSignal.timeout(6000), redirect: "follow" });
      if (!res.ok) continue;
      const html = (await res.text()).slice(0, 300_000);
      const found: { href: string; score: number }[] = [];
      for (const tag of html.match(/<link\b[^>]*>/gi) || []) {
        const rel = /rel=["']?([^"'>]+)/i.exec(tag)?.[1]?.toLowerCase() || "";
        if (!/icon/.test(rel) || /mask-icon/.test(rel)) continue;
        const href = /href=["']?([^"' >]+)/i.exec(tag)?.[1];
        if (!href) continue;
        const size = Number(/sizes=["']?(\d+)/i.exec(tag)?.[1] || 0);
        const isSvg = /\.svg(\?|$)/i.test(href) || /svg/i.test(tag);
        const score = (rel.includes("apple-touch-icon") ? 180 : 0) + size + (isSvg ? 120 : 0);
        found.push({ href: new URL(href, res.url).toString(), score });
      }
      found.push({ href: new URL("/apple-touch-icon.png", res.url).toString(), score: 1 });
      return found.sort((a, b) => b.score - a.score).map((f) => f.href);
    } catch {
      /* try the next base URL */
    }
  }
  return [];
}

async function resolve(domain: string, wiki: string): Promise<Img | null> {
  if (TOKEN) {
    const img = await fetchImage(`https://img.logo.dev/${domain}?token=${TOKEN}&size=128&format=png&retina=true`);
    if (img) return img;
  }
  // 1) the icon the provider's own site declares (current branding)
  for (const url of (await siteIcons(domain)).slice(0, 4)) {
    const img = await fetchImage(url, 1200);
    if (img) return img;
  }
  // 2) the official logo on Wikipedia
  const wikiImg = await wikipediaLogo(wiki);
  if (wikiImg) return wikiImg;
  // 3) small favicon as a last resort
  return fetchImage(`https://www.google.com/s2/favicons?sz=128&domain=${domain}`, 100);
}

export async function GET(req: Request) {
  const d = (new URL(req.url).searchParams.get("d") || "").toLowerCase().trim();
  const wiki = KNOWN_ISP_DOMAINS.get(d);
  if (!wiki) return new Response("Unknown provider", { status: 404 });

  let hit = cache.get(d);
  if (!hit || Date.now() - hit.at > TTL) {
    hit = { img: await resolve(d, wiki), at: Date.now() };
    cache.set(d, hit);
  }
  if (!hit.img) return new Response("No logo", { status: 404, headers: { "Cache-Control": "public, max-age=3600" } });

  return new Response(hit.img.body, {
    headers: {
      "Content-Type": hit.img.type,
      "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
