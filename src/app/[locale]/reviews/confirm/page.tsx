import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Gauge, LinkIcon } from "lucide-react";
import { localeFromParams } from "@/i18n/server";
import { lp, pick } from "@/i18n/config";
import { fill, reviewsMessages } from "@/i18n/messages/reviews";
import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { consumeToken } from "@/lib/userAuth";
import { publishReview } from "@/lib/reviews";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ token?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  return { title: pick(reviewsMessages, locale).confirm.metaTitle, robots: { index: false, follow: false } };
}

/** Confirms a guest review: one-time token → email verified → published. */
async function confirm(token: string): Promise<{ provider: string; slug: string } | null> {
  if (!adminConfigured || !token) return null;
  const t = await consumeToken(token, "review");
  if (!t?.reviewId) return null;
  const ref = adminDb().collection("reviews").doc(t.reviewId);
  const snap = await ref.get();
  if (!snap.exists || String(snap.get("email")) !== t.email) return null;
  await ref.update({ emailVerified: true });
  if (snap.get("status") !== "hidden") await publishReview(t.reviewId);
  return { provider: String(snap.get("provider") || ""), slug: String(snap.get("providerSlug") || "") };
}

export default async function ConfirmReviewPage({ params, searchParams }: Props) {
  const locale = await localeFromParams(params);
  const { token = "" } = await searchParams;
  const m = pick(reviewsMessages, locale).confirm;
  const res = await confirm(String(token)).catch(() => null);

  return (
    <div className="hero-bg">
      <div aria-hidden="true" className="hero-glow" />
      <div className="container flex max-w-xl flex-col items-center py-20 text-center md:py-28">
        <span className={`flex h-16 w-16 items-center justify-center rounded-2xl ${res ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300" : "bg-amber-100 text-amber-600 dark:bg-amber-400/15 dark:text-amber-300"}`}>
          {res ? <CheckCircle2 className="h-8 w-8" aria-hidden="true" /> : <LinkIcon className="h-8 w-8" aria-hidden="true" />}
        </span>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{res ? m.okTitle : m.badTitle}</h1>
        <p className="lead mt-3">{res ? fill(m.okText, { provider: res.provider }) : m.badText}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {res?.slug && (
            <Link href={lp(locale, `/providers/${res.slug}`)} className="btn-primary px-5 py-3">
              {m.okLink}
            </Link>
          )}
          <Link href={`${lp(locale, "/")}#speed-test`} className={`${res ? "btn-secondary" : "btn-primary"} px-5 py-3`}>
            <Gauge className="h-4 w-4" aria-hidden="true" /> {m.home}
          </Link>
        </div>
      </div>
    </div>
  );
}
