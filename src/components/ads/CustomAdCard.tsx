"use client";

import { useState } from "react";
import { ArrowRight, Info } from "lucide-react";
import { useLocale } from "@/i18n/client";
import { pick } from "@/i18n/config";
import { commonMessages } from "@/i18n/messages/common";
import { chromeMessages } from "@/i18n/messages/chrome";

const BRAND = "Test Speed Internet";

function ErrMsg() {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300">
      ⚠ Image failed to load. Upload the image, or use a <strong>direct image URL</strong> (.jpg/.png/.webp) from a host that allows hotlinking.
    </div>
  );
}

export type CreativeKind = "image" | "card" | "text";

/** Native (non-script) ad creatives: image banner, card and text ad. */
export default function CustomAdCard({
  kind,
  image = "",
  alt = "",
  title = "",
  description = "",
  buttonText = "",
  vertical = false,
  preview = false,
}: {
  kind: CreativeKind;
  image?: string;
  alt?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  vertical?: boolean;
  preview?: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const locale = useLocale();
  const c = pick(commonMessages, locale).common;
  const adLabel = pick(chromeMessages, locale).adShort;
  const hasImage = kind !== "text" && Boolean(image);
  const showText = kind !== "image" && (Boolean(title) || Boolean(description));

  if (!hasImage && !showText) {
    return preview ? (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-xs text-slate-400 dark:border-white/10 dark:bg-ink-900 dark:text-slate-500">
        Fill in the fields to see a preview
      </div>
    ) : null;
  }

  // Plain image banner: just the picture with a small "Ad" chip.
  if (kind === "image") {
    if (imgError) return preview ? <ErrMsg /> : null;
    return (
      <div className="relative mx-auto w-fit max-w-full overflow-hidden rounded-xl">
        <span className="absolute end-1.5 top-1.5 z-10 rounded bg-slate-900/55 px-1 py-px text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur">
          {adLabel}
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={alt || title || c.advertisement} onError={() => setImgError(true)} className="block h-auto max-w-full" decoding="async" />
      </div>
    );
  }

  const cta = buttonText || c.learnMore;
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-brand-50/40 text-start shadow-sm ring-1 ring-slate-100 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-600/5 dark:border-white/[0.08] dark:from-ink-900 dark:to-ink-850 dark:shadow-none dark:ring-0 dark:hover:border-brand-400/30">
      <span className="absolute end-2.5 top-2.5 z-10 rounded-md bg-slate-900/55 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur">
        {adLabel}
      </span>

      <div className={hasImage && !vertical ? "sm:flex sm:items-stretch" : ""}>
        {hasImage &&
          (imgError ? (
            preview ? <ErrMsg /> : null
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={alt || title || c.advertisement}
              onError={() => setImgError(true)}
              decoding="async"
              className={`w-full object-cover ${vertical ? "max-h-40" : "max-h-56 sm:max-h-none sm:w-2/5 sm:shrink-0"}`}
            />
          ))}

        {showText && (
          <div className={`min-w-0 flex-1 ${vertical ? "px-3.5 pb-3 pt-4" : "px-5 pb-4 pt-5"}`}>
            {title && <p className={`pe-8 font-bold leading-snug text-slate-900 dark:text-white ${vertical ? "text-sm" : "text-base sm:text-lg"}`}>{title}</p>}
            {description && <p className={`mt-1.5 leading-relaxed text-slate-500 dark:text-slate-400 ${vertical ? "text-xs" : "text-sm"}`}>{description}</p>}
            <span className={`mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 font-semibold text-white shadow-sm transition-colors group-hover:bg-brand-700 dark:bg-brand-500 dark:group-hover:bg-brand-400 ${vertical ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"}`}>
              {cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
            </span>
          </div>
        )}
      </div>

      {/* Attribution bar (like AdSense) */}
      <div className="flex items-center gap-1.5 border-t border-slate-100 bg-slate-50/60 px-3 py-1.5 text-[10px] font-medium text-slate-400 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-slate-500">
        <Info className="h-3 w-3" aria-hidden="true" />
        {adLabel} · {BRAND}
      </div>
    </div>
  );
}
