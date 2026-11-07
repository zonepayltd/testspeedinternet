import { FieldValue } from "firebase-admin/firestore";
import { REQUIRE_EMAIL_VERIFICATION } from "@/lib/features";
import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { getSessionUserSnap, isEmail, issueToken, normalizeEmail, rateLimit } from "@/lib/userAuth";
import { verifyPass } from "@/lib/captcha";
import { sendMail } from "@/lib/mailer";
import { confirmReviewMail, siteLink } from "@/lib/emails";
import { clientIp, geoForRequest } from "@/lib/geo";
import { ispBrand } from "@/lib/isp";
import {
  getProviderSummary, listProviderReviews, providerSlug, publishReview, reviewProblem, sortReviews, speedAverages, unpublishReview,
  type ReviewDoc, type ReviewSort,
} from "@/lib/reviews";
import { isLocale, type Locale } from "@/i18n/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET  /api/reviews?provider=<slug>&sort=newest|highest|lowest|helpful&page=1
//      → { ok, summary, speeds, reviews, total, page, pages }
// POST /api/reviews  { provider, providerDomain?, rating, title?, comment, name, email?, testId?, locale,
//                      captchaToken? (guests), website (honeypot) }
//      → { ok, status: "published" | "pending", mailSent, providerSlug } | { ok:false, error: <code> }
const PAGE = 10;
const SORTS = new Set<ReviewSort>(["newest", "highest", "lowest", "helpful"]);

export async function GET(request: Request) {
  if (!adminConfigured) return Response.json({ ok: true, summary: null, reviews: [], total: 0, page: 1, pages: 1 });
  const sp = new URL(request.url).searchParams;
  const slug = providerSlug(sp.get("provider") || "");
  if (!slug) return Response.json({ ok: false, error: "provider" }, { status: 400 });
  const sort = (SORTS.has(sp.get("sort") as ReviewSort) ? sp.get("sort") : "newest") as ReviewSort;
  const page = Math.max(1, Math.min(200, Number(sp.get("page")) || 1));
  try {
    const [summary, all] = await Promise.all([getProviderSummary(slug), listProviderReviews(slug, 1000)]);
    const sorted = sortReviews(all, sort);
    return Response.json(
      {
        ok: true,
        summary,
        speeds: speedAverages(all),
        reviews: sorted.slice((page - 1) * PAGE, page * PAGE),
        total: sorted.length,
        page,
        pages: Math.max(1, Math.ceil(sorted.length / PAGE)),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json({ ok: false, error: "generic" }, { status: 500 });
  }
}

const err = (error: string, status = 400) => Response.json({ ok: false, error }, { status });
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.round(v * 100) / 100 : null);

export async function POST(request: Request) {
  if (!adminConfigured) return err("generic", 503);
  let b: Record<string, unknown>;
  try {
    b = await request.json();
  } catch {
    return err("generic");
  }
  // Honeypot: pretend it worked.
  if (String(b.website || "").trim()) return Response.json({ ok: true, status: "pending", mailSent: false });

  const ip = clientIp(request) || "unknown";
  if (!rateLimit(`review:${ip}`, 6, 30 * 60_000)) return err("rate_limited", 429);

  const problem = reviewProblem({ rating: b.rating, comment: b.comment, title: b.title });
  if (problem) return err(problem);

  const locale: Locale = isLocale(b.locale) ? b.locale : "en";
  const userSnap = await getSessionUserSnap().catch(() => null);
  const user = userSnap?.data();

  const email = user ? String(user.email || "") : normalizeEmail(String(b.email || ""));
  if (!isEmail(email)) return err("email");
  const name = String(b.name || user?.name || "").replace(/\s+/g, " ").trim();
  if (name.length < 2 || name.length > 60) return err("name");
  if (!user && !verifyPass(String(b.captchaToken || ""), "review")) return err("captcha");

  // ---- provider: trust only a verified test, an existing provider, or a known brand
  const providerIn = String(b.provider || "").replace(/\s+/g, " ").trim().slice(0, 80);
  const slug = providerSlug(providerIn);
  if (!slug || providerIn.length < 2 || /^unknown\b/i.test(providerIn)) return err("provider");
  const db = adminDb();

  let test: FirebaseFirestore.DocumentData | null = null;
  const testId = String(b.testId || "").replace(/[^a-zA-Z0-9-]/g, "").slice(0, 64);
  if (testId) {
    const t = await db.collection("tests").doc(testId).get();
    const d = t.data();
    if (d && d.status === "completed" && providerSlug(String(d.ispBrand || "")) === slug) test = d;
  }
  const existingProvider = await db.collection("providers").doc(slug).get();
  const known = ispBrand(providerIn);
  const knownBrand = !!known.domain && providerSlug(known.name) === slug;
  if (!test && !existingProvider.exists && !knownBrand) return err("provider");

  const providerName = existingProvider.exists ? String(existingProvider.get("name") || providerIn) : knownBrand ? known.name : providerIn;
  const providerDomain = existingProvider.exists && existingProvider.get("domain") ? String(existingProvider.get("domain")) : known.domain && knownBrand ? known.domain : "";

  const geo = test ? null : await geoForRequest(request).catch(() => null);
  // With email confirmation switched off (lib/features.ts), every review goes live right away.
  const instantPublish = !REQUIRE_EMAIL_VERIFICATION || (!!user && !!user.emailVerified);

  const fields: Partial<ReviewDoc> = {
    providerSlug: slug,
    provider: providerName,
    providerDomain,
    rating: Number(b.rating),
    title: String(b.title || "").replace(/\s+/g, " ").trim().slice(0, 120),
    comment: String(b.comment || "").trim().slice(0, 2000),
    name,
    email,
    userId: userSnap?.id || null,
    locale,
    ip,
  };
  if (test) {
    Object.assign(fields, {
      testId,
      download: num(test.download),
      upload: num(test.upload),
      ping: num(test.ping),
      countryCode: String(test.countryCode || "").toUpperCase().slice(0, 2),
      city: String(test.city || "").slice(0, 80),
    });
  }

  try {
    // One review per email per provider: update the existing one.
    const mine = await db.collection("reviews").where("email", "==", email).limit(100).get();
    const existing = mine.docs.find((d) => d.get("providerSlug") === slug);
    let id: string;
    if (existing) {
      id = existing.id;
      if (existing.get("status") === "published") await unpublishReview(id, "pending");
      await existing.ref.update({ ...fields, status: "pending", emailVerified: instantPublish || !!existing.get("emailVerified"), updatedAt: FieldValue.serverTimestamp() });
    } else {
      const ref = db.collection("reviews").doc();
      id = ref.id;
      const doc: ReviewDoc = {
        providerSlug: slug,
        provider: providerName,
        providerDomain,
        rating: Number(b.rating),
        title: fields.title || "",
        comment: fields.comment || "",
        name,
        email,
        userId: userSnap?.id || null,
        countryCode: fields.countryCode || (geo?.countryCode || "").toUpperCase(),
        city: fields.city || geo?.city || "",
        locale,
        testId: test ? testId : null,
        download: fields.download ?? null,
        upload: fields.upload ?? null,
        ping: fields.ping ?? null,
        status: "pending",
        emailVerified: instantPublish,
        helpful: 0,
        reports: 0,
        ip,
      };
      await ref.set({ ...doc, createdAt: FieldValue.serverTimestamp(), publishedAt: null });
    }

    if (instantPublish) {
      await publishReview(id);
      return Response.json({ ok: true, status: "published", mailSent: false, providerSlug: slug });
    }

    const token = await issueToken({ type: "review", email, reviewId: id, locale });
    const mail = confirmReviewMail(locale, name, providerName, siteLink(locale, `/reviews/confirm?token=${encodeURIComponent(token)}`, request));
    const sent = await sendMail({ to: email, ...mail });
    return Response.json({ ok: true, status: "pending", mailSent: sent.ok, providerSlug: slug });
  } catch (e) {
    console.error("[reviews] create failed", e);
    return err("generic", 500);
  }
}
