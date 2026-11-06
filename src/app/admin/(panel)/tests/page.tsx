"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, ArrowDown, ArrowUp, CheckCircle2, Download, Gauge, Globe2, MonitorSmartphone, MousePointerClick, RefreshCw, Server, Timer, Trash2, Waves, Wifi } from "lucide-react";
import {
  Badge, Button, Card, EmptyState, Flag, IconButton, PageHeader, Pagination, SearchInput, Select, Skeleton, StatCard, TBody, THead, Table,
  api, fmtDateTime, fmtNum, timeAgo, useAdminUI,
} from "@/components/admin/ui";
import {
  BarsChart, Checkbox, ErrorBox, Legend, RangeControl, STATUS_LABEL, STATUS_TONE, TrendChart, downloadUrl, fmtBucket, fmtMbps, fmtPct, rangeLabel, rangeQuery, useChartTheme,
  type RangeState,
} from "@/components/admin/analytics/charts";
import { DeleteMenu } from "@/components/admin/analytics/DeleteMenu";
import { ProviderLogo } from "@/components/ip/shared";
import { ispBrand } from "@/lib/isp";

type Test = {
  id: string; status: string; mode: string; visitorId: string; path: string; locale: string; isp: string; ispBrand: string; ip: string; countryCode: string; city: string;
  server: string; device: string; os: string; browser: string; ts: number; download: number | null; upload: number | null; ping: number | null; jitter: number | null; durationMs: number | null; error: string;
};
type Group = { key: string; tests: number; completed: number; avgDownload: number | null; medianDownload: number | null; avgUpload: number | null; avgPing: number | null; countryCode?: string; city?: string };
type Data = {
  summary: { started: number; completed: number; cancelled: number; errors: number; inProgress: number; completionRate: number; avgDownload: number | null; medianDownload: number | null; avgUpload: number | null; avgPing: number | null; avgJitter: number | null; avgDurationSec: number | null; uniqueVisitors: number };
  perDay: { t: number; started: number; completed: number; cancelled: number; error: number }[];
  histogram: { label: string; count: number }[];
  errorsByType: { key: string; count: number }[];
  byCountry: Group[];
  byIsp: Group[];
  byMode: Group[];
  byDevice: Group[];
  facets: { countries: string[]; devices: string[] };
  total: number;
  page: number;
  pages: number;
  tests: Test[];
  capped: boolean;
};

const STATUS_OPTS = [
  { value: "", label: "All statuses" },
  { value: "completed", label: "Completed" },
  { value: "started", label: "In progress / abandoned" },
  { value: "cancelled", label: "Cancelled" },
  { value: "error", label: "Error" },
];
const MODE_OPTS = [
  { value: "", label: "All modes" },
  { value: "full", label: "Full test" },
  { value: "download", label: "Download only" },
  { value: "upload", label: "Upload only" },
  { value: "ping", label: "Ping only" },
];
const MODE_LABEL: Record<string, string> = { full: "Full", download: "Download", upload: "Upload", ping: "Ping" };
const regionName = (() => {
  try {
    const dn = new Intl.DisplayNames(["en"], { type: "region" });
    return (cc: string) => (cc ? dn.of(cc) || cc : "Unknown");
  } catch {
    return (cc: string) => cc || "Unknown";
  }
})();

export default function TestsPage() {
  const { confirm, toast } = useAdminUI();
  const th = useChartTheme();
  const [range, setRange] = useState<RangeState>({ range: "30d", from: "", to: "" });
  const [status, setStatus] = useState("");
  const [mode, setMode] = useState("");
  const [country, setCountry] = useState("");
  const [qInput, setQInput] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setQ(qInput.trim()), 300);
    return () => clearTimeout(t);
  }, [qInput]);
  useEffect(() => setPage(1), [range, status, mode, country, q]);

  const query = useMemo(() => {
    const p = new URLSearchParams(rangeQuery(range));
    if (status) p.set("status", status);
    if (mode) p.set("mode", mode);
    if (country) p.set("country", country);
    if (q) p.set("q", q);
    return p;
  }, [range, status, mode, country, q]);

  const load = useCallback(async () => {
    if (range.range === "custom" && !range.from) return;
    setLoading(true);
    setError("");
    try {
      const p = new URLSearchParams(query);
      p.set("page", String(page));
      p.set("limit", "25");
      const d = await api<Data>(`/api/admin/tests?${p}`);
      setData(d);
      setSelected((s) => new Set([...s].filter((id) => d.tests.some((t) => t.id === id))));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }, [query, page, range]);

  useEffect(() => {
    load();
  }, [load]);

  const del = async (body: Record<string, unknown>, title: string, message: string) => {
    if (!(await confirm({ title, message, confirmLabel: "Delete" }))) return;
    setBusy(true);
    try {
      const r = await api<{ deleted: number }>("/api/admin/tests", { method: "DELETE", json: body });
      toast(`Deleted ${fmtNum(r.deleted)} test${r.deleted === 1 ? "" : "s"}`);
      setSelected(new Set());
      await load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed", "error");
    } finally {
      setBusy(false);
    }
  };

  const deleteOne = async (t: Test) => {
    if (!(await confirm({ title: "Delete this test?", message: `${fmtDateTime(t.ts)} · ${t.city || t.countryCode || "Unknown"} · ${t.ispBrand || "Unknown ISP"}. This can’t be undone.` }))) return;
    // optimistic
    setData((d) => (d ? { ...d, tests: d.tests.filter((x) => x.id !== t.id), total: d.total - 1 } : d));
    try {
      await api(`/api/admin/tests/${encodeURIComponent(t.id)}`, { method: "DELETE" });
      toast("Test deleted");
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed", "error");
      load();
    }
  };

  const s = data?.summary;
  const rows = data?.tests || [];
  const allChecked = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const filtersActive = !!(status || mode || country || q);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Speed tests"
        icon={Gauge}
        description={`Everyone who pressed GO · ${rangeLabel(range)}`}
        actions={
          <>
            <RangeControl value={range} onChange={setRange} />
            <IconButton icon={RefreshCw} label="Refresh" variant="secondary" onClick={load} className={loading ? "[&_svg]:animate-spin" : ""} />
            <Button icon={Download} onClick={() => downloadUrl(`/api/admin/tests?${query}&format=csv`)}>Export CSV</Button>
            <DeleteMenu
              busy={busy}
              allLabel="Delete all tests…"
              olderLabel="Delete tests older than"
              onOlder={(days) => del({ olderThanDays: days }, `Delete tests older than ${days} days?`, "Every speed-test record older than that is permanently removed.")}
              onAll={() => del({ all: true }, "Delete ALL speed tests?", "Every speed-test record (all time, all countries) is permanently removed. This can’t be undone.")}
            />
          </>
        }
      />

      {error && <div className="mb-6"><ErrorBox message={error} onRetry={load} /></div>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tests started" icon={MousePointerClick} tone="blue" loading={!s} value={fmtNum(s?.started)} hint={s ? `${fmtNum(s.uniqueVisitors)} unique visitors clicked GO` : undefined} />
        <StatCard label="Completed" icon={CheckCircle2} tone="green" loading={!s} value={fmtNum(s?.completed)} hint={s ? `${fmtPct(s.completionRate)} completion rate` : undefined} />
        <StatCard label="Cancelled" icon={Timer} tone="amber" loading={!s} value={fmtNum(s?.cancelled)} hint={s ? `${fmtNum(s.inProgress)} abandoned / in progress` : undefined} />
        <StatCard label="Errors" icon={AlertTriangle} tone="rose" loading={!s} value={fmtNum(s?.errors)} hint={s?.started ? `${fmtPct((s.errors / s.started) * 100)} of tests` : undefined} />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Avg download" icon={ArrowDown} tone="violet" loading={!s} value={<>{fmtMbps(s?.avgDownload)}<span className="ms-1 text-base font-medium text-slate-400">Mbps</span></>} hint={s ? `median ${fmtMbps(s.medianDownload)} Mbps` : undefined} />
        <StatCard label="Avg upload" icon={ArrowUp} tone="cyan" loading={!s} value={<>{fmtMbps(s?.avgUpload)}<span className="ms-1 text-base font-medium text-slate-400">Mbps</span></>} />
        <StatCard label="Avg ping" icon={Activity} tone="green" loading={!s} value={<>{fmtNum(s?.avgPing, 0)}<span className="ms-1 text-base font-medium text-slate-400">ms</span></>} />
        <StatCard label="Avg jitter" icon={Waves} tone="amber" loading={!s} value={<>{fmtNum(s?.avgJitter, 1)}<span className="ms-1 text-base font-medium text-slate-400">ms</span></>} hint={s?.avgDurationSec ? `tests take ${s.avgDurationSec.toFixed(0)}s on average` : undefined} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card title="Tests per day" description="Started vs completed" className="xl:col-span-2">
          {!data ? <Skeleton className="h-[260px] w-full" /> : (
            <>
              <div className="mb-3"><Legend items={[{ label: "Started", color: th.c1 }, { label: "Completed", color: th.c2 }]} /></div>
              <TrendChart height={260} data={data.perDay} series={[{ key: "started", label: "Started", color: th.c1 }, { key: "completed", label: "Completed", color: th.c2 }]} xFormat={(v) => fmtBucket(v, "day")} />
            </>
          )}
        </Card>
        <Card title="Download speed distribution" description="Completed tests, Mbps">
          {!data ? <Skeleton className="h-[260px] w-full" /> : <BarsChart height={290} data={data.histogram} xKey="label" bars={[{ key: "count", label: "Tests", color: th.c1 }]} xFormat={(v) => `${v}`} />}
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <GroupTable title="By country" icon={Globe2} rows={data?.byCountry} label={(g) => <><Flag cc={g.key} /> <span className="truncate">{regionName(g.key)}</span></>} />
        <GroupTable title="By ISP" icon={Wifi} rows={data?.byIsp} label={(g) => <><ProviderLogo brand={ispBrand(g.key)} size={18} /> <span className="truncate">{g.key || "Unknown"}</span> {g.countryCode && <Flag cc={g.countryCode} />}</>} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <GroupTable title="By mode" icon={Gauge} rows={data?.byMode} label={(g) => <span>{MODE_LABEL[g.key] || g.key}</span>} compact />
        <GroupTable title="By device" icon={MonitorSmartphone} rows={data?.byDevice} label={(g) => <span className="capitalize">{g.key || "Unknown"}</span>} compact />
        <Card title="Errors by stage" icon={AlertTriangle} description="Where failing tests stopped">
          {!data ? <Skeleton className="h-32 w-full" /> : data.errorsByType.length ? (
            <ul className="space-y-2">
              {data.errorsByType.map((e) => (
                <li key={e.key} className="flex items-center justify-between text-sm">
                  <Badge tone="rose" className="capitalize">{e.key}</Badge>
                  <span className="font-semibold tabular-nums text-slate-900 dark:text-white">{fmtNum(e.count)}</span>
                </li>
              ))}
            </ul>
          ) : <p className="py-6 text-center text-sm text-slate-400">No errors in this range 🎉</p>}
        </Card>
      </div>

      {/* ---------------- table ---------------- */}
      <Card className="mt-6" title="All tests" description={data ? `${fmtNum(data.total)} ${filtersActive ? "matching" : "in range"}` : undefined} bodyClassName="p-0">
        <div className="flex flex-col gap-2 border-b border-slate-100 p-4 dark:border-white/[0.06] lg:flex-row lg:items-center">
          <SearchInput value={qInput} onChange={setQInput} placeholder="Search IP, city, ISP, server, visitor…" className="lg:w-80" />
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Select value={status} onChange={setStatus} options={STATUS_OPTS} className="sm:w-48" />
            <Select value={mode} onChange={setMode} options={MODE_OPTS} className="sm:w-40" />
            <Select value={country} onChange={setCountry} options={[{ value: "", label: "All countries" }, ...(data?.facets.countries || []).map((c) => ({ value: c, label: regionName(c) }))]} className="col-span-2 sm:w-44" />
          </div>
          {filtersActive && <Button size="sm" variant="ghost" onClick={() => { setStatus(""); setMode(""); setCountry(""); setQInput(""); }}>Clear</Button>}
        </div>

        {selected.size > 0 && (
          <div className="flex items-center justify-between gap-3 border-b border-brand-100 bg-brand-50/60 px-4 py-2 text-sm dark:border-brand-400/20 dark:bg-brand-400/10">
            <span className="font-medium text-brand-700 dark:text-brand-200">{selected.size} selected</span>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Clear</Button>
              <Button size="sm" variant="danger" icon={Trash2} loading={busy} onClick={() => del({ ids: [...selected] }, `Delete ${selected.size} test${selected.size === 1 ? "" : "s"}?`, "The selected speed-test records are permanently removed.")}>Delete selected</Button>
            </div>
          </div>
        )}

        {!data && loading ? (
          <div className="space-y-2 p-4">{Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
        ) : rows.length === 0 ? (
          <EmptyState icon={Gauge} title={filtersActive ? "No tests match these filters" : "No speed tests in this range"} description={filtersActive ? "Try clearing the filters or widening the date range." : "Tests appear here as soon as someone presses GO."} />
        ) : (
          <Table className={`[&_td]:!px-2.5 [&_th]:!px-2.5 [&_td:first-child]:!ps-4 [&_th:first-child]:!ps-4 ${loading ? "opacity-60 transition-opacity" : ""}`}>
            <THead>
              <tr>
                <th className="w-10"><Checkbox label="Select all on this page" checked={allChecked} indeterminate={selected.size > 0} onChange={(v) => setSelected(v ? new Set(rows.map((r) => r.id)) : new Set())} /></th>
                <th>Time</th>
                <th>Location</th>
                <th>ISP</th>
                <th className="!text-end whitespace-nowrap">Down <span className="normal-case text-slate-400">Mbps</span></th>
                <th className="!text-end">Up</th>
                <th className="!text-end whitespace-nowrap">Ping <span className="normal-case text-slate-400">ms</span></th>
                <th className="!text-end">Jitter</th>
                <th>Status</th>
                <th>Device</th>
                <th>Server</th>
                <th className="w-10"><span className="sr-only">Actions</span></th>
              </tr>
            </THead>
            <TBody>
              {rows.map((t) => (
                <tr key={t.id} className={selected.has(t.id) ? "bg-brand-50/40 dark:bg-brand-400/[0.06]" : ""}>
                  <td><Checkbox label={`Select test ${t.id}`} checked={selected.has(t.id)} onChange={(v) => setSelected((s) => { const n = new Set(s); if (v) n.add(t.id); else n.delete(t.id); return n; })} /></td>
                  <td className="whitespace-nowrap">
                    <div className="tabular-nums text-slate-900 dark:text-white">{fmtDateTime(t.ts)}</div>
                    <div className="text-xs text-slate-400">{timeAgo(t.ts)} · {MODE_LABEL[t.mode] || t.mode}</div>
                  </td>
                  <td className="whitespace-nowrap">
                    <div className="flex items-center gap-2"><Flag cc={t.countryCode} /> <span>{t.city || regionName(t.countryCode)}</span></div>
                    <div className="font-mono text-[11px] text-slate-400">{t.ip}</div>
                  </td>
                  <td className="max-w-[12rem]">
                    <div className="flex items-center gap-2"><ProviderLogo brand={ispBrand(t.ispBrand || t.isp)} size={18} /><span className="truncate">{t.ispBrand || t.isp || "–"}</span></div>
                  </td>
                  <td className="text-end font-semibold tabular-nums text-slate-900 dark:text-white">{fmtMbps(t.download)}</td>
                  <td className="text-end tabular-nums">{fmtMbps(t.upload)}</td>
                  <td className="text-end tabular-nums">{t.ping == null ? "–" : fmtNum(t.ping)}</td>
                  <td className="text-end tabular-nums">{t.jitter == null ? "–" : fmtNum(t.jitter)}</td>
                  <td className="whitespace-nowrap">
                    <Badge tone={STATUS_TONE[t.status] || "slate"}>{STATUS_LABEL[t.status] || t.status}</Badge>
                    {t.error && <div className="mt-0.5 text-[11px] text-rose-500">{t.error}</div>}
                  </td>
                  <td className="whitespace-nowrap text-xs"><span className="capitalize">{t.device || "–"}</span><div className="text-slate-400">{[t.os, t.browser].filter(Boolean).join(" · ")}</div></td>
                  <td className="whitespace-nowrap"><span className="inline-flex items-center gap-1 font-mono text-xs"><Server className="h-3 w-3 text-slate-400" aria-hidden="true" />{t.server || "–"}</span></td>
                  <td><IconButton icon={Trash2} label="Delete test" variant="danger-ghost" onClick={() => deleteOne(t)} /></td>
                </tr>
              ))}
            </TBody>
          </Table>
        )}
        {data && <Pagination page={data.page} pages={data.pages} onPage={setPage} />}
      </Card>
    </div>
  );
}

function GroupTable({ title, icon, rows, label, compact }: { title: string; icon: typeof Gauge; rows?: Group[]; label: (g: Group) => React.ReactNode; compact?: boolean }) {
  const [all, setAll] = useState(false);
  const list = rows || [];
  const shown = all ? list : list.slice(0, compact ? 6 : 8);
  return (
    <Card title={title} icon={icon} description="Average speed of completed tests" bodyClassName="p-0">
      {!rows ? <div className="space-y-2 p-5">{Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-7 w-full" />)}</div> : !list.length ? (
        <p className="py-10 text-center text-sm text-slate-400">No tests in this range</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm [&_td]:px-4 [&_td]:py-2 [&_th]:px-4 [&_th]:py-2">
              <thead className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                <tr className="border-b border-slate-100 dark:border-white/[0.06]">
                  <th className="text-start font-medium">{title.replace("By ", "")}</th>
                  <th className="text-end font-medium">Tests</th>
                  <th className="text-end font-medium">Down</th>
                  {!compact && <th className="text-end font-medium">Up</th>}
                  <th className="text-end font-medium">Ping</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 dark:divide-white/[0.06] dark:text-slate-300">
                {shown.map((g) => (
                  <tr key={g.key + (g.countryCode || "")}>
                    <td className="max-w-[14rem]"><span className="flex min-w-0 items-center gap-2">{label(g)}</span></td>
                    <td className="text-end tabular-nums">{fmtNum(g.tests)}</td>
                    <td className="text-end font-semibold tabular-nums text-slate-900 dark:text-white">{fmtMbps(g.avgDownload)}</td>
                    {!compact && <td className="text-end tabular-nums">{fmtMbps(g.avgUpload)}</td>}
                    <td className="text-end tabular-nums">{g.avgPing == null ? "–" : fmtNum(g.avgPing, 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {list.length > shown.length || all ? (
            <div className="border-t border-slate-100 py-2 text-center dark:border-white/[0.06]"><Button size="sm" variant="ghost" onClick={() => setAll(!all)}>{all ? "Show less" : `Show all ${list.length}`}</Button></div>
          ) : null}
        </>
      )}
    </Card>
  );
}
