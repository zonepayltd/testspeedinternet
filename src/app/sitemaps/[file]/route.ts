import { blogSitemap, pagesSitemap, providersSitemap, xmlResponse } from "@/lib/sitemap";
import { isLocale } from "@/i18n/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// /sitemaps/pages.xml, /sitemaps/blog-<lang>.xml and /sitemaps/providers.xml
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (file === "pages.xml") return xmlResponse(pagesSitemap());
  if (file === "providers.xml") {
    const xml = await providersSitemap();
    if (xml) return xmlResponse(xml);
  }
  const m = /^blog-([a-z]{2})\.xml$/.exec(file);
  if (m && isLocale(m[1])) {
    const xml = await blogSitemap(m[1]);
    if (xml) return xmlResponse(xml);
  }
  return new Response("Not found", { status: 404 });
}
