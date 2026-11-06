"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpFromLine,
  Eye,
  Gauge,
  CheckCircle2,
  LayoutDashboard,
  Mail,
  Radio,
  RefreshCw,
  Search,
  Users,
  Activity,
  AlertTriangle,
  Globe2,
  FileText,
  MonitorSmartphone,
  Share2,
  Timer,
} from "lucide-react";
import { BarList, Badge, Button, Card, EmptyState, Flag, PageHeader, Segmented, Skeleton, StatCard, Table, TBody, THead, api, fmtNum, timeAgo, type Tone } from "@/components/admin/ui";
import { DeviceIcon, LiveDot, PathLabel, RANGE_OPTIONS, SplitBar, cap, secondsAgo, useNow, usePoll, type OnlineUser, type RangeKey } from "./bits";
import { Sparkline, TestsChart, TrafficChart, usePalette, type SeriesPoint } from "./charts";

type Named = { name: string; count: number };
type Stats = {
  range: RangeKey;
  bucket: "hour" | "day";
  truncated: boolean;
  totals: { visitors: number; pageViews: number; searchVisits: number; testsStarted: number; testsCompleted: number; completionRate: number | null };
  prev: Stats["totals"];
  change: { visitors: number; pageViews: number; searchVisits: number; testsStarted: number; testsCompleted: number };
  series: SeriesPoint[];
  sources: (Named & { search: boolean })[];
  searchEngines: Named[];
  pages: Named[];
  countries: { cc: string; name: string; count: number }[];
  devices: Named[];
  browsers: Named[];
  os: Named[];
  tests: { started: number; completed: number; errors: number; cancelled: number; completionRate: number | null; download: number | null; upload: number | null; ping: number | null; jitter: number | null; prev: { download: number | null; upload: number | null; ping: number | null } };
  unread: number;
  recentMessages: { id: string; name: string; email: string; subject: string; message: string; read: boolean; ts: number }[];
  recentTests: { id: string; status: string; mode: string; ts: number; countryCode: string; city: string; isp: string; device: string; download: number | null; upload: number | null; ping: number | null }[];
  online: { count: number; list: OnlineUser[] };
};

const RANGE_HINT: Record<RangeKey, string> = { today: "vs yesterday", "7d": "vs previous 7 days", "30d": "vs previous 30 days", "90d": "vs previous 90 days" };
const RANGE_KEY = "tsi_admin_range";

const pctChange = (a: number | null, b: number | null) => (a == null || b == null || !b ? null : ((a - b) / b) * 100);

const STATUS_TONE: Record<string, Tone> = { completed: "green", started: "blue", error: "rose", cancelled: "slate" };

function KpiLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={`group block min-w-0 ${className} rounded-2xl transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 [&>div]:h-full [&>div]:transition-shadow hover:[&>div]:shadow-md hover:[&>div]:shadow-slate-900/[0.04]`}>
      {children}
    </Link>
  );
}

function ViewAll({ href, label = "View all" }: { href: string; label?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
      {label}
      <ArrowRight className="h-3 w-3" aria-hidden="true" />
    </Link>
  );
}

function ListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-8" />
      ))}
    </div>
  );
}

function initialRange(): RangeKey {
  try {
    const v = localStorage.getItem(RANGE_KEY) as RangeKey | null;
    if (v && RANGE_OPTIONS.some((o) => o.value === v)) return v;
  } catch {}
  return "7d";
}

export default function Overview() {
  const [rangeSel, setRangeSel] = useState<RangeKey | null>(null);
  const range: RangeKey = rangeSel ?? "7d";
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [online, setOnline] = useState<{ count: number; list: OnlineUser[] } | null>(null);
  const now = useNow(5000);
  const c = usePalette();

  // Remember the chosen range per browser.
  useEffect(() => setRangeSel(initialRange()), []);
  const changeRange = (r: RangeKey) => {
    if (r === range) return;
    setLoading(true);
    setRangeSel(r);
    try {
      localStorage.setItem(RANGE_KEY, r);
    } catch {}
  };

  const loadStats = useCallback(
    async (silent = false) => {
      if (!rangeSel) return;
      if (!silent) setLoading(true);
      try {
        const d = await api<Stats>(`/api/admin/stats?range=${rangeSel}&tz=${new Date().getTimezoneOffset()}`);
        setStats(d);
        setError("");
        setOnline((o) => o ?? d.online);
      } catch (e) {
        if (!silent) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    },
    [rangeSel],
  );

  // Stats: load on range change, then quietly every 60 s.
  usePoll(() => loadStats(!!stats), 60_000, [rangeSel]);

  // Online now: every 15 s.
  usePoll(async () => {
    try {
      const d = await api<{ count: number; online: OnlineUser[] }>("/api/admin/online");
      setOnline({ count: d.count, list: d.online.slice(0, 12) });
    } catch {}
  }, 15_000);

  const s = stats;
  const busy = loading && !s;
  const hourly = s?.bucket === "hour";
  const hint = RANGE_HINT[range];

  if (error && !s)
    return (
      <div>
        <PageHeader title="Overview" icon={LayoutDashboard} />
        <Card>
          <EmptyState icon={AlertTriangle} title="Couldn’t load the dashboard" description={error} action={<Button icon={RefreshCw} onClick={() => loadStats()}>Retry</Button>} />
        </Card>
      </div>
    );

  const searchShare = s && s.sources.length ? s.sources.filter((x) => x.search).reduce((a, b) => a + b.count, 0) : 0;
  const totalLandings = s ? s.sources.reduce((a, b) => a + b.count, 0) : 0;
  const direct = s?.sources.find((x) => x.name === "Direct")?.count || 0;
  const devices = s ? ["mobile", "desktop", "tablet", "bot"].map((d) => ({ label: cap(d), value: s.devices.find((x) => x.name === d)?.count || 0 })).filter((d) => d.value > 0) : [];

  return (
    <div className={loading && s ? "opacity-70 transition-opacity" : "transition-opacity"}>
      <PageHeader
        title="Overview"
        description="Traffic, speed tests and messages at a glance."
        icon={LayoutDashboard}
        actions={
          <>
            <Segmented value={range} onChange={changeRange} options={RANGE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))} />
            <Button size="sm" variant="ghost" icon={RefreshCw} onClick={() => loadStats()} aria-label="Refresh" loading={loading && !!s}>
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </>
        }
      />

      {s?.truncated && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200">
          Large period — figures are based on the most recent 20,000 page views.
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <KpiLink href="/admin/online">
          <StatCard label="Online now" value={online ? fmtNum(online.count) : "–"} icon={Radio} tone="green" live hint="Active in the last 60 s" loading={!online} />
        </KpiLink>
        <KpiLink href="/admin/visitors">
          <StatCard label="Visitors" value={fmtNum(s?.totals.visitors)} icon={Users} tone="blue" delta={s?.change.visitors} hint={hint} loading={busy}>
            {s && <Sparkline data={s.series} dataKey="visitors" color={c.s2} />}
          </StatCard>
        </KpiLink>
        <KpiLink href="/admin/analytics">
          <StatCard label="Page views" value={fmtNum(s?.totals.pageViews)} icon={Eye} tone="violet" delta={s?.change.pageViews} hint={hint} loading={busy}>
            {s && <Sparkline data={s.series} dataKey="pageViews" color={c.s1} />}
          </StatCard>
        </KpiLink>
        <KpiLink href="/admin/analytics">
          <StatCard label="From search engines" value={fmtNum(s?.totals.searchVisits)} icon={Search} tone="amber" delta={s?.change.searchVisits} hint={s && totalLandings ? `${Math.round((searchShare / totalLandings) * 100)}% of all entries` : hint} loading={busy} />
        </KpiLink>
        <KpiLink href="/admin/tests">
          <StatCard label="Speed tests started" value={fmtNum(s?.totals.testsStarted)} icon={Gauge} tone="cyan" delta={s?.change.testsStarted} hint={hint} loading={busy}>
            {s && <Sparkline data={s.series} dataKey="started" color={c.s1} />}
          </StatCard>
        </KpiLink>
        <KpiLink href="/admin/tests">
          <StatCard
            label="Tests completed"
            value={fmtNum(s?.totals.testsCompleted)}
            icon={CheckCircle2}
            tone="green"
            delta={s?.change.testsCompleted}
            hint={s?.totals.completionRate != null ? `${s.totals.completionRate.toFixed(1)}% completion rate` : hint}
            loading={busy}
          >
            {s && s.totals.completionRate != null && (
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.06]" aria-hidden="true">
                <div className="h-full rounded-full" style={{ width: `${s.totals.completionRate}%`, background: c.s3 }} />
              </div>
            )}
          </StatCard>
        </KpiLink>
        <KpiLink href="/admin/messages">
          <StatCard label="Unread messages" value={fmtNum(s?.unread)} icon={Mail} tone={s && s.unread > 0 ? "rose" : "slate"} hint={s && s.unread > 0 ? "Waiting for a reply" : "Inbox zero"} loading={busy} />
        </KpiLink>
        <KpiLink href="/admin/tests">
          <div className="relative h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02] dark:border-white/[0.08] dark:bg-ink-900">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Average results</p>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200 dark:bg-white/[0.06] dark:text-slate-300 dark:ring-white/10">
                <Activity className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
            </div>
            {busy ? (
              <Skeleton className="mt-3 h-14" />
            ) : (
              <dl className="mt-2 grid grid-cols-3 gap-2">
                {[
                  { k: "Download", v: s?.tests.download, p: s?.tests.prev.download, u: "Mbps", icon: ArrowDownToLine, up: true },
                  { k: "Upload", v: s?.tests.upload, p: s?.tests.prev.upload, u: "Mbps", icon: ArrowUpFromLine, up: true },
                  { k: "Ping", v: s?.tests.ping, p: s?.tests.prev.ping, u: "ms", icon: Timer, up: false },
                ].map((m) => {
                  const d = pctChange(m.v ?? null, m.p ?? null);
                  const good = d != null && (m.up ? d >= 0 : d <= 0);
                  return (
                    <div key={m.k} className="min-w-0">
                      <dt className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                        <m.icon className="h-3 w-3" aria-hidden="true" />
                        {m.k}
                      </dt>
                      <dd className="mt-0.5 truncate text-lg font-bold tabular-nums tracking-tight text-slate-900 dark:text-white">
                        {fmtNum(m.v, m.u === "ms" || (m.v ?? 0) >= 100 ? 0 : 1)}
                        <span className="ms-0.5 text-[11px] font-medium text-slate-400">{m.u}</span>
                      </dd>
                      {d != null && (
                        <dd className={`text-[11px] font-semibold tabular-nums ${good ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                          {d >= 0 ? "▲" : "▼"} {Math.abs(d).toFixed(1)}%
                        </dd>
                      )}
                    </div>
                  );
                })}
              </dl>
            )}
            <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">From completed tests</p>
          </div>
        </KpiLink>
      </div>

      {/* Traffic + Live */}
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2" title="Traffic" description={hourly ? "Page views and unique visitors per hour" : "Page views and unique visitors per day"} icon={Activity} actions={<ViewAll href="/admin/analytics" label="Analytics" />}>
          {busy ? <Skeleton className="h-[300px]" /> : <TrafficChart data={s!.series} hourly={hourly} />}
        </Card>
        <Card
          title={
            <span className="flex items-center gap-2">
              <LiveDot /> Live — {online ? online.count : "…"} online
            </span>
          }
          description="Refreshes every 15 seconds"
          actions={<ViewAll href="/admin/online" />}
          bodyClassName="p-2"
        >
          {!online ? (
            <div className="p-3">
              <ListSkeleton />
            </div>
          ) : online.list.length === 0 ? (
            <EmptyState icon={Radio} title="Nobody online right now" description="Visitors appear here within 30 seconds of opening a page." />
          ) : (
            <ul className="max-h-[332px] divide-y divide-slate-100 overflow-y-auto dark:divide-white/[0.05]">
              {online.list.map((u) => (
                <li key={u.id} className="flex items-center gap-3 px-3 py-2.5">
                  <Flag cc={u.countryCode} />
                  <div className="min-w-0 flex-1">
                    <PathLabel path={u.path} locale={u.locale} />
                    <p className="mt-0.5 truncate text-xs text-slate-400">
                      {u.city || "Unknown city"} · {u.browser || "–"} on {u.os || "–"}
                    </p>
                  </div>
                  <DeviceIcon device={u.device} />
                  <span className="w-14 shrink-0 text-end text-xs tabular-nums text-slate-400">{secondsAgo(u.lastSeen, now)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Tests + Sources */}
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card
          className="xl:col-span-2"
          title="Speed tests"
          description={s ? `${fmtNum(s.tests.started)} started · ${fmtNum(s.tests.completed)} completed · ${fmtNum(s.tests.errors)} errors · ${fmtNum(s.tests.cancelled)} cancelled` : "Started vs completed"}
          icon={Gauge}
          actions={<ViewAll href="/admin/tests" />}
        >
          {busy ? <Skeleton className="h-[330px]" /> : <TestsChart data={s!.series} hourly={hourly} height={300} />}
        </Card>
        <Card title="Traffic sources" description="Where visitors enter from" icon={Share2} actions={<ViewAll href="/admin/analytics" />}>
          {busy ? (
            <ListSkeleton />
          ) : (
            <>
              <SplitBar
                colors={[c.s1, c.s2, c.s3]}
                items={[
                  { label: "Search engines", value: searchShare },
                  { label: "Direct", value: direct },
                  { label: "Referral & social", value: Math.max(0, totalLandings - searchShare - direct) },
                ]}
              />
              <div className="mt-4">
                <BarList
                  items={s!.sources.slice(0, 7).map((x) => ({
                    key: x.name,
                    value: x.count,
                    label: (
                      <span className="flex items-center gap-2">
                        {x.name}
                        {x.search && (
                          <Badge tone="amber" className="!px-1.5 !py-0 text-[10px]">
                            <Search className="h-2.5 w-2.5" aria-hidden="true" />
                            Search
                          </Badge>
                        )}
                      </span>
                    ),
                  }))}
                />
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Pages / Countries / Devices */}
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card title="Top pages" description="By page views" icon={FileText} actions={<ViewAll href="/admin/analytics" />}>
          {busy ? <ListSkeleton /> : <BarList items={s!.pages.slice(0, 8).map((p) => ({ key: p.name, value: p.count, label: <PathLabel path={p.name} /> }))} />}
        </Card>
        <Card title="Top countries" description="By unique visitors" icon={Globe2} actions={<ViewAll href="/admin/visitors" />}>
          {busy ? (
            <ListSkeleton />
          ) : (
            <BarList
              items={s!.countries.slice(0, 8).map((x) => ({
                key: x.cc,
                value: x.count,
                label: (
                  <span className="flex items-center gap-2">
                    <Flag cc={x.cc} />
                    {x.name}
                  </span>
                ),
              }))}
            />
          )}
        </Card>
        <Card title="Devices" description="Unique visitors by device, browser and OS" icon={MonitorSmartphone} className="md:col-span-2 xl:col-span-1">
          {busy ? (
            <ListSkeleton />
          ) : (
            <>
              <SplitBar colors={[c.s1, c.s2, c.s3, c.s4]} items={devices} />
              <div className="mt-5 grid grid-cols-2 gap-4">
                {[
                  { title: "Browsers", items: s!.browsers },
                  { title: "Operating systems", items: s!.os },
                ].map((g) => (
                  <div key={g.title}>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{g.title}</p>
                    <ul className="space-y-1.5 text-sm">
                      {g.items.slice(0, 5).map((b) => (
                        <li key={b.name} className="flex items-center justify-between gap-2">
                          <span className="truncate text-slate-600 dark:text-slate-300">{b.name}</span>
                          <span className="font-semibold tabular-nums text-slate-900 dark:text-white">{fmtNum(b.count)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Recent tests + messages */}
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2" title="Recent speed tests" icon={Gauge} actions={<ViewAll href="/admin/tests" />} bodyClassName="">
          {busy ? (
            <div className="p-5">
              <ListSkeleton rows={5} />
            </div>
          ) : s!.recentTests.length === 0 ? (
            <EmptyState icon={Gauge} title="No speed tests yet" description="Tests appear here as soon as a visitor presses GO." />
          ) : (
            <Table>
              <THead>
                <tr>
                  <th>When</th>
                  <th>Location</th>
                  <th>Provider</th>
                  <th>Status</th>
                  <th className="!text-end">Download</th>
                  <th className="!text-end">Upload</th>
                  <th className="!text-end">Ping</th>
                </tr>
              </THead>
              <TBody>
                {s!.recentTests.map((t) => (
                  <tr key={t.id}>
                    <td className="whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">{timeAgo(t.ts)}</td>
                    <td className="whitespace-nowrap">
                      <span className="flex items-center gap-2">
                        <Flag cc={t.countryCode} />
                        <span className="max-w-[140px] truncate">{t.city || t.countryCode || "–"}</span>
                        {t.device && <DeviceIcon device={t.device} className="h-3.5 w-3.5" />}
                      </span>
                    </td>
                    <td className="max-w-[160px] truncate whitespace-nowrap">{t.isp || "–"}</td>
                    <td>
                      <Badge tone={STATUS_TONE[t.status] || "slate"}>{cap(t.status)}</Badge>
                      {t.mode !== "full" && <span className="ms-1.5 text-xs text-slate-400">{t.mode}</span>}
                    </td>
                    <td className="whitespace-nowrap text-end tabular-nums">{t.download != null ? <><b className="font-semibold text-slate-900 dark:text-white">{fmtNum(t.download, 1)}</b> <span className="text-xs text-slate-400">Mbps</span></> : "–"}</td>
                    <td className="whitespace-nowrap text-end tabular-nums">{t.upload != null ? <><b className="font-semibold text-slate-900 dark:text-white">{fmtNum(t.upload, 1)}</b> <span className="text-xs text-slate-400">Mbps</span></> : "–"}</td>
                    <td className="whitespace-nowrap text-end tabular-nums">{t.ping != null ? <><b className="font-semibold text-slate-900 dark:text-white">{fmtNum(t.ping)}</b> <span className="text-xs text-slate-400">ms</span></> : "–"}</td>
                  </tr>
                ))}
              </TBody>
            </Table>
          )}
        </Card>
        <Card title="Recent messages" description={s ? `${fmtNum(s.unread)} unread` : undefined} icon={Mail} actions={<ViewAll href="/admin/messages" />} bodyClassName="p-2">
          {busy ? (
            <div className="p-3">
              <ListSkeleton rows={5} />
            </div>
          ) : s!.recentMessages.length === 0 ? (
            <EmptyState icon={Mail} title="No messages yet" description="Contact-form messages will show up here." />
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-white/[0.05]">
              {s!.recentMessages.map((m) => (
                <li key={m.id}>
                  <Link href={`/admin/messages?id=${encodeURIComponent(m.id)}`} className="flex gap-3 rounded-lg px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-white/[0.03]">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold uppercase text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">{(m.name || m.email || "?").slice(0, 1)}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`truncate text-sm ${m.read ? "text-slate-700 dark:text-slate-300" : "font-semibold text-slate-900 dark:text-white"}`}>{m.name || m.email}</p>
                        {!m.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-label="Unread" />}
                        <span className="ms-auto shrink-0 text-xs tabular-nums text-slate-400">{timeAgo(m.ts)}</span>
                      </div>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {m.subject && <span className="font-medium text-slate-600 dark:text-slate-300">{m.subject} — </span>}
                        {m.message}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
