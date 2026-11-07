// Signed admin session token (HMAC-SHA256). Server-only.
// Signing key: ADMIN_SESSION_SECRET env var, or (backup) a random secret that is
// created once and kept in Firestore at admin/secrets.
import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";

export const SESSION_COOKIE = "tsi_admin";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

let cachedSecret: string | null = null;

/** Shared HMAC secret (also used, with a different prefix, for user sessions). */
export async function getSessionSecret(): Promise<string> {
  return secret();
}

async function secret(): Promise<string> {
  if (process.env.ADMIN_SESSION_SECRET) return process.env.ADMIN_SESSION_SECRET;
  if (cachedSecret) return cachedSecret;
  if (!adminConfigured) return "";
  try {
    const ref = adminDb().collection("admin").doc("secrets");
    cachedSecret = await adminDb().runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const existing = snap.get("sessionSecret");
      if (typeof existing === "string" && existing.length >= 32) return existing;
      const fresh = crypto.randomBytes(32).toString("hex");
      tx.set(ref, { sessionSecret: fresh }, { merge: true });
      return fresh;
    });
    return cachedSecret;
  } catch {
    return "";
  }
}

const sign = (key: string, data: string) => crypto.createHmac("sha256", key).update(data).digest("base64url");

export async function createToken(username: string): Promise<string> {
  const key = await secret();
  if (!key) throw new Error("No session secret available (set ADMIN_SESSION_SECRET or configure Firebase).");
  const exp = Date.now() + MAX_AGE_SECONDS * 1000;
  const encoded = Buffer.from(`${username}.${exp}`).toString("base64url");
  return `${encoded}.${sign(key, encoded)}`;
}

export async function verifyToken(token: string | undefined): Promise<{ username: string } | null> {
  if (!token) return null;
  const key = await secret();
  if (!key) return null;
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return null;

  const a = Buffer.from(sig);
  const b = Buffer.from(sign(key, encoded));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const decoded = Buffer.from(encoded, "base64url").toString();
    const dot = decoded.lastIndexOf(".");
    const username = decoded.slice(0, dot);
    const exp = Number(decoded.slice(dot + 1));
    if (!username || !exp || Date.now() > exp) return null;
    return { username };
  } catch {
    return null;
  }
}

export async function setSessionCookie(username: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, await createToken(username), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function getAdminSession(): Promise<{ username: string } | null> {
  const jar = await cookies();
  return verifyToken(jar.get(SESSION_COOKIE)?.value);
}
