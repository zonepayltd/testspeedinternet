"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Renders children inside an isolated iframe that reuses the app's stylesheets,
 * so the preview gets a real viewport width (responsive classes behave like on
 * a phone or desktop) and its own light/dark theme independent of the admin's.
 * The frame is scaled down to fit the available width.
 */
export default function PreviewFrame({ width, dark, children }: { width: number; dark: boolean; children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [body, setBody] = useState<HTMLElement | null>(null);
  const [height, setHeight] = useState(400);
  const [avail, setAvail] = useState(width);

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setAvail(el.clientWidth));
    ro.observe(el);
    setAvail(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const onLoad = () => {
    const doc = frame.current?.contentDocument;
    if (!doc) return;
    doc.head.innerHTML = "";
    document.querySelectorAll('link[rel="stylesheet"], style').forEach((n) => doc.head.appendChild(n.cloneNode(true)));
    const base = doc.createElement("base");
    base.href = window.location.origin + "/";
    base.target = "_blank";
    doc.head.prepend(base);
    doc.documentElement.className = document.documentElement.className.replace(/\bdark\b/g, "").trim();
    doc.body.className = "bg-slate-50 font-sans text-slate-900 antialiased dark:bg-ink-950 dark:text-white";
    doc.body.style.margin = "0";
    // Clicks inside the preview never navigate.
    doc.addEventListener("click", (e) => {
      if ((e.target as HTMLElement)?.closest?.("a")) e.preventDefault();
    });
    setBody(doc.body);
  };

  useEffect(() => {
    const doc = frame.current?.contentDocument;
    if (!doc || !body) return;
    doc.documentElement.classList.toggle("dark", dark);
    doc.documentElement.style.colorScheme = dark ? "dark" : "light";
  }, [dark, body]);

  useEffect(() => {
    if (!body) return;
    const measure = () => setHeight(Math.max(200, Math.ceil(body.scrollHeight)));
    const ro = new ResizeObserver(measure);
    ro.observe(body);
    measure();
    return () => ro.disconnect();
  }, [body]);

  const scale = Math.min(1, avail / width);
  return (
    <div ref={wrap} className="w-full">
      <div className="mx-auto overflow-hidden rounded-xl ring-1 ring-slate-200 dark:ring-white/10" style={{ width: width * scale, height: height * scale }}>
        <iframe
          ref={frame}
          title="Ad preview"
          srcDoc="<!doctype html><html><head></head><body></body></html>"
          onLoad={onLoad}
          className="block origin-top-left border-0"
          style={{ width, height, transform: `scale(${scale})` }}
        />
      </div>
      {body && createPortal(children, body)}
    </div>
  );
}
