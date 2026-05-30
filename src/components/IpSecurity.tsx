"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  Server,
  Eye,
  Home,
  Globe,
  Wifi,
} from "lucide-react";

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

const LOGODEV_TOKEN = process.env.NEXT_PUBLIC_LOGODEV_TOKEN ?? "";

const ISP_DOMAINS: [string, string][] = [
  ["maroc telecom", "iam.ma"],
  ["maroctelecom", "iam.ma"],
  ["iam", "iam.ma"],
  ["menara", "iam.ma"],
  ["orange", "orange.ma"],
  ["inwi", "inwi.ma"],
  ["wana", "inwi.ma"],
];

function flagUrl(cc?: string): string | null {
  if (!cc || cc.length !== 2) return null;
  return `https://flagcdn.com/32x24/${cc.toLowerCase()}.png`;
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

type Verdict = {
  label: string;
  tone: "good" | "warn" | "bad";
  Icon: typeof ShieldCheck;
  blurb: string;
};

function verdictFor(info: ScoreInfo): Verdict {
  const risk = info.risk ?? 0;
  if (info.proxy || info.vpn || info.tor || risk >= 66) {
    return {
      label: "At risk",
      tone: "bad",
      Icon: ShieldAlert,
      blurb: "This IP looks like a proxy, VPN or high-risk address.",
    };
  }
  if (risk >= 33) {
    return {
      label: "Caution",
      tone: "warn",
      Icon: ShieldQuestion,
      blurb: "This IP shows a moderate risk score.",
    };
  }
  return {
    label: "Clean",
    tone: "good",
    Icon: ShieldCheck,
    blurb: "This IP looks like a normal, low-risk connection.",
  };
}

const TONE = {
  good: { text: "text-emerald-600", bg: "bg-emerald-50", ring: "ring-emerald-200", bar: "bg-emerald-500" },
  warn: { text: "text-amber-600", bg: "bg-amber-50", ring: "ring-amber-200", bar: "bg-amber-500" },
  bad: { text: "text-red-600", bg: "bg-red-50", ring: "ring-red-200", bar: "bg-red-500" },
} as const;

export default function IpSecurity() {
  const [info, setInfo] = useState<ScoreInfo | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/ip-score", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: ScoreInfo) => active && setInfo(data))
      .catch(() => active && setInfo({ ok: false }));
    return () => {
      active = false;
    };
  }, []);

  const loading = info === null;
  const ok = info?.ok;
  const verdict = ok ? verdictFor(info) : null;
  const tone = verdict ? TONE[verdict.tone] : TONE.good;
  const risk = info?.risk ?? 0;
  const isResidential = (info?.type ?? "").toLowerCase().includes("residential");
  const flag = flagUrl(info?.countryCode);
  const ispLogo = ispLogoUrl(info?.provider);

  return (
    <div className="mx-auto w-full max-w-4xl rounded-3xl border border-white/60 bg-white/70 p-6 shadow-[0_24px_60px_-24px_rgba(37,99,235,0.18)] ring-1 ring-slate-200/70 backdrop-blur-xl sm:p-8">
      <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        {/* Verdict */}
        <div className="flex items-center gap-4">
          <span
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ring-1 ${
              loading ? "bg-slate-100 ring-slate-200" : `${tone.bg} ${tone.ring}`
            }`}
          >
            {loading || !verdict ? (
              <ShieldQuestion className="h-7 w-7 text-slate-400" />
            ) : (
              <verdict.Icon className={`h-7 w-7 ${tone.text}`} />
            )}
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              IP Security Check
            </p>
            <p className={`text-2xl font-extrabold ${loading ? "text-slate-400" : tone.text}`}>
              {loading ? "Checking…" : ok ? verdict!.label : "Unavailable"}
            </p>
            <p className="mt-0.5 text-sm text-slate-500">
              {loading ? "Analysing your IP reputation" : ok ? verdict!.blurb : "Could not analyse this IP."}
            </p>
            {ok && info!.ip && (
              <p className="mt-1 font-mono text-xs text-slate-400">IP: {info!.ip}</p>
            )}
          </div>
        </div>

        {/* Risk score */}
        <div className="w-full sm:w-56">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Risk score
            </span>
            <span className={`text-xl font-extrabold tabular-nums ${loading || !ok ? "text-slate-400" : tone.text}`}>
              {loading ? "—" : ok ? `${risk}` : "—"}
              <span className="text-xs font-semibold text-slate-400">/100</span>
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-700 ${ok ? tone.bar : "bg-slate-300"}`}
              style={{ width: `${loading || !ok ? 0 : Math.max(risk, 3)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Flags */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Flag
          icon={<Globe className="h-4 w-4" />}
          label="Country"
          value={
            <span className="flex items-center gap-1.5">
              {flag && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={flag} width={20} height={15} alt="" className="h-3.5 w-5 rounded-[2px] object-cover ring-1 ring-black/5" />
              )}
              {ok ? info!.country || "Unknown" : "—"}
            </span>
          }
        />
        <Flag
          icon={ispLogo ? null : <Wifi className="h-4 w-4" />}
          label="Provider"
          value={
            <span className="flex items-center gap-1.5">
              {ispLogo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ispLogo} width={18} height={18} alt="" className="h-[18px] w-[18px] object-contain" />
              )}
              <span className="truncate">{ok ? info!.provider || "Unknown" : "—"}</span>
            </span>
          }
        />
        <Flag
          icon={isResidential ? <Home className="h-4 w-4" /> : <Server className="h-4 w-4" />}
          label="Connection type"
          value={ok ? info!.type ?? "Unknown" : "—"}
          good={isResidential}
        />
        <Flag
          icon={<Eye className="h-4 w-4" />}
          label="VPN / Proxy"
          value={ok ? (info!.vpn ? "Detected" : "No") : "—"}
          good={ok ? !info!.vpn : undefined}
        />
        <Flag
          icon={<Eye className="h-4 w-4" />}
          label="Tor exit node"
          value={ok ? (info!.tor ? "Yes" : "No") : "—"}
          good={ok ? !info!.tor : undefined}
        />
        <Flag
          icon={<ShieldCheck className="h-4 w-4" />}
          label="Verdict"
          value={loading ? "—" : ok ? verdict!.label : "—"}
          good={ok ? verdict!.tone === "good" : undefined}
        />
      </div>
    </div>
  );
}

function Flag({
  icon,
  label,
  value,
  good,
}: {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
  good?: boolean;
}) {
  const valueColor =
    good === undefined ? "text-slate-800" : good ? "text-emerald-600" : "text-red-600";
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {icon && <span className="text-brand-500">{icon}</span>}
        {label}
      </div>
      <div className={`mt-1.5 truncate text-base font-extrabold ${valueColor}`}>{value}</div>
    </div>
  );
}
