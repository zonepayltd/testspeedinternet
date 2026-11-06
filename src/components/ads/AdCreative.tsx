"use client";

import AdUnit from "./AdUnit";
import CustomAdCard from "./CustomAdCard";
import HtmlAd from "./HtmlAd";
import type { PublicAd } from "@/lib/adsModel";

// Tag the advertiser's link so their analytics shows the traffic came from us.
export function withUtm(link: string): string {
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

export type CreativeAd = Pick<PublicAd, "type" | "adsenseSlot" | "image" | "alt" | "title" | "description" | "buttonText" | "link" | "html" | "width" | "height">;

/**
 * Renders one ad of any type. Used by the public AdSlot and by the admin live
 * preview (`preview`: no AdSense push, links don't navigate, no tracking).
 */
export default function AdCreative({
  ad,
  client = "",
  vertical = false,
  preview = false,
  onClick,
}: {
  ad: CreativeAd;
  client?: string;
  vertical?: boolean;
  preview?: boolean;
  onClick?: () => void;
}) {
  if (ad.type === "adsense") {
    if (preview) {
      return (
        <div
          className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-xs text-slate-500 dark:border-white/15 dark:bg-white/[0.03] dark:text-slate-400"
          style={{ minHeight: vertical ? 600 : 100 }}
        >
          <span className="font-semibold text-slate-700 dark:text-slate-200">Google AdSense</span>
          <span>Slot {ad.adsenseSlot || "—"} · served by Google on the live site</span>
        </div>
      );
    }
    return (
      <AdUnit
        client={client}
        slot={ad.adsenseSlot}
        format={vertical ? "vertical" : "auto"}
        responsive={!vertical}
        style={vertical ? { display: "block", width: 160, minHeight: 600 } : { display: "block", minHeight: 90 }}
      />
    );
  }

  if (ad.type === "html") {
    return <HtmlAd html={ad.html} width={ad.width} height={ad.height} onClick={onClick} />;
  }

  const card = (
    <CustomAdCard
      key={`${ad.type}-${ad.image}`}
      kind={ad.type}
      image={ad.image}
      alt={ad.alt}
      title={ad.title}
      description={ad.description}
      buttonText={ad.buttonText}
      vertical={vertical}
      preview={preview}
    />
  );

  if (preview) return <div className="block cursor-pointer">{card}</div>;
  return (
    <a href={withUtm(ad.link)} target="_blank" rel="sponsored noopener" onClick={onClick} className="block" style={vertical ? { maxWidth: 220 } : undefined}>
      {card}
    </a>
  );
}
