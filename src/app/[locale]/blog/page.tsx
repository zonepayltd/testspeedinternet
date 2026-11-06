import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper, Gauge, ArrowRight, Clock } from "lucide-react";
import { getPublishedPosts } from "@/lib/posts";
import { COMPANY } from "@/lib/company";
import { lp, pick, LOCALE_META } from "@/i18n/config";
import { localeFromParams, pageMetadata } from "@/i18n/server";
import { blogMessages, categoryLabel, readingTime } from "@/i18n/messages/blog";
import PostCard from "@/components/PostCard";
import AdSlot from "@/components/ads/AdSlot";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = pick(blogMessages, locale);
  return pageMetadata({ locale, path: "/blog", title: t.meta.title, description: t.meta.description });
}

export const dynamic = "force-dynamic";

export default async function BlogPage({ params, searchParams }: Props) {
  const locale = await localeFromParams(params);
  const t = pick(blogMessages, locale);
  const { category } = await searchParams;
  const all = await getPublishedPosts(locale);
  const categories = Array.from(new Set(all.map((p) => p.category))).sort((a, b) =>
    categoryLabel(a, locale).localeCompare(categoryLabel(b, locale), locale),
  );
  const posts = category ? all.filter((p) => p.category === category) : all;
  const [featured, ...rest] = posts;
  const blogHref = lp(locale, "/blog");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${COMPANY.brand} Blog`,
    description: t.meta.description,
    url: `${COMPANY.siteUrl}${blogHref}`,
    inLanguage: LOCALE_META[locale].htmlLang,
    isPartOf: { "@id": `${COMPANY.siteUrl}/#website` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: all.slice(0, 50).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${COMPANY.siteUrl}${lp(locale, `/blog/${p.slug}`)}`,
        name: p.title,
      })),
    },
  };

  const pillClass = (active: boolean) =>
    `pill shrink-0 px-4 py-1.5 text-sm transition-colors ${
      active ? "pill-active" : "hover:border-slate-300 hover:text-slate-900 dark:hover:border-white/20 dark:hover:text-white"
    }`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="hero-bg">
        <div aria-hidden="true" className="hero-glow" />
        <div aria-hidden="true" className="hero-grid" />
        <div className="container relative flex flex-col items-center pb-12 pt-14 text-center md:pb-16 md:pt-20">
          <span className="eyebrow">
            <Newspaper className="h-3.5 w-3.5" aria-hidden="true" />
            {t.index.eyebrow}
          </span>
          <h1 className="h-display mt-6 max-w-3xl">
            {t.index.titleStart} <span className="text-gradient">{t.index.titleHighlight}</span>
          </h1>
          <p className="lead mt-5 max-w-xl">{t.index.lead}</p>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container max-w-6xl">
          {categories.length > 1 && (
            <nav aria-label={t.index.categoriesLabel} className="mb-10 md:mb-12">
              <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
                <li>
                  <Link href={blogHref} aria-current={!category ? "page" : undefined} className={pillClass(!category)}>
                    {t.index.all}
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c}>
                    <Link
                      href={`${blogHref}?category=${encodeURIComponent(c)}`}
                      rel="nofollow"
                      aria-current={category === c ? "page" : undefined}
                      className={pillClass(category === c)}
                    >
                      {categoryLabel(c, locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {!featured ? (
            <div className="card-muted mx-auto max-w-xl border-dashed p-12 text-center">
              <span className="icon-tile mx-auto">
                <Newspaper className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="muted mt-4 text-sm">{t.index.empty}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {category && (
                  <Link href={blogHref} className="btn-secondary">
                    {t.index.viewAll}
                  </Link>
                )}
                <Link href={lp(locale, "/")} className="btn-primary">
                  <Gauge className="h-4 w-4" aria-hidden="true" /> {t.index.emptyCta}
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Featured */}
              <Link
                href={lp(locale, `/blog/${featured.slug}`)}
                className="card card-hover group grid overflow-hidden lg:grid-cols-[1.45fr_1fr]"
              >
                <div className="overflow-hidden border-b border-slate-200/80 bg-slate-50 dark:border-white/[0.06] dark:bg-ink-850 lg:border-b-0 lg:border-e">
                  {featured.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={featured.coverImage}
                      alt={featured.coverAlt || featured.title}
                      width={1200}
                      height={630}
                      fetchPriority="high"
                      className="aspect-[1200/630] w-full object-cover object-left lg:h-full rtl:object-right transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex aspect-[1200/630] w-full items-center justify-center bg-gradient-to-br from-brand-50 to-cyan-50 dark:from-brand-500/10 dark:to-cyan-500/5">
                      <Newspaper className="h-10 w-10 text-brand-300" aria-hidden="true" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-9">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-brand-600 px-2.5 py-0.5 text-[11px] font-semibold text-white dark:bg-brand-500">
                      {t.index.featured}
                    </span>
                    <span className="kicker">{categoryLabel(featured.category, locale)}</span>
                  </div>
                  <h2 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-slate-900 transition-colors group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300 md:text-[1.75rem]">
                    {featured.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 leading-relaxed text-slate-600 dark:text-slate-400">{featured.excerpt}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-brand-600 dark:text-brand-400">
                      {t.index.readArticle}
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {readingTime(featured.readingMinutes, locale)}
                    </span>
                  </div>
                </div>
              </Link>

              {rest.length > 0 && (
                <>
                  <h2 className="mb-6 mt-14 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 rtl:normal-case rtl:tracking-normal">
                    {t.index.latest}
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.slice(0, 6).map((p, i) => (
                      <PostCard key={p.slug} post={p} locale={locale} priority={i < 3} />
                    ))}
                  </div>
                </>
              )}

              {rest.length > 6 && (
                <>
                  <AdSlot placement="inContent" className="my-10" />
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.slice(6).map((p) => (
                      <PostCard key={p.slug} post={p} locale={locale} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
