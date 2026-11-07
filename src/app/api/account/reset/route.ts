import { FieldValue } from "firebase-admin/firestore";
import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { hashPassword } from "@/lib/adminAuth";
import { consumeToken, peekToken, setUserSession, userPasswordProblem } from "@/lib/userAuth";
import { body, err, ok, str } from "../_util";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET  /api/account/reset?token=… → { ok } if the link is still valid
// POST /api/account/reset { token, password } → sets the new password, signs in, logs out other devices
export async function GET(req: Request) {
  if (!adminConfigured) return err("notConfigured", 503);
  const token = new URL(req.url).searchParams.get("token") || "";
  return (await peekToken(token, "reset")) ? ok() : err("tokenInvalid");
}

export async function POST(req: Request) {
  if (!adminConfigured) return err("notConfigured", 503);
  const b = await body(req);
  const password = typeof b.password === "string" ? b.password : "";
  const pw = userPasswordProblem(password);
  if (pw) return err(pw);
  const t = await consumeToken(str(b.token, 100), "reset");
  if (!t?.uid) return err("tokenInvalid");
  const ref = adminDb().collection("users").doc(t.uid);
  const snap = await ref.get();
  if (!snap.exists || snap.get("status") === "disabled") return err("tokenInvalid");
  const sv = Number(snap.get("sv") || 1) + 1;
  const update: Record<string, unknown> = { passwordHash: hashPassword(password), sv, lastLoginAt: FieldValue.serverTimestamp() };
  // Clicking the emailed link also proves the address (if it's still the account's email).
  if (String(snap.get("email")) === t.email && !snap.get("emailVerified")) Object.assign(update, { emailVerified: true, verifiedAt: FieldValue.serverTimestamp() });
  await ref.update(update);
  await setUserSession(t.uid, sv);
  return ok();
}
