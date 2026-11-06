"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronRight,
  CircleDashed,
  Copy,
  ExternalLink,
  Link2,
  Plus,
  RefreshCw,
  Trash2,
  XCircle,
} from "lucide-react";
import { Badge, Button, IconButton, Select, api, inputCls, useAdminUI } from "@/components/admin/ui";
import { SOCIAL_PLATFORMS } from "@/lib/socials";
import { COMPANY } from "@/lib/company";
import { ExtLink, Note, Section, SecretField, SetPill, TextField, ToggleField, extractMetaContent, isUrl, validators } from "./fields";
import type { Check, Checks, Config, EnvInfo, SetFn } from "./types";

export type TabId = "general" | "search" | "ads" | "captcha" | "apps" | "social" | "trustpilot" | "data";

/** Every validation problem, tagged with the tab it lives on. */
export function collectErrors(c: Config): { tab: TabId; label: string }[] {
  const out: { tab: TabId; label: string }[] = [];
  const push = (tab: TabId, label: string, err: string | null) => err && out.push({ tab, label });
  push("search", "Google verification", validators.token(c.googleVerification.trim()));
  push("search", "Bing verification", validators.token(c.bingVerification.trim()));
  push("search", "Analytics ID", validators.ga(c.gaMeasurementId.trim()));
  push("ads", "AdSense publisher ID", validators.adsense(c.adsenseClient.trim()));
  (["appGooglePlay", "appApple", "appAmazon", "appApk"] as const).forEach((k) => push("apps", k, validators.url(c[k].trim())));
  c.socials.forEach((s, i) => push("social", `Social link #${i + 1}`, s.url.trim() ? validators.url(s.url.trim()) : null));
  push("trustpilot", "Trustpilot URL", validators.url(c.trustpilotUrl.trim()));
  return out;
}

type TabProps = { config: Config; set: SetFn; env: EnvInfo | null; dirty: boolean; goTo: (t: TabId) => void };

/* --------------------------------- General --------------------------------- */

function CopyRow({ label, value, href }: { label: string; value: string; href?: string }) {
  const { toast } = useAdminUI();
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</p>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="mt-0.5 block truncate text-sm font-medium text-slate-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-300">
            {value}
          </a>
        ) : (
          <p className="mt-0.5 truncate text-sm font-medium text-slate-900 dark:text-white">{value}</p>
        )}
      </div>
      <IconButton
        icon={Copy}
        label={`Copy ${label.toLowerCase()}`}
        onClick={() => {
          navigator.clipboard?.writeText(value).then(() => toast("Copied to clipboard", "info"), () => toast("Could not copy", "error"));
        }}
      />
    </div>
  );
}

function StatusRow({ label, on, detail, onClick }: { label: string; on: boolean; detail: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="group flex w-full items-center gap-3 px-5 py-3 text-start transition-colors hover:bg-slate-50 focus:outline-none focus-visible:bg-slate-50 dark:hover:bg-white/[0.02] dark:focus-visible:bg-white/[0.02]">
      {on ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" /> : <CircleDashed className="h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" aria-hidden="true" />}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-slate-800 dark:text-slate-100">{label}</span>
        <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{detail}</span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 dark:text-slate-600" aria-hidden="true" />
    </button>
  );
}

export function GeneralTab({ config: c, env, goTo }: TabProps) {
  const site = COMPANY.siteUrl;
  const apps = [c.appGooglePlay, c.appApple, c.appAmazon, c.appApk].filter(Boolean).length;
  return (
    <div className="space-y-6">
      <Section title="Brand & company" description="Defined in the code (src/lib/company.ts). Shown here for reference.">
        <CopyRow label="Brand" value={COMPANY.brand} />
        <CopyRow label="Legal name" value={COMPANY.legalName} />
        <CopyRow label="Site URL" value={site} href={site} />
        <CopyRow label="Contact email" value={COMPANY.email} href={`mailto:${COMPANY.email}`} />
      </Section>

      <Section title="Integrations" description="Overview of what's connected. Click a row to edit it.">
        <StatusRow label="Google Search Console" on={Boolean(c.googleVerification)} detail={c.googleVerification ? "Verification tag set" : "Not verified yet"} onClick={() => goTo("search")} />
        <StatusRow label="Bing Webmaster Tools" on={Boolean(c.bingVerification)} detail={c.bingVerification ? "Verification tag set" : "Not verified yet"} onClick={() => goTo("search")} />
        <StatusRow label="Google Analytics 4" on={Boolean(c.gaMeasurementId)} detail={c.gaMeasurementId || "No measurement ID"} onClick={() => goTo("search")} />
        <StatusRow label="Google AdSense" on={Boolean(c.adsenseClient)} detail={c.adsenseClient ? `${c.adsenseClient} · ads ${c.adsEnabled ? "on" : "off"}` : "No publisher ID"} onClick={() => goTo("ads")} />
        <StatusRow label="Slider captcha (built-in)" on detail="Login & contact form protected" onClick={() => goTo("captcha")} />
        <StatusRow label="App store links" on={apps > 0} detail={`${apps} of 4 links set`} onClick={() => goTo("apps")} />
        <StatusRow label="Social links" on={c.socials.length > 0} detail={`${c.socials.length} link${c.socials.length === 1 ? "" : "s"} in the footer`} onClick={() => goTo("social")} />
        <StatusRow label="Trustpilot" on={Boolean(c.trustpilotUrl)} detail={c.trustpilotUrl ? (c.trustpilotBusinessId ? "Profile + review widget" : "Profile link only") : "Not connected"} onClick={() => goTo("trustpilot")} />
      </Section>

      <Section title="Public files" description="Generated automatically from your content and settings.">
        <div className="grid gap-px bg-slate-100 dark:bg-white/[0.06] sm:grid-cols-2">
          {[
            ["/sitemap.xml", "Sitemap for search engines"],
            ["/robots.txt", "Crawler rules"],
            ["/ads.txt", "Authorized ad sellers"],
            ["/feed.xml", "Blog RSS feed"],
          ].map(([p, d]) => (
            <a key={p} href={p} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 bg-white px-5 py-3.5 transition-colors hover:bg-slate-50 dark:bg-ink-900 dark:hover:bg-white/[0.02]">
              <Link2 className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-[13px] font-medium text-slate-800 dark:text-slate-100">{p}</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">{d}</span>
              </span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-300 group-hover:text-slate-500 dark:text-slate-600" aria-hidden="true" />
            </a>
          ))}
        </div>
      </Section>
    </div>
  );
}

/* ------------------------------ Search engines ------------------------------ */

function CheckBadge({ check }: { check?: Check }) {
  if (!check) return null;
  if (!check.configured) return <Badge tone="slate">Not configured</Badge>;
  if (check.found == null) return <Badge tone="amber">Unknown</Badge>;
  return check.found ? (
    <Badge tone="green">
      <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> Live
    </Badge>
  ) : (
    <Badge tone="rose">
      <XCircle className="h-3 w-3" aria-hidden="true" /> Not found
    </Badge>
  );
}

function useLiveChecks() {
  const [checks, setChecks] = useState<Checks | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await api<{ checks: Checks }>("/api/admin/settings?check=1");
      setChecks(d.checks);
      if (d.checks.error) setError(d.checks.error);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Check failed");
    } finally {
      setLoading(false);
    }
  }, []);
  return { checks, loading, error, run };
}

export function SearchTab({ config: c, set, dirty }: TabProps) {
  const { checks, loading, error, run } = useLiveChecks();
  const site = COMPANY.siteUrl;
  const meta = (v: string) => extractMetaContent(v);
  return (
    <div className="space-y-6">
      <Section
        title="Search engine verification"
        description="Prove you own the site so you can see search traffic and submit the sitemap."
        actions={
          <Button size="sm" icon={RefreshCw} loading={loading} onClick={run}>
            Check live site
          </Button>
        }
      >
        <TextField
          label="Google Search Console"
          status={<CheckBadge check={checks?.google} />}
          help={
            <>
              In <ExtLink href="https://search.google.com/search-console">Search Console</ExtLink> add a URL-prefix property → <em>HTML tag</em>. Paste the <code className="font-mono">content</code> value (pasting the whole tag works too).
            </>
          }
          value={c.googleVerification}
          onChange={(v) => set("googleVerification", v)}
          transform={meta}
          placeholder="e.g. 3Xb9kQ…Zt4"
          validate={validators.token}
          mono
        />
        <TextField
          label="Bing Webmaster Tools"
          status={<CheckBadge check={checks?.bing} />}
          help={
            <>
              In <ExtLink href="https://www.bing.com/webmasters">Bing Webmaster Tools</ExtLink> choose <em>HTML Meta Tag</em> and paste the <code className="font-mono">msvalidate.01</code> content value. Tip: Bing can also import your site from Google.
            </>
          }
          value={c.bingVerification}
          onChange={(v) => set("bingVerification", v)}
          transform={meta}
          placeholder="e.g. 1A2B3C4D5E6F…"
          validate={validators.token}
          mono
        />
        <div className="px-5 py-4">
          <Note>
            <span>
              After verifying, submit <code className="break-all rounded bg-white px-1 py-0.5 font-mono text-[12px] ring-1 ring-slate-200 dark:bg-white/[0.06] dark:ring-white/10">{site}/sitemap.xml</code> in both consoles so all pages and languages get indexed.
            </span>
          </Note>
        </div>
      </Section>

      <Section title="Google Analytics 4" description="Adds the GA4 tag to every public page (not to the admin).">
        <TextField
          label="Measurement ID"
          status={<CheckBadge check={checks?.analytics} />}
          help={
            <>
              <ExtLink href="https://analytics.google.com/">Google Analytics</ExtLink> → Admin → Data streams → Web. Looks like <code className="font-mono">G-XXXXXXXXXX</code>.
            </>
          }
          value={c.gaMeasurementId}
          onChange={(v) => set("gaMeasurementId", v)}
          transform={(v) => v.trim().toUpperCase()}
          placeholder="G-XXXXXXXXXX"
          validate={validators.ga}
          mono
        />
      </Section>

      {(checks || error) && (
        <Note tone={error ? "warn" : "info"}>
          <span>
            {error ? `Could not check the live site: ${error}` : `Checked ${checks?.fetchedFrom} just now.`}
            {dirty && " You have unsaved changes — the check only sees saved settings."}
            {" "}Changes can take up to a minute to appear on the public site.
          </span>
        </Note>
      )}
    </div>
  );
}

/* ----------------------------------- Ads ----------------------------------- */

export function AdsTab({ config: c, set, dirty }: TabProps) {
  const [adsTxt, setAdsTxt] = useState<string | null>(null);
  const [loadingTxt, setLoadingTxt] = useState(false);
  const loadTxt = useCallback(() => {
    setLoadingTxt(true);
    fetch("/ads.txt", { cache: "no-store" })
      .then((r) => r.text())
      .then(setAdsTxt)
      .catch(() => setAdsTxt("# Could not load /ads.txt"))
      .finally(() => setLoadingTxt(false));
  }, []);
  // Reload on mount and right after a save (dirty → false).
  useEffect(() => {
    if (!dirty) loadTxt();
  }, [dirty, loadTxt]);

  const valid = !validators.adsense(c.adsenseClient.trim()) && c.adsenseClient.trim();
  const expected = valid ? `google.com, ${c.adsenseClient.trim().replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0` : "";
  const matches = expected && adsTxt?.trim() === expected;

  return (
    <div className="space-y-6">
      <Section title="Google AdSense" description="Connect your AdSense account and control how ads are shown.">
        <TextField
          label="Publisher ID"
          status={<SetPill on={Boolean(c.adsenseClient)} />}
          help={
            <>
              <ExtLink href="https://www.google.com/adsense/">AdSense</ExtLink> → Account → Account information. The verification script loads as soon as this is set.
            </>
          }
          value={c.adsenseClient}
          onChange={(v) => set("adsenseClient", v)}
          transform={(v) => {
            const t = v.trim();
            return /^pub-\d+$/.test(t) ? `ca-${t}` : t;
          }}
          placeholder="ca-pub-0000000000000000"
          validate={validators.adsense}
          mono
        />
        <ToggleField label="Show ads on the site" help="Master switch for every ad placement (AdSense and custom ads)." checked={c.adsEnabled} onChange={(v) => set("adsEnabled", v)} />
        <ToggleField label="Personalized ads" help="On = personalized ads (higher revenue). Off = request non-personalized ads only." checked={c.adsPersonalized} onChange={(v) => set("adsPersonalized", v)} />
      </Section>

      <Section
        title="ads.txt"
        description="Served automatically at /ads.txt from your publisher ID."
        actions={
          <>
            <Button size="sm" icon={RefreshCw} loading={loadingTxt} onClick={loadTxt}>
              Refresh
            </Button>
            <a href="/ads.txt" target="_blank" rel="noopener noreferrer" className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]">
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /> Open
            </a>
          </>
        }
      >
        <div className="space-y-3 px-5 py-4">
          <pre className="overflow-x-auto rounded-xl bg-slate-950 px-4 py-3 font-mono text-[12.5px] leading-relaxed text-slate-100 dark:bg-black/40">{adsTxt ?? "Loading…"}</pre>
          {expected && !matches && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              After saving, ads.txt will read: <code className="font-mono">{expected}</code> (updates within ~5 minutes because of caching).
            </p>
          )}
          {matches && (
            <p className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> ads.txt matches your publisher ID.
            </p>
          )}
        </div>
      </Section>

      <Note>
        <span>
          Ad units, placements, page targeting and custom image/script ads are managed in the{" "}
          <Link href="/admin/ads" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
            Ads manager
          </Link>
          .
        </span>
      </Note>
    </div>
  );
}

/* --------------------------------- Captcha --------------------------------- */

export function CaptchaTab(_props: TabProps) {
  return (
    <div className="space-y-6">
      <Section
        title="Built-in slider captcha"
        description="Visitors drag a puzzle piece into place to prove they are human. It runs on your own server — no Cloudflare, Google or other third-party service, and no tracking cookies."
        actions={<Badge tone="green">Active</Badge>}
      >
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li>• Protects the <b>contact form</b> (all 5 languages) and the <b>admin login</b>.</li>
          <li>• A new random picture every time; the correct position is encrypted on the server, so bots can&apos;t read it.</li>
          <li>• Checks that the slider was moved like a human, and each pass works only once (valid 3 minutes).</li>
          <li>• Works with mouse, touch and keyboard (arrow keys + Enter).</li>
        </ul>
        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">Nothing to configure. Optional: set a <code className="font-mono">CAPTCHA_SECRET</code> environment variable on the host to use a dedicated encryption key (otherwise the admin session secret is used).</p>
      </Section>
    </div>
  );
}

/* ---------------------------------- Apps ----------------------------------- */

export function AppsTab({ config: c, set }: TabProps) {
  const rows: { k: "appGooglePlay" | "appApple" | "appAmazon" | "appApk"; label: string; ph: string; help: string }[] = [
    { k: "appGooglePlay", label: "Google Play", ph: "https://play.google.com/store/apps/details?id=…", help: "Android listing URL." },
    { k: "appApple", label: "Apple App Store", ph: "https://apps.apple.com/app/…", help: "iPhone / iPad listing URL." },
    { k: "appAmazon", label: "Amazon Appstore", ph: "https://www.amazon.com/dp/…", help: "Fire tablets & Fire TV." },
    { k: "appApk", label: "Direct APK download", ph: "https://…/testspeedinternet.apk", help: "A direct link to the .apk file." },
  ];
  return (
    <Section title="App downloads" description="Badges shown in the footer. Leave a field empty to show “Coming soon”.">
      {rows.map((r) => (
        <TextField
          key={r.k}
          label={r.label}
          status={<SetPill on={Boolean(c[r.k])} />}
          help={
            <>
              {r.help}
              {c[r.k] && isUrl(c[r.k]) && (
                <>
                  {" "}
                  <ExtLink href={c[r.k]}>Test link</ExtLink>
                </>
              )}
            </>
          }
          value={c[r.k]}
          onChange={(v) => set(r.k, v)}
          placeholder={r.ph}
          validate={validators.url}
        />
      ))}
    </Section>
  );
}

/* --------------------------------- Socials --------------------------------- */

export function SocialTab({ config: c, set }: TabProps) {
  const list = c.socials;
  const update = (next: typeof list) => set("socials", next);
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    update(next);
  };
  const used = new Set(list.map((s) => s.platform));
  const nextPlatform = SOCIAL_PLATFORMS.find((p) => !used.has(p.value))?.value || "website";

  return (
    <Section
      title="Social links"
      description="Icons shown in the footer, in this order. Empty rows are dropped on save."
      actions={
        <Button size="sm" icon={Plus} onClick={() => update([...list, { platform: nextPlatform, url: "" }])}>
          Add link
        </Button>
      }
    >
      {list.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">No social links yet</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Add the networks you actually use.</p>
          <Button className="mt-4" variant="primary" icon={Plus} onClick={() => update([{ platform: "facebook", url: "" }])}>
            Add social link
          </Button>
        </div>
      ) : (
        <ol>
          {list.map((s, i) => {
            const err = s.url.trim() ? validators.url(s.url.trim()) : null;
            return (
              <li key={i} className="border-b border-slate-100 px-5 py-3 last:border-0 dark:border-white/[0.06]">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-5 shrink-0 text-center text-xs font-semibold tabular-nums text-slate-400">{i + 1}</span>
                    <Select
                      value={s.platform}
                      onChange={(v) => update(list.map((x, k) => (k === i ? { ...x, platform: v } : x)))}
                      options={SOCIAL_PLATFORMS}
                      className="sm:w-44"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center gap-1">
                    <input
                      value={s.url}
                      onChange={(e) => update(list.map((x, k) => (k === i ? { ...x, url: e.target.value } : x)))}
                      placeholder="https://…"
                      aria-label={`URL for social link ${i + 1}`}
                      aria-invalid={Boolean(err)}
                      spellCheck={false}
                      className={`${inputCls} min-w-0 flex-1 ${err ? "border-rose-300 dark:border-rose-400/40" : ""}`}
                    />
                    <IconButton icon={ArrowUp} label="Move up" disabled={i === 0} onClick={() => move(i, -1)} />
                    <IconButton icon={ArrowDown} label="Move down" disabled={i === list.length - 1} onClick={() => move(i, 1)} />
                    <IconButton icon={Trash2} label="Remove link" variant="danger-ghost" onClick={() => update(list.filter((_, k) => k !== i))} />
                  </div>
                </div>
                {err && <p className="mt-1.5 ps-7 text-xs font-medium text-rose-600 dark:text-rose-400">{err}</p>}
              </li>
            );
          })}
        </ol>
      )}
    </Section>
  );
}

/* -------------------------------- Trustpilot -------------------------------- */

export function TrustpilotTab({ config: c, set }: TabProps) {
  return (
    <Section title="Trustpilot" description="Show a Trustpilot link and live review widget in the footer once you've claimed your profile.">
      <TextField
        label="Profile URL"
        status={<SetPill on={Boolean(c.trustpilotUrl)} />}
        help={
          <>
            Your public review page. Claim it at <ExtLink href="https://business.trustpilot.com/">Trustpilot Business</ExtLink>.
          </>
        }
        value={c.trustpilotUrl}
        onChange={(v) => set("trustpilotUrl", v)}
        placeholder="https://www.trustpilot.com/review/testspeedinternet.com"
        validate={validators.url}
      />
      <TextField
        label="Business Unit ID"
        status={<SetPill on={Boolean(c.trustpilotBusinessId)} />}
        help="Trustpilot Business → Integrations → TrustBox. Needed to load the star rating automatically; leave empty to show only the link."
        value={c.trustpilotBusinessId}
        onChange={(v) => set("trustpilotBusinessId", v.trim())}
        placeholder="e.g. 5f2a9c0e8d1b2a0001c3d4e5"
        mono
      />
    </Section>
  );
}

