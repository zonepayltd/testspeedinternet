"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { formatMs, formatSpeed, numberLocale } from "@/components/speedtest/format";
import type { Locale } from "@/i18n/config";

export type AccountTest = {
  id: string; ts: number; mode: string; status: string; provider: string; providerDomain: string; isp: string; server: string;
  download: number | null; upload: number | null; ping: number | null; jitter: number | null; countryCode: string; city: string;
};
export type ProviderSummary = { slug: string; name: string; domain: string; count: number; average: number; dist: Record<string, number>; lastReviewAt: number };
export type MyProvider = {
  name: string; slug: string; domain: string; tests: number; lastTest: number;
  avgDownload: number | null; avgUpload: number | null; avgPing: number | null; bestDownload: number | null; bestUpload: number | null; bestPing: number | null;
  community: ProviderSummary | null;
};
export type MyReview = { id: string; provider: string; providerSlug: string; providerDomain: string; rating: number; title: string; comment: string; status: string; createdAt: number };

export const COLORS = { download: "#3b82f6", upload: "#8b5cf6", ping: "#10b981" };

export const sp = (v: number | null | undefined, locale: Locale) => (v == null ? "–" : formatSpeed(v, locale));
export const msf = (v: number | null | undefined, locale: Locale) => (v == null ? "–" : formatMs(v, locale));

export function fmtDate(ts: number, locale: Locale, withTime = true) {
  if (!ts) return "–";
  return new Intl.DateTimeFormat(numberLocale(locale), withTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "medium" }).format(ts);
}

const PALETTE = ["bg-brand-600", "bg-violet-600", "bg-emerald-600", "bg-amber-600", "bg-rose-600", "bg-cyan-600", "bg-indigo-600"];

/** Provider logo (via /api/isp-logo) with a coloured initial as fallback. */
export function ProviderMark({ name, domain, size = 36 }: { name: string; domain?: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  const color = PALETTE[Math.abs([...(name || "?")].reduce((a, c) => a + c.charCodeAt(0), 0)) % PALETTE.length];
  return (
    <span
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-slate-200 dark:bg-white/[0.06] dark:ring-white/10"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {domain && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/api/isp-logo?d=${encodeURIComponent(domain)}`} alt="" width={size} height={size} loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-contain p-1" />
      ) : (
        <span className={`flex h-full w-full items-center justify-center text-sm font-bold text-white ${color}`}>{(name || "?").trim()[0]?.toUpperCase()}</span>
      )}
    </span>
  );
}

export function Stars({ value, size = 14, label }: { value: number; size?: number; label?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={label || `${value.toFixed(1)} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, value - (i - 1)));
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star className="absolute inset-0 text-slate-300 dark:text-white/20" style={{ width: size, height: size }} aria-hidden="true" />
            <span className="absolute inset-y-0 start-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="fill-amber-400 text-amber-400" style={{ width: size, height: size }} aria-hidden="true" />
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function StatTile({ label, value, unit, icon: Icon, tone }: { label: string; value: string; unit?: string; icon: React.ComponentType<{ className?: string }>; tone: string }) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 [html[lang=ar]_&]:normal-case">{label}</p>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tone}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 tabular-nums dark:text-white sm:text-[1.7rem]" dir="ltr">
        {value} {unit && <span className="text-sm font-semibold text-slate-400">{unit}</span>}
      </p>
    </div>
  );
}

export function EmptyBox({ icon: Icon, title, text, action }: { icon: React.ComponentType<{ className?: string }>; title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="card flex flex-col items-center px-6 py-12 text-center">
      <span className="icon-tile">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-4 text-base font-bold text-slate-900 dark:text-white">{title}</p>
      {text && <p className="muted mt-1 max-w-sm text-sm">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function testLabel(t: AccountTest, locale: Locale, unknown: string) {
  return `${fmtDate(t.ts, locale)} · ${t.provider || unknown} · ↓ ${sp(t.download, locale)}`;
}
