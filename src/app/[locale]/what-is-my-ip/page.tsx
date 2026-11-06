import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Eye,
  Globe2,
  Network,
  ChevronDown,
  Gauge,
  ArrowRight,
  RefreshCw,
  Landmark,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Info,
} from "lucide-react";
import IpDetails from "@/components/IpDetails";
import IpSecurity from "@/components/IpSecurity";
import AdSlot from "@/components/ads/AdSlot";
import { lp, pick, LOCALE_META } from "@/i18n/config";
import { localeFromParams, pageMetadata } from "@/i18n/server";
import { ipMessages } from "@/i18n/messages/ip";
import { COMPANY } from "@/lib/company";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = pick(ipMessages, locale);
  return pageMetadata({
    locale,
    path: "/what-is-my-ip",
    title: t.meta.title,
    description: t.meta.description,
    absoluteTitle: true,
    keywords: t.meta.keywords,
  });
}

const CARD_ICONS = [Globe2, Network, Eye, RefreshCw, Landmark, Shield];

export default async function WhatIsMyIpPage({ params }: Props) {
  const locale = await localeFromParams(params);
  const t = pick(ipMessages, locale);
  const inLanguage = LOCALE_META[locale].htmlLang;
  const pageUrl = `${COMPANY.siteUrl}${lp(locale, "/what-is-my-ip")}`;

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
    applicationCategory: "UtilitiesApplication",
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
              <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
              {t.hero.eyebrow}
            </span>
            <h1 className="h-display mt-5">
              {t.hero.titleA} <span className="text-gradient">{t.hero.titleB}</span>
            </h1>
            <p className="lead mx-auto mt-4 max-w-2xl">{t.hero.lead}</p>
          </div>

          <div className="mt-10">
            <IpDetails />
          </div>
          <div className="mt-5">
            <IpSecurity variant="compact" />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href={lp(locale, "/") + "#speed-test"} className="btn-primary">
              <Gauge className="h-4 w-4" aria-hidden="true" />
              {t.links.speed}
            </Link>
            <Link href={lp(locale, "/ip-risk-score")} className="btn-secondary">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              {t.links.risk}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <AdSlot placement="inContent" className="container max-w-5xl py-8" />

      {/* Learn */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="kicker">{t.learn.kicker}</p>
            <h2 className="h-section mt-3">{t.learn.title}</h2>
            <p className="lead mt-4">{t.learn.lead}</p>
          </div>
          <div className="mx-auto mt-12 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {t.learn.cards.map((card, i) => {
              const Icon = CARD_ICONS[i] ?? Globe2;
              return (
                <div key={card.title} className="card card-hover p-6">
                  <span className="icon-tile">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="h-card mt-4">{card.title}</h3>
                  <p className="muted mt-2 text-sm leading-relaxed">{card.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What your IP reveals */}
      <section className="section-alt">
        <div className="container">
          <div className="section-head">
            <h2 className="h-section">{t.reveals.title}</h2>
            <p className="lead mt-4">{t.reveals.lead}</p>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-2">
            <div className="card p-6 sm:p-7">
              <h3 className="h-card flex items-center gap-2">
                <Eye className="h-5 w-5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                {t.reveals.canTitle}
              </h3>
              <ul className="mt-5 space-y-3">
                {t.reveals.can.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-6 sm:p-7">
              <h3 className="h-card flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                {t.reveals.cannotTitle}
              </h3>
              <ul className="mt-5 space-y-3">
                {t.reveals.cannot.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mx-auto mt-6 flex max-w-5xl items-start gap-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {t.reveals.note}
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
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
