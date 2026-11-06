"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, BarChart3, Database, Download, Eye, Gauge, Mail, Megaphone, RefreshCw, RotateCcw, Trash2, Users, Wifi, type LucideIcon } from "lucide-react";
import { Button, Select, Skeleton, api, fmtNum, inputCls, useAdminUI, type Tone } from "@/components/admin/ui";

type Coll = "visits" | "visitors" | "presence" | "tests" | "messages";
type Counts = Record<Coll | "ads", number>;
type Data = { counts: Counts; adStats: { impressions: number; clicks: number } };

const COLLS: { id: Coll; title: string; noun: string; desc: string; field: string; icon: LucideIcon; tone: Tone; ranges: number[] }[] = [
  { id: "visits", title: "Page views", noun: "page views", desc: "One record per page view (path, source, country, device).", field: "view time", icon: Eye, tone: "blue", ranges: [7, 30, 90, 365] },
  { id: "visitors", title: "Visitors", noun: "visitors", desc: "One profile per unique visitor (first & last seen, visit count).", field: "last seen", icon: Users, tone: "violet", ranges: [7, 30, 90, 365] },
  { id: "presence", title: "Online sessions", noun: "sessions", desc: "Live heartbeats. Anything older than a minute is stale and safe to remove.", field: "last heartbeat", icon: Wifi, tone: "green", ranges: [1, 7, 30, 90] },
  { id: "tests", title: "Speed tests", noun: "speed tests", desc: "Each press of GO: results, ISP, server, device.", field: "test time", icon: Gauge, tone: "cyan", ranges: [7, 30, 90, 365] },
  { id: "messages", title: "Messages", noun: "messages", desc: "Contact form submissions.", field: "received date", icon: Mail, tone: "amber", ranges: [7, 30, 90, 365] },
];

const TONE_ICON: Record<string, string> = {
  blue: "bg-brand-50 text-brand-600 ring-brand-100 dark:bg-brand-400/10 dark:text-brand-300 dark:ring-brand-400/20",
  violet: "bg-violet-50 text-violet-600 ring-violet-100 dark:bg-violet-400/10 dark:text-violet-300 dark:ring-violet-400/20",
  green: "bg-emerald-50 text-emerald-600 ring-emerald-100 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20",
  cyan: "bg-cyan-50 text-cyan-600 ring-cyan-100 dark:bg-cyan-400/10 dark:text-cyan-300 dark:ring-cyan-400/20",
  amber: "bg-amber-50 text-amber-600 ring-amber-100 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20",
  rose: "bg-rose-50 text-rose-600 ring-rose-100 dark:bg-rose-400/10 dark:text-rose-300 dark:ring-rose-400/20",
};

const EXPORT_CAP = 5000;
const plural = (n: number, noun: string) => `${fmtNum(n)} ${n === 1 ? noun.replace(/s$/, "") : noun}`;

export default function DataManager() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await api<Data>("/api/admin/data"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load counts");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const total = data ? COLLS.reduce((s, c) => s + (data.counts[c.id] || 0), 0) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm dark:border-white/[0.08] dark:bg-ink-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">
            <Database className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{loading && !data ? <Skeleton className="h-4 w-40" /> : `${fmtNum(total)} records stored`}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Deleting data is permanent and can&apos;t be undone. Export first if you may need it.</p>
          </div>
        </div>
        <Button size="sm" icon={RefreshCw} loading={loading} onClick={load}>
          Refresh counts
        </Button>
      </div>

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300">
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" /> {error}
          </span>
          <Button size="sm" onClick={load}>
            Retry
          </Button>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        {COLLS.map((c) => (
          <CollectionCard key={c.id} meta={c} count={data?.counts[c.id]} loading={loading && !data} onChanged={load} />
        ))}
        <AdStatsCard data={data} loading={loading && !data} onChanged={load} />
      </div>
    </div>
  );
}

/* ------------------------------ collection card ----------------------------- */

function CollectionCard({ meta, count, loading, onChanged }: { meta: (typeof COLLS)[number]; count?: number; loading: boolean; onChanged: () => void }) {
  const { confirm, toast } = useAdminUI();
  const [days, setDays] = useState(String(meta.ranges[1]));
  const [busy, setBusy] = useState<null | "older" | "all">(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [typeOpen, setTypeOpen] = useState(false);
  const Icon = meta.icon;

  const run = async (body: { olderThanDays?: number; all?: true }, total: number, kind: "older" | "all") => {
    setBusy(kind);
    setProgress({ done: 0, total });
    let done = 0;
    try {
      // The API deletes in capped chunks and reports `more` until finished.
      for (let i = 0; i < 500; i++) {
        const r = await api<{ deleted: number; more: boolean }>("/api/admin/data", { method: "DELETE", json: { collection: meta.id, ...body } });
        done += r.deleted;
        setProgress({ done, total: Math.max(total, done) });
        if (!r.more) break;
      }
      toast(done ? `Deleted ${plural(done, meta.noun)}` : `Nothing to delete`, done ? "success" : "info");
    } catch (e) {
      toast(`${e instanceof Error ? e.message : "Delete failed"}${done ? ` (${fmtNum(done)} deleted before the error)` : ""}`, "error");
    } finally {
      setBusy(null);
      setProgress(null);
      onChanged();
    }
  };

  const deleteOlder = async () => {
    const n = Number(days);
    let preview = 0;
    try {
      preview = (await api<{ count: number }>(`/api/admin/data?collection=${meta.id}&olderThanDays=${n}`)).count;
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not count records", "error");
      return;
    }
    if (!preview) {
      toast(`No ${meta.noun} older than ${n} day${n === 1 ? "" : "s"}`, "info");
      return;
    }
    const ok = await confirm({
      title: `Delete ${plural(preview, meta.noun)}?`,
      message: `All ${meta.noun} with a ${meta.field} older than ${n} day${n === 1 ? "" : "s"} will be permanently deleted.`,
      confirmLabel: `Delete ${fmtNum(preview)}`,
    });
    if (ok) run({ olderThanDays: n }, preview, "older");
  };

  const pct = progress && progress.total ? Math.min(100, Math.round((progress.done / progress.total) * 100)) : 0;

  return (
    <section className="flex flex-col rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.02] dark:border-white/[0.08] dark:bg-ink-900">
      <div className="flex items-start gap-4 p-5">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${TONE_ICON[meta.tone]}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">{meta.title}</h3>
            <span className="text-2xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-white">{loading ? <Skeleton className="h-7 w-16" /> : fmtNum(count)}</span>
          </div>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{meta.desc}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-1 gap-y-1">
            <span className="me-1 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-500 dark:bg-white/[0.06] dark:text-slate-400">{meta.id}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">Export</span>
            <ExportLink coll={meta.id} format="csv" disabled={!count} />
            <ExportLink coll={meta.id} format="json" disabled={!count} />
          </div>
        </div>
      </div>

      {progress && (
        <div className="px-5 pb-3" aria-live="polite">
          <div className="mb-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Deleting…</span>
            <span className="tabular-nums">
              {fmtNum(progress.done)} / {fmtNum(progress.total)}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.06]">
            <div className="h-full rounded-full bg-rose-500 transition-[width] duration-300" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-slate-100 px-5 py-3 dark:border-white/[0.06]">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Older than</span>
            <Select
              value={days}
              onChange={setDays}
              options={meta.ranges.map((d) => ({ value: String(d), label: d === 1 ? "1 day" : d === 365 ? "1 year" : `${d} days` }))}
              className="!h-8 !w-auto text-xs"
            />
          </label>
          <Button size="sm" variant="secondary" icon={Trash2} loading={busy === "older"} disabled={!!busy || !count} onClick={deleteOlder}>
            Delete
          </Button>
        </div>
        <div className="ms-auto">
          <Button size="sm" variant="danger-ghost" loading={busy === "all"} disabled={!!busy || !count} onClick={() => setTypeOpen(true)}>
            Delete all
          </Button>
        </div>
      </div>

      {typeOpen && (
        <TypeToConfirm
          title={`Delete all ${meta.noun}?`}
          message={`This permanently deletes ${count != null ? plural(count, meta.noun) : `every ${meta.noun.replace(/s$/, "")}`} from “${meta.id}”. This can't be undone.`}
          onClose={() => setTypeOpen(false)}
          onConfirm={() => {
            setTypeOpen(false);
            run({ all: true }, count || 0, "all");
          }}
        />
      )}
    </section>
  );
}

function ExportLink({ coll, format, disabled }: { coll: Coll; format: "csv" | "json"; disabled?: boolean }) {
  const cls =
    "inline-flex h-6 items-center gap-1 rounded-md px-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-white";
  if (disabled)
    return (
      <span className={`${cls} cursor-not-allowed opacity-50`} aria-disabled="true">
        <Download className="h-3.5 w-3.5" aria-hidden="true" /> {format.toUpperCase()}
      </span>
    );
  return (
    <a href={`/api/admin/data?export=${coll}&format=${format}&limit=${EXPORT_CAP}`} download className={cls} title={`Export the newest ${fmtNum(EXPORT_CAP)} rows as ${format.toUpperCase()}`}>
      <Download className="h-3.5 w-3.5" aria-hidden="true" /> {format.toUpperCase()}
    </a>
  );
}

/* ------------------------------ ad stats card ------------------------------- */

function AdStatsCard({ data, loading, onChanged }: { data: Data | null; loading: boolean; onChanged: () => void }) {
  const { confirm, toast } = useAdminUI();
  const [busy, setBusy] = useState(false);
  const imp = data?.adStats.impressions ?? 0;
  const clicks = data?.adStats.clicks ?? 0;
  const ads = data?.counts.ads ?? 0;

  const reset = async () => {
    const ok = await confirm({
      title: "Reset ad statistics?",
      message: `Impressions, clicks and per-country stats will be set to zero on all ${fmtNum(ads)} ads. The ads themselves are kept.`,
      confirmLabel: "Reset stats",
    });
    if (!ok) return;
    setBusy(true);
    try {
      const r = await api<{ reset: number }>("/api/admin/data", { method: "POST", json: { action: "resetAdStats" } });
      toast(`Reset stats on ${fmtNum(r.reset)} ad${r.reset === 1 ? "" : "s"} (${fmtNum(imp)} impressions, ${fmtNum(clicks)} clicks cleared)`);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Reset failed", "error");
    } finally {
      setBusy(false);
      onChanged();
    }
  };

  return (
    <section className="flex flex-col rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.02] dark:border-white/[0.08] dark:bg-ink-900">
      <div className="flex items-start gap-4 p-5">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${TONE_ICON.rose}`}>
          <Megaphone className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Ad stats</h3>
            <span className="text-2xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-white">{loading ? <Skeleton className="h-7 w-16" /> : fmtNum(imp)}</span>
          </div>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Impression and click counters on your {fmtNum(ads)} ads.</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" /> <span className="tabular-nums font-medium text-slate-700 dark:text-slate-200">{fmtNum(imp)}</span> impressions
            </span>
            <span>
              <span className="tabular-nums font-medium text-slate-700 dark:text-slate-200">{fmtNum(clicks)}</span> clicks
            </span>
            <span>
              CTR <span className="tabular-nums font-medium text-slate-700 dark:text-slate-200">{imp ? ((clicks / imp) * 100).toFixed(2) : "0.00"}%</span>
            </span>
          </div>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 px-5 py-3 dark:border-white/[0.06]">
        <span className="text-xs text-slate-500 dark:text-slate-400">Resets impressions, clicks & countries on every ad.</span>
        <Button size="sm" variant="danger-ghost" icon={RotateCcw} loading={busy} className="shrink-0 whitespace-nowrap" disabled={!ads || (!imp && !clicks)} onClick={reset}>
          Reset stats
        </Button>
      </div>
    </section>
  );
}

/* --------------------------- type-to-confirm dialog -------------------------- */

function TypeToConfirm({ title, message, onClose, onConfirm }: { title: string; message: string; onClose: () => void; onConfirm: () => void }) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const ok = text === "DELETE";

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <form
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="ttc-title"
        className="w-full max-w-md animate-scale-in rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-ink-900"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          if (ok) onConfirm();
        }}
      >
        <div className="flex gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-400/10 dark:text-rose-400">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 id="ttc-title" className="text-base font-semibold text-slate-900 dark:text-white">
              {title}
            </h3>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{message}</p>
          </div>
        </div>
        <label className="mt-5 block text-sm text-slate-700 dark:text-slate-300">
          Type <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] font-semibold text-slate-900 dark:bg-white/10 dark:text-white">DELETE</span> to confirm
          <input ref={inputRef} value={text} onChange={(e) => setText(e.target.value)} autoComplete="off" spellCheck={false} className={`${inputCls} mt-2 font-mono`} placeholder="DELETE" />
        </label>
        <div className="mt-6 flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="danger" icon={Trash2} disabled={!ok}>
            Delete everything
          </Button>
        </div>
      </form>
    </div>
  );
}

