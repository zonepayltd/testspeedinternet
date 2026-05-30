import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { ArrowLeft, Calendar, Gauge } from "lucide-react";
import { getPostBySlug } from "@/lib/posts";

export const dynamic = "force-dynamic";

const SITE_URL = "https://testspeedinternet.com";

function fmtDate(ms: number) {
  if (!ms) return "";
  return new Date(ms).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt || post.title,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") notFound();

  const html = await marked.parse(post.content || "");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage || undefined,
    datePublished: post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
    dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
    author: { "@type": "Organization", name: "TestSpeedInternet" },
    publisher: { "@type": "Organization", name: "TestSpeedInternet" },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <article className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-gradient-to-b from-brand-50/70 to-white">
        <div className="container max-w-3xl py-12 md:py-16">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
            <ArrowLeft className="h-4 w-4" /> All articles
          </Link>

          {post.tags?.[0] && (
            <span className="mt-6 block text-xs font-bold uppercase tracking-wider text-brand-500">{post.tags[0]}</span>
          )}
          <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-3 flex items-center gap-2 text-sm text-slate-400">
            <Calendar className="h-4 w-4" />
            {fmtDate(post.createdAt)}
          </p>
        </div>
      </div>

      <div className="container max-w-3xl pb-16 md:pb-24">
        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverImage} alt={post.title} className="mb-8 w-full rounded-2xl object-cover" />
        )}
        {post.excerpt && (
          <p className="mb-8 border-l-4 border-brand-200 pl-4 text-lg leading-relaxed text-slate-600">{post.excerpt}</p>
        )}
        <div className="post-body" dangerouslySetInnerHTML={{ __html: html }} />

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-center text-white">
          <h2 className="text-xl font-extrabold">Curious about your own speed?</h2>
          <p className="mt-2 text-sm text-brand-100">Run a free internet speed test in seconds.</p>
          <Link href="/" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-700 transition-transform hover:scale-105">
            <Gauge className="h-5 w-5" /> Test your speed
          </Link>
        </div>
      </div>
    </article>
  );
}
