"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Copy, Eye, Megaphone, RefreshCw, Save, ShieldCheck, Trash2 } from "lucide-react";
import { Button, Card, Select, Skeleton, Toggle, Segmented, inputCls, api, useAdminUI, fmtDateTime } from "@/components/admin/ui";
import {
  AD_TYPES,
  DEVICES,
  PLACEMENTS,
  SCOPES,
  adStatus,
  validateAd,
  type Ad,
  type AdType,
  type Device,
  type Placement,
  type Scope,
} from "@/lib/adsModel";
import { LOCALES, LOCALE_META, type Locale } from "@/i18n/config";
import AdPreview from "./ads/AdPreview";
import AdStats from "./ads/AdStats";
import ImageUpload from "./ads/ImageUpload";
import { StatusBadge, TYPE_META, fromLocalInput, toLocalInput } from "./ads/shared";

type Form = {
  name: string;
  type: AdType;
  placement: Placement;
  scope: Scope;
  pathPrefix: string;
  locales: Locale[];
  device: Device;
  startAt: number;
  endAt: number;
  enabled: boolean;
  order: string;
  adsenseSlot: string;
  image: string;
  alt: string;
  title: string;
  description: string;
  buttonText: string;
  link: string;
  html: string;
  width: string;
  height: string;
};

const EMPTY: Form = {
  name: "",
  type: "image",
  placement: "inContent",
  scope: "all",
  pathPrefix: "",
  locales: [],
  device: "all",
  startAt: 0,
  endAt: 0,
  enabled: true,
  order: "0",
  adsenseSlot: "",
  image: "",
  alt: "",
  title: "",
  description: "",
  buttonText: "",
  link: "",
  html: "",
  width: "0",
  height: "0",
};

const SIZE_PRESETS: { label: string; w: number; h: number }[] = [
  { label: "Responsive", w: 0, h: 0 },
  { label: "728×90", w: 728, h: 90 },
  { label: "970×90", w: 970, h: 90 },
  { label: "468×60", w: 468, h: 60 },
  { label: "300×250", w: 300, h: 250 },
  { label: "320×50", w: 320, h: 50 },
  { label: "320×100", w: 320, h: 100 },
  { label: "160×600", w: 160, h: 600 },
  { label: "300×600", w: 300, h: 600 },
];

const fromAd = (a: Ad): Form => ({
  name: a.name,
  type: a.type,
  placement: a.placement,
  scope: a.scope,
  pathPrefix: a.pathPrefix,
  locales: a.locales,
  device: a.device,
  startAt: a.startAt,
  endAt: a.endAt,
  enabled: a.enabled,
  order: String(a.order ?? 0),
  adsenseSlot: a.adsenseSlot,
  image: a.image,
  alt: a.alt,
  title: a.title,
  description: a.description,
  buttonText: a.buttonText,
  link: a.link,
  html: a.html,
  width: String(a.width || 0),
  height: String(a.height || 0),
});

const toPayload = (f: Form) => ({
  ...f,
  order: Number(f.order) || 0,
  width: Math.max(0, Number(f.width) || 0),
  height: Math.max(0, Number(f.height) || 0),
});

function useDebounced<T>(v: T, ms: number) {
  const [d, setD] = useState(v);
  useEffect(() => {
    const t = setTimeout(() => setD(v), ms);
    return () => clearTimeout(t);
  }, [v, ms]);
  return d;
}

export default function AdEditor({ adId }: { adId?: string }) {
  const router = useRouter();
  const { confirm, toast } = useAdminUI();
  const [form, setForm] = useState<Form>(EMPTY);
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(Boolean(adId));
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [cfg, setCfg] = useState<{ adsEnabled: boolean; adsenseClient: string } | null>(null);

  const load = useCallback(() => {
    if (!adId) return;
    setLoading(true);
    setLoadError(null);
    api<{ ad: Ad }>(`/api/admin/ads/${adId}`)
      .then((d) => {
        setAd(d.ad);
        setForm(fromAd(d.ad));
      })
      .catch((e) => setLoadError((e as Error).message))
      .finally(() => setLoading(false));
  }, [adId]);

  useEffect(load, [load]);
  useEffect(() => {
    fetch("/api/config", { cache: "no-store" })
      .then((r) => r.json())
      .then((c) => setCfg({ adsEnabled: Boolean(c?.adsEnabled), adsenseClient: c?.adsenseClient || "" }))
      .catch(() => {});
  }, []);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));
  const payload = toPayload(form);
  const validation = validateAd(payload);
  const status = adStatus(payload);

  // Debounce the preview for code edits so pasted scripts don't re-run on every keystroke.
  const previewHtml = useDebounced(form.html, 600);
  const previewAd = useMemo(
    () => ({ ...payload, html: previewHtml }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form.type, form.adsenseSlot, form.image, form.alt, form.title, form.description, form.buttonText, form.link, previewHtml, form.width, form.height],
  );

  const save = async () => {
    setTouched(true);
    if (validation) {
      setError(validation);
      return;
    }
    setError(null);
    setSaving(true);
    try {
      if (adId) {
        await api(`/api/admin/ads/${adId}`, { method: "PUT", json: payload });
        toast("Ad saved");
        load();
      } else {
        const r = await api<{ id: string }>("/api/admin/ads", { method: "POST", json: payload });
        toast("Ad created");
        router.replace(`/admin/ads/${r.id}`);
      }
    } catch (e) {
      setError((e as Error).message);
      toast((e as Error).message, "error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!adId) return;
    if (!(await confirm({ title: `Delete “${form.name || "this ad"}”?`, message: "The ad and its statistics are removed permanently.", confirmLabel: "Delete ad" }))) return;
    let deleteImage = false;
    if (ad?.imageId) {
      deleteImage = await confirm({
        title: "Also delete the uploaded image?",
        message: "The image is removed from storage unless another ad still uses it. Choose Cancel to keep it in the library.",
        confirmLabel: "Delete image",
      });
    }
    try {
      const r = await api<{ imagesDeleted: number }>(`/api/admin/ads/${adId}${deleteImage ? "?deleteImage=1" : ""}`, { method: "DELETE" });
      toast(r.imagesDeleted ? "Ad and image deleted" : "Ad deleted");
      router.push("/admin/ads");
    } catch (e) {
      toast((e as Error).message, "error");
    }
  };

  const duplicate = async () => {
    if (!adId) return;
    try {
      const r = await api<{ id: string }>("/api/admin/ads", { method: "POST", json: { duplicateOf: adId } });
      toast("Copy created (disabled)");
      router.push(`/admin/ads/${r.id}`);
    } catch (e) {
      toast((e as Error).message, "error");
    }
  };

  const resetStats = async () => {
    if (!adId) return;
    if (!(await confirm({ title: "Reset statistics?", message: "Impressions, clicks and country/day breakdowns for this ad go back to zero.", confirmLabel: "Reset stats" }))) return;
    setResetting(true);
    try {
      await api(`/api/admin/ads/${adId}`, { method: "PATCH", json: { resetStats: true } });
      toast("Statistics reset");
      load();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-96 w-full lg:col-span-5" />
      </div>
    );
  }
  if (loadError) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-400/20 dark:bg-rose-400/10">
        <AlertTriangle className="mx-auto h-6 w-6 text-rose-500" />
        <p className="mt-2 text-sm font-medium text-rose-700 dark:text-rose-300">{loadError}</p>
        <div className="mt-4 flex justify-center gap-2">
          <Link href="/admin/ads" className="text-sm font-medium text-slate-600 underline dark:text-slate-300">
            Back to ads
          </Link>
          <Button size="sm" icon={RefreshCw} onClick={load}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const placementMeta = PLACEMENTS.find((p) => p.value === form.placement);
  const showImage = form.type === "image" || form.type === "card";
  const showText = form.type === "card" || form.type === "text";
  const showLink = showImage || showText;
  const fieldErr = (cond: boolean) => (touched && cond ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10 dark:border-rose-400/40" : "");

  return (
    <div className="pb-24 lg:pb-0">
      <Link href="/admin/ads" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white">
        <ArrowLeft className="h-4 w-4" /> All ads
      </Link>

      <div className="mb-6 mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{adId ? form.name || "Edit ad" : "New ad"}</h1>
            <StatusBadge status={status} />
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {adId && ad ? `Last updated ${fmtDateTime(ad.updatedAt)}` : "Create an AdSense, image, card, text or script ad and choose where it shows."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {adId && (
            <>
              <Button icon={Copy} onClick={duplicate}>
                Duplicate
              </Button>
              <Button variant="danger-ghost" icon={Trash2} onClick={remove}>
                Delete
              </Button>
            </>
          )}
          <Button variant="primary" icon={Save} onClick={save} loading={saving} className="hidden lg:inline-flex">
            {adId ? "Save changes" : "Create ad"}
          </Button>
        </div>
      </div>

      {cfg && !cfg.adsEnabled && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Ads are switched off for the whole site. Turn on <strong>Show ads</strong> in{" "}
            <Link href="/admin/settings" className="font-semibold underline">
              Settings
            </Link>{" "}
            to display them.
          </span>
        </div>
      )}

      {error && (
        <div role="alert" className="mb-5 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-12">
        {/* ---------------- Form ---------------- */}
        <div className="min-w-0 space-y-5 lg:col-span-7">
          <Card title="Basics">
            <div className="space-y-5">
              <Field label="Name" hint="Only visible in the admin." htmlFor="ad-name">
                <input id="ad-name" className={`${inputCls} ${fieldErr(!form.name.trim())}`} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Fiber promo – home" maxLength={120} />
              </Field>
              <div>
                <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Ad type</span>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 2xl:grid-cols-5" role="radiogroup" aria-label="Ad type">
                  {AD_TYPES.map((t) => {
                    const Icon = TYPE_META[t.value].icon;
                    const on = form.type === t.value;
                    return (
                      <button
                        key={t.value}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => set("type", t.value)}
                        className={`flex flex-col items-start gap-1.5 rounded-xl border p-3 text-start transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20 ${on ? "border-brand-500 bg-brand-50/70 ring-1 ring-brand-500 dark:border-brand-400 dark:bg-brand-400/10 dark:ring-brand-400" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/[0.04]"}`}
                      >
                        <Icon className={`h-4 w-4 ${on ? "text-brand-600 dark:text-brand-300" : "text-slate-400"}`} aria-hidden="true" />
                        <span className={`text-sm font-semibold ${on ? "text-brand-700 dark:text-brand-200" : "text-slate-800 dark:text-slate-100"}`}>{t.label}</span>
                        <span className="text-[11px] leading-snug text-slate-500 dark:text-slate-400">{t.hint}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>

          <Card title="Creative" description={AD_TYPES.find((t) => t.value === form.type)?.hint}>
            <div className="space-y-4">
              {form.type === "adsense" && (
                <>
                  <Field label="AdSense slot ID" hint="The data-ad-slot number of the ad unit you created in AdSense." htmlFor="ad-slot">
                    <input id="ad-slot" inputMode="numeric" className={`${inputCls} font-mono ${fieldErr(!/^\d{6,}$/.test(form.adsenseSlot))}`} value={form.adsenseSlot} onChange={(e) => set("adsenseSlot", e.target.value.replace(/\s/g, ""))} placeholder="1234567890" />
                  </Field>
                  <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-white/[0.03] dark:text-slate-400">
                    Publisher ID (from Settings):{" "}
                    {cfg?.adsenseClient ? <span className="font-mono text-slate-700 dark:text-slate-200">{cfg.adsenseClient}</span> : <span className="font-semibold text-amber-600 dark:text-amber-400">not set — AdSense ads won&apos;t show until you add it in Settings</span>}
                  </p>
                </>
              )}

              {showImage && (
                <Field label={form.type === "image" ? "Banner image" : "Image"} hint={form.type === "image" ? "Shown at its natural size, up to the slot width. Typical: 728×90, 970×250, 300×250." : "Landscape works best (e.g. 1200×630)."}>
                  <ImageUpload value={form.image} onChange={(url) => set("image", url)} />
                </Field>
              )}
              {showImage && (
                <Field label="Alt text" hint="Describes the image for screen readers and SEO." htmlFor="ad-alt">
                  <input id="ad-alt" className={inputCls} value={form.alt} onChange={(e) => set("alt", e.target.value)} placeholder="Fiber internet 1 Gbps – 50% off" maxLength={200} />
                </Field>
              )}

              {showText && (
                <>
                  <Field label={form.type === "text" ? "Headline" : "Title"} htmlFor="ad-title">
                    <input id="ad-title" className={`${inputCls} ${fieldErr(!form.title.trim())}`} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Get 50% off fast fiber" maxLength={140} />
                  </Field>
                  <Field label="Text" htmlFor="ad-desc" hint={`${form.description.length}/500`}>
                    <textarea id="ad-desc" rows={3} className={`${inputCls} h-auto resize-y py-2`} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="One or two short sentences about the offer." maxLength={500} />
                  </Field>
                  <Field label="Button label" hint="Leave empty for “Learn more” (translated automatically)." htmlFor="ad-btn">
                    <input id="ad-btn" className={inputCls} value={form.buttonText} onChange={(e) => set("buttonText", e.target.value)} placeholder="Learn more" maxLength={40} />
                  </Field>
                </>
              )}

              {showLink && (
                <Field label="Link URL" hint="Opens in a new tab with rel=sponsored; UTM tags are added automatically." htmlFor="ad-link">
                  <input id="ad-link" type="url" className={`${inputCls} ${fieldErr(!/^https?:\/\//i.test(form.link) && !form.link.startsWith("/"))}`} value={form.link} onChange={(e) => set("link", e.target.value.trim())} placeholder="https://advertiser.com/offer" />
                </Field>
              )}

              {form.type === "html" && (
                <>
                  <Field label="Ad code (HTML / JavaScript)" hint={`${form.html.length.toLocaleString()} / 50,000 characters`} htmlFor="ad-html">
                    <textarea
                      id="ad-html"
                      rows={10}
                      spellCheck={false}
                      className={`${inputCls} h-auto resize-y py-2 font-mono text-xs leading-relaxed ${fieldErr(!form.html.trim())}`}
                      value={form.html}
                      onChange={(e) => set("html", e.target.value)}
                      placeholder={'<script async src="https://network.example/ad.js"></script>\n<div id="ad-container"></div>'}
                    />
                  </Field>
                  <div className="flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200">
                    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    Runs in a sandboxed frame: the code can show ads and open links, but can&apos;t read your site, cookies or visitors&apos; data. Impressions are tracked; clicks are estimated.
                  </div>
                  <div>
                    <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Size</span>
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {SIZE_PRESETS.map((p) => {
                        const on = Number(form.width) === p.w && Number(form.height) === p.h;
                        return (
                          <button
                            key={p.label}
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, width: String(p.w), height: String(p.h) }))}
                            className={`rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset transition-colors ${on ? "bg-brand-600 text-white ring-brand-600" : "text-slate-600 ring-slate-200 hover:bg-slate-50 dark:text-slate-300 dark:ring-white/10 dark:hover:bg-white/[0.05]"}`}
                          >
                            {p.label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Width (px)" hint="0 = full width" htmlFor="ad-w">
                        <input id="ad-w" type="number" min={0} max={2000} className={inputCls} value={form.width} onChange={(e) => set("width", e.target.value)} />
                      </Field>
                      <Field label="Height (px)" hint="0 = grows to fit the ad" htmlFor="ad-h">
                        <input id="ad-h" type="number" min={0} max={2000} className={inputCls} value={form.height} onChange={(e) => set("height", e.target.value)} />
                      </Field>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>

          <Card title="Targeting" description="Where and to whom the ad is shown">
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Placement" hint={placementMeta?.hint}>
                  <Select value={form.placement} onChange={(v) => set("placement", v)} options={PLACEMENTS} />
                </Field>
                <Field label="Pages">
                  <Select value={form.scope} onChange={(v) => set("scope", v)} options={SCOPES} />
                </Field>
              </div>
              {form.scope === "path" && (
                <Field label="Path prefix" hint="Matches in every language: /blog also matches /fr/blog and /ar/blog. Use the language filter below to restrict." htmlFor="ad-path">
                  <input id="ad-path" className={`${inputCls} font-mono ${fieldErr(!form.pathPrefix.startsWith("/"))}`} value={form.pathPrefix} onChange={(e) => set("pathPrefix", e.target.value.trim())} placeholder="/blog/5g" />
                </Field>
              )}
              <div>
                <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Languages</span>
                <div className="flex flex-wrap gap-1.5">
                  <Chip on={form.locales.length === 0} onClick={() => set("locales", [])}>
                    All languages
                  </Chip>
                  {LOCALES.map((l) => {
                    const on = form.locales.includes(l);
                    return (
                      <Chip key={l} on={on} onClick={() => set("locales", on ? form.locales.filter((x) => x !== l) : [...form.locales, l])}>
                        <span className="font-mono text-[10px] uppercase opacity-70">{l}</span> {LOCALE_META[l].english}
                      </Chip>
                    );
                  })}
                </div>
              </div>
              <div>
                <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Devices</span>
                <Segmented value={form.device} onChange={(v) => set("device", v)} options={DEVICES} />
                <p className="mt-1.5 text-xs text-slate-400">Mobile = screens narrower than 768px.</p>
              </div>
            </div>
          </Card>

          <Card title="Schedule & priority">
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Start" hint="Empty = starts immediately" htmlFor="ad-start">
                  <input id="ad-start" type="datetime-local" className={inputCls} value={toLocalInput(form.startAt)} onChange={(e) => set("startAt", fromLocalInput(e.target.value))} />
                </Field>
                <Field label="End" hint="Empty = runs until disabled" htmlFor="ad-end">
                  <input id="ad-end" type="datetime-local" className={`${inputCls} ${fieldErr(!!(form.startAt && form.endAt && form.endAt <= form.startAt))}`} value={toLocalInput(form.endAt)} onChange={(e) => set("endAt", fromLocalInput(e.target.value))} />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Priority" hint="Lower number wins when several ads match a slot; equal numbers rotate." htmlFor="ad-order">
                  <input id="ad-order" type="number" className={inputCls} value={form.order} onChange={(e) => set("order", e.target.value)} />
                </Field>
                <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 dark:border-white/10 sm:mt-6 sm:self-start">
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Enabled</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Status: {status}</p>
                  </div>
                  <Toggle checked={form.enabled} onChange={(v) => set("enabled", v)} label="Enabled" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ---------------- Preview + stats ---------------- */}
        <div className="min-w-0 space-y-5 lg:sticky lg:top-20 lg:col-span-5">
          <Card title="Live preview" icon={Eye} description={placementMeta?.label} bodyClassName="p-4">
            {validation && touched ? <p className="mb-3 text-xs text-amber-600 dark:text-amber-400">{validation}</p> : null}
            <AdPreview ad={previewAd} placement={form.placement} />
          </Card>
          {adId && ad && <AdStats ad={ad} onReset={resetStats} resetting={resetting} isScript={ad.type === "html"} />}
          {!adId && (
            <div className="flex items-start gap-2.5 rounded-xl border border-dashed border-slate-200 px-4 py-3 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
              <Megaphone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              Impressions, clicks and countries appear here after you create the ad.
            </div>
          )}
        </div>
      </div>

      {/* Mobile save bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-ink-900/95 lg:hidden">
        <Button variant="primary" icon={Save} onClick={save} loading={saving} className="w-full">
          {adId ? "Save changes" : "Create ad"}
        </Button>
      </div>
      {/* Desktop bottom save */}
      <div className="mt-6 hidden justify-end border-t border-slate-200 pt-5 dark:border-white/10 lg:flex">
        <Button variant="primary" icon={Save} onClick={save} loading={saving}>
          {adId ? "Save changes" : "Create ad"}
        </Button>
      </div>
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition-colors ${on ? "bg-brand-600 text-white ring-brand-600 dark:bg-brand-500 dark:ring-brand-500" : "text-slate-600 ring-slate-200 hover:bg-slate-50 dark:text-slate-300 dark:ring-white/10 dark:hover:bg-white/[0.05]"}`}
    >
      {children}
    </button>
  );
}

function Field({ label, hint, htmlFor, children }: { label: string; hint?: string; htmlFor?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{hint}</p>}
    </div>
  );
}
