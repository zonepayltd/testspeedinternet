"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Save, Loader2, Search, BarChart3, ShieldCheck, Check, Smartphone, MonitorPlay } from "lucide-react";

type Config = {
  googleVerification: string;
  bingVerification: string;
  gaMeasurementId: string;
  turnstileSiteKey: string;
  turnstileSecret: string;
  appGooglePlay: string;
  appApple: string;
  appAmazon: string;
  appApk: string;
  adsenseClient: string;
  adsEnabled: boolean;
  adsPersonalized: boolean;
  adTopSlot: string;
  adInContentSlot: string;
  adSidebarLeftSlot: string;
  adSidebarRightSlot: string;
  adFooterSlot: string;
};

const EMPTY: Config = {
  googleVerification: "",
  bingVerification: "",
  gaMeasurementId: "",
  turnstileSiteKey: "",
  turnstileSecret: "",
  appGooglePlay: "",
  appApple: "",
  appAmazon: "",
  appApk: "",
  adsenseClient: "",
  adsEnabled: false,
  adsPersonalized: true,
  adTopSlot: "",
  adInContentSlot: "",
  adSidebarLeftSlot: "",
  adSidebarRightSlot: "",
  adFooterSlot: "",
};

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<Config>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => d.ok && setConfig({ ...EMPTY, ...d.config }))
      .catch(() => setError("Could not load settings"))
      .finally(() => setLoading(false));
  }, []);

  const set = (k: keyof Config, v: string | boolean) => {
    setConfig((c) => ({ ...c, [k]: v }));
    setSaved(false);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const d = await res.json();
      if (d.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else setError(d.error || "Save failed");
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const input =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30";

  if (loading) return <p className="text-sm text-slate-400">Loading…</p>;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Settings</h1>
      <p className="mt-1 text-sm text-slate-500">Connect search consoles, analytics and the captcha.</p>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-600">{error}</div>
      )}

      <div className="mt-6 space-y-5">
        {/* Search consoles */}
        <Section icon={Search} title="Search consoles" desc="Paste the verification codes (the content value of the meta tag).">
          <Field label="Google Search Console" hint="From the HTML tag method (content value only)">
            <input className={input} value={config.googleVerification} onChange={(e) => set("googleVerification", e.target.value)} placeholder="e.g. Ab12Cd34…" />
          </Field>
          <Field label="Bing Webmaster Tools" hint="msvalidate.01 content value">
            <input className={input} value={config.bingVerification} onChange={(e) => set("bingVerification", e.target.value)} placeholder="e.g. 1A2B3C…" />
          </Field>
        </Section>

        {/* Analytics */}
        <Section icon={BarChart3} title="Google Analytics (GA4)" desc="Adds the GA4 tag to every public page.">
          <Field label="Measurement ID">
            <input className={input} value={config.gaMeasurementId} onChange={(e) => set("gaMeasurementId", e.target.value)} placeholder="G-XXXXXXXXXX" />
          </Field>
        </Section>

        {/* Captcha */}
        <Section icon={ShieldCheck} title="Cloudflare Turnstile (captcha)" desc="Protects the admin login and contact form. Get keys at dash.cloudflare.com → Turnstile.">
          <Field label="Site key (public)">
            <input className={input} value={config.turnstileSiteKey} onChange={(e) => set("turnstileSiteKey", e.target.value)} placeholder="0x4AAAAAAA…" />
          </Field>
          <Field label="Secret key (kept private)">
            <input type="password" className={input} value={config.turnstileSecret} onChange={(e) => set("turnstileSecret", e.target.value)} placeholder="0x4AAAAAAA…" />
          </Field>
        </Section>

        {/* App downloads */}
        <Section icon={Smartphone} title="App downloads" desc="Links shown in the footer. Leave a field empty to show “Coming soon”.">
          <Field label="Google Play URL">
            <input className={input} value={config.appGooglePlay} onChange={(e) => set("appGooglePlay", e.target.value)} placeholder="https://play.google.com/store/apps/details?id=…" />
          </Field>
          <Field label="Apple App Store URL">
            <input className={input} value={config.appApple} onChange={(e) => set("appApple", e.target.value)} placeholder="https://apps.apple.com/app/…" />
          </Field>
          <Field label="Amazon Appstore URL">
            <input className={input} value={config.appAmazon} onChange={(e) => set("appAmazon", e.target.value)} placeholder="https://www.amazon.com/dp/…" />
          </Field>
          <Field label="Direct APK download URL" hint="A direct link to your .apk file">
            <input className={input} value={config.appApk} onChange={(e) => set("appApk", e.target.value)} placeholder="https://…/testspeedinternet.apk" />
          </Field>
        </Section>

        {/* AdSense */}
        <Section icon={MonitorPlay} title="Google AdSense" desc="Add your publisher ID for verification, then turn on the ad slots you want to show.">
          <Field label="Publisher ID (client)" hint="From AdSense → Account. Looks like ca-pub-XXXXXXXXXXXXXXXX">
            <input className={input} value={config.adsenseClient} onChange={(e) => set("adsenseClient", e.target.value)} placeholder="ca-pub-XXXXXXXXXXXXXXXX" />
          </Field>

          <Toggle
            label="Show ads on the site"
            desc="Master switch. The AdSense verification script loads as soon as the Publisher ID is set, even while this is off."
            checked={config.adsEnabled}
            onChange={(v) => set("adsEnabled", v)}
          />
          <Toggle
            label="Personalized ads"
            desc="On = personalized (higher revenue). Off = non-personalized ads only."
            checked={config.adsPersonalized}
            onChange={(v) => set("adsPersonalized", v)}
          />

          <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-4 text-sm text-slate-600">
            Individual ad units, placements, page targeting and custom ads are managed in the{" "}
            <Link href="/admin/ads" className="font-semibold text-brand-600 hover:text-brand-700">
              Ads manager
            </Link>
            .
          </div>
        </Section>
      </div>

      <div className="mt-6 flex items-center gap-3 border-t border-slate-200 pt-5">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? "Saved" : "Save settings"}
        </button>
        <span className="text-xs text-slate-400">Changes apply to the live site within ~1 minute.</span>
      </div>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{desc}</p>
        </div>
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function Toggle({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-100 bg-white px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {desc && <p className="mt-0.5 text-xs text-slate-400">{desc}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-brand-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}
