"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, BarChart3, Copy, Eye, LayoutGrid, List, Megaphone, MousePointerClick, Pencil, Percent, Plus, RefreshCw, Trash2, Zap } from "lucide-react";
import {
  Button,
  Card,
  EmptyState,
  IconButton,
  PageHeader,
  SearchInput,
  Select,
  Skeleton,
  StatCard,
  Table,
  TBody,
  THead,
  Toggle,
  Segmented,
  Flag,
  api,
  fmtNum,
  fmtCompact,
  timeAgo,
  useAdminUI,
} from "@/components/admin/ui";
import { AD_TYPES, PLACEMENTS, SCOPES, adStatus, labelOf, type Ad, type AdStatus } from "@/lib/adsModel";
import { LOCALE_META } from "@/i18n/config";
import { StatusBadge, TypeBadge, TYPE_META, ctrOf, fmtPct } from "@/components/admin/ads/shared";

type View = "list" | "grid";

function Thumb({ ad, large = false }: { ad: Ad; large?: boolean }) {
  const box = large ? "h-32 w-full" : "h-10 w-16";
  if ((ad.type === "image" || ad.type === "card") && ad.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={ad.image} alt="" loading="lazy" className={`${box} shrink-0 rounded-lg bg-slate-100 object-cover ring-1 ring-slate-200 dark:bg-white/[0.04] dark:ring-white/10`} />;
  }
  const Icon = TYPE_META[ad.type].icon;
  return (
    <span className={`${box} flex shrink-0 flex-col items-center justify-center gap-1 rounded-lg bg-slate-100 px-1 text-slate-400 ring-1 ring-slate-200 dark:bg-white/[0.04] dark:ring-white/10`}>
      {ad.type === "text" && large ? (
        <span className="px-4 text-center text-sm font-semibold text-slate-600 dark:text-slate-300">{ad.title}</span>
      ) : (
        <>
          <Icon className={large ? "h-6 w-6" : "h-4 w-4"} aria-hidden="true" />
          {large && ad.type === "html" && <span className="text-xs">{ad.width && ad.height ? `${ad.width}×${ad.height}` : "Responsive"}</span>}
        </>
      )}
    </span>
  );
}

const scopeText = (a: Ad) => {
  const s = a.scope === "path" ? a.pathPrefix || "Custom path" : labelOf(SCOPES, a.scope);
  const langs = a.locales.length ? a.locales.map((l) => l.toUpperCase()).join(", ") : "";
  const dev = a.device !== "all" ? (a.device === "mobile" ? "Mobile" : "Desktop") : "";
  return [s, langs, dev].filter(Boolean).join(" · ");
};

export default function AdminAdsPage() {
  const router = useRouter();
  const { confirm, toast } = useAdminUI();
  const [ads, setAds] = useState<Ad[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [adsEnabled, setAdsEnabled] = useState<boolean | null>(null);
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [placement, setPlacement] = useState("all");
  const [view, setView] = useState<View>("list");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [statsFor, setStatsFor] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    setError(null);
    api<{ ads: Ad[] }>("/api/admin/ads")
      .then((d) => setAds(d.ads))
      .catch((e) => setError((e as Error).message));
  }, []);

  useEffect(() => {
    load();
    fetch("/api/config", { cache: "no-store" })
      .then((r) => r.json())
      .then((c) => setAdsEnabled(Boolean(c?.adsEnabled)))
      .catch(() => {});
    try {
      const v = localStorage.getItem("admin-ads-view");
      if (v === "grid" || v === "list") setView(v);
    } catch {
      /* ignore */
    }
  }, [load]);

  const changeView = (v: View) => {
    setView(v);
    try {
      localStorage.setItem("admin-ads-view", v);
    } catch {
      /* ignore */
    }
  };

  const [now] = useState(() => Date.now());
  const filtered = useMemo(() => {
    if (!ads) return [];
    const s = q.trim().toLowerCase();
    return ads.filter(
      (a) =>
        (type === "all" || a.type === type) &&
        (status === "all" || adStatus(a, now) === status) &&
        (placement === "all" || a.placement === placement) &&
        (!s || [a.name, a.title, a.link, a.adsenseSlot, a.pathPrefix].some((x) => x.toLowerCase().includes(s))),
    );
  }, [ads, q, type, status, placement, now]);

  const kpi = useMemo(() => {
    const list = ads || [];
    const imp = list.reduce((s, a) => s + a.impressions, 0);
    const clk = list.reduce((s, a) => s + a.clicks, 0);
    return { active: list.filter((a) => adStatus(a, now) === "active").length, total: list.length, imp, clk, ctr: ctrOf(clk, imp) };
  }, [ads, now]);

  const allSelected = filtered.length > 0 && filtered.every((a) => selected.has(a.id));
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(filtered.map((a) => a.id)));
  const toggleOne = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const setEnabled = async (a: Ad, enabled: boolean) => {
    setAds((list) => list && list.map((x) => (x.id === a.id ? { ...x, enabled } : x)));
    try {
      await api(`/api/admin/ads/${a.id}`, { method: "PATCH", json: { enabled } });
      toast(enabled ? `“${a.name}” enabled` : `“${a.name}” disabled`);
    } catch (e) {
      setAds((list) => list && list.map((x) => (x.id === a.id ? { ...x, enabled: !enabled } : x)));
      toast((e as Error).message, "error");
    }
  };

  const duplicate = async (a: Ad) => {
    try {
      const r = await api<{ id: string }>("/api/admin/ads", { method: "POST", json: { duplicateOf: a.id } });
      toast("Copy created (disabled)");
      router.push(`/admin/ads/${r.id}`);
    } catch (e) {
      toast((e as Error).message, "error");
    }
  };

  /** Deletes ads; asks whether to also delete their uploaded images. */
  const removeAds = async (ids: string[], opts: { all?: boolean } = {}) => {
    const list = (ads || []).filter((a) => opts.all || ids.includes(a.id));
    if (!list.length) return;
    const title = opts.all ? `Delete all ${list.length} ads?` : list.length === 1 ? `Delete “${list[0].name}”?` : `Delete ${list.length} ads?`;
    if (!(await confirm({ title, message: "Ads and their statistics are removed permanently.", confirmLabel: opts.all ? "Delete all" : "Delete" }))) return;
    let deleteImages = false;
    if (list.some((a) => a.imageId)) {
      deleteImages = await confirm({
        title: "Also delete uploaded images?",
        message: "Images uploaded for these ads are removed unless another ad still uses them. Cancel keeps them in the library.",
        confirmLabel: "Delete images",
      });
    }
    setBusy(true);
    try {
      const r = await api<{ deleted: number; imagesDeleted: number }>("/api/admin/ads", {
        method: "DELETE",
        json: opts.all ? { all: true, deleteImages } : { ids: list.map((a) => a.id), deleteImages },
      });
      const gone = new Set(list.map((a) => a.id));
      setAds((l) => l && l.filter((a) => !gone.has(a.id)));
      setSelected(new Set());
      toast(`${r.deleted} ad${r.deleted === 1 ? "" : "s"} deleted${r.imagesDeleted ? ` · ${r.imagesDeleted} image${r.imagesDeleted === 1 ? "" : "s"}` : ""}`);
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setBusy(false);
    }
  };

  const statsAd = ads?.find((a) => a.id === statsFor) || null;
  const loading = ads === null && !error;

  return (
    <div>
      <PageHeader
        title="Ads"
        icon={Megaphone}
        description="AdSense, image, card, text and script ads — where they show and how they perform."
        actions={
          <>
            <Button icon={RefreshCw} onClick={load} aria-label="Refresh">
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Link href="/admin/ads/new" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 text-sm font-medium text-white shadow-sm hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400">
              <Plus className="h-4 w-4" /> New ad
            </Link>
          </>
        }
      />

      {adsEnabled === false && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Ads are switched off site-wide, so none of these are shown. Turn on <strong>Show ads</strong> in{" "}
            <Link href="/admin/settings" className="font-semibold underline">
              Settings
            </Link>
            .
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard label="Active ads" value={`${kpi.active}`} hint={`of ${kpi.total} total`} icon={Zap} tone="green" loading={loading} />
        <StatCard label="Impressions" value={fmtCompact(kpi.imp)} hint="all time" icon={Eye} tone="blue" loading={loading} />
        <StatCard label="Clicks" value={fmtCompact(kpi.clk)} hint="all time" icon={MousePointerClick} tone="violet" loading={loading} />
        <StatCard label="CTR" value={fmtPct(kpi.ctr)} hint="clicks / impressions" icon={Percent} tone="amber" loading={loading} />
      </div>

      <Card className="mt-6" bodyClassName="p-0">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 dark:border-white/[0.06] lg:flex-row lg:items-center">
          <SearchInput value={q} onChange={setQ} placeholder="Search ads…" className="lg:w-64" />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex">
            <Select value={type} onChange={setType} options={[{ value: "all", label: "All types" }, ...AD_TYPES.map((t) => ({ value: t.value, label: t.label }))]} className="lg:w-40" />
            <Select
              value={status}
              onChange={setStatus}
              options={[
                { value: "all", label: "Any status" },
                { value: "active", label: "Active" },
                { value: "scheduled", label: "Scheduled" },
                { value: "expired", label: "Expired" },
                { value: "disabled", label: "Disabled" },
              ]}
              className="lg:w-36"
            />
            <Select value={placement} onChange={setPlacement} options={[{ value: "all", label: "All placements" }, ...PLACEMENTS.map((p) => ({ value: p.value, label: p.label }))]} className="lg:w-48" />
          </div>
          <div className="flex items-center gap-2 lg:ms-auto">
            {selected.size > 0 ? (
              <Button variant="danger" size="sm" icon={Trash2} onClick={() => removeAds(Array.from(selected))} loading={busy}>
                Delete selected ({selected.size})
              </Button>
            ) : (
              (ads?.length || 0) > 0 && (
                <Button variant="danger-ghost" size="sm" icon={Trash2} onClick={() => removeAds([], { all: true })} loading={busy}>
                  Delete all…
                </Button>
              )
            )}
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-white/10 dark:bg-white/[0.04]">
              {([["list", List], ["grid", LayoutGrid]] as const).map(([v, Icon]) => (
                <button
                  key={v}
                  type="button"
                  aria-label={`${v} view`}
                  aria-pressed={view === v}
                  onClick={() => changeView(v)}
                  className={`rounded-md p-1.5 transition-colors ${view === v ? "bg-white text-slate-900 shadow-sm dark:bg-white/10 dark:text-white" : "text-slate-400 hover:text-slate-700 dark:hover:text-white"}`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {error ? (
          <EmptyState icon={AlertTriangle} title="Couldn't load ads" description={error} action={<Button icon={RefreshCw} onClick={load}>Retry</Button>} />
        ) : loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        ) : ads!.length === 0 ? (
          <EmptyState
            icon={Megaphone}
            title="No ads yet"
            description="Create an AdSense unit, an image banner, a card, a text ad or paste any ad-network script."
            action={
              <Link href="/admin/ads/new" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 text-sm font-medium text-white hover:bg-brand-700">
                <Plus className="h-4 w-4" /> Create your first ad
              </Link>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState title="No ads match these filters" action={<Button onClick={() => { setQ(""); setType("all"); setStatus("all"); setPlacement("all"); }}>Clear filters</Button>} />
        ) : view === "list" ? (
          <Table>
            <THead>
              <tr>
                <th className="w-10">
                  <input type="checkbox" aria-label="Select all" checked={allSelected} onChange={toggleAll} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-white/20 dark:bg-white/5" />
                </th>
                <th>Ad</th>
                <th>Type</th>
                <th>Placement</th>
                <th>Status</th>
                <th className="!text-end">Impr.</th>
                <th className="!text-end">Clicks</th>
                <th className="hidden !text-end 2xl:table-cell">CTR</th>
                <th>On</th>
                <th className="w-32" />
              </tr>
            </THead>
            <TBody>
              {filtered.map((a) => {
                const st = adStatus(a, now);
                return (
                  <tr key={a.id} className={selected.has(a.id) ? "bg-brand-50/40 dark:bg-brand-400/[0.04]" : ""}>
                    <td>
                      <input type="checkbox" aria-label={`Select ${a.name}`} checked={selected.has(a.id)} onChange={() => toggleOne(a.id)} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-white/20 dark:bg-white/5" />
                    </td>
                    <td className="min-w-[210px]">
                      <div className="flex items-center gap-3">
                        <Thumb ad={a} />
                        <div className="min-w-0">
                          <Link href={`/admin/ads/${a.id}`} className="block max-w-[260px] truncate font-medium text-slate-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-300">
                            {a.name || "Untitled ad"}
                          </Link>
                          <p className="max-w-[260px] truncate text-xs text-slate-500 dark:text-slate-400">{scopeText(a)}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <TypeBadge type={a.type} />
                    </td>
                    <td className="whitespace-nowrap text-slate-600 dark:text-slate-300">{labelOf(PLACEMENTS, a.placement)}</td>
                    <td>
                      <StatusBadge status={st} />
                      <ScheduleHint ad={a} status={st} />
                    </td>
                    <td className="text-end tabular-nums">{fmtNum(a.impressions)}</td>
                    <td className="text-end tabular-nums">{fmtNum(a.clicks)}</td>
                    <td className="hidden text-end tabular-nums text-slate-500 dark:text-slate-400 2xl:table-cell">{fmtPct(ctrOf(a.clicks, a.impressions))}</td>
                    <td>
                      <Toggle checked={a.enabled} onChange={(v) => setEnabled(a, v)} label={`Enable ${a.name}`} />
                    </td>
                    <td>
                      <RowActions ad={a} onStats={() => setStatsFor(a.id)} onDuplicate={() => duplicate(a)} onDelete={() => removeAds([a.id])} />
                    </td>
                  </tr>
                );
              })}
            </TBody>
          </Table>
        ) : (
          <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((a) => {
              const st = adStatus(a, now);
              return (
                <div key={a.id} className={`overflow-hidden rounded-xl border bg-white dark:bg-white/[0.02] ${selected.has(a.id) ? "border-brand-400 ring-1 ring-brand-400" : "border-slate-200 dark:border-white/[0.08]"}`}>
                  <div className="relative">
                    <Thumb ad={a} large />
                    <input type="checkbox" aria-label={`Select ${a.name}`} checked={selected.has(a.id)} onChange={() => toggleOne(a.id)} className="absolute start-2.5 top-2.5 h-4 w-4 rounded border-slate-300 text-brand-600 shadow focus:ring-brand-500" />
                    <span className="absolute end-2.5 top-2.5">
                      <StatusBadge status={st} />
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/admin/ads/${a.id}`} className="min-w-0 truncate font-medium text-slate-900 hover:text-brand-600 dark:text-white">
                        {a.name || "Untitled ad"}
                      </Link>
                      <Toggle checked={a.enabled} onChange={(v) => setEnabled(a, v)} label={`Enable ${a.name}`} />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <TypeBadge type={a.type} />
                      <span className="text-xs text-slate-500 dark:text-slate-400">{labelOf(PLACEMENTS, a.placement)}</span>
                    </div>
                    <p className="mt-1 truncate text-xs text-slate-400">{scopeText(a)}</p>
                    <dl className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-slate-50 p-2.5 text-center dark:bg-white/[0.03]">
                      {[
                        ["Impr.", fmtCompact(a.impressions)],
                        ["Clicks", fmtCompact(a.clicks)],
                        ["CTR", fmtPct(ctrOf(a.clicks, a.impressions))],
                      ].map(([l, v]) => (
                        <div key={l}>
                          <dt className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{l}</dt>
                          <dd className="text-sm font-semibold tabular-nums text-slate-900 dark:text-white">{v}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-3 flex justify-end">
                      <RowActions ad={a} onStats={() => setStatsFor(a.id)} onDuplicate={() => duplicate(a)} onDelete={() => removeAds([a.id])} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {ads && ads.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500 dark:border-white/[0.06] dark:text-slate-400">
            <span>
              {filtered.length} of {ads.length} ads
            </span>
            <label className="flex items-center gap-2 lg:hidden">
              <input type="checkbox" checked={allSelected} onChange={toggleAll} className="h-4 w-4 rounded border-slate-300 text-brand-600" /> Select all
            </label>
          </div>
        )}
      </Card>

      {statsAd && <StatsDrawer ad={statsAd} onClose={() => setStatsFor(null)} />}
    </div>
  );
}

function ScheduleHint({ ad, status }: { ad: Ad; status: AdStatus }) {
  const txt =
    status === "scheduled" ? `starts ${new Date(ad.startAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}` : status === "expired" ? `ended ${timeAgo(ad.endAt)}` : status === "active" && ad.endAt ? `until ${new Date(ad.endAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}` : "";
  return txt ? <p className="mt-0.5 whitespace-nowrap text-[11px] text-slate-400">{txt}</p> : null;
}

function RowActions({ ad, onStats, onDuplicate, onDelete }: { ad: Ad; onStats: () => void; onDuplicate: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-end gap-0.5">
      <IconButton icon={BarChart3} label={`Stats for ${ad.name}`} onClick={onStats} />
      <Link href={`/admin/ads/${ad.id}`} aria-label={`Edit ${ad.name}`} title="Edit" className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-white">
        <Pencil className="h-4 w-4" />
      </Link>
      <IconButton icon={Copy} label={`Duplicate ${ad.name}`} onClick={onDuplicate} />
      <IconButton icon={Trash2} label={`Delete ${ad.name}`} variant="danger-ghost" onClick={onDelete} />
    </div>
  );
}

let regionNames: Intl.DisplayNames | null = null;
const countryName = (cc: string) => {
  try {
    regionNames ??= new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(cc) || cc;
  } catch {
    return cc;
  }
};

/** Quick per-ad stats (impressions / clicks by country) without leaving the list. */
function StatsDrawer({ ad, onClose }: { ad: Ad; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [onClose]);
  const rows = Array.from(new Set([...Object.keys(ad.impByCountry), ...Object.keys(ad.clickByCountry)]))
    .map((cc) => ({ cc, imp: ad.impByCountry[cc] || 0, clk: ad.clickByCountry[cc] || 0 }))
    .sort((a, b) => b.imp - a.imp);
  const max = Math.max(1, ...rows.map((r) => r.imp));
  return (
    <div className="fixed inset-0 z-[150] flex justify-end bg-slate-950/40 backdrop-blur-sm" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={`Stats for ${ad.name}`} className="flex h-full w-full max-w-md flex-col overflow-y-auto border-s border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-ink-900" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-5 dark:border-white/[0.06]">
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-slate-900 dark:text-white">{ad.name}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <TypeBadge type={ad.type} />
              <StatusBadge status={adStatus(ad)} />
              {ad.locales.length > 0 && <span className="text-xs text-slate-400">{ad.locales.map((l) => LOCALE_META[l].english).join(", ")}</span>}
            </div>
          </div>
          <Button size="sm" onClick={onClose} autoFocus>
            Close
          </Button>
        </div>
        <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 dark:divide-white/[0.06] dark:border-white/[0.06]">
          {[
            ["Impressions", fmtNum(ad.impressions)],
            ["Clicks", fmtNum(ad.clicks)],
            ["CTR", fmtPct(ctrOf(ad.clicks, ad.impressions))],
          ].map(([l, v]) => (
            <div key={l} className="p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">{l}</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-slate-900 dark:text-white">{v}</p>
            </div>
          ))}
        </div>
        <div className="p-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">By country</p>
          {rows.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">No data yet.</p>
          ) : (
            <ul className="space-y-1.5">
              {rows.map((r) => (
                <li key={r.cc} className="relative flex items-center gap-3 overflow-hidden rounded-lg px-3 py-2 text-sm">
                  <span className="absolute inset-y-0 start-0 rounded-lg bg-brand-50 dark:bg-brand-400/10" style={{ width: `${(r.imp / max) * 100}%` }} aria-hidden="true" />
                  <Flag cc={r.cc} className="relative" />
                  <span className="relative min-w-0 flex-1 truncate text-slate-700 dark:text-slate-200">{countryName(r.cc)}</span>
                  <span className="relative tabular-nums text-slate-900 dark:text-white">{fmtNum(r.imp)}</span>
                  <span className="relative w-20 text-end text-xs tabular-nums text-slate-500 dark:text-slate-400">
                    {fmtNum(r.clk)} clk · {fmtPct(ctrOf(r.clk, r.imp))}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link href={`/admin/ads/${ad.id}`} className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-300">
            <Pencil className="h-3.5 w-3.5" /> Open editor for daily chart
          </Link>
        </div>
      </div>
    </div>
  );
}
