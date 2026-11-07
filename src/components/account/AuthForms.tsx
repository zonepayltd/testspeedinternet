"use client";

// Sign in, sign up, forgot password and reset password forms.
import { REQUIRE_EMAIL_VERIFICATION } from "@/lib/features";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, MailCheck } from "lucide-react";
import { isValidPhoneNumber } from "react-phone-number-input";
import SliderCaptcha from "@/components/SliderCaptcha";
import { LocaleLink, useLocale } from "@/i18n/client";
import { lp, pick } from "@/i18n/config";
import { accountMessages, fmt, type AccountMessages } from "@/i18n/messages/account";
import { Alert, CountryPicker, Field, LinkText, PasswordField, PhoneField, detectCountry, englishCountry, inputCls } from "./fields";
import { apiJson, refreshAccount } from "./useAccount";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function errText(t: AccountMessages, code?: string) {
  return (code && (t.errors as Record<string, string>)[code]) || t.errors.generic;
}

/** Only allow same-site relative paths for ?next= */
function safeNext(v: string | null): string | null {
  return v && v.startsWith("/") && !v.startsWith("//") && !v.includes("\\") ? v : null;
}

function Submit({ busy, children }: { busy: boolean; children: React.ReactNode }) {
  return (
    <button type="submit" disabled={busy} className="btn-primary w-full">
      {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      {children}
      {!busy && <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />}
    </button>
  );
}

/* ---------------------------------- Sign in ---------------------------------- */

export function LoginForm() {
  const locale = useLocale();
  const t = pick(accountMessages, locale);
  const router = useRouter();
  const sp = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailRe.test(email.trim()) || !password) return setError(t.errors.badLogin);
    setBusy(true);
    setError("");
    const r = await apiJson("/api/account/login", "POST", { email: email.trim(), password, claimTestId: sp.get("test") || undefined });
    if (!r.ok) {
      setBusy(false);
      return setError(errText(t, r.error));
    }
    await refreshAccount();
    router.push(safeNext(sp.get("next")) || lp(locale, "/account"));
    router.refresh();
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {error && <Alert>{error}</Alert>}
      <Field label={t.fields.email} htmlFor="li-email">
        <input id="li-email" type="email" autoComplete="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.fields.emailPh} className={`${inputCls()} rtl:text-end`} />
      </Field>
      <div>
        <PasswordField id="li-pw" label={t.fields.password} value={password} onChange={setPassword} t={t} />
        <div className="mt-2 text-end">
          <LocaleLink href="/account/forgot" className="link text-sm font-medium">
            {t.login.forgot}
          </LocaleLink>
        </div>
      </div>
      <Submit busy={busy}>{t.login.submit}</Submit>
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        {t.login.noAccount}{" "}
        <LocaleLink href={`/account/signup${sp.get("test") ? `?test=${encodeURIComponent(sp.get("test") || "")}` : ""}`} className="link font-semibold">
          {t.login.create}
        </LocaleLink>
      </p>
    </form>
  );
}

/* ---------------------------------- Sign up ---------------------------------- */

type SignupErrors = Partial<Record<"name" | "email" | "phone" | "country" | "password" | "terms" | "captcha", string>>;

export function SignupForm() {
  const locale = useLocale();
  const t = pick(accountMessages, locale);
  const router = useRouter();
  const sp = useSearchParams();
  const claimTestId = sp.get("test") || "";
  const [f, setF] = useState({ name: "", email: "", phone: "", countryCode: "", password: "", terms: false, marketing: false });
  const [detected, setDetected] = useState("");
  const [errors, setErrors] = useState<SignupErrors>({});
  const [captcha, setCaptcha] = useState("");
  const [captchaKey, setCaptchaKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ email: string; mailSent: boolean } | null>(null);

  // Country is filled in automatically from the visitor's IP.
  useEffect(() => {
    detectCountry().then((cc) => {
      const c = cc || "US";
      setDetected(c);
      setF((x) => (x.countryCode ? x : { ...x, countryCode: c }));
    });
  }, []);

  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => {
    setF((x) => ({ ...x, [k]: v }));
    setErrors((e) => ({ ...e, [k === "countryCode" ? "country" : k]: undefined }));
  };

  const validate = (): SignupErrors => {
    const e: SignupErrors = {};
    if (f.name.trim().length < 2) e.name = t.errors.name;
    if (!emailRe.test(f.email.trim())) e.email = t.errors.email;
    if (!f.phone || !isValidPhoneNumber(f.phone)) e.phone = t.errors.phone;
    if (!f.countryCode) e.country = t.errors.country;
    if (f.password.length < 8) e.password = t.errors.short;
    else if (!/[a-z]/i.test(f.password) || !/\d/.test(f.password)) e.password = t.errors.weak;
    if (!f.terms) e.terms = t.errors.terms;
    if (!captcha) e.captcha = t.errors.captcha;
    return e;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    setError("");
    const r = await apiJson<{ mailSent?: boolean }>("/api/account/signup", "POST", {
      name: f.name.trim(),
      email: f.email.trim(),
      phone: f.phone,
      countryCode: f.countryCode,
      country: englishCountry(f.countryCode),
      password: f.password,
      acceptTerms: f.terms,
      marketing: f.marketing,
      locale,
      captchaToken: captcha,
      claimTestId: claimTestId || undefined,
    });
    setBusy(false);
    // Pass tokens are single-use: always reset the captcha after a submit.
    setCaptcha("");
    setCaptchaKey((k) => k + 1);
    if (!r.ok) {
      const code = r.error || "generic";
      const fieldMap: Record<string, keyof SignupErrors> = { name: "name", email: "email", emailTaken: "email", phone: "phone", country: "country", short: "password", weak: "password", terms: "terms", captchaFailed: "captcha" };
      if (fieldMap[code]) setErrors({ [fieldMap[code]]: errText(t, code) });
      else setError(errText(t, code));
      return;
    }
    await refreshAccount();
    // No email confirmation for now: go straight to the dashboard.
    if (!REQUIRE_EMAIL_VERIFICATION) {
      router.push(safeNext(sp.get("next")) || lp(locale, "/account"));
      return;
    }
    setDone({ email: f.email.trim(), mailSent: !!r.mailSent });
  };

  if (done) {
    return (
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20">
          <MailCheck className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">{t.signup.doneTitle}</h2>
        <p className="muted mx-auto mt-2 max-w-sm text-sm leading-relaxed">{done.mailSent ? fmt(t.signup.doneText, { email: done.email }) : t.signup.mailFailed}</p>
        <button type="button" onClick={() => router.push(safeNext(sp.get("next")) || lp(locale, "/account"))} className="btn-primary mt-6">
          {t.signup.go} <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {claimTestId && <Alert tone="info">{t.signup.claim}</Alert>}
      {error && <Alert>{error}</Alert>}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t.fields.name} error={errors.name} htmlFor="su-name">
          <input id="su-name" type="text" autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} placeholder={t.fields.namePh} aria-invalid={Boolean(errors.name)} className={inputCls(errors.name)} />
        </Field>
        <Field label={t.fields.email} error={errors.email} htmlFor="su-email">
          <input id="su-email" type="email" autoComplete="email" dir="ltr" value={f.email} onChange={(e) => set("email", e.target.value)} placeholder={t.fields.emailPh} aria-invalid={Boolean(errors.email)} className={`${inputCls(errors.email)} rtl:text-end`} />
        </Field>
        <PhoneField id="su-phone" value={f.phone} onChange={(v) => set("phone", v)} defaultCountry={detected || undefined} t={t} locale={locale} error={errors.phone} />
        <Field label={t.fields.country} error={errors.country} hint={t.fields.countryAuto} htmlFor="su-country">
          <CountryPicker id="su-country" value={f.countryCode} onChange={(c) => set("countryCode", c)} t={t} locale={locale} invalid={Boolean(errors.country)} />
        </Field>
      </div>
      <PasswordField id="su-pw" label={t.fields.password} value={f.password} onChange={(v) => set("password", v)} error={errors.password} t={t} autoComplete="new-password" meter placeholder={t.fields.passwordPh} />

      <div className="space-y-3">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
          <input type="checkbox" checked={f.terms} onChange={(e) => set("terms", e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-brand-500" aria-invalid={Boolean(errors.terms)} />
          <span>
            <LinkText text={t.fields.terms} />
          </span>
        </label>
        {errors.terms && <p role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">{errors.terms}</p>}
        <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
          <input type="checkbox" checked={f.marketing} onChange={(e) => set("marketing", e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
          <span>{t.fields.marketing}</span>
        </label>
      </div>

      <div>
        <SliderCaptcha key={captchaKey} context="signup" locale={locale} onChange={(p) => { setCaptcha(p); setErrors((e) => ({ ...e, captcha: undefined })); }} invalid={Boolean(errors.captcha)} />
        {errors.captcha && <p role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{errors.captcha}</p>}
      </div>

      <Submit busy={busy}>{t.signup.submit}</Submit>
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        {t.signup.have}{" "}
        <LocaleLink href="/account/login" className="link font-semibold">
          {t.signup.signIn}
        </LocaleLink>
      </p>
    </form>
  );
}

/* ------------------------------ Forgot password ------------------------------ */

export function ForgotForm() {
  const locale = useLocale();
  const t = pick(accountMessages, locale);
  const [email, setEmail] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaKey, setCaptchaKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailRe.test(email.trim())) return setError(t.errors.email);
    if (!captcha) return setError(t.errors.captcha);
    setBusy(true);
    setError("");
    const r = await apiJson("/api/account/forgot", "POST", { email: email.trim(), captchaToken: captcha, locale });
    setBusy(false);
    setCaptcha("");
    setCaptchaKey((k) => k + 1);
    if (!r.ok) return setError(errText(t, r.error));
    setSent(true);
  };

  if (sent) {
    return (
      <div className="space-y-5">
        <Alert tone="success">
          <p className="font-semibold">{t.forgot.sentTitle}</p>
          <p className="mt-1">{fmt(t.forgot.sent, { email: email.trim() })}</p>
        </Alert>
        <LocaleLink href="/account/login" className="btn-secondary w-full">
          {t.forgot.back}
        </LocaleLink>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {error && <Alert>{error}</Alert>}
      <Field label={t.fields.email} htmlFor="fp-email">
        <input id="fp-email" type="email" autoComplete="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.fields.emailPh} className={`${inputCls()} rtl:text-end`} />
      </Field>
      <SliderCaptcha key={captchaKey} context="account" locale={locale} onChange={setCaptcha} />
      <Submit busy={busy}>{t.forgot.submit}</Submit>
      <p className="text-center text-sm">
        <LocaleLink href="/account/login" className="link font-medium">
          {t.forgot.back}
        </LocaleLink>
      </p>
    </form>
  );
}

/* ------------------------------- Reset password ------------------------------ */

export function ResetForm() {
  const locale = useLocale();
  const t = pick(accountMessages, locale);
  const router = useRouter();
  const token = useSearchParams().get("token") || "";
  const [valid, setValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return setValid(false);
    fetch(`/api/account/reset?token=${encodeURIComponent(token)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setValid(!!d.ok))
      .catch(() => setValid(false));
  }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return setError(t.errors.short);
    if (!/[a-z]/i.test(password) || !/\d/.test(password)) return setError(t.errors.weak);
    setBusy(true);
    setError("");
    const r = await apiJson("/api/account/reset", "POST", { token, password });
    if (!r.ok) {
      setBusy(false);
      if (r.error === "tokenInvalid") setValid(false);
      return setError(errText(t, r.error));
    }
    await refreshAccount();
    router.push(lp(locale, "/account"));
  };

  if (valid === null) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-slate-400" aria-hidden="true" /></div>;
  if (!valid) {
    return (
      <div className="space-y-5">
        <Alert>{t.reset.invalid}</Alert>
        <LocaleLink href="/account/forgot" className="btn-primary w-full">
          {t.reset.again}
        </LocaleLink>
      </div>
    );
  }
  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {error && <Alert>{error}</Alert>}
      <PasswordField id="rp-pw" label={t.fields.newPassword} value={password} onChange={setPassword} t={t} autoComplete="new-password" meter placeholder={t.fields.passwordPh} />
      <Submit busy={busy}>{t.reset.submit}</Submit>
    </form>
  );
}
