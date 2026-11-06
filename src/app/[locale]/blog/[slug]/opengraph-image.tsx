import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/posts";
import { OgCard, loadOgFonts } from "@/lib/ogTemplate";
import { isLocale, lp, pick, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { blogMessages, categoryLabel, readingTime } from "@/i18n/messages/blog";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "TestSpeedInternet article";

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug, locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const post = (await getPostBySlug(slug, locale)) ?? (locale !== DEFAULT_LOCALE ? await getPostBySlug(slug, DEFAULT_LOCALE) : null);
  const postLocale: Locale = post?.locale ?? locale;

  let eyebrow = post ? categoryLabel(post.category, postLocale) : "Blog";
  let title = post?.title || pick(blogMessages, postLocale).ogFallbackTitle;
  let footer = `testspeedinternet.com${lp(postLocale, "/blog")}${post ? ` · ${readingTime(post.readingMinutes, postLocale)}` : ""}`;
  let rtl = postLocale === "ar";

  let fonts = await loadOgFonts(`${eyebrow}${title}${footer}`, rtl);
  if (rtl && !fonts) {
    // No Arabic-capable font available: render the English version instead of broken glyphs.
    const en = await getPostBySlug(slug, DEFAULT_LOCALE);
    eyebrow = en ? categoryLabel(en.category, DEFAULT_LOCALE) : "Blog";
    title = en?.title || blogMessages.en.ogFallbackTitle;
    footer = `testspeedinternet.com/blog${en ? ` · ${readingTime(en.readingMinutes, DEFAULT_LOCALE)}` : ""}`;
    rtl = false;
    fonts = await loadOgFonts(`${eyebrow}${title}${footer}`);
  }
  if (rtl) footer = "testspeedinternet.com/ar/blog";

  return new ImageResponse(<OgCard eyebrow={eyebrow} title={title} footer={footer} rtl={rtl} />, {
    ...size,
    ...(fonts && fonts.length ? { fonts } : {}),
  });
}
