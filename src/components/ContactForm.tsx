"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Check, Loader2, ChevronDown, Search } from "lucide-react";
import PhoneInput, {
  isValidPhoneNumber,
  getCountryCallingCode,
  type Country,
} from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import "react-phone-number-input/style.css";
import TurnstileWidget from "@/components/TurnstileWidget";

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

export default function ContactForm() {
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
    if (fields.name.trim().length < 2) e.name = "Please enter your full name.";
    if (!emailRe.test(fields.email.trim())) e.email = "Please enter a valid email address.";
    if (!fields.phone || !isValidPhoneNumber(fields.phone))
      e.phone = "Please enter a valid phone number for the selected country.";
    if (!fields.subject) e.subject = "Please choose a subject.";
    if (fields.message.trim().length < 10) e.message = "Your message should be at least 10 characters.";
    if (captchaRequired && !captchaToken) e.captcha = "Please complete the captcha.";
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
        setErrors((er) => ({ ...er, captcha: data.error || "Could not send your message. Please try again." }));
        setStatus("idle");
        return;
      }
      setStatus("sent");
    } catch {
      setErrors((er) => ({ ...er, captcha: "Network error. Please try again." }));
      setStatus("idle");
    }
  };

  if (status === "sent") {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
          <Check className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-xl font-bold text-slate-900">Message sent</h2>
        <p className="mt-2 text-sm text-slate-600">
          Thanks, {fields.name.split(" ")[0] || "there"}! We&apos;ll get back to you by email soon.
        </p>
        <button
          type="button"
          onClick={() => {
            setFields(EMPTY);
            setCaptchaToken("");
            setStatus("idle");
          }}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
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
        <Field label="Full name" error={errors.name}>
          <input
            type="text"
            value={fields.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="John Doe"
            className={inputCls(errors.name)}
          />
        </Field>

        <Field label="Email" error={errors.email}>
          <input
            type="email"
            value={fields.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
            className={inputCls(errors.email)}
          />
        </Field>

        <Field label="Phone number" error={errors.phone}>
          {detected ? (
            <PhoneInput
              key={detected}
              international
              defaultCountry={detected}
              countrySelectComponent={CountrySelect}
              flags={flags}
              value={fields.phone || undefined}
              onChange={(value) => set("phone", value || "")}
              placeholder="600 000000"
              numberInputProps={{
                className:
                  "w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none",
              }}
              className={`tsi-phone flex items-center gap-2 rounded-xl border bg-white px-3 py-2.5 transition-colors focus-within:ring-2 focus-within:ring-brand-500/40 ${
                errors.phone ? "border-red-300" : "border-slate-200 focus-within:border-brand-400"
              }`}
            />
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Detecting your country…
            </div>
          )}
        </Field>

        <Field label="Subject" error={errors.subject}>
          <select
            value={fields.subject}
            onChange={(e) => set("subject", e.target.value)}
            className={`${inputCls(errors.subject)} ${fields.subject ? "text-slate-900" : "text-slate-400"}`}
          >
            <option value="" disabled>
              Select a subject
            </option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s} className="text-slate-900">
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Message" error={errors.message}>
          <textarea
            value={fields.message}
            onChange={(e) => set("message", e.target.value)}
            rows={5}
            placeholder="How can we help you?"
            className={`${inputCls(errors.message)} resize-y`}
          />
        </Field>
      </div>

      {/* Captcha (Cloudflare Turnstile) — shown when configured in Settings */}
      {captchaRequired && (
        <div className="mt-5">
          <TurnstileWidget
            onVerify={(t) => {
              setCaptchaToken(t);
              if (t) setErrors((er) => ({ ...er, captcha: undefined }));
            }}
          />
          {errors.captcha && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.captcha}</p>}
        </div>
      )}
      {!captchaRequired && errors.captcha && (
        <p className="mt-3 text-xs font-medium text-red-500">{errors.captcha}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-colors hover:bg-brand-700 disabled:opacity-70 sm:w-auto"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden="true" />
            Send message
          </>
        )}
      </button>
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
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-xs font-medium text-red-500">{error}</span>}
    </label>
  );
}

function inputCls(error?: string): string {
  return `w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/40 ${
    error ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-brand-400"
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
}: {
  value?: Country;
  onChange: (value?: Country) => void;
  options: CountryOption[];
  iconComponent: React.ComponentType<{ country?: Country; label: string }>;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
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
        aria-label="Select country"
        className="flex items-center gap-1 rounded-lg p-1 transition-colors hover:bg-slate-100"
      >
        <FlagBox>
          <Icon country={value} label={value ?? "International"} />
        </FlagBox>
        <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="relative border-b border-slate-100 p-2">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country or code"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
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
                  className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50 ${
                    o.value === value ? "bg-brand-50" : ""
                  }`}
                >
                  <FlagBox>
                    <Icon country={o.value} label={o.label} />
                  </FlagBox>
                  <span className="flex-1 truncate text-slate-800">{o.label}</span>
                  <span className="text-xs font-medium text-slate-400">
                    +{getCountryCallingCode(o.value)}
                  </span>
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-3 py-4 text-center text-sm text-slate-400">No countries found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function FlagBox({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-[15px] w-5 shrink-0 items-center justify-center overflow-hidden rounded-[2px] ring-1 ring-black/10 [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_svg]:h-full [&_svg]:w-full">
      {children}
    </span>
  );
}
