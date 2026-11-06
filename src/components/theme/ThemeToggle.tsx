"use client";

import { useEffect, useRef, useState } from "react";
import { Monitor, Moon, Sun, Check } from "lucide-react";
import { useLocale } from "@/i18n/client";
import { commonMessages } from "@/i18n/messages/common";
import { pick } from "@/i18n/config";

type Mode = "light" | "dark" | "system";
const KEY = "tsi_theme";

function apply(mode: Mode) {
  const dark = mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

/** Inline script for <head>: applies the saved theme before first paint (no flash). */
export const themeInitScript = `(function(){try{var m=localStorage.getItem('${KEY}')||'system';var d=m==='dark'||(m==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);var e=document.documentElement;if(d)e.classList.add('dark');e.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const t = pick(commonMessages, useLocale()).theme;
  const [mode, setMode] = useState<Mode>("system");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setMode((localStorage.getItem(KEY) as Mode) || "system");
    } catch {
      /* storage blocked */
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      let m: Mode = "system";
      try {
        m = (localStorage.getItem(KEY) as Mode) || "system";
      } catch {}
      if (m === "system") apply("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

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

  const choose = (m: Mode) => {
    setMode(m);
    try {
      localStorage.setItem(KEY, m);
    } catch {}
    apply(m);
    setOpen(false);
  };

  const options: { m: Mode; label: string; Icon: typeof Sun }[] = [
    { m: "light", label: t.light, Icon: Sun },
    { m: "dark", label: t.dark, Icon: Moon },
    { m: "system", label: t.system, Icon: Monitor },
  ];

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t.label}
        aria-haspopup="menu"
        aria-expanded={open}
        className="icon-btn"
      >
        <Sun className="h-[18px] w-[18px] dark:hidden" aria-hidden="true" />
        <Moon className="hidden h-[18px] w-[18px] dark:block" aria-hidden="true" />
      </button>
      {open && (
        <div role="menu" className="menu-pop end-0 w-40">
          {options.map(({ m, label, Icon }) => (
            <button key={m} type="button" role="menuitemradio" aria-checked={mode === m} onClick={() => choose(m)} className="menu-item">
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span className="flex-1 text-start">{label}</span>
              {mode === m && <Check className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
