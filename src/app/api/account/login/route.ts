import { FieldValue } from "firebase-admin/firestore";
import { adminConfigured } from "@/lib/firebaseAdmin";
import { clientIp } from "@/lib/geo";
import { checkPassword, findUserByEmail, isEmail, normalizeEmail, rateLimit, setUserSession, toPublicUser } from "@/lib/userAuth";
import { body, claimGuestTest, err, ok, str } from "../_util";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/account/login { email, password }
export async function POST(req: Request) {
  if (!adminConfigured) return err("notConfigured", 503);
  const b = await body(req);
  const email = normalizeEmail(str(b.email, 254));
  const password = typeof b.password === "string" ? b.password.slice(0, 200) : "";
  const ip = clientIp(req) || "unknown";
  if (!rateLimit(`login-ip:${ip}`, 30, 15 * 60_000) || !rateLimit(`login-email:${email}`, 10, 15 * 60_000)) return err("tooMany", 429);
  if (!isEmail(email) || !password) return err("badLogin", 401);

  const snap = await findUserByEmail(email).catch(() => null);
  // Always run a hash check so timing doesn't reveal whether the email exists.
  const okPw = checkPassword(password, snap ? String(snap.get("passwordHash") || "") : "scrypt$AAAAAAAAAAAAAAAAAAAAAA==$" + "A".repeat(86) + "==");
  if (!snap || !okPw) return err("badLogin", 401);
  if (snap.get("status") === "disabled") return err("disabled", 403);

  await snap.ref.update({ lastLoginAt: FieldValue.serverTimestamp(), lastLoginIp: ip.slice(0, 60) }).catch(() => {});
  await setUserSession(snap.id, Number(snap.get("sv") || 1));
  if (b.claimTestId) await claimGuestTest(b.claimTestId, snap.id);
  return ok({ user: toPublicUser(snap) });
}
