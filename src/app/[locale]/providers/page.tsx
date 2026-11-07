import type { Metadata } from "next";
import Link from "next/link";
import { Gauge, MessageSquareText, Star } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProvidersDirectory from "@/components/reviews/ProvidersDirectory";
import { localeFromParams, pageMetadata } from "@/i18n/server";
import { lp, pick } from "@/i18n/config";
import { reviewsMessages } from "@/i18n/messages/reviews";
import { commonMessages } from "@/i18n/messages/common";
import { adminConfigured } from "@/lib/firebaseAdmin";
import { listProviders, type ProviderSummary } from "@/lib/reviews";
import { COMPANY } from "@/lib/company";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const m = pick(reviewsMessages, locale);
  return pageMetadata({ locale, path: "/providers", title: m.index.metaTitle, description: m.index.metaDesc });
}

export default async function ProvidersPage({ params }: Props) {
  const locale = await localeFromParams(params);
  const m = pick(reviewsMessages, locale);
  const home = pick(commonMessages, locale);
  const providers: ProviderSummary[] = adminConfigured ? await listProviders().catch(() => []) : [];
  const items = providers.map((p) => ({ slug: p.slug, name: p.name, domain: p.domain, count: p.count, average: p.average }));
  const homeLabel = home.common.home;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: homeLabel, item: `${COMPANY.siteUrl}${lp(locale, "/")}` },
      { "@type": "ListItem", position: 2, name: m.index.title, item: `${COMPANY.siteUrl}${lp(locale, "/providers")}` },
    ],
  };

  return (
    <div className="hero-bg">
      <div aria-hidden="true" className="hero-glow" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container max-w-6xl py-12 md:py-16">
        <Breadcrumbs items={[{ href: lp(locale, "/"), label: homeLabel }, { label: m.index.title }]} className="mb-8" />
        <header className="mb-10 max-w-2xl">
          <span className="eyebrow">
            <Star className="h-3.5 w-3.5" aria-hidden="true" /> {m.index.eyebrow}
          </span>
          <h1 className="h-display mt-5">{m.index.title}</h1>
          <p className="lead mt-4">{m.index.intro}</p>
        </header>

        {items.length > 0 ? (
          <ProvidersDirectory items={items} />
        ) : (
          <div className="card flex flex-col items-center p-10 text-center">
            <span className="icon-tile">
              <MessageSquareText className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="h-card mt-4">{m.index.emptyTitle}</h2>
            <p className="mt-2 max-w-md text-sm muted">{m.index.emptyText}</p>
          </div>
        )}

        <section className="mt-14 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-800 px-6 py-10 text-white shadow-xl sm:px-10 md:flex md:items-center md:justify-between md:gap-8">
          <div className="max-w-xl">
            <h2 className="text-2xl font-extrabold tracking-tight">{m.index.ctaTitle}</h2>
            <p className="mt-2 text-blue-100">{m.index.ctaText}</p>
          </div>
          <Link href={`${lp(locale, "/")}#speed-test`} className="mt-6 inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-brand-700 shadow-lg transition-transform hover:scale-[1.03] md:mt-0">
            <Gauge className="h-5 w-5" aria-hidden="true" /> {m.index.ctaButton}
          </Link>
        </section>
      </div>
    </div>
  );
}
