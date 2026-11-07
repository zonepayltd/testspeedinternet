import { adminDb } from "@/lib/firebaseAdmin";
import { unpublishReview } from "@/lib/reviews";
import { body, err, isResponse, ok, requireVerifiedUser, str, tsMs } from "../_util";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export type MyReview = { id: string; provider: string; providerSlug: string; providerDomain: string; rating: number; title: string; comment: string; status: string; createdAt: number };

// GET    /api/account/reviews → the user's reviews (any status), newest first
// DELETE /api/account/reviews { id }
export async function GET() {
  const u = await requireVerifiedUser();
  if (isResponse(u)) return u;
  const snap = await adminDb().collection("reviews").where("userId", "==", u.id).limit(500).get();
  const reviews: MyReview[] = snap.docs
    .map((d) => {
      const x = d.data();
      return { id: d.id, provider: x.provider || "", providerSlug: x.providerSlug || "", providerDomain: x.providerDomain || "", rating: Number(x.rating) || 0, title: x.title || "", comment: x.comment || "", status: x.status || "pending", createdAt: tsMs(x.createdAt) };
    })
    .sort((a, b) => b.createdAt - a.createdAt);
  return ok({ reviews });
}

export async function DELETE(req: Request) {
  const u = await requireVerifiedUser();
  if (isResponse(u)) return u;
  const id = str((await body(req)).id, 64);
  if (!id) return err("generic");
  const ref = adminDb().collection("reviews").doc(id);
  const snap = await ref.get();
  if (!snap.exists || snap.get("userId") !== u.id) return err("generic", 404);
  await unpublishReview(id, "delete");
  return ok();
}
