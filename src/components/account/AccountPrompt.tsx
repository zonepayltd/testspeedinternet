"use client";

// After a speed test: invite guests to save the result / compare providers;
// tell signed-in users the test was saved to their dashboard.
import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, CheckCircle2, GitCompareArrows, ListChecks, Star, UserPlus, X } from "lucide-react";
import type { FinishedTest } from "@/components/aftertest/types";
import { useLocale } from "@/i18n/client";
import { lp, pick } from "@/i18n/config";
import { accountMessages } from "@/i18n/messages/account";
import { useAccount } from "./useAccount";

const DISMISS_KEY = "tsi-account-prompt-dismissed";
const ICONS = [BarChart3, GitCompareArrows, Star];

export default function AccountPrompt({ test }: { test: FinishedTest }) {
  const locale = useLocale();
  const t = pick(accountMessages, locale);
  const { user, loading } = useAccount();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      const v = Number(localStorage.getItem(DISMISS_KEY) || 0);
      setDismissed(Date.now() - v < 7 * 86_400_000); // hide for a week after dismissing
    } catch {
      setDismissed(false);
    }
  }, []);

  if (loading) return null;

  if (user) {
    return (
      <section className="card animate-fade-in-up p-4 sm:p-5" aria-labelledby="ap-saved">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 id="ap-saved" className="text-sm font-bold text-slate-900 dark:text-white">{t.prompt.savedTitle}</h3>
            <p className="muted mt-1 text-sm">{t.prompt.savedText}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href={`${lp(locale, "/account")}?tab=tests`} className="btn-secondary px-3 py-2 text-xs">
                <ListChecks className="h-3.5 w-3.5" aria-hidden="true" /> {t.prompt.viewTests}
              </Link>
              <Link href={`${lp(locale, "/account")}?tab=compare&a=${encodeURIComponent(test.testId)}`} className="btn-secondary px-3 py-2 text-xs">
                <GitCompareArrows className="h-3.5 w-3.5" aria-hidden="true" /> {t.prompt.compare}
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* private mode */
    }
  };

  return (
    <section className="relative animate-fade-in-up overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-800 p-5 text-white shadow-xl shadow-brand-900/20 ring-1 ring-inset ring-white/10" aria-labelledby="ap-title">
      <div aria-hidden="true" className="absolute -end-12 -top-16 h-48 w-48 rounded-full bg-cyan-400/30 blur-3xl" />
      <button type="button" onClick={dismiss} aria-label={t.prompt.dismiss} className="absolute end-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg text-blue-100 hover:bg-white/10 hover:text-white">
        <X className="h-4 w-4" />
      </button>
      <div className="relative pe-6">
        <h3 id="ap-title" className="text-base font-extrabold leading-snug sm:text-lg">{t.prompt.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-blue-100">{t.prompt.text}</p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
          {t.prompt.benefits.map((b, i) => {
            const Icon = ICONS[i] || CheckCircle2;
            return (
              <li key={b} className="flex items-center gap-1.5 text-xs font-medium text-blue-50">
                <Icon className="h-3.5 w-3.5 text-cyan-200" aria-hidden="true" /> {b}
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`${lp(locale, "/account/signup")}?test=${encodeURIComponent(test.testId)}`} className="btn-white px-4 py-2.5">
            <UserPlus className="h-4 w-4" aria-hidden="true" /> {t.prompt.create}
          </Link>
          <Link href={`${lp(locale, "/account/login")}?test=${encodeURIComponent(test.testId)}`} className="btn px-4 py-2.5 text-white ring-1 ring-inset ring-white/30 hover:bg-white/10">
            {t.prompt.signIn}
          </Link>
        </div>
      </div>
    </section>
  );
}
