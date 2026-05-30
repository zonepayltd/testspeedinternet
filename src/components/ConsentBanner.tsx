"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

const KEY = "tsi_consent";

export default function ConsentBanner() {
  const [show, setShow] = useState(false);

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
    <div className="fixed inset-x-0 bottom-0 z-[90] px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="animate-fade-in-up mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10 sm:flex-row sm:items-center sm:p-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Cookie className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="flex-1 text-sm leading-relaxed text-slate-600">
          We use cookies for essential features, analytics and to show ads (Google AdSense).
          You can accept all, or decline non-essential ones. See our{" "}
          <Link href="/privacy" className="font-semibold text-brand-600 hover:text-brand-700">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide("rejected")}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
