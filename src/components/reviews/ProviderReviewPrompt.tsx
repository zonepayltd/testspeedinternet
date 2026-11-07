"use client";

// After a speed test: "How would you rate {provider}?" + community rating + 5 big stars.
// Picking stars opens the review form (the test is attached → "verified speed test").

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import ProviderLogo from "@/components/reviews/ProviderLogo";
import ReviewForm from "@/components/reviews/ReviewForm";
import { StarDisplay, StarInput } from "@/components/reviews/Stars";
import { useLocale } from "@/i18n/client";
import { LOCALE_META, lp, pick } from "@/i18n/config";
import { fill, reviewsCountText, reviewsMessages } from "@/i18n/messages/reviews";
import type { FinishedTest } from "@/components/aftertest/types";

type Summary = { slug: string; count: number; average: number } | null;
const DONE_KEY = "tsi_reviewed_tests";

function wasReviewed(testId: string): boolean {
  try {
    return (JSON.parse(localStorage.getItem(DONE_KEY) || "[]") as string[]).includes(testId);
  } catch {
    return false;
  }
}
function markReviewed(testId: string) {
  try {
    const list = (JSON.parse(localStorage.getItem(DONE_KEY) || "[]") as string[]).filter((x) => x !== testId);
    localStorage.setItem(DONE_KEY, JSON.stringify([...list, testId].slice(-30)));
  } catch {
    /* storage unavailable */
  }
}

/** Same rule as providerSlug() in src/lib/reviews.ts (server-only). */
const slugify = (name: string) =>
  name.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/&/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

export default function ProviderReviewPrompt({ test }: { test: FinishedTest }) {
  const locale = useLocale();
  const m = pick(reviewsMessages, locale);
  const [summary, setSummary] = useState<Summary>(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [finished, setFinished] = useState(false);
  const provider = test.provider;
  const slug = slugify(provider);

  useEffect(() => {
    setDone(wasReviewed(test.testId));
    setRating(0);
    setOpen(false);
    setFinished(false);
  }, [test.testId]);

  useEffect(() => {
    if (!provider) return;
    let alive = true;
    fetch(`/api/reviews/summary?provider=${encodeURIComponent(provider)}`)
      .then((r) => r.json())
      .then((d) => alive && setSummary(d?.summary ? { slug: d.slug, count: d.summary.count, average: d.summary.average } : null))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [provider]);

  if (!provider) return null;
  const nf = new Intl.NumberFormat(LOCALE_META[locale].htmlLang, { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  const providerHref = lp(locale, `/providers/${summary?.slug || slug}`);

  return (
    <section className={`card animate-fade-in-up p-4 sm:p-5 ${open ? "lg:col-span-2" : ""}`} aria-labelledby={`rv-title-${test.testId}`}>
      <div className="flex items-start gap-3">
        <ProviderLogo name={provider} domain={test.providerDomain} size={44} />
        <div className="min-w-0 flex-1">
          <h3 id={`rv-title-${test.testId}`} className="text-base font-semibold text-slate-900 dark:text-white">
            {fill(m.prompt.title, { provider })}
          </h3>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm muted">
            {summary && summary.count > 0 ? (
              <>
                <StarDisplay value={summary.average} size={14} label={fill(m.starOf, { n: nf.format(summary.average) })} />
                <span className="font-semibold text-slate-700 dark:text-slate-200">{nf.format(summary.average)}</span>
                <span>· {reviewsCountText(m, summary.count)}</span>
                <Link href={providerHref} className="link inline-flex items-center gap-0.5">
                  {m.prompt.seeAll}
                  <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
                </Link>
              </>
            ) : (
              <span>{fill(m.prompt.first, { provider })}</span>
            )}
          </p>
        </div>
      </div>

      {done && !finished ? (
        <p className="mt-4 flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> {m.prompt.done}
        </p>
      ) : !open ? (
        <div className="mt-4">
          <StarInput
            value={rating}
            hover={hover}
            onHover={setHover}
            onChange={(n) => {
              setRating(n);
              setOpen(true);
            }}
            labels={m.stars}
            legend={fill(m.prompt.title, { provider })}
            size={34}
            name={`rv-quick-${test.testId}`}
          />
          <p className="mt-2 text-xs muted">{fill(m.prompt.sub, { provider })}</p>
        </div>
      ) : (
        <div className="mt-4 border-t border-slate-100 pt-4 dark:border-white/[0.06]">
          <ReviewForm
            provider={provider}
            providerDomain={test.providerDomain}
            testId={test.testId}
            rating={rating}
            verified
            idPrefix={`rv-${test.testId.slice(0, 8)}`}
            onCancel={() => setOpen(false)}
            onDone={() => {
              markReviewed(test.testId);
              setFinished(true);
            }}
          />
        </div>
      )}
    </section>
  );
}
