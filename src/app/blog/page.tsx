import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper, ArrowRight, Gauge } from "lucide-react";
import { getPublishedPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog | Internet Speed, WiFi & Connection Tips",
  description:
    "Guides and tips on internet speed, WiFi, ping, fixing slow connections and getting the most from your broadband. From the TestSpeedInternet team.",
  alternates: { canonical: "/blog" },
};

export const dynamic = "force-dynamic";

function fmtDate(ms: number) {
  if (!ms) return "";
  return new Date(ms).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/80 via-white to-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(37,99,235,0.12),transparent)]" />
        <div className="container relative flex flex-col items-center py-14 text-center md:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 shadow-sm backdrop-blur">
            <Newspaper className="h-3.5 w-3.5" aria-hidden="true" />
            Blog
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
            Internet speed{" "}
            <span className="bg-gradient-to-r from-brand-600 to-cyan-500 bg-clip-text text-transparent">tips &amp; guides</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
            Learn how to test, understand and improve your internet connection.
          </p>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container max-w-5xl">
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <Newspaper className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">No articles published yet. Check back soon!</p>
              <Link href="/" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700">
                <Gauge className="h-4 w-4" /> Test your speed
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-600/5"
                >
                  {p.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.coverImage} alt={p.title} className="h-44 w-full object-cover" />
                  ) : (
                    <div className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-brand-50 to-cyan-50">
                      <Newspaper className="h-8 w-8 text-brand-300" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    {p.tags?.[0] && (
                      <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">{p.tags[0]}</span>
                    )}
                    <h2 className="mt-1.5 text-lg font-bold leading-snug text-slate-900 group-hover:text-brand-700">{p.title}</h2>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-500">{p.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                      <span>{fmtDate(p.createdAt)}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
