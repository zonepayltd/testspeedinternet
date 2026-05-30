"use client";

import { useEffect, useState } from "react";
import { Users, Eye, Search, Globe, Radio, RefreshCw } from "lucide-react";

type Stats = {
  ok: boolean;
  error?: string;
  liveUsers: number;
  visitsToday: number;
  visitorsToday: number;
  searchToday: number;
  totalVisitors: number;
  sources: { key: string; count: number }[];
  topPages: { key: string; count: number }[];
  countries: { key: string; count: number }[];
  series: { day: string; count: number }[];
  recent: { path: string; source: string; country: string; ts: number }[];
};

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/stats", { cache: "no-store" });
      const data = await res.json();
      setStats(data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 12_000); // live refresh
    return () => clearInterval(t);
  }, []);

  const maxSeries = Math.max(1, ...(stats?.series?.map((s) => s.count) ?? [1]));

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Analytics</h1>
          <p className="mt-1 text-sm text-slate-500">Live visitor data, updated every few seconds.</p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Refresh
        </button>
      </div>

      {loading && !stats && <p className="mt-6 text-sm text-slate-400">Loading…</p>}

      {stats && !stats.ok && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          Could not load analytics: {stats.error || "check Firestore is enabled"}.
        </div>
      )}

      {stats?.ok && (
        <>
          {/* Stat cards */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Live now" value={stats.liveUsers} icon={Radio} live hint="Last 5 min" />
            <StatCard label="Visits today" value={stats.visitsToday} icon={Eye} hint={`${stats.visitorsToday} visitors`} />
            <StatCard label="From search" value={stats.searchToday} icon={Search} hint="Today, Google/Bing…" />
            <StatCard label="Total visitors" value={stats.totalVisitors} icon={Users} hint="All time" />
          </div>

          {/* 7-day chart */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Last 7 days</h2>
            <div className="mt-5 flex h-40 items-end gap-2">
              {stats.series.map((s) => (
                <div key={s.day} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-brand-500 to-cyan-400 transition-all"
                      style={{ height: `${Math.max((s.count / maxSeries) * 100, 3)}%` }}
                      title={`${s.count} visits`}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-slate-400">
                    {new Date(s.day).toLocaleDateString(undefined, { weekday: "short" })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Breakdown lists */}
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <BreakdownCard title="Traffic sources" icon={Search} items={stats.sources} />
            <BreakdownCard title="Top pages" icon={Eye} items={stats.topPages} mono />
            <BreakdownCard title="Countries" icon={Globe} items={stats.countries} empty="No country data yet" />
          </div>

          {/* Recent */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Recent visits</h2>
            <div className="mt-3 divide-y divide-slate-100">
              {stats.recent.length === 0 && <p className="py-4 text-sm text-slate-400">No visits yet.</p>}
              {stats.recent.map((v, i) => (
                <div key={i} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span className="truncate font-mono text-slate-700">{v.path}</span>
                  <div className="flex shrink-0 items-center gap-3 text-xs text-slate-400">
                    <span>{v.source}</span>
                    {v.country && <span>{v.country}</span>}
                    <span>{v.ts ? new Date(v.ts).toLocaleTimeString() : ""}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  live,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  hint?: string;
  live?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
        <span className="relative">
          <Icon className="h-4 w-4 text-brand-500" />
          {live && value > 0 && (
            <span className="absolute -right-1 -top-1 h-2 w-2 animate-ping rounded-full bg-emerald-500" />
          )}
        </span>
      </div>
      <p className="mt-3 text-3xl font-extrabold tabular-nums text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

function BreakdownCard({
  title,
  icon: Icon,
  items,
  mono,
  empty = "No data yet",
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: { key: string; count: number }[];
  mono?: boolean;
  empty?: string;
}) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
        <Icon className="h-4 w-4 text-brand-500" />
        {title}
      </h2>
      <div className="mt-4 space-y-2.5">
        {items.length === 0 && <p className="text-sm text-slate-400">{empty}</p>}
        {items.map((it) => (
          <div key={it.key}>
            <div className="flex items-center justify-between text-sm">
              <span className={`truncate ${mono ? "font-mono text-slate-700" : "text-slate-600"}`}>{it.key}</span>
              <span className="font-semibold text-slate-900">{it.count}</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-brand-500" style={{ width: `${(it.count / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
