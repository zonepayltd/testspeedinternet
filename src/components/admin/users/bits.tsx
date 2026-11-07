"use client";

// Small display pieces shared by the admin Users / Reviews / Emails pages.
import { Star } from "lucide-react";

const AVATAR_TONES = [
  "bg-brand-100 text-brand-700 dark:bg-brand-400/15 dark:text-brand-200",
  "bg-violet-100 text-violet-700 dark:bg-violet-400/15 dark:text-violet-200",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200",
  "bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200",
  "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-200",
];

export function initials(name: string, email = ""): string {
  const parts = (name || email.split("@")[0] || "?").trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || "?") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export function Avatar({ name, email, size = 32 }: { name: string; email?: string; size?: number }) {
  const key = (email || name || "?").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return (
    <span
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${AVATAR_TONES[key % AVATAR_TONES.length]}`}
      aria-hidden="true"
    >
      {initials(name, email)}
    </span>
  );
}

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={i <= Math.round(value) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200 dark:fill-white/10 dark:text-white/10"}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

/** Provider logo from /api/isp-logo, falling back to the first letter. */
export function ProviderLogo({ name, domain, size = 20 }: { name: string; domain?: string; size?: number }) {
  if (!domain)
    return (
      <span style={{ width: size, height: size, fontSize: size * 0.5 }} className="inline-flex shrink-0 items-center justify-center rounded-md bg-slate-200 font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300" aria-hidden="true">
        {(name || "?")[0].toUpperCase()}
      </span>
    );
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/api/isp-logo?d=${encodeURIComponent(domain)}`}
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="shrink-0 rounded-md bg-white object-contain ring-1 ring-slate-200 dark:ring-white/10"
      onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = "hidden")}
    />
  );
}

export const fmtMbps = (n: number | null | undefined) => (n == null ? "–" : n >= 100 ? Math.round(n).toString() : n.toFixed(1));
