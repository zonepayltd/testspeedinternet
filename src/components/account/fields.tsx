"use client";

// Form pieces for the account pages: labelled field, password with strength meter,
// phone with searchable country picker, country select, inline alerts.
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, ChevronDown, Eye, EyeOff, Search } from "lucide-react";
import PhoneInput, { getCountries, getCountryCallingCode, type Country } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import "react-phone-number-input/style.css";
import { LocaleLink } from "@/i18n/client";
import type { Locale } from "@/i18n/config";
import type { AccountMessages } from "@/i18n/messages/account";

export function inputCls(error?: string | boolean) {
  return `input ${error ? "!border-red-300 focus:!border-red-400 focus:!ring-red-500/15 dark:!border-red-400/50" : ""}`;
}

export function Field({ label, error, hint, children, htmlFor }: { label: string; error?: string; hint?: string; children: React.ReactNode; htmlFor?: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label">
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}

export function Alert({ tone = "error", children }: { tone?: "error" | "success" | "info"; children: React.ReactNode }) {
  const cls =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-800 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200"
      : tone === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200"
        : "border-brand-200 bg-brand-50 text-brand-800 dark:border-brand-400/20 dark:bg-brand-400/10 dark:text-brand-200";
  const Icon = tone === "success" ? CheckCircle2 : AlertCircle;
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm ${cls}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

/** Text with markdown-style [label](/path) links → locale-aware links. */
export function LinkText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <LocaleLink key={m.index} href={m[2]} target="_blank" className="link font-medium">
        {m[1]}
      </LocaleLink>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

export function passwordScore(pw: string): 0 | 1 | 2 | 3 | 4 {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (pw.length < 8) s = Math.min(s, 1);
  return Math.max(1, Math.min(4, s - (s > 1 ? 1 : 0))) as 1 | 2 | 3 | 4;
}

export function PasswordField({
  id, label, value, onChange, error, t, autoComplete = "current-password", meter = false, placeholder,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void; error?: string; t: AccountMessages; autoComplete?: string; meter?: boolean; placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  const score = passwordScore(value);
  const labels = [t.strength.weak, t.strength.weak, t.strength.fair, t.strength.good, t.strength.strong];
  const colors = ["bg-slate-200", "bg-rose-500", "bg-amber-500", "bg-brand-500", "bg-emerald-500"];
  return (
    <Field label={label} error={error} htmlFor={id}>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          dir="ltr"
          aria-invalid={Boolean(error)}
          className={`${inputCls(error)} pe-12 rtl:text-end`}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? t.fields.hide : t.fields.show}
          className="absolute end-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {meter && value && (
        <div className="mt-2 flex items-center gap-3" aria-live="polite">
          <div className="flex flex-1 gap-1" aria-hidden="true">
            {[1, 2, 3, 4].map((i) => (
              <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= score ? colors[score] : "bg-slate-200 dark:bg-white/10"}`} />
            ))}
          </div>
          <span className="w-16 text-end text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="sr-only">{t.strength.label}: </span>
            {labels[score]}
          </span>
        </div>
      )}
    </Field>
  );
}

/* ------------------------------- country helpers ------------------------------ */

export function useCountryOptions(locale: Locale) {
  return useMemo(() => {
    let dn: Intl.DisplayNames | null = null;
    try {
      dn = new Intl.DisplayNames([locale], { type: "region" });
    } catch {
      dn = null;
    }
    return getCountries()
      .map((c) => ({ value: c, label: dn?.of(c) || c }))
      .sort((a, b) => a.label.localeCompare(b.label, locale));
  }, [locale]);
}

export function englishCountry(cc: string) {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(cc) || cc;
  } catch {
    return cc;
  }
}

function FlagBox({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-[15px] w-5 shrink-0 items-center justify-center overflow-hidden rounded-[2px] ring-1 ring-black/10 dark:ring-white/15 [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_svg]:h-full [&_svg]:w-full">
      {children}
    </span>
  );
}

function FlagImg({ cc }: { cc: string }) {
  const F = (flags as Record<string, React.ComponentType<{ title: string }>>)[cc];
  return F ? <F title={cc} /> : <span className="text-[9px] text-slate-400">{cc}</span>;
}

/** Searchable country picker (used for the country field and the phone dial code). */
export function CountryPicker({
  value, onChange, t, locale, compact = false, invalid = false, id,
}: {
  value?: string; onChange: (cc: Country) => void; t: AccountMessages; locale: Locale; compact?: boolean; invalid?: boolean; id?: string;
}) {
  const options = useCountryOptions(locale);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const q = query.trim().toLowerCase();
  const digits = q.replace(/\D/g, "");
  const filtered = q ? options.filter((o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase() === q || (digits && getCountryCallingCode(o.value).includes(digits))) : options;
  const current = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t.fields.selectCountry}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={
          compact
            ? "flex items-center gap-1 rounded-lg p-1 transition-colors hover:bg-slate-100 dark:hover:bg-white/10"
            : `${inputCls(invalid)} flex items-center gap-2.5 text-start`
        }
      >
        <FlagBox>{value ? <FlagImg cc={value} /> : null}</FlagBox>
        {!compact && <span className={`flex-1 truncate ${current ? "" : "text-slate-400"}`}>{current?.label || t.fields.selectCountry}</span>}
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
      </button>

      {open && (
        <div className="absolute start-0 top-full z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-white/10 dark:bg-ink-900 dark:shadow-black/40">
          <div className="relative border-b border-slate-100 p-2 dark:border-white/[0.06]">
            <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.fields.searchCountry}
              aria-label={t.fields.searchCountry}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pe-3 ps-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-white/10 dark:bg-ink-950 dark:text-white"
            />
          </div>
          <ul role="listbox" className="max-h-60 overflow-auto py-1">
            {filtered.map((o) => (
              <li key={o.value} role="option" aria-selected={o.value === value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`flex w-full items-center gap-2.5 px-3 py-2 text-start text-sm transition-colors hover:bg-slate-50 dark:hover:bg-white/5 ${o.value === value ? "bg-brand-50 dark:bg-brand-400/10" : ""}`}
                >
                  <FlagBox>
                    <FlagImg cc={o.value} />
                  </FlagBox>
                  <span className="flex-1 truncate text-slate-800 dark:text-slate-200">{o.label}</span>
                  {compact && <span className="tabular text-xs font-medium text-slate-400">+{getCountryCallingCode(o.value)}</span>}
                </button>
              </li>
            ))}
            {filtered.length === 0 && <li className="px-3 py-4 text-center text-sm text-slate-400">{t.fields.noCountries}</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

function PhoneCountrySelect({ value, onChange, t, locale }: { value?: Country; onChange: (c?: Country) => void; t: AccountMessages; locale: Locale }) {
  return <CountryPicker compact value={value} onChange={(c) => onChange(c)} t={t} locale={locale} />;
}

/** Phone number with flag / dial-code picker. Value is E.164 ("+2126…") or "". */
export function PhoneField({
  id, value, onChange, defaultCountry, t, locale, error,
}: {
  id: string; value: string; onChange: (v: string) => void; defaultCountry?: string; t: AccountMessages; locale: Locale; error?: string;
}) {
  const dc = (defaultCountry && getCountries().includes(defaultCountry as Country) ? defaultCountry : undefined) as Country | undefined;
  return (
    <Field label={t.fields.phone} error={error} htmlFor={id}>
      <PhoneInput
        key={dc || "none"}
        id={id}
        international
        defaultCountry={dc}
        countrySelectComponent={PhoneCountrySelect}
        countrySelectProps={{ t, locale }}
        value={value || undefined}
        onChange={(v) => onChange(v || "")}
        placeholder={t.fields.phonePh}
        dir="ltr"
        numberInputProps={{
          className: "w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500",
          "aria-invalid": Boolean(error),
          autoComplete: "tel",
        }}
        className={`tsi-phone flex items-center gap-2 rounded-xl border bg-white px-3 py-2 transition focus-within:ring-4 focus-within:ring-brand-500/15 dark:bg-ink-900 ${
          error ? "border-red-300 dark:border-red-400/50" : "border-slate-200 focus-within:border-brand-500 dark:border-white/10 dark:focus-within:border-brand-400"
        }`}
      />
    </Field>
  );
}

/** Visitor's country from /api/ip (cached per page load). */
let detectPromise: Promise<string> | null = null;
export function detectCountry(): Promise<string> {
  detectPromise ??= fetch("/api/ip", { cache: "no-store" })
    .then((r) => r.json())
    .then((d) => String((d?.ok && d.countryCode) || "").toUpperCase())
    .catch(() => "");
  return detectPromise;
}
