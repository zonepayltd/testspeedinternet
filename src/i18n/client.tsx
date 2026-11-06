"use client";

import { createContext, useContext } from "react";
import NextLink from "next/link";
import { DEFAULT_LOCALE, lp, type Locale } from "./config";

const LocaleCtx = createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleCtx.Provider value={locale}>{children}</LocaleCtx.Provider>;
}

/** Current locale inside client components. */
export const useLocale = () => useContext(LocaleCtx);

/** Returns a function that localizes paths: const to = useLocalePath(); to("/about"). */
export function useLocalePath() {
  const locale = useLocale();
  return (path: string) => lp(locale, path);
}

/** Drop-in for next/link that adds the current language prefix to internal paths. */
export function LocaleLink(props: React.ComponentProps<typeof NextLink>) {
  const locale = useLocale();
  const { href, ...rest } = props;
  const localized = typeof href === "string" && href.startsWith("/") ? lp(locale, href) : href;
  return <NextLink href={localized} {...rest} />;
}
