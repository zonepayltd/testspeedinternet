import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDown,
  Cloud,
  Gamepad2,
  Gauge,
  Globe,
  Router,
  Timer,
  Tv,
  Upload,
  Users,
  Video,
  Info,
  Binary,
} from "lucide-react";
import PageHero from "@/components/marketing/PageHero";
import SectionHead from "@/components/marketing/SectionHead";
import FaqList from "@/components/marketing/FaqList";
import CtaBanner from "@/components/marketing/CtaBanner";
import JsonLd, { faqJsonLd } from "@/components/marketing/JsonLd";
import { LOCALE_META, lp, pick } from "@/i18n/config";
import { localeFromParams, pageMetadata } from "@/i18n/server";
import { guideMessages } from "@/i18n/messages/guide";
import { COMPANY } from "@/lib/company";

const PATH = "/guides/good-internet-speed";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = pick(guideMessages, locale);
  return pageMetadata({
    locale,
    path: PATH,
    title: t.meta.title,
    description: t.meta.description,
    keywords: t.meta.keywords,
    absoluteTitle: true,
  });
}

const USE_ICONS = [Globe, Video, Tv, Gamepad2, Users, Cloud];
const FACTOR_ICONS = [Users, Upload, Timer, Router];
// Tier accent bars, slow → very fast.
const TIER_BARS = ["w-1/5", "w-2/5", "w-3/5", "w-4/5", "w-full"];
const TIER_COLORS = [
  "bg-rose-500 dark:bg-rose-400",
  "bg-amber-500 dark:bg-amber-400",
  "bg-brand-500 dark:bg-brand-400",
  "bg-accent-500 dark:bg-accent-400",
  "bg-cyan-500 dark:bg-cyan-400",
];

export default async function GoodSpeedPage({ params }: Props) {
  const locale = await localeFromParams(params);
  const t = pick(guideMessages, locale);
  const inLanguage = LOCALE_META[locale].htmlLang;
  const url = `${COMPANY.siteUrl}${lp(locale, PATH)}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t.meta.title,
    description: t.meta.description,
    inLanguage,
    mainEntityOfPage: url,
    url,
    author: { "@type": "Organization", name: COMPANY.brand, url: COMPANY.siteUrl },
    publisher: { "@type": "Organization", name: COMPANY.brand, url: COMPANY.siteUrl },
  };

  return (
    <>
      <JsonLd data={faqJsonLd(t.faqs, inLanguage)} />
      <JsonLd data={articleJsonLd} />

      <PageHero
        eyebrow={t.hero.eyebrow}
        icon={Gauge}
        titleLead={t.hero.titleLead}
        titleHighlight={t.hero.titleHighlight}
        intro={t.hero.intro}
      >
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`${lp(locale, "/")}#speed-test`} className="btn-primary">
            <Gauge className="h-4 w-4" aria-hidden="true" />
            {t.hero.cta}
          </Link>
          <a href="#speed-table" className="btn-secondary">
            {t.hero.secondary}
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </PageHero>

      {/* Short answer + tiers */}
      <section className="section !pt-4 md:!pt-8">
        <div className="container grid max-w-6xl gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="card relative overflow-hidden p-7 sm:p-8">
            <div aria-hidden="true" className="absolute inset-y-0 start-0 w-1 bg-gradient-to-b from-brand-500 to-cyan-400" />
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.summary.title}</h2>
            </div>
            <p className="mt-4 text-base leading-relaxed text-slate-700 dark:text-slate-300">{t.summary.text}</p>
          </div>
          <div className="card p-6 sm:p-7">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.tiers.title}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.tiers.intro}</p>
            <ul className="mt-6 space-y-4">
              {t.tiers.items.map((tier, i) => (
                <li key={tier.range} className="grid grid-cols-[7.5rem_1fr] items-start gap-4 sm:grid-cols-[9rem_1fr]">
                  <div>
                    <p className="tabular text-sm font-bold text-slate-900 dark:text-white"><bdi>{tier.range}</bdi></p>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.06]">
                      <div className={`h-full rounded-full ${TIER_BARS[i]} ${TIER_COLORS[i]}`} />
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-slate-900 dark:text-white">{tier.label}.</span> {tier.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Use cards */}
      <section className="section-alt">
        <div className="container max-w-6xl">
          <SectionHead title={t.uses.title} intro={t.uses.intro} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {t.uses.items.map((u, i) => {
              const Icon = USE_ICONS[i] ?? Gauge;
              return (
                <div key={u.title} className="card p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="icon-tile">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="tabular rounded-full bg-brand-50 px-3 py-1 text-sm font-bold text-brand-700 ring-1 ring-inset ring-brand-100 dark:bg-brand-400/10 dark:text-brand-300 dark:ring-brand-400/20">
                      <bdi>{u.speed}</bdi>
                    </span>
                  </div>
                  <h3 className="h-card mt-5">{u.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{u.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Household table */}
      <section id="speed-table" className="section scroll-mt-20">
        <div className="container max-w-4xl">
          <SectionHead title={t.table.title} intro={t.table.intro} />
          <div className="card mt-10 overflow-x-auto">
            <table className="table-pro">
              <thead>
                <tr>
                  <th scope="col">{t.table.cols[0]}</th>
                  <th scope="col">{t.table.cols[1]}</th>
                  <th scope="col">{t.table.cols[2]}</th>
                </tr>
              </thead>
              <tbody>
                {t.table.rows.map((row) => (
                  <tr key={row.use}>
                    <td>{row.use}</td>
                    <td className="tabular whitespace-nowrap font-semibold !text-slate-900 dark:!text-white"><bdi>{row.down}</bdi></td>
                    <td className="tabular whitespace-nowrap font-semibold !text-slate-900 dark:!text-white"><bdi>{row.up}</bdi></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Factors */}
      <section className="section-alt">
        <div className="container max-w-5xl">
          <SectionHead title={t.factors.title} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {t.factors.items.map((f, i) => {
              const Icon = FACTOR_ICONS[i] ?? Gauge;
              return (
                <div key={f.title} className="card flex gap-4 p-6">
                  <span className="icon-tile">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="h-card">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Units */}
      <section className="section">
        <div className="container max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="icon-tile">
              <Binary className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="h-section">{t.units.title}</h2>
          </div>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {t.units.paragraphs.map((para) => (
              <p key={para.slice(0, 40)}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-alt">
        <div className="container max-w-3xl">
          <SectionHead title={t.faqTitle} />
          <FaqList items={t.faqs} className="mt-10" />
        </div>
      </section>

      <CtaBanner title={t.cta.title} text={t.cta.text} button={t.cta.button} href={`${lp(locale, "/")}#speed-test`} />
    </>
  );
}
