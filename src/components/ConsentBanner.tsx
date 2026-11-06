"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { useLocale } from "@/i18n/client";
import { lp, pick } from "@/i18n/config";
import { commonMessages } from "@/i18n/messages/common";

const KEY = "tsi_consent";

export default function ConsentBanner() {
  const [show, setShow] = useState(false);
  const locale = useLocale();
  const t = pick(commonMessages, locale).consent;

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* storage blocked */
    }
  }, []);

  const decide = (value: "accepted" | "rejected") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    // If the user declines, ask Google to serve non-personalized ads only.
    if (value === "rejected") {
      try {
        const w = window as unknown as { adsbygoogle?: { requestNonPersonalizedAds?: number } & unknown[] };
        w.adsbygoogle = w.adsbygoogle || ([] as unknown as typeof w.adsbygoogle);
        if (w.adsbygoogle) w.adsbygoogle.requestNonPersonalizedAds = 1;
      } catch {
        /* ignore */
      }
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div aria-live="polite" className="fixed inset-x-0 bottom-0 z-[90] px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="animate-fade-in-up mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-white/10 dark:bg-ink-900/95 dark:shadow-black/50 sm:flex-row sm:items-center sm:p-5">
        <span className="icon-tile hidden h-10 w-10 sm:flex">
          <Cookie className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {t.text}{" "}
          <Link href={lp(locale, "/privacy")} className="link">
            {t.privacy}
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => decide("rejected")} className="btn-secondary flex-1 px-4 py-2.5 sm:flex-none">
            {t.decline}
          </button>
          <button type="button" onClick={() => decide("accepted")} className="btn-primary flex-1 px-5 py-2.5 sm:flex-none">
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
