"use client";

import FirebaseSetup, { isFirebaseMissing } from "@/components/admin/FirebaseSetup";
import { useMemo, useState } from "react";
import { AlertTriangle, Brush, FileText, Globe2, Radio, RefreshCw, Smartphone, Trash2 } from "lucide-react";
import { BarList, Button, Card, EmptyState, Flag, IconButton, PageHeader, SearchInput, Skeleton, StatCard, Table, TBody, THead, api, fmtNum, useAdminUI } from "@/components/admin/ui";
import { DeviceIcon, LiveDot, PathLabel, cap, secondsAgo, splitLocale, useNow, usePoll, type OnlineUser } from "./bits";

type OnlineRes = { count: number; online: OnlineUser[]; stale: number; now: number };

const COUNTRY = typeof Intl !== "undefined" && "DisplayNames" in Intl ? new Intl.DisplayNames(["en"], { type: "region" }) : null;
const countryName = (cc: string) => {
  try {
    return (cc && COUNTRY?.of(cc.toUpperCase())) || cc || "Unknown";
  } catch {
    return cc || "Unknown";
  }
};

export default function OnlineNow() {
  const { confirm, toast } = useAdminUI();
  const [data, setData] = useState<OnlineRes | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [removing, setRemoving] = useState(false);
  const [lastFetch, setLastFetch] = useState(0);
  const now = useNow(1000);

  const reload = usePoll(async () => {
    setLoading(true);
    try {
      const d = await api<OnlineRes>("/api/admin/online");
      setData(d);
      setError("");
      setLastFetch(Date.now());
      setSelected((sel) => new Set([...sel].filter((id) => d.online.some((u) => u.id === id))));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, 10_000);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    const all = data?.online || [];
    if (!s) return all;
    return all.filter((u) => `${u.path} ${u.city} ${u.countryCode} ${countryName(u.countryCode)} ${u.device} ${u.os} ${u.browser} ${u.locale}`.toLowerCase().includes(s));
  }, [data, q]);

  const byPage = useMemo(() => {
    const m = new Map<string, number>();
    (data?.online || []).forEach((u) => m.set(u.path, (m.get(u.path) || 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [data]);
  const byCountry = useMemo(() => {
    const m = new Map<string, number>();
    (data?.online || []).forEach((u) => m.set(u.countryCode || "", (m.get(u.countryCode || "") || 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [data]);
  const mobile = (data?.online || []).filter((u) => u.device === "mobile" || u.device === "tablet").length;

  const removeIds = async (ids: string[]) => {
    if (!ids.length) return;
    const ok = await confirm({
      title: ids.length === 1 ? "Remove this session?" : `Remove ${ids.length} sessions?`,
      message: "This deletes the presence record. If the visitor is still on the site, they will reappear at the next heartbeat (≈30 s).",
      confirmLabel: "Remove",
    });
    if (!ok) return;
    const prev = data;
    setData((d) => (d ? { ...d, online: d.online.filter((u) => !ids.includes(u.id)), count: d.count - ids.length } : d));
    try {
      const qs = ids.map((id) => `id=${encodeURIComponent(id)}`).join("&");
      await api(`/api/admin/online?${qs}`, { method: "DELETE" });
      setSelected(new Set());
      toast(ids.length === 1 ? "Session removed" : `${ids.length} sessions removed`);
    } catch (e) {
      setData(prev);
      toast(e instanceof Error ? e.message : "Delete failed", "error");
    }
  };

  const removeStale = async () => {
    const ok = await confirm({
      title: "Remove stale sessions?",
      message: `Deletes presence records not updated for more than 2 minutes${data?.stale ? ` (${fmtNum(data.stale)} right now)` : ""}. Active visitors are not affected.`,
      confirmLabel: "Remove stale",
    });
    if (!ok) return;
    setRemoving(true);
    try {
      const d = await api<{ deleted: number }>("/api/admin/online?stale=1", { method: "DELETE" });
      toast(d.deleted ? `${fmtNum(d.deleted)} stale session${d.deleted === 1 ? "" : "s"} removed` : "No stale sessions to remove", d.deleted ? "success" : "info");
      reload();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Cleanup failed", "error");
    } finally {
      setRemoving(false);
    }
  };

  const allChecked = list.length > 0 && list.every((u) => selected.has(u.id));
  const toggleAll = () => setSelected(allChecked ? new Set() : new Set(list.map((u) => u.id)));
  const toggle = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <div>
      <PageHeader
        title="Online now"
        description="Visitors with an open page in the last 60 seconds. Refreshes every 10 seconds."
        icon={Radio}
        actions={
          <>
            <span className="me-1 hidden items-center gap-2 text-xs text-slate-400 sm:flex">
              <LiveDot /> {lastFetch ? `Updated ${secondsAgo(lastFetch, now)}` : "Connecting…"}
            </span>
            <Button size="sm" icon={RefreshCw} onClick={() => reload()} loading={loading && !!data}>
              Refresh
            </Button>
            <Button size="sm" variant="danger-ghost" icon={Brush} onClick={removeStale} loading={removing}>
              Remove stale{data?.stale ? ` (${fmtNum(data.stale)})` : ""}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Online now" value={fmtNum(data?.count)} icon={Radio} tone="green" live loading={!data} hint="Last 60 s" />
        <StatCard label="Pages viewed" value={fmtNum(byPage.length)} icon={FileText} tone="blue" loading={!data} hint="Distinct paths" />
        <StatCard label="Countries" value={fmtNum(byCountry.length)} icon={Globe2} tone="violet" loading={!data} hint={byCountry[0] ? `Most: ${countryName(byCountry[0][0])}` : undefined} />
        <StatCard label="On mobile" value={data ? `${data.count ? Math.round((mobile / data.count) * 100) : 0}%` : "–"} icon={Smartphone} tone="amber" loading={!data} hint={`${fmtNum(mobile)} phones & tablets`} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card
          className="xl:col-span-2"
          title="Active visitors"
          description={data ? `${fmtNum(list.length)} of ${fmtNum(data.count)} shown` : undefined}
          bodyClassName=""
          actions={
            selected.size > 0 ? (
              <Button size="sm" variant="danger" icon={Trash2} onClick={() => removeIds([...selected])}>
                Delete selected ({selected.size})
              </Button>
            ) : null
          }
        >
          <div className="border-b border-slate-100 px-4 py-3 dark:border-white/[0.06]">
            <SearchInput value={q} onChange={setQ} placeholder="Filter by page, city, country, device…" className="max-w-sm" />
          </div>
          {error && !data ? (
            isFirebaseMissing(error) ? <div className="p-4"><FirebaseSetup compact /></div> : <EmptyState icon={AlertTriangle} title="Couldn’t load online visitors" description={error} action={<Button icon={RefreshCw} onClick={() => reload()}>Retry</Button>} />
          ) : !data ? (
            <div className="space-y-2.5 p-4">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="h-10" />
              ))}
            </div>
          ) : list.length === 0 ? (
            <EmptyState
              icon={Radio}
              title={q ? "No visitors match this filter" : "Nobody is online right now"}
              description={q ? "Try a different search." : "Open pages send a heartbeat every 30 seconds — new visitors appear here automatically."}
              action={q ? <Button onClick={() => setQ("")}>Clear filter</Button> : undefined}
            />
          ) : (
            <Table>
              <THead>
                <tr>
                  <th className="w-10">
                    <input type="checkbox" aria-label="Select all" checked={allChecked} onChange={toggleAll} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-white/20 dark:bg-white/5" />
                  </th>
                  <th>Location</th>
                  <th>Current page</th>
                  <th>Device</th>
                  <th>Last seen</th>
                  <th className="w-12">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </THead>
              <TBody>
                {list.map((u) => {
                  const age = (now - u.lastSeen) / 1000;
                  return (
                    <tr key={u.id} className={selected.has(u.id) ? "bg-brand-50/50 dark:bg-brand-400/[0.04]" : ""}>
                      <td>
                        <input type="checkbox" aria-label={`Select ${u.city || u.id}`} checked={selected.has(u.id)} onChange={() => toggle(u.id)} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-white/20 dark:bg-white/5" />
                      </td>
                      <td className="whitespace-nowrap">
                        <span className="flex items-center gap-2.5">
                          <Flag cc={u.countryCode} />
                          <span>
                            <span className="block text-sm font-medium text-slate-900 dark:text-white">{u.city || "Unknown city"}</span>
                            <span className="block text-xs text-slate-400">{countryName(u.countryCode)}</span>
                          </span>
                        </span>
                      </td>
                      <td>
                        <PathLabel path={u.path} locale={u.locale} max="max-w-[150px] sm:max-w-[200px] 2xl:max-w-[320px]" />
                      </td>
                      <td className="whitespace-nowrap">
                        <span className="flex items-center gap-2 text-sm">
                          <DeviceIcon device={u.device} />
                          <span>
                            <span className="block text-slate-700 dark:text-slate-200">{u.browser || "–"}</span>
                            <span className="block text-xs text-slate-400">
                              {u.os || "–"} · {cap(u.device)}
                            </span>
                          </span>
                        </span>
                      </td>
                      <td className="whitespace-nowrap">
                        <span className="flex items-center gap-2 text-sm tabular-nums">
                          <span className={`h-1.5 w-1.5 rounded-full ${age < 35 ? "bg-emerald-500" : "bg-amber-400"}`} aria-hidden="true" />
                          {secondsAgo(u.lastSeen, now)}
                        </span>
                      </td>
                      <td className="text-end">
                        <IconButton icon={Trash2} label="Remove session" variant="danger-ghost" onClick={() => removeIds([u.id])} />
                      </td>
                    </tr>
                  );
                })}
              </TBody>
            </Table>
          )}
        </Card>

        <div className="space-y-4">
          <Card title="By page" icon={FileText}>
            {!data ? (
              <Skeleton className="h-32" />
            ) : (
              <BarList
                empty="Nobody online"
                items={byPage.map(([path, n]) => ({ key: path, value: n, label: <PathLabel path={path} locale={splitLocale(path).lang} /> }))}
              />
            )}
          </Card>
          <Card title="By country" icon={Globe2}>
            {!data ? (
              <Skeleton className="h-32" />
            ) : (
              <BarList
                empty="Nobody online"
                items={byCountry.map(([cc, n]) => ({
                  key: cc || "unknown",
                  value: n,
                  label: (
                    <span className="flex items-center gap-2">
                      <Flag cc={cc} />
                      {countryName(cc)}
                    </span>
                  ),
                }))}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
