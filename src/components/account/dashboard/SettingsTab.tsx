"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, Download, KeyRound, Loader2, MailWarning, Trash2, UserRound } from "lucide-react";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useLocale } from "@/i18n/client";
import { LOCALES, LOCALE_META, lp, pick, type Locale } from "@/i18n/config";
import { accountMessages, type AccountMessages } from "@/i18n/messages/account";
import { Alert, CountryPicker, Field, PasswordField, PhoneField, englishCountry, inputCls } from "../fields";
import { errText } from "../AuthForms";
import { apiJson, refreshAccount, setAccountUser, useAccount, type AccountUser } from "../useAccount";

function Section({ icon: Icon, title, text, children, danger = false }: { icon: React.ComponentType<{ className?: string }>; title: string; text?: string; children: React.ReactNode; danger?: boolean }) {
  return (
    <section className={`card p-5 sm:p-6 ${danger ? "!border-rose-200 dark:!border-rose-400/20" : ""}`}>
      <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
        <div>
          <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${danger ? "bg-rose-50 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300" : "bg-brand-50 text-brand-600 dark:bg-brand-400/10 dark:text-brand-300"}`}>
            <Icon className="h-5 w-5" />
          </span>
          <h2 className="mt-3 text-base font-bold text-slate-900 dark:text-white">{title}</h2>
          {text && <p className="muted mt-1 text-sm leading-relaxed">{text}</p>}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

export default function SettingsTab() {
  const locale = useLocale();
  const t = pick(accountMessages, locale);
  const { user } = useAccount();
  if (!user) return null;
  return (
    <div className="space-y-5">
      <ProfileForm key={user.id} user={user} t={t} locale={locale} />
      <PasswordForm t={t} />
      <Section icon={Download} title={t.settings.data} text={t.settings.dataText}>
        <a href="/api/account/export" className="btn-secondary" download>
          <Download className="h-4 w-4" aria-hidden="true" /> {t.settings.export}
        </a>
      </Section>
      <DeleteForm t={t} locale={locale} />
    </div>
  );
}

function ProfileForm({ user, t, locale }: { user: AccountUser; t: AccountMessages; locale: Locale }) {
  const [f, setF] = useState({ name: user.name, phone: user.phone, countryCode: user.countryCode, locale: user.locale || locale });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [resent, setResent] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (f.name.trim().length < 2) return setMsg({ tone: "error", text: t.errors.name });
    if (f.phone && !isValidPhoneNumber(f.phone)) return setMsg({ tone: "error", text: t.errors.phone });
    setBusy(true);
    const r = await apiJson<{ user?: AccountUser }>("/api/account/profile", "PUT", { name: f.name.trim(), phone: f.phone, countryCode: f.countryCode, country: englishCountry(f.countryCode), locale: f.locale });
    setBusy(false);
    if (!r.ok) return setMsg({ tone: "error", text: errText(t, r.error) });
    if (r.user) setAccountUser(r.user);
    setMsg({ tone: "success", text: t.settings.saved });
  };

  return (
    <Section icon={UserRound} title={t.settings.profile} text={t.settings.profileText}>
      <form onSubmit={save} className="space-y-5" noValidate>
        {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t.fields.name} htmlFor="st-name">
            <input id="st-name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" className={inputCls()} />
          </Field>
          <Field label={t.settings.email} htmlFor="st-email">
            <div className="flex items-center gap-2">
              <input id="st-email" value={user.email} readOnly dir="ltr" className={`${inputCls()} bg-slate-50 text-slate-500 rtl:text-end dark:bg-white/[0.03]`} />
              {user.emailVerified ? (
                <span title={t.settings.verified} className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <BadgeCheck className="h-4 w-4" aria-hidden="true" /> <span className="hidden sm:inline">{t.settings.verified}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={async () => {
                    const r = await apiJson("/api/account/resend", "POST", { locale });
                    setResent(r.ok);
                  }}
                  className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-amber-600 hover:underline dark:text-amber-400"
                >
                  <MailWarning className="h-4 w-4" aria-hidden="true" /> {resent ? t.dash.resent : t.dash.resend}
                </button>
              )}
            </div>
          </Field>
          <PhoneField id="st-phone" value={f.phone} onChange={(v) => setF({ ...f, phone: v })} defaultCountry={f.countryCode || undefined} t={t} locale={locale} />
          <Field label={t.fields.country} htmlFor="st-country">
            <CountryPicker id="st-country" value={f.countryCode} onChange={(c) => setF({ ...f, countryCode: c })} t={t} locale={locale} />
          </Field>
          <Field label={t.fields.language} htmlFor="st-lang">
            <select id="st-lang" value={f.locale} onChange={(e) => setF({ ...f, locale: e.target.value })} className="input">
              {LOCALES.map((l) => (
                <option key={l} value={l}>
                  {LOCALE_META[l].name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <button type="submit" disabled={busy} className="btn-primary">
          {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />} {t.settings.save}
        </button>
      </form>
    </Section>
  );
}

function PasswordForm({ t }: { t: AccountMessages }) {
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next.length < 8) return setMsg({ tone: "error", text: t.errors.short });
    if (!/[a-z]/i.test(next) || !/\d/.test(next)) return setMsg({ tone: "error", text: t.errors.weak });
    setBusy(true);
    const r = await apiJson("/api/account/password", "PUT", { currentPassword: cur, newPassword: next });
    setBusy(false);
    if (!r.ok) return setMsg({ tone: "error", text: errText(t, r.error) });
    setCur("");
    setNext("");
    setMsg({ tone: "success", text: t.settings.changed });
  };
  return (
    <Section icon={KeyRound} title={t.settings.password} text={t.settings.passwordText}>
      <form onSubmit={save} className="space-y-5" noValidate>
        {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
        <div className="grid gap-5 sm:grid-cols-2">
          <PasswordField id="st-cur" label={t.fields.currentPassword} value={cur} onChange={setCur} t={t} />
          <PasswordField id="st-new" label={t.fields.newPassword} value={next} onChange={setNext} t={t} autoComplete="new-password" meter />
        </div>
        <button type="submit" disabled={busy || !cur || !next} className="btn-primary">
          {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />} {t.settings.change}
        </button>
      </form>
    </Section>
  );
}

function DeleteForm({ t, locale }: { t: AccountMessages; locale: Locale }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const del = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const r = await apiJson("/api/account/delete", "POST", { password: pw });
    setBusy(false);
    if (!r.ok) return setError(errText(t, r.error));
    await refreshAccount();
    window.alert(t.settings.deleted);
    router.push(lp(locale, "/"));
  };
  return (
    <Section icon={Trash2} title={t.settings.danger} text={t.settings.dangerText} danger>
      {!open ? (
        <button type="button" onClick={() => setOpen(true)} className="btn border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 dark:border-rose-400/30 dark:bg-transparent dark:text-rose-300 dark:hover:bg-rose-400/10">
          <Trash2 className="h-4 w-4" aria-hidden="true" /> {t.settings.delete}
        </button>
      ) : (
        <form onSubmit={del} className="space-y-4" noValidate>
          {error && <Alert>{error}</Alert>}
          <PasswordField id="st-del" label={t.settings.deleteConfirm} value={pw} onChange={setPw} t={t} />
          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={busy || !pw} className="btn bg-rose-600 text-white hover:bg-rose-700">
              {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />} {t.settings.delete}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost">
              {t.settings.cancel}
            </button>
          </div>
        </form>
      )}
    </Section>
  );
}
