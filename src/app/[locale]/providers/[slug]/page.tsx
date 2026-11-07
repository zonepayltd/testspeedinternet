import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowUp, Gauge, Star, Timer } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProviderLogo from "@/components/reviews/ProviderLogo";
import ReviewList from "@/components/reviews/ReviewList";
import WriteReview from "@/components/reviews/WriteReview";
import { StarDisplay } from "@/components/reviews/Stars";
import { localeFromParams, pageMetadata } from "@/i18n/server";
import { LOCALE_META, lp, pick, type Locale } from "@/i18n/config";
import { fill, reviewsCountText, reviewsMessages } from "@/i18n/messages/reviews";
import { commonMessages } from "@/i18n/messages/common";
import { adminConfigured } from "@/lib/firebaseAdmin";
import { getProviderSummary, listProviderReviews, providerSlug, sortReviews, speedAverages, type ProviderSummary } from "@/lib/reviews";
import { COMPANY } from "@/lib/company";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string; slug: string }> };

async function load(slugRaw: string): Promise<ProviderSummary | null> {
  const slug = providerSlug(decodeURIComponent(slugRaw));
  if (!slug || slug !== slugRaw || !adminConfigured) return null;
  return getProviderSummary(slug).catch(() => null);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const { slug } = await params;
  const p = await load(slug);
  const m = pick(reviewsMessages, locale);
  if (!p) return { title: m.index.title, robots: { index: false } };
  return pageMetadata({
    locale,
    path: `/providers/${p.slug}`,
    title: fill(m.provider.metaTitle, { provider: p.name }),
    description: p.count ? fill(m.provider.metaDesc, { provider: p.name, n: p.count }) : fill(m.provider.metaDescEmpty, { provider: p.name }),
    noindex: p.count === 0,
  });
}

export default async function ProviderPage({ params }: Props) {
  const locale: Locale = await localeFromParams(params);
  const { slug } = await params;
  const p = await load(slug);
  if (!p) notFound();

  const m = pick(reviewsMessages, locale);
  const homeLabel = pick(commonMessages, locale).common.home;
  const lang = LOCALE_META[locale].htmlLang;
  const nf1 = new Intl.NumberFormat(lang, { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  const nf = new Intl.NumberFormat(lang, { maximumFractionDigits: 1 });

  const all = await listProviderReviews(p.slug, 1000).catch(() => []);
  const speeds = speedAverages(all);
  const first = sortReviews(all, "newest").slice(0, 10);
  const count = all.length || p.count;

  const url = `${COMPANY.siteUrl}${lp(locale, `/providers/${p.slug}`)}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: homeLabel, item: `${COMPANY.siteUrl}${lp(locale, "/")}` },
      { "@type": "ListItem", position: 2, name: m.index.title, item: `${COMPANY.siteUrl}${lp(locale, "/providers")}` },
      { "@type": "ListItem", position: 3, name: p.name, item: url },
    ],
  };

  const stats = [
    { key: "download", label: m.provider.download, value: speeds.download, unit: "Mbps", icon: ArrowDown, tone: "text-blue-600 dark:text-blue-400" },
    { key: "upload", label: m.provider.upload, value: speeds.upload, unit: "Mbps", icon: ArrowUp, tone: "text-violet-600 dark:text-violet-400" },
    { key: "ping", label: m.provider.ping, value: speeds.ping, unit: "ms", icon: Timer, tone: "text-emerald-600 dark:text-emerald-400" },
  ];

  return (
    <div className="hero-bg">
      <div aria-hidden="true" className="hero-glow" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container max-w-6xl py-12 md:py-16">
        <Breadcrumbs
          items={[{ href: lp(locale, "/"), label: homeLabel }, { href: lp(locale, "/providers"), label: m.index.title }, { label: p.name }]}
          className="mb-8"
        />

        {/* Header */}
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <ProviderLogo name={p.name} domain={p.domain} size={72} className="rounded-2xl" />
            <div>
              <span className="eyebrow">
                <Star className="h-3.5 w-3.5" aria-hidden="true" /> {m.provider.eyebrow}
              </span>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">{fill(m.provider.metaTitle, { provider: p.name })}</h1>
            </div>
          </div>
          <WriteReview provider={p.name} domain={p.domain} />
        </header>

        {/* Summary */}
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          <section className="card p-6" aria-labelledby="pv-rating">
            <h2 id="pv-rating" className="sr-only">{m.provider.distribution}</h2>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white tabular-nums">{count ? nf1.format(p.average) : "–"}</span>
              <span className="pb-2 text-sm muted">/ 5</span>
            </div>
            <StarDisplay value={p.average} size={22} label={fill(m.starOf, { n: nf1.format(p.average) })} className="mt-2" />
            <p className="mt-2 text-sm muted">{fill(m.provider.basedOn, { n: reviewsCountText(m, count) })}</p>
            <ul className="mt-5 space-y-2" aria-label={m.provider.distribution}>
              {[5, 4, 3, 2, 1].map((n) => {
                const c = p.dist[String(n) as "1"] || 0;
                const pct = p.count ? Math.round((c / p.count) * 100) : 0;
                return (
                  <li key={n} className="flex items-center gap-3 text-sm">
                    <span className="flex w-10 shrink-0 items-center gap-1 tabular-nums text-slate-600 dark:text-slate-300">
                      {n} <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                    </span>
                    <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.06]">
                      <span className="block h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                    </span>
                    <span className="w-10 shrink-0 text-end tabular-nums text-slate-500 dark:text-slate-400">{pct}%</span>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="card p-6 lg:col-span-2" aria-labelledby="pv-speeds">
            <h2 id="pv-speeds" className="kicker">{m.provider.speeds}</h2>
            {speeds.samples > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {stats.map((s) => (
                  <div key={s.key} className="rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.04]">
                    <p className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                      <s.icon className={`h-4 w-4 ${s.tone}`} aria-hidden="true" /> {s.label}
                    </p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900 dark:text-white" dir="ltr">
                      {s.value == null ? "–" : nf.format(s.value)} <span className="text-sm font-medium text-slate-500">{s.unit}</span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm muted">{m.provider.speedsNone}</p>
            )}
            <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-brand-100 bg-brand-50/60 p-4 dark:border-brand-400/20 dark:bg-brand-400/[0.06] sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-700 dark:text-slate-300">{fill(m.provider.testCtaText, { provider: p.name })}</p>
              <Link href={`${lp(locale, "/")}#speed-test`} className="btn-primary shrink-0 px-4 py-2.5">
                <Gauge className="h-4 w-4" aria-hidden="true" /> {m.provider.testCta}
              </Link>
            </div>
          </section>
        </div>

        {/* Reviews */}
        <section className="mt-12" aria-labelledby="pv-reviews">
          <h2 id="pv-reviews" className="h-card mb-5">
            {m.provider.reviews} <span className="text-base font-medium text-slate-400">· {reviewsCountText(m, count)}</span>
          </h2>
          <ReviewList slug={p.slug} initial={{ reviews: first, total: all.length, page: 1, pages: Math.max(1, Math.ceil(all.length / 10)) }} />
        </section>

        <p className="mt-12">
          <Link href={lp(locale, "/providers")} className="link text-sm">
            ← {m.provider.all}
          </Link>
        </p>
      </div>
    </div>
  );
}
