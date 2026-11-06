"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Eye, Gauge, Globe2, Monitor, RefreshCw, Search, Smartphone, Tablet, Trash2, Users, Wifi } from "lucide-react";
import {
  Badge, Button, Card, EmptyState, Flag, IconButton, PageHeader, Pagination, SearchInput, Select, Skeleton, StatCard, TBody, THead, Table,
  api, fmtDateTime, fmtNum, timeAgo, useAdminUI,
} from "@/components/admin/ui";
import { Checkbox, Drawer, ErrorBox, LangBadge, STATUS_LABEL, STATUS_TONE, SourceBadge, SourceLogo, downloadUrl, fmtMbps } from "@/components/admin/analytics/charts";
import { DeleteMenu } from "@/components/admin/analytics/DeleteMenu";

type Visitor = {
  id: string; visits: number; firstSeen: number; lastSeen: number; country: string; countryCode: string; city: string; ip: string; source: string; lastPath: string;
  online: boolean; device: string; os: string; browser: string;
};
type Facet = { value: string; count: number; name?: string };
type ListData = { visitors: Visitor[]; total: number; page: number; pages: number; totalAll: number; onlineNow: number; capped: boolean; facets: { sources: Facet[]; countries: Facet[]; devices: Facet[] } };
type Detail = {
  visitor: (Visitor & { ua: string }) | null;
  visits: { id: string; path: string; referrer: string; source: string; sessionId: string; countryCode: string; city: string; ip: string; screen: string; ts: number }[];
  tests: { id: string; status: string; mode: string; download: number | null; upload: number | null; ping: number | null; jitter: number | null; ispBrand: string; server: string; ts: number }[];
  online: boolean;
  onlinePath: string;
};

const DeviceIcon = ({ d }: { d: string }) => {
  const I = d === "mobile" ? Smartphone : d === "tablet" ? Tablet : Monitor;
  return <I className="h-3.5 w-3.5 text-slate-400" aria-label={d} />;
};
const langOf = (p: string) => /^\/(fr|es|ar|ru)(?=\/|$)/.exec(p)?.[1] || "";

export default function VisitorsPage() {
  const { confirm, toast } = useAdminUI();
  const [qInput, setQInput] = useState("");
  const [q, setQ] = useState("");
  const [source, setSource] = useState("");
  const [country, setCountry] = useState("");
  const [device, setDevice] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ListData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  // Deep link: /admin/visitors?v=<visitorId> opens that visitor's panel.
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("v");
    if (v) setOpenId(v);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setQ(qInput.trim()), 300);
    return () => clearTimeout(t);
  }, [qInput]);
  useEffect(() => setPage(1), [q, source, country, device]);

  const query = useMemo(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (source) p.set("source", source);
    if (country) p.set("country", country);
    if (device) p.set("device", device);
    return p;
  }, [q, source, country, device]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const p = new URLSearchParams(query);
      p.set("page", String(page));
      p.set("limit", "25");
      const d = await api<ListData>(`/api/admin/visitors?${p}`);
      setData(d);
      setSelected((s) => new Set([...s].filter((id) => d.visitors.some((v) => v.id === id))));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }, [query, page]);

  useEffect(() => {
    load();
  }, [load]);

  const deleteIds = async (ids: string[]) => {
    const one = ids.length === 1;
    if (!(await confirm({ title: one ? "Delete this visitor?" : `Delete ${ids.length} visitors?`, message: `${one ? "The visitor" : "These visitors"} and all of ${one ? "their" : "their"} page views, speed tests and live presence will be permanently removed.` }))) return false;
    setBusy(true);
    setData((d) => (d ? { ...d, visitors: d.visitors.filter((v) => !ids.includes(v.id)), total: d.total - ids.length } : d));
    try {
      const r = await api<{ deleted: { visitors: number; visits: number; tests: number } }>(one ? `/api/admin/visitors/${encodeURIComponent(ids[0])}` : "/api/admin/visitors", { method: "DELETE", json: one ? undefined : { ids } });
      toast(`Deleted ${fmtNum(r.deleted.visitors)} visitor${r.deleted.visitors === 1 ? "" : "s"}, ${fmtNum(r.deleted.visits)} page views, ${fmtNum(r.deleted.tests)} tests`);
      setSelected(new Set());
      return true;
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed", "error");
      return false;
    } finally {
      setBusy(false);
      load();
    }
  };

  const deleteAll = async () => {
    if (!(await confirm({ title: "Delete ALL visitors & page views?", message: "Every visitor record, every page view and all live presence data is permanently removed. Analytics will start again from zero. Speed tests are kept. This can’t be undone.", confirmLabel: "Delete everything" }))) return;
    setBusy(true);
    try {
      const r = await api<{ deleted: { visitors: number; visits: number } }>("/api/admin/visitors", { method: "DELETE", json: { all: true } });
      toast(`Deleted ${fmtNum(r.deleted.visitors)} visitors and ${fmtNum(r.deleted.visits)} page views`);
      setSelected(new Set());
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed", "error");
    } finally {
      setBusy(false);
    }
  };

  const deleteOldVisits = async (days: number) => {
    if (!(await confirm({ title: `Delete page views older than ${days} days?`, message: "Older page-view records are permanently removed (analytics for those dates will be empty). Visitor profiles are kept." }))) return;
    setBusy(true);
    try {
      const r = await api<{ deleted: number }>("/api/admin/visits", { method: "DELETE", json: { olderThanDays: days } });
      toast(`Deleted ${fmtNum(r.deleted)} page views`);
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed", "error");
    } finally {
      setBusy(false);
    }
  };

  const rows = data?.visitors || [];
  const allChecked = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const filtersActive = !!(q || source || country || device);
  const topSource = data?.facets.sources[0];
  const topCountry = data?.facets.countries[0];

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Visitors"
        icon={Users}
        description="Every unique visitor, where they came from and what they did"
        actions={
          <>
            <IconButton icon={RefreshCw} label="Refresh" variant="secondary" onClick={load} className={loading ? "[&_svg]:animate-spin" : ""} />
            <Button icon={Download} onClick={() => downloadUrl(`/api/admin/visitors?${query}&format=csv`)}>Export CSV</Button>
            <DeleteMenu busy={busy} allLabel="Delete all visitors & page views…" olderLabel="Delete page views older than" onOlder={deleteOldVisits} onAll={deleteAll} />
          </>
        }
      />

      {error && <div className="mb-6"><ErrorBox message={error} onRetry={load} /></div>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total visitors" icon={Users} tone="blue" loading={!data} value={fmtNum(data?.totalAll)} hint="all time" />
        <StatCard label="Online now" icon={Eye} tone="green" live loading={!data} value={fmtNum(data?.onlineNow)} hint="active in the last 60 s" />
        <StatCard label="Top source" icon={Search} tone="violet" loading={!data} value={topSource ? <span className="flex items-center gap-2"><SourceLogo name={topSource.value} size={22} />{topSource.value}</span> : "–"} hint={topSource ? `${fmtNum(topSource.count)} visitors` : undefined} />
        <StatCard label="Top country" icon={Globe2} tone="amber" loading={!data} value={topCountry ? <span className="flex items-center gap-2"><Flag cc={topCountry.value} className="!h-[18px] !w-6" />{topCountry.name}</span> : "–"} hint={topCountry ? `${fmtNum(topCountry.count)} visitors` : undefined} />
      </div>

      <Card className="mt-6" title="All visitors" description={data ? `${fmtNum(data.total)} ${filtersActive ? "matching" : "most recent"}${data.capped ? " (latest 5,000 scanned)" : ""} · click a row for details` : undefined} bodyClassName="p-0">
        <div className="flex flex-col gap-2 border-b border-slate-100 p-4 dark:border-white/[0.06] lg:flex-row lg:items-center">
          <SearchInput value={qInput} onChange={setQInput} placeholder="Search IP, city, country, source, visitor ID…" className="lg:w-80" />
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Select value={source} onChange={setSource} options={[{ value: "", label: "All sources" }, ...(data?.facets.sources || []).map((s) => ({ value: s.value, label: `${s.value} (${s.count})` }))]} className="sm:w-44" />
            <Select value={device} onChange={setDevice} options={[{ value: "", label: "All devices" }, ...(data?.facets.devices || []).map((s) => ({ value: s.value, label: `${s.value[0].toUpperCase()}${s.value.slice(1)} (${s.count})` }))]} className="sm:w-40" />
            <Select value={country} onChange={setCountry} options={[{ value: "", label: "All countries" }, ...(data?.facets.countries || []).map((s) => ({ value: s.value, label: `${s.name} (${s.count})` }))]} className="col-span-2 sm:w-48" />
          </div>
          {filtersActive && <Button size="sm" variant="ghost" onClick={() => { setQInput(""); setSource(""); setCountry(""); setDevice(""); }}>Clear</Button>}
        </div>

        {selected.size > 0 && (
          <div className="flex items-center justify-between gap-3 border-b border-brand-100 bg-brand-50/60 px-4 py-2 text-sm dark:border-brand-400/20 dark:bg-brand-400/10">
            <span className="font-medium text-brand-700 dark:text-brand-200">{selected.size} selected</span>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Clear</Button>
              <Button size="sm" variant="danger" icon={Trash2} loading={busy} onClick={() => deleteIds([...selected])}>Delete selected</Button>
            </div>
          </div>
        )}

        {!data && loading ? (
          <div className="space-y-2 p-4">{Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
        ) : rows.length === 0 ? (
          <EmptyState icon={Users} title={filtersActive ? "No visitors match these filters" : "No visitors yet"} description={filtersActive ? "Try a different search or clear the filters." : "Visitors appear as soon as someone opens the site."} />
        ) : (
          <Table className={loading ? "opacity-60 transition-opacity" : ""}>
            <THead>
              <tr>
                <th className="w-10"><Checkbox label="Select all on this page" checked={allChecked} indeterminate={selected.size > 0} onChange={(v) => setSelected(v ? new Set(rows.map((r) => r.id)) : new Set())} /></th>
                <th>Visitor</th>
                <th>Source</th>
                <th className="!text-end">Visits</th>
                <th>First seen</th>
                <th>Last seen</th>
                <th>Last page</th>
                <th>Device</th>
                <th className="w-10"><span className="sr-only">Actions</span></th>
              </tr>
            </THead>
            <TBody>
              {rows.map((v) => (
                <tr
                  key={v.id}
                  tabIndex={0}
                  onClick={() => setOpenId(v.id)}
                  onKeyDown={(e) => e.key === "Enter" && setOpenId(v.id)}
                  className={`cursor-pointer focus:outline-none focus-visible:bg-brand-50/60 dark:focus-visible:bg-white/[0.04] ${selected.has(v.id) ? "bg-brand-50/40 dark:bg-brand-400/[0.06]" : ""}`}
                >
                  <td><Checkbox label={`Select visitor ${v.id}`} checked={selected.has(v.id)} onChange={(c) => setSelected((s) => { const n = new Set(s); if (c) n.add(v.id); else n.delete(v.id); return n; })} /></td>
                  <td className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Flag cc={v.countryCode} />
                      <span className="font-medium text-slate-900 dark:text-white">{v.city || v.country || "Unknown"}</span>
                      {v.online && <span className="h-2 w-2 rounded-full bg-emerald-500" title="Online now" aria-label="Online now" />}
                    </div>
                    <div className="font-mono text-[11px] text-slate-400">{v.ip || "–"}</div>
                  </td>
                  <td><SourceBadge source={v.source} /></td>
                  <td className="text-end font-semibold tabular-nums text-slate-900 dark:text-white">{fmtNum(v.visits)}</td>
                  <td className="whitespace-nowrap text-xs tabular-nums text-slate-500 dark:text-slate-400">{fmtDateTime(v.firstSeen)}</td>
                  <td className="whitespace-nowrap text-xs tabular-nums" title={fmtDateTime(v.lastSeen)}>{timeAgo(v.lastSeen)}</td>
                  <td className="max-w-[14rem]"><span className="flex items-center gap-1.5">{langOf(v.lastPath) && <LangBadge lang={langOf(v.lastPath)} />}<span className="truncate font-mono text-xs">{v.lastPath}</span></span></td>
                  <td className="whitespace-nowrap text-xs"><span className="flex items-center gap-1.5"><DeviceIcon d={v.device} /><span>{v.os} · {v.browser}</span></span></td>
                  <td><IconButton icon={Trash2} label="Delete visitor" variant="danger-ghost" onClick={(e) => { e.stopPropagation(); deleteIds([v.id]); }} /></td>
                </tr>
              ))}
            </TBody>
          </Table>
        )}
        {data && <Pagination page={data.page} pages={data.pages} onPage={setPage} />}
      </Card>

      <VisitorDrawer id={openId} onClose={() => setOpenId(null)} onDelete={async (id) => { if (await deleteIds([id])) setOpenId(null); }} />
    </div>
  );
}

function VisitorDrawer({ id, onClose, onDelete }: { id: string | null; onClose: () => void; onDelete: (id: string) => void }) {
  const [d, setD] = useState<Detail | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"visits" | "tests">("visits");

  const load = useCallback(async () => {
    if (!id) return;
    setD(null);
    setError("");
    try {
      setD(await api<Detail>(`/api/admin/visitors/${encodeURIComponent(id)}`));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    }
  }, [id]);
  useEffect(() => {
    setTab("visits");
    load();
  }, [load]);

  const v = d?.visitor;
  // Group page views by session for a readable timeline.
  const sessions = useMemo(() => {
    const out: { id: string; start: number; items: Detail["visits"] }[] = [];
    for (const x of d?.visits || []) {
      const last = out[out.length - 1];
      if (last && last.id === x.sessionId) last.items.push(x);
      else out.push({ id: x.sessionId, start: x.ts, items: [x] });
    }
    return out;
  }, [d]);

  return (
    <Drawer
      open={!!id}
      onClose={onClose}
      title={v ? <span className="flex items-center gap-2"><Flag cc={v.countryCode} /> {v.city || v.country || "Unknown location"}{d?.online && <Badge tone="green">Online</Badge>}</span> : "Visitor"}
      subtitle={<span className="font-mono">{id}</span>}
      actions={id ? <IconButton icon={Trash2} label="Delete visitor" variant="danger-ghost" onClick={() => onDelete(id)} /> : null}
    >
      {error ? (
        <div className="p-5"><ErrorBox message={error} onRetry={load} /></div>
      ) : !d ? (
        <div className="space-y-3 p-5">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
      ) : (
        <div className="p-5">
          {v && (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-slate-100 p-4 text-sm dark:border-white/[0.06]">
              <Info label="IP address"><span className="font-mono text-xs">{v.ip || "–"}</span></Info>
              <Info label="Source"><SourceBadge source={v.source} /></Info>
              <Info label="First seen">{fmtDateTime(v.firstSeen)}</Info>
              <Info label="Last seen">{fmtDateTime(v.lastSeen)} <span className="text-xs text-slate-400">({timeAgo(v.lastSeen)})</span></Info>
              <Info label="Visits">{fmtNum(v.visits)}</Info>
              <Info label="Device"><span className="flex items-center gap-1.5 capitalize"><DeviceIcon d={v.device} />{v.device} · {v.os} · {v.browser}</span></Info>
              {d.online && <Info label="Viewing now"><span className="font-mono text-xs">{d.onlinePath}</span></Info>}
              <div className="col-span-2">
                <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">User agent</dt>
                <dd className="mt-0.5 break-all font-mono text-[11px] text-slate-500 dark:text-slate-400">{v.ua || "–"}</dd>
              </div>
            </dl>
          )}

          <div className="mt-5 flex gap-1 border-b border-slate-100 dark:border-white/[0.06]" role="tablist">
            {(["visits", "tests"] as const).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium ${tab === t ? "border-brand-600 text-slate-900 dark:border-brand-400 dark:text-white" : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"}`}
              >
                {t === "visits" ? `Page views (${d.visits.length})` : `Speed tests (${d.tests.length})`}
              </button>
            ))}
          </div>

          {tab === "visits" ? (
            d.visits.length === 0 ? <EmptyState icon={Eye} title="No page views recorded" /> : (
              <ol className="mt-4 space-y-4">
                {sessions.map((s, i) => (
                  <li key={`${s.id}-${i}`}>
                    <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Session · {fmtDateTime(s.start)} · {s.items.length} page{s.items.length === 1 ? "" : "s"}
                    </p>
                    <ol className="relative ms-1.5 space-y-2 border-s border-slate-200 ps-4 dark:border-white/10">
                      {s.items.map((x) => (
                        <li key={x.id} className="relative">
                          <span className="absolute -start-[21px] top-1.5 h-2 w-2 rounded-full bg-brand-500 ring-4 ring-white dark:ring-ink-900" aria-hidden="true" />
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            {langOf(x.path) && <LangBadge lang={langOf(x.path)} />}
                            <span className="break-all font-mono text-xs text-slate-900 dark:text-white">{x.path}</span>
                          </div>
                          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                            <span className="tabular-nums">{new Date(x.ts).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
                            {x.source && x.source !== "Internal" && <span className="flex items-center gap-1"><SourceLogo name={x.source} size={11} />{x.source}</span>}
                            {x.screen && <span>{x.screen}</span>}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </li>
                ))}
              </ol>
            )
          ) : d.tests.length === 0 ? (
            <EmptyState icon={Gauge} title="No speed tests" description="This visitor never pressed GO." />
          ) : (
            <ul className="mt-4 divide-y divide-slate-100 dark:divide-white/[0.06]">
              {d.tests.map((t) => (
                <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge tone={STATUS_TONE[t.status] || "slate"}>{STATUS_LABEL[t.status] || t.status}</Badge>
                      <span className="text-xs capitalize text-slate-500">{t.mode}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400"><Wifi className="h-3 w-3" aria-hidden="true" />{t.ispBrand || "–"} · {t.server || "–"} · {fmtDateTime(t.ts)}</div>
                  </div>
                  <div className="flex gap-4 text-end text-xs tabular-nums">
                    <Num label="Down" value={fmtMbps(t.download)} />
                    <Num label="Up" value={fmtMbps(t.upload)} />
                    <Num label="Ping" value={t.ping == null ? "–" : fmtNum(t.ping)} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Drawer>
  );
}

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-slate-800 dark:text-slate-200">{children}</dd>
    </div>
  );
}
function Num({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase text-slate-400">{label}</div>
      <div className="font-semibold text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}
