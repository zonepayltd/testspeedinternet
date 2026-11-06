"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Gauge, Menu, X } from "lucide-react";
import { useLocale } from "@/i18n/client";
import { lp, pick, splitLocale } from "@/i18n/config";
import { commonMessages } from "@/i18n/messages/common";
import ThemeToggle from "@/components/theme/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export function Logo({ tagline }: { tagline?: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-600/25 ring-1 ring-inset ring-white/20 transition-transform group-hover:scale-105">
        <Gauge className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-none" dir="ltr">
        <span className="text-[17px] font-extrabold tracking-tight text-slate-900 dark:text-white">
          Test Speed <span className="text-brand-600 dark:text-brand-400">Internet</span>
        </span>
        {tagline && (
          <span className="mt-1 hidden text-[10.5px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:block">
            {tagline}
          </span>
        )}
      </span>
    </span>
  );
}

export default function Header() {
  const locale = useLocale();
  const t = pick(commonMessages, locale);
  const pathname = usePathname() || "/";
  const current = splitLocale(pathname).path;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { href: "/", label: t.nav.speedTest },
    { href: "/what-is-my-ip", label: t.nav.myIp },
    { href: "/ip-risk-score", label: t.nav.ipRisk },
    { href: "/guides/good-internet-speed", label: t.nav.guide },
    { href: "/blog", label: t.nav.blog },
    { href: "/contact", label: t.nav.contact },
  ];
  const isActive = (href: string) => (href === "/" ? current === "/" : current.startsWith(href));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled
          ? "border-slate-200/80 bg-white/80 shadow-sm shadow-slate-900/[0.03] backdrop-blur-xl dark:border-white/[0.08] dark:bg-ink-950/80"
          : "border-transparent bg-white dark:bg-ink-950"
      }`}
    >
      <div className="container flex h-16 items-center justify-between gap-3">
        <Link href={lp(locale, "/")} className="group shrink-0" aria-label="TestSpeedInternet">
          <Logo tagline={t.brandTagline} />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={lp(locale, link.href)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`relative whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition-colors xl:px-3 ${
                    isActive(link.href)
                      ? "text-brand-700 dark:text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute inset-x-2.5 -bottom-[13px] xl:inset-x-3 h-0.5 rounded-full bg-brand-600 dark:bg-brand-400" aria-hidden="true" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <LanguageSwitcher className="hidden sm:block" />
          <ThemeToggle />
          <Link href={`${lp(locale, "/")}#speed-test`} className="btn-primary ms-2 hidden whitespace-nowrap px-4 py-2.5 xl:inline-flex">
            <Gauge className="h-4 w-4" aria-hidden="true" />
            {t.runTest}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="icon-btn lg:hidden"
            aria-label={open ? t.closeMenu : t.openMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="animate-fade-in-down fixed inset-x-0 bottom-0 top-16 overflow-y-auto border-t border-slate-200 bg-white dark:border-white/[0.08] dark:bg-ink-950 lg:hidden"
        >
          <nav aria-label="Mobile" className="container py-4">
            <ul className="flex flex-col gap-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={lp(locale, link.href)}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={`block rounded-xl px-4 py-3 text-base font-medium ${
                      isActive(link.href)
                        ? "bg-brand-50 text-brand-700 dark:bg-brand-400/10 dark:text-brand-300"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/[0.06]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-slate-200 pt-4 dark:border-white/[0.08]">
              <LanguageSwitcher full />
            </div>
            <Link href={`${lp(locale, "/")}#speed-test`} className="btn-primary mt-4 w-full py-3.5 text-base">
              <Gauge className="h-5 w-5" aria-hidden="true" />
              {t.runTest}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
