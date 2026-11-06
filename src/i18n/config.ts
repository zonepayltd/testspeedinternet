// Language setup shared by server and client code.
export const LOCALES = ["en", "fr", "es", "ar", "ru"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_META: Record<Locale, { name: string; english: string; dir: "ltr" | "rtl"; og: string; htmlLang: string }> = {
  en: { name: "English", english: "English", dir: "ltr", og: "en_US", htmlLang: "en" },
  fr: { name: "Français", english: "French", dir: "ltr", og: "fr_FR", htmlLang: "fr" },
  es: { name: "Español", english: "Spanish", dir: "ltr", og: "es_ES", htmlLang: "es" },
  ar: { name: "العربية", english: "Arabic", dir: "rtl", og: "ar_AR", htmlLang: "ar" },
  ru: { name: "Русский", english: "Russian", dir: "ltr", og: "ru_RU", htmlLang: "ru" },
};

export function isLocale(v: unknown): v is Locale {
  return typeof v === "string" && (LOCALES as readonly string[]).includes(v);
}

/** Build a localized URL path. English has no prefix: lp("fr", "/about") -> "/fr/about". */
export function lp(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean;
  if (clean === "/") return `/${locale}`;
  // keep hash/query intact
  return `/${locale}${clean}`;
}

/** Remove a locale prefix from a pathname: "/fr/blog" -> { locale: "fr", path: "/blog" }. */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const seg = pathname.split("/")[1];
  if (isLocale(seg) && seg !== DEFAULT_LOCALE) {
    const rest = pathname.slice(seg.length + 1);
    return { locale: seg, path: rest || "/" };
  }
  return { locale: DEFAULT_LOCALE, path: pathname || "/" };
}

/** Pick the right translation table: t = pick(messages, locale). */
export function pick<T>(messages: Record<Locale, T>, locale: Locale): T {
  return messages[locale] ?? messages[DEFAULT_LOCALE];
}
