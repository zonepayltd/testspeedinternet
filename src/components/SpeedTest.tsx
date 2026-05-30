"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Upload, Zap, Activity, RotateCcw, Server, Wifi } from "lucide-react";

type Phase = "idle" | "ping" | "download" | "upload" | "done";
type Mode = "full" | "download" | "upload" | "ping";

type Metrics = {
  download: number | null;
  upload: number | null;
  ping: number | null;
  jitter: number | null;
};

type ConnInfo = {
  ok: boolean;
  ip?: string;
  isp?: string;
  country?: string;
  countryCode?: string;
  region?: string;
  city?: string;
};

const EMPTY: Metrics = { download: null, upload: null, ping: null, jitter: null };

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// Cloudflare's public speed-test backend — measures the REAL internet path,
// so values are accurate even when developing on localhost.
const CF_DOWN = "https://speed.cloudflare.com/__down";
const CF_UP = "https://speed.cloudflare.com/__up";

// Non-linear gauge scale (Mbps) — mirrors how real speed-test dials are spaced.
// Dynamic gauge scale — the max adapts to the connection so the dial is
// meaningful whether you have 1.5 Mbps or 900 Mbps. Each tier ÷5 = clean ticks.
const SCALE_TIERS = [2.5, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000];

function niceMax(v: number): number {
  for (const t of SCALE_TIERS) if (v <= t * 0.95) return t;
  return SCALE_TIERS[SCALE_TIERS.length - 1];
}

function fractionFor(v: number, scaleMax: number): number {
  if (v <= 0 || scaleMax <= 0) return 0;
  return Math.min(v / scaleMax, 1);
}

// 6 evenly-spaced ticks (0 … scaleMax).
function ticksFor(scaleMax: number): number[] {
  const step = scaleMax / 5;
  return [0, 1, 2, 3, 4, 5].map((i) => step * i);
}

// Tick label: integers as-is, small scales with one decimal.
function tickLabel(v: number): string {
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

const COLO: Record<string, string> = {
  CMN: "Casablanca",
  RBA: "Rabat",
  MRS: "Marseille",
  CDG: "Paris",
  LHR: "London",
  MAD: "Madrid",
  FRA: "Frankfurt",
  AMS: "Amsterdam",
  IAD: "Washington",
  EWR: "Newark",
  LAX: "Los Angeles",
  SIN: "Singapore",
  DXB: "Dubai",
  IST: "Istanbul",
};

// Real flag image (emoji flags don't render on Windows browsers).
function flagUrl(cc?: string, retina = false): string | null {
  if (!cc || cc.length !== 2) return null;
  const c = cc.toLowerCase();
  return retina
    ? `https://flagcdn.com/64x48/${c}.png`
    : `https://flagcdn.com/32x24/${c}.png`;
}

// Logo.dev publishable token (set NEXT_PUBLIC_LOGODEV_TOKEN in .env.local).
const LOGODEV_TOKEN = process.env.NEXT_PUBLIC_LOGODEV_TOKEN ?? "";

// Map well-known ISP names to a brand domain so we can fetch their logo.
const ISP_DOMAINS: [string, string][] = [
  ["maroc telecom", "iam.ma"],
  ["maroctelecom", "iam.ma"],
  ["menara", "iam.ma"],
  ["orange", "orange.ma"],
  ["inwi", "inwi.ma"],
  ["wana", "inwi.ma"],
];

function ispDomain(isp?: string): string | null {
  if (!isp) return null;
  const s = isp.toLowerCase();
  for (const [key, domain] of ISP_DOMAINS) {
    if (s.includes(key)) return domain;
  }
  return null;
}

function ispLogoUrl(isp?: string): string | null {
  const domain = ispDomain(isp);
  if (!domain) return null;
  // Real brand logo via Logo.dev when a token is configured…
  if (LOGODEV_TOKEN) {
    return `https://img.logo.dev/${domain}?token=${LOGODEV_TOKEN}&size=128&format=png&retina=true`;
  }
  // …otherwise fall back to the site favicon.
  return `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
}

function fmt(v: number): string {
  return v >= 100 ? v.toFixed(0) : v.toFixed(1);
}

// Gauge geometry: a 270° arc with the gap at the bottom.
const CENTER = 140;
const RADIUS = 116;
const START_ANGLE = -135;
const SWEEP = 270;

function point(angle: number, r = RADIUS) {
  const a = (angle * Math.PI) / 180;
  return { x: CENTER + r * Math.sin(a), y: CENTER - r * Math.cos(a) };
}

function arcPath(fromAngle: number, toAngle: number, r = RADIUS) {
  const s = point(fromAngle, r);
  const e = point(toAngle, r);
  const large = toAngle - fromAngle > 180 ? 1 : 0;
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(
    2
  )} ${e.y.toFixed(2)}`;
}

const TRACK_PATH = arcPath(START_ANGLE, START_ANGLE + SWEEP);
const PING_ARC = arcPath(START_ANGLE, START_ANGLE + 55); // short arc for the ping spinner

const PHASE_LABEL: Record<Phase, string> = {
  idle: "Ready",
  ping: "Ping",
  download: "Download",
  upload: "Upload",
  done: "Download",
};

export default function SpeedTest({ mode = "full" }: { mode?: Mode }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [metrics, setMetrics] = useState<Metrics>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<ConnInfo | null>(null);
  const [serverColo, setServerColo] = useState<string>("");

  // Smoothly eased gauge value, driven by requestAnimationFrame.
  const [animated, setAnimated] = useState(0);
  const targetRef = useRef(0);
  const animatedRef = useRef(0);

  // Dynamic gauge scale (max) that adapts to the connection speed.
  const [scaleMax, setScaleMax] = useState(100);
  const scaleMaxRef = useRef(100);
  const growScaleRef = useRef(false);

  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;
    let raf = 0;
    const tick = () => {
      const target = targetRef.current;
      const current = animatedRef.current;
      const diff = target - current;
      if (Math.abs(diff) > 0.05) {
        const next = current + diff * 0.12; // easing factor
        animatedRef.current = next;
        setAnimated(next);
      } else if (current !== target) {
        animatedRef.current = target;
        setAnimated(target);
      }
      // Grow the scale while testing so the needle stays in a useful range.
      if (growScaleRef.current) {
        const nm = niceMax(animatedRef.current);
        if (nm > scaleMaxRef.current) {
          scaleMaxRef.current = nm;
          setScaleMax(nm);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      aliveRef.current = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  const setTarget = useCallback((v: number) => {
    targetRef.current = v;
  }, []);

  // Fetch the visitor's connection details once on mount.
  useEffect(() => {
    let active = true;
    fetch("/api/ip", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: ConnInfo) => {
        if (active) setInfo(data);
      })
      .catch(() => {
        if (active) setInfo({ ok: false });
      });
    return () => {
      active = false;
    };
  }, []);

  // --- Measurement primitives -------------------------------------------------

  const measurePing = useCallback(async () => {
    try {
      await fetch(`${CF_DOWN}?bytes=0&warmup=1&t=${performance.now()}`, {
        cache: "no-store",
      });
    } catch {
      /* ignore */
    }

    const samples: number[] = [];
    for (let i = 0; i < 8; i++) {
      const t0 = performance.now();
      try {
        const res = await fetch(`${CF_DOWN}?bytes=0&n=${i}&t=${t0}`, {
          cache: "no-store",
        });
        const colo = res.headers.get("cf-meta-colo");
        if (colo && aliveRef.current) setServerColo(colo);
      } catch {
        continue;
      }
      samples.push(performance.now() - t0);
    }
    if (samples.length === 0) return { ping: 0, jitter: 0 };
    const min = Math.min(...samples);
    const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
    const jitter =
      samples.reduce((a, b) => a + Math.abs(b - avg), 0) / samples.length;
    return { ping: min, jitter };
  }, []);

  const measureStream = useCallback(
    async (kind: "download" | "upload") => {
      const durationMs = kind === "download" ? 8000 : 6000;
      const streams = kind === "download" ? 5 : 3;
      let bytes = 0;
      let stop = false;

      const start = performance.now();
      let warmed = false;
      let warmupBytes = 0;
      let warmupTime = start;
      let lastBytes = 0;
      let lastTime = start;

      let payload: Blob | null = null;
      if (kind === "upload") {
        const size = 2_000_000;
        const buf = new Uint8Array(size);
        for (let off = 0; off < size; off += 65536) {
          crypto.getRandomValues(buf.subarray(off, Math.min(off + 65536, size)));
        }
        // No explicit type → no Content-Type header → a CORS "simple request"
        // (avoids the OPTIONS preflight that was making uploads fail / read 0).
        payload = new Blob([buf]);
      }

      // No AbortController — we stop cleanly via the `stop` flag and
      // reader.cancel(), which avoids the noisy "AbortError" rejections.
      const loop = async (idx: number) => {
        while (!stop) {
          try {
            if (kind === "download") {
              const res = await fetch(
                `${CF_DOWN}?bytes=25000000&r=${start}-${idx}-${performance.now()}`,
                { cache: "no-store" }
              );
              const colo = res.headers.get("cf-meta-colo");
              if (colo && aliveRef.current) setServerColo(colo);
              if (!res.body) {
                const b = await res.arrayBuffer();
                bytes += b.byteLength;
                continue;
              }
              const reader = res.body.getReader();
              while (!stop) {
                const { done, value } = await reader.read();
                if (done) break;
                bytes += value.byteLength;
              }
              try {
                await reader.cancel();
              } catch {
                /* already closed */
              }
            } else {
              await fetch(CF_UP, {
                method: "POST",
                body: payload as Blob,
                cache: "no-store",
              });
              bytes += (payload as Blob).size;
            }
          } catch {
            break;
          }
        }
      };

      const loops = Array.from({ length: streams }, (_, i) => loop(i));

      const interval = setInterval(() => {
        const now = performance.now();
        const elapsed = now - start;
        if (!warmed && elapsed >= 1500) {
          warmed = true;
          warmupBytes = bytes;
          warmupTime = now;
        }
        const dt = (now - lastTime) / 1000;
        if (dt > 0) {
          const inst = ((bytes - lastBytes) * 8) / dt / 1e6;
          setTarget(inst);
        }
        lastBytes = bytes;
        lastTime = now;
      }, 200);

      await sleep(durationMs);
      stop = true;
      clearInterval(interval);
      await Promise.allSettled(loops);

      const end = performance.now();
      let useBytes = warmed ? bytes - warmupBytes : bytes;
      let useTime = (warmed ? end - warmupTime : end - start) / 1000;
      // Fallback: if nothing completed inside the post-warmup window, use the
      // whole run so a slow upload still reports a real figure instead of 0.
      if (useBytes <= 0) {
        useBytes = bytes;
        useTime = (end - start) / 1000;
      }
      const mbps = useTime > 0 ? (useBytes * 8) / useTime / 1e6 : 0;
      return Number.isFinite(mbps) ? mbps : 0;
    },
    [setTarget]
  );

  // --- Orchestration ----------------------------------------------------------

  const runTest = useCallback(async () => {
    setError(null);
    setMetrics(EMPTY);
    setTarget(0);
    // Start the scale at the smallest tier and let it grow with the connection
    // (so a slow 1.5 Mbps line still fills a meaningful part of the dial).
    scaleMaxRef.current = SCALE_TIERS[0];
    setScaleMax(SCALE_TIERS[0]);
    growScaleRef.current = true;

    const wantPing = mode === "full" || mode === "ping";
    const wantDownload = mode === "full" || mode === "download";
    const wantUpload = mode === "full" || mode === "upload";

    try {
      if (wantPing) {
        setPhase("ping");
        const { ping, jitter } = await measurePing();
        if (!aliveRef.current) return;
        setMetrics((m) => ({ ...m, ping, jitter }));
      }

      let download = 0;
      let upload = 0;
      if (wantDownload) {
        setPhase("download");
        download = await measureStream("download");
        if (!aliveRef.current) return;
        setMetrics((m) => ({ ...m, download }));
        setTarget(download);
      }

      if (wantUpload) {
        setPhase("upload");
        upload = await measureStream("upload");
        if (!aliveRef.current) return;
        setMetrics((m) => ({ ...m, upload }));
        if (mode === "upload") setTarget(upload);
      }

      // Lock the scale to the result range, then reset the needle to 0.
      growScaleRef.current = false;
      const peak = niceMax(Math.max(download, upload, 1));
      scaleMaxRef.current = peak;
      setScaleMax(peak);
      setTarget(0);
      setPhase("done");
    } catch {
      if (!aliveRef.current) return;
      setError("Something went wrong during the test. Please try again.");
      setPhase("idle");
    }
  }, [mode, measurePing, measureStream, setTarget]);

  // --- Derived render values --------------------------------------------------

  const testing = phase === "ping" || phase === "download" || phase === "upload";
  const fraction = fractionFor(animated, scaleMax);
  const progressPath = arcPath(START_ANGLE, START_ANGLE + SWEEP * fraction);
  const markerAngle = START_ANGLE + SWEEP * fraction;
  const marker = point(markerAngle, RADIUS);
  const gaugeTicks = ticksFor(scaleMax);

  const downloadValue =
    metrics.download != null
      ? fmt(metrics.download)
      : phase === "download"
        ? fmt(animated)
        : "-";
  const uploadValue =
    metrics.upload != null
      ? fmt(metrics.upload)
      : phase === "upload"
        ? fmt(animated)
        : "-";

  const locationLabel = info?.ok
    ? [info.city, info.country].filter(Boolean).join(", ")
    : "";
  const serverLabel = serverColo ? COLO[serverColo] ?? serverColo : "Auto-selected";
  const flag = flagUrl(info?.countryCode);
  const flag2x = flagUrl(info?.countryCode, true);
  const ispLogo = ispLogoUrl(info?.isp);

  const PhaseIcon =
    phase === "upload" ? Upload : phase === "ping" ? Zap : Download;

  // Which result tiles to show depends on the test mode.
  const statDefs: {
    key: string;
    icon: React.ReactNode;
    label: string;
    value: string;
    unit: string;
    active: boolean;
  }[] = [];
  if (mode === "full" || mode === "download")
    statDefs.push({ key: "dl", icon: <Download className="h-4 w-4" />, label: "Download", value: downloadValue, unit: "Mbps", active: phase === "download" });
  if (mode === "full" || mode === "upload")
    statDefs.push({ key: "ul", icon: <Upload className="h-4 w-4" />, label: "Upload", value: uploadValue, unit: "Mbps", active: phase === "upload" });
  if (mode === "full" || mode === "ping")
    statDefs.push({ key: "ping", icon: <Zap className="h-4 w-4" />, label: "Ping", value: metrics.ping != null ? metrics.ping.toFixed(0) : "-", unit: "ms", active: phase === "ping" });
  if (mode === "full" || mode === "ping")
    statDefs.push({ key: "jitter", icon: <Activity className="h-4 w-4" />, label: "Jitter", value: metrics.jitter != null ? metrics.jitter.toFixed(0) : "-", unit: "ms", active: phase === "ping" });

  const statGridClass =
    statDefs.length === 1
      ? "grid-cols-1 max-w-[220px]"
      : statDefs.length === 2
        ? "grid-cols-2 max-w-sm divide-x divide-slate-200"
        : "grid-cols-4 max-w-2xl divide-x divide-slate-200";

  return (
    <div className="flex w-full animate-fade-in-up flex-col items-center">
      {/* Connection line */}
      <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xs text-slate-400 sm:gap-x-3 sm:text-sm">
        {/* Provider (logo + name) */}
        <span className="flex items-center gap-2">
          {ispLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={ispLogo}
              width={24}
              height={24}
              alt={info?.isp ?? "Provider logo"}
              className="h-6 w-6 object-contain"
            />
          ) : (
            <Wifi className="h-4 w-4 text-brand-500" aria-hidden="true" />
          )}
          <span className="font-mono text-xs font-semibold tracking-tight text-slate-700 sm:text-sm">
            {info?.ok
              ? info.ip || info.isp
              : info
                ? "Unavailable"
                : "Detecting…"}
          </span>
        </span>

        {/* Location (flag + city) */}
        {locationLabel && (
          <>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              {flag && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={flag}
                  srcSet={flag2x ? `${flag2x} 2x` : undefined}
                  width={20}
                  height={15}
                  alt={info?.country ?? "Country flag"}
                  className="h-3.5 w-5 rounded-[2px] object-cover shadow-sm ring-1 ring-black/5"
                />
              )}
              {locationLabel}
            </span>
          </>
        )}
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-1.5">
          <Server className="h-3.5 w-3.5 text-brand-500" aria-hidden="true" />
          Server: {serverLabel}
        </span>
      </div>

      {/* Gauge */}
      <div className="relative mt-3 flex aspect-square w-full max-w-[270px] items-center justify-center sm:mt-5 sm:max-w-[360px]">
        {/* Soft radial glow behind gauge */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(37,99,235,0.18),transparent)] blur-2xl transition-opacity duration-700 ${
            testing ? "animate-pulse opacity-100" : "opacity-50"
          }`}
        />

        <svg viewBox="0 0 280 280" className="h-full w-full" role="img" aria-label="Internet speed gauge">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="55%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Track */}
          <path d={TRACK_PATH} fill="none" stroke="#e8edf5" strokeWidth={13} strokeLinecap="round" />

          {/* Ticks (dynamic scale) — faint before a test, full once it starts */}
          {gaugeTicks.map((t, i) => {
            const angle = START_ANGLE + SWEEP * (i / (gaugeTicks.length - 1));
            const a = point(angle, RADIUS - 1);
            const b = point(angle, RADIUS - 10);
            const label = point(angle, RADIUS - 26);
            const idle = phase === "idle";
            return (
              <g key={i}>
                <line
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={idle ? "#e2e8f0" : "#cbd5e1"}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
                <text
                  x={label.x}
                  y={label.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={idle ? "fill-slate-300" : "fill-slate-400"}
                  fontSize="9"
                  fontWeight="700"
                >
                  {tickLabel(t)}
                </text>
              </g>
            );
          })}

          {/* Ping scanning spinner */}
          {phase === "ping" && (
            <g style={{ transformOrigin: "140px 140px" }} className="animate-spin">
              <path d={PING_ARC} fill="none" stroke="url(#gaugeGradient)" strokeWidth={13} strokeLinecap="round" opacity={0.85} />
            </g>
          )}

          {/* Progress arc with glow */}
          {phase !== "ping" && fraction > 0.002 && (
            <path
              d={progressPath}
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth={13}
              strokeLinecap="round"
              filter="url(#glow)"
            />
          )}

          {/* Glowing marker dot at the arc tip (keeps the center clear) */}
          {phase !== "ping" && fraction > 0.002 && (
            <>
              <circle cx={marker.x} cy={marker.y} r={11} fill="#2563eb" opacity={0.18} filter="url(#glow)" />
              <circle cx={marker.x} cy={marker.y} r={7} fill="#ffffff" stroke="url(#gaugeGradient)" strokeWidth={4} />
            </>
          )}
        </svg>

        {/* Center content */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          {phase === "idle" ? (
            <button
              type="button"
              onClick={runTest}
              className="pointer-events-auto relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-brand-600 text-xl font-extrabold tracking-wide text-white shadow-xl shadow-brand-500/30 transition-transform duration-200 hover:scale-105 active:scale-95 sm:h-28 sm:w-28 sm:text-2xl"
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-brand-400/20" />
              <span className="relative">GO</span>
            </button>
          ) : phase === "ping" ? (
            <div className="animate-scale-in flex flex-col items-center">
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-600">
                Ping
              </span>
              <div className="mt-3 flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-2.5 w-2.5 animate-bounce rounded-full bg-brand-500"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          ) : phase === "done" ? (
            <button
              type="button"
              onClick={runTest}
              aria-label="Test again"
              className="animate-scale-in pointer-events-auto flex h-24 w-24 flex-col items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-brand-600 text-white shadow-xl shadow-brand-500/30 transition-transform duration-200 hover:scale-105 active:scale-95 sm:h-28 sm:w-28"
            >
              <RotateCcw className="h-7 w-7" aria-hidden="true" />
              <span className="mt-1.5 text-[11px] font-bold uppercase tracking-widest">
                Again
              </span>
            </button>
          ) : (
            <div className="animate-scale-in flex flex-col items-center">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-600">
                <PhaseIcon className="h-3.5 w-3.5" aria-hidden="true" />
                {PHASE_LABEL[phase]}
              </span>
              <span className="mt-1 bg-gradient-to-b from-slate-900 to-slate-600 bg-clip-text text-5xl font-extrabold leading-none tabular-nums tracking-tight text-transparent sm:text-7xl">
                {fmt(animated)}
              </span>
              <span className="mt-2 text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
                Mbps
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Inline stats (no cards) — only the relevant tiles for this mode */}
      <div className={`mx-auto mt-5 grid w-full sm:mt-7 ${statGridClass}`}>
        {statDefs.map((s) => (
          <Stat key={s.key} icon={s.icon} label={s.label} value={s.value} unit={s.unit} active={s.active} />
        ))}
      </div>

      {/* Status */}
      {error && (
        <div className="mt-5 flex items-center justify-center sm:mt-7">
          <p className="text-sm font-medium text-red-500" role="alert">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  unit,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  active: boolean;
}) {
  return (
    <div className="px-2 text-center sm:px-4">
      <div
        className={`flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors sm:text-xs ${
          active ? "text-brand-600" : "text-slate-400"
        }`}
      >
        <span>{icon}</span>
        <span className="hidden sm:inline">{label}</span>
      </div>
      <div className="mt-1.5 flex items-baseline justify-center gap-1">
        <span
          className={`text-2xl font-extrabold tabular-nums transition-colors sm:text-3xl ${
            active ? "text-brand-600" : "text-slate-900"
          }`}
        >
          {value}
        </span>
        <span className="text-[11px] font-semibold text-slate-400">{unit}</span>
      </div>
    </div>
  );
}
