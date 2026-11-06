"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Tracker from "@/components/Tracker";
import ConsentBanner from "@/components/ConsentBanner";
import { AdsProvider } from "@/components/ads/AdsContext";
import AdSlot from "@/components/ads/AdSlot";
import { LocaleProvider } from "@/i18n/client";
import { commonMessages } from "@/i18n/messages/common";
import type { Locale } from "@/i18n/config";

// Public pages get the marketing Header/Footer; /admin gets its own chrome.
export default function SiteShell({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return <>{children}</>;

  return (
    <LocaleProvider locale={locale}>
    <AdsProvider>
      <Tracker />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
      >
        {commonMessages[locale].skipToContent}
      </a>
      <Header />

      <div className="relative flex flex-1 flex-col">
        {/* Side ads — placed in the empty gutter near the top. They scroll away
            with the page (NOT sticky) and only show on wide screens that have
            real empty space, so they never cover the content. */}
        <div className="absolute start-3 top-36 z-10 hidden w-[160px] xl:block">
          <AdSlot placement="sidebarLeft" vertical label={false} />
        </div>
        <div className="absolute end-3 top-36 z-10 hidden w-[160px] xl:block">
          <AdSlot placement="sidebarRight" vertical label={false} />
        </div>

        {/* Top banner */}
        <AdSlot placement="top" className="container max-w-5xl px-4 py-4" />

        <main id="main" className="flex-1">
          {children}
        </main>

        {/* Footer banner */}
        <AdSlot placement="footer" className="container max-w-5xl px-4 py-4" />
      </div>

      <Footer />
      <ConsentBanner />
    </AdsProvider>
    </LocaleProvider>
  );
}
