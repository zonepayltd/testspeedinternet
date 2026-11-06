"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Globe,
  MapPin,
  Wifi,
  Clock,
  Network,
  Building2,
  Copy,
  Check,
  Hash,
  Crosshair,
  Mailbox,
  AlertTriangle,
  RotateCw,
  Timer,
  Binary,
  type LucideIcon,
} from "lucide-react";
import { pick, LOCALE_META } from "@/i18n/config";
import { useLocale } from "@/i18n/client";
import { ipMessages } from "@/i18n/messages/ip";
import { Flag, IspLogo, Skeleton } from "@/components/ip/shared";

type ConnInfo = {
  ok: boolean;
  ip?: string;
  isp?: string;
  org?: string;
  as?: string;
  country?: string;
  countryCode?: string;
  region?: string;
  city?: string;
  zip?: string;
  lat?: number | null;
  lon?: number | null;
  timezone?: string;
};

export default function IpDetails() {
  const locale = useLocale();
  const t = pick(ipMessages, locale).details;
  const [info, setInfo] = useState<ConnInfo | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let active = true;
    setInfo(null);
    fetch("/api/ip", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: ConnInfo) => active && setInfo(data))
      .catch(() => active && setInfo({ ok: false }));
    return () => {
      active = false;
    };
  }, [attempt]);

  // Local clock for the IP's time zone (client only, so no hydration mismatch).
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  const copy = async () => {
    if (!info?.ip) return;
    try {
      await navigator.clipboard.writeText(info.ip);
    } catch {
      // Fallback for browsers without the async clipboard API
      const ta = document.createElement("textarea");
      ta.value = info.ip;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* ignore */
      }
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loading = info === null;

  if (info && !info.ok) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <div role="alert" className="card flex flex-col items-center px-6 py-12 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="h-card mt-4">{t.errorTitle}</h2>
          <p className="muted mt-2 max-w-md text-sm leading-relaxed">{t.errorText}</p>
          <button type="button" onClick={retry} className="btn-primary mt-6">
            <RotateCw className="h-4 w-4" aria-hidden="true" />
            {t.retry}
          </button>
        </div>
      </div>
    );
  }

  const ok = !!info?.ok;
  const ip = info?.ip ?? "";
  const isV6 = ip.includes(":");
  const location = [info?.city, info?.region, info?.country].filter(Boolean).join(", ");
  const cityRegion = [info?.city, info?.region].filter(Boolean).join(", ");
  const lat = info?.lat;
  const lon = info?.lon;
  const hasCoords = typeof lat === "number" && typeof lon === "number";
  const showOrg = !!info?.org && info.org.toLowerCase() !== (info.isp ?? "").toLowerCase();

  let localTime = "";
  if (now && info?.timezone) {
    try {
      localTime = new Intl.DateTimeFormat(LOCALE_META[locale].htmlLang, {
        timeZone: info.timezone,
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(now);
    } catch {
      localTime = "";
    }
  }

  const mapSrc = hasCoords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.06}%2C${lat - 0.04}%2C${lon + 0.06}%2C${
        lat + 0.04
      }&layer=mapnik&marker=${lat}%2C${lon}`
    : null;

  return (
    <div className="mx-auto w-full max-w-5xl text-start" aria-busy={loading}>
      {/* Primary IP display */}
      <div className="card relative overflow-hidden p-6 sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent"
        />
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="kicker">{t.yourIp}</p>
            <div className="mt-3 flex min-h-[2.75rem] items-center sm:min-h-[3.75rem]">
              {loading ? (
                <>
                  <Skeleton className="h-10 w-64 max-w-full sm:h-12 sm:w-96" />
                  <span className="sr-only">{t.detecting}</span>
                </>
              ) : (
                <p
                  dir="ltr"
                  className={`break-all font-mono font-bold tracking-tight text-slate-900 rtl:text-end dark:text-white ${
                    isV6 ? "text-2xl sm:text-3xl" : "text-4xl sm:text-5xl"
                  }`}
                >
                  {ip}
                </p>
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {loading ? (
                <>
                  <Skeleton className="h-7 w-16 rounded-full" />
                  <Skeleton className="h-7 w-48 rounded-full" />
                  <Skeleton className="h-7 w-36 rounded-full" />
                </>
              ) : (
                <>
                  <span className="pill border-brand-200 bg-brand-50 font-semibold text-brand-700 dark:border-brand-400/20 dark:bg-brand-400/10 dark:text-brand-300">
                    <Binary className="h-3.5 w-3.5" aria-hidden="true" />
                    {isV6 ? t.versionV6 : t.versionV4}
                  </span>
                  {location && (
                    <span className="pill">
                      <Flag cc={info?.countryCode} label={info?.country} />
                      {location}
                    </span>
                  )}
                  {info?.isp && (
                    <span className="pill">
                      <Wifi className="h-3.5 w-3.5" aria-hidden="true" />
                      {info.isp}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={copy}
              disabled={!ok}
              aria-label={t.copy}
              title={t.copy}
              className={`btn w-full border md:w-auto ${
                copied
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300"
                  : "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-brand-300 hover:text-brand-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-brand-400/40 dark:hover:text-white"
              }`}
            >
              {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              {copied ? t.copied : t.copyShort}
            </button>
            <span className="sr-only" role="status" aria-live="polite">
              {copied ? t.copiedAnnounce : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Map + details */}
      <div className="mt-5 grid gap-5 lg:grid-cols-5">
        <div className="card flex flex-col overflow-hidden lg:col-span-2">
          <div className="relative min-h-[18rem] flex-1 bg-slate-100 dark:bg-ink-850">
            {mapSrc ? (
              <iframe
                title={t.mapTitle}
                src={mapSrc}
                className="absolute inset-0 h-full w-full dark:[filter:invert(0.9)_hue-rotate(180deg)_contrast(0.9)]"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : loading ? (
              <div className="absolute inset-0 flex items-center justify-center animate-pulse bg-slate-200/60 text-sm text-slate-400 dark:bg-white/[0.04]">
                {t.mapLoading}
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-slate-400">
                <MapPin className="h-6 w-6" aria-hidden="true" />
                {t.mapUnavailable}
              </div>
            )}
          </div>
          <p className="flex items-start gap-2 border-t border-slate-200/80 px-4 py-3 text-xs leading-relaxed text-slate-500 dark:border-white/[0.08] dark:text-slate-400">
            <Crosshair className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {t.mapNote}
          </p>
        </div>

        <div className="card overflow-hidden lg:col-span-3">
          <h2 className="border-b border-slate-200/80 px-5 py-4 text-sm font-semibold text-slate-900 dark:border-white/[0.08] dark:text-white">
            {t.detailsTitle}
          </h2>
          <dl className="-mb-px grid grid-cols-1 sm:grid-cols-2">
            <Row icon={Wifi} label={t.labels.isp} loading={loading}>
              <span className="flex min-w-0 items-center gap-2">
                <IspLogo isp={info?.isp} />
                <span className="truncate">{info?.isp || "—"}</span>
              </span>
            </Row>
            <Row icon={Network} label={t.labels.asn} loading={loading} ltr>
              {info?.as || "—"}
            </Row>
            {showOrg && (
              <Row icon={Building2} label={t.labels.org} loading={loading}>
                {info?.org}
              </Row>
            )}
            <Row icon={Globe} label={t.labels.country} loading={loading}>
              <span className="flex min-w-0 items-center gap-2">
                <Flag cc={info?.countryCode} />
                <span className="truncate">{info?.country || "—"}</span>
                {info?.countryCode && (
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-medium text-slate-500 dark:bg-white/[0.06] dark:text-slate-400">
                    {info.countryCode.toUpperCase()}
                  </span>
                )}
              </span>
            </Row>
            <Row icon={MapPin} label={t.labels.city} loading={loading}>
              {cityRegion || "—"}
            </Row>
            <Row icon={Clock} label={t.labels.timezone} loading={loading} ltr>
              {info?.timezone || "—"}
            </Row>
            <Row icon={Timer} label={t.labels.localTime} loading={loading || (!!info?.timezone && !now)}>
              {localTime || "—"}
            </Row>
            <Row icon={Crosshair} label={t.labels.coords} loading={loading} ltr>
              {hasCoords ? `${lat.toFixed(4)}, ${lon.toFixed(4)}` : "—"}
            </Row>
            {info?.zip ? (
              <Row icon={Mailbox} label={t.labels.postal} loading={loading} ltr>
                {info.zip}
              </Row>
            ) : null}
            <Row icon={Hash} label={t.labels.version} loading={loading}>
              {ok ? (isV6 ? t.versionV6 : t.versionV4) : "—"}
            </Row>
          </dl>
        </div>
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  children,
  loading,
  ltr,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
  loading?: boolean;
  ltr?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-4 dark:border-white/[0.06] sm:odd:border-e">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 ring-1 ring-inset ring-slate-200/80 dark:bg-white/[0.04] dark:text-slate-400 dark:ring-white/[0.08]">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</dt>
        <dd className="mt-0.5 min-w-0 truncate text-sm font-semibold text-slate-900 dark:text-white">
          {loading ? (
            <Skeleton className="mt-1 h-4 w-28" />
          ) : ltr ? (
            <span dir="ltr" className="tabular">
              {children}
            </span>
          ) : (
            children
          )}
        </dd>
      </div>
    </div>
  );
}
