"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAds } from "./AdsContext";
import AdUnit from "./AdUnit";
import CustomAdCard from "./CustomAdCard";
import { adMatchesPath, type Placement } from "@/lib/adsModel";
import { splitLocale, pick } from "@/i18n/config";
import { useLocale } from "@/i18n/client";
import { commonMessages } from "@/i18n/messages/common";

// Tag the advertiser's link so their analytics shows the traffic came from us.
function withUtm(link: string): string {
  try {
    const u = new URL(link);
    if (!u.searchParams.has("utm_source")) u.searchParams.set("utm_source", "testspeedinternet.com");
    if (!u.searchParams.has("utm_medium")) u.searchParams.set("utm_medium", "ad");
    if (!u.searchParams.has("utm_campaign")) u.searchParams.set("utm_campaign", "site-ads");
    return u.toString();
  } catch {
    return link;
  }
}

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
  fetch("/api/ad-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

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
  // Ads target paths without the language prefix ("/fr/blog" matches "/blog").
  const pathname = splitLocale(usePathname() || "/").path;
  const t = pick(commonMessages, useLocale()).common;

  const candidate = ads.enabled
    ? ads.ads.find((a) => a.placement === placement && adMatchesPath(a.scope, a.pathPrefix, pathname))
    : undefined;

  // Validity per type/format.
  let ad = candidate;
  if (ad) {
    if (ad.type === "adsense" && (!ads.client || !ad.adsenseSlot)) ad = undefined;
    if (ad?.type === "custom") {
      const fmt = ad.customFormat;
      if (!ad.link) ad = undefined;
      else if (fmt === "image" && !ad.image) ad = undefined;
      else if (fmt === "text" && !ad.title) ad = undefined;
      else if (fmt === "card" && (!ad.image || !ad.title)) ad = undefined;
    }
  }

  const adId = ad?.id;
  const impressed = useRef<string | null>(null);
  useEffect(() => {
    if (!adId || impressed.current === adId) return;
    impressed.current = adId;
    sendEvent(adId, "impression");
  }, [adId]);

  if (!ad) return null;

  return (
    <aside className={`mx-auto w-full ${className}`} aria-label="Advertisement">
      {label && ad.type === "adsense" && (
        <p className="mb-1 text-center text-[10px] font-medium uppercase tracking-wider text-slate-300 dark:text-slate-600">
          {t.advertisement}
        </p>
      )}

      {ad.type === "adsense" ? (
        <AdUnit
          client={ads.client}
          slot={ad.adsenseSlot}
          format={vertical ? "vertical" : "auto"}
          responsive={!vertical}
          style={vertical ? { display: "block", width: 160, minHeight: 600 } : { display: "block", minHeight: 90 }}
        />
      ) : (
        <a
          href={withUtm(ad.link)}
          target="_blank"
          rel="sponsored noopener"
          onClick={() => sendEvent(ad.id, "click")}
          className="block"
          style={vertical ? { maxWidth: 220 } : undefined}
        >
          <CustomAdCard image={ad.image} title={ad.title} description={ad.description} customFormat={ad.customFormat} />
        </a>
      )}
    </aside>
  );
}
