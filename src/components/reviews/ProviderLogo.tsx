"use client";

import { useState } from "react";

/** Provider logo from /api/isp-logo, falling back to a coloured initial. */
export default function ProviderLogo({ name, domain, size = 40, className = "" }: { name: string; domain?: string; size?: number; className?: string }) {
  const [failed, setFailed] = useState(false);
  const box = `flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-slate-200 dark:bg-white dark:ring-white/10 ${className}`;
  if (!domain || failed) {
    return (
      <span
        className={`flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 font-bold uppercase text-white ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.42 }}
        aria-hidden="true"
      >
        {(name || "?").trim()[0]}
      </span>
    );
  }
  return (
    <span className={box} style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/api/isp-logo?d=${encodeURIComponent(domain)}`} alt="" width={size} height={size} loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-contain p-1" />
    </span>
  );
}
