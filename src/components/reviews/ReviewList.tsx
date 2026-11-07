"use client";

import { useState } from "react";
import { BadgeCheck, Flag as FlagIcon, Loader2, ThumbsUp } from "lucide-react";
import { StarDisplay } from "@/components/reviews/Stars";
import { useLocale } from "@/i18n/client";
import { LOCALE_META, pick } from "@/i18n/config";
import { fill, reviewsMessages } from "@/i18n/messages/reviews";
import type { PublicReview, ReviewSort } from "@/lib/reviews";

type Page = { reviews: PublicReview[]; total: number; page: number; pages: number };

export default function ReviewList({ slug, initial }: { slug: string; initial: Page }) {
  const locale = useLocale();
  const m = pick(reviewsMessages, locale);
  const [sort, setSort] = useState<ReviewSort>("newest");
  const [data, setData] = useState<Page>(initial);
  const [loading, setLoading] = useState(false);

  const load = async (s: ReviewSort, page: number) => {
    setLoading(true);
    try {
      const d = await fetch(`/api/reviews?provider=${encodeURIComponent(slug)}&sort=${s}&page=${page}`, { cache: "no-store" }).then((r) => r.json());
      if (d.ok) setData((prev) => ({ reviews: page === 1 ? d.reviews : [...prev.reviews, ...d.reviews], total: d.total, page: d.page, pages: d.pages }));
    } finally {
      setLoading(false);
    }
  };

  if (!data.total) return <p className="card p-6 text-center text-sm muted">{m.list.empty}</p>;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{m.list.sort}</span>
        {(Object.keys(m.list.sorts) as ReviewSort[]).map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={sort === s}
            onClick={() => {
              setSort(s);
              load(s, 1);
            }}
            className={`pill transition-colors ${sort === s ? "pill-active" : "hover:border-brand-300"}`}
          >
            {m.list.sorts[s]}
          </button>
        ))}
        {loading && <Loader2 className="h-4 w-4 animate-spin text-slate-400" aria-label={m.list.loading} />}
      </div>

      <ul className={`space-y-4 ${loading ? "opacity-70 transition-opacity" : ""}`}>
        {data.reviews.map((r) => (
          <ReviewItem key={r.id} r={r} />
        ))}
      </ul>

      {data.page < data.pages && (
        <div className="mt-6 text-center">
          <button type="button" className="btn-secondary px-5 py-2.5" disabled={loading} onClick={() => load(sort, data.page + 1)}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {m.list.loadMore}
          </button>
        </div>
      )}
    </div>
  );
}

function ReviewItem({ r }: { r: PublicReview }) {
  const locale = useLocale();
  const m = pick(reviewsMessages, locale);
  const lang = LOCALE_META[locale].htmlLang;
  const [helpful, setHelpful] = useState(r.helpful);
  const [voted, setVoted] = useState(false);
  const [reported, setReported] = useState(false);
  const nf = new Intl.NumberFormat(lang, { maximumFractionDigits: 1 });
  const date = r.createdAt ? new Intl.DateTimeFormat(lang, { year: "numeric", month: "short", day: "numeric" }).format(r.createdAt) : "";

  const vote = async () => {
    if (voted) return;
    setVoted(true);
    const d = await fetch(`/api/reviews/${r.id}/helpful`, { method: "POST" }).then((x) => x.json()).catch(() => null);
    if (d?.ok && typeof d.helpful === "number") setHelpful(d.helpful);
  };
  const report = async () => {
    if (reported || !window.confirm(m.list.reportConfirm)) return;
    setReported(true);
    await fetch(`/api/reviews/${r.id}/report`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }).catch(() => null);
  };

  return (
    <li className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-sm font-bold uppercase text-slate-700 dark:from-white/10 dark:to-white/5 dark:text-slate-200" aria-hidden="true">
            {(r.name || "?").trim()[0]}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900 dark:text-white">{r.name}</p>
            <p className="flex flex-wrap items-center gap-1.5 text-xs muted">
              {r.countryCode && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`https://flagcdn.com/${r.countryCode.toLowerCase()}.svg`} alt={r.countryCode} width={16} height={12} loading="lazy" className="h-3 w-4 rounded-[2px] object-cover" />
              )}
              {r.city && <span>{r.city}</span>}
              {date && (
                <>
                  {(r.city || r.countryCode) && <span aria-hidden="true">·</span>}
                  <time dateTime={new Date(r.createdAt).toISOString()}>{date}</time>
                </>
              )}
            </p>
          </div>
        </div>
        <StarDisplay value={r.rating} size={18} label={fill(m.starOf, { n: r.rating })} />
      </div>

      {r.verifiedCustomer && (
        <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20" title={m.list.verifiedTip}>
          <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> {m.list.verified}
        </p>
      )}

      {r.title && <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">{r.title}</h3>}
      <p className="mt-1.5 whitespace-pre-line break-words text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">{r.comment}</p>

      {(r.download != null || r.upload != null || r.ping != null) && (
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400" dir="ltr">
          <span className="font-medium">{m.list.measured}:</span>
          {r.download != null && <span>↓ {nf.format(r.download)} Mbps</span>}
          {r.upload != null && <span>↑ {nf.format(r.upload)} Mbps</span>}
          {r.ping != null && <span>{nf.format(r.ping)} ms</span>}
        </p>
      )}

      <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3 text-xs dark:border-white/[0.06]">
        <button type="button" onClick={vote} disabled={voted} aria-pressed={voted} className="inline-flex items-center gap-1.5 font-medium text-slate-600 transition-colors hover:text-brand-700 disabled:cursor-default dark:text-slate-300 dark:hover:text-brand-300">
          <ThumbsUp className={`h-3.5 w-3.5 ${voted ? "fill-current text-brand-600 dark:text-brand-400" : ""}`} aria-hidden="true" />
          {voted ? m.list.helpfulThanks : m.list.helpful}
          {helpful > 0 && <span className="tabular-nums">({helpful})</span>}
        </button>
        <button type="button" onClick={report} disabled={reported} className="ms-auto inline-flex items-center gap-1 text-slate-400 transition-colors hover:text-rose-600 disabled:cursor-default">
          <FlagIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {reported ? m.list.reported : m.list.report}
        </button>
      </div>
    </li>
  );
}
