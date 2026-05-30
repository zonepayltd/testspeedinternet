"use client";

import { useEffect, useRef, useState } from "react";

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
        theme: "light",
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
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-center text-xs text-slate-400">
        Captcha not configured yet (set it in Admin → Settings).
      </div>
    );
  }

  return <div ref={ref} className="min-h-[65px]" />;
}
