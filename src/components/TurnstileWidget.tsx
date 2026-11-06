"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/i18n/client";
import { pick } from "@/i18n/config";
import { contactMessages } from "@/i18n/messages/contact";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
  }
}

const ENV_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export default function TurnstileWidget({ onVerify }: { onVerify: (token: string) => void }) {
  const t = pick(contactMessages, useLocale()).form;
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [siteKey, setSiteKey] = useState(ENV_SITE_KEY);
  const [resolved, setResolved] = useState(Boolean(ENV_SITE_KEY));

  // If no env key, ask the server (admin may have set it in Settings).
  useEffect(() => {
    if (ENV_SITE_KEY) return;
    fetch("/api/config", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setSiteKey(d?.turnstileSiteKey || ""))
      .catch(() => {})
      .finally(() => setResolved(true));
  }, []);

  useEffect(() => {
    if (!siteKey || !ref.current) return;

    const renderWidget = () => {
      if (!ref.current || !window.turnstile || widgetId.current) return;
      widgetId.current = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        callback: (token: string) => onVerify(token),
        "error-callback": () => onVerify(""),
        "expired-callback": () => onVerify(""),
        // Match the site theme (html.dark is set by the theme toggle).
        theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
      });
    };

    if (window.turnstile) {
      renderWidget();
      return;
    }
    let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", renderWidget);
    return () => script?.removeEventListener("load", renderWidget);
  }, [siteKey, onVerify]);

  if (resolved && !siteKey) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-center text-xs text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
        {t.captchaNotConfigured}
      </div>
    );
  }

  return <div ref={ref} className="min-h-[65px]" />;
}
