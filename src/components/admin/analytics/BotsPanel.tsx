"use client";

// "Bots" tab on the Visitors page: crawlers (Googlebot, Bingbot, AdSense…),
// logged by the middleware and kept apart from real visitors.

import { useCallback, useEffect, useState } from "react";
import { Bot, CheckCircle2, FileText, RefreshCw, Search, Sparkles, Trash2 } from "lucide-react";
import { Badge, Card, EmptyState, Flag, IconButton, Segmented, Skeleton, StatCard, TBody, THead, Table, api, fmtDateTime, fmtNum, timeAgo, useAdminUI, type Tone } from "@/components/admin/ui";
import { ErrorBox, SourceLogo, TrendChart, fmtBucket } from "@/components/admin/analytics/charts";
import { BOT_KIND_LABEL, type BotKind } from "@/lib/bots";

type BotRow = {
  name: string; kind: BotKind; domain: string; hits: number; pages: number; lastSeen: number; lastPath: string;
  robotsAt: number; sitemapAt: number; adsTxtAt: number; countries: Record<string, number>;
};
export type BotsData = {
  total: number; capped: boolean;
  byKind: { kind: BotKind; hits: number }[];
  bots: BotRow[];
  topPaths: { path: string; hits: number }[];
  recent: { id: string; name: string; kind: BotKind; domain: string; path: string; ip: string; countryCode: string; ts: number }[];
  daily: { t: number; hits: number }[];
};

const KIND_TONE: Record<BotKind, Tone> = { search: "blue", ads: "green", ai: "cyan", seo: "violet", social: "amber", monitor: "slate", other: "slate" };
const RANGES = [
  { value: "today", label: "Today" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "All (60 days)" },
] as const;
type Range = (typeof RANGES)[number]["value"];

export const botsUrl = (range: string) => `/api/admin/bots?range=${range}&tz=${new Date().getTimezoneOffset()}`;

function KindBadge({ kind }: { kind: BotKind }) {
  return <Badge tone={KIND_TONE[kind] || "slate"}>{BOT_KIND_LABEL[kind] || kind}</Badge>;
}

function FileCheck({ label, at }: { label: string; at: number }) {
  return at ? (
    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400" title={`${label} read ${fmtDateTime(at)}`}>
      <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> {label}
    </span>
  ) : null;
}

export default function BotsPanel() {
  const { confirm, toast } = useAdminUI();
  const [range, setRange] = useState<Range>("7d");
  const [d, setD] = useState<BotsData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [kind, setKind] = useState<BotKind | "">("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setD(await api<BotsData>(botsUrl(range)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }, [range]);
  useEffect(() => {
    load();
  }, [load]);

  const clearAll = async () => {
    if (!(await confirm({ title: "Delete all bot visits?", message: "Every logged crawler hit is permanently removed. Real visitors are not affected.", confirmLabel: "Delete bot visits" }))) return;
    try {
      const r = await api<{ deleted: number }>("/api/admin/bots", { method: "DELETE", json: { all: true } });
      toast(`Deleted ${fmtNum(r.deleted)} bot visits`);
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed", "error");
    }
  };

  const kindHits = (k: BotKind) => d?.byKind.find((x) => x.kind === k)?.hits || 0;
  const google = d?.bots.find((b) => b.name === "Googlebot");
  const bing = d?.bots.find((b) => b.name === "Bingbot");
  const adsense = d?.bots.find((b) => b.name === "AdSense crawler");
  const rows = (d?.bots || []).filter((b) => !kind || b.kind === kind);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Search-engine crawlers and other bots. They are <strong className="font-semibold text-slate-700 dark:text-slate-200">not counted as visitors</strong>.
        </p>
        <div className="flex items-center gap-2">
          <Segmented value={range} onChange={setRange} options={RANGES.map((r) => ({ ...r }))} />
          <IconButton icon={RefreshCw} label="Refresh" variant="secondary" onClick={load} className={loading ? "[&_svg]:animate-spin" : ""} />
          <IconButton icon={Trash2} label="Delete all bot visits" variant="danger-ghost" onClick={clearAll} />
        </div>
      </div>

      {error && <ErrorBox message={error} onRetry={load} />}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Bot visits" icon={Bot} tone="slate" loading={!d} value={fmtNum(d?.total)} hint={d ? `${fmtNum(d.bots.length)} different bots` : undefined} />
        <StatCard label="Googlebot" icon={Search} tone="blue" loading={!d} value={fmtNum(google?.hits || 0)} hint={google ? `last ${timeAgo(google.lastSeen)}` : "not seen in this range"} />
        <StatCard label="Bingbot" icon={Search} tone="cyan" loading={!d} value={fmtNum(bing?.hits || 0)} hint={bing ? `last ${timeAgo(bing.lastSeen)}` : "not seen in this range"} />
        <StatCard label="AdSense crawler" icon={Sparkles} tone="green" loading={!d} value={fmtNum(adsense?.hits || 0)} hint={adsense ? `last ${timeAgo(adsense.lastSeen)}` : "not seen in this range"} />
      </div>

      {d && d.daily.length > 1 && (
        <Card title="Bot visits per day" bodyClassName="p-4">
          <TrendChart data={d.daily} series={[{ key: "hits", label: "Bot visits", color: "#64748b", fill: true }]} xFormat={(v) => fmtBucket(v, "day")} height={200} />
        </Card>
      )}

      <Card
        title="Bots"
        description="Which crawlers visited, how often, and whether they read robots.txt, the sitemap and ads.txt"
        bodyClassName="p-0"
        actions={
          d && d.byKind.length > 1 ? (
            <div className="flex flex-wrap gap-1">
              <button type="button" onClick={() => setKind("")} className={`rounded-full px-2.5 py-1 text-xs font-medium ${!kind ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"}`}>
                All
              </button>
              {d.byKind.map((k) => (
                <button key={k.kind} type="button" onClick={() => setKind(k.kind)} className={`rounded-full px-2.5 py-1 text-xs font-medium ${kind === k.kind ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"}`}>
                  {BOT_KIND_LABEL[k.kind]} ({fmtNum(kindHits(k.kind))})
                </button>
              ))}
            </div>
          ) : null
        }
      >
        {!d && loading ? (
          <div className="space-y-2 p-4">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
        ) : rows.length === 0 ? (
          <EmptyState icon={Bot} title="No bot visits yet" description="Crawlers are logged from now on. Googlebot and Bingbot usually show up within a day or two." />
        ) : (
          <Table className={loading ? "opacity-60 transition-opacity" : ""}>
            <THead>
              <tr>
                <th>Bot</th>
                <th>Type</th>
                <th className="!text-end">Visits</th>
                <th className="!text-end">Pages</th>
                <th>Read</th>
                <th>Last seen</th>
                <th>Last URL</th>
              </tr>
            </THead>
            <TBody>
              {rows.map((b) => (
                <tr key={b.name}>
                  <td className="whitespace-nowrap">
                    <span className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                      <SourceLogo name={b.name} domain={b.domain} size={18} /> {b.name}
                    </span>
                  </td>
                  <td><KindBadge kind={b.kind} /></td>
                  <td className="text-end font-semibold tabular-nums text-slate-900 dark:text-white">{fmtNum(b.hits)}</td>
                  <td className="text-end tabular-nums">{fmtNum(b.pages)}</td>
                  <td className="whitespace-nowrap text-xs">
                    <span className="flex flex-wrap gap-x-2 gap-y-0.5">
                      <FileCheck label="robots.txt" at={b.robotsAt} />
                      <FileCheck label="sitemap" at={b.sitemapAt} />
                      <FileCheck label="ads.txt" at={b.adsTxtAt} />
                      {!b.robotsAt && !b.sitemapAt && !b.adsTxtAt && <span className="text-slate-400">–</span>}
                    </span>
                  </td>
                  <td className="whitespace-nowrap text-xs tabular-nums" title={fmtDateTime(b.lastSeen)}>{timeAgo(b.lastSeen)}</td>
                  <td className="max-w-[16rem]"><span className="block truncate font-mono text-xs">{b.lastPath}</span></td>
                </tr>
              ))}
            </TBody>
          </Table>
        )}
      </Card>

      {d && d.recent.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card title="Latest crawls" className="lg:col-span-2" bodyClassName="p-0">
            <ul className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {d.recent.slice(0, 12).map((r) => (
                <li key={r.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                  <SourceLogo name={r.name} domain={r.domain} size={16} />
                  <span className="w-40 shrink-0 truncate font-medium text-slate-800 dark:text-slate-200">{r.name}</span>
                  <span className="min-w-0 flex-1 truncate font-mono text-xs text-slate-500 dark:text-slate-400">{r.path}</span>
                  {r.countryCode && <Flag cc={r.countryCode} />}
                  <span className="shrink-0 text-xs tabular-nums text-slate-400" title={fmtDateTime(r.ts)}>{timeAgo(r.ts)}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Most crawled pages" icon={FileText} bodyClassName="p-0">
            <ul className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {d.topPaths.map((p) => (
                <li key={p.path} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <span className="truncate font-mono text-xs text-slate-700 dark:text-slate-300">{p.path}</span>
                  <span className="text-sm font-semibold tabular-nums text-slate-900 dark:text-white">{fmtNum(p.hits)}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
      {d?.capped && <p className="text-xs text-slate-400">Showing the latest 10,000 bot visits in this range.</p>}
    </div>
  );
}
