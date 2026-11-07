"use client";

import { useState } from "react";
import { PenLine } from "lucide-react";
import ReviewForm from "@/components/reviews/ReviewForm";
import { useLocale } from "@/i18n/client";
import { pick } from "@/i18n/config";
import { fill, reviewsMessages } from "@/i18n/messages/reviews";

/** "Write a review" button that expands into the form (provider pages). */
export default function WriteReview({ provider, domain }: { provider: string; domain: string }) {
  const locale = useLocale();
  const m = pick(reviewsMessages, locale);
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button type="button" className="btn-primary px-5 py-2.5" onClick={() => setOpen(true)}>
        <PenLine className="h-4 w-4" aria-hidden="true" /> {m.provider.write}
      </button>
    );
  }
  return (
    <section className="card p-5 sm:p-6" aria-labelledby="write-review-title" id="write-review">
      <h2 id="write-review-title" className="h-card mb-4">{fill(m.provider.writeTitle, { provider })}</h2>
      <ReviewForm provider={provider} providerDomain={domain} idPrefix="wr" onCancel={() => setOpen(false)} />
    </section>
  );
}
