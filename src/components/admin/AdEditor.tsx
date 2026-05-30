"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Save, Trash2, Loader2, Megaphone, ImageIcon, Eye, MousePointerClick } from "lucide-react";
import CustomAdCard from "@/components/ads/CustomAdCard";
import {
  PLACEMENTS,
  SCOPES,
  CUSTOM_FORMATS,
  type AdType,
  type Placement,
  type Scope,
  type CustomFormat,
} from "@/lib/adsModel";

type Form = {
  name: string;
  type: AdType;
  placement: Placement;
  scope: Scope;
  pathPrefix: string;
  enabled: boolean;
  adsenseSlot: string;
  customFormat: CustomFormat;
  image: string;
  title: string;
  description: string;
  link: string;
  order: string;
};

type Stats = { impressions: number; clicks: number; impByCountry: Record<string, number> };

const EMPTY: Form = {
  name: "",
  type: "adsense",
  placement: "top",
  scope: "all",
  pathPrefix: "",
  enabled: true,
  adsenseSlot: "",
  customFormat: "card",
  image: "",
  title: "",
  description: "",
  link: "",
  order: "0",
};

const flag = (cc: string) => (cc.length === 2 ? `https://flagcdn.com/20x15/${cc.toLowerCase()}.png` : "");

export default function AdEditor({ adId }: { adId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<Form>(EMPTY);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(Boolean(adId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!adId) return;
    fetch(`/api/admin/ads/${adId}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          const a = d.ad;
          setForm({
            name: a.name,
            type: a.type,
            placement: a.placement,
            scope: a.scope,
            pathPrefix: a.pathPrefix,
            enabled: a.enabled,
            adsenseSlot: a.adsenseSlot,
            customFormat: a.customFormat || "card",
            image: a.image,
            title: a.title,
            description: a.description || "",
            link: a.link,
            order: String(a.order ?? 0),
          });
          setStats({ impressions: a.impressions || 0, clicks: a.clicks || 0, impByCountry: a.impByCountry || {} });
        } else setError(d.error || "Could not load ad");
      })
      .finally(() => setLoading(false));
  }, [adId]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setError(null);
    if (!form.name.trim()) return setError("Please give the ad a name.");
    if (form.type === "adsense" && !form.adsenseSlot.trim()) return setError("AdSense ads need a slot ID.");
    if (form.type === "custom") {
      if (!form.link.trim()) return setError("Custom ads need a link.");
      if (form.customFormat !== "text" && !form.image.trim()) return setError("This format needs an image.");
      if (form.customFormat !== "image" && !form.title.trim()) return setError("This format needs a title.");
    }

    setSaving(true);
    const payload = { ...form, order: Number(form.order) || 0 };
    try {
      const res = await fetch(adId ? `/api/admin/ads/${adId}` : "/api/admin/ads", {
        method: adId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await res.json();
      if (!d.ok) {
        setError(d.error || "Save failed");
        setSaving(false);
        return;
      }
      router.push("/admin/ads");
      router.refresh();
    } catch {
      setError("Network error");
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!adId || !confirm("Delete this ad?")) return;
    await fetch(`/api/admin/ads/${adId}`, { method: "DELETE" });
    router.push("/admin/ads");
    router.refresh();
  };

  if (loading) return <p className="text-sm text-slate-400">Loading…</p>;

  const input =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30";

  const ctr = stats && stats.impressions ? ((stats.clicks / stats.impressions) * 100).toFixed(1) : "0.0";
  const topCountries = stats
    ? Object.entries(stats.impByCountry).sort((a, b) => b[1] - a[1]).slice(0, 6)
    : [];

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin/ads" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
        <ArrowLeft className="h-4 w-4" /> Back to ads
      </Link>
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">{adId ? "Edit ad" : "New ad"}</h1>

      {/* Stats */}
      {adId && stats && (
        <div className="mt-5 grid grid-cols-3 gap-3">
          <StatBox icon={<Eye className="h-4 w-4" />} label="Impressions" value={stats.impressions} />
          <StatBox icon={<MousePointerClick className="h-4 w-4" />} label="Clicks" value={stats.clicks} />
          <StatBox icon={<ArrowRight className="h-4 w-4" />} label="CTR" value={`${ctr}%`} />
        </div>
      )}
      {adId && topCountries.length > 0 && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Impressions by country</p>
          <div className="mt-2 flex flex-wrap gap-3">
            {topCountries.map(([cc, n]) => (
              <span key={cc} className="inline-flex items-center gap-1.5 text-sm text-slate-700">
                {flag(cc) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={flag(cc)} width={18} height={13} alt={cc} className="h-3 w-[18px] rounded-[2px] object-cover ring-1 ring-black/10" />
                )}
                {cc || "??"} · <span className="font-semibold">{n}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-600">{error}</div>}

      <div className="mt-6 space-y-4">
        <Field label="Name (internal)">
          <input className={input} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Home top banner" />
        </Field>

        <div>
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">Ad type</span>
          <div className="grid grid-cols-2 gap-3">
            {(["adsense", "custom"] as AdType[]).map((t) => (
              <button key={t} type="button" onClick={() => set("type", t)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${form.type === t ? "border-brand-300 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-slate-600"}`}>
                {t === "adsense" ? <Megaphone className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                {t === "adsense" ? "Google AdSense" : "Custom ad"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Placement">
            <select className={input} value={form.placement} onChange={(e) => set("placement", e.target.value as Placement)}>
              {PLACEMENTS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </Field>
          <Field label="Show on">
            <select className={input} value={form.scope} onChange={(e) => set("scope", e.target.value as Scope)}>
              {SCOPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>
        </div>

        {form.scope === "path" && (
          <Field label="Path prefix" hint="e.g. /blog — the ad shows on pages starting with this">
            <input className={`${input} font-mono`} value={form.pathPrefix} onChange={(e) => set("pathPrefix", e.target.value)} placeholder="/blog" />
          </Field>
        )}

        {form.type === "adsense" ? (
          <Field label="AdSense slot ID" hint="From the ad unit you created in AdSense">
            <input className={input} value={form.adsenseSlot} onChange={(e) => set("adsenseSlot", e.target.value)} placeholder="1234567890" />
          </Field>
        ) : (
          <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
            <div>
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Format</span>
              <div className="grid grid-cols-3 gap-2">
                {CUSTOM_FORMATS.map((f) => (
                  <button key={f.value} type="button" onClick={() => set("customFormat", f.value)}
                    className={`rounded-lg border px-2 py-2 text-xs font-semibold transition-colors ${form.customFormat === f.value ? "border-brand-300 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-slate-600"}`}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            {form.customFormat !== "text" && (
              <Field label="Image URL">
                <input className={input} value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://…/banner.png" />
              </Field>
            )}
            {form.customFormat !== "image" && (
              <>
                <Field label="Title">
                  <input className={input} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Get 50% off fast fiber" />
                </Field>
                <Field label="Description">
                  <textarea className={`${input} resize-y`} rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Short sentence about the offer." />
                </Field>
              </>
            )}
            <Field label="Link URL">
              <input className={input} value={form.link} onChange={(e) => set("link", e.target.value)} placeholder="https://advertiser.com" />
            </Field>

            {/* Live preview */}
            <div>
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Preview</span>
              <CustomPreview form={form} />
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Order" hint="Lower shows first when several match a spot">
            <input type="number" className={input} value={form.order} onChange={(e) => set("order", e.target.value)} />
          </Field>
          <div className="flex items-end">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">
              <input type="checkbox" checked={form.enabled} onChange={(e) => set("enabled", e.target.checked)} className="h-5 w-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
              Active
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 border-t border-slate-200 pt-5">
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save ad
        </button>
        {adId && (
          <button onClick={remove} className="ml-auto inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        )}
      </div>
    </div>
  );
}

function CustomPreview({ form }: { form: Form }) {
  // key forces a fresh CustomAdCard (and image-error reset) when the URL changes.
  return (
    <CustomAdCard
      key={`${form.customFormat}-${form.image}`}
      image={form.image}
      title={form.title}
      description={form.description}
      customFormat={form.customFormat}
      preview
    />
  );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
      <div className="flex items-center justify-center gap-1.5 text-slate-400">{icon}<span className="text-[11px] font-semibold uppercase tracking-wider">{label}</span></div>
      <p className="mt-1 text-xl font-extrabold tabular-nums text-slate-900">{value}</p>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}
