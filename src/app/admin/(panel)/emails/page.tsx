"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AtSign, BadgeCheck, CheckCircle2, Copy, Download, Inbox, Megaphone, RefreshCw, Send, Settings, XCircle } from "lucide-react";
import {
  Badge, Button, Card, EmptyState, Flag, IconButton, PageHeader, Pagination, SearchInput, Skeleton, StatCard, TBody, THead, Table,
  api, fmtDateTime, fmtNum, timeAgo, useAdminUI,
} from "@/components/admin/ui";
import { ErrorBox, downloadUrl } from "@/components/admin/analytics/charts";
import { Avatar } from "@/components/admin/users/bits";

type Source = "account" | "review" | "contact";
type Row = {
  email: string; name: string; sources: Source[]; verified: boolean; marketing: boolean; userId: string | null; countryCode: string;
  accounts: number; reviews: number; messages: number; firstSeen: number; lastSeen: number;
};
type ListData = { emails: Row[]; total: number; page: number; pages: number; stats: { total: number; verified: number; marketing: number; account: number; review: number; contact: number } };
type Log = { id: string; to: string; subject: string; ok: boolean; error: string | null; ts: number };

const SOURCE_META: Record<Source, { label: string; tone: "blue" | "violet" | "amber" }> = {
  account: { label: "Account", tone: "blue" },
  review: { label: "Review", tone: "violet" },
  contact: { label: "Contact", tone: "amber" },
};
type Filter = "" | Source | "marketing" | "verified";
const FILTERS: { id: Filter; label: string; key: keyof ListData["stats"] }[] = [
  { id: "", label: "All", key: "total" },
  { id: "account", label: "Accounts", key: "account" },
  { id: "review", label: "Reviewers", key: "review" },
  { id: "contact", label: "Contact form", key: "contact" },
  { id: "verified", label: "Verified", key: "verified" },
  { id: "marketing", label: "News opt-in", key: "marketing" },
];

export default function EmailsPage() {
  const { toast } = useAdminUI();
  const [qInput, setQInput] = useState("");
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ListData | null>(null);
  const [log, setLog] = useState<Log[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setQ(qInput.trim()), 300);
    return () => clearTimeout(t);
  }, [qInput]);
  useEffect(() => setPage(1), [q, filter]);

  const query = useMemo(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (filter === "marketing") p.set("marketing", "1");
    else if (filter === "verified") p.set("verified", "1");
    else if (filter) p.set("source", filter);
    return p;
  }, [q, filter]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const p = new URLSearchParams(query);
      p.set("page", String(page));
      p.set("limit", "50");
      setData(await api<ListData>(`/api/admin/emails?${p}`));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }, [query, page]);
  const loadLog = useCallback(() => {
    api<{ log: Log[] }>("/api/admin/emails?log=1").then((r) => setLog(r.log)).catch(() => setLog([]));
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    loadLog();
  }, [loadLog]);

  const copyAll = async () => {
    setCopying(true);
    try {
      const r = await api<{ emails: string[] }>(`/api/admin/emails?${query}&format=txt`);
      await navigator.clipboard.writeText(r.emails.join(", "));
      toast(`Copied ${fmtNum(r.emails.length)} email address${r.emails.length === 1 ? "" : "es"}`);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Copy failed", "error");
    } finally {
      setCopying(false);
    }
  };

  const s = data?.stats;
  const rows = data?.emails || [];
  const failed = (log || []).filter((l) => !l.ok).length;

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Emails"
        icon={AtSign}
        description="Every email address the site has collected — accounts, reviewers and contact messages"
        actions={
          <>
            <IconButton icon={RefreshCw} label="Refresh" variant="secondary" onClick={() => { load(); loadLog(); }} className={loading ? "[&_svg]:animate-spin" : ""} />
            <Button icon={Copy} loading={copying} onClick={copyAll}>Copy all</Button>
            <Button icon={Download} onClick={() => downloadUrl(`/api/admin/emails?${query}&format=csv`)}>Export CSV</Button>
          </>
        }
      />

      {error && <div className="mb-6"><ErrorBox message={error} onRetry={load} /></div>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Unique emails" icon={AtSign} tone="blue" loading={!data} value={fmtNum(s?.total)} hint="all sources" />
        <StatCard label="Verified" icon={BadgeCheck} tone="green" loading={!data} value={fmtNum(s?.verified)} hint={s?.total ? `${Math.round((s.verified / s.total) * 100)}% confirmed by email` : undefined} />
        <StatCard label="Product news opt-in" icon={Megaphone} tone="violet" loading={!data} value={fmtNum(s?.marketing)} hint="agreed to receive news" />
        <StatCard label="Emails sent" icon={Send} tone={failed ? "rose" : "cyan"} loading={log === null} value={fmtNum(log?.length)} hint={log ? (failed ? `${failed} failed (last 100)` : "last 100, all delivered to the server") : undefined} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card title="Email addresses" description={data ? `${fmtNum(data.total)} ${q || filter ? "matching" : "most recent activity first"}` : undefined} bodyClassName="p-0" className="min-w-0">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 dark:border-white/[0.06]">
            <div role="tablist" aria-label="Filter" className="-mx-1 flex gap-1 overflow-x-auto px-1">
              {FILTERS.map((f) => (
                <button
                  key={f.id || "all"}
                  type="button"
                  role="tab"
                  aria-selected={filter === f.id}
                  onClick={() => setFilter(f.id)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${filter === f.id ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.06]"}`}
                >
                  {f.label}
                  {s && <span className={`rounded-md px-1.5 text-[11px] tabular-nums ${filter === f.id ? "bg-white/20 dark:bg-slate-900/10" : "bg-slate-100 text-slate-500 dark:bg-white/[0.08] dark:text-slate-400"}`}>{fmtNum(s[f.key])}</span>}
                </button>
              ))}
            </div>
            <SearchInput value={qInput} onChange={setQInput} placeholder="Search email or name…" className="sm:w-80" />
          </div>

          {!data && loading ? (
            <div className="space-y-2 p-4">{Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="h-11 w-full" />)}</div>
          ) : rows.length === 0 ? (
            <EmptyState icon={Inbox} title={q || filter ? "No emails match" : "No emails yet"} description="Addresses appear here when visitors sign up, review a provider or use the contact form." />
          ) : (
            <Table className={loading ? "opacity-60 transition-opacity" : ""}>
              <THead>
                <tr>
                  <th>Email</th>
                  <th>Sources</th>
                  <th>Status</th>
                  <th>Country</th>
                  <th>First seen</th>
                  <th>Last activity</th>
                </tr>
              </THead>
              <TBody>
                {rows.map((r) => (
                  <tr key={r.email}>
                    <td>
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar name={r.name} email={r.email} size={28} />
                        <div className="min-w-0">
                          <a href={`mailto:${r.email}`} className="block truncate font-medium text-slate-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-300">{r.email}</a>
                          <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {r.name || "—"}
                            {r.userId && <> · <Link href={`/admin/users?u=${encodeURIComponent(r.userId)}`} className="text-brand-600 hover:underline dark:text-brand-400">account</Link></>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {r.sources.map((src) => (
                          <Badge key={src} tone={SOURCE_META[src].tone}>
                            {SOURCE_META[src].label}
                            {src === "review" && r.reviews > 1 ? ` ×${r.reviews}` : src === "contact" && r.messages > 1 ? ` ×${r.messages}` : ""}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {r.verified ? <Badge tone="green">Verified</Badge> : <Badge tone="slate">Unverified</Badge>}
                        {r.marketing && <Badge tone="violet">News</Badge>}
                      </div>
                    </td>
                    <td>{r.countryCode ? <Flag cc={r.countryCode} /> : "–"}</td>
                    <td className="whitespace-nowrap text-xs tabular-nums text-slate-500 dark:text-slate-400">{r.firstSeen ? new Date(r.firstSeen).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "–"}</td>
                    <td className="whitespace-nowrap text-xs tabular-nums" title={r.lastSeen ? fmtDateTime(r.lastSeen) : undefined}>{r.lastSeen ? timeAgo(r.lastSeen) : "–"}</td>
                  </tr>
                ))}
              </TBody>
            </Table>
          )}
          {data && <Pagination page={data.page} pages={data.pages} onPage={setPage} />}
        </Card>

        <Card
          title="Sent emails"
          description="Confirmations, password resets and tests (last 100)"
          bodyClassName="p-0"
          className="h-fit"
          actions={
            <Link href="/admin/settings#email" className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline dark:text-brand-400">
              <Settings className="h-3.5 w-3.5" aria-hidden="true" /> Email settings
            </Link>
          }
        >
          {log === null ? (
            <div className="space-y-2 p-4">{Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : log.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">No emails sent yet.</p>
          ) : (
            <ul className="max-h-[640px] divide-y divide-slate-100 overflow-y-auto dark:divide-white/[0.06]">
              {log.map((l) => (
                <li key={l.id} className="flex gap-2.5 px-4 py-2.5">
                  {l.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-label="Sent" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" aria-label="Failed" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">{l.subject}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{l.to} · <span title={fmtDateTime(l.ts)}>{timeAgo(l.ts)}</span></p>
                    {l.error && <p className="mt-0.5 line-clamp-2 text-[11px] text-rose-600 dark:text-rose-400">{l.error}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
