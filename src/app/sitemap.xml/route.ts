import { sitemapIndex, xmlResponse } from "@/lib/sitemap";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Sitemap index (what robots.txt and Search Console point to).
export async function GET() {
  return xmlResponse(await sitemapIndex());
}
