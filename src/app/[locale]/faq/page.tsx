import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronDown, Gauge, HelpCircle, LineChart, Mail, Wrench } from "lucide-react";
import { COMPANY } from "@/lib/company";
import { lp, pick } from "@/i18n/config";
import { localeFromParams, pageMetadata } from "@/i18n/server";
import { faqMessages } from "@/i18n/messages/faq";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = pick(faqMessages, locale);
  return pageMetadata({
    locale,
    path: "/faq",
    title: t.meta.title,
    description: t.meta.description,
    keywords: t.meta.keywords,
  });
}

const GROUP_ICONS = [Gauge, LineChart, Wrench];

export default async function FaqPage({ params }: Props) {
  const locale = await localeFromParams(params);
  const t = pick(faqMessages, locale);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    url: `${COMPANY.siteUrl}${lp(locale, "/faq")}`,
    mainEntity: t.groups
      .flatMap((g) => g.faqs)
      .map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero */}
      <section className="hero-bg">
        <div aria-hidden="true" className="hero-glow" />
        <div aria-hidden="true" className="hero-grid" />
        <div className="container relative flex flex-col items-center py-16 text-center md:py-20">
          <span className="eyebrow">
            <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
            {t.hero.badge}
          </span>
          <h1 className="h-display mt-6 max-w-3xl">
            {t.hero.titleA} <span className="text-gradient">{t.hero.titleB}</span>
          </h1>
          <p className="lead mt-5 max-w-xl">{t.hero.lead}</p>

          {/* Topic shortcuts */}
          <nav aria-label={t.topics} className="mt-8 flex flex-wrap justify-center gap-2">
            {t.groups.map((g, i) => {
              const Icon = GROUP_ICONS[i] ?? HelpCircle;
              return (
                <a
                  key={g.id}
                  href={`#${g.id}`}
                  className="pill py-1.5 text-sm transition-colors hover:border-brand-300 hover:text-brand-700 dark:hover:border-brand-400/40 dark:hover:text-white"
                >
                  <Icon className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                  {g.heading}
                </a>
              );
            })}
          </nav>
        </div>
      </section>

      {/* FAQ groups */}
      <section className="pb-16 pt-4 md:pb-24">
        <div className="container max-w-3xl space-y-14">
          {t.groups.map((group, gi) => {
            const Icon = GROUP_ICONS[gi] ?? HelpCircle;
            return (
              <div key={group.id} id={group.id} className="scroll-mt-24">
                <div className="flex items-center gap-3">
                  <span className="icon-tile h-10 w-10">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{group.heading}</h2>
                </div>
                <div className="mt-6 space-y-3">
                  {group.faqs.map((faq, i) => (
                    <details key={faq.q} className="faq-item group" open={gi === 0 && i === 0}>
                      <summary className="faq-q">
                        {faq.q}
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors group-open:bg-brand-50 group-open:text-brand-600 dark:bg-white/5 dark:text-slate-400 dark:group-open:bg-brand-400/10 dark:group-open:text-brand-300">
                          <ChevronDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
                        </span>
                      </summary>
                      <p className="faq-a">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            );
          })}

          {/* More help */}
          <div className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex items-start gap-4">
              <span className="icon-tile">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="h-card">{t.more.title}</h2>
                <p className="muted mt-1 text-sm leading-relaxed">{t.more.text}</p>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Link href={lp(locale, "/how-it-works")} className="btn-secondary">
                {t.more.howItWorks}
              </Link>
              <Link href={lp(locale, "/contact")} className="btn-primary">
                {t.more.contact}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-10 text-center text-white shadow-xl shadow-brand-900/20 dark:from-brand-700 dark:to-ink-900 dark:shadow-none dark:ring-1 dark:ring-white/10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,rgba(255,255,255,0.18),transparent)]"
            />
            <p className="relative text-xl font-bold sm:text-2xl">{t.cta.title}</p>
            <Link href={lp(locale, "/")} className="btn-white relative mt-6">
              <Gauge className="h-5 w-5" aria-hidden="true" />
              {t.cta.button}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
