"use client";

// Small shared pieces for the Overview / Online pages.

import { useEffect, useRef, useState } from "react";
import { Bot, Monitor, Smartphone, Tablet } from "lucide-react";
import { fmtNum } from "@/components/admin/ui";

export type OnlineUser = {
  id: string;
  lastSeen: number;
  path: string;
  locale: string;
  device: string;
  os: string;
  browser: string;
  countryCode: string;
  city: string;
  country?: string;
  region?: string;
  isp?: string;
  lat?: number | null;
  lon?: number | null;
};

export const RANGE_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
] as const;
export type RangeKey = (typeof RANGE_OPTIONS)[number]["value"];

const LOCALES = new Set(["en", "fr", "ar", "es", "de", "pt", "it", "ru", "tr", "nl", "pl", "id", "ja", "ko", "zh", "hi"]);

/** "/fr/blog/x" → { lang: "fr", rest: "/blog/x" } */
export function splitLocale(path: string, fallback = ""): { lang: string; rest: string } {
  const m = /^\/([a-z]{2})(?=\/|$)(.*)$/.exec(path || "/");
  if (m && LOCALES.has(m[1])) return { lang: m[1], rest: m[2] || "/" };
  return { lang: fallback && fallback !== "en" ? fallback : "en", rest: path || "/" };
}

export function PathLabel({ path, locale, className = "", max = "" }: { path: string; locale?: string; className?: string; max?: string }) {
  const { lang, rest } = splitLocale(path, locale);
  return (
    <span className={`flex min-w-0 max-w-full items-center gap-1.5 overflow-hidden ${max} ${className}`}>
      <span className="shrink-0 rounded bg-slate-100 px-1 py-px font-mono text-[10px] font-semibold uppercase text-slate-500 dark:bg-white/[0.06] dark:text-slate-400">{lang}</span>
      <span className="truncate font-mono text-[13px] text-slate-700 dark:text-slate-200" title={path}>
        {rest}
      </span>
    </span>
  );
}

export function DeviceIcon({ device, className = "h-4 w-4" }: { device: string; className?: string }) {
  const Icon = device === "mobile" ? Smartphone : device === "tablet" ? Tablet : device === "bot" ? Bot : Monitor;
  return <Icon className={`${className} text-slate-400`} aria-label={device} />;
}

export function LiveDot({ className = "" }: { className?: string }) {
  return (
    <span className={`relative flex h-2 w-2 ${className}`} aria-hidden="true">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
    </span>
  );
}

/** Re-render every `ms` so relative times ("12s ago") stay fresh. */
export function useNow(ms = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(t);
  }, [ms]);
  return now;
}

export function secondsAgo(ts: number, now: number) {
  const s = Math.max(0, Math.round((now - ts) / 1000));
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  return m < 60 ? `${m}m ago` : `${Math.floor(m / 60)}h ago`;
}

/**
 * Poll an async loader every `ms` while the tab is visible. Returns a manual
 * `reload`. The loader is kept in a ref so callers can pass inline functions.
 */
export function usePoll(loader: () => Promise<void> | void, ms: number, deps: unknown[] = []) {
  const ref = useRef(loader);
  ref.current = loader;
  useEffect(() => {
    let alive = true;
    const run = () => alive && document.visibilityState !== "hidden" && ref.current();
    ref.current();
    const t = setInterval(run, ms);
    const onVis = () => document.visibilityState === "visible" && ref.current();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      alive = false;
      clearInterval(t);
      document.removeEventListener("visibilitychange", onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ms, ...deps]);
  return () => ref.current();
}

/** A single 100 % bar split into segments + a legend underneath (≤ 4 segments). */
export function SplitBar({ items, colors }: { items: { label: string; value: number }[]; colors: string[] }) {
  const total = items.reduce((a, b) => a + b.value, 0);
  if (!total) return <p className="py-3 text-center text-sm text-slate-400">No data yet</p>;
  return (
    <div>
      <div className="flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full" role="img" aria-label={items.map((i) => `${i.label} ${Math.round((i.value / total) * 100)}%`).join(", ")}>
        {items.map((it, i) =>
          it.value > 0 ? <span key={it.label} className="h-full first:rounded-s-full last:rounded-e-full" style={{ width: `${(it.value / total) * 100}%`, background: colors[i % colors.length] }} /> : null,
        )}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
        {items.map((it, i) => (
          <li key={it.label} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300" title={`${fmtNum(it.value)}`}>
            <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: colors[i % colors.length] }} aria-hidden="true" />
            {it.label}
            <span className="font-semibold tabular-nums text-slate-900 dark:text-white">{Math.round((it.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);
