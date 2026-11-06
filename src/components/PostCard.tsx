import Link from "next/link";
import { ArrowRight, Clock, Newspaper } from "lucide-react";
import { lp, type Locale } from "@/i18n/config";
import { categoryLabel, readingTime } from "@/i18n/messages/blog";

type CardPost = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  coverAlt: string;
  category: string;
  readingMinutes: number;
};

export default function PostCard({ post, locale, priority = false }: { post: CardPost; locale: Locale; priority?: boolean }) {
  return (
    <Link href={lp(locale, `/blog/${post.slug}`)} className="card card-hover group flex flex-col overflow-hidden">
      <div className="relative overflow-hidden border-b border-slate-200/80 bg-slate-50 dark:border-white/[0.06] dark:bg-ink-850">
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={post.coverAlt || post.title}
            width={1200}
            height={630}
            loading={priority ? "eager" : "lazy"}
            className="aspect-[1200/630] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex aspect-[1200/630] w-full items-center justify-center bg-gradient-to-br from-brand-50 to-cyan-50 dark:from-brand-500/10 dark:to-cyan-500/5">
            <Newspaper className="h-8 w-8 text-brand-300 dark:text-brand-400/60" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <span className="kicker">{categoryLabel(post.category, locale)}</span>
        <h3 className="mt-2 text-lg font-bold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{post.excerpt}</p>
        <div className="mt-5 flex items-center justify-between text-xs font-medium text-slate-400 dark:text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {readingTime(post.readingMinutes, locale)}
          </span>
          <ArrowRight
            className="h-4 w-4 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-brand-600 rtl:rotate-180 rtl:group-hover:-translate-x-0.5 dark:text-slate-600 dark:group-hover:text-brand-400"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
}
