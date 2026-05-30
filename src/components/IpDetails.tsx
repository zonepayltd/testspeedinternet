"use client";

import { useEffect, useState } from "react";
import {
  Globe,
  MapPin,
  Wifi,
  Clock,
  Network,
  Building2,
  Copy,
  Check,
} from "lucide-react";

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

const LOGODEV_TOKEN = process.env.NEXT_PUBLIC_LOGODEV_TOKEN ?? "";

const ISP_DOMAINS: [string, string][] = [
  ["maroc telecom", "iam.ma"],
  ["maroctelecom", "iam.ma"],
  ["menara", "iam.ma"],
  ["orange", "orange.ma"],
  ["inwi", "inwi.ma"],
  ["wana", "inwi.ma"],
];

function flagUrl(cc?: string, retina = false): string | null {
  if (!cc || cc.length !== 2) return null;
  const c = cc.toLowerCase();
  return retina ? `https://flagcdn.com/64x48/${c}.png` : `https://flagcdn.com/32x24/${c}.png`;
}

function ispLogoUrl(isp?: string): string | null {
  if (!isp) return null;
  const s = isp.toLowerCase();
  for (const [key, domain] of ISP_DOMAINS) {
    if (s.includes(key)) {
      return LOGODEV_TOKEN
        ? `https://img.logo.dev/${domain}?token=${LOGODEV_TOKEN}&size=128&format=png&retina=true`
        : `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
    }
  }
  return null;
}

export default function IpDetails() {
  const [info, setInfo] = useState<ConnInfo | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/ip", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: ConnInfo) => active && setInfo(data))
      .catch(() => active && setInfo({ ok: false }));
    return () => {
      active = false;
    };
  }, []);

  const copy = async () => {
    if (!info?.ip) return;
    try {
      await navigator.clipboard.writeText(info.ip);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const loading = info === null;
  const ok = info?.ok;
  const flag = flagUrl(info?.countryCode);
  const flag2x = flagUrl(info?.countryCode, true);
  const ispLogo = ispLogoUrl(info?.isp);
  const location = [info?.city, info?.region, info?.country].filter(Boolean).join(", ");

  const mapSrc =
    info?.lat != null && info?.lon != null
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${info.lon - 0.06}%2C${
          info.lat - 0.04
        }%2C${info.lon + 0.06}%2C${info.lat + 0.04}&layer=mapnik&marker=${info.lat}%2C${info.lon}`
      : null;

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* IP headline */}
      <div className="rounded-3xl border border-white/60 bg-white/70 p-6 text-center shadow-[0_24px_60px_-24px_rgba(37,99,235,0.25)] ring-1 ring-slate-200/70 backdrop-blur-xl sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
          Your public IP address
        </p>

        <div className="mt-3 flex items-center justify-center gap-3">
          <span className="break-all bg-gradient-to-b from-slate-900 to-slate-600 bg-clip-text font-mono text-3xl font-extrabold tracking-tight text-transparent sm:text-5xl">
            {loading ? "Detecting…" : ok ? info.ip : "Unavailable"}
          </span>
          {ok && info.ip && (
            <button
              type="button"
              onClick={copy}
              aria-label="Copy IP address"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-brand-300 hover:text-brand-600"
            >
              {copied ? <Check className="h-5 w-5 text-accent-500" /> : <Copy className="h-5 w-5" />}
            </button>
          )}
        </div>

        {ok && location && (
          <p className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500">
            {flag && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={flag}
                srcSet={flag2x ? `${flag2x} 2x` : undefined}
                width={20}
                height={15}
                alt={info.country ?? "Country"}
                className="h-3.5 w-5 rounded-[2px] object-cover ring-1 ring-black/5"
              />
            )}
            {location}
          </p>
        )}
      </div>

      {/* Map + details */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* Map */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
          {mapSrc ? (
            <iframe
              title="Approximate location of your IP address"
              src={mapSrc}
              className="h-72 w-full lg:h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex h-72 items-center justify-center text-sm text-slate-400">
              {loading ? "Loading map…" : "Location unavailable"}
            </div>
          )}
        </div>

        {/* Details grid */}
        <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
          <DetailRow icon={<Wifi className="h-4 w-4" />} label="Internet provider">
            <span className="flex items-center gap-2">
              {ispLogo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ispLogo} width={20} height={20} alt="" className="h-5 w-5 object-contain" />
              )}
              {ok ? info.isp : "—"}
            </span>
          </DetailRow>
          <DetailRow icon={<Network className="h-4 w-4" />} label="ASN / Network">
            {ok && info.as ? info.as : "—"}
          </DetailRow>
          <DetailRow icon={<Globe className="h-4 w-4" />} label="Country">
            <span className="flex items-center gap-2">
              {flag && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={flag} width={20} height={15} alt="" className="h-3.5 w-5 rounded-[2px] object-cover ring-1 ring-black/5" />
              )}
              {ok ? info.country || "—" : "—"}
            </span>
          </DetailRow>
          <DetailRow icon={<MapPin className="h-4 w-4" />} label="City / Region">
            {ok ? [info.city, info.region].filter(Boolean).join(", ") || "—" : "—"}
          </DetailRow>
          <DetailRow icon={<Building2 className="h-4 w-4" />} label="Postal code">
            {ok && info.zip ? info.zip : "—"}
          </DetailRow>
          <DetailRow icon={<Clock className="h-4 w-4" />} label="Time zone">
            {ok && info.timezone ? info.timezone : "—"}
          </DetailRow>
        </dl>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white px-4 py-3.5">
      <dt className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        <span className="text-brand-500">{icon}</span>
        {label}
      </dt>
      <dd className="mt-1 truncate font-semibold text-slate-800">{children}</dd>
    </div>
  );
}
