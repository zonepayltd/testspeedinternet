"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Megaphone, ImageIcon, Pencil, Trash2 } from "lucide-react";
import { PLACEMENTS, SCOPES, type Ad } from "@/lib/adsModel";

const placementLabel = (v: string) => PLACEMENTS.find((p) => p.value === v)?.label || v;
const scopeLabel = (v: string) => SCOPES.find((s) => s.value === v)?.label || v;

export default function AdminAdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/ads", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => (d.ok ? setAds(d.ads) : setError(d.error || "Could not load ads")))
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/ads/${id}`, { method: "DELETE" });
      setAds((a) => a.filter((x) => x.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Ads</h1>
          <p className="mt-1 text-sm text-slate-500">Manage AdSense and custom ads, and where they appear.</p>
        </div>
        <Link href="/admin/ads/new" className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700">
          <Plus className="h-4 w-4" /> New ad
        </Link>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-xs text-slate-500">
        Ads only show on the live site when <strong>Show ads</strong> is on (Settings → Google AdSense) and the ad is <strong>Active</strong>.
      </div>

      {loading && <p className="mt-6 text-sm text-slate-400">Loading…</p>}
      {error && <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">{error}</div>}

      {!loading && !error && ads.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <Megaphone className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">No ads yet.</p>
          <Link href="/admin/ads/new" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
            <Plus className="h-4 w-4" /> Create your first ad
          </Link>
        </div>
      )}

      {ads.length > 0 && (() => {
        const views = ads.reduce((s, a) => s + (a.impressions || 0), 0);
        const clicks = ads.reduce((s, a) => s + (a.clicks || 0), 0);
        const ctr = views ? ((clicks / views) * 100).toFixed(1) : "0.0";
        const active = ads.filter((a) => a.enabled).length;
        const cards = [
          { label: "Total impressions", value: views },
          { label: "Total clicks", value: clicks },
          { label: "Overall CTR", value: `${ctr}%` },
          { label: "Active ads", value: `${active}/${ads.length}` },
        ];
        return (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {cards.map((c) => (
              <div key={c.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{c.label}</p>
                <p className="mt-1.5 text-2xl font-extrabold tabular-nums text-slate-900">{c.value}</p>
              </div>
            ))}
          </div>
        );
      })()}

      {ads.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Placement</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">Pages</th>
                <th className="px-4 py-3 font-semibold">Views</th>
                <th className="px-4 py-3 font-semibold">Clicks</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ads.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/ads/${a.id}`} className="font-semibold text-slate-900 hover:text-brand-600">{a.name}</Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-slate-600">
                      {a.type === "adsense" ? <Megaphone className="h-3.5 w-3.5" /> : <ImageIcon className="h-3.5 w-3.5" />}
                      {a.type === "adsense" ? "AdSense" : "Custom"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{placementLabel(a.placement)}</td>
                  <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">
                    {scopeLabel(a.scope)}
                    {a.scope === "path" && a.pathPrefix ? ` (${a.pathPrefix})` : ""}
                  </td>
                  <td className="px-4 py-3 font-semibold tabular-nums text-slate-700">{a.impressions || 0}</td>
                  <td className="px-4 py-3 font-semibold tabular-nums text-slate-700">{a.clicks || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${a.enabled ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                      {a.enabled ? "Active" : "Off"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/ads/${a.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Link>
                      <button onClick={() => remove(a.id, a.name)} disabled={deleting === a.id} className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50">
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
