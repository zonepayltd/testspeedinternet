"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Check, ChevronDown, Globe } from "lucide-react";
import { LOCALES, LOCALE_META, lp, splitLocale, pick, type Locale } from "@/i18n/config";
import { useLocale } from "@/i18n/client";
import { commonMessages } from "@/i18n/messages/common";

export default function LanguageSwitcher({ className = "", full = false }: { className?: string; full?: boolean }) {
  const locale = useLocale();
  const t = pick(commonMessages, locale);
  const pathname = usePathname() || "/";
  const { path } = splitLocale(pathname);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const go = (l: Locale) => {
    try {
      document.cookie = `tsi_locale=${l}; path=/; max-age=31536000; samesite=lax`;
    } catch {}
    // Full navigation so <html lang/dir> and fonts update cleanly.
    window.location.href = lp(l, path) + window.location.search + window.location.hash;
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t.language}
        aria-haspopup="menu"
        aria-expanded={open}
        className={full ? "btn-secondary w-full justify-between" : "icon-btn w-auto gap-1.5 px-2.5"}
      >
        <Globe className="h-[18px] w-[18px]" aria-hidden="true" />
        <span className={`text-sm font-semibold ${full ? "flex-1 text-start" : "uppercase"}`}>
          {full ? LOCALE_META[locale].name : locale}
        </span>
        <ChevronDown className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
      </button>
      {open && (
        <div role="menu" className={`menu-pop w-48 ${full ? "bottom-full top-auto mb-2 start-0" : "end-0"}`}>
          {LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              role="menuitemradio"
              aria-checked={l === locale}
              lang={LOCALE_META[l].htmlLang}
              onClick={() => go(l)}
              className="menu-item"
            >
              <span className="w-7 text-xs font-bold uppercase text-slate-400 dark:text-slate-500">{l}</span>
              <span className="flex-1 text-start">{LOCALE_META[l].name}</span>
              {l === locale && <Check className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
