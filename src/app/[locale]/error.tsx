"use client";

import { useEffect } from "react";
import { AlertTriangle, Home, Mail, RotateCcw } from "lucide-react";
import { LocaleLink, useLocale } from "@/i18n/client";
import { pick } from "@/i18n/config";
import { errorMessages } from "@/i18n/messages/errors";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = pick(errorMessages, useLocale()).error;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="hero-bg">
      <div aria-hidden="true" className="hero-glow" />
      <div className="container relative flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20">
          <AlertTriangle className="h-7 w-7" aria-hidden="true" />
        </span>
        <p className="kicker mt-6">{t.code}</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">{t.title}</h1>
        <p className="lead mt-4 max-w-md">{t.text}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => reset()} className="btn-primary">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            {t.retry}
          </button>
          <LocaleLink href="/" className="btn-secondary">
            <Home className="h-4 w-4" aria-hidden="true" />
            {t.home}
          </LocaleLink>
          <LocaleLink href="/contact" className="btn-ghost">
            <Mail className="h-4 w-4" aria-hidden="true" />
            {t.contact}
          </LocaleLink>
        </div>

        {error.digest && (
          <p className="muted mt-8 text-xs">
            {t.reference}:{" "}
            <code dir="ltr" className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-slate-700 dark:bg-white/10 dark:text-slate-300">
              {error.digest}
            </code>
          </p>
        )}
      </div>
    </section>
  );
}
