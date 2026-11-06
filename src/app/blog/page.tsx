import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper, Gauge, ArrowRight, Clock } from "lucide-react";
import { getPublishedPosts } from "@/lib/posts";
import { COMPANY } from "@/lib/company";
import PostCard from "@/components/PostCard";
import AdSlot from "@/components/ads/AdSlot";

export const metadata: Metadata = {
  title: "Blog: Internet Speed & WiFi Guides",
  description:
    "Practical guides on internet speed, WiFi, ping, streaming and fixing slow connections. Clear, tested advice from the TestSpeedInternet editorial team.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "TestSpeedInternet Blog: Internet Speed & WiFi Guides",
    description: "Practical guides on internet speed, WiFi, ping, streaming and fixing slow connections.",
    url: `${COMPANY.siteUrl}/blog`,
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const all = await getPublishedPosts();
  const categories = Array.from(new Set(all.map((p) => p.category))).sort();
  const posts = category ? all.filter((p) => p.category === category) : all;
  const [featured, ...rest] = posts;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${COMPANY.brand} Blog`,
    url: `${COMPANY.siteUrl}/blog`,
    isPartOf: { "@id": `${COMPANY.siteUrl}/#website` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: all.slice(0, 50).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${COMPANY.siteUrl}/blog/${p.slug}`,
        name: p.title,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/80 via-white to-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(37,99,235,0.12),transparent)]" />
        <div className="container relative flex flex-col items-center py-14 text-center md:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 shadow-sm backdrop-blur">
            <Newspaper className="h-3.5 w-3.5" aria-hidden="true" />
            Blog &amp; Guides
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
            Internet speed{" "}
            <span className="bg-gradient-to-r from-brand-600 to-cyan-500 bg-clip-text text-transparent">tips &amp; guides</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
            Clear, practical advice to test, understand and speed up your internet connection and home WiFi.
          </p>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container max-w-6xl">
          {categories.length > 1 && (
            <nav aria-label="Categories" className="mb-10 flex flex-wrap justify-center gap-2">
              <Link
                href="/blog"
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  !category ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-brand-300"
                }`}
              >
                All
              </Link>
              {categories.map((c) => (
                <Link
                  key={c}
                  href={`/blog?category=${encodeURIComponent(c)}`}
                  rel="nofollow"
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                    category === c ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-brand-300"
                  }`}
                >
                  {c}
                </Link>
              ))}
            </nav>
          )}

          {!featured ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <Newspaper className="mx-auto h-8 w-8 text-slate-300" aria-hidden="true" />
              <p className="mt-3 text-sm text-slate-500">No articles here yet. Check back soon!</p>
              <Link href="/" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700">
                <Gauge className="h-4 w-4" aria-hidden="true" /> Test your speed
              </Link>
            </div>
          ) : (
            <>
              {/* Featured */}
              <Link
                href={`/blog/${featured.slug}`}
                className="group grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-xl hover:shadow-brand-600/5 md:grid-cols-2"
              >
                {featured.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featured.coverImage}
                    alt={featured.coverAlt || featured.title}
                    width={1200}
                    height={630}
                    className="aspect-[1200/630] h-full w-full object-cover"
                  />
                )}
                <div className="flex flex-col justify-center p-6 md:p-10">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">{featured.category}</span>
                  <h2 className="mt-2 text-2xl font-extrabold leading-snug tracking-tight text-slate-900 group-hover:text-brand-700 md:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-slate-500">{featured.excerpt}</p>
                  <div className="mt-6 flex items-center gap-4 text-sm">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-brand-700">
                      Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {featured.readingMinutes} min read
                    </span>
                  </div>
                </div>
              </Link>

              {rest.length > 0 && (
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.slice(0, 6).map((p, i) => (
                    <PostCard key={p.slug} post={p} priority={i < 3} />
                  ))}
                </div>
              )}

              {rest.length > 6 && (
                <>
                  <AdSlot placement="inContent" className="my-10" />
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.slice(6).map((p) => (
                      <PostCard key={p.slug} post={p} />
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
