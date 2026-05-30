"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Tracker from "@/components/Tracker";
import ConsentBanner from "@/components/ConsentBanner";
import { AdsProvider } from "@/components/ads/AdsContext";
import AdSlot from "@/components/ads/AdSlot";

// Public pages get the marketing Header/Footer; /admin gets its own chrome.
export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return <>{children}</>;

  return (
    <AdsProvider>
      <Tracker />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Header />

      <div className="relative flex flex-1 flex-col">
        {/* Side ads — placed in the empty gutter near the top. They scroll away
            with the page (NOT sticky) and only show on wide screens that have
            real empty space, so they never cover the content. */}
        <div className="absolute left-3 top-36 z-10 hidden w-[160px] xl:block">
          <AdSlot placement="sidebarLeft" vertical label={false} />
        </div>
        <div className="absolute right-3 top-36 z-10 hidden w-[160px] xl:block">
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
  );
}
