"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Check, Loader2, ChevronDown, Search, Lock } from "lucide-react";
import PhoneInput, {
  isValidPhoneNumber,
  getCountryCallingCode,
  type Country,
} from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import "react-phone-number-input/style.css";
import TurnstileWidget from "@/components/TurnstileWidget";
import { LocaleLink, useLocale } from "@/i18n/client";
import { pick } from "@/i18n/config";
import { contactMessages, type ContactMessages } from "@/i18n/messages/contact";

// Values sent to /api/contact stay in English (the inbox sees consistent subjects);
// only the visible labels are translated.
const SUBJECTS = [
  "General enquiry",
  "Cooperation / Partnership",
  "Support",
  "Press / Media",
  "Advertising",
  "Feedback",
  "Other",
] as const;

type Fields = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type Errors = Partial<Record<keyof Fields | "captcha", string>>;

const EMPTY: Fields = { name: "", email: "", phone: "", subject: "", message: "" };

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Map the API's (English) error messages to the visitor's language. */
function apiError(error: unknown, t: ContactMessages["form"]): string {
  const msg = typeof error === "string" ? error : "";
  if (/captcha/i.test(msg)) return t.errors.captchaFailed;
  if (/required/i.test(msg)) return t.errors.required;
  return t.errors.sendFailed;
}

export default function ContactForm() {
  const t = pick(contactMessages, useLocale()).form;
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [honeypot, setHoneypot] = useState(""); // bots fill this; humans don't
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  // Is the captcha configured? (site key set in Admin → Settings)
  useEffect(() => {
    fetch("/api/config", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setCaptchaRequired(Boolean(d?.turnstileSiteKey)))
      .catch(() => {});
  }, []);

  // Auto-detect the visitor's country (via IP) so the default dial code is right.
  // "" = still detecting; we mount the phone field only once we have a country.
  const [detected, setDetected] = useState<Country | "">("");
  useEffect(() => {
    let active = true;
    fetch("/api/ip", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (active) setDetected(((d?.ok && d.countryCode) || "MA") as Country);
      })
      .catch(() => active && setDetected("MA"));
    return () => {
      active = false;
    };
  }, []);

  const set = (key: keyof Fields, value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: Errors = {};
    if (fields.name.trim().length < 2) e.name = t.errors.name;
    if (!emailRe.test(fields.email.trim())) e.email = t.errors.email;
    if (!fields.phone || !isValidPhoneNumber(fields.phone)) e.phone = t.errors.phone;
    if (!fields.subject) e.subject = t.errors.subject;
    if (fields.message.trim().length < 10) e.message = t.errors.message;
    if (captchaRequired && !captchaToken) e.captcha = t.errors.captcha;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (honeypot) return; // silently drop bots
    if (!validate()) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, captchaToken, website: honeypot }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        // Captcha failed or invalid → message NOT sent.
        setErrors((er) => ({ ...er, captcha: apiError(data?.error, t) }));
        setStatus("idle");
        return;
      }
      setStatus("sent");
    } catch {
      setErrors((er) => ({ ...er, captcha: t.errors.network }));
      setStatus("idle");
    }
  };

  if (status === "sent") {
    const first = fields.name.trim().split(" ")[0] || t.sentFallbackName;
    return (
      <div role="status" className="card p-8 text-center sm:p-12">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-500 text-white shadow-lg shadow-accent-500/30">
          <Check className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">{t.sentTitle}</h2>
        <p className="muted mx-auto mt-2 max-w-sm text-sm leading-relaxed">{t.sentText.replace("{name}", first)}</p>
        <button
          type="button"
          onClick={() => {
            setFields(EMPTY);
            setCaptchaToken("");
            setStatus("idle");
          }}
          className="btn-secondary mt-7"
        >
          {t.sendAnother}
        </button>
      </div>
    );
  }

  // privacyNote contains one "[label](/privacy)" link
  const pm = t.privacyNote.match(/^([\s\S]*?)\[([^\]]+)\]\([^)]+\)([\s\S]*)$/);
  const [privacyBefore, privacyLabel, privacyAfter] = pm ? [pm[1], pm[2], pm[3]] : [t.privacyNote, "", ""];

  return (
    <form onSubmit={handleSubmit} noValidate className="card p-6 sm:p-8">
      <div className="mb-6 border-b border-slate-200/80 pb-5 dark:border-white/[0.08]">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{t.title}</h2>
        <p className="muted mt-1 text-sm">{t.subtitle}</p>
      </div>

      {/* Honeypot (hidden from humans) */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t.labels.name} error={errors.name}>
          <input
            type="text"
            autoComplete="name"
            value={fields.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder={t.placeholders.name}
            aria-invalid={Boolean(errors.name)}
            className={inputCls(errors.name)}
          />
        </Field>

        <Field label={t.labels.email} error={errors.email}>
          <input
            type="email"
            autoComplete="email"
            dir="ltr"
            value={fields.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder={t.placeholders.email}
            aria-invalid={Boolean(errors.email)}
            className={`${inputCls(errors.email)} rtl:text-end`}
          />
        </Field>

        <Field label={t.labels.phone} error={errors.phone}>
          {detected ? (
            <PhoneInput
              key={detected}
              international
              defaultCountry={detected}
              countrySelectComponent={CountrySelect}
              countrySelectProps={{ labels: t }}
              flags={flags}
              value={fields.phone || undefined}
              onChange={(value) => set("phone", value || "")}
              placeholder={t.placeholders.phone}
              dir="ltr"
              numberInputProps={{
                className:
                  "w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500",
                "aria-invalid": Boolean(errors.phone),
              }}
              className={`tsi-phone flex items-center gap-2 rounded-xl border bg-white px-3 py-2 transition focus-within:ring-4 focus-within:ring-brand-500/15 dark:bg-ink-900 ${
                errors.phone
                  ? "border-red-300 dark:border-red-400/50"
                  : "border-slate-200 focus-within:border-brand-500 dark:border-white/10 dark:focus-within:border-brand-400"
              }`}
            />
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-400 dark:border-white/10 dark:bg-ink-900 dark:text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {t.detecting}
            </div>
          )}
        </Field>

        <Field label={t.labels.subject} error={errors.subject}>
          <div className="relative">
            <select
              value={fields.subject}
              onChange={(e) => set("subject", e.target.value)}
              aria-invalid={Boolean(errors.subject)}
              className={`${inputCls(errors.subject)} appearance-none pe-10 ${
                fields.subject ? "" : "!text-slate-400 dark:!text-slate-500"
              }`}
            >
              <option value="" disabled>
                {t.placeholders.subject}
              </option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s} className="text-slate-900 dark:bg-ink-900 dark:text-white">
                  {t.subjects[s]}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute end-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
          </div>
        </Field>
      </div>

      <div className="mt-5">
        <Field label={t.labels.message} error={errors.message}>
          <textarea
            value={fields.message}
            onChange={(e) => set("message", e.target.value)}
            rows={6}
            placeholder={t.placeholders.message}
            aria-invalid={Boolean(errors.message)}
            className={`${inputCls(errors.message)} resize-y`}
          />
        </Field>
      </div>

      {/* Captcha (Cloudflare Turnstile) — shown when configured in Settings */}
      {captchaRequired && (
        <div className="mt-5">
          <TurnstileWidget
            onVerify={(tok) => {
              setCaptchaToken(tok);
              if (tok) setErrors((er) => ({ ...er, captcha: undefined }));
            }}
          />
          {errors.captcha && (
            <p role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
              {errors.captcha}
            </p>
          )}
        </div>
      )}
      {!captchaRequired && errors.captcha && (
        <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300">
          {errors.captcha}
        </p>
      )}

      <div className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="muted flex items-start gap-2 text-xs leading-relaxed">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>
            {privacyBefore}
            {privacyLabel && (
              <LocaleLink href="/privacy" className="link font-medium">
                {privacyLabel}
              </LocaleLink>
            )}
            {privacyAfter}
          </span>
        </p>
        <button type="submit" disabled={status === "sending"} className="btn-primary w-full shrink-0 px-6 sm:w-auto">
          {status === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {t.sending}
            </>
          ) : (
            <>
              <Send className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
              {t.send}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-xs font-medium text-red-600 dark:text-red-400">{error}</span>}
    </label>
  );
}

function inputCls(error?: string): string {
  return `input ${
    error ? "!border-red-300 focus:!border-red-400 focus:!ring-red-500/15 dark:!border-red-400/50" : ""
  }`;
}

type CountryOption = { value?: Country; label: string };

// Advanced searchable country selector (replaces the native <select>).
function CountrySelect({
  value,
  onChange,
  options,
  iconComponent: Icon,
  disabled,
  labels,
}: {
  value?: Country;
  onChange: (value?: Country) => void;
  options: CountryOption[];
  iconComponent: React.ComponentType<{ country?: Country; label: string }>;
  disabled?: boolean;
  labels: ContactMessages["form"];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const countries = options.filter((o): o is { value: Country; label: string } => Boolean(o.value));
  const q = query.trim().toLowerCase();
  const digits = q.replace(/\D/g, "");
  const filtered = q
    ? countries.filter(
        (o) =>
          o.label.toLowerCase().includes(q) ||
          (digits && getCountryCallingCode(o.value).includes(digits))
      )
    : countries;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        aria-label={labels.selectCountry}
        aria-expanded={open}
        className="flex items-center gap-1 rounded-lg p-1 transition-colors hover:bg-slate-100 dark:hover:bg-white/10"
      >
        <FlagBox>
          <Icon country={value} label={value ?? labels.international} />
        </FlagBox>
        <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
      </button>

      {open && (
        <div className="absolute start-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-white/10 dark:bg-ink-900 dark:shadow-black/40">
          <div className="relative border-b border-slate-100 p-2 dark:border-white/[0.06]">
            <Search
              className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={labels.searchCountry}
              aria-label={labels.searchCountry}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pe-3 ps-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-white/10 dark:bg-ink-950 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>
          <ul className="max-h-60 overflow-auto py-1">
            {filtered.map((o) => (
              <li key={o.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`flex w-full items-center gap-2.5 px-3 py-2 text-start text-sm transition-colors hover:bg-slate-50 dark:hover:bg-white/5 ${
                    o.value === value ? "bg-brand-50 dark:bg-brand-400/10" : ""
                  }`}
                >
                  <FlagBox>
                    <Icon country={o.value} label={o.label} />
                  </FlagBox>
                  <span className="flex-1 truncate text-slate-800 dark:text-slate-200">{o.label}</span>
                  <span className="tabular text-xs font-medium text-slate-400 dark:text-slate-500">
                    +{getCountryCallingCode(o.value)}
                  </span>
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-3 py-4 text-center text-sm text-slate-400 dark:text-slate-500">{labels.noCountries}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function FlagBox({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-[15px] w-5 shrink-0 items-center justify-center overflow-hidden rounded-[2px] ring-1 ring-black/10 dark:ring-white/15 [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_svg]:h-full [&_svg]:w-full">
      {children}
    </span>
  );
}
