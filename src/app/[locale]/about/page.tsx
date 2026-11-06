import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpFromLine,
  BookOpen,
  BookOpenCheck,
  Building2,
  Eye,
  Gauge,
  Globe2,
  Languages,
  ListChecks,
  Lock,
  Mail,
  MousePointerClick,
  ShieldAlert,
  Target,
  Timer,
} from "lucide-react";
import { COMPANY } from "@/lib/company";
import { lp, pick } from "@/i18n/config";
import { localeFromParams, pageMetadata } from "@/i18n/server";
import { aboutMessages } from "@/i18n/messages/about";
import { commonMessages } from "@/i18n/messages/common";
import { Rich, fill } from "@/components/LegalPage";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = pick(aboutMessages, locale);
  return pageMetadata({ locale, path: "/about", title: t.meta.title, description: t.meta.description });
}

const OFFER_ICONS = [Gauge, Globe2, ShieldAlert, BookOpen];
const STEP_ICONS = [Timer, ArrowDownToLine, ArrowUpFromLine, ListChecks];
const VALUE_ICONS = [Target, Lock, MousePointerClick, Eye];
const FACT_ICONS = [Building2, Gauge, Languages, Mail];

export default async function AboutPage({ params }: Props) {
  const locale = await localeFromParams(params);
  const t = pick(aboutMessages, locale);
  const links = pick(commonMessages, locale).footer.links;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: t.meta.title,
    description: t.meta.description,
    url: `${COMPANY.siteUrl}${lp(locale, "/about")}`,
    inLanguage: locale,
    mainEntity: {
      "@type": "Organization",
      "@id": `${COMPANY.siteUrl}/#organization`,
      name: COMPANY.brand,
      legalName: COMPANY.legalName,
      url: COMPANY.siteUrl,
      email: COMPANY.email,
      logo: `${COMPANY.siteUrl}/icon.svg`,
    },
  };

  const policyLinks = [
    { href: "/editorial-policy", label: links.editorial },
    { href: "/privacy", label: links.privacy },
    { href: "/cookies", label: links.cookies },
    { href: "/terms", label: links.terms },
    { href: "/dmca", label: links.dmca },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="hero-bg">
        <div aria-hidden="true" className="hero-glow" />
        <div aria-hidden="true" className="hero-grid" />
        <div className="container relative flex flex-col items-center py-16 text-center md:py-24">
          <span className="eyebrow">
            <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
            {t.hero.badge}
          </span>
          <h1 className="h-display mt-6 max-w-3xl">
            {t.hero.titleA} <span className="text-gradient">{COMPANY.brand}</span>
          </h1>
          <p className="lead mt-5 max-w-2xl">
            <Rich text={t.hero.lead} locale={locale} />
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href={lp(locale, "/")} className="btn-primary">
              <Gauge className="h-4 w-4" aria-hidden="true" />
              {t.hero.ctaPrimary}
            </Link>
            <Link href={lp(locale, "/contact")} className="btn-secondary">
              {t.hero.ctaSecondary}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>

          {/* Key facts */}
          <dl className="mt-14 grid w-full max-w-4xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-200/80 text-start shadow-sm dark:border-white/[0.08] dark:bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
            {t.facts.map((f, i) => {
              const Icon = FACT_ICONS[i] ?? Building2;
              const isEmail = f.value.includes("{email}");
              return (
                <div key={f.label} className="bg-white p-5 dark:bg-ink-900">
                  <dt className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <Icon className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                    {f.label}
                  </dt>
                  <dd className="mt-1.5 truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {isEmail ? (
                      <a href={`mailto:${COMPANY.email}`} className="hover:text-brand-600 dark:hover:text-brand-300">
                        <bdi dir="ltr">{COMPANY.email}</bdi>
                      </a>
                    ) : (
                      fill(f.value)
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </section>

      {/* Mission */}
      <section className="section">
        <div className="container grid max-w-6xl gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <p className="kicker">{t.mission.kicker}</p>
            <h2 className="h-section mt-3">{t.mission.title}</h2>
          </div>
          <div className="space-y-5 text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
            {t.mission.paragraphs.map((p, i) => (
              <p key={i}>
                <Rich text={p} locale={locale} />
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* What we offer */}
      <section className="section-alt">
        <div className="container max-w-6xl">
          <div className="section-head">
            <p className="kicker">{t.offer.kicker}</p>
            <h2 className="h-section mt-3">{t.offer.title}</h2>
            <p className="lead mt-4">{t.offer.lead}</p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.offer.items.map((item, i) => {
              const Icon = OFFER_ICONS[i] ?? Gauge;
              return (
                <Link key={item.href} href={lp(locale, item.href)} className="card card-hover group flex flex-col p-6">
                  <span className="icon-tile">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="h-card mt-5">{item.title}</h3>
                  <p className="muted mt-2 flex-1 text-sm leading-relaxed">{item.text}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400">
                    {item.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How the test works */}
      <section className="section">
        <div className="container max-w-6xl">
          <div className="section-head">
            <p className="kicker">{t.how.kicker}</p>
            <h2 className="h-section mt-3">{t.how.title}</h2>
            <p className="lead mt-4">{t.how.lead}</p>
          </div>
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.how.steps.map((s, i) => {
              const Icon = STEP_ICONS[i] ?? Timer;
              return (
                <li key={s.title} className="card p-6">
                  <div className="flex items-center justify-between">
                    <span className="icon-tile">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="tabular text-3xl font-extrabold text-slate-200 dark:text-white/10" aria-hidden="true">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="h-card mt-5">{s.title}</h3>
                  <p className="muted mt-2 text-sm leading-relaxed">{s.text}</p>
                </li>
              );
            })}
          </ol>
          <p className="muted mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed">
            <Rich text={t.how.more} locale={locale} />
          </p>
        </div>
      </section>

      {/* Editorial + values */}
      <section className="section-alt">
        <div className="container max-w-6xl">
          <div className="card grid gap-6 p-8 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8 md:p-10">
            <span className="icon-tile-solid">
              <BookOpenCheck className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="kicker">{t.editorial.kicker}</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{t.editorial.title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                <Rich text={t.editorial.text} locale={locale} />
              </p>
            </div>
            <Link href={lp(locale, "/editorial-policy")} className="btn-secondary justify-self-start">
              {t.editorial.cta}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-20">
            <div className="section-head">
              <p className="kicker">{t.values.kicker}</p>
              <h2 className="h-section mt-3">{t.values.title}</h2>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {t.values.items.map((v, i) => {
                const Icon = VALUE_ICONS[i] ?? Target;
                return (
                  <div key={v.title} className="card p-6">
                    <span className="icon-tile-solid">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3 className="h-card mt-5">{v.title}</h3>
                    <p className="muted mt-2 text-sm leading-relaxed">{v.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Company */}
      <section className="section">
        <div className="container max-w-4xl">
          <div className="card p-8 md:p-10">
            <div className="flex items-start gap-4">
              <span className="icon-tile">
                <Building2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">{fill(t.company.title)}</h2>
                <p className="muted mt-1 text-sm">{fill(t.company.subtitle)}</p>
              </div>
            </div>
            <p className="mt-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              <Rich text={t.company.text} locale={locale} />
            </p>
            <div className="mt-8 border-t border-slate-200/80 pt-6 dark:border-white/[0.08]">
              <p className="kicker">{t.company.links}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {policyLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={lp(locale, l.href)}
                      className="pill py-1.5 text-sm transition-colors hover:border-brand-300 hover:text-brand-700 dark:hover:border-brand-400/40 dark:hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="relative mt-10 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-12 text-center text-white shadow-xl shadow-brand-900/20 dark:from-brand-700 dark:to-ink-900 dark:shadow-none dark:ring-1 dark:ring-white/10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,rgba(255,255,255,0.18),transparent)]"
            />
            <h2 className="relative text-2xl font-extrabold tracking-tight sm:text-3xl">{t.cta.title}</h2>
            <p className="relative mx-auto mt-3 max-w-md text-brand-100">{t.cta.text}</p>
            <Link href={lp(locale, "/")} className="btn-white relative mt-7">
              <Gauge className="h-5 w-5" aria-hidden="true" />
              {t.cta.button}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
