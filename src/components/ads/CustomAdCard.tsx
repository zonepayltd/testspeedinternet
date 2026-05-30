"use client";

import { useState } from "react";
import { ArrowRight, Info } from "lucide-react";
import type { CustomFormat } from "@/lib/adsModel";

const BRAND = "Test Speed Internet";

function ErrMsg() {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-700">
      ⚠ Image failed to load. Use a <strong>direct image URL</strong> (.jpg/.png/.webp) from a host that allows hotlinking.
    </div>
  );
}

export default function CustomAdCard({
  image,
  title,
  description,
  customFormat,
  preview = false,
}: {
  image: string;
  title: string;
  description: string;
  customFormat: CustomFormat;
  preview?: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const hasImage = customFormat !== "text" && Boolean(image);
  const showText = customFormat !== "image" && (Boolean(title) || Boolean(description));

  if (customFormat === "image" && hasImage && imgError) {
    return preview ? <ErrMsg /> : null;
  }
  if (!hasImage && !showText) {
    return preview ? (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-xs text-slate-400">
        Fill the fields to preview
      </div>
    ) : null;
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-brand-50/40 shadow-sm ring-1 ring-slate-100 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-600/5">
      {/* Small "Ad" chip (top-right) */}
      <span className="absolute right-2.5 top-2.5 z-10 rounded-md bg-slate-900/55 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur">
        Ad
      </span>

      {hasImage &&
        (imgError ? (
          preview ? <ErrMsg /> : null
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title || "Advertisement"}
            onError={() => setImgError(true)}
            className="max-h-56 w-full object-cover"
          />
        ))}

      {showText && (
        <div className="px-5 pb-4 pt-5">
          {title && <p className="pr-8 text-base font-bold leading-snug text-slate-900 sm:text-lg">{title}</p>}
          {description && <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{description}</p>}
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors group-hover:bg-brand-700">
            Learn more
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      )}

      {/* Attribution bar (like AdSense) */}
      <div className="flex items-center gap-1.5 border-t border-slate-100 bg-slate-50/60 px-3 py-1.5 text-[10px] font-medium text-slate-400">
        <Info className="h-3 w-3" aria-hidden="true" />
        Ad · {BRAND}
      </div>
    </div>
  );
}
