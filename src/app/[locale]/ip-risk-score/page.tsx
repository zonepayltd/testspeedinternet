import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Gauge as GaugeIcon,
  Eye,
  Server,
  Ban,
  Bot,
  Users,
  MapPinned,
  ChevronDown,
  Globe2,
  ArrowRight,
} from "lucide-react";
import IpSecurity from "@/components/IpSecurity";
import AdSlot from "@/components/ads/AdSlot";
import { lp, pick, LOCALE_META } from "@/i18n/config";
import { localeFromParams, pageMetadata } from "@/i18n/server";
import { ipRiskMessages } from "@/i18n/messages/ipRisk";
import { COMPANY } from "@/lib/company";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = pick(ipRiskMessages, locale);
  return pageMetadata({
    locale,
    path: "/ip-risk-score",
    title: t.meta.title,
    description: t.meta.description,
    absoluteTitle: true,
    keywords: t.meta.keywords,
  });
}

const FACTOR_ICONS = [Eye, Server, Ban, Bot, Users, MapPinned];

const BAND_STYLE = [
  {
    bar: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  {
    bar: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
  },
  {
    bar: "bg-red-500",
    text: "text-red-600 dark:text-red-400",
  },
];

export default async function IpRiskScorePage({ params }: Props) {
  const locale = await localeFromParams(params);
  const t = pick(ipRiskMessages, locale);
  const inLanguage = LOCALE_META[locale].htmlLang;
  const pageUrl = `${COMPANY.siteUrl}${lp(locale, "/ip-risk-score")}`;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage,
    url: pageUrl,
    mainEntity: t.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t.meta.title,
    url: pageUrl,
    description: t.meta.description,
    inLanguage,
    applicationCategory: "SecurityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />

      {/* Hero + tool */}
      <section className="hero-bg">
        <div aria-hidden="true" className="hero-glow" />
        <div aria-hidden="true" className="hero-grid" />
        <div className="container relative py-12 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              {t.hero.eyebrow}
            </span>
            <h1 className="h-display mt-5">
              {t.hero.titleA} <span className="text-gradient">{t.hero.titleB}</span>
            </h1>
            <p className="lead mx-auto mt-4 max-w-2xl">{t.hero.lead}</p>
          </div>

          <div className="mt-10">
            <IpSecurity />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href={lp(locale, "/what-is-my-ip")} className="btn-primary">
              <Globe2 className="h-4 w-4" aria-hidden="true" />
              {t.links.details}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
            <Link href={lp(locale, "/") + "#speed-test"} className="btn-secondary">
              <GaugeIcon className="h-4 w-4" aria-hidden="true" />
              {t.links.speed}
            </Link>
          </div>
        </div>
      </section>

      <AdSlot placement="inContent" className="container max-w-5xl py-8" />

      {/* Score bands */}
      <section className="section">
        <div className="container max-w-5xl">
          <div className="section-head">
            <p className="kicker">{t.bands.kicker}</p>
            <h2 className="h-section mt-3">{t.bands.title}</h2>
            <p className="lead mt-4">{t.bands.lead}</p>
          </div>

          {/* Scale */}
          <div aria-hidden="true" className="mx-auto mt-10 flex h-2.5 max-w-3xl overflow-hidden rounded-full">
            <span className="h-full w-[34%] bg-emerald-500" />
            <span className="h-full w-[33%] bg-amber-500" />
            <span className="h-full w-[33%] bg-red-500" />
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {t.bands.items.map((band, i) => (
              <div key={band.range} className="card relative overflow-hidden p-6">
                <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 ${BAND_STYLE[i].bar}`} />
                <p dir="ltr" className={`tabular text-2xl font-extrabold rtl:text-end ${BAND_STYLE[i].text}`}>
                  {band.range}
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{band.label}</p>
                <p className="muted mt-2 text-sm leading-relaxed">{band.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Factors */}
      <section className="section-alt">
        <div className="container">
          <div className="section-head">
            <p className="kicker">{t.factors.kicker}</p>
            <h2 className="h-section mt-3">{t.factors.title}</h2>
            <p className="lead mt-4">{t.factors.lead}</p>
          </div>
          <div className="mx-auto mt-12 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {t.factors.items.map((item, i) => {
              const Icon = FACTOR_ICONS[i] ?? Eye;
              return (
                <div key={item.title} className="card card-hover p-6">
                  <span className="icon-tile">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="h-card mt-4">{item.title}</h3>
                  <p className="muted mt-2 text-sm leading-relaxed">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="section">
        <div className="container max-w-4xl">
          <div className="section-head">
            <p className="kicker">{t.tips.kicker}</p>
            <h2 className="h-section mt-3">{t.tips.title}</h2>
            <p className="lead mt-4">{t.tips.lead}</p>
          </div>
          <ol className="mt-12 space-y-3">
            {t.tips.steps.map((step, i) => (
              <li key={step.title} className="card flex items-start gap-4 p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white dark:bg-brand-500">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                  <p className="muted mt-1 text-sm leading-relaxed">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-alt">
        <div className="container max-w-3xl">
          <div className="section-head">
            <h2 className="h-section">{t.faqTitle}</h2>
            <p className="lead mt-4">{t.faqLead}</p>
          </div>
          <div className="mt-10 space-y-3">
            {t.faq.map((faq, i) => (
              <details key={faq.q} className="faq-item group" open={i === 0}>
                <summary className="faq-q">
                  {faq.q}
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="faq-a">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
