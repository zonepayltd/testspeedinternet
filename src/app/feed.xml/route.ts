import { getPublishedPosts } from "@/lib/posts";
import { COMPANY } from "@/lib/company";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// RSS feed of blog articles (helps feed readers and search engines discover new posts).
export async function GET() {
  const posts = (await getPublishedPosts()).slice(0, 50);
  const site = COMPANY.siteUrl;
  const items = posts
    .map((p) => {
      const url = `${site}/blog/${p.slug}`;
      return `<item>
  <title>${esc(p.title)}</title>
  <link>${url}</link>
  <guid isPermaLink="true">${url}</guid>
  <pubDate>${new Date(p.createdAt || Date.now()).toUTCString()}</pubDate>
  <category>${esc(p.category)}</category>
  <description>${esc(p.description || p.excerpt)}</description>
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${esc(COMPANY.brand)} Blog</title>
  <link>${site}/blog</link>
  <atom:link href="${site}/feed.xml" rel="self" type="application/rss+xml"/>
  <description>Guides on internet speed, WiFi, ping and home networking.</description>
  <language>en</language>
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=1800" },
  });
}
