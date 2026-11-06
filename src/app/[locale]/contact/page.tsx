import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, HelpCircle, LifeBuoy, Mail, MessageSquare } from "lucide-react";
import { COMPANY } from "@/lib/company";
import { lp, pick } from "@/i18n/config";
import { localeFromParams, pageMetadata } from "@/i18n/server";
import { contactMessages } from "@/i18n/messages/contact";
import ContactForm from "@/components/ContactForm";
import { fill } from "@/components/LegalPage";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = pick(contactMessages, locale);
  return pageMetadata({ locale, path: "/contact", title: t.meta.title, description: t.meta.description });
}

const CHANNEL_ICONS = [Mail, LifeBuoy];

export default async function ContactPage({ params }: Props) {
  const locale = await localeFromParams(params);
  const t = pick(contactMessages, locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: t.meta.title,
    description: t.meta.description,
    url: `${COMPANY.siteUrl}${lp(locale, "/contact")}`,
    inLanguage: locale,
    mainEntity: {
      "@type": "Organization",
      "@id": `${COMPANY.siteUrl}/#organization`,
      name: COMPANY.brand,
      legalName: COMPANY.legalName,
      email: COMPANY.email,
      contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: COMPANY.email },
    },
  };

  const helpful = [
    { href: "/faq", label: t.helpful.faq },
    { href: "/how-it-works", label: t.helpful.howItWorks },
    { href: "/privacy", label: t.helpful.privacy },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="hero-bg">
        <div aria-hidden="true" className="hero-glow" />
        <div aria-hidden="true" className="hero-grid" />
        <div className="container relative flex flex-col items-center py-16 text-center md:py-20">
          <span className="eyebrow">
            <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
            {t.hero.badge}
          </span>
          <h1 className="h-display mt-6 max-w-3xl">
            {t.hero.titleA} <span className="text-gradient">{t.hero.titleB}</span>
          </h1>
          <p className="lead mt-5 max-w-xl">{t.hero.lead}</p>
        </div>
      </section>

      {/* Form + info */}
      <section className="pb-16 md:pb-24">
        <div className="container grid max-w-6xl items-start gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:gap-8">
          <ContactForm />

          <aside className="space-y-4">
            {t.channels.map((c, i) => {
              const Icon = CHANNEL_ICONS[i] ?? Mail;
              return (
                <a key={c.title} href={`mailto:${COMPANY.email}`} className="card card-hover group block p-5">
                  <div className="flex items-start gap-4">
                    <span className="icon-tile">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">{c.title}</h2>
                      <p className="muted mt-1 text-sm leading-relaxed">{c.text}</p>
                      <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400">
                        <bdi dir="ltr" className="truncate">
                          {COMPANY.email}
                        </bdi>
                        <ArrowRight
                          className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                          aria-hidden="true"
                        />
                      </p>
                    </div>
                  </div>
                </a>
              );
            })}

            <div className="card-muted p-5">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 ring-1 ring-slate-200 dark:bg-white/5 dark:text-brand-300 dark:ring-white/10">
                  <Building2 className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">{COMPANY.legalName}</h2>
                  <p className="muted mt-1 text-sm leading-relaxed">{fill(t.company.text)}</p>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <HelpCircle className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                {t.helpful.title}
              </h2>
              <ul className="mt-3 divide-y divide-slate-100 dark:divide-white/[0.06]">
                {helpful.map((h) => (
                  <li key={h.href}>
                    <Link
                      href={lp(locale, h.href)}
                      className="group flex items-center justify-between gap-3 py-2.5 text-sm font-medium text-slate-700 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-300"
                    >
                      {h.label}
                      <ArrowRight
                        className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
