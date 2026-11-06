import Link from "next/link";
import {
  Activity,
  ArrowDownUp,
  ArrowRight,
  BookOpen,
  Cable,
  CircleCheck,
  Download,
  Gauge,
  Lightbulb,
  Router,
  Server,
  Signal,
  Upload,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react";
import SpeedTest from "@/components/SpeedTest";
import AdSlot from "@/components/ads/AdSlot";
import PageHero from "@/components/marketing/PageHero";
import SectionHead from "@/components/marketing/SectionHead";
import FaqList from "@/components/marketing/FaqList";
import ToolGrid from "@/components/marketing/ToolGrid";
import JsonLd, { faqJsonLd } from "@/components/marketing/JsonLd";
import { LOCALE_META, lp, pick, type Locale } from "@/i18n/config";
import { toolsMessages } from "@/i18n/messages/tools";
import { COMPANY } from "@/lib/company";

export type ToolSlug = "download" | "upload" | "ping" | "wifi";

export const TOOL_CONFIG: Record<
  ToolSlug,
  { path: string; mode: "full" | "download" | "upload" | "ping"; heroIcon: LucideIcon; icons: LucideIcon[] }
> = {
  download: { path: "/tools/download-speed-test", mode: "download", heroIcon: Download, icons: [Download, Gauge, Server, Lightbulb] },
  upload: { path: "/tools/upload-speed-test", mode: "upload", heroIcon: Upload, icons: [Upload, Gauge, Server, ArrowDownUp] },
  ping: { path: "/tools/ping-test", mode: "ping", heroIcon: Activity, icons: [Zap, Activity, Gauge, Cable] },
  wifi: { path: "/tools/wifi-speed-test", mode: "full", heroIcon: Wifi, icons: [Wifi, Signal, Cable, Router] },
};

/** Shared layout for the focused speed tools (download / upload / ping / WiFi). */
export default function SpeedToolPage({ locale, tool }: { locale: Locale; tool: ToolSlug }) {
  const t = pick(toolsMessages, locale);
  const p = t.pages[tool];
  const cfg = TOOL_CONFIG[tool];
  const inLanguage = LOCALE_META[locale].htmlLang;

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: p.meta.title,
    url: `${COMPANY.siteUrl}${lp(locale, cfg.path)}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    inLanguage,
    description: p.meta.description,
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: COMPANY.brand, url: COMPANY.siteUrl },
  };

  return (
    <>
      <JsonLd data={faqJsonLd(p.faqs, inLanguage)} />
      <JsonLd data={appJsonLd} />

      {/* Hero + test */}
      <PageHero backdrop eyebrow={p.badge} icon={cfg.heroIcon} titleLead={p.titleLead} titleHighlight={p.titleHighlight} intro={p.intro}>
        <div id="speed-test" className="mt-10 w-full max-w-5xl scroll-mt-24">
          <SpeedTest mode={cfg.mode} />
        </div>
        <AdSlot placement="afterResults" className="mt-6 w-full max-w-4xl" />
        <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
          {t.ui.highlights.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <CircleCheck className="h-4 w-4 text-accent-500" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </PageHero>

      {/* Key concepts */}
      <section className="section">
        <div className="container">
          <SectionHead kicker={t.ui.learnKicker} title={p.sectionsHeading} intro={p.sectionsIntro} />
          <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2">
            {p.sections.map((s, i) => {
              const Icon = cfg.icons[i] ?? Gauge;
              return (
                <div key={s.title} className="card p-6 sm:p-7">
                  <span className="icon-tile">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="h-card mt-5">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{s.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* In-depth guide + reference table */}
      <section className="section-alt">
        <div className="container grid max-w-6xl items-start gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h2 className="h-section">{p.guide.title}</h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {p.guide.paragraphs.map((para) => (
                <p key={para.slice(0, 40)}>{para}</p>
              ))}
            </div>
            <Link href={lp(locale, "/guides/good-internet-speed")} className="link mt-6 inline-flex items-center gap-1.5 text-sm">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              {t.ui.guideLink}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>
          <div className="card overflow-hidden">
            <div className="border-b border-slate-200/80 px-5 py-4 dark:border-white/[0.08]">
              <h3 className="h-card">{p.table.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{p.table.intro}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="table-pro">
                <thead>
                  <tr>
                    <th scope="col">{p.table.head[0]}</th>
                    <th scope="col">{p.table.head[1]}</th>
                  </tr>
                </thead>
                <tbody>
                  {p.table.rows.map(([a, b]) => (
                    <tr key={a}>
                      <td className={a.length < 14 ? "whitespace-nowrap" : undefined}><bdi>{a}</bdi></td>
                      <td className="font-semibold !text-slate-900 dark:!text-white">
                        <bdi className="tabular">{b}</bdi>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="section">
        <div className="container max-w-4xl">
          <SectionHead kicker={t.ui.tipsKicker} title={p.tips.title} />
          <ol className="mt-10 grid gap-3 sm:grid-cols-2">
            {p.tips.items.map((tip, i) => (
              <li key={tip} className="card flex items-start gap-3.5 p-4">
                <span className="tabular flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white dark:bg-brand-500">
                  {i + 1}
                </span>
                <span className="pt-0.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{tip}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-alt">
        <div className="container max-w-3xl">
          <SectionHead kicker={t.ui.faqKicker} title={p.faqHeading} />
          <FaqList items={p.faqs} className="mt-10" />
          <div className="mt-10 flex justify-center">
            <Link href={lp(locale, "/")} className="btn-secondary">
              <Gauge className="h-4 w-4" aria-hidden="true" />
              {t.ui.fullTest}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Other tools */}
      <section className="section">
        <div className="container max-w-6xl">
          <SectionHead title={t.ui.otherTitle} intro={t.ui.otherIntro} />
          <div className="mt-10">
            <ToolGrid locale={locale} exclude={[tool]} />
          </div>
        </div>
      </section>
    </>
  );
}
