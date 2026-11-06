import type { Metadata } from "next";
import {
  BarChart3,
  CircleCheck,
  Download,
  Gauge,
  GitFork,
  Globe,
  LineChart,
  Lock,
  MousePointerClick,
  Upload,
  Zap,
} from "lucide-react";
import PageHero from "@/components/marketing/PageHero";
import SectionHead from "@/components/marketing/SectionHead";
import FaqList from "@/components/marketing/FaqList";
import CtaBanner from "@/components/marketing/CtaBanner";
import JsonLd, { faqJsonLd } from "@/components/marketing/JsonLd";
import { LOCALE_META, lp, pick } from "@/i18n/config";
import { localeFromParams, pageMetadata } from "@/i18n/server";
import { howItWorksMessages } from "@/i18n/messages/howItWorks";
import { COMPANY } from "@/lib/company";

const PATH = "/how-it-works";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = pick(howItWorksMessages, locale);
  return pageMetadata({
    locale,
    path: PATH,
    title: t.meta.title,
    description: t.meta.description,
    keywords: t.meta.keywords,
  });
}

const STEP_ICONS = [MousePointerClick, Zap, Download, Upload, BarChart3];
const DETAIL_ICONS = [Globe, GitFork, LineChart, Lock];

export default async function HowItWorksPage({ params }: Props) {
  const locale = await localeFromParams(params);
  const t = pick(howItWorksMessages, locale);
  const inLanguage = LOCALE_META[locale].htmlLang;
  const home = `${COMPANY.siteUrl}${lp(locale, "/")}`;

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: t.howToName,
    description: t.meta.description,
    inLanguage,
    totalTime: "PT1M",
    tool: [{ "@type": "HowToTool", name: COMPANY.brand }],
    step: t.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.text,
      url: `${home}#speed-test`,
    })),
  };

  return (
    <>
      <JsonLd data={howToJsonLd} />
      <JsonLd data={faqJsonLd(t.faqs, inLanguage)} />

      <PageHero
        eyebrow={t.hero.eyebrow}
        icon={Gauge}
        titleLead={t.hero.titleLead}
        titleHighlight={t.hero.titleHighlight}
        intro={t.hero.intro}
      />

      {/* Steps timeline */}
      <section className="section !pt-4 md:!pt-8">
        <div className="container max-w-3xl">
          <SectionHead title={t.stepsTitle} intro={t.stepsIntro} />
          <ol className="relative mt-12 space-y-5 border-s-2 border-brand-100 ps-8 dark:border-brand-400/20 sm:ps-10">
            {t.steps.map((s, i) => {
              const Icon = STEP_ICONS[i] ?? Gauge;
              return (
                <li key={s.title} className="relative">
                  <span className="absolute -start-[51px] top-5 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-600/25 ring-4 ring-white dark:ring-ink-950 sm:-start-[59px]">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="card p-5 sm:p-6">
                    <p className="kicker">
                      {t.stepLabel} <span className="tabular">{i + 1}</span>
                    </p>
                    <h3 className="h-card mt-1.5">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{s.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Details */}
      <section className="section-alt">
        <div className="container max-w-5xl">
          <SectionHead title={t.detailsTitle} intro={t.detailsIntro} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {t.details.map((d, i) => {
              const Icon = DETAIL_ICONS[i] ?? Gauge;
              return (
                <div key={d.title} className="card p-6 sm:p-7">
                  <span className="icon-tile">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="h-card mt-5">{d.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{d.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Accuracy checklist */}
      <section className="section">
        <div className="container max-w-3xl">
          <SectionHead title={t.accuracy.title} intro={t.accuracy.intro} />
          <ul className="card mt-10 divide-y divide-slate-100 dark:divide-white/[0.06]">
            {t.accuracy.items.map((item) => (
              <li key={item} className="flex items-start gap-3 px-5 py-4 sm:px-6">
                <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent-500" aria-hidden="true" />
                <span className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{item}</span>
              </li>
            ))}
          </ul>
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
