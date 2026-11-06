import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Clock, Gauge, ListOrdered, Plus, RefreshCw } from "lucide-react";
import { getPostBySlug, getRelatedPosts, postLocales } from "@/lib/posts";
import { renderMarkdown } from "@/lib/markdown";
import { COMPANY } from "@/lib/company";
import { LOCALE_META, lp, pick, type Locale } from "@/i18n/config";
import { alternatesFor, localeFromParams } from "@/i18n/server";
import { blogMessages, categoryLabel, formatPostDate, readingTime } from "@/i18n/messages/blog";
import { commonMessages } from "@/i18n/messages/common";
import Breadcrumbs from "@/components/Breadcrumbs";
import PostCard from "@/components/PostCard";
import AdSlot from "@/components/ads/AdSlot";

export const dynamic = "force-dynamic";

const SITE_URL = COMPANY.siteUrl;

type Props = { params: Promise<{ locale: string; slug: string }> };

/** TOC text comes from rendered HTML; decode the few entities marked emits. */
function decodeEntities(s: string) {
  return s
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&");
}

/** Languages to advertise in hreflang: the file translations, or just the current one (admin posts). */
function availableLocales(slug: string, locale: Locale): Locale[] {
  const list = postLocales(slug);
  return list.includes(locale) ? list : [locale];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await localeFromParams(params);
  const t = pick(blogMessages, locale);
  const post = await getPostBySlug(slug, locale);
  if (!post || post.status !== "published") return { title: t.post.notFound, robots: { index: false } };
  const description = post.description || post.excerpt || post.title;
  const path = `/blog/${post.slug}`;
  const ogImage = `${lp(locale, path)}/opengraph-image`;
  return {
    title: post.seoTitle ? { absolute: post.seoTitle } : post.title,
    description,
    keywords: post.keywords.length ? post.keywords : post.tags,
    alternates: alternatesFor(locale, path, availableLocales(post.slug, locale)),
    authors: [{ name: t.post.editorialTeam, url: `${SITE_URL}${lp(locale, "/about")}` }],
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: `${SITE_URL}${lp(locale, path)}`,
      siteName: COMPANY.brand,
      locale: LOCALE_META[locale].og,
      publishedTime: post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
      modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
      section: categoryLabel(post.category, locale),
      tags: post.tags,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.coverAlt || post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const locale = await localeFromParams(params);
  const t = pick(blogMessages, locale);
  const c = pick(commonMessages, locale);
  const post = await getPostBySlug(slug, locale);
  if (!post || post.status !== "published") notFound();

  const { html, toc } = renderMarkdown(post.content);
  const related = await getRelatedPosts(post, 3);
  const path = `/blog/${post.slug}`;
  const url = `${SITE_URL}${lp(locale, path)}`;
  const blogHref = lp(locale, "/blog");
  const updatedLater = post.updatedAt && post.updatedAt - post.createdAt > 86_400_000;
  const sections = toc.filter((x) => x.level === 2).map((x) => ({ ...x, text: decodeEntities(x.text) }));
  const category = categoryLabel(post.category, locale);
  const lang = LOCALE_META[locale].htmlLang;

  const graph: Record<string, unknown>[] = [
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: post.title,
      description: post.description || post.excerpt,
      image: [`${url}/opengraph-image`],
      datePublished: post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
      dateModified: new Date(post.updatedAt || post.createdAt || Date.now()).toISOString(),
      articleSection: category,
      keywords: [...post.keywords, ...post.tags].join(", ") || undefined,
      wordCount: post.content.split(/\s+/).filter(Boolean).length,
      inLanguage: lang,
      author: {
        "@type": "Organization",
        name: t.post.editorialTeam,
        url: `${SITE_URL}${lp(locale, "/about")}`,
      },
      publisher: { "@id": `${SITE_URL}/#organization` },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: c.common.home, item: `${SITE_URL}${lp(locale, "/")}` },
        { "@type": "ListItem", position: 2, name: c.nav.blog, item: `${SITE_URL}${blogHref}` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];
  if (post.faq.length) {
    graph.push({
      "@type": "FAQPage",
      inLanguage: lang,
      mainEntity: post.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  const jsonLd = { "@context": "https://schema.org", "@graph": graph };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header className="hero-bg">
        <div aria-hidden="true" className="hero-glow" />
        <div className="container relative max-w-6xl pb-10 pt-8 md:pb-12 md:pt-12">
          <Breadcrumbs
            items={[
              { href: lp(locale, "/"), label: c.common.home },
              { href: blogHref, label: c.nav.blog },
              { label: category },
            ]}
          />
          <div className="mt-8 max-w-3xl">
            <Link
              href={`${blogHref}?category=${encodeURIComponent(post.category)}`}
              rel="nofollow"
              className="eyebrow transition-colors hover:border-brand-300 dark:hover:border-brand-400/40"
            >
              {category}
            </Link>
            <h1 className="mt-5 text-3xl font-extrabold leading-[1.12] tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
              {post.title}
            </h1>
            {post.excerpt && <p className="lead mt-5">{post.excerpt}</p>}

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
              <Link href={lp(locale, "/about")} className="group inline-flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm shadow-brand-600/30">
                  <Gauge className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="font-semibold text-slate-800 transition-colors group-hover:text-brand-700 dark:text-slate-200 dark:group-hover:text-brand-300">
                  {t.post.editorialTeam}
                </span>
              </Link>
              {post.createdAt > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">{t.post.published} </span>
                  <time dateTime={new Date(post.createdAt).toISOString()}>{formatPostDate(post.createdAt, locale)}</time>
                </span>
              )}
              {updatedLater ? (
                <span className="inline-flex items-center gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  {t.post.updated}{" "}
                  <time dateTime={new Date(post.updatedAt).toISOString()}>{formatPostDate(post.updatedAt, locale)}</time>
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {readingTime(post.readingMinutes, locale)}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-6xl pb-16 md:pb-24">
        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={post.coverAlt || post.title}
            width={1200}
            height={630}
            fetchPriority="high"
            className="mb-12 aspect-[1200/630] w-full rounded-2xl border border-slate-200/80 bg-slate-50 object-cover shadow-sm dark:border-white/[0.08] dark:bg-ink-900 md:rounded-3xl"
          />
        )}

        <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1fr)_260px] xl:gap-16">
          <div className="min-w-0 max-w-3xl">
            {/* Mobile table of contents */}
            {sections.length > 2 && (
              <details className="card-muted group mb-10 p-5 lg:hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                  <span className="inline-flex items-center gap-2">
                    <ListOrdered className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden="true" /> {t.post.inThisArticle}
                  </span>
                  <Plus className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-45" aria-hidden="true" />
                </summary>
                <ol className="mt-4 space-y-2.5 border-s border-slate-200 text-sm dark:border-white/10">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="-ms-px block border-s border-transparent ps-4 text-slate-600 transition-colors hover:border-brand-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      >
                        {s.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
            )}

            <div className="post-body" dangerouslySetInnerHTML={{ __html: html }} />

            <AdSlot placement="inContent" className="my-12" />

            {/* FAQ */}
            {post.faq.length > 0 && (
              <section className="mt-14" aria-labelledby="faq-heading">
                <h2 id="faq-heading" className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {t.post.faqHeading}
                </h2>
                <div className="mt-6 space-y-3">
                  {post.faq.map((f) => (
                    <details key={f.q} className="faq-item group">
                      <summary className="faq-q">
                        {f.q}
                        <Plus
                          className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-45 group-open:text-brand-600 dark:group-open:text-brand-400"
                          aria-hidden="true"
                        />
                      </summary>
                      <p className="faq-a text-[0.95rem]">{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
              <ul className="mt-12 flex flex-wrap gap-2" aria-label={t.post.tagsLabel}>
                {post.tags.map((tag) => (
                  <li key={tag} className="pill">
                    #{tag}
                  </li>
                ))}
              </ul>
            )}

            {/* About the author */}
            <div className="card-muted mt-10 flex gap-4 p-6">
              <span className="icon-tile-solid">
                <Gauge className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{t.post.editorialTeam}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {t.post.authorBioStart}{" "}
                  <Link href={lp(locale, "/editorial-policy")} className="link">
                    {t.post.authorBioPolicy}
                  </Link>{" "}
                  {t.post.authorBioOr}{" "}
                  <Link href={lp(locale, "/contact")} className="link">
                    {t.post.authorBioCorrection}
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="relative mt-10 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-8 text-center text-white shadow-xl shadow-brand-600/20 ring-1 ring-inset ring-white/10 dark:from-brand-600 dark:via-brand-800 dark:to-ink-900 dark:shadow-none sm:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_50%_0%,rgba(125,211,252,0.25),transparent)]"
              />
              <div className="relative">
                <h2 className="text-2xl font-extrabold tracking-tight">{t.post.ctaTitle}</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-brand-100">{t.post.ctaText}</p>
                <Link href={lp(locale, "/")} className="btn-white mt-6">
                  <Gauge className="h-5 w-5" aria-hidden="true" /> {t.post.ctaButton}
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar (sits on the end side; flips automatically in RTL) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {sections.length > 2 && (
                <nav aria-label={t.post.tocLabel}>
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white rtl:normal-case rtl:tracking-normal">
                    <ListOrdered className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden="true" /> {t.post.inThisArticle}
                  </p>
                  <ol className="mt-4 max-h-[60vh] space-y-2.5 overflow-y-auto border-s border-slate-200 text-sm dark:border-white/10">
                    {sections.map((s) => (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          className="-ms-px block border-s border-transparent ps-4 leading-snug text-slate-500 transition-colors hover:border-brand-500 hover:text-slate-900 dark:text-slate-400 dark:hover:border-brand-400 dark:hover:text-white"
                        >
                          {s.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}
              <div className="card p-5">
                <span className="icon-tile h-9 w-9 rounded-lg">
                  <Gauge className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="mt-3 text-sm font-bold text-slate-900 dark:text-white">{t.post.sideTitle}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{t.post.sideText}</p>
                <Link href={lp(locale, "/")} className="btn-primary mt-4 w-full py-2.5">
                  {t.post.sideCta}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-20 border-t border-slate-200/80 pt-14 dark:border-white/[0.08]" aria-labelledby="related-heading">
            <div className="flex items-end justify-between gap-4">
              <h2 id="related-heading" className="h-section text-2xl sm:text-3xl">
                {t.post.keepReading}
              </h2>
              <Link href={blogHref} className="link hidden items-center gap-1.5 text-sm sm:inline-flex">
                {t.post.allArticles}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} locale={locale} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-12">
          <Link href={blogHref} className="btn-ghost -ms-3 px-3">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" /> {t.post.allArticles}
          </Link>
        </div>
      </div>
    </article>
  );
}
