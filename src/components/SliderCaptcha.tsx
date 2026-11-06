"use client";

// Built-in slider puzzle captcha (see src/lib/captcha.ts). Shows a "Verify
// you're human" button; clicking it opens the puzzle. When solved, calls
// onChange(passToken). The pass token is single-use and expires after ~3 min.

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, Check, Loader2, Puzzle, RotateCw, ShieldCheck, X } from "lucide-react";
import { captchaMessages } from "@/i18n/messages/captcha";
import type { Locale } from "@/i18n/config";

type Challenge = { token: string; bg: string; piece: string; y: number; width: number; height: number; size: number };
type Status = "loading" | "ready" | "dragging" | "checking" | "success" | "fail" | "error";

export default function SliderCaptcha({
  context,
  locale = "en",
  onChange,
  invalid = false,
}: {
  context: "contact" | "login";
  locale?: Locale;
  /** Called with the pass token when solved, or "" when it expires/resets. */
  onChange: (pass: string) => void;
  /** Show the field in an error state (e.g. form submitted without verifying). */
  invalid?: boolean;
}) {
  const t = captchaMessages[locale] ?? captchaMessages.en;
  const [open, setOpen] = useState(false);
  const [verified, setVerified] = useState(false);
  const [mounted, setMounted] = useState(false);
  const expiryRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => () => {
    if (expiryRef.current) clearTimeout(expiryRef.current);
  }, []);

  const solved = useCallback(
    (pass: string) => {
      setVerified(true);
      onChange(pass);
      setTimeout(() => setOpen(false), 650);
      // The pass token expires on the server after 3 minutes: ask again after ~2.5.
      if (expiryRef.current) clearTimeout(expiryRef.current);
      expiryRef.current = setTimeout(() => {
        setVerified(false);
        onChange("");
      }, 150_000);
    },
    [onChange],
  );

  return (
    <>
      <button
        type="button"
        onClick={() => !verified && setOpen(true)}
        aria-haspopup="dialog"
        aria-invalid={invalid || undefined}
        className={`group flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-start transition-all ${
          verified
            ? "border-emerald-300 bg-emerald-50/70 dark:border-emerald-400/30 dark:bg-emerald-400/[0.08]"
            : invalid
              ? "border-rose-300 bg-rose-50/60 dark:border-rose-400/40 dark:bg-rose-400/[0.06]"
              : "border-slate-200 bg-white hover:border-brand-300 hover:shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-brand-400/40"
        }`}
      >
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition-colors ${
            verified ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 bg-white text-transparent group-hover:border-brand-400 dark:border-white/20 dark:bg-transparent"
          }`}
        >
          <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">{verified ? t.verified : t.verify}</span>
          <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{verified ? t.privacy : t.verifyHint}</span>
        </span>
        <ShieldCheck className={`h-6 w-6 shrink-0 ${verified ? "text-emerald-500" : "text-brand-500 dark:text-brand-400"}`} aria-hidden="true" />
      </button>

      {open && mounted && createPortal(<PuzzleDialog context={context} t={t} onClose={() => setOpen(false)} onSolved={solved} />, document.body)}
    </>
  );
}

function PuzzleDialog({
  context,
  t,
  onClose,
  onSolved,
}: {
  context: "contact" | "login";
  t: (typeof captchaMessages)["en"];
  onClose: () => void;
  onSolved: (pass: string) => void;
}) {
  const [ch, setCh] = useState<Challenge | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [msg, setMsg] = useState("");
  const [x, setX] = useState(0); // piece position in image pixels
  const [scale, setScale] = useState(1); // displayed px per image px
  const boxRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const drag = useRef<{ startX: number; startPos: number; t0: number; trail: [number, number][] } | null>(null);
  const kbd = useRef<{ t0: number; trail: [number, number][] } | null>(null);

  const load = useCallback(async (note = "") => {
    setStatus("loading");
    setMsg(note);
    setX(0);
    try {
      const res = await fetch(`/api/captcha?ctx=${context}`, { cache: "no-store" });
      const d = await res.json();
      if (!d?.ok) throw new Error();
      setCh(d);
      setStatus("ready");
    } catch {
      setStatus("error");
      setMsg(t.error);
    }
  }, [context, t.error]);

  useEffect(() => {
    load();
  }, [load]);

  // keep image-px ↔ screen-px scale in sync with the rendered width
  useEffect(() => {
    const el = boxRef.current;
    if (!el || !ch) return;
    const update = () => setScale(el.clientWidth / ch.width);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ch]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  useEffect(() => {
    if (status === "ready") handleRef.current?.focus();
  }, [status]);

  const maxX = ch ? ch.width - ch.size : 0;
  // The slider track is as wide as the image; the 44px handle travels (track - 44px).
  const HANDLE = 44;
  const travel = ch ? Math.max(1, ch.width * scale - HANDLE) : 1;
  const handleLeft = maxX ? (x / maxX) * travel : 0;

  const submit = async (pos: number, trail: [number, number][]) => {
    if (!ch) return;
    setStatus("checking");
    try {
      const res = await fetch("/api/captcha/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: ch.token, x: Math.round(pos), trail }),
      });
      const d = await res.json();
      if (d?.ok && d.pass) {
        setStatus("success");
        setMsg(t.success);
        onSolved(d.pass);
        return;
      }
      setStatus("fail");
      setMsg(d?.error === "expired" ? t.expired : t.fail);
    } catch {
      setStatus("fail");
      setMsg(t.fail);
    }
    setTimeout(() => load(), 900);
  };

  // ---- pointer dragging (mouse + touch) ----
  const onPointerDown = (e: React.PointerEvent) => {
    if (status !== "ready" || !ch) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    const now = performance.now();
    drag.current = { startX: e.clientX, startPos: x, t0: now, trail: [[0, x]] };
    setStatus("dragging");
    setMsg("");
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    // RTL pages still slide left→right: the image is always LTR.
    const next = Math.max(0, Math.min(maxX, d.startPos + ((e.clientX - d.startX) * maxX) / travel));
    setX(next);
    d.trail.push([Math.round(performance.now() - d.t0), Math.round(next * 10) / 10]);
    if (d.trail.length > 1500) d.trail.splice(1, 1);
  };
  const onPointerUp = () => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    if (x < 3) {
      setStatus("ready");
      return;
    }
    d.trail.push([Math.round(performance.now() - d.t0), Math.round(x * 10) / 10]);
    submit(x, d.trail);
  };

  // ---- keyboard ----
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (status !== "ready" && status !== "dragging") return;
    const step = e.shiftKey ? 12 : 3;
    let next = x;
    if (e.key === "ArrowRight") next = Math.min(maxX, x + step);
    else if (e.key === "ArrowLeft") next = Math.max(0, x - step);
    else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (kbd.current && x > 3) {
        const k = kbd.current;
        kbd.current = null;
        k.trail.push([Math.round(performance.now() - k.t0), x]);
        submit(x, k.trail);
      }
      return;
    } else return;
    e.preventDefault();
    if (!kbd.current) kbd.current = { t0: performance.now(), trail: [[0, x]] };
    kbd.current.trail.push([Math.round(performance.now() - kbd.current.t0), next]);
    setX(next);
  };

  const busy = status === "loading" || status === "checking";
  const tone =
    status === "success"
      ? "bg-emerald-500"
      : status === "fail"
        ? "bg-rose-500"
        : "bg-brand-600 dark:bg-brand-500";

  return (
    <div className="fixed inset-0 z-[300] flex items-end justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:items-center" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="captcha-title"
        className="w-full max-w-[400px] animate-scale-in rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-white/10 dark:bg-ink-900"
        dir="ltr"
      >
        {/* Header */}
        <div className="mb-3 flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-400/10 dark:text-brand-300">
            <Puzzle className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1" dir="auto">
            <h2 id="captcha-title" className="text-sm font-semibold text-slate-900 dark:text-white">
              {t.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.subtitle}</p>
          </div>
          <button type="button" onClick={() => load()} disabled={busy} aria-label={t.refresh} title={t.refresh} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40 dark:hover:bg-white/10 dark:hover:text-white">
            <RotateCw className={`h-4 w-4 ${status === "loading" ? "animate-spin" : ""}`} aria-hidden="true" />
          </button>
          <button type="button" onClick={onClose} aria-label={t.close} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Image */}
        <div
          ref={boxRef}
          className={`relative w-full overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10 ${status === "fail" ? "animate-[captcha-shake_0.4s]" : ""}`}
          style={{ aspectRatio: ch ? `${ch.width} / ${ch.height}` : "2 / 1" }}
        >
          {ch && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ch.bg} alt="" draggable={false} className="absolute inset-0 h-full w-full select-none" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ch.piece}
                alt=""
                draggable={false}
                className="absolute select-none drop-shadow-[0_3px_6px_rgba(0,0,0,0.55)]"
                style={{ left: x * scale, top: ch.y * scale, width: ch.size * scale, height: ch.size * scale, transition: drag.current ? "none" : "left 0.25s ease" }}
              />
            </>
          )}
          {(status === "loading" || status === "error") && (
            <div className="absolute inset-0 flex items-center justify-center">
              {status === "loading" ? <Loader2 className="h-6 w-6 animate-spin text-slate-400" /> : <button type="button" onClick={() => load()} className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow dark:bg-ink-900 dark:text-slate-200">{t.refresh}</button>}
            </div>
          )}
          {status === "success" && (
            <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/20 backdrop-blur-[1px]">
              <span className="flex h-12 w-12 animate-scale-in items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                <Check className="h-7 w-7" strokeWidth={3} />
              </span>
            </div>
          )}
        </div>

        {/* Slider */}
        <div className="relative mt-3 h-11 select-none rounded-xl bg-slate-100 ring-1 ring-inset ring-slate-200 dark:bg-white/[0.05] dark:ring-white/10">
          <div className={`absolute inset-y-0 start-0 rounded-xl opacity-20 ${tone}`} style={{ width: handleLeft + HANDLE }} aria-hidden="true" />
          <span className={`pointer-events-none absolute inset-0 flex items-center justify-center ps-10 text-xs font-medium text-slate-400 transition-opacity dark:text-slate-500 ${x > 4 ? "opacity-0" : "opacity-100"}`} dir="auto">
            {t.slide}
          </span>
          <button
            ref={handleRef}
            type="button"
            role="slider"
            aria-label={t.slide}
            aria-valuemin={0}
            aria-valuemax={maxX}
            aria-valuenow={Math.round(x)}
            aria-describedby="captcha-kbd"
            disabled={busy || status === "success"}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onKeyDown}
            className={`absolute top-0 flex h-11 w-11 touch-none items-center justify-center rounded-xl text-white shadow-md transition-colors ${tone} ${status === "ready" ? "cursor-grab" : status === "dragging" ? "cursor-grabbing" : ""} focus-visible:ring-4 focus-visible:ring-brand-500/30`}
            style={{ left: handleLeft, transition: drag.current ? "none" : "left 0.25s ease, background-color 0.2s" }}
          >
            {status === "checking" ? <Loader2 className="h-5 w-5 animate-spin" /> : status === "success" ? <Check className="h-5 w-5" strokeWidth={3} /> : status === "fail" ? <X className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
          </button>
        </div>

        {/* Status line */}
        <div className="mt-2.5 flex min-h-[20px] items-center justify-between gap-2 text-xs" dir="auto">
          <span aria-live="polite" className={status === "success" ? "font-medium text-emerald-600 dark:text-emerald-400" : status === "fail" || status === "error" ? "font-medium text-rose-600 dark:text-rose-400" : "text-slate-400"}>
            {status === "checking" ? t.checking : msg}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> TestSpeedInternet
          </span>
        </div>
        <p id="captcha-kbd" className="sr-only">
          {t.keyboard}
        </p>
      </div>
    </div>
  );
}
