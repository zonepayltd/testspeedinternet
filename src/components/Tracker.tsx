"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { splitLocale } from "@/i18n/config";

function getId(key: string, store: Storage): string {
  let id = store.getItem(key);
  if (!id) {
    id =
      (crypto.randomUUID && crypto.randomUUID()) ||
      `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    store.setItem(key, id);
  }
  return id;
}

export default function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    let visitorId = "";
    let sessionId = "";
    try {
      visitorId = getId("tsi_vid", localStorage); // persists across sessions
      sessionId = getId("tsi_sid", sessionStorage); // per browser session
    } catch {
      return; // storage blocked
    }

    const payload = {
      path: pathname,
      referrer: document.referrer || "",
      visitorId,
      sessionId,
      screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
    };

    const body = JSON.stringify(payload);
    // Prefer sendBeacon so it survives navigation; fall back to fetch.
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
        return;
      }
    } catch {
      /* fall through */
    }
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  // Presence heartbeat: tells the admin "this visitor is online, on this page".
  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    let visitorId = "";
    try {
      visitorId = getId("tsi_vid", localStorage);
    } catch {
      return;
    }
    const locale = splitLocale(pathname).locale;
    const beat = (leaving = false) => {
      const body = JSON.stringify({ visitorId, path: pathname, locale, leaving });
      try {
        if (navigator.sendBeacon && navigator.sendBeacon("/api/presence", new Blob([body], { type: "application/json" }))) return;
      } catch {
        /* fall through */
      }
      fetch("/api/presence", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
    };
    beat();
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") beat();
    }, 30_000);
    const onVisible = () => document.visibilityState === "visible" && beat();
    const onLeave = () => beat(true);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pagehide", onLeave);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pagehide", onLeave);
    };
  }, [pathname]);

  return null;
}

/** Visitor id shared with other analytics (speed-test events, ads). */
export function visitorId(): string {
  try {
    return getId("tsi_vid", localStorage);
  } catch {
    return "";
  }
}
