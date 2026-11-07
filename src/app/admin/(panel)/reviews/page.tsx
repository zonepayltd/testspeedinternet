"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BadgeCheck, CheckCircle2, Clock, Download, EyeOff, Flag as FlagIcon, Gauge, MessageSquareText, RefreshCw, Star, ThumbsUp, Trash2, Wrench } from "lucide-react";
import {
  Badge, Button, Card, EmptyState, Flag, IconButton, PageHeader, Pagination, SearchInput, Select, Skeleton, StatCard,
  api, fmtDateTime, fmtNum, timeAgo, useAdminUI,
} from "@/components/admin/ui";
import { Checkbox, Drawer, ErrorBox, downloadUrl } from "@/components/admin/analytics/charts";
import { Avatar, ProviderLogo, Stars, fmtMbps } from "@/components/admin/users/bits";

type Status = "pending" | "published" | "hidden";
type Review = {
  id: string; providerSlug: string; provider: string; providerDomain: string; rating: number; title: string; comment: string; name: string; email: string;
  userId: string | null; countryCode: string; city: string; locale: string; testId: string | null; download: number | null; upload: number | null; ping: number | null;
  status: Status; emailVerified: boolean; helpful: number; reports: number; ip: string; createdAt: number; publishedAt: number;
};
type Provider = { slug: string; name: string; domain: string; total: number; count: number; average: number };
type ListData = {
  reviews: Review[]; total: number; page: number; pages: number; capped: boolean;
  counts: { all: number; published: number; pending: number; hidden: number; reported: number };
  avgRating: number; providers: Provider[];
};

type Tab = "" | Status | "reported";
const TABS: { id: Tab; label: string; key: keyof ListData["counts"] }[] = [
  { id: "", label: "All", key: "all" },
  { id: "published", label: "Published", key: "published" },
  { id: "pending", label: "Awaiting email", key: "pending" },
  { id: "hidden", label: "Hidden", key: "hidden" },
  { id: "reported", label: "Reported", key: "reported" },
];
const STATUS_BADGE: Record<Status, { tone: "green" | "amber" | "slate"; label: string }> = {
  published: { tone: "green", label: "Published" },
  pending: { tone: "amber", label: "Awaiting email" },
  hidden: { tone: "slate", label: "Hidden" },
};

export default function ReviewsPage() {
  const { confirm, toast } = useAdminUI();
  const [qInput, setQInput] = useState("");
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<Tab>("");
  const [provider, setProvider] = useState("");
  const [rating, setRating] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ListData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<string | null>(null);
  const [open, setOpen] = useState<Review | null>(null);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("q")) {
      setQInput(sp.get("q")!);
      setQ(sp.get("q")!);
    }
    const s = sp.get("status") as Tab | null;
    if (s && TABS.some((t) => t.id === s)) setTab(s);
  }, []);
  useEffect(() => {
    const t = setTimeout(() => setQ(qInput.trim()), 300);
    return () => clearTimeout(t);
  }, [qInput]);
  useEffect(() => setPage(1), [q, tab, provider, rating]);

  const query = useMemo(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (tab) p.set("status", tab);
    if (provider) p.set("provider", provider);
    if (rating) p.set("rating", rating);
    return p;
  }, [q, tab, provider, rating]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const p = new URLSearchParams(query);
      p.set("page", String(page));
      p.set("limit", "20");
      const d = await api<ListData>(`/api/admin/reviews?${p}`);
      setData(d);
      setSelected((s) => new Set([...s].filter((id) => d.reviews.some((r) => r.id === id))));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }, [query, page]);
  useEffect(() => {
    load();
  }, [load]);

  const refreshBadges = () => window.dispatchEvent(new Event("admin:refresh-badges"));

  const setStatus = async (ids: string[], action: "publish" | "hide" | "pending" | "clear-reports") => {
    setBusy(action);
    try {
      const r = await api<{ changed: number }>("/api/admin/reviews", { method: "PATCH", json: { ids, action } });
      const verb = { publish: "Published", hide: "Hidden", pending: "Moved to awaiting email", "clear-reports": "Reports cleared on" }[action];
      toast(`${verb} ${fmtNum(r.changed)} review${r.changed === 1 ? "" : "s"}`);
      setSelected(new Set());
      setOpen(null);
      refreshBadges();
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed", "error");
    } finally {
      setBusy(null);
    }
  };

  const remove = async (ids: string[]) => {
    const one = ids.length === 1;
    if (!(await confirm({ title: one ? "Delete this review?" : `Delete ${ids.length} reviews?`, message: "Deleted reviews are removed from the provider’s rating and can’t be recovered.", confirmLabel: "Delete" }))) return;
    setBusy("delete");
    try {
      const r = await api<{ deleted: number }>("/api/admin/reviews", { method: "DELETE", json: { ids } });
      toast(`Deleted ${fmtNum(r.deleted)} review${r.deleted === 1 ? "" : "s"}`);
      setSelected(new Set());
      setOpen(null);
      refreshBadges();
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed", "error");
    } finally {
      setBusy(null);
    }
  };

  const rebuild = async () => {
    setBusy("rebuild");
    try {
      const r = await api<{ providers: number }>("/api/admin/reviews", { method: "POST", json: { action: "rebuild" } });
      toast(`Provider ratings recalculated (${fmtNum(r.providers)} providers)`);
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed", "error");
    } finally {
      setBusy(null);
    }
  };

  const rows = data?.reviews || [];
  const c = data?.counts;
  const allChecked = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const filtersActive = !!(q || tab || provider || rating);
  const topProviders = (data?.providers || []).filter((p) => p.count > 0).slice(0, 8);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Reviews"
        icon={MessageSquareText}
        description="Internet-provider reviews left by visitors — moderate, publish, hide or delete"
        actions={
          <>
            <IconButton icon={RefreshCw} label="Refresh" variant="secondary" onClick={load} className={loading ? "[&_svg]:animate-spin" : ""} />
            <Button icon={Wrench} loading={busy === "rebuild"} onClick={rebuild}>Rebuild ratings</Button>
            <Button icon={Download} onClick={() => downloadUrl(`/api/admin/reviews?${query}&format=csv`)}>Export CSV</Button>
          </>
        }
      />

      {error && <div className="mb-6"><ErrorBox message={error} onRetry={load} /></div>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total reviews" icon={MessageSquareText} tone="blue" loading={!data} value={fmtNum(c?.all)} />
        <StatCard label="Published" icon={CheckCircle2} tone="green" loading={!data} value={fmtNum(c?.published)} hint="visible on the site" />
        <StatCard label="Awaiting email" icon={Clock} tone="amber" loading={!data} value={fmtNum(c?.pending)} hint="not confirmed yet" />
        <StatCard label="Average rating" icon={Star} tone="violet" loading={!data} value={data?.avgRating ? <span className="flex items-center gap-2">{data.avgRating.toFixed(1)}<Stars value={data.avgRating} size={16} /></span> : "–"} hint="published reviews" />
        <StatCard label="Reported" icon={FlagIcon} tone="rose" loading={!data} value={fmtNum(c?.reported)} hint="flagged by visitors" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_300px]">
        <Card title="All reviews" description={data ? `${fmtNum(data.total)} ${filtersActive ? "matching" : "newest first"}${data.capped ? " (latest 5,000)" : ""}` : undefined} bodyClassName="p-0" className="min-w-0">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 dark:border-white/[0.06]">
            <div role="tablist" aria-label="Status" className="-mx-1 flex gap-1 overflow-x-auto px-1">
              {TABS.map((t) => (
                <button
                  key={t.id || "all"}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${tab === t.id ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.06]"}`}
                >
                  {t.label}
                  {c && <span className={`rounded-md px-1.5 text-[11px] tabular-nums ${tab === t.id ? "bg-white/20 dark:bg-slate-900/10" : "bg-slate-100 text-slate-500 dark:bg-white/[0.08] dark:text-slate-400"}`}>{fmtNum(c[t.key])}</span>}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <SearchInput value={qInput} onChange={setQInput} placeholder="Search text, name, email, provider…" className="sm:w-72" />
              <Select value={provider} onChange={setProvider} options={[{ value: "", label: "All providers" }, ...(data?.providers || []).map((p) => ({ value: p.slug, label: `${p.name} (${p.total})` }))]} className="sm:w-52" />
              <Select value={rating} onChange={setRating} options={[{ value: "", label: "Any rating" }, ...[5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} star${n === 1 ? "" : "s"}` }))]} className="sm:w-36" />
              {filtersActive && <Button size="sm" variant="ghost" onClick={() => { setQInput(""); setTab(""); setProvider(""); setRating(""); }}>Clear</Button>}
            </div>
          </div>

          {selected.size > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-100 bg-brand-50/60 px-4 py-2 text-sm dark:border-brand-400/20 dark:bg-brand-400/10">
              <span className="font-medium text-brand-700 dark:text-brand-200">{selected.size} selected</span>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" icon={CheckCircle2} loading={busy === "publish"} onClick={() => setStatus([...selected], "publish")}>Publish</Button>
                <Button size="sm" icon={EyeOff} loading={busy === "hide"} onClick={() => setStatus([...selected], "hide")}>Hide</Button>
                <Button size="sm" variant="danger" icon={Trash2} loading={busy === "delete"} onClick={() => remove([...selected])}>Delete</Button>
              </div>
            </div>
          )}

          {!data && loading ? (
            <div className="space-y-2 p-4">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
          ) : rows.length === 0 ? (
            <EmptyState icon={MessageSquareText} title={filtersActive ? "No reviews match these filters" : "No reviews yet"} description={filtersActive ? "Try a different search or clear the filters." : "Reviews appear here when visitors rate their internet provider after a speed test."} />
          ) : (
            <>
              <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-2 text-xs text-slate-500 dark:border-white/[0.06]">
                <Checkbox label="Select all on this page" checked={allChecked} indeterminate={selected.size > 0} onChange={(v) => setSelected(v ? new Set(rows.map((r) => r.id)) : new Set())} />
                Select all
              </div>
              <ul className={`divide-y divide-slate-100 dark:divide-white/[0.06] ${loading ? "opacity-60 transition-opacity" : ""}`}>
                {rows.map((r) => (
                  <li key={r.id} className={`flex gap-3 px-4 py-4 ${selected.has(r.id) ? "bg-brand-50/40 dark:bg-brand-400/[0.06]" : ""}`}>
                    <div className="pt-0.5">
                      <Checkbox label={`Select review by ${r.name}`} checked={selected.has(r.id)} onChange={(v) => setSelected((x) => { const n = new Set(x); if (v) n.add(r.id); else n.delete(r.id); return n; })} />
                    </div>
                    <button type="button" onClick={() => setOpen(r)} className="min-w-0 flex-1 text-start focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 rounded-lg">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white"><ProviderLogo name={r.provider} domain={r.providerDomain} />{r.provider}</span>
                        <Stars value={r.rating} />
                        <Badge tone={STATUS_BADGE[r.status].tone}>{STATUS_BADGE[r.status].label}</Badge>
                        {r.testId && <Badge tone="blue"><Gauge className="h-3 w-3" aria-hidden="true" />Tested</Badge>}
                        {r.reports > 0 && <Badge tone="rose"><FlagIcon className="h-3 w-3" aria-hidden="true" />{r.reports} report{r.reports === 1 ? "" : "s"}</Badge>}
                      </div>
                      {r.title && <p className="mt-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200">{r.title}</p>}
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{r.comment}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5"><Avatar name={r.name} email={r.email} size={18} /><span className="font-medium text-slate-700 dark:text-slate-300">{r.name || "Anonymous"}</span></span>
                        <span className="flex items-center gap-1">{r.email}{r.emailVerified && <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" aria-label="Email confirmed" />}</span>
                        {r.countryCode && <span className="flex items-center gap-1"><Flag cc={r.countryCode} />{r.city || r.countryCode}</span>}
                        {r.testId && <span className="tabular-nums">↓ {fmtMbps(r.download)} · ↑ {fmtMbps(r.upload)} Mbps · {r.ping == null ? "–" : Math.round(r.ping)} ms</span>}
                        <span title={fmtDateTime(r.createdAt)}>{timeAgo(r.createdAt)}</span>
                      </div>
                    </button>
                    <div className="flex shrink-0 flex-col gap-1 sm:flex-row sm:items-start">
                      {r.status !== "published" ? (
                        <IconButton icon={CheckCircle2} label="Publish" variant="ghost" onClick={() => setStatus([r.id], "publish")} />
                      ) : (
                        <IconButton icon={EyeOff} label="Hide" variant="ghost" onClick={() => setStatus([r.id], "hide")} />
                      )}
                      <IconButton icon={Trash2} label="Delete review" variant="danger-ghost" onClick={() => remove([r.id])} />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
          {data && <Pagination page={data.page} pages={data.pages} onPage={setPage} />}
        </Card>

        <Card title="Provider ratings" description="Public averages (published reviews)" bodyClassName="p-0" className="h-fit">
          {!data ? (
            <div className="space-y-2 p-4">{Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-9 w-full" />)}</div>
          ) : topProviders.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">No published reviews yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {topProviders.map((p) => (
                <li key={p.slug}>
                  <button type="button" onClick={() => setProvider(p.slug === provider ? "" : p.slug)} className={`flex w-full items-center gap-3 px-4 py-2.5 text-start transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.03] ${provider === p.slug ? "bg-brand-50/60 dark:bg-brand-400/10" : ""}`}>
                    <ProviderLogo name={p.name} domain={p.domain} size={22} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-900 dark:text-white">{p.name}</span>
                      <span className="flex items-center gap-1.5 text-[11px] text-slate-500"><Stars value={p.average} size={11} />{p.count} review{p.count === 1 ? "" : "s"}</span>
                    </span>
                    <span className="text-sm font-bold tabular-nums text-slate-900 dark:text-white">{p.average.toFixed(1)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Drawer
        open={!!open}
        onClose={() => setOpen(null)}
        title={open ? <span className="flex items-center gap-2"><ProviderLogo name={open.provider} domain={open.providerDomain} size={24} />{open.provider}</span> : "Review"}
        subtitle={open ? <span className="flex items-center gap-2"><Stars value={open.rating} />{fmtDateTime(open.createdAt)}</span> : undefined}
        actions={open ? <IconButton icon={Trash2} label="Delete review" variant="danger-ghost" onClick={() => remove([open.id])} /> : null}
      >
        {open && (
          <div className="space-y-5 p-5">
            <div className="flex flex-wrap gap-2">
              {open.status !== "published" && <Button size="sm" variant="primary" icon={CheckCircle2} loading={busy === "publish"} onClick={() => setStatus([open.id], "publish")}>Publish</Button>}
              {open.status !== "hidden" && <Button size="sm" icon={EyeOff} loading={busy === "hide"} onClick={() => setStatus([open.id], "hide")}>Hide</Button>}
              {open.reports > 0 && <Button size="sm" icon={FlagIcon} loading={busy === "clear-reports"} onClick={() => setStatus([open.id], "clear-reports")}>Clear reports</Button>}
              <Button size="sm" variant="danger" icon={Trash2} loading={busy === "delete"} onClick={() => remove([open.id])}>Delete</Button>
            </div>
            <div>
              <Badge tone={STATUS_BADGE[open.status].tone}>{STATUS_BADGE[open.status].label}</Badge>
              {open.title && <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">{open.title}</h3>}
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-300">{open.comment}</p>
              <p className="mt-3 flex items-center gap-3 text-xs text-slate-500"><span className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />{open.helpful} helpful</span><span className="flex items-center gap-1"><FlagIcon className="h-3.5 w-3.5" aria-hidden="true" />{open.reports} reports</span></p>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-slate-100 p-4 text-sm dark:border-white/[0.06]">
              <Info label="Reviewer">{open.name || "–"}</Info>
              <Info label="Email"><span className="break-all">{open.email}</span> {open.emailVerified ? <Badge tone="green">Confirmed</Badge> : <Badge tone="amber">Not confirmed</Badge>}</Info>
              <Info label="Account">{open.userId ? <Link href={`/admin/users?u=${encodeURIComponent(open.userId)}`} className="font-medium text-brand-600 hover:underline dark:text-brand-400">Open user →</Link> : "Guest"}</Info>
              <Info label="Location"><span className="flex items-center gap-1.5"><Flag cc={open.countryCode} />{[open.city, open.countryCode].filter(Boolean).join(", ") || "–"}</span></Info>
              <Info label="Speed test">{open.testId ? <span className="tabular-nums">↓ {fmtMbps(open.download)} · ↑ {fmtMbps(open.upload)} Mbps · {open.ping == null ? "–" : Math.round(open.ping)} ms</span> : "No test attached"}</Info>
              <Info label="Language">{open.locale || "–"}</Info>
              <Info label="Published">{open.publishedAt ? fmtDateTime(open.publishedAt) : "–"}</Info>
              <Info label="IP"><span className="font-mono text-xs">{open.ip || "–"}</span></Info>
            </dl>
          </div>
        )}
      </Drawer>
    </div>
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
