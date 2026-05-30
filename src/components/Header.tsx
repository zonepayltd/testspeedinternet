"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Gauge, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Speed Test" },
  { href: "/what-is-my-ip", label: "What Is My IP" },
  { href: "/ip-risk-score", label: "IP Risk Score" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-shadow ${
        scrolled
          ? "bg-white/90 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/75"
          : "bg-white"
      } border-b border-slate-200`}
    >
      <div className="container flex h-16 items-center justify-between gap-4 md:h-18">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="TestSpeedInternet home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-600/20 transition-transform group-hover:scale-105">
            <Gauge className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              Test Speed <span className="text-brand-600">Internet</span>
            </span>
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Free Internet Speed Test
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/#speed-test"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 focus-visible:outline-none"
          >
            <Gauge className="h-4 w-4" aria-hidden="true" />
            Run Speed Test
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className="animate-fade-in-down border-t border-slate-200 bg-white md:hidden"
        >
          <nav aria-label="Mobile" className="container py-4">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/#speed-test"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 text-base font-semibold text-white hover:bg-brand-700"
            >
              <Gauge className="h-5 w-5" aria-hidden="true" />
              Run Speed Test
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
