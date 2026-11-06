"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  Check,
  ChevronDown,
  CircleCheck,
  CircleMinus,
  Copy,
  Download,
  History as HistoryIcon,
  MapPin,
  RotateCcw,
  Server,
  Share2,
  Square,
  TriangleAlert,
  Upload,
  Wifi,
  Zap,
} from "lucide-react";
import { useLocale } from "@/i18n/client";
import { lp, pick, type Locale } from "@/i18n/config";
import { speedTestMessages, type SpeedTestMessages } from "@/i18n/messages/speedtest";
import Gauge, { type Tone } from "./speedtest/Gauge";
import Sparkline from "./speedtest/Sparkline";
import {
  AbortedError,
  CF_DOWN,
  SpeedTestError,
  measurePing,
  measureThroughput,
  type ErrorCode,
} from "./speedtest/engine";
import {
  PING_TIERS,
  RATING_TONE,
  SCALE_TIERS,
  activityChecks,
  coloCity,
  countryName,
  flagUrl,
  formatMs,
  formatSpeed,
  formatTick,
  niceMax,
  numberLocale,
  rateConnection,
  type Results,
} from "./speedtest/format";
import { addToHistory, clearHistory, loadHistory, type HistoryEntry } from "./speedtest/history";
import { ProviderLogo } from "./ip/shared";
import { ispBrand } from "@/lib/isp";

type Mode = "full" | "download" | "upload" | "ping";
type Phase = "idle" | "ping" | "download" | "upload" | "done" | "error" | "cancelled";
type Step = "ping" | "download" | "upload";
type Series = { download: number[]; upload: number[]; ping: number[] };

type ConnInfo = {
  ok: boolean;
  ip?: string;
  isp?: string;
  org?: string;
  as?: string;
  country?: string;
  countryCode?: string;
  city?: string;
};

const EMPTY: Results = { download: null, upload: null, ping: null, jitter: null };
const NO_SERIES: Series = { download: [], upload: [], ping: [] };
const SITE = "https://www.testspeedinternet.com";
const DURATION_S: Record<Mode, number> = { full: 20, download: 10, upload: 8, ping: 3 };
const STEPS: Record<Mode, Step[]> = {
  full: ["ping", "download", "upload"],
  download: ["download"],
  upload: ["upload"],
  ping: ["ping"],
};
const COLORS = { download: "#3b82f6", upload: "#8b5cf6", ping: "#10b981", jitter: "#f59e0b" };

// ---------------------------------------------------------------------------
// Small hooks
// ---------------------------------------------------------------------------

function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduce;
}

/** Eases a number toward `target` with requestAnimationFrame (instant when reduced motion). */
/** Pause between steps so the needle can fall back to 0. Resolves early if the run is stopped. */
function settle(signal: AbortSignal, ms = 900): Promise<void> {
  return new Promise((resolve) => {
    if (signal.aborted) return resolve();
    const id = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => { clearTimeout(id); resolve(); }, { once: true });
  });
}

function useEased(target: number, reduce: boolean): number {
  const [value, setValue] = useState(target);
  const ref = useRef(target);
  useEffect(() => {
    if (reduce) {
      ref.current = target;
      setValue(target);
      return;
    }
    let raf = 0;
    const step = () => {
      const diff = target - ref.current;
      if (Math.abs(diff) < 0.02) {
        ref.current = target;
        setValue(target);
        return;
      }
      ref.current += diff * 0.12;
      setValue(ref.current);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, reduce]);
  return value;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SpeedTest({ mode = "full" }: { mode?: Mode }) {
  const locale = useLocale();
  const t = pick(speedTestMessages, locale);
  const reduce = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("idle");
  const [results, setResults] = useState<Results>(EMPTY);
  const [error, setError] = useState<ErrorCode | null>(null);
  const [info, setInfo] = useState<ConnInfo | null>(null);
  const [colo, setColo] = useState("");
  const [live, setLive] = useState(0); // gauge target (Mbps, or ms in ping mode)
  const [pingLive, setPingLive] = useState<number | null>(null);
  const [series, setSeries] = useState<Series>(NO_SERIES);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [announce, setAnnounce] = useState("");

  const msScale = mode === "ping";
  const tiers = msScale ? PING_TIERS : SCALE_TIERS;
  const [scaleMax, setScaleMax] = useState(msScale ? PING_TIERS[0] : 100);
  const growingRef = useRef(false);
  const runRef = useRef<AbortController | null>(null);

  const animated = useEased(live, reduce);

  // Grow the dial while testing so the arc stays in a useful range.
  useEffect(() => {
    if (!growingRef.current) return;
    const nm = niceMax(animated, tiers);
    if (nm > scaleMax) setScaleMax(nm);
  }, [animated, scaleMax, tiers]);

  // Connection details, history, share support, and the nearest server (colo).
  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/ip", { cache: "no-store", signal: ctrl.signal })
      .then((r) => r.json())
      .then((data: ConnInfo) => setInfo(data))
      .catch(() => {
        if (!ctrl.signal.aborted) setInfo({ ok: false });
      });
    fetch(`${CF_DOWN}?bytes=0&probe=1&t=${Date.now()}`, { cache: "no-store", signal: ctrl.signal })
      .then((r) => {
        const c = r.headers.get("cf-meta-colo");
        if (c) setColo((prev) => prev || c);
      })
      .catch(() => {});
    // Fallback: the trace endpoint always reports the serving data centre ("colo=LIS").
    fetch("https://speed.cloudflare.com/cdn-cgi/trace", { cache: "no-store", signal: ctrl.signal })
      .then((r) => r.text())
      .then((txt) => {
        const c = /^colo=([A-Z]{3})$/m.exec(txt)?.[1];
        if (c) setColo((prev) => prev || c);
      })
      .catch(() => {});
    setHistory(loadHistory());
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
    return () => {
      ctrl.abort();
      runRef.current?.abort();
    };
  }, []);

  // Dev-only preview of the result/running states: add ?stdemo=done|download|upload|ping|error
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const demo = new URLSearchParams(window.location.search).get("stdemo");
    if (!demo) return;
    const dl = [0, 30, 120, 260, 340, 365, 372, 380, 376, 384, 379, 388, 383, 386, 390, 385, 389, 392];
    const ul = [0, 15, 48, 71, 82, 88, 90, 91, 92, 92.5, 93, 92.8];
    const pg = [14, 12, 13, 11, 15, 12, 12, 13];
    growingRef.current = false;
    if (demo === "download" || demo === "upload") {
      setPhase(demo);
      setResults({ ...EMPTY, ping: 11.4, jitter: 1.3, download: demo === "upload" ? 384.6 : null });
      setSeries({ ping: pg, download: demo === "upload" ? dl : dl.slice(0, 11), upload: demo === "upload" ? ul.slice(0, 7) : [] });
      setScaleMax(500);
      setLive(demo === "upload" ? 88 : 372);
    } else if (demo === "ping") {
      setPhase("ping");
      setPingLive(13);
      setSeries({ ...NO_SERIES, ping: pg.slice(0, 5) });
    } else if (demo === "error") {
      setPhase("error");
      setError("upload");
      setResults({ ...EMPTY, ping: 11.4, jitter: 1.3, download: 384.6 });
    } else {
      const r = { download: 384.6, upload: 92.8, ping: 11.4, jitter: 1.3 };
      const r2: Results = {
        download: mode === "full" || mode === "download" ? r.download : null,
        upload: mode === "full" || mode === "upload" ? r.upload : null,
        ping: mode === "full" || mode === "ping" ? r.ping : null,
        jitter: mode === "full" || mode === "ping" ? r.jitter : null,
      };
      setResults(r2);
      setSeries({ download: dl, upload: ul, ping: pg });
      const primary = r2.download ?? r2.upload ?? r2.ping ?? 0;
      setScaleMax(niceMax(Math.max(primary, 1), mode === "ping" ? PING_TIERS : SCALE_TIERS));
      setLive(0);
      setPhase("done");
    }
  }, [mode]);

  // --- Orchestration ----------------------------------------------------------

  const run = useCallback(async () => {
    runRef.current?.abort();
    const ctrl = new AbortController();
    runRef.current = ctrl;
    const { signal } = ctrl;

    setError(null);
    setResults(EMPTY);
    setSeries(NO_SERIES);
    setPingLive(null);
    setCopied(false);
    setLive(0);
    setScaleMax(tiers[0]);
    growingRef.current = true;
    setAnnounce(t.live.started);

    const wantPing = mode === "full" || mode === "ping";
    const wantDownload = mode === "full" || mode === "download";
    const wantUpload = mode === "full" || mode === "upload";
    const r: Results = { ...EMPTY };
    const onColo = (c: string) => setColo(c);

    try {
      if (wantPing) {
        setPhase("ping");
        const res = await measurePing({
          signal,
          onColo,
          onSample: (ms, samples) => {
            setPingLive(ms);
            setSeries((s) => ({ ...s, ping: samples }));
            if (msScale) setLive(ms);
          },
        });
        r.ping = res.ping;
        r.jitter = res.jitter;
        setResults({ ...r });
      }

      if (wantDownload) {
        setPhase("download");
        setLive(0);
        r.download = await measureThroughput("download", {
          signal,
          onColo,
          onSample: (m) => {
            setLive(m);
            setSeries((s) => ({ ...s, download: [...s.download, m] }));
          },
        });
        setResults({ ...r });
      }

      if (wantUpload) {
        // Let the needle drop from the download result to 0 before upload starts.
        if (wantDownload) {
          setLive(0);
          await settle(signal);
          if (signal.aborted) throw new AbortedError();
        }
        setPhase("upload");
        setLive(0);
        r.upload = await measureThroughput("upload", {
          signal,
          onColo,
          onSample: (m) => {
            setLive(m);
            setSeries((s) => ({ ...s, upload: [...s.upload, m] }));
          },
        });
        setResults({ ...r });
      }

      if (signal.aborted) return;
      // Lock the dial to the result range and rest the arc on the main result.
      growingRef.current = false;
      const primary = r.download ?? r.upload ?? r.ping ?? 0;
      setScaleMax(
        msScale ? niceMax(Math.max(primary, 1), PING_TIERS) : niceMax(Math.max(r.download ?? 0, r.upload ?? 0, 1))
      );
      // Finished: the needle returns to 0 and GO is ready for a new test;
      // the results stay in the cards below.
      setLive(0);
      setPhase("done");
      setHistory(addToHistory({ t: Date.now(), mode, ...r }));
      setAnnounce(`${t.live.finished} ${summaryLines(r, t, locale).join(". ")}`);
    } catch (e) {
      if (runRef.current !== ctrl) return; // a newer run (or unmount) took over
      growingRef.current = false;
      setLive(0);
      if (e instanceof AbortedError || signal.aborted) {
        setPhase("cancelled");
        setAnnounce(t.live.stopped);
      } else {
        const code: ErrorCode = e instanceof SpeedTestError ? e.code : "generic";
        setError(code);
        setPhase("error");
        setAnnounce(t.errors[code]);
      }
    }
  }, [mode, msScale, tiers, t, locale]);

  const stop = useCallback(() => runRef.current?.abort(), []);

  // --- Actions ----------------------------------------------------------------

  const shareText = useMemo(() => [t.shareTitle, ...summaryLines(results, t, locale)].join("\n"), [results, t, locale]);
  const shareUrl = `${SITE}${lp(locale, "/")}`;

  const copy = useCallback(async () => {
    const text = `${shareText}\n${t.shareFooter}: ${shareUrl}`;
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand("copy");
        ta.remove();
      } catch {
        ok = false;
      }
    }
    if (ok) {
      setCopied(true);
      setAnnounce(t.copied);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }, [shareText, shareUrl, t]);

  const share = useCallback(async () => {
    try {
      await navigator.share({ title: t.shareTitle, text: shareText, url: shareUrl });
    } catch {
      /* dismissed */
    }
  }, [shareText, shareUrl, t]);

  // --- Derived ------------------------------------------------------------------

  const testing = phase === "ping" || phase === "download" || phase === "upload";
  const steps = STEPS[mode];
  const tone: Tone =
    phase === "upload" || (phase === "done" && mode === "upload")
      ? "upload"
      : phase === "ping" || mode === "ping"
        ? "ping"
        : "download";
  const unitMbps = t.units.mbps;
  const ticks = [0, 1, 2, 3, 4, 5].map((i) => formatTick((scaleMax / 5) * i, locale));
  const fraction = scaleMax > 0 ? animated / scaleMax : 0;

  const fmtSpeed = (v: number) => formatSpeed(v, locale);
  const fmtMs = (v: number) => formatMs(v, locale);

  const cards: {
    key: keyof Series | "jitter";
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    value: string;
    unit: string;
    active: boolean;
    color: string;
    data?: number[];
  }[] = [];
  if (mode === "full" || mode === "download")
    cards.push({
      key: "download",
      label: t.metrics.download,
      icon: Download,
      value: results.download != null ? fmtSpeed(results.download) : phase === "download" ? fmtSpeed(animated) : "–",
      unit: unitMbps,
      active: phase === "download",
      color: COLORS.download,
      data: series.download,
    });
  if (mode === "full" || mode === "upload")
    cards.push({
      key: "upload",
      label: t.metrics.upload,
      icon: Upload,
      value: results.upload != null ? fmtSpeed(results.upload) : phase === "upload" ? fmtSpeed(animated) : "–",
      unit: unitMbps,
      active: phase === "upload",
      color: COLORS.upload,
      data: series.upload,
    });
  if (mode === "full" || mode === "ping") {
    cards.push({
      key: "ping",
      label: t.metrics.ping,
      icon: Zap,
      value: results.ping != null ? fmtMs(results.ping) : phase === "ping" && pingLive != null ? fmtMs(pingLive) : "–",
      unit: t.units.ms,
      active: phase === "ping",
      color: COLORS.ping,
      data: series.ping,
    });
    cards.push({
      key: "jitter",
      label: t.metrics.jitter,
      icon: Activity,
      value: results.jitter != null ? fmtMs(results.jitter) : "–",
      unit: t.units.ms,
      active: phase === "ping",
      color: COLORS.jitter,
    });
  }
  const gridClass =
    cards.length >= 4
      ? "grid-cols-2 sm:grid-cols-4"
      : cards.length === 2
        ? "mx-auto max-w-md grid-cols-2"
        : "mx-auto max-w-[260px] grid-cols-1";

  const rating = phase === "done" ? rateConnection(results) : null;
  const checks = phase === "done" ? activityChecks(results) : [];

  return (
    <div className="mx-auto w-full max-w-3xl animate-fade-in-up">
      <ConnectionBar info={info} colo={colo} t={t} locale={locale} />

      {/* Gauge */}
      <div className="relative mx-auto -mb-9 mt-3 w-[248px] sm:-mb-11 sm:mt-5 sm:w-[300px] md:w-[320px]">
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-6 -z-10 rounded-full blur-3xl transition-opacity duration-700 ${
            tone === "upload" ? "bg-violet-500/20" : tone === "ping" ? "bg-emerald-500/15" : "bg-brand-500/20"
          } ${testing ? "opacity-100" : "opacity-40 dark:opacity-60"}`}
        />
        <Gauge
          fraction={fraction}
          ticks={ticks}
          tone={tone}
          spinning={phase === "ping" && !msScale}
          dim={phase === "idle" || phase === "cancelled" || phase === "error"}
          label={t.gaugeLabel}
        >
          <GaugeCenter
            phase={phase}
            mode={mode}
            t={t}
            onStart={run}
            value={
              phase === "ping"
                ? pingLive != null
                  ? fmtMs(pingLive)
                  : "–"
                : phase === "done"
                  ? results.download != null
                    ? fmtSpeed(results.download)
                    : results.upload != null
                      ? fmtSpeed(results.upload)
                      : results.ping != null
                        ? fmtMs(results.ping)
                        : "–"
                  : fmtSpeed(animated)
            }
          />
        </Gauge>
      </div>

      {/* Status / controls row */}
      <div className="relative mt-0 flex min-h-[44px] flex-wrap items-center justify-center gap-x-3 gap-y-2">
        {phase === "idle" && <p className="text-sm muted">{t.status.idle.replace("{s}", String(DURATION_S[mode]))}</p>}
        {phase === "cancelled" && <p className="text-sm muted">{t.status.cancelled}</p>}
        {testing && (
          <>
            {steps.length > 1 ? (
              <Stepper steps={steps} phase={phase} t={t} />
            ) : (
              <p className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-60 motion-safe:animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
                </span>
                {t.status[phase as Step]}
              </p>
            )}
            <button type="button" onClick={stop} className="btn-ghost px-3 py-1.5 text-xs">
              <Square className="h-3 w-3 fill-current" aria-hidden="true" />
              {t.stop}
            </button>
          </>
        )}
        {phase === "done" && (
          <>
            <button type="button" onClick={run} className="btn-primary px-4 py-2.5">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              {t.testAgain}
            </button>
            <button type="button" onClick={copy} className="btn-secondary px-4 py-2.5">
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4" aria-hidden="true" />
              )}
              {copied ? t.copied : t.copy}
            </button>
            {canShare && (
              <button type="button" onClick={share} className="btn-secondary px-4 py-2.5">
                <Share2 className="h-4 w-4" aria-hidden="true" />
                {t.share}
              </button>
            )}
          </>
        )}
        {phase === "error" && error && (
          <div
            role="alert"
            className="flex w-full max-w-xl flex-col items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-start text-sm text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200 sm:flex-row"
          >
            <TriangleAlert className="h-5 w-5 shrink-0 text-amber-500" aria-hidden="true" />
            <p className="flex-1">{t.errors[error]}</p>
            <button type="button" onClick={run} className="btn-secondary shrink-0 px-3 py-2 text-xs">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              {t.retry}
            </button>
          </div>
        )}
      </div>

      {/* Result cards */}
      <div className={`mt-4 grid gap-2.5 sm:mt-5 sm:gap-3 ${gridClass}`}>
        {cards.map(({ key, ...c }) => (
          <ResultCard key={key} {...c} />
        ))}
      </div>

      {/* Verdict */}
      {rating && (
        <section className="card mt-3 animate-fade-in-up p-4 text-start sm:mt-4 sm:p-5" aria-labelledby="st-verdict">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${RATING_TONE[rating.rating]}`}
            >
              {t.verdict.ratings[rating.rating]}
            </span>
            <h3 id="st-verdict" className="text-sm font-semibold text-slate-900 dark:text-white">
              {t.verdict.title}
            </h3>
          </div>
          <p className="mt-2 text-sm leading-relaxed muted">
            {rating.basis === "download"
              ? t.verdict.speedDesc[rating.rating]
              : rating.basis === "upload"
                ? t.verdict.uploadDesc[rating.rating]
                : t.verdict.latencyDesc[rating.rating]}
          </p>
          {checks.length > 0 && (
            <ul className="mt-3 grid grid-cols-1 gap-1.5 min-[400px]:grid-cols-2 sm:grid-cols-3">
              {checks.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-2 text-[13px] text-slate-700 dark:bg-white/[0.04] dark:text-slate-300"
                >
                  {c.ok ? (
                    <CircleCheck className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                  ) : (
                    <CircleMinus className="h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
                  )}
                  <span className="min-w-0 flex-1">{t.verdict.activities[c.id]}</span>
                  <span className="sr-only">: {c.ok ? t.verdict.ok : t.verdict.notIdeal}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Local history */}
      {!testing && history.length > 0 && (
        <HistoryPanel
          history={history}
          t={t}
          locale={locale}
          onClear={() => {
            clearHistory();
            setHistory([]);
          }}
        />
      )}

      <div role="status" aria-live="polite" className="sr-only">
        {announce}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

function summaryLines(r: Results, t: SpeedTestMessages, locale: Locale): string[] {
  const out: string[] = [];
  if (r.download != null) out.push(`${t.metrics.download}: ${formatSpeed(r.download, locale)} ${t.units.mbps}`);
  if (r.upload != null) out.push(`${t.metrics.upload}: ${formatSpeed(r.upload, locale)} ${t.units.mbps}`);
  if (r.ping != null) out.push(`${t.metrics.ping}: ${formatMs(r.ping, locale)} ${t.units.ms}`);
  if (r.jitter != null) out.push(`${t.metrics.jitter}: ${formatMs(r.jitter, locale)} ${t.units.ms}`);
  return out;
}

function GaugeCenter({
  phase,
  mode,
  value,
  t,
  onStart,
}: {
  phase: Phase;
  mode: Mode;
  value: string;
  t: SpeedTestMessages;
  onStart: () => void;
}) {
  if (phase === "idle" || phase === "cancelled" || phase === "error" || phase === "done") {
    return (
      <button
        type="button"
        onClick={onStart}
        aria-label={phase === "done" ? t.testAgain : t.start}
        className="group relative flex aspect-square w-[44%] items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-xl shadow-brand-600/30 ring-[6px] ring-brand-500/10 transition-transform duration-200 hover:scale-[1.04] active:scale-[0.97] dark:from-brand-400 dark:to-brand-600 dark:shadow-brand-500/20 dark:ring-brand-400/10"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-brand-500/25 motion-safe:animate-ping [animation-duration:2.6s]"
        />
        <span className={`relative font-extrabold tracking-wide ${t.go.length > 3 ? "text-lg sm:text-xl" : "text-2xl sm:text-3xl"}`}>
          {t.go}
        </span>
      </button>
    );
  }

  // Only reached while a step is running (idle/done show the GO button).
  const shown = phase as Step;
  const Icon = shown === "upload" ? Upload : shown === "ping" ? Zap : Download;
  const unit = shown === "ping" ? t.units.ms : t.units.mbps;
  const labelTone =
    shown === "upload"
      ? "text-violet-600 dark:text-violet-400"
      : shown === "ping"
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-brand-600 dark:text-brand-400";

  return (
    <div className="flex flex-col items-center" aria-hidden="true">
      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider ${labelTone}`}>
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {t.metrics[shown]}
      </span>
      <span className="tabular mt-1 text-5xl font-extrabold leading-none tracking-tight text-slate-900 dark:text-white sm:text-6xl">
        {value}
      </span>
      <span className="mt-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500">{unit}</span>
    </div>
  );
}

function Stepper({ steps, phase, t }: { steps: Step[]; phase: Phase; t: SpeedTestMessages }) {
  const current = steps.indexOf(phase as Step);
  return (
    <ol aria-label={t.steps} className="flex items-center gap-1.5 text-xs font-medium sm:gap-2 sm:text-sm">
      {steps.map((s, i) => {
        const state = i < current ? "done" : i === current ? "active" : "todo";
        return (
          <li key={s} className="flex items-center gap-1.5 sm:gap-2" aria-current={state === "active" ? "step" : undefined}>
            {i > 0 && (
              <span
                aria-hidden="true"
                className={`h-px w-4 sm:w-6 ${state === "todo" ? "bg-slate-200 dark:bg-white/10" : "bg-brand-400/60"}`}
              />
            )}
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full ${
                state === "done"
                  ? "bg-emerald-500 text-white"
                  : state === "active"
                    ? "bg-brand-600 text-white ring-4 ring-brand-500/15 dark:bg-brand-500"
                    : "bg-slate-100 text-slate-400 ring-1 ring-inset ring-slate-200 dark:bg-white/5 dark:ring-white/10"
              }`}
            >
              {state === "done" ? (
                <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
              ) : (
                <span className={`h-1.5 w-1.5 rounded-full ${state === "active" ? "bg-white motion-safe:animate-pulse" : "bg-current"}`} />
              )}
            </span>
            <span
              className={
                state === "active"
                  ? "text-slate-900 dark:text-white"
                  : state === "done"
                    ? "text-slate-600 dark:text-slate-300"
                    : "text-slate-400 dark:text-slate-500"
              }
            >
              {t.metrics[s]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function ResultCard({
  label,
  icon: Icon,
  value,
  unit,
  active,
  color,
  data,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  value: string;
  unit: string;
  active: boolean;
  color: string;
  data?: number[];
}) {
  return (
    <div
      className={`card relative flex flex-col overflow-hidden p-3 text-start transition-shadow sm:p-4 ${
        active ? "ring-2 ring-brand-500/30 dark:ring-brand-400/30" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Icon className="h-3.5 w-3.5 shrink-0" style={{ color }} />
          <span className="truncate">{label}</span>
        </span>
        {active && <span className="h-1.5 w-1.5 shrink-0 rounded-full motion-safe:animate-pulse" style={{ background: color }} />}
      </div>
      <div className="mt-1">
        <span dir="ltr" className="inline-flex items-baseline gap-1">
          <span className="tabular text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-[28px]">
            {value}
          </span>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{unit}</span>
        </span>
      </div>
      {data && <Sparkline data={data} color={color} className="mt-2 h-7 w-full" />}
    </div>
  );
}

function ConnectionBar({
  info,
  colo,
  t,
  locale,
}: {
  info: ConnInfo | null;
  colo: string;
  t: SpeedTestMessages;
  locale: Locale;
}) {
  const [copied, setCopied] = useState(false);
  const loading = info == null;
  const ok = !!info?.ok;
  const brand = ispBrand(info?.isp, info?.org, info?.as);
  const flag = flagUrl(info?.countryCode);
  const flag2x = flagUrl(info?.countryCode, true);
  const country = ok ? countryName(info!.countryCode, info!.country, locale) : "";
  const place = [info?.city, country].filter(Boolean).join(locale === "ar" ? "، " : ", ");
  const server = colo ? coloCity(colo) : "";

  const copyIp = async () => {
    if (!info?.ip) return;
    try {
      await navigator.clipboard.writeText(info.ip);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  };

  const skel = <span className="inline-block h-3.5 w-20 animate-pulse rounded bg-slate-200 align-middle dark:bg-white/10" />;
  // One slim bar on desktop; wraps into short centred lines on phones.
  const item = "flex min-w-0 items-center gap-1.5 px-2.5 py-1 sm:px-3";
  const sep = "sm:border-s sm:border-slate-200/80 sm:dark:border-white/10";

  return (
    <dl className="mx-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-y-0.5 rounded-2xl border border-slate-200/80 bg-white/75 px-1.5 py-1 text-[13px] text-slate-600 shadow-sm shadow-slate-900/[0.04] backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300 dark:shadow-none sm:rounded-full sm:py-1.5">
      {/* Provider */}
      <div className={item}>
        <dt className="sr-only">{t.conn.provider}</dt>
        {loading ? (
          <span className="h-5 w-5 shrink-0 animate-pulse rounded-md bg-slate-200 dark:bg-white/10" />
        ) : ok && brand.name ? (
          <ProviderLogo brand={brand} size={20} />
        ) : (
          <Wifi className="h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
        )}
        <dd className="max-w-[11rem] truncate font-semibold text-slate-900 dark:text-white" title={info?.isp || undefined}>
          {loading ? skel : ok ? brand.name || "–" : t.conn.unavailable}
        </dd>
      </div>

      {/* IP address */}
      {(loading || (ok && info?.ip)) && (
        <div className={`${item} ${sep}`}>
          <dt className="text-xs font-medium text-slate-400 dark:text-slate-500">IP</dt>
          <dd dir="ltr" className="font-mono text-[12.5px] font-medium text-slate-800 dark:text-slate-100">
            {loading ? skel : info!.ip}
          </dd>
          {ok && info?.ip && (
            <button
              type="button"
              onClick={copyIp}
              aria-label={copied ? t.copied : `${t.copy} IP`}
              title={copied ? t.copied : t.copy}
              className="-me-1 flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
            </button>
          )}
        </div>
      )}

      {/* Location */}
      {place && (
        <div className={`${item} ${sep}`}>
          <dt className="sr-only">{t.conn.location}</dt>
          {flag ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={flag}
              srcSet={flag2x ? `${flag2x} 2x` : undefined}
              width={18}
              height={13}
              alt=""
              className="h-[13px] w-[18px] shrink-0 rounded-[2px] object-cover ring-1 ring-black/5 dark:ring-white/10"
            />
          ) : (
            <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-500" aria-hidden="true" />
          )}
          <dd className="truncate font-medium text-slate-800 dark:text-slate-100">
            <bdi>{place}</bdi>
          </dd>
        </div>
      )}

      {/* Test server */}
      <div className={`${item} ${sep}`} title={colo ? `${t.conn.server}: ${server} (${colo})` : t.conn.server}>
        <dt className="sr-only">{t.conn.server}</dt>
        <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 motion-safe:animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <dd className="truncate font-medium text-slate-800 dark:text-slate-100">
          <bdi>{server || t.conn.auto}</bdi>
        </dd>
      </div>
    </dl>
  );
}

function HistoryPanel({
  history,
  t,
  locale,
  onClear,
}: {
  history: HistoryEntry[];
  t: SpeedTestMessages;
  locale: Locale;
  onClear: () => void;
}) {
  const df = new Intl.DateTimeFormat(numberLocale(locale), {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const dash = <span className="text-slate-300 dark:text-slate-600">–</span>;
  return (
    <details className="group card-muted mt-3 text-start sm:mt-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2">
          <HistoryIcon className="h-4 w-4 text-slate-400" aria-hidden="true" />
          {t.history.title}
          <span className="rounded-full bg-slate-200/70 px-1.5 text-[11px] font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
            {history.length}
          </span>
        </span>
        <ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="px-2 pb-3 sm:px-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 dark:text-slate-400">
                <th className="px-2 py-1.5 text-start font-medium">{t.history.date}</th>
                <th className="px-2 py-1.5 text-end font-medium">
                  <Download className="inline h-3.5 w-3.5" style={{ color: COLORS.download }} aria-hidden="true" />
                  <span className="sr-only">{t.metrics.download}</span>
                </th>
                <th className="px-2 py-1.5 text-end font-medium">
                  <Upload className="inline h-3.5 w-3.5" style={{ color: COLORS.upload }} aria-hidden="true" />
                  <span className="sr-only">{t.metrics.upload}</span>
                </th>
                <th className="px-2 py-1.5 text-end font-medium">
                  <Zap className="inline h-3.5 w-3.5" style={{ color: COLORS.ping }} aria-hidden="true" />
                  <span className="sr-only">{t.metrics.ping}</span>
                </th>
              </tr>
            </thead>
            <tbody className="tabular">
              {history.map((h) => (
                <tr key={h.t} className="border-t border-slate-200/70 dark:border-white/[0.06]">
                  <td className="whitespace-nowrap px-2 py-1.5 text-slate-500 dark:text-slate-400">{df.format(h.t)}</td>
                  <td dir="ltr" className="whitespace-nowrap px-2 py-1.5 text-end font-semibold text-slate-800 rtl:text-start dark:text-slate-100">
                    {h.download != null ? formatSpeed(h.download, locale) : dash}
                  </td>
                  <td dir="ltr" className="whitespace-nowrap px-2 py-1.5 text-end font-semibold text-slate-800 rtl:text-start dark:text-slate-100">
                    {h.upload != null ? formatSpeed(h.upload, locale) : dash}
                  </td>
                  <td dir="ltr" className="whitespace-nowrap px-2 py-1.5 text-end text-slate-600 rtl:text-start dark:text-slate-300">
                    {h.ping != null ? `${formatMs(h.ping, locale)} ${t.units.ms}` : dash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 px-2 text-xs muted">
          <span>
            {t.units.mbps} · {t.history.note}
          </span>
          <button type="button" onClick={onClear} className="font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            {t.history.clear}
          </button>
        </div>
      </div>
    </details>
  );
}
