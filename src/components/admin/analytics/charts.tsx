"use client";

// Chart + small display helpers for the admin Analytics / Visitors / Speed tests pages.
// Palette validated (CVD + contrast) for both surfaces: light #fff, dark ink-900.
import { SEARCH, KIND_LABEL, sourceKind } from "@/lib/sources";
import FirebaseSetup, { isFirebaseMissing } from "@/components/admin/FirebaseSetup";
import { useEffect, useMemo, useRef, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarRange, X } from "lucide-react";
import { Badge, Segmented, fmtNum, inputCls, type Tone } from "@/components/admin/ui";

/* ------------------------------------------------------------------ theme */

export function useIsDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const read = () => setDark(el.classList.contains("dark"));
    read();
    const mo = new MutationObserver(read);
    mo.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);
  return dark;
}

export function useChartTheme() {
  const dark = useIsDark();
  return useMemo(
    () =>
      dark
        ? { c1: "#3b82f6", c2: "#0d9488", c3: "#d97706", grid: "rgba(255,255,255,0.06)", axis: "#64748b", surface: "#0c1324", muted: "rgba(255,255,255,0.08)", dark }
        : { c1: "#2563eb", c2: "#0d9488", c3: "#d97706", grid: "#eef2f6", axis: "#94a3b8", surface: "#ffffff", muted: "#e2e8f0", dark },
    [dark],
  );
}

/* ------------------------------------------------------------------ formatting */

export const fmtMbps = (n: number | null | undefined) => (n == null ? "–" : n >= 100 ? fmtNum(n, 0) : fmtNum(n, 1));
export const fmtPct = (n: number | null | undefined, d = 1) => (n == null || !Number.isFinite(n) ? "–" : `${n.toFixed(d)}%`);
export function fmtDuration(sec: number) {
  if (!sec || !Number.isFinite(sec)) return "0s";
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return m ? `${m}m ${s.toString().padStart(2, "0")}s` : `${s}s`;
}
export const pctChange = (cur: number, prev: number) => (prev > 0 ? ((cur - prev) / prev) * 100 : null);

const dayFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });
const hourFmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" });
export const fmtBucket = (t: number, bucket: "hour" | "day") => (bucket === "hour" ? hourFmt.format(t) : dayFmt.format(t));

/* ------------------------------------------------------------------ range control */

export type RangeKey = "today" | "7d" | "30d" | "90d" | "custom";
export type RangeState = { range: RangeKey; from: string; to: string };
export const RANGE_OPTIONS: { value: RangeKey; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
  { value: "90d", label: "90d" },
];
export function rangeQuery(r: RangeState) {
  const tz = `tz=${new Date().getTimezoneOffset()}`;
  return r.range === "custom" && r.from ? `from=${r.from}&to=${r.to || r.from}&${tz}` : `range=${r.range}&${tz}`;
}
export function rangeLabel(r: RangeState) {
  if (r.range === "custom") return `${r.from} → ${r.to || r.from}`;
  return { today: "Today", "7d": "Last 7 days", "30d": "Last 30 days", "90d": "Last 90 days" }[r.range];
}

export function RangeControl({ value, onChange }: { value: RangeState; onChange: (r: RangeState) => void }) {
  const [open, setOpen] = useState(value.range === "custom");
  const today = new Date().toISOString().slice(0, 10);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Segmented<RangeKey>
        value={value.range === "custom" ? ("" as RangeKey) : value.range}
        onChange={(v) => {
          setOpen(false);
          onChange({ range: v, from: "", to: "" });
        }}
        options={RANGE_OPTIONS}
      />
      {open ? (
        <div className="flex items-center gap-1.5">
          <label className="sr-only" htmlFor="range-from">From</label>
          <input id="range-from" type="date" max={today} value={value.from} onChange={(e) => onChange({ range: "custom", from: e.target.value, to: value.to && value.to >= e.target.value ? value.to : e.target.value })} className={`${inputCls} h-8 w-[9.5rem] px-2 text-xs`} />
          <span className="text-xs text-slate-400">→</span>
          <label className="sr-only" htmlFor="range-to">To</label>
          <input id="range-to" type="date" max={today} min={value.from || undefined} value={value.to} onChange={(e) => onChange({ range: "custom", from: value.from || e.target.value, to: e.target.value })} className={`${inputCls} h-8 w-[9.5rem] px-2 text-xs`} />
          <button type="button" aria-label="Clear custom range" onClick={() => { setOpen(false); onChange({ range: "30d", from: "", to: "" }); }} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.08]">
          <CalendarRange className="h-3.5 w-3.5" aria-hidden="true" /> Custom
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ chart pieces */

type TipRow = { name?: string; value?: number | string; color?: string; dataKey?: string | number; payload?: Record<string, unknown> };
export function ChartTip({ active, payload, label, labelFormat, valueFormat = (v) => fmtNum(v) }: {
  active?: boolean;
  payload?: TipRow[];
  label?: string | number;
  labelFormat?: (l: string | number) => string;
  valueFormat?: (v: number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-[9rem] rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow-lg backdrop-blur dark:border-white/10 dark:bg-ink-900/95">
      {label != null && <p className="mb-1.5 font-medium text-slate-500 dark:text-slate-400">{labelFormat ? labelFormat(label) : label}</p>}
      <ul className="space-y-1">
        {payload.map((p) => (
          <li key={String(p.dataKey)} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full" style={{ background: p.color }} aria-hidden="true" />
              {p.name}
            </span>
            <span className="font-semibold tabular-nums text-slate-900 dark:text-white">{valueFormat(Number(p.value))}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Legend({ items }: { items: { label: string; color: string; dashed?: boolean }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
      {items.map((i) => (
        <span key={i.label} className="inline-flex items-center gap-1.5">
          <span className="h-[3px] w-3.5 rounded-full" style={{ background: i.color }} aria-hidden="true" />
          {i.label}
        </span>
      ))}
    </div>
  );
}

export type SeriesDef = { key: string; label: string; color: string; fill?: boolean };
export function TrendChart({ data, series, xKey = "t", xFormat, height = 280, valueFormat }: {
  data: Record<string, number>[];
  series: SeriesDef[];
  xKey?: string;
  xFormat: (v: number) => string;
  height?: number;
  valueFormat?: (v: number) => string;
}) {
  const th = useChartTheme();
  const id = useRef(`g${Math.random().toString(36).slice(2, 8)}`).current;
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          <defs>
            {series.map((s) => (
              <linearGradient key={s.key} id={`${id}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={th.dark ? 0.28 : 0.18} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid vertical={false} stroke={th.grid} />
          <XAxis dataKey={xKey} tickFormatter={xFormat} tick={{ fontSize: 11, fill: th.axis }} axisLine={false} tickLine={false} minTickGap={24} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: th.axis }} axisLine={false} tickLine={false} width={44} />
          <Tooltip cursor={{ stroke: th.axis, strokeDasharray: "3 3" }} content={<ChartTip labelFormat={(l) => xFormat(Number(l))} valueFormat={valueFormat} />} />
          {series.map((s) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={2}
              fill={s.fill === false ? "transparent" : `url(#${id}-${s.key})`}
              activeDot={{ r: 4, strokeWidth: 2, stroke: th.surface }}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BarsChart({ data, xKey, bars, height = 240, xFormat, valueFormat, stacked, highlight }: {
  data: Record<string, number | string | null>[];
  xKey: string;
  bars: SeriesDef[];
  height?: number;
  xFormat?: (v: string | number) => string;
  valueFormat?: (v: number) => string;
  stacked?: boolean;
  highlight?: (row: Record<string, number | string | null>) => boolean;
}) {
  const th = useChartTheme();
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }} barCategoryGap="18%" barGap={2}>
          <CartesianGrid vertical={false} stroke={th.grid} />
          <XAxis dataKey={xKey} tickFormatter={xFormat} tick={{ fontSize: 11, fill: th.axis }} axisLine={false} tickLine={false} minTickGap={12} interval="preserveStartEnd" />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: th.axis }} axisLine={false} tickLine={false} width={44} />
          <Tooltip cursor={{ fill: th.dark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.04)" }} content={<ChartTip labelFormat={xFormat ? (l) => xFormat(l) : undefined} valueFormat={valueFormat} />} />
          {bars.map((b, i) => (
            <Bar
              key={b.key}
              dataKey={b.key}
              name={b.label}
              fill={b.color}
              stackId={stacked ? "s" : undefined}
              radius={stacked ? (i === bars.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]) : [4, 4, 0, 0]}
              stroke={stacked ? th.surface : undefined}
              strokeWidth={stacked ? 1 : 0}
              isAnimationActive={false}
              maxBarSize={40}
            >
              {highlight && data.map((row, j) => <Cell key={j} fill={highlight(row) ? b.color : th.dark ? "rgba(59,130,246,0.35)" : "#bfdbfe"} />)}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Tiny inline trend line (no axes). */
export function Sparkline({ values, color, width = 84, height = 24 }: { values: number[]; color: string; width?: number; height?: number }) {
  if (!values.length) return null;
  const max = Math.max(1, ...values);
  const stepX = values.length > 1 ? width / (values.length - 1) : width;
  const pts = values.map((v, i) => `${(i * stepX).toFixed(1)},${(height - 2 - (v / max) * (height - 4)).toFixed(1)}`).join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
/** 7 × 24 heatmap of page views by weekday and hour (single-hue sequential scale). */
export function Heatmap({ data }: { data: number[][] }) {
  const max = Math.max(1, ...data.flat());
  const [hover, setHover] = useState<{ d: number; h: number } | null>(null);
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[560px]">
        <div className="grid grid-cols-[2.5rem_repeat(24,minmax(0,1fr))] gap-[3px]">
          <span />
          {Array.from({ length: 24 }, (_, h) => (
            <span key={h} className="text-center text-[10px] tabular-nums text-slate-400">{h % 3 === 0 ? String(h).padStart(2, "0") : ""}</span>
          ))}
          {data.map((row, d) => (
            <div key={d} className="contents">
              <span className="pe-1 text-end text-[11px] leading-5 text-slate-500 dark:text-slate-400">{DAYS[d]}</span>
              {row.map((v, h) => {
                const a = v / max;
                return (
                  <span
                    key={h}
                    onMouseEnter={() => setHover({ d, h })}
                    onMouseLeave={() => setHover(null)}
                    title={`${DAYS[d]} ${String(h).padStart(2, "0")}:00 — ${v} page views`}
                    className={`h-5 rounded-[4px] ${v ? "" : "bg-slate-100 dark:bg-white/[0.04]"} ${hover && hover.d === d && hover.h === h ? "ring-2 ring-slate-900/40 dark:ring-white/50" : ""}`}
                    style={v ? { background: `rgba(37, 99, 235, ${0.12 + a * 0.88})` } : undefined}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span className="tabular-nums">{hover ? `${DAYS[hover.d]} ${String(hover.h).padStart(2, "0")}:00 · ${fmtNum(data[hover.d][hover.h])} page views` : "Hover a cell for details · your local time"}</span>
          <span className="flex items-center gap-1.5">
            Less
            {[0.12, 0.34, 0.56, 0.78, 1].map((o) => (
              <span key={o} className="h-2.5 w-2.5 rounded-[3px]" style={{ background: `rgba(37, 99, 235, ${o})` }} />
            ))}
            More
          </span>
        </div>
      </div>
    </div>
  );
}

/** Segmented horizontal share bar (e.g. new vs returning, device split). */
export function ShareBar({ items }: { items: { label: string; value: number; color: string }[] }) {
  const total = items.reduce((a, b) => a + b.value, 0) || 1;
  return (
    <div>
      <div className="flex h-2.5 w-full gap-[2px] overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.06]">
        {items.map((i) => (i.value ? <span key={i.label} style={{ width: `${(i.value / total) * 100}%`, background: i.color }} className="first:rounded-s-full last:rounded-e-full" /> : null))}
      </div>
      <ul className="mt-3 space-y-1.5">
        {items.map((i) => (
          <li key={i.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: i.color }} aria-hidden="true" />
              {i.label}
            </span>
            <span className="tabular-nums text-slate-900 dark:text-white">
              <span className="font-semibold">{fmtNum(i.value)}</span>
              <span className="ms-2 inline-block w-12 text-end text-xs text-slate-400">{((i.value / total) * 100).toFixed(1)}%</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ badges & logos */

export { SEARCH, KIND_LABEL, sourceKind };

const ENGINE_DOMAIN: Record<string, string> = {
  Google: "google.com", Bing: "bing.com", DuckDuckGo: "duckduckgo.com", Yahoo: "yahoo.com", Yandex: "yandex.com", Baidu: "baidu.com",
  Ecosia: "ecosia.org", Brave: "search.brave.com", Naver: "naver.com", Seznam: "seznam.cz", Qwant: "qwant.com", Startpage: "startpage.com", Mojeek: "mojeek.com",
  ChatGPT: "chatgpt.com", Perplexity: "perplexity.ai", Gemini: "gemini.google.com", Copilot: "copilot.microsoft.com", Claude: "claude.ai",
  "Twitter/X": "x.com", Telegram: "telegram.org", WhatsApp: "whatsapp.com", Pinterest: "pinterest.com",
  Facebook: "facebook.com", Reddit: "reddit.com", Instagram: "instagram.com", Twitter: "x.com", X: "x.com", LinkedIn: "linkedin.com", YouTube: "youtube.com", TikTok: "tiktok.com",
};
const KIND_TONE: Record<string, Tone> = { search: "blue", social: "violet", ai: "cyan", direct: "slate", referral: "amber" };

export function SourceLogo({ name, size = 16, domain: forced }: { name: string; size?: number; domain?: string }) {
  const [failed, setFailed] = useState(false);
  const domain = forced || ENGINE_DOMAIN[name] || (/\./.test(name) ? name : "");
  if (!domain || failed)
    return (
      <span style={{ width: size, height: size, fontSize: size * 0.55 }} className="inline-flex shrink-0 items-center justify-center rounded-[4px] bg-slate-200 font-bold uppercase text-slate-600 dark:bg-white/10 dark:text-slate-300" aria-hidden="true">
        {(name || "?")[0]}
      </span>
    );
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} alt="" width={size} height={size} onError={() => setFailed(true)} className="shrink-0 rounded-[4px]" style={{ width: size, height: size }} />
  );
}

export function SourceBadge({ source }: { source: string }) {
  const k = sourceKind(source);
  return (
    <Badge tone={KIND_TONE[k]} className="max-w-[11rem]">
      <SourceLogo name={source} size={12} />
      <span className="truncate">{source || "Direct"}</span>
    </Badge>
  );
}

export const LANG_NAME: Record<string, string> = { en: "English", fr: "French", es: "Spanish", ar: "Arabic", ru: "Russian" };
export function LangBadge({ lang }: { lang: string }) {
  return <span className="inline-flex h-[18px] items-center rounded px-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 ring-1 ring-inset ring-slate-200 dark:text-slate-400 dark:ring-white/10">{lang}</span>;
}

export const STATUS_TONE: Record<string, Tone> = { completed: "green", started: "blue", cancelled: "amber", error: "rose" };
export const STATUS_LABEL: Record<string, string> = { completed: "Completed", started: "In progress", cancelled: "Cancelled", error: "Error" };

/* ------------------------------------------------------------------ misc */

export function Checkbox({ checked, indeterminate, onChange, label }: { checked: boolean; indeterminate?: boolean; onChange: (v: boolean) => void; label: string }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate && !checked;
  }, [indeterminate, checked]);
  return (
    <input
      ref={ref}
      type="checkbox"
      aria-label={label}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      onClick={(e) => e.stopPropagation()}
      className="h-4 w-4 cursor-pointer rounded border-slate-300 text-brand-600 accent-brand-600 focus:ring-2 focus:ring-brand-500/30 dark:border-white/20 dark:bg-white/5"
    />
  );
}

/** Trigger a browser download of an admin CSV endpoint (cookie-authenticated). */
export function downloadUrl(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/** Right-hand drawer (Escape / backdrop closes, focus moves into it). */
export function Drawer({ open, onClose, title, subtitle, children, actions }: { open: boolean; onClose: () => void; title: React.ReactNode; subtitle?: React.ReactNode; children: React.ReactNode; actions?: React.ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.querySelector('[role="alertdialog"]')) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[150]">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <div ref={panel} tabIndex={-1} role="dialog" aria-modal="true" className="absolute inset-y-0 end-0 flex w-full max-w-xl flex-col border-s border-slate-200 bg-white shadow-2xl outline-none dark:border-white/10 dark:bg-ink-900">
        <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-white/[0.06]">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
            {subtitle && <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{subtitle}</div>}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {actions}
            <button type="button" aria-label="Close panel" onClick={onClose} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

/** Error banner with retry. */
export function ErrorBox({ message, onRetry }: { message: string; onRetry: () => void }) {
  if (isFirebaseMissing(message)) return <FirebaseSetup />;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300">
      <span>Couldn’t load data: {message}</span>
      <button type="button" onClick={onRetry} className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 shadow-sm ring-1 ring-rose-200 hover:bg-rose-50 dark:bg-white/10 dark:text-rose-200 dark:ring-rose-400/30">
        Retry
      </button>
    </div>
  );
}

/** Simple ranked table row list with value + optional share bar. */
export function RankList({ rows, empty = "No data in this range", valueLabel = "Views" }: {
  rows: { key: string; label: React.ReactNode; value: number; sub?: React.ReactNode; extra?: React.ReactNode }[];
  empty?: string;
  valueLabel?: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  if (!rows.length) return <p className="py-8 text-center text-sm text-slate-400">{empty}</p>;
  return (
    <div>
      <div className="mb-1 flex justify-between px-3 text-[11px] font-medium uppercase tracking-wide text-slate-400">
        <span />
        <span>{valueLabel}</span>
      </div>
      <ul className="space-y-1">
        {rows.map((r) => (
          <li key={r.key} className="relative flex items-center justify-between gap-3 overflow-hidden rounded-lg px-3 py-1.5 text-sm">
            <span className="absolute inset-y-0 start-0 rounded-lg bg-brand-50 dark:bg-brand-400/10" style={{ width: `${(r.value / max) * 100}%` }} aria-hidden="true" />
            <span className="relative flex min-w-0 items-center gap-2 text-slate-700 dark:text-slate-200">{r.label}</span>
            <span className="relative flex shrink-0 items-center gap-3 tabular-nums">
              {r.extra}
              <span className="font-semibold text-slate-900 dark:text-white">{fmtNum(r.value)}</span>
              {r.sub != null && <span className="w-11 text-end text-xs text-slate-400">{r.sub}</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
