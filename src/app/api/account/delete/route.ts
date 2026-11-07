import { adminDb } from "@/lib/firebaseAdmin";
import { checkPassword, clearUserSession, deleteUserRecord, rateLimit } from "@/lib/userAuth";
import { unpublishReview } from "@/lib/reviews";
import { body, err, isResponse, ok, requireUser } from "../_util";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/account/delete { password } — deletes the account + reviews, anonymises tests.
export async function POST(req: Request) {
  const u = await requireUser();
  if (isResponse(u)) return u;
  if (!rateLimit(`del:${u.id}`, 5, 15 * 60_000)) return err("tooMany", 429);
  const b = await body(req);
  if (!checkPassword(typeof b.password === "string" ? b.password : "", String(u.get("passwordHash") || ""))) return err("wrongPassword", 403);

  const db = adminDb();
  const tests = await db.collection("tests").where("userId", "==", u.id).select().get();
  for (let i = 0; i < tests.docs.length; i += 450) {
    const batch = db.batch();
    tests.docs.slice(i, i + 450).forEach((d) => batch.update(d.ref, { userId: null }));
    await batch.commit();
  }
  const reviews = await db.collection("reviews").where("userId", "==", u.id).select().get();
  for (const r of reviews.docs) await unpublishReview(r.id, "delete").catch(() => false);
  await deleteUserRecord(u.id);
  await clearUserSession();
  return ok({ tests: tests.size, reviews: reviews.size });
}
