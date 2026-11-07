import "server-only";
// XML sitemaps: an index at /sitemap.xml pointing to
//   /sitemaps/pages.xml        – main pages in every language (with hreflang)
//   /sitemaps/blog-<lang>.xml  – blog articles per language (with hreflang + cover image)
//   /sitemaps/providers.xml    – provider review pages (only providers with published reviews)
// People get a designed HTML sitemap at /sitemap instead (browsers are dropping XSLT styling).
import { getPublishedPosts, postLocales, type Post } from "@/lib/posts";
import { COMPANY } from "@/lib/company";
import { adminConfigured } from "@/lib/firebaseAdmin";
import { listProviders, type ProviderSummary } from "@/lib/reviews";
import { LOCALES, LOCALE_META, lp, type Locale } from "@/i18n/config";

const SITE = COMPANY.siteUrl;
type Freq = "daily" | "weekly" | "monthly" | "yearly";

export const STATIC_PAGES: { path: string; priority: number; freq: Freq }[] = [
  { path: "/", priority: 1, freq: "daily" },
  { path: "/what-is-my-ip", priority: 0.9, freq: "weekly" },
  { path: "/ip-risk-score", priority: 0.9, freq: "weekly" },
  { path: "/tools/download-speed-test", priority: 0.8, freq: "weekly" },
  { path: "/tools/upload-speed-test", priority: 0.8, freq: "weekly" },
  { path: "/tools/ping-test", priority: 0.8, freq: "weekly" },
  { path: "/tools/wifi-speed-test", priority: 0.8, freq: "weekly" },
  { path: "/guides/good-internet-speed", priority: 0.8, freq: "monthly" },
  { path: "/blog", priority: 0.8, freq: "daily" },
  { path: "/providers", priority: 0.7, freq: "daily" },
  { path: "/how-it-works", priority: 0.6, freq: "monthly" },
  { path: "/faq", priority: 0.6, freq: "monthly" },
  { path: "/about", priority: 0.5, freq: "yearly" },
  { path: "/editorial-policy", priority: 0.4, freq: "yearly" },
  { path: "/contact", priority: 0.4, freq: "yearly" },
  { path: "/privacy", priority: 0.3, freq: "yearly" },
  { path: "/cookies", priority: 0.3, freq: "yearly" },
  { path: "/terms", priority: 0.3, freq: "yearly" },
  { path: "/dmca", priority: 0.3, freq: "yearly" },
  { path: "/sitemap", priority: 0.3, freq: "weekly" },
];

// When the static pages last changed meaningfully (update when you redesign/rewrite them).
const PAGES_UPDATED = "2026-11-06";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
const url = (l: Locale, path: string) => `${SITE}${lp(l, path)}`;
const day = (ms: number) => new Date(ms).toISOString().slice(0, 10);

function alternates(path: string, available: readonly Locale[]): string {
  const links = available.map((l) => `    <xhtml:link rel="alternate" hreflang="${LOCALE_META[l].htmlLang}" href="${esc(url(l, path))}"/>`);
  if (available.includes("en")) links.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(url("en", path))}"/>`);
  return links.join("\n");
}

const HEAD = `<?xml version="1.0" encoding="UTF-8"?>\n`;

export function xmlResponse(body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}

/** Only list cover images hosted on our own site (external images can't be verified by us). */
function ownImage(p: Post): string | null {
  if (!p.coverImage) return null;
  const abs = p.coverImage.startsWith("http") ? p.coverImage : `${SITE}${p.coverImage}`;
  return abs.startsWith(SITE) ? abs : null;
}

export async function sitemapIndex(): Promise<string> {
  const files: { loc: string; lastmod: string }[] = [{ loc: `${SITE}/sitemaps/pages.xml`, lastmod: PAGES_UPDATED }];
  for (const l of LOCALES) {
    const posts = await getPublishedPosts(l).catch(() => [] as Post[]);
    if (!posts.length) continue;
    const newest = Math.max(...posts.map((p) => p.updatedAt || p.createdAt || 0));
    files.push({ loc: `${SITE}/sitemaps/blog-${l}.xml`, lastmod: newest ? day(newest) : PAGES_UPDATED });
  }
  const providers = await reviewedProviders();
  if (providers.length) {
    const newest = Math.max(...providers.map((p) => p.lastReviewAt || 0));
    files.push({ loc: `${SITE}/sitemaps/providers.xml`, lastmod: newest ? day(newest) : PAGES_UPDATED });
  }
  return `${HEAD}<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${files.map((f) => `  <sitemap>\n    <loc>${esc(f.loc)}</loc>\n    <lastmod>${f.lastmod}</lastmod>\n  </sitemap>`).join("\n")}
</sitemapindex>
`;
}

export function pagesSitemap(): string {
  const items: string[] = [];
  for (const s of STATIC_PAGES) {
    for (const l of LOCALES) {
      items.push(`  <url>
    <loc>${esc(url(l, s.path))}</loc>
    <lastmod>${PAGES_UPDATED}</lastmod>
    <changefreq>${s.freq}</changefreq>
    <priority>${(l === "en" ? s.priority : Math.max(0.1, s.priority - 0.1)).toFixed(1)}</priority>
${alternates(s.path, LOCALES)}
  </url>`);
    }
  }
  return `${HEAD}<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${items.join("\n")}
</urlset>
`;
}

export async function blogSitemap(locale: Locale): Promise<string | null> {
  const posts = await getPublishedPosts(locale).catch(() => [] as Post[]);
  if (!posts.length) return null;
  const items = posts.map((p) => {
    const path = `/blog/${p.slug}`;
    const available = p.source === "admin" ? (["en"] as Locale[]) : postLocales(p.slug);
    const img = ownImage(p);
    return `  <url>
    <loc>${esc(url(locale, path))}</loc>
    <lastmod>${day(p.updatedAt || p.createdAt || Date.now())}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${locale === "en" ? "0.7" : "0.6"}</priority>
${alternates(path, available)}${img ? `\n    <image:image>\n      <image:loc>${esc(img)}</image:loc>\n      <image:title>${esc(p.title)}</image:title>\n    </image:image>` : ""}
  </url>`;
  });
  return `${HEAD}<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${items.join("\n")}
</urlset>
`;
}

async function reviewedProviders(): Promise<ProviderSummary[]> {
  if (!adminConfigured) return [];
  return (await listProviders(1000).catch(() => [] as ProviderSummary[])).filter((p) => p.count >= 1);
}

/** Provider review pages in every language (with hreflang). Null when no provider has reviews yet. */
export async function providersSitemap(): Promise<string | null> {
  const providers = await reviewedProviders();
  if (!providers.length) return null;
  const items: string[] = [];
  for (const p of providers) {
    const path = `/providers/${p.slug}`;
    const lastmod = p.lastReviewAt ? day(p.lastReviewAt) : PAGES_UPDATED;
    for (const l of LOCALES) {
      items.push(`  <url>
    <loc>${esc(url(l, path))}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${l === "en" ? "0.6" : "0.5"}</priority>
${alternates(path, LOCALES)}
  </url>`);
    }
  }
  return `${HEAD}<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${items.join("\n")}
</urlset>
`;
}
