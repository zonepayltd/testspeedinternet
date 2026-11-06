"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Star } from "lucide-react";
import { useLocale } from "@/i18n/client";
import { pick } from "@/i18n/config";
import { chromeMessages } from "@/i18n/messages/chrome";

const TP_LOCALE: Record<string, string> = { en: "en-US", fr: "fr-FR", es: "es-ES", ar: "en-US", ru: "ru-RU" };

type Cfg = { trustpilotUrl?: string; trustpilotBusinessId?: string };

declare global {
  interface Window {
    Trustpilot?: { loadFromElement?: (el: HTMLElement, force?: boolean) => void };
  }
}

export default function Trustpilot() {
  const [cfg, setCfg] = useState<Cfg>({});
  const [scriptReady, setScriptReady] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = pick(chromeMessages, locale);
  const [dark, setDark] = useState(false);

  // Follow the site theme (html.dark) so the TrustBox matches light/dark.
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setDark(root.classList.contains("dark"));
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  useEffect(() => {
    fetch("/api/config", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) =>
        setCfg({
          trustpilotUrl: d?.trustpilotUrl || "",
          trustpilotBusinessId: d?.trustpilotBusinessId || "",
        })
      )
      .catch(() => {});
  }, []);

  // Re-initialise the TrustBox once both the script and the element exist.
  useEffect(() => {
    if (scriptReady && boxRef.current && window.Trustpilot?.loadFromElement) {
      window.Trustpilot.loadFromElement(boxRef.current, true);
    }
  }, [scriptReady, cfg.trustpilotBusinessId, dark]);

  const url = cfg.trustpilotUrl;
  const businessId = cfg.trustpilotBusinessId;

  // Nothing configured yet -> render nothing.
  if (!url && !businessId) return null;

  // Full TrustBox (live reviews) when the Business Unit ID is set.
  if (businessId) {
    return (
      <div className="mt-2">
        <Script
          src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
          strategy="afterInteractive"
          onLoad={() => setScriptReady(true)}
        />
        <div
          ref={boxRef}
          className="trustpilot-widget"
          data-locale={TP_LOCALE[locale] || "en-US"}
          data-template-id="5419b6ffb0d04a076446a9af"
          data-businessunit-id={businessId}
          data-style-height="20px"
          data-style-width="100%"
          data-theme={dark ? "dark" : "light"}
        >
          {url && (
            <a href={url} target="_blank" rel="noopener noreferrer">
              Trustpilot
            </a>
          )}
        </div>
      </div>
    );
  }

  // Fallback: simple branded link when only the profile URL is set.
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-emerald-300 hover:text-emerald-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-emerald-400/40 dark:hover:text-emerald-400"
    >
      <span className="flex items-center gap-0.5 text-emerald-500" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
      </span>
      {t.trustpilot}
    </a>
  );
}
