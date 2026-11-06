"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAds } from "./AdsContext";
import AdCreative from "./AdCreative";
import { adIsRenderable, adMatchesPath, inSchedule, type Placement, type PublicAd } from "@/lib/adsModel";
import { splitLocale, pick } from "@/i18n/config";
import { useLocale } from "@/i18n/client";
import { commonMessages } from "@/i18n/messages/common";

function sendEvent(adId: string, type: "impression" | "click") {
  let visitorId = "";
  try {
    visitorId = localStorage.getItem("tsi_vid") || "";
  } catch {
    /* ignore */
  }
  const body = JSON.stringify({ adId, type, visitorId });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/ad-event", new Blob([body], { type: "application/json" }));
      return;
    }
  } catch {
    /* fall through */
  }
  fetch("/api/ad-event", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
}

/** "mobile" below 768px, else "desktop"; null until mounted. */
function useDevice(): "mobile" | "desktop" | null {
  const [d, setD] = useState<"mobile" | "desktop" | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const set = () => setD(mq.matches ? "mobile" : "desktop");
    set();
    mq.addEventListener?.("change", set);
    return () => mq.removeEventListener?.("change", set);
  }, []);
  return d;
}

/**
 * <AdSlot placement="top" /> — shows the best matching active ad for this spot.
 * Matching: placement, page scope (language prefix stripped), language, device,
 * schedule. Lowest priority number wins; ads with the same priority rotate.
 * The in-content slot on blog articles also serves "inArticle" ads (preferred).
 */
export default function AdSlot({
  placement,
  className = "",
  vertical = false,
  label = true,
}: {
  placement: Placement;
  className?: string;
  vertical?: boolean;
  label?: boolean;
}) {
  const ads = useAds();
  const { locale: pathLocale, path: pathname } = splitLocale(usePathname() || "/");
  const ctxLocale = useLocale();
  const locale = pathLocale || ctxLocale;
  const t = pick(commonMessages, ctxLocale).common;
  const device = useDevice();
  const isArticle = pathname.startsWith("/blog/");

  const candidates = useMemo(() => {
    if (!ads.enabled || !device) return [] as PublicAd[];
    const now = Date.now();
    const ok = (a: PublicAd) =>
      adMatchesPath(a.scope, a.pathPrefix, pathname) &&
      (!a.locales?.length || a.locales.includes(locale)) &&
      (!a.device || a.device === "all" || a.device === device) &&
      inSchedule(a, now) &&
      adIsRenderable(a) &&
      (a.type !== "adsense" || Boolean(ads.client));
    const pickFor = (p: Placement) => ads.ads.filter((a) => a.placement === p && ok(a));
    if (placement === "inContent" && isArticle) {
      const inArticle = pickFor("inArticle");
      if (inArticle.length) return inArticle;
    }
    return pickFor(placement);
  }, [ads, device, pathname, locale, placement, isArticle]);

  // Lowest priority wins; rotate between ads sharing it (chosen once per page view).
  const key = candidates.map((a) => a.id).join(",");
  const ad = useMemo(() => {
    if (!candidates.length) return undefined;
    const min = Math.min(...candidates.map((a) => a.order ?? 0));
    const top = candidates.filter((a) => (a.order ?? 0) === min);
    return top[Math.floor(Math.random() * top.length)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Impression = at least half the ad visible once (hidden rails never count).
  const box = useRef<HTMLElement>(null);
  const impressed = useRef<string | null>(null);
  const adId = ad?.id;
  useEffect(() => {
    const el = box.current;
    if (!adId || !el || impressed.current === adId) return;
    if (typeof IntersectionObserver === "undefined") {
      impressed.current = adId;
      sendEvent(adId, "impression");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && impressed.current !== adId) {
          impressed.current = adId;
          sendEvent(adId, "impression");
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [adId]);

  const onClick = useCallback(() => adId && sendEvent(adId, "click"), [adId]);

  if (!ad) return null;

  return (
    <aside ref={box} className={`mx-auto w-full ${className}`} aria-label={t.advertisement} data-ad-placement={placement}>
      {label && (ad.type === "adsense" || ad.type === "html") && (
        <p className="mb-1 text-center text-[10px] font-medium uppercase tracking-wider text-slate-300 dark:text-slate-600">{t.advertisement}</p>
      )}
      <AdCreative ad={ad} client={ads.client} vertical={vertical} onClick={onClick} />
    </aside>
  );
}
