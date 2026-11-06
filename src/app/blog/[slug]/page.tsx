import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Gauge, ChevronRight, ListOrdered, UserRound } from "lucide-react";
import { getPostBySlug, getRelatedPosts } from "@/lib/posts";
import { renderMarkdown } from "@/lib/markdown";
import { COMPANY } from "@/lib/company";
import Breadcrumbs from "@/components/Breadcrumbs";
import PostCard from "@/components/PostCard";
import AdSlot from "@/components/ads/AdSlot";

export const dynamic = "force-dynamic";

const SITE_URL = COMPANY.siteUrl;

function fmtDate(ms: number) {
  if (!ms) return "";
  return new Date(ms).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") return { title: "Article not found", robots: { index: false } };
  const description = post.description || post.excerpt || post.title;
  const ogImage = `/blog/${post.slug}/opengraph-image`;
  return {
    title: post.seoTitle ? { absolute: post.seoTitle } : post.title,
    description,
    keywords: post.keywords.length ? post.keywords : post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    authors: [{ name: `${COMPANY.brand} Editorial Team`, url: `${SITE_URL}/about` }],
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: `${SITE_URL}/blog/${post.slug}`,
      siteName: COMPANY.brand,
      publishedTime: post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
      modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
      section: post.category,
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

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") notFound();

  const { html, toc } = renderMarkdown(post.content);
  const related = await getRelatedPosts(post, 3);
  const url = `${SITE_URL}/blog/${post.slug}`;
  const updatedLater = post.updatedAt && post.updatedAt - post.createdAt > 86_400_000;
  const sections = toc.filter((t) => t.level === 2);

  const graph: Record<string, unknown>[] = [
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: post.title,
      description: post.description || post.excerpt,
      image: [`${url}/opengraph-image`],
      datePublished: post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
      dateModified: new Date(post.updatedAt || post.createdAt || Date.now()).toISOString(),
      articleSection: post.category,
      keywords: [...post.keywords, ...post.tags].join(", ") || undefined,
      wordCount: post.content.split(/\s+/).filter(Boolean).length,
      inLanguage: "en",
      author: {
        "@type": "Organization",
        name: `${COMPANY.brand} Editorial Team`,
        url: `${SITE_URL}/about`,
      },
      publisher: { "@id": `${SITE_URL}/#organization` },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];
  if (post.faq.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: post.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  const jsonLd = { "@context": "https://schema.org", "@graph": graph };

  return (
    <article className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header className="bg-gradient-to-b from-brand-50/70 to-white">
        <div className="container max-w-5xl pb-8 pt-8 md:pb-10 md:pt-12">
          <Breadcrumbs
            items={[
              { href: "/", label: "Home" },
              { href: "/blog", label: "Blog" },
              { label: post.category },
            ]}
          />
          <div className="max-w-3xl">
            <span className="mt-6 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">
              {post.category}
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-[2.75rem]">
              {post.title}
            </h1>
            {post.excerpt && <p className="mt-4 text-lg leading-relaxed text-slate-600">{post.excerpt}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="h-4 w-4" aria-hidden="true" />
                <Link href="/about" className="font-medium text-slate-700 hover:text-brand-700">
                  {COMPANY.brand} Editorial Team
                </Link>
              </span>
              {post.createdAt > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  <time dateTime={new Date(post.createdAt).toISOString()}>{fmtDate(post.createdAt)}</time>
                  {updatedLater ? <span className="text-slate-400">· Updated {fmtDate(post.updatedAt)}</span> : null}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {post.readingMinutes} min read
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-5xl pb-16 md:pb-24">
        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={post.coverAlt || post.title}
            width={1200}
            height={630}
            className="mb-10 aspect-[1200/630] w-full rounded-3xl border border-slate-100 object-cover shadow-sm"
          />
        )}

        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="min-w-0">
            {/* Mobile table of contents */}
            {sections.length > 2 && (
              <details className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 lg:hidden">
                <summary className="flex cursor-pointer items-center gap-2 text-sm font-bold text-slate-900">
                  <ListOrdered className="h-4 w-4 text-brand-600" aria-hidden="true" /> In this article
                </summary>
                <ol className="mt-3 space-y-2 text-sm">
                  {sections.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="text-slate-600 hover:text-brand-700">{t.text}</a>
                    </li>
                  ))}
                </ol>
              </details>
            )}

            <div className="post-body" dangerouslySetInnerHTML={{ __html: html }} />

            <AdSlot placement="inContent" className="my-10" />

            {/* FAQ */}
            {post.faq.length > 0 && (
              <section className="mt-12" aria-labelledby="faq-heading">
                <h2 id="faq-heading" className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Frequently asked questions
                </h2>
                <div className="mt-5 space-y-3">
                  {post.faq.map((f) => (
                    <details
                      key={f.q}
                      className="group rounded-xl border border-slate-200 bg-white p-5 [&_summary::-webkit-details-marker]:hidden"
                    >
                      <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-slate-900">
                        {f.q}
                        <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-90" aria-hidden="true" />
                      </summary>
                      <p className="mt-3 text-[0.95rem] leading-relaxed text-slate-600">{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
              <ul className="mt-10 flex flex-wrap gap-2" aria-label="Tags">
                {post.tags.map((t) => (
                  <li key={t} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                    #{t}
                  </li>
                ))}
              </ul>
            )}

            {/* About the author */}
            <div className="mt-10 flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                <Gauge className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <p className="font-bold text-slate-900">{COMPANY.brand} Editorial Team</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  We write practical, plain-English guides on internet speed, WiFi and home networking, and
                  check every article for accuracy. Read our{" "}
                  <Link href="/editorial-policy" className="font-semibold text-brand-600 hover:text-brand-700">
                    editorial policy
                  </Link>{" "}
                  or{" "}
                  <Link href="/contact" className="font-semibold text-brand-600 hover:text-brand-700">
                    send us a correction
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10 rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-center text-white">
              <h2 className="text-xl font-extrabold">Check your own connection</h2>
              <p className="mt-2 text-sm text-brand-100">
                Measure your download, upload, ping and jitter in about 30 seconds. Free, no app needed.
              </p>
              <Link
                href="/"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-700 transition-transform hover:scale-105"
              >
                <Gauge className="h-5 w-5" aria-hidden="true" /> Run a speed test
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {sections.length > 2 && (
                <nav aria-label="Table of contents" className="rounded-2xl border border-slate-200 p-5">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                    <ListOrdered className="h-4 w-4 text-brand-600" aria-hidden="true" /> In this article
                  </p>
                  <ol className="mt-3 space-y-2 text-sm">
                    {sections.map((t) => (
                      <li key={t.id}>
                        <a href={`#${t.id}`} className="block leading-snug text-slate-500 hover:text-brand-700">
                          {t.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}
              <div className="rounded-2xl border border-brand-100 bg-brand-50 p-5">
                <p className="text-sm font-bold text-slate-900">Free speed test</p>
                <p className="mt-1 text-sm text-slate-600">See your real download, upload and ping now.</p>
                <Link href="/" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800">
                  Start test <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-slate-100 pt-12" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-2xl font-extrabold tracking-tight text-slate-900">
              Keep reading
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-12">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All articles
          </Link>
        </div>
      </div>
    </article>
  );
}
