"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BadgeCheck, Ban, CheckCircle2, Download, Gauge, LogOut, Mail, MessageSquareText, Pencil, RefreshCw, Star, Trash2, UserCheck, UserPlus, UserRound, Users, Wifi } from "lucide-react";
import {
  Badge, Button, Card, EmptyState, Flag, IconButton, PageHeader, Pagination, SearchInput, Select, Skeleton, StatCard, TBody, THead, Table,
  api, fmtDateTime, fmtNum, inputCls, timeAgo, useAdminUI,
} from "@/components/admin/ui";
import { Checkbox, Drawer, ErrorBox, downloadUrl } from "@/components/admin/analytics/charts";
import { Avatar, ProviderLogo, Stars, fmtMbps } from "@/components/admin/users/bits";

type User = {
  id: string; name: string; email: string; phone: string; country: string; countryCode: string; locale: string; emailVerified: boolean;
  status: "active" | "disabled"; marketing: boolean; createdAt: number; verifiedAt: number; lastLoginAt: number; tests: number; reviews: number;
};
type ListData = {
  users: User[]; total: number; page: number; pages: number; totalAll: number; capped: boolean;
  stats: { total: number; verified: number; unverified: number; disabled: number; newThisWeek: number; withReviews: number; withTests: number };
  facets: { countries: { value: string; count: number; name: string }[] };
};
type Detail = {
  user: User & { city: string; signupIp: string };
  tests: { id: string; status: string; mode: string; download: number | null; upload: number | null; ping: number | null; jitter: number | null; ispBrand: string; server: string; countryCode: string; city: string; ts: number }[];
  reviews: { id: string; provider: string; providerDomain: string; rating: number; title: string; comment: string; status: string; createdAt: number }[];
};

type StatusFilter = "" | "verified" | "unverified" | "disabled";
const STATUS_TABS: { id: StatusFilter; label: string }[] = [
  { id: "", label: "All" },
  { id: "verified", label: "Verified" },
  { id: "unverified", label: "Not verified" },
  { id: "disabled", label: "Disabled" },
];
const REVIEW_TONE: Record<string, "green" | "amber" | "slate"> = { published: "green", pending: "amber", hidden: "slate" };
const LANG = { en: "English", fr: "French", es: "Spanish", ar: "Arabic", ru: "Russian" } as Record<string, string>;

export default function UsersPage() {
  const { confirm, toast } = useAdminUI();
  const [qInput, setQInput] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<StatusFilter>("");
  const [country, setCountry] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ListData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("u");
    if (v) setOpenId(v);
  }, []);
  useEffect(() => {
    const t = setTimeout(() => setQ(qInput.trim()), 300);
    return () => clearTimeout(t);
  }, [qInput]);
  useEffect(() => setPage(1), [q, status, country]);

  const query = useMemo(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (status) p.set("status", status);
    if (country) p.set("country", country);
    return p;
  }, [q, status, country]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const p = new URLSearchParams(query);
      p.set("page", String(page));
      p.set("limit", "25");
      const d = await api<ListData>(`/api/admin/users?${p}`);
      setData(d);
      setSelected((s) => new Set([...s].filter((id) => d.users.some((u) => u.id === id))));
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
    if (!(await confirm({ title: one ? "Delete this account?" : `Delete ${ids.length} accounts?`, message: "The account and all its reviews are permanently deleted. Speed tests are kept but no longer linked to the account. This can’t be undone.", confirmLabel: "Delete" }))) return false;
    setBusy(true);
    try {
      const r = await api<{ deleted: { users: number; reviews: number } }>("/api/admin/users", { method: "DELETE", json: { ids } });
      toast(`Deleted ${fmtNum(r.deleted.users)} account${r.deleted.users === 1 ? "" : "s"} and ${fmtNum(r.deleted.reviews)} review${r.deleted.reviews === 1 ? "" : "s"}`);
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

  const rows = data?.users || [];
  const s = data?.stats;
  const allChecked = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const filtersActive = !!(q || status || country);
  const tabCount = (id: StatusFilter) => (!s ? null : id === "" ? s.total : id === "verified" ? s.verified : id === "unverified" ? s.unverified : s.disabled);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Users"
        icon={UserRound}
        description="Registered accounts — profile, tests, reviews and email status"
        actions={
          <>
            <IconButton icon={RefreshCw} label="Refresh" variant="secondary" onClick={load} className={loading ? "[&_svg]:animate-spin" : ""} />
            <Button icon={Download} onClick={() => downloadUrl(`/api/admin/users?${query}&format=csv`)}>Export CSV</Button>
          </>
        }
      />

      {error && <div className="mb-6"><ErrorBox message={error} onRetry={load} /></div>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" icon={Users} tone="blue" loading={!data} value={fmtNum(s?.total)} hint={s ? `${fmtNum(s.withTests)} saved tests` : undefined} />
        <StatCard label="Verified email" icon={BadgeCheck} tone="green" loading={!data} value={s?.total ? `${Math.round((s.verified / s.total) * 100)}%` : "–"} hint={s ? `${fmtNum(s.verified)} of ${fmtNum(s.total)}` : undefined} />
        <StatCard label="New this week" icon={UserPlus} tone="violet" loading={!data} value={fmtNum(s?.newThisWeek)} hint="last 7 days" />
        <StatCard label="Wrote reviews" icon={Star} tone="amber" loading={!data} value={fmtNum(s?.withReviews)} hint={s?.total ? `${Math.round((s.withReviews / s.total) * 100)}% of users` : undefined} />
      </div>

      <Card className="mt-6" title="All accounts" description={data ? `${fmtNum(data.total)} ${filtersActive ? "matching" : "newest first"}${data.capped ? " (latest 5,000)" : ""} · click a row for details` : undefined} bodyClassName="p-0">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 dark:border-white/[0.06] lg:flex-row lg:items-center">
          <div role="tablist" aria-label="Status" className="inline-flex shrink-0 gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-white/10 dark:bg-white/[0.04]">
            {STATUS_TABS.map((t) => (
              <button
                key={t.id || "all"}
                type="button"
                role="tab"
                aria-selected={status === t.id}
                onClick={() => setStatus(t.id)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${status === t.id ? "bg-white text-slate-900 shadow-sm dark:bg-white/10 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}
              >
                {t.label}
                {tabCount(t.id) != null && <span className="tabular-nums text-slate-400">{fmtNum(tabCount(t.id))}</span>}
              </button>
            ))}
          </div>
          <SearchInput value={qInput} onChange={setQInput} placeholder="Search name, email, phone, country…" className="lg:w-80" />
          <Select value={country} onChange={setCountry} options={[{ value: "", label: "All countries" }, ...(data?.facets.countries || []).map((c) => ({ value: c.value, label: `${c.name} (${c.count})` }))]} className="lg:w-52" />
          {filtersActive && <Button size="sm" variant="ghost" onClick={() => { setQInput(""); setStatus(""); setCountry(""); }}>Clear</Button>}
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
          <div className="space-y-2 p-4">{Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : rows.length === 0 ? (
          <EmptyState icon={UserRound} title={filtersActive ? "No accounts match these filters" : "No accounts yet"} description={filtersActive ? "Try a different search or clear the filters." : "Accounts appear here as soon as visitors sign up."} />
        ) : (
          <Table className={loading ? "opacity-60 transition-opacity" : ""}>
            <THead>
              <tr>
                <th className="w-10"><Checkbox label="Select all on this page" checked={allChecked} indeterminate={selected.size > 0} onChange={(v) => setSelected(v ? new Set(rows.map((r) => r.id)) : new Set())} /></th>
                <th>User</th>
                <th>Phone</th>
                <th>Country</th>
                <th className="!text-end">Tests</th>
                <th className="!text-end">Reviews</th>
                <th>Joined</th>
                <th>Last login</th>
                <th>Status</th>
                <th className="w-10"><span className="sr-only">Actions</span></th>
              </tr>
            </THead>
            <TBody>
              {rows.map((u) => (
                <tr
                  key={u.id}
                  tabIndex={0}
                  onClick={() => setOpenId(u.id)}
                  onKeyDown={(e) => e.key === "Enter" && setOpenId(u.id)}
                  className={`cursor-pointer focus:outline-none focus-visible:bg-brand-50/60 dark:focus-visible:bg-white/[0.04] ${selected.has(u.id) ? "bg-brand-50/40 dark:bg-brand-400/[0.06]" : ""}`}
                >
                  <td><Checkbox label={`Select ${u.email}`} checked={selected.has(u.id)} onChange={(c) => setSelected((x) => { const n = new Set(x); if (c) n.add(u.id); else n.delete(u.id); return n; })} /></td>
                  <td>
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar name={u.name} email={u.email} />
                      <div className="min-w-0">
                        <div className="truncate font-medium text-slate-900 dark:text-white">{u.name || "—"}</div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <span className="truncate">{u.email}</span>
                          {u.emailVerified ? <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" aria-label="Email verified" /> : <span className="shrink-0 rounded bg-amber-50 px-1 text-[10px] font-medium text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">unverified</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap font-mono text-xs" dir="ltr">{u.phone || "–"}</td>
                  <td className="whitespace-nowrap"><span className="flex items-center gap-2 text-sm"><Flag cc={u.countryCode} />{u.country || u.countryCode || "–"}</span></td>
                  <td className="text-end tabular-nums">{fmtNum(u.tests)}</td>
                  <td className="text-end tabular-nums">{fmtNum(u.reviews)}</td>
                  <td className="whitespace-nowrap text-xs tabular-nums text-slate-500 dark:text-slate-400" title={fmtDateTime(u.createdAt)}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "–"}</td>
                  <td className="whitespace-nowrap text-xs tabular-nums" title={u.lastLoginAt ? fmtDateTime(u.lastLoginAt) : undefined}>{u.lastLoginAt ? timeAgo(u.lastLoginAt) : "–"}</td>
                  <td>{u.status === "disabled" ? <Badge tone="rose">Disabled</Badge> : <Badge tone="green">Active</Badge>}</td>
                  <td><IconButton icon={Trash2} label="Delete account" variant="danger-ghost" onClick={(e) => { e.stopPropagation(); deleteIds([u.id]); }} /></td>
                </tr>
              ))}
            </TBody>
          </Table>
        )}
        {data && <Pagination page={data.page} pages={data.pages} onPage={setPage} />}
      </Card>

      <UserDrawer id={openId} onClose={() => setOpenId(null)} onChanged={load} onDelete={async (id) => { if (await deleteIds([id])) setOpenId(null); }} />
    </div>
  );
}

function UserDrawer({ id, onClose, onChanged, onDelete }: { id: string | null; onClose: () => void; onChanged: () => void; onDelete: (id: string) => void }) {
  const { toast, confirm } = useAdminUI();
  const [d, setD] = useState<Detail | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"profile" | "tests" | "reviews">("profile");
  const [busy, setBusy] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", country: "", countryCode: "" });

  const load = useCallback(async () => {
    if (!id) return;
    setError("");
    try {
      const r = await api<Detail>(`/api/admin/users/${encodeURIComponent(id)}`);
      setD(r);
      setForm({ name: r.user.name, phone: r.user.phone, country: r.user.country, countryCode: r.user.countryCode });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    }
  }, [id]);
  useEffect(() => {
    setD(null);
    setTab("profile");
    setEditing(false);
    load();
  }, [load]);

  const act = async (action: string, extra: Record<string, unknown> = {}) => {
    if (!id) return;
    if (action === "disable" && !(await confirm({ title: "Disable this account?", message: "The user is logged out everywhere and can't sign in until you enable the account again.", confirmLabel: "Disable" }))) return;
    setBusy(action);
    try {
      const r = await api<{ message?: string }>(`/api/admin/users/${encodeURIComponent(id)}`, { method: "PATCH", json: { action, ...extra } });
      toast(r.message || "Done");
      if (action === "edit") setEditing(false);
      await load();
      onChanged();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed", "error");
    } finally {
      setBusy(null);
    }
  };

  const u = d?.user;
  const avg = (k: "download" | "upload" | "ping") => {
    const v = (d?.tests || []).map((t) => t[k]).filter((x): x is number => typeof x === "number");
    return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
  };

  return (
    <Drawer
      open={!!id}
      onClose={onClose}
      title={u ? <span className="flex items-center gap-2.5"><Avatar name={u.name} email={u.email} size={28} />{u.name || u.email}{u.status === "disabled" && <Badge tone="rose">Disabled</Badge>}</span> : "User"}
      subtitle={u ? <span className="flex items-center gap-1.5">{u.email}{u.emailVerified ? <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" aria-label="Verified" /> : null}</span> : <span className="font-mono">{id}</span>}
      actions={id ? <IconButton icon={Trash2} label="Delete account" variant="danger-ghost" onClick={() => onDelete(id)} /> : null}
    >
      {error ? (
        <div className="p-5"><ErrorBox message={error} onRetry={load} /></div>
      ) : !d || !u ? (
        <div className="space-y-3 p-5">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
      ) : (
        <div className="p-5">
          {/* Quick actions */}
          <div className="flex flex-wrap gap-2">
            {u.emailVerified ? (
              <Button size="sm" icon={Mail} loading={busy === "unverify"} onClick={() => act("unverify")}>Mark unverified</Button>
            ) : (
              <>
                <Button size="sm" variant="primary" icon={Mail} loading={busy === "resend"} onClick={() => act("resend")}>Resend confirmation email</Button>
                <Button size="sm" icon={UserCheck} loading={busy === "verify"} onClick={() => act("verify")}>Mark verified</Button>
              </>
            )}
            {u.status === "disabled" ? (
              <Button size="sm" icon={CheckCircle2} loading={busy === "enable"} onClick={() => act("enable")}>Enable</Button>
            ) : (
              <Button size="sm" variant="danger" icon={Ban} loading={busy === "disable"} onClick={() => act("disable")}>Disable</Button>
            )}
            <Button size="sm" icon={LogOut} loading={busy === "logout"} onClick={() => act("logout")}>Log out everywhere</Button>
            <a href={`mailto:${u.email}`} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" /> Email user
            </a>
          </div>

          <div className="mt-5 flex gap-1 border-b border-slate-100 dark:border-white/[0.06]" role="tablist">
            {([["profile", "Profile"], ["tests", `Tests (${d.tests.length})`], ["reviews", `Reviews (${d.reviews.length})`]] as const).map(([t, label]) => (
              <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium ${tab === t ? "border-brand-600 text-slate-900 dark:border-brand-400 dark:text-white" : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"}`}>
                {label}
              </button>
            ))}
          </div>

          {tab === "profile" &&
            (editing ? (
              <form
                className="mt-4 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  act("edit", form);
                }}
              >
                {([["name", "Full name"], ["phone", "Phone"], ["country", "Country"], ["countryCode", "Country code (ISO-2)"]] as const).map(([k, label]) => (
                  <label key={k} className="block">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
                    <input value={form[k]} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} className={`${inputCls} mt-1`} maxLength={k === "countryCode" ? 2 : 80} />
                  </label>
                ))}
                <div className="flex gap-2 pt-1">
                  <Button type="submit" variant="primary" size="sm" loading={busy === "edit"}>Save</Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
                </div>
              </form>
            ) : (
              <div className="mt-4">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-slate-100 p-4 text-sm dark:border-white/[0.06]">
                  <Info label="Full name">{u.name || "–"}</Info>
                  <Info label="Email">
                    <span className="break-all">{u.email}</span>{" "}
                    {u.emailVerified ? <Badge tone="green">Verified</Badge> : <Badge tone="amber">Not verified</Badge>}
                  </Info>
                  <Info label="Phone"><span dir="ltr" className="font-mono text-xs">{u.phone || "–"}</span></Info>
                  <Info label="Country"><span className="flex items-center gap-1.5"><Flag cc={u.countryCode} />{u.country || "–"}{u.city ? ` · ${u.city}` : ""}</span></Info>
                  <Info label="Language">{LANG[u.locale] || u.locale}</Info>
                  <Info label="Product news">{u.marketing ? "Opted in" : "No"}</Info>
                  <Info label="Joined">{fmtDateTime(u.createdAt)}</Info>
                  <Info label="Email verified">{u.verifiedAt ? fmtDateTime(u.verifiedAt) : "–"}</Info>
                  <Info label="Last login">{u.lastLoginAt ? `${fmtDateTime(u.lastLoginAt)} (${timeAgo(u.lastLoginAt)})` : "–"}</Info>
                  <Info label="Sign-up IP"><span className="font-mono text-xs">{u.signupIp || "–"}</span></Info>
                  <Info label="Account ID"><span className="break-all font-mono text-[11px]">{u.id}</span></Info>
                </dl>
                <Button size="sm" className="mt-3" icon={Pencil} onClick={() => setEditing(true)}>Edit profile</Button>
              </div>
            ))}

          {tab === "tests" &&
            (d.tests.length === 0 ? (
              <EmptyState icon={Gauge} title="No saved tests" description="Tests run while logged in appear here." />
            ) : (
              <>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <Num label="Avg download" value={`${fmtMbps(avg("download"))} Mbps`} />
                  <Num label="Avg upload" value={`${fmtMbps(avg("upload"))} Mbps`} />
                  <Num label="Avg ping" value={avg("ping") == null ? "–" : `${Math.round(avg("ping")!)} ms`} />
                </div>
                <ul className="mt-3 divide-y divide-slate-100 dark:divide-white/[0.06]">
                  {d.tests.map((t) => (
                    <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-800 dark:text-slate-200"><Wifi className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />{t.ispBrand || "Unknown provider"}</div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-400"><Flag cc={t.countryCode} />{t.city || "–"} · {t.server || "–"} · {fmtDateTime(t.ts)} · <span className="capitalize">{t.status}</span></div>
                      </div>
                      <div className="flex gap-4 text-end text-xs tabular-nums">
                        <Num label="Down" value={fmtMbps(t.download)} plain />
                        <Num label="Up" value={fmtMbps(t.upload)} plain />
                        <Num label="Ping" value={t.ping == null ? "–" : String(Math.round(t.ping))} plain />
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ))}

          {tab === "reviews" &&
            (d.reviews.length === 0 ? (
              <EmptyState icon={MessageSquareText} title="No reviews" description="This user hasn't reviewed a provider yet." />
            ) : (
              <ul className="mt-4 space-y-3">
                {d.reviews.map((r) => (
                  <li key={r.id} className="rounded-xl border border-slate-100 p-3 dark:border-white/[0.06]">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white"><ProviderLogo name={r.provider} domain={r.providerDomain} size={18} />{r.provider}</span>
                      <Badge tone={REVIEW_TONE[r.status] || "slate"}>{r.status}</Badge>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2"><Stars value={r.rating} /><span className="text-[11px] text-slate-400">{fmtDateTime(r.createdAt)}</span></div>
                    {r.title && <p className="mt-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200">{r.title}</p>}
                    <p className="mt-1 whitespace-pre-line text-sm text-slate-600 dark:text-slate-400">{r.comment}</p>
                  </li>
                ))}
                <li><Link href={`/admin/reviews?q=${encodeURIComponent(u.email)}`} className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400">Manage in Reviews →</Link></li>
              </ul>
            ))}
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
function Num({ label, value, plain }: { label: string; value: string; plain?: boolean }) {
  return (
    <div className={plain ? "" : "rounded-xl bg-slate-50 px-2 py-2.5 dark:bg-white/[0.04]"}>
      <div className="text-[10px] uppercase text-slate-400">{label}</div>
      <div className="font-semibold tabular-nums text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}
