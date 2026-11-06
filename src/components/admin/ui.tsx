"use client";

// Admin design kit — use these building blocks on every admin page so the
// dashboard looks consistent. All components support light + dark mode.

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Info, Loader2, Search, X, type LucideIcon } from "lucide-react";

/* ----------------------------------------------------------------------------
 * Formatting helpers
 * ------------------------------------------------------------------------- */

export const fmtNum = (n: number | null | undefined, digits = 0) =>
  n == null || !Number.isFinite(n) ? "–" : new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(n);

export const fmtCompact = (n: number | null | undefined) =>
  n == null ? "–" : new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);

export function timeAgo(ms: number): string {
  if (!ms) return "–";
  const s = Math.round((Date.now() - ms) / 1000);
  if (s < 10) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return d < 30 ? `${d}d ago` : new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export const fmtDateTime = (ms: number) =>
  ms ? new Date(ms).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "–";

export const flagSrc = (cc?: string) => (cc && cc.length === 2 ? `https://flagcdn.com/24x18/${cc.toLowerCase()}.png` : "");

export function Flag({ cc, className = "" }: { cc?: string; className?: string }) {
  const src = flagSrc(cc);
  if (!src) return <span className={`inline-block h-3 w-4 rounded-[2px] bg-slate-200 dark:bg-white/10 ${className}`} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={cc} width={16} height={12} className={`inline-block h-3 w-4 rounded-[2px] object-cover ring-1 ring-black/10 ${className}`} />;
}

/** fetch JSON with a consistent shape; throws on network or {ok:false}. */
export async function api<T = Record<string, unknown>>(url: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const { json, ...rest } = init || {};
  const res = await fetch(url, {
    cache: "no-store",
    ...rest,
    headers: { ...(json !== undefined ? { "Content-Type": "application/json" } : {}), ...(rest.headers || {}) },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });
  const data = (await res.json().catch(() => ({}))) as T & { ok?: boolean; error?: string };
  if (!res.ok || data.ok === false) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

/* ----------------------------------------------------------------------------
 * Layout
 * ------------------------------------------------------------------------- */

export function PageHeader({ title, description, icon: Icon, actions }: { title: string; description?: string; icon?: LucideIcon; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-3">
        {Icon && (
          <span className="mt-0.5 hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100 dark:bg-brand-400/10 dark:text-brand-300 dark:ring-brand-400/20 sm:flex">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
          {description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ title, description, actions, children, className = "", bodyClassName = "p-5", icon: Icon }: {
  title?: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  icon?: LucideIcon;
}) {
  return (
    <section className={`overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.02] dark:border-white/[0.08] dark:bg-ink-900 ${className}`}>
      {(title || actions) && (
        <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5 dark:border-white/[0.06]">
          <div className="flex min-w-0 items-center gap-2">
            {Icon && <Icon className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />}
            <div className="min-w-0">
              {title && <h2 className="truncate text-sm font-semibold text-slate-900 dark:text-white">{title}</h2>}
              {description && <p className="truncate text-xs text-slate-500 dark:text-slate-400">{description}</p>}
            </div>
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

const TONES = {
  blue: "bg-brand-50 text-brand-600 ring-brand-100 dark:bg-brand-400/10 dark:text-brand-300 dark:ring-brand-400/20",
  green: "bg-emerald-50 text-emerald-600 ring-emerald-100 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20",
  violet: "bg-violet-50 text-violet-600 ring-violet-100 dark:bg-violet-400/10 dark:text-violet-300 dark:ring-violet-400/20",
  amber: "bg-amber-50 text-amber-600 ring-amber-100 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20",
  rose: "bg-rose-50 text-rose-600 ring-rose-100 dark:bg-rose-400/10 dark:text-rose-300 dark:ring-rose-400/20",
  cyan: "bg-cyan-50 text-cyan-600 ring-cyan-100 dark:bg-cyan-400/10 dark:text-cyan-300 dark:ring-cyan-400/20",
  slate: "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-white/[0.06] dark:text-slate-300 dark:ring-white/10",
} as const;
export type Tone = keyof typeof TONES;

/** KPI tile: label, big value, optional change vs previous period and live dot. */
export function StatCard({ label, value, icon: Icon, tone = "blue", delta, hint, live, loading, children }: {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  tone?: Tone;
  /** percentage change, e.g. 12.5 or -3 */
  delta?: number | null;
  hint?: string;
  live?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02] dark:border-white/[0.08] dark:bg-ink-900">
      <div className="flex items-start justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
          {live && (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          )}
          {label}
        </p>
        {Icon && (
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${TONES[tone]}`}>
            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
        )}
      </div>
      <div className="mt-2 text-3xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-white">
        {loading ? <span className="inline-block h-8 w-20 animate-pulse rounded-md bg-slate-100 dark:bg-white/[0.06]" /> : value}
      </div>
      <div className="mt-1.5 flex items-center gap-2 text-xs">
        {delta != null && Number.isFinite(delta) && (
          <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 font-semibold ${delta >= 0 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300" : "bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300"}`}>
            {delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(Math.abs(delta) < 10 ? 1 : 0)}%
          </span>
        )}
        {hint && <span className="text-slate-400 dark:text-slate-500">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export function Badge({ children, tone = "slate", className = "" }: { children: React.ReactNode; tone?: Tone; className?: string }) {
  return <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${TONES[tone]} ${className}`}>{children}</span>;
}

/* ----------------------------------------------------------------------------
 * Buttons & inputs
 * ------------------------------------------------------------------------- */

type BtnVariant = "primary" | "secondary" | "ghost" | "danger" | "danger-ghost";
const BTN: Record<BtnVariant, string> = {
  primary: "bg-brand-600 text-white shadow-sm hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400",
  secondary: "border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-white",
  danger: "bg-rose-600 text-white shadow-sm hover:bg-rose-700",
  "danger-ghost": "text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-400/10",
};

export function Button({ variant = "secondary", size = "md", icon: Icon, loading, children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: BtnVariant;
  size?: "sm" | "md";
  icon?: LucideIcon;
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      {...props}
      disabled={props.disabled || loading}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${size === "sm" ? "h-8 px-2.5 text-xs" : "h-9 px-3.5 text-sm"} ${BTN[variant]} ${className}`}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : Icon ? <Icon className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

/** Square icon-only button (needs a label for screen readers). */
export function IconButton({ icon: Icon, label, variant = "ghost", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { icon: LucideIcon; label: string; variant?: BtnVariant }) {
  return (
    <button type="button" aria-label={label} title={label} {...props} className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:opacity-50 ${BTN[variant]} ${props.className || ""}`}>
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

export const inputCls =
  "h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500";

export function SearchInput({ value, onChange, placeholder = "Search…", className = "" }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${inputCls} ps-9`} />
    </div>
  );
}

export function Select<T extends string>({ value, onChange, options, className = "" }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; className?: string }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as T)} className={`${inputCls} pe-8 ${className}`}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Toggle({ checked, onChange, label, disabled }: { checked: boolean; onChange: (v: boolean) => void; label?: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${checked ? "bg-brand-600 dark:bg-brand-500" : "bg-slate-200 dark:bg-white/15"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-[18px]" : "translate-x-0.5"}`} />
    </button>
  );
}

/** Segmented control, e.g. date ranges: Today / 7d / 30d / 90d. */
export function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-white/10 dark:bg-white/[0.04]">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${value === o.value ? "bg-white text-slate-900 shadow-sm dark:bg-white/10 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Tables & states
 * ------------------------------------------------------------------------- */

export function Table({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-start text-sm [&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-2.5">{children}</table>
    </div>
  );
}
export function THead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="border-b border-slate-100 bg-slate-50/80 text-xs font-medium uppercase tracking-wide text-slate-500 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-slate-400 [&_th]:text-start [&_th]:font-medium">
      {children}
    </thead>
  );
}
export function TBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-slate-100 text-slate-700 dark:divide-white/[0.06] dark:text-slate-300 [&_tr:hover]:bg-slate-50/70 dark:[&_tr:hover]:bg-white/[0.02]">{children}</tbody>;
}

export function EmptyState({ icon: Icon = Info, title, description, action }: { icon?: LucideIcon; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-white/[0.06] dark:text-slate-500">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <span className={`block animate-pulse rounded-md bg-slate-100 dark:bg-white/[0.06] ${className}`} />;
}

export function Pagination({ page, pages, onPage }: { page: number; pages: number; onPage: (p: number) => void }) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-xs text-slate-500 dark:border-white/[0.06] dark:text-slate-400">
      <span>
        Page {page} of {pages}
      </span>
      <div className="flex gap-1">
        <IconButton icon={ChevronLeft} label="Previous page" variant="secondary" disabled={page <= 1} onClick={() => onPage(page - 1)} />
        <IconButton icon={ChevronRight} label="Next page" variant="secondary" disabled={page >= pages} onClick={() => onPage(page + 1)} />
      </div>
    </div>
  );
}

/** Horizontal bar list (top pages, sources, countries…). */
export function BarList({ items, format = fmtNum, empty = "No data yet" }: { items: { label: React.ReactNode; value: number; key?: string }[]; format?: (n: number) => string; empty?: string }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  if (!items.length) return <p className="py-6 text-center text-sm text-slate-400">{empty}</p>;
  return (
    <ul className="space-y-1.5">
      {items.map((it, i) => (
        <li key={it.key ?? i} className="relative flex items-center justify-between gap-3 overflow-hidden rounded-lg px-3 py-2 text-sm">
          <span className="absolute inset-y-0 start-0 rounded-lg bg-brand-50 dark:bg-brand-400/10" style={{ width: `${(it.value / max) * 100}%` }} aria-hidden="true" />
          <span className="relative min-w-0 truncate text-slate-700 dark:text-slate-200">{it.label}</span>
          <span className="relative shrink-0 font-semibold tabular-nums text-slate-900 dark:text-white">{format(it.value)}</span>
        </li>
      ))}
    </ul>
  );
}

/* ----------------------------------------------------------------------------
 * Confirm dialog + toasts (wrap the admin in <AdminUIProvider>)
 * ------------------------------------------------------------------------- */

type ConfirmOpts = { title: string; message?: string; confirmLabel?: string; danger?: boolean };
type Toast = { id: number; message: string; tone: "success" | "error" | "info" };
const UICtx = createContext<{ confirm: (o: ConfirmOpts) => Promise<boolean>; toast: (m: string, tone?: Toast["tone"]) => void } | null>(null);

export function AdminUIProvider({ children }: { children: React.ReactNode }) {
  const [dialog, setDialog] = useState<(ConfirmOpts & { resolve: (v: boolean) => void }) | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const confirm = useCallback((o: ConfirmOpts) => new Promise<boolean>((resolve) => setDialog({ ...o, resolve })), []);
  const toast = useCallback((message: string, tone: Toast["tone"] = "success") => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const close = (v: boolean) => {
    dialog?.resolve(v);
    setDialog(null);
  };

  useEffect(() => {
    if (!dialog) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog]);

  return (
    <UICtx.Provider value={{ confirm, toast }}>
      {children}
      {dialog && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" onClick={() => close(false)}>
          <div role="alertdialog" aria-modal="true" className="w-full max-w-md animate-scale-in rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-ink-900" onClick={(e) => e.stopPropagation()}>
            <div className="flex gap-4">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${dialog.danger !== false ? "bg-rose-50 text-rose-600 dark:bg-rose-400/10 dark:text-rose-400" : "bg-brand-50 text-brand-600"}`}>
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">{dialog.title}</h3>
                {dialog.message && <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{dialog.message}</p>}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button onClick={() => close(false)}>Cancel</Button>
              <Button variant={dialog.danger !== false ? "danger" : "primary"} onClick={() => close(true)} autoFocus>
                {dialog.confirmLabel || "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="pointer-events-none fixed bottom-4 end-4 z-[210] flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto flex animate-fade-in-up items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-lg dark:border-white/10 dark:bg-ink-900 dark:text-slate-100">
            {t.tone === "error" ? <AlertTriangle className="h-4 w-4 text-rose-500" /> : t.tone === "info" ? <Info className="h-4 w-4 text-brand-500" /> : <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
            {t.message}
            <button type="button" aria-label="Dismiss" onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))} className="ms-1 text-slate-400 hover:text-slate-700">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </UICtx.Provider>
  );
}

/** const { confirm, toast } = useAdminUI(); if (await confirm({ title: "Delete?" })) … */
export function useAdminUI() {
  const ctx = useContext(UICtx);
  if (!ctx) throw new Error("useAdminUI must be used inside <AdminUIProvider>");
  return ctx;
}
