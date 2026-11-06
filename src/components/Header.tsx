"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Gauge, Lock, Menu as MenuIcon, X } from "lucide-react";
import { useLocale } from "@/i18n/client";
import { lp, pick, splitLocale, type Locale } from "@/i18n/config";
import { commonMessages } from "@/i18n/messages/common";
import { navMessages, type NavMessages } from "@/i18n/messages/nav";
import ThemeToggle from "@/components/theme/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { MENUS, POPULAR_GUIDES, isActive, type Menu, type MenuKey } from "@/components/nav/menu";

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

/* --------------------------------- Desktop panels --------------------------------- */

function PanelItem({ item, locale, nav, current }: { item: Menu["items"][number]; locale: Locale; nav: NavMessages; current: string }) {
  const Icon = item.icon;
  const active = isActive(current, item.href);
  return (
    <Link
      href={lp(locale, item.href)}
      aria-current={active ? "page" : undefined}
      className={`group/item flex items-start gap-3 rounded-xl p-3 transition-colors ${
        active ? "bg-brand-50 dark:bg-brand-400/10" : "hover:bg-slate-50 dark:hover:bg-white/[0.05]"
      }`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm ring-1 ring-slate-200/80 transition-colors group-hover/item:bg-brand-600 group-hover/item:text-white group-hover/item:ring-brand-600 dark:bg-white/[0.06] dark:text-brand-300 dark:ring-white/10 dark:group-hover/item:bg-brand-500 dark:group-hover/item:text-white">
        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-slate-900 dark:text-white">{nav.items[item.key].title}</span>
        <span className="mt-0.5 block text-[13px] leading-snug text-slate-500 dark:text-slate-400">{nav.items[item.key].desc}</span>
      </span>
    </Link>
  );
}

function Featured({ menu, locale, nav }: { menu: MenuKey; locale: Locale; nav: NavMessages }) {
  const f = nav.featured;
  if (menu === "speed") {
    return (
      <div className="relative flex h-full flex-col overflow-hidden rounded-xl bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-800 p-5 text-white">
        <div aria-hidden="true" className="absolute -end-10 -top-10 h-40 w-40 rounded-full bg-cyan-400/30 blur-2xl" />
        <Gauge className="relative h-7 w-7 text-cyan-200" aria-hidden="true" />
        <p className="relative mt-4 text-base font-bold leading-snug">{f.speedTitle}</p>
        <p className="relative mt-1.5 text-[13px] leading-relaxed text-blue-100">{f.speedText}</p>
        <Link
          href={`${lp(locale, "/")}#speed-test`}
          className="relative mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-white hover:text-cyan-200"
        >
          {f.speedCta} <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
        </Link>
      </div>
    );
  }
  if (menu === "learn") {
    return (
      <div className="flex h-full flex-col rounded-xl bg-slate-50 p-5 dark:bg-white/[0.04]">
        <p className="kicker">{f.learnTitle}</p>
        <ul className="mt-3 space-y-1">
          {POPULAR_GUIDES.map((g) => (
            <li key={g.key}>
              <Link
                href={lp(locale, g.href)}
                className="block rounded-lg py-1.5 text-sm font-medium leading-snug text-slate-700 hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-300"
              >
                {f[g.key]}
              </Link>
            </li>
          ))}
        </ul>
        <Link href={lp(locale, "/blog")} className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">
          {f.allArticles} <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
        </Link>
      </div>
    );
  }
  if (menu === "ip") {
    return (
      <div className="flex h-full flex-col rounded-xl bg-slate-50 p-5 dark:bg-white/[0.04]">
        <span className="icon-tile h-9 w-9">
          <Lock className="h-4 w-4" aria-hidden="true" />
        </span>
        <p className="mt-3 text-sm font-bold text-slate-900 dark:text-white">{f.ipTitle}</p>
        <p className="mt-1 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">{f.ipText}</p>
      </div>
    );
  }
  return null;
}

const PANEL_LAYOUT: Record<MenuKey, { width: string; cols: string; featured: boolean; align: string }> = {
  speed: { width: "w-[720px]", cols: "grid-cols-2", featured: true, align: "start-0" },
  ip: { width: "w-[560px]", cols: "grid-cols-1", featured: true, align: "start-0" },
  learn: { width: "w-[680px]", cols: "grid-cols-2", featured: true, align: "-start-24" },
  company: { width: "w-[340px]", cols: "grid-cols-1", featured: false, align: "end-0" },
};

/* --------------------------------- Header --------------------------------- */

export default function Header() {
  const locale = useLocale();
  const t = pick(commonMessages, locale);
  const nav = pick(navMessages, locale);
  const pathname = usePathname() || "/";
  const current = splitLocale(pathname).path;

  const [open, setOpen] = useState<MenuKey | null>(null);
  const [mobile, setMobile] = useState(false);
  // null = auto (open the section of the current page); "none" = all closed
  const [mobileSection, setMobileSection] = useState<MenuKey | "none" | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(null), 160);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close everything when the page changes.
  useEffect(() => {
    setOpen(null);
    setMobile(false);
  }, [pathname]);

  // Escape / click outside closes the desktop panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile]);

  const menuActive = (m: Menu) => m.items.some((i) => isActive(current, i.href));

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled || open
          ? "border-slate-200/80 bg-white/85 shadow-sm shadow-slate-900/[0.03] backdrop-blur-xl dark:border-white/[0.08] dark:bg-ink-950/85"
          : "border-transparent bg-white/70 backdrop-blur-md dark:bg-ink-950/60"
      }`}
    >
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href={lp(locale, "/")} className="group shrink-0" aria-label="TestSpeedInternet">
          <Logo tagline={t.brandTagline} />
        </Link>

        {/* Desktop mega menu */}
        <nav ref={navRef} aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {MENUS.map((m) => {
              const layout = PANEL_LAYOUT[m.key];
              const isOpen = open === m.key;
              const active = menuActive(m);
              return (
                <li
                  key={m.key}
                  className="relative"
                  onMouseEnter={() => {
                    cancelClose();
                    setOpen(m.key);
                  }}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`menu-${m.key}`}
                    onClick={() => setOpen(isOpen ? null : m.key)}
                    className={`relative inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isOpen || active
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    } ${isOpen ? "bg-slate-100 dark:bg-white/[0.07]" : "hover:bg-slate-100/70 dark:hover:bg-white/[0.05]"}`}
                  >
                    {nav.menus[m.key]}
                    <ChevronDown className={`h-3.5 w-3.5 opacity-60 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                    {active && !isOpen && (
                      <span className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-brand-600 dark:bg-brand-400" aria-hidden="true" />
                    )}
                  </button>

                  {isOpen && (
                    <div id={`menu-${m.key}`} className={`absolute top-full z-50 pt-3 ${layout.align}`}>
                      <div
                        className={`${layout.width} animate-scale-in overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-2 shadow-2xl shadow-slate-900/10 dark:border-white/10 dark:bg-ink-900 dark:shadow-black/50`}
                      >
                        <div className={`grid gap-2 ${layout.featured ? "grid-cols-[minmax(0,1fr)_220px]" : "grid-cols-1"}`}>
                          <div className={`grid content-start gap-0.5 ${layout.cols}`}>
                            {m.items.map((item) => (
                              <PanelItem key={item.key} item={item} locale={locale} nav={nav} current={current} />
                            ))}
                          </div>
                          {layout.featured && <Featured menu={m.key} locale={locale} nav={nav} />}
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <LanguageSwitcher className="hidden sm:block" />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobile((v) => !v)}
            className="icon-btn lg:hidden"
            aria-label={mobile ? t.closeMenu : t.openMenu}
            aria-expanded={mobile}
            aria-controls="mobile-menu"
          >
            {mobile ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobile && (
        <div
          id="mobile-menu"
          className="animate-fade-in-down absolute inset-x-0 top-full h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-slate-200 bg-white dark:border-white/[0.08] dark:bg-ink-950 lg:hidden"
        >
          <nav aria-label="Mobile" className="container py-4">
            <ul className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {MENUS.map((m) => {
                const expanded = mobileSection === m.key || (mobileSection === null && menuActive(m));
                return (
                  <li key={m.key} className="py-1">
                    <button
                      type="button"
                      aria-expanded={expanded}
                      onClick={() => setMobileSection(expanded ? "none" : m.key)}
                      className="flex w-full items-center justify-between rounded-xl px-2 py-3 text-base font-semibold text-slate-900 dark:text-white"
                    >
                      {nav.menus[m.key]}
                      <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden="true" />
                    </button>
                    {expanded && (
                      <div className="grid gap-0.5 pb-2">
                        {m.items.map((item) => (
                          <PanelItem key={item.key} item={item} locale={locale} nav={nav} current={current} />
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 border-t border-slate-200 pt-4 dark:border-white/[0.08]">
              <LanguageSwitcher full />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
