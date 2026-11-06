"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useWipeAnalytics } from "@/components/admin/settings/WipeAnalytics";
import { Eraser } from "lucide-react";
import { BarChart3, Clock, Download, Eye, Globe2, Languages, Layers, LogIn, MonitorSmartphone, MousePointerClick, RefreshCw, Search, Share2, UserPlus, Users } from "lucide-react";
import { Button, Card, Flag, IconButton, PageHeader, Segmented, Skeleton, StatCard, Toggle, api, fmtNum } from "@/components/admin/ui";
import {
  ErrorBox, Heatmap, KIND_LABEL, LANG_NAME, LangBadge, Legend, RangeControl, RankList, ShareBar, SourceLogo, Sparkline, TrendChart,
  downloadUrl, fmtBucket, fmtDuration, fmtPct, pctChange, rangeLabel, rangeQuery, useChartTheme, type RangeState,
} from "@/components/admin/analytics/charts";

type Data = {
  range: string;
  from: number;
  to: number;
  bucket: "hour" | "day";
  capped: boolean;
  totals: { pageviews: number; visitors: number; sessions: number; bounceRate: number; viewsPerSession: number; avgSessionSec: number; searchVisits: number; searchShare: number };
  prev: { pageviews: number; visitors: number; sessions: number; searchVisits: number };
  series: { t: number; pageviews: number; visitors: number; sessions: number }[];
  searchEngines: { name: string; visits: number; visitors: number; share: number; shareOfAll: number; prev: number; delta: number | null; spark: number[] }[];
  sourceKinds: { kind: string; visits: number }[];
  sources: { name: string; kind: string; visits: number; visitors: number; prev: number; delta: number | null }[];
  referrers: { host: string; visits: number; source: string }[];
  pages: { path: string; lang: string; base: string; visits: number; visitors: number }[];
  pagesGrouped: { path: string; visits: number; visitors: number; langs: string[] }[];
  entryPages: { path: string; lang: string; base: string; visits: number }[];
  countries: { code: string; name: string; visits: number; visitors: number }[];
  cities: { code: string; city: string; visits: number }[];
  languages: { lang: string; visits: number; visitors: number }[];
  devices: { name: string; visitors: number }[];
  os: { name: string; visitors: number }[];
  browsers: { name: string; visitors: number }[];
  hours: number[];
  heatmap: number[][];
  newVsReturning: { new: number; returning: number };
};

const RANGE_KEY = "tsi-admin-analytics-range";

export default function AnalyticsPage() {
  const [range, setRange] = useState<RangeState>({ range: "30d", from: "", to: "" });
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(RANGE_KEY);
      if (saved && ["today", "7d", "30d", "90d"].includes(saved)) setRange({ range: saved as RangeState["range"], from: "", to: "" });
    } catch {
      /* ignore */
    }
  }, []);

  const load = useCallback(async () => {
    if (range.range === "custom" && !range.from) return;
    setLoading(true);
    setError("");
    try {
      setData(await api<Data>(`/api/admin/analytics?${rangeQuery(range)}`));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    load();
  }, [load]);

  const changeRange = (r: RangeState) => {
    setRange(r);
    try {
      if (r.range !== "custom") localStorage.setItem(RANGE_KEY, r.range);
    } catch {
      /* ignore */
    }
  };

  const wipe = useWipeAnalytics(load);
  const d = data;
  const t = d?.totals;

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Analytics"
        icon={BarChart3}
        description={`Traffic, search engines and audience · ${rangeLabel(range)}`}
        actions={
          <>
            <RangeControl value={range} onChange={changeRange} />
            <IconButton icon={RefreshCw} label="Refresh" variant="secondary" onClick={load} className={loading ? "[&_svg]:animate-spin" : ""} />
            <Button icon={Download} onClick={() => downloadUrl(`/api/admin/analytics?${rangeQuery(range)}&format=csv`)}>Export CSV</Button>
            <Button variant="danger-ghost" icon={wipe.busy ? undefined : Eraser} loading={!!wipe.busy} onClick={wipe.ask}>
              {wipe.busy ? `Deleting ${wipe.busy.toLowerCase()}…` : "Delete all…"}
            </Button>
          </>
        }
      />

      {wipe.dialog}
      {error && <div className="mb-6"><ErrorBox message={error} onRetry={load} /></div>}
      {d?.capped && <p className="mb-4 rounded-xl bg-amber-50 px-4 py-2 text-xs text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">Showing the most recent 25,000 page views in this range — pick a shorter range for exact totals.</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Visitors" icon={Users} tone="blue" loading={!d} value={fmtNum(t?.visitors)} delta={d ? pctChange(d.totals.visitors, d.prev.visitors) : null} hint="vs previous period" />
        <StatCard label="Page views" icon={Eye} tone="violet" loading={!d} value={fmtNum(t?.pageviews)} delta={d ? pctChange(d.totals.pageviews, d.prev.pageviews) : null} hint={t ? `${t.viewsPerSession.toFixed(2)} per session` : undefined} />
        <StatCard label="Sessions" icon={MousePointerClick} tone="cyan" loading={!d} value={fmtNum(t?.sessions)} delta={d ? pctChange(d.totals.sessions, d.prev.sessions) : null} hint={t ? `${fmtPct(t.bounceRate, 0)} bounce` : undefined} />
        <StatCard label="From search engines" icon={Search} tone="green" loading={!d} value={fmtNum(t?.searchVisits)} delta={d ? pctChange(d.totals.searchVisits, d.prev.searchVisits) : null} hint={t ? `${fmtPct(t.searchShare, 0)} of all traffic` : undefined} />
      </div>

      <TrafficCard data={d} />

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <SearchEnginesCard data={d} className="xl:col-span-2" />
        <Card title="Traffic channels" icon={Share2} description="Page views by channel">
          {!d ? <ListSkeleton rows={5} /> : <ChannelShare kinds={d.sourceKinds} />}
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SourcesCard data={d} />
        <ExpandCard title="Referrer hostnames" icon={Globe2} description="Sites that linked to you" loading={!d}
          rows={(d?.referrers || []).map((r) => ({ key: r.host, value: r.visits, label: <><SourceLogo name={r.host} /> <span className="truncate">{r.host}</span></> }))} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <TopPagesCard data={d} />
        <ExpandCard title="Entry pages" icon={LogIn} description="First page of each session" loading={!d} valueLabel="Sessions"
          rows={(d?.entryPages || []).map((p) => ({ key: p.path, value: p.visits, label: <PathLabel base={p.base} lang={p.lang} /> }))} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <ExpandCard title="Countries" icon={Globe2} loading={!d} valueLabel="Visitors"
          rows={(d?.countries || []).map((c) => ({ key: c.code || "??", value: c.visitors, label: <><Flag cc={c.code} /> <span className="truncate">{c.name}</span></>, sub: share(c.visitors, t?.visitors) }))} />
        <ExpandCard title="Cities" icon={Globe2} loading={!d}
          rows={(d?.cities || []).map((c) => ({ key: `${c.code}-${c.city}`, value: c.visits, label: <><Flag cc={c.code} /> <span className="truncate">{c.city}</span></> }))} />
        <ExpandCard title="Languages" icon={Languages} description="From the URL prefix" loading={!d} valueLabel="Visitors"
          rows={(d?.languages || []).map((l) => ({ key: l.lang, value: l.visitors, label: <><LangBadge lang={l.lang} /> <span className="truncate">{LANG_NAME[l.lang] || l.lang}</span></>, sub: share(l.visitors, t?.visitors) }))} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {(["devices", "os", "browsers"] as const).map((k) => (
          <ExpandCard key={k} title={{ devices: "Devices", os: "Operating systems", browsers: "Browsers" }[k]} icon={MonitorSmartphone} loading={!d} valueLabel="Visitors"
            rows={(d?.[k] || []).map((x) => ({ key: x.name, value: x.visitors, label: <span className="truncate capitalize">{x.name}</span>, sub: share(x.visitors, t?.visitors) }))} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card title="When people visit" icon={Clock} description="Page views by weekday and hour (your local time)" className="xl:col-span-2">
          {!d ? <Skeleton className="h-48 w-full" /> : <Heatmap data={d.heatmap} />}
        </Card>
        <Card title="New vs returning" icon={UserPlus} description="Unique visitors in this range">
          {!d ? <ListSkeleton rows={3} /> : <NewReturning d={d} />}
        </Card>
      </div>
    </div>
  );
}

const share = (v: number, total?: number) => (total ? `${((v / total) * 100).toFixed(0)}%` : "");

function ListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }, (_, i) => <Skeleton key={i} className="h-8 w-full" />)}
    </div>
  );
}

function PathLabel({ base, lang }: { base: string; lang: string }) {
  return (
    <>
      {lang !== "en" && <LangBadge lang={lang} />}
      <span className="truncate font-mono text-[13px]" title={base}>{base}</span>
    </>
  );
}

function TrafficCard({ data }: { data: Data | null }) {
  const th = useChartTheme();
  const [metric, setMetric] = useState<"all" | "visitors" | "pageviews" | "sessions">("all");
  const series = [
    { key: "visitors", label: "Visitors", color: th.c1 },
    { key: "pageviews", label: "Page views", color: th.c2 },
    { key: "sessions", label: "Sessions", color: th.c3, fill: false },
  ].filter((s) => metric === "all" || s.key === metric);
  return (
    <Card
      className="mt-6"
      title="Traffic over time"
      description={data ? `${data.bucket === "hour" ? "Hourly" : "Daily"} · ${fmtNum(data.totals.pageviews)} page views` : undefined}
      actions={<div className="hidden sm:block"><Segmented value={metric} onChange={setMetric} options={[{ value: "all", label: "All" }, { value: "visitors", label: "Visitors" }, { value: "pageviews", label: "Views" }, { value: "sessions", label: "Sessions" }]} /></div>}
    >
      {!data ? (
        <Skeleton className="h-[280px] w-full" />
      ) : (
        <>
          <div className="mb-3"><Legend items={series} /></div>
          <TrendChart data={data.series} series={series} xFormat={(v) => fmtBucket(v, data.bucket)} />
        </>
      )}
    </Card>
  );
}

function SearchEnginesCard({ data, className = "" }: { data: Data | null; className?: string }) {
  const th = useChartTheme();
  const engines = data?.searchEngines || [];
  const maxShare = Math.max(1, ...engines.map((e) => e.share));
  return (
    <Card
      className={className}
      title="Search engines"
      icon={Search}
      description={data ? `${fmtNum(data.totals.searchVisits)} page views from search · ${fmtPct(data.totals.searchShare, 0)} of all traffic` : "Organic search traffic"}
      bodyClassName="p-0"
    >
      {!data ? (
        <div className="p-5"><ListSkeleton rows={5} /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              <tr className="border-b border-slate-100 dark:border-white/[0.06]">
                <th className="px-5 py-2.5 text-start font-medium">Engine</th>
                <th className="px-3 py-2.5 text-end font-medium">Views</th>
                <th className="px-3 py-2.5 text-end font-medium">Visitors</th>
                <th className="w-[28%] px-3 py-2.5 text-start font-medium">Share of search</th>
                <th className="px-3 py-2.5 text-end font-medium">vs prev.</th>
                <th className="px-5 py-2.5 text-end font-medium">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {engines.map((e) => (
                <tr key={e.name} className={e.visits ? "" : "opacity-50"}>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-2.5 font-medium text-slate-900 dark:text-white">
                      <SourceLogo name={e.name} size={20} />
                      {e.name}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-end font-semibold tabular-nums text-slate-900 dark:text-white">{fmtNum(e.visits)}</td>
                  <td className="px-3 py-3 text-end tabular-nums text-slate-600 dark:text-slate-300">{fmtNum(e.visitors)}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.06]">
                        <div className="h-full rounded-full" style={{ width: `${(e.share / maxShare) * 100}%`, background: th.c1 }} />
                      </div>
                      <span className="w-12 text-end text-xs tabular-nums text-slate-600 dark:text-slate-300">{fmtPct(e.share)}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-end"><Delta value={e.delta} prev={e.prev} /></td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end"><Sparkline values={e.spark} color={th.c1} /></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function Delta({ value, prev }: { value: number | null; prev: number }) {
  if (value == null) return <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">new</span>;
  if (!prev && !value) return <span className="text-xs text-slate-400">–</span>;
  const up = value >= 0;
  return (
    <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums ${up ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300" : "bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300"}`}>
      {up ? "▲" : "▼"} {Math.abs(value).toFixed(Math.abs(value) < 10 ? 1 : 0)}%
    </span>
  );
}

function ChannelShare({ kinds }: { kinds: { kind: string; visits: number }[] }) {
  const th = useChartTheme();
  const color: Record<string, string> = { search: th.c1, direct: th.dark ? "#64748b" : "#94a3b8", social: "#7c3aed", ai: th.c2, referral: th.c3 };
  const order = ["search", "direct", "social", "ai", "referral"];
  const items = order.map((k) => ({ label: KIND_LABEL[k], value: kinds.find((x) => x.kind === k)?.visits || 0, color: color[k] }));
  return <ShareBar items={items} />;
}

function SourcesCard({ data }: { data: Data | null }) {
  const [all, setAll] = useState(false);
  const rows = data?.sources || [];
  const shown = all ? rows : rows.slice(0, 8);
  const total = data?.totals.pageviews || 0;
  return (
    <Card title="All traffic sources" icon={Layers} description="Search, social, AI and referrals" actions={rows.length > 8 ? <Button size="sm" variant="ghost" onClick={() => setAll(!all)}>{all ? "Show less" : `Show all ${rows.length}`}</Button> : undefined}>
      {!data ? <ListSkeleton /> : (
        <RankList
          rows={shown.map((s) => ({
            key: s.name,
            value: s.visits,
            label: <><SourceLogo name={s.name} /> <span className="truncate">{s.name}</span> <span className="hidden text-[11px] text-slate-400 sm:inline">{KIND_LABEL[s.kind]}</span></>,
            extra: <span className="hidden sm:inline"><Delta value={s.delta} prev={s.prev} /></span>,
            sub: share(s.visits, total),
          }))}
        />
      )}
    </Card>
  );
}

function TopPagesCard({ data }: { data: Data | null }) {
  const [grouped, setGrouped] = useState(false);
  const [all, setAll] = useState(false);
  const rows = useMemo(
    () =>
      grouped
        ? (data?.pagesGrouped || []).map((p) => ({
            key: p.path,
            value: p.visits,
            label: <><span className="truncate font-mono text-[13px]">{p.path}</span> <span className="flex gap-0.5">{p.langs.map((l) => <LangBadge key={l} lang={l} />)}</span></>,
          }))
        : (data?.pages || []).map((p) => ({ key: p.path, value: p.visits, label: <PathLabel base={p.base} lang={p.lang} /> })),
    [data, grouped],
  );
  return (
    <Card
      title="Top pages"
      icon={Eye}
      actions={
        <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          Group languages
          <Toggle checked={grouped} onChange={setGrouped} label="Group languages together" />
        </label>
      }
    >
      {!data ? <ListSkeleton /> : (
        <>
          <RankList rows={all ? rows : rows.slice(0, 10)} />
          {rows.length > 10 && (
            <div className="mt-3 text-center"><Button size="sm" variant="ghost" onClick={() => setAll(!all)}>{all ? "Show less" : `Show all ${rows.length}`}</Button></div>
          )}
        </>
      )}
    </Card>
  );
}

function ExpandCard({ title, icon, description, rows, loading, valueLabel }: {
  title: string;
  icon: typeof Eye;
  description?: string;
  rows: { key: string; label: React.ReactNode; value: number; sub?: React.ReactNode }[];
  loading: boolean;
  valueLabel?: string;
}) {
  const [all, setAll] = useState(false);
  return (
    <Card title={title} icon={icon} description={description}>
      {loading ? <ListSkeleton /> : (
        <>
          <RankList rows={all ? rows : rows.slice(0, 8)} valueLabel={valueLabel} />
          {rows.length > 8 && (
            <div className="mt-3 text-center"><Button size="sm" variant="ghost" onClick={() => setAll(!all)}>{all ? "Show less" : `Show all ${rows.length}`}</Button></div>
          )}
        </>
      )}
    </Card>
  );
}

function NewReturning({ d }: { d: Data }) {
  const th = useChartTheme();
  const peak = d.hours.indexOf(Math.max(...d.hours));
  return (
    <div className="space-y-5">
      <ShareBar items={[{ label: "New visitors", value: d.newVsReturning.new, color: th.c1 }, { label: "Returning visitors", value: d.newVsReturning.returning, color: th.c3 }]} />
      <dl className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 dark:border-white/[0.06]">
        <Metric label="Bounce rate" value={fmtPct(d.totals.bounceRate, 0)} />
        <Metric label="Views / session" value={d.totals.viewsPerSession.toFixed(2)} />
        <Metric label="Avg. session" value={fmtDuration(d.totals.avgSessionSec)} hint="multi-page sessions" />
        <Metric label="Peak hour" value={d.totals.pageviews ? `${String(peak).padStart(2, "0")}:00` : "–"} />
      </dl>
    </div>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-white/[0.03]">
      <dt className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-lg font-semibold tabular-nums text-slate-900 dark:text-white">{value}</dd>
      {hint && <dd className="text-[10px] text-slate-400">{hint}</dd>}
    </div>
  );
}
