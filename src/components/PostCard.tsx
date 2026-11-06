import Link from "next/link";
import { ArrowRight, Clock, Newspaper } from "lucide-react";

type CardPost = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  coverAlt: string;
  category: string;
  readingMinutes: number;
};

export default function PostCard({ post, priority = false }: { post: CardPost; priority?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-600/5"
    >
      {post.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage}
          alt={post.coverAlt || post.title}
          width={1200}
          height={630}
          loading={priority ? "eager" : "lazy"}
          className="aspect-[1200/630] w-full object-cover"
        />
      ) : (
        <div className="flex aspect-[1200/630] w-full items-center justify-center bg-gradient-to-br from-brand-50 to-cyan-50">
          <Newspaper className="h-8 w-8 text-brand-300" aria-hidden="true" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">{post.category}</span>
        <h3 className="mt-1.5 text-lg font-bold leading-snug text-slate-900 group-hover:text-brand-700">{post.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-500">{post.excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {post.readingMinutes} min read
          </span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}
