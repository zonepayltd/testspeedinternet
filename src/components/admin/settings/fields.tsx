"use client";

import { useId, useState } from "react";
import { AlertCircle, CheckCircle2, ExternalLink, Eye, EyeOff } from "lucide-react";
import { Toggle, inputCls } from "@/components/admin/ui";

/* ------------------------------- validation -------------------------------- */

export const isUrl = (v: string) => /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(v);

/** Returns an error message or null. Empty values are always valid (= not set). */
export const validators = {
  ga: (v: string) => (!v || /^G-[A-Z0-9]{4,12}$/.test(v) ? null : "Should look like G-XXXXXXXXXX (GA4 measurement ID)."),
  adsense: (v: string) => (!v || /^ca-pub-\d{16}$/.test(v) ? null : "Should be ca-pub- followed by 16 digits."),
  turnstileKey: (v: string) => (!v || /^[0-9]x[A-Za-z0-9_-]{10,}$/.test(v) ? null : "Turnstile keys start with 0x… (or 1x/2x/3x test keys)."),
  url: (v: string) => (!v || isUrl(v) ? null : "Enter a full URL starting with https://"),
  token: (v: string) => (!v || /^[A-Za-z0-9_\-=+/.]+$/.test(v) ? null : "Paste only the content value, without spaces or quotes."),
  slot: (v: string) => (!v || /^\d{6,}$/.test(v) ? null : "Ad slot IDs are digits only."),
};

/** People often paste the whole <meta … content="xyz" /> tag — keep only the value. */
export function extractMetaContent(v: string): string {
  const m = v.match(/content\s*=\s*["']([^"']+)["']/i);
  return (m ? m[1] : v).trim();
}

/* --------------------------------- layout ---------------------------------- */

/** A titled group of settings inside a tab. */
export function Section({ title, description, children, actions }: { title: string; description?: React.ReactNode; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.02] dark:border-white/[0.08] dark:bg-ink-900">
      <header className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 dark:border-white/[0.06] sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </header>
      <div className="divide-y divide-slate-100 dark:divide-white/[0.06]">{children}</div>
    </section>
  );
}

/** Label + help on the left, control on the right (stacks on mobile). */
export function Field({ label, help, error, children, htmlFor, status }: {
  label: string;
  help?: React.ReactNode;
  error?: string | null;
  children: React.ReactNode;
  htmlFor?: string;
  status?: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 px-5 py-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-6">
      <div className="min-w-0">
        <label htmlFor={htmlFor} className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-100">
          {label}
          {status}
        </label>
        {help && <div className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{help}</div>}
      </div>
      <div className="min-w-0">
        {children}
        {error && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400" role="alert">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export function TextField({ label, help, value, onChange, placeholder, validate, mono, type = "text", status, transform }: {
  label: string;
  help?: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  validate?: (v: string) => string | null;
  mono?: boolean;
  type?: string;
  status?: React.ReactNode;
  transform?: (v: string) => string;
}) {
  const id = useId();
  const error = validate ? validate(value.trim()) : null;
  return (
    <Field label={label} help={help} error={error} htmlFor={id} status={status}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(transform ? transform(e.target.value) : e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
        aria-invalid={Boolean(error)}
        className={`${inputCls} ${mono ? "font-mono text-[13px]" : ""} ${error ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10 dark:border-rose-400/40" : ""}`}
      />
    </Field>
  );
}

/** Masked input with a reveal button (for secrets). */
export function SecretField({ label, help, value, onChange, placeholder, validate }: {
  label: string;
  help?: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  validate?: (v: string) => string | null;
}) {
  const id = useId();
  const [show, setShow] = useState(false);
  const error = validate ? validate(value.trim()) : null;
  return (
    <Field label={label} help={help} error={error} htmlFor={id}>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          spellCheck={false}
          autoComplete="new-password"
          className={`${inputCls} pe-10 font-mono text-[13px]`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide secret" : "Reveal secret"}
          title={show ? "Hide" : "Reveal"}
          className="absolute inset-y-0 end-0 flex w-9 items-center justify-center rounded-e-lg text-slate-400 hover:text-slate-700 focus:outline-none focus-visible:text-brand-600 dark:hover:text-slate-200"
        >
          {show ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>
    </Field>
  );
}

export function ToggleField({ label, help, checked, onChange, disabled }: { label: string; help?: React.ReactNode; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-6 px-5 py-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{label}</p>
        {help && <div className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{help}</div>}
      </div>
      <div className="pt-0.5">
        <Toggle checked={checked} onChange={onChange} label={label} disabled={disabled} />
      </div>
    </div>
  );
}

export function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-medium text-brand-600 hover:text-brand-700 hover:underline dark:text-brand-400 dark:hover:text-brand-300">
      {children}
      <ExternalLink className="h-3 w-3" aria-hidden="true" />
    </a>
  );
}

/** Small "Set" / "Not set" pill next to a field label. */
export function SetPill({ on, onLabel = "Set", offLabel = "Not set" }: { on: boolean; onLabel?: string; offLabel?: string }) {
  return on ? (
    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-100 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20">
      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
      {onLabel}
    </span>
  ) : (
    <span className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500 ring-1 ring-inset ring-slate-200 dark:bg-white/[0.06] dark:text-slate-400 dark:ring-white/10">{offLabel}</span>
  );
}

/** Calm callout box. */
export function Note({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "warn" }) {
  return (
    <div
      className={`flex gap-2.5 rounded-xl px-4 py-3 text-sm ${
        tone === "warn"
          ? "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-100 dark:bg-amber-400/10 dark:text-amber-200 dark:ring-amber-400/20"
          : "bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-100 dark:bg-white/[0.03] dark:text-slate-300 dark:ring-white/[0.06]"
      }`}
    >
      {children}
    </div>
  );
}
