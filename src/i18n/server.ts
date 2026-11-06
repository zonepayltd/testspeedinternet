import "server-only";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, isLocale, lp, type Locale } from "./config";
import { COMPANY } from "@/lib/company";

/** Active locale for the current request (set by middleware). */
export async function getLocale(): Promise<Locale> {
  const h = await headers();
  const v = h.get("x-locale");
  return isLocale(v) ? v : DEFAULT_LOCALE;
}

/** Locale from a page's params, falling back to English. */
export async function localeFromParams(params: Promise<{ locale?: string }>): Promise<Locale> {
  const { locale } = await params;
  return isLocale(locale) ? locale : DEFAULT_LOCALE;
}

/** hreflang alternates + canonical for a path that exists in every language. */
export function alternatesFor(locale: Locale, path: string, available: readonly Locale[] = LOCALES): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of available) languages[LOCALE_META[l].htmlLang] = `${COMPANY.siteUrl}${lp(l, path)}`;
  if (available.includes(DEFAULT_LOCALE)) languages["x-default"] = `${COMPANY.siteUrl}${lp(DEFAULT_LOCALE, path)}`;
  return {
    canonical: `${COMPANY.siteUrl}${lp(locale, path)}`,
    languages,
    types: { "application/rss+xml": `${COMPANY.siteUrl}/feed.xml` },
  };
}

type PageMetaInput = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  /** Use the title as-is (no " | TestSpeedInternet" suffix). Good for long keyword titles. */
  absoluteTitle?: boolean;
  keywords?: string[];
  noindex?: boolean;
};

/** Standard metadata for a localized page: title, description, canonical, hreflang, Open Graph. */
export function pageMetadata({ locale, path, title, description, absoluteTitle, keywords, noindex }: PageMetaInput): Metadata {
  const url = `${COMPANY.siteUrl}${lp(locale, path)}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: alternatesFor(locale, path),
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: COMPANY.brand,
      locale: LOCALE_META[locale].og,
    },
    twitter: { card: "summary_large_image", title, description },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}
