"use client";

// Review form used after a speed test and on provider pages.
// Guests: name + email + captcha (the review is published after they confirm their email).
// Signed-in users (from /api/account/me): prefilled, no captcha; verified accounts publish instantly.

import { useEffect, useState } from "react";
import Link from "next/link";
import { BadgeCheck, CheckCircle2, Loader2, MailCheck, Send } from "lucide-react";
import SliderCaptcha from "@/components/SliderCaptcha";
import { StarInput } from "@/components/reviews/Stars";
import { useLocale } from "@/i18n/client";
import { lp, pick } from "@/i18n/config";
import { fill, reviewsMessages } from "@/i18n/messages/reviews";

type Me = { name: string; email: string; emailVerified: boolean } | null;
export type ReviewResult = { status: "published" | "pending"; mailSent: boolean; providerSlug: string; email: string };

let meCache: Promise<Me> | null = null;
/** Signed-in user (built by the accounts feature). Missing route / logged out → null. */
export function fetchMe(): Promise<Me> {
  meCache ??= fetch("/api/account/me", { cache: "no-store", credentials: "same-origin" })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      const u = d?.user;
      return u && u.email ? { name: String(u.name || ""), email: String(u.email), emailVerified: !!u.emailVerified } : null;
    })
    .catch(() => null);
  return meCache;
}

export default function ReviewForm({
  provider,
  providerDomain = "",
  testId,
  rating: initialRating = 0,
  verified = false,
  onCancel,
  onDone,
  idPrefix = "rv",
}: {
  provider: string;
  providerDomain?: string;
  testId?: string;
  rating?: number;
  /** Show the "your measured speed will be attached" note. */
  verified?: boolean;
  onCancel?: () => void;
  onDone?: (r: ReviewResult) => void;
  idPrefix?: string;
}) {
  const locale = useLocale();
  const m = pick(reviewsMessages, locale);
  const [me, setMe] = useState<Me>(null);
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<keyof typeof m.errors | "">("");
  const [result, setResult] = useState<ReviewResult | null>(null);

  useEffect(() => setRating(initialRating), [initialRating]);
  useEffect(() => {
    fetchMe().then((u) => {
      setMe(u);
      if (u) setName((n) => n || u.name);
    });
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!rating) return setError("rating");
    if (comment.trim().length < 10) return setError("comment_short");
    if (name.trim().length < 2) return setError("name");
    if (!me && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email.trim())) return setError("email");
    if (!me && !captcha) return setError("captcha");
    setBusy(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, providerDomain, rating, title, comment, name, email: me ? undefined : email, testId, locale, captchaToken: captcha, website: honeypot }),
      });
      const d = await res.json().catch(() => ({}));
      if (!d.ok) {
        const code = String(d.error || "generic") as keyof typeof m.errors;
        setError(code in m.errors ? code : "generic");
        if (code === "captcha") setCaptcha("");
        return;
      }
      const r: ReviewResult = { status: d.status, mailSent: !!d.mailSent, providerSlug: d.providerSlug, email: me?.email || email.trim() };
      setResult(r);
      onDone?.(r);
    } catch {
      setError("generic");
    } finally {
      setBusy(false);
    }
  };

  if (result) {
    const published = result.status === "published";
    return (
      <div role="status" className={`flex items-start gap-3 rounded-xl p-4 ${published ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-100" : "bg-brand-50 text-brand-900 dark:bg-brand-400/10 dark:text-brand-100"}`}>
        {published ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" aria-hidden="true" /> : <MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" aria-hidden="true" />}
        <div className="min-w-0 text-sm">
          <p className="font-semibold">{published ? m.success.publishedTitle : m.success.pendingTitle}</p>
          {published ? (
            <Link href={lp(locale, `/providers/${result.providerSlug}`)} className="link mt-1 inline-block">
              {fill(m.success.publishedLink, { provider })}
            </Link>
          ) : (
            <p className="mt-1 break-words opacity-90">{result.mailSent ? fill(m.success.pendingText, { email: result.email }) : m.success.pendingNoMail}</p>
          )}
        </div>
      </div>
    );
  }

  const fieldId = (s: string) => `${idPrefix}-${s}`;
  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <fieldset>
        <legend className="label">{m.form.rating}</legend>
        <StarInput value={rating} onChange={(n) => { setRating(n); if (error === "rating") setError(""); }} hover={hover} onHover={setHover} labels={m.stars} legend={m.form.rating} size={30} name={fieldId("rating")} />
      </fieldset>

      <div>
        <label htmlFor={fieldId("title")} className="label">{m.form.title}</label>
        <input id={fieldId("title")} className="input" maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={m.form.titlePh} />
      </div>

      <div>
        <label htmlFor={fieldId("comment")} className="label">{m.form.comment}</label>
        <textarea
          id={fieldId("comment")}
          className="input min-h-[110px] resize-y"
          maxLength={2000}
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={m.form.commentPh}
          aria-describedby={fieldId("comment-hint")}
          aria-invalid={error === "comment_short" || error === "comment_long" || error === "links" || undefined}
        />
        <p id={fieldId("comment-hint")} className="mt-1 flex justify-between text-xs muted">
          <span>{m.form.commentHint}</span>
          <span className="tabular-nums">{comment.length}/2000</span>
        </p>
      </div>

      {me ? (
        <p className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:bg-white/[0.04] dark:text-slate-300">
          <BadgeCheck className="h-4 w-4 text-brand-500" aria-hidden="true" />
          {fill(m.form.postingAs, { name: me.name || me.email })}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={fieldId("name")} className="label">{m.form.name}</label>
            <input id={fieldId("name")} className="input" autoComplete="name" maxLength={60} value={name} onChange={(e) => setName(e.target.value)} placeholder={m.form.namePh} aria-invalid={error === "name" || undefined} />
            <p className="mt-1 text-xs muted">{m.form.nameHint}</p>
          </div>
          <div>
            <label htmlFor={fieldId("email")} className="label">{m.form.email}</label>
            <input id={fieldId("email")} className="input" type="email" autoComplete="email" dir="ltr" maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} placeholder={m.form.emailPh} aria-invalid={error === "email" || undefined} />
            <p className="mt-1 text-xs muted">{m.form.emailHint}</p>
          </div>
        </div>
      )}

      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" aria-hidden="true" />

      {!me && <SliderCaptcha context="review" locale={locale} onChange={setCaptcha} invalid={error === "captcha"} />}

      {verified && testId && <p className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300"><BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />{m.form.verifiedNote}</p>}

      {error && (
        <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-400/10 dark:text-rose-300">
          {m.errors[error]}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button type="submit" className="btn-primary px-5 py-2.5" disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />}
          {busy ? m.form.submitting : m.form.submit}
        </button>
        {onCancel && (
          <button type="button" className="btn-ghost px-4 py-2.5 text-sm" onClick={onCancel}>
            {m.form.cancel}
          </button>
        )}
      </div>
    </form>
  );
}
