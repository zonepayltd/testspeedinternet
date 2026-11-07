// Server-only helpers for the admin Users / Reviews APIs.
import "server-only";
import { adminDb } from "@/lib/firebaseAdmin";
import { deleteUserRecord } from "@/lib/userAuth";
import { unpublishReview } from "@/lib/reviews";
import { BATCH_MAX } from "@/components/admin/analytics/server";

/** Delete a visitor account: unlink their speed tests, delete their reviews, remove the profile. */
export async function deleteUserCascade(uid: string): Promise<{ tests: number; reviews: number }> {
  const db = adminDb();
  // 1) Tests stay (they're site analytics) but are no longer tied to the account.
  const tests = await db.collection("tests").where("userId", "==", uid).select().get();
  for (let i = 0; i < tests.docs.length; i += BATCH_MAX) {
    const b = db.batch();
    tests.docs.slice(i, i + BATCH_MAX).forEach((d) => b.update(d.ref, { userId: null }));
    await b.commit();
  }
  // 2) Reviews are removed (and taken out of the provider ratings if public).
  const reviews = await db.collection("reviews").where("userId", "==", uid).select().get();
  for (const d of reviews.docs) await unpublishReview(d.id, "delete");
  // 3) Profile + unique-email index.
  await deleteUserRecord(uid);
  return { tests: tests.size, reviews: reviews.size };
}
