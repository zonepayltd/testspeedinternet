"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  Server,
  Home,
  Globe,
  Wifi,
  EyeOff,
  Network,
  RotateCw,
  AlertTriangle,
  ArrowRight,
  Info,
  type LucideIcon,
} from "lucide-react";
import { pick } from "@/i18n/config";
import { useLocale, LocaleLink } from "@/i18n/client";
import { ipRiskMessages, type IpRiskMessages } from "@/i18n/messages/ipRisk";
import { Flag, ProviderLogo, Skeleton } from "@/components/ip/shared";
import { ispBrand } from "@/lib/isp";

type ScoreInfo = {
  ok: boolean;
  ip?: string;
  proxy?: boolean;
  vpn?: boolean;
  tor?: boolean;
  type?: string;
  risk?: number | null;
  provider?: string;
  country?: string;
  countryCode?: string;
  city?: string;
};

type Level = "low" | "medium" | "high";
type Status = "pass" | "warn" | "fail" | "info";
type TypeKey = keyof IpRiskMessages["widget"]["typeNames"];

// Score bands: 0-33 low, 34-66 medium, 67-100 high. A VPN / proxy / Tor detection is always high.
function levelFor(info: ScoreInfo): Level {
  const risk = info.risk ?? 0;
  if (info.proxy || info.vpn || info.tor || risk >= 67) return "high";
  if (risk >= 34) return "medium";
  return "low";
}

function typeKeyFor(info: ScoreInfo): TypeKey {
  const t = (info.type ?? "").toLowerCase();
  if (t.includes("tor")) return "tor";
  if (t.includes("vpn")) return "vpn";
  if (t.includes("residential")) return "residential";
  if (t.includes("business")) return "business";
  if (t.includes("wireless") || t.includes("mobile")) return "mobile";
  if (t.includes("hosting") || t.includes("data center") || t.includes("datacenter")) return "hosting";
  if (info.proxy) return "proxy";
  return "unknown";
}

const TYPE_STATUS: Record<TypeKey, Status> = {
  residential: "pass",
  business: "pass",
  mobile: "pass",
  hosting: "warn",
  vpn: "fail",
  tor: "fail",
  proxy: "fail",
  unknown: "info",
};

const LEVEL_STYLE: Record<Level, { text: string; tile: string; stroke: string; bar: string; Icon: LucideIcon }> = {
  low: {
    text: "text-emerald-600 dark:text-emerald-400",
    tile: "bg-emerald-50 text-emerald-600 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20",
    stroke: "stroke-emerald-500 dark:stroke-emerald-400",
    bar: "bg-emerald-500 dark:bg-emerald-400",
    Icon: ShieldCheck,
  },
  medium: {
    text: "text-amber-600 dark:text-amber-400",
    tile: "bg-amber-50 text-amber-600 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/20",
    stroke: "stroke-amber-500 dark:stroke-amber-400",
    bar: "bg-amber-500 dark:bg-amber-400",
    Icon: ShieldQuestion,
  },
  high: {
    text: "text-red-600 dark:text-red-400",
    tile: "bg-red-50 text-red-600 ring-red-200 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20",
    stroke: "stroke-red-500 dark:stroke-red-400",
    bar: "bg-red-500 dark:bg-red-400",
    Icon: ShieldAlert,
  },
};

const STATUS_STYLE: Record<Status, string> = {
  pass: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300",
  warn: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300",
  fail: "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300",
  info: "border-slate-200 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300",
};

const STATUS_DOT: Record<Status, string> = {
  pass: "bg-emerald-500",
  warn: "bg-amber-500",
  fail: "bg-red-500",
  info: "bg-slate-400",
};

export default function IpSecurity({ variant = "full" }: { variant?: "full" | "compact" }) {
  const t = pick(ipRiskMessages, useLocale()).widget;
  const [info, setInfo] = useState<ScoreInfo | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setInfo(null);
    fetch("/api/ip-score", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: ScoreInfo) => active && setInfo(data))
      .catch(() => active && setInfo({ ok: false }));
    return () => {
      active = false;
    };
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  const loading = info === null;

  if (info && !info.ok) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <div role="alert" className={`card flex flex-col items-center text-center ${variant === "compact" ? "px-6 py-8" : "px-6 py-12"}`}>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="h-card mt-4">{t.errorTitle}</h2>
          <p className="muted mt-2 max-w-md text-sm leading-relaxed">{t.errorText}</p>
          <button type="button" onClick={retry} className="btn-secondary mt-5">
            <RotateCw className="h-4 w-4" aria-hidden="true" />
            {t.retry}
          </button>
        </div>
      </div>
    );
  }

  const level = info?.ok ? levelFor(info) : null;
  const style = LEVEL_STYLE[level ?? "low"];
  const flagged = !!(info?.proxy || info?.vpn || info?.tor);
  const blurb = !level ? t.checkingText : flagged ? t.flaggedBlurb : t.levels[level].blurb;
  const risk = typeof info?.risk === "number" ? Math.max(0, Math.min(100, info.risk)) : null;
  const typeKey = info?.ok ? typeKeyFor(info) : "unknown";
  const rawType = info?.type && info.type.toLowerCase() !== "unknown" ? info.type : "";
  const typeName = typeKey === "unknown" && rawType ? rawType : t.typeNames[typeKey];
  const isVpn = !!(info?.vpn || info?.proxy);
  const isTor = !!info?.tor;
  const location = [info?.city, info?.country].filter(Boolean).join(", ");

  const signals: { key: string; icon: LucideIcon; label: string; value: React.ReactNode; text: string; status: Status }[] = [
    {
      key: "type",
      icon: typeKey === "residential" ? Home : typeKey === "mobile" ? Wifi : Server,
      label: t.signals.type.label,
      value: typeName,
      text: t.signals.type[typeKey],
      status: TYPE_STATUS[typeKey],
    },
    {
      key: "vpn",
      icon: EyeOff,
      label: t.signals.vpn.label,
      value: isVpn ? t.signals.vpn.yes : t.signals.vpn.no,
      text: isVpn ? t.signals.vpn.yesText : t.signals.vpn.noText,
      status: isVpn ? "fail" : "pass",
    },
    {
      key: "tor",
      icon: Network,
      label: t.signals.tor.label,
      value: isTor ? t.signals.tor.yes : t.signals.tor.no,
      text: isTor ? t.signals.tor.yesText : t.signals.tor.noText,
      status: isTor ? "fail" : "pass",
    },
    {
      key: "provider",
      icon: Wifi,
      label: t.signals.provider.label,
      value: (
        <span className="flex min-w-0 items-center gap-2">
          {info?.provider && <ProviderLogo brand={ispBrand(info.provider)} size={18} />}
          <span className="truncate">{info?.provider ? ispBrand(info.provider).name : t.typeNames.unknown}</span>
        </span>
      ),
      text: t.signals.provider.text,
      status: "info",
    },
    {
      key: "location",
      icon: Globe,
      label: t.signals.location.label,
      value: (
        <span className="flex min-w-0 items-center gap-2">
          <Flag cc={info?.countryCode} />
          <span className="truncate">{location || t.typeNames.unknown}</span>
        </span>
      ),
      text: t.signals.location.text,
      status: "info",
    },
  ];

  /* ---------------- Compact (used on What Is My IP) ---------------- */
  if (variant === "compact") {
    return (
      <div className="mx-auto w-full max-w-5xl text-start" aria-busy={loading}>
        <div className="card p-5 sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ring-inset ${
                  level ? style.tile : "bg-slate-100 text-slate-400 ring-slate-200 dark:bg-white/5 dark:ring-white/10"
                }`}
              >
                {level ? <style.Icon className="h-6 w-6" aria-hidden="true" /> : <ShieldQuestion className="h-6 w-6" aria-hidden="true" />}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.title}</p>
                <p className={`mt-0.5 text-lg font-bold ${level ? style.text : "text-slate-400"}`}>
                  {level ? t.levels[level].label : t.checking}
                </p>
                <p className="muted mt-0.5 text-sm leading-relaxed">{blurb}</p>
              </div>
            </div>
            <div className="w-full shrink-0 md:w-56">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.riskScore}</span>
                <span dir="ltr" className={`tabular text-lg font-bold ${level ? style.text : "text-slate-400"}`}>
                  {loading ? "—" : risk ?? "—"}
                  <span className="text-xs font-medium text-slate-400">/100</span>
                </span>
              </div>
              <div dir="ltr" className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.08]">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${level ? style.bar : ""}`}
                  style={{ width: `${loading || risk === null ? 0 : Math.max(risk, 3)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4 border-t border-slate-200/80 pt-4 dark:border-white/[0.08] sm:flex-row sm:items-center sm:justify-between">
            <ul className="flex flex-wrap gap-2">
              {signals.slice(0, 3).map((s) => (
                <li key={s.key}>
                  {loading ? (
                    <Skeleton className="h-7 w-36 rounded-full" />
                  ) : (
                    <span className="pill">
                      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[s.status]}`} aria-hidden="true" />
                      <span className="text-slate-500 dark:text-slate-400">{s.label}:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{s.value}</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <LocaleLink href="/ip-risk-score" className="link inline-flex shrink-0 items-center gap-1.5 text-sm">
              {t.fullReport}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </LocaleLink>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- Full report ---------------- */
  return (
    <div className="mx-auto w-full max-w-5xl text-start" aria-busy={loading}>
      <div className="card overflow-hidden">
        <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[minmax(0,300px)_1fr] md:items-center">
          {/* Gauge */}
          <div className="mx-auto w-full max-w-[300px]">
            <Gauge value={loading ? null : risk} level={level} label={t.riskScore} />
            <div dir="ltr" className="mt-1 flex justify-between px-2 text-[11px] font-medium text-slate-400">
              <span>0</span>
              <span>100</span>
            </div>
            <div dir="ltr" className="mt-1 flex justify-between px-1 text-xs text-slate-500 dark:text-slate-400">
              <span>{t.scaleLow}</span>
              <span>{t.scaleHigh}</span>
            </div>
          </div>

          {/* Verdict */}
          <div className="min-w-0">
            <p className="kicker">{t.title}</p>
            <div className="mt-3 flex items-center gap-3">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${
                  level ? style.tile : "bg-slate-100 text-slate-400 ring-slate-200 dark:bg-white/5 dark:ring-white/10"
                }`}
              >
                {level ? <style.Icon className="h-6 w-6" aria-hidden="true" /> : <ShieldQuestion className="h-6 w-6" aria-hidden="true" />}
              </span>
              <h2 className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${level ? style.text : "text-slate-400"}`}>
                {level ? t.levels[level].label : t.checking}
              </h2>
            </div>
            <p className="lead mt-3 !text-base">{blurb}</p>

            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="card-muted px-4 py-3">
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.ipLabel}</dt>
                <dd className="mt-1 min-w-0 truncate font-mono text-sm font-semibold text-slate-900 dark:text-white">
                  {loading ? <Skeleton className="h-4 w-32" /> : <span dir="ltr">{info?.ip}</span>}
                </dd>
              </div>
              <div className="card-muted px-4 py-3">
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.signals.type.label}</dt>
                <dd className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {loading ? <Skeleton className="h-4 w-24" /> : typeName}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Signals */}
        <div className="border-t border-slate-200/80 bg-slate-50/60 p-6 dark:border-white/[0.08] dark:bg-white/[0.02] sm:p-8">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{t.signalsTitle}</h3>
          <ul className="mt-4 grid gap-3 lg:grid-cols-2">
            {signals.map((s) => (
              <li
                key={s.key}
                className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-4 dark:border-white/[0.08] dark:bg-ink-900"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 ring-1 ring-inset ring-slate-200/80 dark:bg-white/[0.04] dark:text-slate-400 dark:ring-white/[0.08]">
                  <s.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{s.label}</p>
                      <div className="mt-0.5 min-w-0 truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {loading ? <Skeleton className="mt-1 h-4 w-28" /> : s.value}
                      </div>
                    </div>
                    {!loading && (
                      <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLE[s.status]}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[s.status]}`} aria-hidden="true" />
                        {t.status[s.status]}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {loading ? <Skeleton className="h-3 w-full" /> : s.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {t.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}

/* Semicircular 0-100 meter. Always drawn left-to-right (dir="ltr"). */
function Gauge({ value, level, label }: { value: number | null; level: Level | null; label: string }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (value === null) {
      setShown(0);
      return;
    }
    const id = requestAnimationFrame(() => setShown(value));
    return () => cancelAnimationFrame(id);
  }, [value]);

  const R = 80;
  const C = { x: 100, y: 100 };
  const pt = (v: number) => {
    const a = Math.PI * (1 - v / 100);
    return { x: C.x + R * Math.cos(a), y: C.y - R * Math.sin(a) };
  };
  const arc = (from: number, to: number) => {
    const a = pt(from);
    const b = pt(to);
    return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${R} ${R} 0 0 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
  };
  const marker = pt(shown);
  const style = level ? LEVEL_STYLE[level] : null;

  return (
    <div dir="ltr" className="relative" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value ?? undefined}>
      <svg viewBox="0 0 200 112" className="w-full" aria-hidden="true">
        {/* Bands */}
        <path d={arc(0, 32.5)} className="fill-none stroke-emerald-500/20 dark:stroke-emerald-400/20" strokeWidth={14} />
        <path d={arc(34, 65.5)} className="fill-none stroke-amber-500/20 dark:stroke-amber-400/20" strokeWidth={14} />
        <path d={arc(67, 100)} className="fill-none stroke-red-500/20 dark:stroke-red-400/20" strokeWidth={14} />
        {/* Value */}
        {style && value !== null && (
          <>
            <path
              d={arc(0, 100)}
              pathLength={100}
              strokeDasharray="100 100"
              strokeDashoffset={100 - Math.max(shown, 1)}
              strokeLinecap="round"
              strokeWidth={14}
              className={`fill-none ${style.stroke} transition-[stroke-dashoffset] duration-1000 ease-out`}
            />
            <circle
              cx={marker.x}
              cy={marker.y}
              r={9}
              className={`fill-white dark:fill-ink-900 ${style.stroke} transition-all duration-1000 ease-out`}
              strokeWidth={4}
            />
          </>
        )}
      </svg>
      <div className="absolute inset-x-0 bottom-1 flex flex-col items-center">
        {value === null ? (
          level ? (
            <span className="text-4xl font-extrabold text-slate-400">—</span>
          ) : (
            <Skeleton className="mb-1 h-10 w-20" />
          )
        ) : (
          <span className={`tabular text-5xl font-extrabold tracking-tight ${style?.text ?? ""}`}>
            {Math.round(value)}
          </span>
        )}
        <span className="text-xs font-medium text-slate-400">/ 100</span>
      </div>
    </div>
  );
}
