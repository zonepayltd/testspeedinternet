// Internet-provider reviews. Server-only.
//
// Firestore:
//   reviews/{id}       one review (see ReviewDoc). status: pending (email not confirmed yet)
//                      | published | hidden (by admin). Only "published" is public.
//   providers/{slug}   aggregate per provider: name, domain, count, sum, dist {1..5},
//                      lastReviewAt — kept in sync by publish/unpublish in transactions.
//
// Queries only use single-field filters (no composite indexes); sorting happens in memory.
import "server-only";
import { FieldValue, type DocumentSnapshot } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";

export type ReviewStatus = "pending" | "published" | "hidden";

export type ReviewDoc = {
  providerSlug: string;
  provider: string; // display name, e.g. "Maroc Telecom"
  providerDomain: string; // for the logo, e.g. "iam.ma" ("" if unknown)
  rating: number; // 1..5
  title: string;
  comment: string;
  name: string; // shown publicly (first name + initial is fine)
  email: string; // never public
  userId: string | null;
  countryCode: string;
  city: string;
  locale: string;
  // connection measured by the test the review came from (optional)
  testId: string | null;
  download: number | null;
  upload: number | null;
  ping: number | null;
  status: ReviewStatus;
  emailVerified: boolean;
  helpful: number;
  reports: number;
  ip: string;
  createdAt?: FirebaseFirestore.Timestamp;
  publishedAt?: FirebaseFirestore.Timestamp | null;
};

export type PublicReview = {
  id: string; providerSlug: string; provider: string; rating: number; title: string; comment: string; name: string;
  countryCode: string; city: string; download: number | null; upload: number | null; ping: number | null;
  verifiedCustomer: boolean; // left right after a real speed test on that provider
  helpful: number; createdAt: number;
};

export type ProviderSummary = {
  slug: string; name: string; domain: string; count: number; average: number; dist: Record<"1" | "2" | "3" | "4" | "5", number>; lastReviewAt: number;
};

const reviews = () => adminDb().collection("reviews");
const providers = () => adminDb().collection("providers");
const ms = (t: unknown) => (t && typeof (t as { toMillis?: () => number }).toMillis === "function" ? (t as { toMillis: () => number }).toMillis() : 0);

/** "Maroc Telecom" → "maroc-telecom", "Algérie Télécom" → "algerie-telecom", "e& (Etisalat)" → "e-etisalat". */
export function providerSlug(name: string): string {
  return String(name || "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function toPublicReview(snap: DocumentSnapshot): PublicReview {
  const d = (snap.data() || {}) as Partial<ReviewDoc>;
  return {
    id: snap.id,
    providerSlug: d.providerSlug || "",
    provider: d.provider || "",
    rating: Number(d.rating) || 0,
    title: d.title || "",
    comment: d.comment || "",
    name: d.name || "",
    countryCode: (d.countryCode || "").toUpperCase(),
    city: d.city || "",
    download: d.download ?? null,
    upload: d.upload ?? null,
    ping: d.ping ?? null,
    verifiedCustomer: !!d.testId,
    helpful: Number(d.helpful) || 0,
    createdAt: ms(d.publishedAt) || ms(d.createdAt),
  };
}

const EMPTY_DIST = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 } as const;

export function toProviderSummary(snap: DocumentSnapshot): ProviderSummary {
  const d = snap.data() || {};
  const count = Number(d.count) || 0;
  return {
    slug: snap.id,
    name: String(d.name || snap.id),
    domain: String(d.domain || ""),
    count,
    average: count ? Math.round(((Number(d.sum) || 0) / count) * 10) / 10 : 0,
    dist: { ...EMPTY_DIST, ...(d.dist || {}) },
    lastReviewAt: ms(d.lastReviewAt),
  };
}

/** Make a review public and add it to its provider's aggregate (no-op if already published). */
export async function publishReview(id: string): Promise<boolean> {
  const ref = reviews().doc(id);
  return adminDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const d = snap.data() as ReviewDoc | undefined;
    if (!d || d.status === "published") return false;
    const pref = providers().doc(d.providerSlug);
    tx.update(ref, { status: "published", publishedAt: FieldValue.serverTimestamp() });
    tx.set(
      pref,
      {
        name: d.provider,
        domain: d.providerDomain || "",
        count: FieldValue.increment(1),
        sum: FieldValue.increment(d.rating),
        dist: { [String(d.rating)]: FieldValue.increment(1) },
        lastReviewAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    return true;
  });
}

/** Hide (status "hidden"/"pending") or delete a review, removing it from the aggregate if it was public. */
export async function unpublishReview(id: string, to: "hidden" | "pending" | "delete"): Promise<boolean> {
  const ref = reviews().doc(id);
  return adminDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const d = snap.data() as ReviewDoc | undefined;
    if (!d) return false;
    if (d.status === "published") {
      tx.set(
        providers().doc(d.providerSlug),
        { count: FieldValue.increment(-1), sum: FieldValue.increment(-d.rating), dist: { [String(d.rating)]: FieldValue.increment(-1) } },
        { merge: true },
      );
    }
    if (to === "delete") tx.delete(ref);
    else tx.update(ref, { status: to });
    return true;
  });
}

/** Published reviews of one provider, newest first (capped). */
export async function listProviderReviews(slug: string, limit = 200): Promise<PublicReview[]> {
  const snap = await reviews().where("providerSlug", "==", slug).limit(1000).get();
  return snap.docs
    .filter((d) => d.get("status") === "published")
    .map(toPublicReview)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit);
}

export async function getProviderSummary(slug: string): Promise<ProviderSummary | null> {
  const snap = await providers().doc(slug).get();
  return snap.exists ? toProviderSummary(snap) : null;
}

/** Providers that have at least one published review, most reviewed first. */
export async function listProviders(limit = 300): Promise<ProviderSummary[]> {
  const snap = await providers().orderBy("count", "desc").limit(limit).get();
  return snap.docs.map(toProviderSummary).filter((p) => p.count > 0);
}

/** Recompute every provider aggregate from the reviews (admin "repair" tool). */
export async function rebuildProviderAggregates(): Promise<number> {
  const all = await reviews().where("status", "==", "published").get();
  const agg = new Map<string, { name: string; domain: string; count: number; sum: number; dist: Record<string, number>; last: number }>();
  for (const d of all.docs) {
    const r = d.data() as ReviewDoc;
    const a = agg.get(r.providerSlug) || { name: r.provider, domain: r.providerDomain || "", count: 0, sum: 0, dist: { ...EMPTY_DIST }, last: 0 };
    a.count++;
    a.sum += r.rating;
    a.dist[String(r.rating)] = (a.dist[String(r.rating)] || 0) + 1;
    a.last = Math.max(a.last, ms(r.publishedAt) || ms(r.createdAt));
    agg.set(r.providerSlug, a);
  }
  const existing = await providers().select().get();
  const writes: [FirebaseFirestore.DocumentReference, Record<string, unknown>, boolean][] = [];
  for (const d of existing.docs) if (!agg.has(d.id)) writes.push([d.ref, { count: 0, sum: 0, dist: { ...EMPTY_DIST } }, true]);
  for (const [slug, a] of agg) {
    writes.push([providers().doc(slug), { name: a.name, domain: a.domain, count: a.count, sum: a.sum, dist: a.dist, lastReviewAt: a.last ? new Date(a.last) : null }, false]);
  }
  // Firestore batches hold max 500 writes.
  for (let i = 0; i < writes.length; i += 400) {
    const batch = adminDb().batch();
    for (const [ref, data, merge] of writes.slice(i, i + 400)) batch.set(ref, data, { merge });
    await batch.commit();
  }
  return agg.size;
}

/** Basic content checks shared by the API (returns an error code or null). */
export function reviewProblem(r: { rating: unknown; comment: unknown; title?: unknown; name?: unknown }): string | null {
  const rating = Number(r.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return "rating";
  const comment = String(r.comment || "").trim();
  if (comment.length < 10) return "comment_short";
  if (comment.length > 2000) return "comment_long";
  if (String(r.title || "").length > 120) return "title_long";
  if (/(https?:\/\/|www\.)\S+/i.test(comment) && (comment.match(/https?:\/\//gi) || []).length > 1) return "links";
  return null;
}

/** Average measured speeds from reviews that came with a verified test. */
export function speedAverages(list: PublicReview[]): { download: number | null; upload: number | null; ping: number | null; samples: number } {
  const avg = (vals: (number | null)[]) => {
    const v = vals.filter((x): x is number => typeof x === "number" && Number.isFinite(x));
    return v.length ? Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10 : null;
  };
  const withSpeed = list.filter((r) => r.download != null || r.upload != null || r.ping != null);
  return { download: avg(withSpeed.map((r) => r.download)), upload: avg(withSpeed.map((r) => r.upload)), ping: avg(withSpeed.map((r) => r.ping)), samples: withSpeed.length };
}

export type ReviewSort = "newest" | "highest" | "lowest" | "helpful";

export function sortReviews(list: PublicReview[], sort: ReviewSort): PublicReview[] {
  const out = [...list];
  if (sort === "highest") out.sort((a, b) => b.rating - a.rating || b.createdAt - a.createdAt);
  else if (sort === "lowest") out.sort((a, b) => a.rating - b.rating || b.createdAt - a.createdAt);
  else if (sort === "helpful") out.sort((a, b) => b.helpful - a.helpful || b.createdAt - a.createdAt);
  else out.sort((a, b) => b.createdAt - a.createdAt);
  return out;
}
