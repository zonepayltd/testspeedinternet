"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUp, Gauge, Globe2, Lock, Mail, UserX, BadgeCheck } from "lucide-react";
import AppDownloads from "@/components/AppDownloads";
import SocialLinks from "@/components/SocialLinks";
import Trustpilot from "@/components/Trustpilot";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { Logo } from "@/components/Header";
import { MENUS } from "@/components/nav/menu";
import { useLocale } from "@/i18n/client";
import { LOCALES, LOCALE_META, lp, pick, splitLocale } from "@/i18n/config";
import { commonMessages } from "@/i18n/messages/common";
import { navMessages } from "@/i18n/messages/nav";
import { COMPANY } from "@/lib/company";

const LEGAL = [
  { href: "/privacy", key: "privacy" },
  { href: "/cookies", key: "cookies" },
  { href: "/terms", key: "terms" },
  { href: "/dmca", key: "dmca" },
] as const;

// Pages that already end with their own call-to-action banner.
const OWN_CTA = ["/", "/how-it-works", "/guides/good-internet-speed"];

/**
 * Site footer. Always rendered in the dark palette (the `dark` class on the
 * <footer> turns on every dark: style inside), so it closes each page the
 * same way in light and dark mode.
 */
export default function Footer() {
  const locale = useLocale();
  const t = pick(commonMessages, locale).footer;
  const nav = pick(navMessages, locale);
  const f = nav.footer;
  const year = new Date().getFullYear();
  const path = splitLocale(usePathname() || "/").path;
  const showCta = !OWN_CTA.includes(path);

  const badges = [
    { icon: BadgeCheck, label: f.badges.free },
    { icon: UserX, label: f.badges.noSignup },
    { icon: Lock, label: f.badges.private },
    { icon: Globe2, label: f.badges.languages },
  ];

  return (
    <>
      {/* CTA card, floating over the footer edge */}
      {showCta && (
        <div className="relative z-10 -mb-24 mt-16 md:mt-20">
          <div className="container max-w-6xl">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-800 px-6 py-10 text-white shadow-2xl shadow-brand-900/30 ring-1 ring-inset ring-white/10 sm:px-10 md:flex md:items-center md:justify-between md:gap-8 md:py-12">
              <div aria-hidden="true" className="absolute -end-16 -top-24 h-72 w-72 rounded-full bg-cyan-400/30 blur-3xl" />
              <div aria-hidden="true" className="absolute -bottom-24 -start-10 h-64 w-64 rounded-full bg-indigo-400/25 blur-3xl" />
              <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.14)_1px,transparent_1px)] bg-[size:18px_18px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
              <div className="relative max-w-xl">
                <p className="text-2xl font-extrabold tracking-tight sm:text-3xl">{f.ctaTitle}</p>
                <p className="mt-2 text-sm text-blue-100 sm:text-base">{f.ctaText}</p>
              </div>
              <Link
                href={`${lp(locale, "/")}#speed-test`}
                className="group relative mt-6 inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-brand-700 shadow-lg transition-transform hover:scale-[1.03] md:mt-0"
              >
                <Gauge className="h-5 w-5" aria-hidden="true" />
                {f.ctaButton}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <footer className={`dark relative overflow-hidden bg-[#050915] text-slate-400 ${showCta ? "pt-36" : "pt-16"}`}>
        {/* Background: faint world map + glow */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero/world-dark.svg"
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-[0.22] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
          />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/50 to-transparent" />
          <div className="absolute left-1/2 top-0 h-64 w-[70%] -translate-x-1/2 rounded-full bg-brand-600/15 blur-3xl" />
        </div>

        <div className="container relative max-w-6xl">
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4 lg:grid-cols-12">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-4 lg:col-span-4 lg:pe-8">
              <Link href={lp(locale, "/")} className="group inline-flex" aria-label={COMPANY.brand}>
                <Logo />
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">{t.about}</p>

              <ul className="mt-6 grid max-w-sm grid-cols-2 gap-2">
                {badges.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-300">
                    <Icon className="h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>

              <a
                href={`mailto:${COMPANY.email}`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300 ring-1 ring-inset ring-brand-400/20">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </span>
                <span dir="ltr">{COMPANY.email}</span>
              </a>
              <SocialLinks />
              <div className="mt-4">
                <Trustpilot forceDark />
              </div>
            </div>

            {/* Link columns */}
            {MENUS.map((m) => (
              <nav key={m.key} aria-label={nav.menus[m.key]} className="lg:col-span-2">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-white [html[lang=ar]_&]:normal-case [html[lang=ar]_&]:tracking-normal">
                  {nav.menus[m.key]}
                </h2>
                <ul className="mt-5 space-y-3">
                  {m.items.map((item) => (
                    <li key={item.key}>
                      <Link
                        href={lp(locale, item.href)}
                        className="group inline-flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-white"
                      >
                        <span>{nav.items[item.key].title}</span>
                        <ArrowRight
                          className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 rtl:rotate-180 rtl:translate-x-1 rtl:group-hover:translate-x-0"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          {/* App downloads (only once store links are set in the admin) */}
          <AppDownloads />

          {/* Languages + back to top */}
          <div className="mt-14 flex flex-col items-center justify-between gap-5 border-t border-white/[0.07] pt-8 md:flex-row">
            <div className="flex flex-col items-center gap-3 md:flex-row">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 [html[lang=ar]_&]:normal-case [html[lang=ar]_&]:tracking-normal">
                {f.availableIn}
              </span>
              <ul className="flex flex-wrap justify-center gap-2">
                {LOCALES.map((l) => (
                  <li key={l}>
                    <a
                      href={lp(l, path)}
                      hrefLang={LOCALE_META[l].htmlLang}
                      lang={LOCALE_META[l].htmlLang}
                      aria-current={l === locale ? "true" : undefined}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                        l === locale
                          ? "border-brand-400/50 bg-brand-500/15 text-white"
                          : "border-white/[0.08] bg-white/[0.03] text-slate-300 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://flagcdn.com/${LOCALE_META[l].flag}.svg`}
                        alt=""
                        width={16}
                        height={12}
                        loading="lazy"
                        className="h-3 w-4 rounded-[2px] object-cover ring-1 ring-white/15"
                      />
                      {LOCALE_META[l].name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-white/20 hover:text-white"
            >
              {f.backToTop}
              <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
            </button>
          </div>

          {/* SEO blurb */}
          <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-slate-500">{t.seo}</p>
        </div>

        {/* Bottom bar */}
        <div className="relative mt-10 border-t border-white/[0.07] bg-black/20">
          <div className="container flex max-w-6xl flex-col items-center gap-4 py-6 text-xs text-slate-500 md:flex-row md:justify-between">
            <p className="text-center md:text-start">
              © <span className="tabular">{year}</span> {COMPANY.brand}. {t.operatedBy} {COMPANY.legalName}. {t.rights}
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                {LEGAL.map((l) => (
                  <li key={l.key}>
                    <Link href={lp(locale, l.href)} className="transition-colors hover:text-white">
                      {t.links[l.key]}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href={lp(locale, "/sitemap")} className="transition-colors hover:text-white">
                    {t.links.sitemap}
                  </Link>
                </li>
              </ul>
              <ThemeToggle className="[&_.menu-pop]:bottom-full [&_.menu-pop]:top-auto [&_.menu-pop]:mb-2" />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
