"use client";

// Visitor dashboard: tabs (deep-linkable with ?tab=), data loaded from /api/account/*.
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Gauge, GitCompareArrows, LayoutDashboard, ListChecks, Loader2, MailWarning, Settings, Star, Wifi } from "lucide-react";
import { useLocale } from "@/i18n/client";
import { lp, pick } from "@/i18n/config";
import { accountMessages, fmt } from "@/i18n/messages/account";
import { apiJson, initials, useAccount } from "../useAccount";
import { fmtDate, type AccountTest } from "./shared";
import Overview from "./Overview";
import TestsTab from "./TestsTab";
import CompareTab from "./CompareTab";
import ProvidersTab from "./ProvidersTab";
import ReviewsTab from "./ReviewsTab";
import SettingsTab from "./SettingsTab";

export const TABS = ["overview", "tests", "compare", "providers", "reviews", "settings"] as const;
export type Tab = (typeof TABS)[number];
const ICONS = { overview: LayoutDashboard, tests: ListChecks, compare: GitCompareArrows, providers: Wifi, reviews: Star, settings: Settings };

export default function Dashboard() {
  const locale = useLocale();
  const t = pick(accountMessages, locale);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { user, loading } = useAccount();

  const rawTab = params.get("tab") as Tab | null;
  const tab: Tab = rawTab && TABS.includes(rawTab) ? rawTab : "overview";
  const [tests, setTests] = useState<AccountTest[] | null>(null);
  const [resend, setResend] = useState<"idle" | "busy" | "sent" | "error">("idle");

  useEffect(() => {
    if (!loading && !user) router.replace(`${lp(locale, "/account/login")}?next=${encodeURIComponent(pathname + (params.toString() ? `?${params}` : ""))}`);
  }, [loading, user, router, locale, pathname, params]);

  const loadTests = useCallback(async () => {
    const r = await apiJson<{ tests?: AccountTest[] }>("/api/account/tests", "GET");
    setTests(r.ok ? r.tests || [] : []);
  }, []);
  useEffect(() => {
    if (user) loadTests();
  }, [user, loadTests]);

  const go = useCallback(
    (next: Tab, extra?: Record<string, string>) => {
      const q = new URLSearchParams();
      if (next !== "overview") q.set("tab", next);
      if (extra) Object.entries(extra).forEach(([k, v]) => q.set(k, v));
      router.replace(`${pathname}${q.toString() ? `?${q}` : ""}`, { scroll: false });
    },
    [router, pathname],
  );

  if (loading || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-slate-400" aria-label={t.dash.loading} />
      </div>
    );
  }

  const doResend = async () => {
    setResend("busy");
    const r = await apiJson("/api/account/resend", "POST", { locale });
    setResend(r.ok ? "sent" : "error");
  };

  return (
    <div className="hero-bg min-h-[70vh]">
      <div aria-hidden="true" className="hero-glow" />
      <div className="container relative max-w-6xl py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-lg font-bold text-white shadow-lg shadow-brand-600/25">{initials(user.name)}</span>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">{fmt(t.dash.hello, { name: user.name.split(" ")[0] })}</h1>
              <p className="muted mt-0.5 text-sm">
                {t.dash.subtitle} <span className="hidden sm:inline">· {fmt(t.settings.memberSince, { date: fmtDate(user.createdAt, locale, false) })}</span>
              </p>
            </div>
          </div>
          <Link href={`${lp(locale, "/")}#speed-test`} className="btn-primary shrink-0">
            <Gauge className="h-4 w-4" aria-hidden="true" /> {t.dash.runTest}
          </Link>
        </div>

        {/* Verify banner */}
        {!user.emailVerified && (
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100 sm:flex-row sm:items-center">
            <MailWarning className="h-5 w-5 shrink-0 text-amber-500" aria-hidden="true" />
            <p className="flex-1">{fmt(t.dash.verifyBanner, { email: user.email })}</p>
            {resend === "sent" ? (
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">{t.dash.resent}</span>
            ) : (
              <button type="button" onClick={doResend} disabled={resend === "busy"} className="btn-secondary shrink-0 px-3 py-2 text-xs">
                {resend === "busy" && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
                {resend === "error" ? t.errors.generic : t.dash.resend}
              </button>
            )}
          </div>
        )}

        {/* Tabs */}
        <nav aria-label={t.nav.account} className="-mx-4 mt-8 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          <div role="tablist" className="inline-flex min-w-max gap-1 rounded-2xl border border-slate-200 bg-white/80 p-1 shadow-sm backdrop-blur dark:border-white/[0.08] dark:bg-ink-900/80">
            {TABS.map((k) => {
              const Icon = ICONS[k];
              const active = k === tab;
              return (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => go(k)}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${
                    active ? "bg-brand-600 text-white shadow-sm dark:bg-brand-500" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {t.dash.tabs[k]}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="mt-6" role="tabpanel">
          {tab === "overview" && <Overview tests={tests} onTab={go} />}
          {tab === "tests" && <TestsTab tests={tests} onChange={loadTests} onCompare={(a, b) => go("compare", { a, b })} />}
          {tab === "compare" && <CompareTab tests={tests} initialA={params.get("a") || ""} initialB={params.get("b") || ""} />}
          {tab === "providers" && <ProvidersTab />}
          {tab === "reviews" && <ReviewsTab />}
          {tab === "settings" && <SettingsTab />}
        </div>
      </div>
    </div>
  );
}
