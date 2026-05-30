"use client";

import { useEffect, useState } from "react";
import { Users, Clock, Monitor, X, RefreshCw, Trash2, Loader2 } from "lucide-react";

type Visitor = {
  id: string;
  visits: number;
  lastSeen: number;
  firstSeen: number;
  country: string;
  countryCode: string;
  city: string;
  ip: string;
  ua: string;
  source: string;
  lastPath: string;
};

type Visit = {
  path: string;
  referrer: string;
  source: string;
  country: string;
  countryCode: string;
  ip: string;
  city: string;
  ts: number;
};

const ago = (ms: number) => {
  if (!ms) return "—";
  const s = Math.floor((Date.now() - ms) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const flagUrl = (cc?: string) =>
  cc && cc.length === 2 ? `https://flagcdn.com/24x18/${cc.toLowerCase()}.png` : "";

function device(ua: string): string {
  if (!ua) return "Unknown";
  const os = /Windows/i.test(ua)
    ? "Windows"
    : /Android/i.test(ua)
      ? "Android"
      : /iPhone|iPad|iOS/i.test(ua)
        ? "iOS"
        : /Mac OS X|Macintosh/i.test(ua)
          ? "macOS"
          : /Linux/i.test(ua)
            ? "Linux"
            : "Other";
  const br = /Edg\//i.test(ua)
    ? "Edge"
    : /Chrome\//i.test(ua)
      ? "Chrome"
      : /Firefox\//i.test(ua)
        ? "Firefox"
        : /Safari\//i.test(ua)
          ? "Safari"
          : "Browser";
  return `${br} · ${os}`;
}

function Flag({ cc, label }: { cc: string; label?: string }) {
  const url = flagUrl(cc);
  if (!url) return <span className="text-slate-400">{label || "—"}</span>;
  return (
    <span className="flex items-center gap-1.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} width={20} height={15} alt={cc} className="h-3.5 w-5 rounded-[2px] object-cover ring-1 ring-black/10" />
      {label && <span>{label}</span>}
    </span>
  );
}

const RANGES = [
  { label: "Older than 7 days", days: 7 },
  { label: "Older than 3 days", days: 3 },
  { label: "Older than 30 days", days: 30 },
  { label: "Everything", days: 0 },
];

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Visitor | null>(null);
  const [visits, setVisits] = useState<Visit[] | null>(null);
  const [cleaning, setCleaning] = useState(false);
  const [cleanDays, setCleanDays] = useState(7);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/visitors", { cache: "no-store" });
      const data = await res.json();
      if (data.ok) setVisitors(data.visitors);
      else setError(data.error || "Could not load visitors");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openVisitor = async (v: Visitor) => {
    setSelected(v);
    setVisits(null);
    const res = await fetch(`/api/admin/visitors/${v.id}`, { cache: "no-store" });
    const data = await res.json();
    setVisits(data.ok ? data.visits : []);
  };

  const clearLogs = async () => {
    const label = RANGES.find((r) => r.days === cleanDays)?.label || "";
    if (!confirm(`Delete visitor logs: ${label}? This cannot be undone.`)) return;
    setCleaning(true);
    try {
      const res = await fetch("/api/admin/visitors/cleanup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: cleanDays }),
      });
      const d = await res.json();
      if (d.ok) await load();
      else setError(d.error || "Cleanup failed");
    } catch {
      setError("Network error");
    } finally {
      setCleaning(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Visitors</h1>
          <p className="mt-1 text-sm text-slate-500">Click a visitor to see every page they viewed.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={cleanDays}
            onChange={(e) => setCleanDays(Number(e.target.value))}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          >
            {RANGES.map((r) => (
              <option key={r.days} value={r.days}>
                {r.label}
              </option>
            ))}
          </select>
          <button
            onClick={clearLogs}
            disabled={cleaning}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            {cleaning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Clear logs
          </button>
          <button onClick={load} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </div>

      {loading && <p className="mt-6 text-sm text-slate-400">Loading…</p>}
      {error && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">{error}</div>
      )}

      {!loading && !error && visitors.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-400">
          No visitors recorded yet. Open the public site in another tab to generate data.
        </div>
      )}

      {visitors.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">IP</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">Device</th>
                <th className="px-4 py-3 font-semibold">Source</th>
                <th className="px-4 py-3 font-semibold">Pages</th>
                <th className="px-4 py-3 font-semibold">Last seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visitors.map((v) => (
                <tr key={v.id} className="cursor-pointer hover:bg-slate-50" onClick={() => openVisitor(v)}>
                  <td className="px-4 py-3">
                    <Flag cc={v.countryCode} label={[v.city, v.country].filter(Boolean).join(", ") || v.countryCode || "Unknown"} />
                    <div className="mt-0.5 truncate font-mono text-[11px] text-slate-400">{v.lastPath}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{v.ip || "—"}</td>
                  <td className="hidden px-4 py-3 text-slate-600 md:table-cell">{device(v.ua)}</td>
                  <td className="px-4 py-3 text-slate-600">{v.source}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{v.visits}</td>
                  <td className="px-4 py-3 text-slate-500">{ago(v.lastSeen)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30" onClick={() => setSelected(null)}>
          <div className="h-full w-full max-w-md overflow-y-auto bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  <Users className="h-5 w-5" />
                </span>
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                    <Flag cc={selected.countryCode} />
                    {[selected.city, selected.country].filter(Boolean).join(", ") || "Unknown location"}
                  </p>
                  <p className="font-mono text-xs text-slate-400">{selected.ip || selected.id.slice(0, 14)}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-px bg-slate-100 text-center text-xs">
              <Info label="Source" value={selected.source} />
              <Info label="Page views" value={String(selected.visits)} />
              <Info label="Device" value={device(selected.ua)} icon={Monitor} />
              <Info label="First seen" value={ago(selected.firstSeen)} />
            </div>

            <div className="p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Page history</h3>
              {visits === null ? (
                <p className="mt-4 text-sm text-slate-400">Loading…</p>
              ) : visits.length === 0 ? (
                <p className="mt-4 text-sm text-slate-400">No pages recorded.</p>
              ) : (
                <ol className="mt-4 space-y-3 border-l-2 border-slate-100 pl-4">
                  {visits.map((v, i) => (
                    <li key={i} className="relative">
                      <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-brand-500 ring-2 ring-white" />
                      <p className="break-all font-mono text-sm text-slate-800">{v.path}</p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-slate-400">
                        <Clock className="h-3 w-3" />
                        {v.ts ? new Date(v.ts).toLocaleString() : "—"}
                        <span>· {v.source}</span>
                      </p>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="bg-white p-3">
      <p className="flex items-center justify-center gap-1 text-slate-400">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </p>
      <p className="mt-1 truncate font-semibold text-slate-800">{value || "—"}</p>
    </div>
  );
}
