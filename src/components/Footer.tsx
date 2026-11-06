"use client";

import Link from "next/link";
import { Gauge, Mail } from "lucide-react";
import AppDownloads from "@/components/AppDownloads";
import SocialLinks from "@/components/SocialLinks";
import Trustpilot from "@/components/Trustpilot";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLocale } from "@/i18n/client";
import { lp, pick } from "@/i18n/config";
import { commonMessages } from "@/i18n/messages/common";
import { COMPANY } from "@/lib/company";

type LinkKey = keyof (typeof commonMessages)["en"]["footer"]["links"];

const SECTIONS: { title: "speedTests" | "resources" | "company"; links: { href: string; key: LinkKey }[] }[] = [
  {
    title: "speedTests",
    links: [
      { href: "/", key: "internet" },
      { href: "/tools/download-speed-test", key: "download" },
      { href: "/tools/upload-speed-test", key: "upload" },
      { href: "/tools/ping-test", key: "ping" },
      { href: "/tools/wifi-speed-test", key: "wifi" },
    ],
  },
  {
    title: "resources",
    links: [
      { href: "/what-is-my-ip", key: "myIp" },
      { href: "/ip-risk-score", key: "ipRisk" },
      { href: "/how-it-works", key: "howItWorks" },
      { href: "/guides/good-internet-speed", key: "goodSpeed" },
      { href: "/blog", key: "blog" },
      { href: "/faq", key: "faq" },
    ],
  },
  {
    title: "company",
    links: [
      { href: "/about", key: "about" },
      { href: "/editorial-policy", key: "editorial" },
      { href: "/contact", key: "contact" },
      { href: "/privacy", key: "privacy" },
      { href: "/cookies", key: "cookies" },
      { href: "/terms", key: "terms" },
      { href: "/dmca", key: "dmca" },
    ],
  },
];

export default function Footer() {
  const locale = useLocale();
  const t = pick(commonMessages, locale).footer;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/80 bg-slate-50/70 text-slate-600 dark:border-white/[0.06] dark:bg-ink-950 dark:text-slate-400">
      <div className="container max-w-6xl py-14 md:py-16">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 lg:grid-cols-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-5 lg:pe-8">
            <Link href={lp(locale, "/")} className="inline-flex items-center gap-2.5" aria-label={`${COMPANY.brand}`}>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-600/20">
                <Gauge className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white" dir="ltr">
                Test Speed <span className="text-brand-600 dark:text-brand-400">Internet</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">{t.about}</p>

            <a
              href={`mailto:${COMPANY.email}`}
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400"
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
          {SECTIONS.map((section) => (
            <nav
              key={section.title}
              aria-label={t[section.title]}
              className={section.title === "company" ? "col-span-2 md:col-span-2 lg:col-span-3" : "md:col-span-1 lg:col-span-2"}
            >
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{t[section.title]}</h2>
              <ul className={`mt-4 space-y-3 ${section.title === "company" ? "grid grid-cols-2 gap-x-8 space-y-0 gap-y-3 md:block md:space-y-3" : ""}`}>
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={lp(locale, link.href)}
                      className="text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      {t.links[link.key]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* App downloads */}
        <div className="mt-12 border-t border-slate-200/80 pt-10 dark:border-white/[0.06]">
          <AppDownloads />
        </div>

        {/* SEO blurb */}
        <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-slate-400 dark:text-slate-500">{t.seo}</p>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200/80 bg-white dark:border-white/[0.06] dark:bg-ink-950">
        <div className="container flex max-w-6xl flex-col items-center gap-4 py-5 text-xs text-slate-500 dark:text-slate-400 md:flex-row md:justify-between">
          <p className="text-center md:text-start">
            © <span className="tabular">{year}</span> {COMPANY.brand}. {t.operatedBy} {COMPANY.legalName}. {t.rights}
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              <li>
                <Link href={lp(locale, "/privacy")} className="transition-colors hover:text-slate-900 dark:hover:text-white">
                  {t.links.privacy}
                </Link>
              </li>
              <li>
                <Link href={lp(locale, "/terms")} className="transition-colors hover:text-slate-900 dark:hover:text-white">
                  {t.links.terms}
                </Link>
              </li>
              <li>
                <Link href={lp(locale, "/cookies")} className="transition-colors hover:text-slate-900 dark:hover:text-white">
                  {t.links.cookies}
                </Link>
              </li>
              <li>
                <a href="/sitemap.xml" className="transition-colors hover:text-slate-900 dark:hover:text-white">
                  {t.links.sitemap}
                </a>
              </li>
            </ul>
            <LanguageSwitcher full className="w-44" />
          </div>
        </div>
      </div>
    </footer>
  );
}
