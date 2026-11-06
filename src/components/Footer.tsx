"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Gauge, Mail } from "lucide-react";
import AppDownloads from "@/components/AppDownloads";
import SocialLinks from "@/components/SocialLinks";
import Trustpilot from "@/components/Trustpilot";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { Logo } from "@/components/Header";
import { MENUS } from "@/components/nav/menu";
import { useLocale } from "@/i18n/client";
import { lp, pick, splitLocale } from "@/i18n/config";
import { commonMessages } from "@/i18n/messages/common";
import { navMessages } from "@/i18n/messages/nav";
import { COMPANY } from "@/lib/company";

const LEGAL = [
  { href: "/privacy", key: "privacy" },
  { href: "/cookies", key: "cookies" },
  { href: "/terms", key: "terms" },
  { href: "/dmca", key: "dmca" },
] as const;

const linkCls =
  "text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white";

export default function Footer() {
  const locale = useLocale();
  const common = pick(commonMessages, locale);
  const t = common.footer;
  const nav = pick(navMessages, locale);
  const year = new Date().getFullYear();
  // Pages that already end with their own call-to-action banner.
  const path = splitLocale(usePathname() || "/").path;
  const showCta = !["/", "/how-it-works", "/guides/good-internet-speed"].includes(path);

  return (
    <footer className="relative border-t border-slate-200/80 bg-slate-50/80 text-slate-600 dark:border-white/[0.06] dark:bg-[#05080f] dark:text-slate-400">
      {/* CTA band */}
      {showCta && (
      <div className="container max-w-6xl pt-14 md:pt-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-800 px-6 py-10 text-white shadow-xl shadow-brand-900/20 sm:px-10 md:flex md:items-center md:justify-between md:gap-8 md:py-12">
          <div aria-hidden="true" className="absolute -end-16 -top-24 h-72 w-72 rounded-full bg-cyan-400/25 blur-3xl" />
          <div aria-hidden="true" className="absolute -bottom-24 -start-10 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:18px_18px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
          <div className="relative max-w-xl">
            <p className="text-2xl font-extrabold tracking-tight sm:text-3xl">{nav.footer.ctaTitle}</p>
            <p className="mt-2 text-sm text-blue-100 sm:text-base">{nav.footer.ctaText}</p>
          </div>
          <Link
            href={`${lp(locale, "/")}#speed-test`}
            className="relative mt-6 inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-brand-700 shadow-lg transition-transform hover:scale-[1.03] md:mt-0"
          >
            <Gauge className="h-5 w-5" aria-hidden="true" />
            {nav.footer.ctaButton}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>
      </div>
      )}

      {/* Main */}
      <div className="container max-w-6xl py-14">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-4 lg:pe-6">
            <Link href={lp(locale, "/")} className="group inline-flex" aria-label={COMPANY.brand}>
              <Logo />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">{t.about}</p>
            <a
              href={`mailto:${COMPANY.email}`}
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-brand-300 hover:text-brand-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:border-brand-400/40 dark:hover:text-white"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span dir="ltr">{COMPANY.email}</span>
            </a>
            <SocialLinks />
            <div className="mt-4">
              <Trustpilot />
            </div>
          </div>

          {/* Link columns */}
          {MENUS.map((m) => (
            <nav key={m.key} aria-label={nav.menus[m.key]} className="lg:col-span-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white [html[lang=ar]_&]:normal-case [html[lang=ar]_&]:tracking-normal">
                {nav.menus[m.key]}
              </h2>
              <ul className="mt-4 space-y-3">
                {m.items.map((item) => (
                  <li key={item.key}>
                    <Link href={lp(locale, item.href)} className={linkCls}>
                      {nav.items[item.key].title}
                    </Link>
                  </li>
                ))}
                {m.key === "company" &&
                  LEGAL.map((l) => (
                    <li key={l.key} className="lg:hidden">
                      <Link href={lp(locale, l.href)} className={linkCls}>
                        {t.links[l.key]}
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* App downloads (only shown once store links are set in the admin) */}
        <AppDownloads />

        {/* SEO blurb */}
        <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-slate-400 dark:text-slate-500">{t.seo}</p>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200/80 dark:border-white/[0.06]">
        <div className="container flex max-w-6xl flex-col items-center gap-4 py-6 text-xs text-slate-500 dark:text-slate-400 lg:flex-row lg:justify-between">
          <p className="text-center lg:text-start">
            © <span className="tabular">{year}</span> {COMPANY.brand}. {t.operatedBy} {COMPANY.legalName}. {t.rights}
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {LEGAL.map((l) => (
                <li key={l.key}>
                  <Link href={lp(locale, l.href)} className="transition-colors hover:text-slate-900 dark:hover:text-white">
                    {t.links[l.key]}
                  </Link>
                </li>
              ))}
              <li>
                <a href="/sitemap.xml" className="transition-colors hover:text-slate-900 dark:hover:text-white">
                  {t.links.sitemap}
                </a>
              </li>
            </ul>
            <div className="flex items-center gap-2">
              <LanguageSwitcher full className="w-44" />
              <ThemeToggle className="[&_.menu-pop]:bottom-full [&_.menu-pop]:top-auto [&_.menu-pop]:mb-2" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
