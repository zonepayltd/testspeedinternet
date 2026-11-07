import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { consumeToken, normalizeEmail } from "@/lib/userAuth";

/** Consumes a "verify" token and marks the user's email confirmed. Used by the API and the /account/verify page. */
export async function verifyEmailToken(token: string): Promise<boolean> {
  if (!adminConfigured || !token) return false;
  const t = await consumeToken(token, "verify");
  if (!t?.uid) return false;
  const ref = adminDb().collection("users").doc(t.uid);
  const snap = await ref.get();
  // The link only counts for the email it was sent to (user may have changed it since).
  if (!snap.exists || normalizeEmail(String(snap.get("email"))) !== normalizeEmail(t.email)) return false;
  await ref.update({ emailVerified: true, verifiedAt: FieldValue.serverTimestamp() });
  return true;
}
