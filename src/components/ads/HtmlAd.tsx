"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildAdSrcDoc } from "@/lib/adsModel";

/**
 * Renders pasted ad code (Adsterra, Media.net, affiliate banners…) inside a
 * sandboxed iframe. No `allow-same-origin`, so the code can't touch our cookies,
 * storage or DOM. Height is fixed when `height` > 0, otherwise the frame grows to
 * fit (the srcdoc posts its height to us).
 */
export default function HtmlAd({
  html,
  width = 0,
  height = 0,
  title = "Advertisement",
  onClick,
  className = "",
}: {
  html: string;
  width?: number;
  height?: number;
  title?: string;
  /** called (approximately) when the visitor clicks inside the frame */
  onClick?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [autoH, setAutoH] = useState(0);
  const srcDoc = useMemo(() => buildAdSrcDoc(html), [html]);

  // Responsive height: listen for the size message from *our* frame only.
  useEffect(() => {
    if (height > 0) return;
    const frame = ref.current;
    const win = frame?.ownerDocument.defaultView;
    if (!frame || !win) return;
    const onMsg = (e: MessageEvent) => {
      if (e.source !== frame.contentWindow) return;
      const h = Number((e.data as { tsiAdHeight?: number } | null)?.tsiAdHeight);
      if (Number.isFinite(h) && h > 0) setAutoH(Math.min(1600, Math.ceil(h)));
    };
    win.addEventListener("message", onMsg);
    return () => win.removeEventListener("message", onMsg);
  }, [height, srcDoc]);

  // Click detection: a cross-origin frame swallows clicks, but the parent window
  // blurs and the iframe becomes the active element when the visitor clicks it.
  useEffect(() => {
    if (!onClick) return;
    const frame = ref.current;
    const win = frame?.ownerDocument.defaultView;
    if (!frame || !win) return;
    let hovering = false;
    const enter = () => (hovering = true);
    const leave = () => (hovering = false);
    const onBlur = () => {
      setTimeout(() => {
        if (hovering && frame.ownerDocument.activeElement === frame) {
          onClick();
          // refocus so a second click is detected again
          setTimeout(() => win.focus(), 300);
        }
      }, 0);
    };
    frame.addEventListener("mouseenter", enter);
    frame.addEventListener("mouseleave", leave);
    win.addEventListener("blur", onBlur);
    return () => {
      frame.removeEventListener("mouseenter", enter);
      frame.removeEventListener("mouseleave", leave);
      win.removeEventListener("blur", onBlur);
    };
  }, [onClick]);

  const h = height > 0 ? height : autoH || 90;
  return (
    <iframe
      ref={ref}
      title={title}
      srcDoc={srcDoc}
      sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms"
      referrerPolicy="no-referrer-when-downgrade"
      loading="lazy"
      scrolling="no"
      className={`mx-auto block border-0 bg-transparent ${className}`}
      style={{ width: width > 0 ? width : "100%", maxWidth: "100%", height: h, colorScheme: "normal" }}
    />
  );
}
