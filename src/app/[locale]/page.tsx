import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  Download,
  Gauge,
  Globe,
  Laptop,
  Lock,
  MessageSquareText,
  MousePointerClick,
  Server,
  ShieldCheck,
  Smartphone,
  Upload,
  UserX,
  Wifi,
  Zap,
  BadgeCheck,
  Timer,
} from "lucide-react";
import SpeedTest from "@/components/SpeedTest";
import AdSlot from "@/components/ads/AdSlot";
import PostCard from "@/components/PostCard";
import PageHero from "@/components/marketing/PageHero";
import SectionHead from "@/components/marketing/SectionHead";
import FaqList from "@/components/marketing/FaqList";
import ToolGrid from "@/components/marketing/ToolGrid";
import CtaBanner from "@/components/marketing/CtaBanner";
import JsonLd, { faqJsonLd } from "@/components/marketing/JsonLd";
import { getPublishedPosts } from "@/lib/posts";
import { LOCALE_META, lp, pick } from "@/i18n/config";
import { localeFromParams, pageMetadata } from "@/i18n/server";
import { homeMessages } from "@/i18n/messages/home";
import { COMPANY } from "@/lib/company";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = pick(homeMessages, locale);
  return pageMetadata({
    locale,
    path: "/",
    title: t.meta.title,
    description: t.meta.description,
    keywords: t.meta.keywords,
    absoluteTitle: true,
  });
}

const TRUST_ICONS = [BadgeCheck, UserX, Lock, Smartphone];
const METRIC_ICONS = [Download, Upload, Zap, Activity];
const FEATURE_ICONS = [Timer, ShieldCheck, Laptop, Wifi, Globe, MessageSquareText];
const STEP_ICONS = [MousePointerClick, Server, BarChart3];

export default async function HomePage({ params }: Props) {
  const locale = await localeFromParams(params);
  const t = pick(homeMessages, locale);
  const inLanguage = LOCALE_META[locale].htmlLang;
  const latest = (await getPublishedPosts(locale)).slice(0, 6);

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: COMPANY.brand,
    url: `${COMPANY.siteUrl}${lp(locale, "/")}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    inLanguage,
    description: t.jsonLd.appDescription,
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: COMPANY.brand, url: COMPANY.siteUrl },
  };

  return (
    <>
      <JsonLd data={faqJsonLd(t.faq.items, inLanguage)} />
      <JsonLd data={appJsonLd} />

      {/* Hero: the speed test is the centerpiece */}
      <PageHero
        backdrop
        eyebrow={t.hero.eyebrow}
        icon={Zap}
        titleLead={t.hero.titleLead}
        titleHighlight={t.hero.titleHighlight}
        intro={t.hero.intro}
        className="!pb-12 !pt-10 md:!pb-16 md:!pt-14"
      >
        <div id="speed-test" className="mt-8 w-full max-w-5xl scroll-mt-24 sm:mt-10">
          <SpeedTest />
        </div>
        <AdSlot placement="afterResults" className="mt-6 w-full max-w-4xl" />
      </PageHero>

      {/* Trust strip */}
      <section aria-label={t.hero.eyebrow} className="border-y border-slate-200/70 bg-white dark:border-white/[0.06] dark:bg-ink-950">
        <div className="container max-w-6xl">
          <ul className="grid grid-cols-2 divide-slate-200/70 dark:divide-white/[0.06] lg:grid-cols-4 lg:divide-x lg:rtl:divide-x-reverse">
            {t.trust.map((item, i) => {
              const Icon = TRUST_ICONS[i] ?? ShieldCheck;
              return (
                <li key={item.title} className="flex items-center gap-3 px-2 py-5 sm:px-4 lg:justify-center">
                  <Icon className="h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* In-content ad */}
      <AdSlot placement="inContent" className="container max-w-4xl py-8" />

      {/* What the results mean */}
      <section className="section">
        <div className="container max-w-6xl">
          <SectionHead kicker={t.metrics.kicker} title={t.metrics.title} intro={t.metrics.intro} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.metrics.items.map((m, i) => {
              const Icon = METRIC_ICONS[i] ?? Gauge;
              return (
                <div key={m.name} className="card flex flex-col p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="icon-tile">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span dir="ltr" className="pill font-mono text-[11px]">
                      {m.unit}
                    </span>
                  </div>
                  <h3 className="h-card mt-5">{m.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{m.text}</p>
                  <p className="mt-5 flex items-center justify-between gap-2 border-t border-slate-100 pt-4 text-xs dark:border-white/[0.06]">
                    <span className="text-slate-500 dark:text-slate-400">{t.metrics.goodLabel}</span>
                    <span className="tabular font-semibold text-accent-600 dark:text-accent-400">{m.good}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-alt">
        <div className="container max-w-6xl">
          <SectionHead kicker={t.features.kicker} title={t.features.title} intro={t.features.intro} />
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-200/80 dark:border-white/[0.08] dark:bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-3">
            {t.features.items.map((f, i) => {
              const Icon = FEATURE_ICONS[i] ?? Gauge;
              return (
                <div key={f.title} className="bg-white p-6 dark:bg-ink-900 sm:p-7">
                  <Icon className="h-6 w-6 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                  <h3 className="h-card mt-4 text-base">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section">
        <div className="container max-w-6xl">
          <SectionHead kicker={t.steps.kicker} title={t.steps.title} intro={t.steps.intro} />
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {t.steps.items.map((s, i) => {
              const Icon = STEP_ICONS[i] ?? Gauge;
              return (
                <li key={s.title} className="card relative p-6 sm:p-7">
                  <div className="flex items-center gap-3">
                    <span className="icon-tile-solid">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="tabular text-sm font-bold text-slate-300 dark:text-slate-600">0{i + 1}</span>
                  </div>
                  <h3 className="h-card mt-5">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{s.text}</p>
                </li>
              );
            })}
          </ol>
          <div className="mt-10 text-center">
            <Link href={lp(locale, "/how-it-works")} className="link inline-flex items-center gap-1.5 text-sm">
              {t.steps.cta}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Speed needs */}
      <section className="section-alt">
        <div className="container grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="kicker">{t.needs.kicker}</p>
            <h2 className="h-section mt-3">{t.needs.title}</h2>
            <p className="lead mt-4">{t.needs.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#speed-test" className="btn-primary">
                <Gauge className="h-4 w-4" aria-hidden="true" />
                {t.needs.runCta}
              </a>
              <Link href={lp(locale, "/guides/good-internet-speed")} className="btn-secondary">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                {t.needs.guideCta}
              </Link>
            </div>
          </div>
          <div className="card overflow-hidden">
            <table className="table-pro">
              <thead>
                <tr>
                  <th scope="col">{t.needs.colUse}</th>
                  <th scope="col" className="!text-end">
                    {t.needs.colSpeed}
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.needs.rows.map((row) => (
                  <tr key={row.use}>
                    <td>{row.use}</td>
                    <td className="tabular whitespace-nowrap text-end font-semibold !text-slate-900 dark:!text-white"><bdi>{row.speed}</bdi></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Tools directory */}
      <section className="section">
        <div className="container max-w-6xl">
          <SectionHead kicker={t.tools.kicker} title={t.tools.title} intro={t.tools.intro} />
          <div className="mt-12">
            <ToolGrid locale={locale} exclude={["full"]} />
          </div>
        </div>
      </section>

      {/* Why test (long-form SEO copy) */}
      <section className="section-alt">
        <div className="container max-w-3xl">
          <h2 className="h-section">{t.about.title}</h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-[1.0625rem]">
            {t.about.paragraphs.map((para) => (
              <p key={para.slice(0, 40)}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Latest guides */}
      {latest.length > 0 && (
        <section className="section">
          <div className="container max-w-6xl">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <SectionHead align="start" kicker={t.guides.kicker} title={t.guides.title} intro={t.guides.intro} />
              <Link href={lp(locale, "/blog")} className="btn-secondary shrink-0">
                {t.guides.all}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((p) => (
                <PostCard key={p.slug} post={p} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className={latest.length > 0 ? "section-alt" : "section"}>
        <div className="container max-w-3xl">
          <SectionHead kicker={t.faq.kicker} title={t.faq.title} />
          <FaqList items={t.faq.items} className="mt-10" />
        </div>
      </section>

      <CtaBanner title={t.cta.title} text={t.cta.text} button={t.cta.button} href="#speed-test" />
    </>
  );
}
