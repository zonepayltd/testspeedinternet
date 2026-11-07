"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, AtSign, Building2, KeyRound, Database, Loader2, Megaphone, Save, Search, Settings, Share2, ShieldCheck, Smartphone, Star, type LucideIcon } from "lucide-react";
import { Button, PageHeader, Skeleton, api, useAdminUI } from "@/components/admin/ui";
import DataManager from "./DataManager";
import SecurityPanel from "./SecurityPanel";
import EmailPanel from "./EmailPanel";
import { AdsTab, AppsTab, CaptchaTab, GeneralTab, SearchTab, SocialTab, TrustpilotTab, collectErrors, type TabId } from "./sections";
import { EMPTY_CONFIG, type Config, type EnvInfo, type SetFn } from "./types";

const TABS: { id: TabId; label: string; icon: LucideIcon; desc: string }[] = [
  { id: "general", label: "General", icon: Building2, desc: "Brand info and integration overview" },
  { id: "search", label: "Search engines", icon: Search, desc: "Search Console, Bing and Google Analytics" },
  { id: "ads", label: "Ads", icon: Megaphone, desc: "AdSense publisher ID and ad switches" },
  { id: "email", label: "Email", icon: AtSign, desc: "Mail server for confirmation and password-reset emails (Neo mail)" },
  { id: "security", label: "Login & security", icon: KeyRound, desc: "Admin username and password (Firebase)" },
  { id: "captcha", label: "Captcha", icon: ShieldCheck, desc: "Built-in slider puzzle" },
  { id: "apps", label: "Apps", icon: Smartphone, desc: "App store download links" },
  { id: "social", label: "Social links", icon: Share2, desc: "Footer social icons" },
  { id: "trustpilot", label: "Trustpilot", icon: Star, desc: "Reviews profile and widget" },
  { id: "data", label: "Data & privacy", icon: Database, desc: "Counts, exports and bulk deletes" },
];

const isTab = (v: string): v is TabId => TABS.some((t) => t.id === v);
const tabUrl = (t: TabId) => (t === "data" ? "/admin/settings/data" : t === "general" ? "/admin/settings" : `/admin/settings#${t}`);

export default function SettingsView({ initialTab = "general" }: { initialTab?: TabId }) {
  const { toast, confirm } = useAdminUI();
  const [tab, setTab] = useState<TabId>(initialTab);
  const [config, setConfig] = useState<Config>(EMPTY_CONFIG);
  const [saved, setSaved] = useState<Config>(EMPTY_CONFIG);
  const [env, setEnv] = useState<EnvInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const d = await api<{ config: Partial<Config>; env?: EnvInfo }>("/api/admin/settings");
      const c = { ...EMPTY_CONFIG, ...d.config, socials: Array.isArray(d.config.socials) ? d.config.socials : [] };
      setConfig(c);
      setSaved(c);
      setEnv(d.env || null);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Could not load settings");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  // Hash deep links (#ads, #captcha…) on /admin/settings.
  useEffect(() => {
    const h = window.location.hash.slice(1);
    if (initialTab !== "data" && isTab(h)) setTab(h);
  }, [initialTab]);

  const goTo = useCallback((t: TabId) => {
    setTab(t);
    window.history.replaceState(null, "", tabUrl(t));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Keep the active tab visible in the horizontal mobile scroller.
  useEffect(() => {
    document.querySelector(`[data-settings-tab="${tab}"]`)?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [tab]);

  const set: SetFn = useCallback((k, v) => setConfig((c) => ({ ...c, [k]: v })), []);

  const dirty = useMemo(() => JSON.stringify(config) !== JSON.stringify(saved), [config, saved]);
  const errors = useMemo(() => collectErrors(config), [config]);
  const errorTabs = useMemo(() => new Set(errors.map((e) => e.tab)), [errors]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const fn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", fn);
    return () => window.removeEventListener("beforeunload", fn);
  }, [dirty]);

  const save = async () => {
    if (errors.length) {
      toast(`Fix ${errors.length} invalid field${errors.length === 1 ? "" : "s"} first`, "error");
      goTo(errors[0].tab);
      return;
    }
    setSaving(true);
    try {
      const body: Config = { ...config, socials: config.socials.filter((s) => s.url.trim()) };
      await api("/api/admin/settings", { method: "PUT", json: body });
      setConfig(body);
      setSaved(body);
      toast("Settings saved — live on the site within a minute");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const discard = async () => {
    if (await confirm({ title: "Discard unsaved changes?", message: "Your edits will be reverted to the last saved settings.", confirmLabel: "Discard" })) {
      setConfig(saved);
      toast("Changes discarded", "info");
    }
  };

  const current = TABS.find((t) => t.id === tab)!;
  const props = { config, set, env, dirty, goTo };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Settings" description="Integrations, site options and data management." icon={Settings} />

      <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
        {/* Tab navigation: horizontal scroller on mobile, vertical list on desktop */}
        <nav aria-label="Settings sections" className="-mx-4 mb-6 overflow-x-auto px-4 lg:sticky lg:top-20 lg:mx-0 lg:mb-0 lg:self-start lg:overflow-visible lg:px-0">
          <ul role="tablist" className="flex gap-1 border-b border-slate-200 pb-px dark:border-white/[0.08] lg:flex-col lg:border-0 lg:pb-0">
            {TABS.map((t) => {
              const active = t.id === tab;
              const Icon = t.icon;
              return (
                <li key={t.id} className="shrink-0">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={active}
                    data-settings-tab={t.id}
                    onClick={() => goTo(t.id)}
                    className={`relative flex w-full items-center gap-2.5 whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 lg:rounded-lg ${
                      active
                        ? "text-slate-900 after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:rounded-full after:bg-brand-600 dark:text-white lg:bg-white lg:shadow-sm lg:ring-1 lg:ring-slate-200/80 lg:after:hidden dark:lg:bg-white/[0.06] dark:lg:ring-white/[0.08]"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white lg:hover:bg-slate-100/70 dark:lg:hover:bg-white/[0.04]"
                    } ${t.id === "data" ? "lg:mt-3" : ""}`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${active ? "text-brand-600 dark:text-brand-400" : "text-slate-400"}`} aria-hidden="true" />
                    {t.label}
                    {errorTabs.has(t.id) && <span className="ms-auto h-1.5 w-1.5 rounded-full bg-rose-500" aria-label="has errors" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="min-w-0">
          <div className="mb-4">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">{current.label}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{current.desc}</p>
          </div>

          {tab === "data" ? (
            <DataManager />
          ) : tab === "security" ? (
            <SecurityPanel />
          ) : tab === "email" ? (
            <EmailPanel />
          ) : loading ? (
            <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-white/[0.08] dark:bg-ink-900">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="grid gap-3 md:grid-cols-[2fr_3fr]">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ))}
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-10 text-center dark:border-rose-400/20 dark:bg-rose-400/10">
              <AlertTriangle className="h-6 w-6 text-rose-500" aria-hidden="true" />
              <p className="text-sm font-medium text-rose-700 dark:text-rose-300">{loadError}</p>
              <Button onClick={load}>Retry</Button>
            </div>
          ) : (
            <>
              {tab === "general" && <GeneralTab {...props} />}
              {tab === "search" && <SearchTab {...props} />}
              {tab === "ads" && <AdsTab {...props} />}
              {tab === "captcha" && <CaptchaTab {...props} />}
              {tab === "apps" && <AppsTab {...props} />}
              {tab === "social" && <SocialTab {...props} />}
              {tab === "trustpilot" && <TrustpilotTab {...props} />}
            </>
          )}

          {/* Sticky save bar */}
          <div className={`sticky bottom-4 z-30 mt-6 transition-all duration-200 ${dirty ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`} aria-hidden={!dirty}>
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-xl shadow-slate-900/10 backdrop-blur dark:border-white/10 dark:bg-ink-900/95 dark:shadow-black/40 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
                Unsaved changes
                {errors.length > 0 && (
                  <span className="text-xs font-normal text-rose-600 dark:text-rose-400">
                    · {errors.length} invalid field{errors.length === 1 ? "" : "s"}
                  </span>
                )}
              </p>
              <div className="flex gap-2">
                <Button onClick={discard} disabled={saving} tabIndex={dirty ? 0 : -1} className="flex-1 sm:flex-none">
                  Discard
                </Button>
                <Button variant="primary" icon={saving ? Loader2 : Save} loading={saving} onClick={save} tabIndex={dirty ? 0 : -1} className="flex-1 sm:flex-none">
                  Save changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
