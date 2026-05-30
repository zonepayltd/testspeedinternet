"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Star } from "lucide-react";

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
  }, [scriptReady, cfg.trustpilotBusinessId]);

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
          data-locale="en-US"
          data-template-id="5419b6ffb0d04a076446a9af"
          data-businessunit-id={businessId}
          data-style-height="20px"
          data-style-width="100%"
          data-theme="light"
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
      className="mt-2 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-emerald-300 hover:text-emerald-600"
    >
      <span className="flex items-center gap-0.5 text-emerald-500" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
      </span>
      Reviews on Trustpilot
    </a>
  );
}
