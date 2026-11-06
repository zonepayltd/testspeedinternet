// Admin credentials with Firebase as the backup / main store.
//
// Login succeeds if the username + password match EITHER:
//   1. ADMIN_USERNAME / ADMIN_PASSWORD environment variables (Vercel), or
//   2. the credentials saved in Firestore at admin/credentials
//      (password stored only as a salted scrypt hash — never in plain text).
// Changing the password in Admin → Settings → Security writes to Firestore, so it
// takes effect immediately, with no redeploy.
import "server-only";
import crypto from "node:crypto";
import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";

const DOC = () => adminDb().collection("admin").doc("credentials");

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

function checkHash(password: string, stored: string): boolean {
  const [alg, saltB64, hashB64] = stored.split("$");
  if (alg !== "scrypt" || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64");
  const actual = crypto.scryptSync(password, Buffer.from(saltB64, "base64"), expected.length, { N: 16384, r: 8, p: 1 });
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

type Stored = { username: string; passwordHash: string; updatedAt?: number };

export async function getStoredCredentials(): Promise<Stored | null> {
  if (!adminConfigured) return null;
  try {
    const snap = await DOC().get();
    const d = snap.data();
    return d?.username && d?.passwordHash ? { username: String(d.username), passwordHash: String(d.passwordHash), updatedAt: d.updatedAt?.toMillis?.() } : null;
  } catch {
    return null;
  }
}

/** Returns the username to put in the session, or null if the login is wrong. */
export async function checkAdminLogin(username: string, password: string): Promise<string | null> {
  const user = username.trim();
  if (!user || !password) return null;

  const envUser = process.env.ADMIN_USERNAME ?? "";
  const envPass = process.env.ADMIN_PASSWORD ?? "";
  const envOk = envUser !== "" && envPass !== "" && safeEqual(user, envUser) && safeEqual(password, envPass);

  const stored = await getStoredCredentials();
  const storedOk = !!stored && safeEqual(user.toLowerCase(), stored.username.toLowerCase()) && checkHash(password, stored.passwordHash);

  if (storedOk) return stored!.username;
  if (envOk) return envUser;
  return null;
}

/** Save new admin credentials to Firestore (used by Settings → Security and the setup script). */
export async function saveCredentials(username: string, password: string): Promise<void> {
  const { FieldValue } = await import("firebase-admin/firestore");
  await DOC().set({ username: username.trim(), passwordHash: hashPassword(password), updatedAt: FieldValue.serverTimestamp() });
}

/** Password rules shown in the UI. */
export function passwordProblem(pw: string): string | null {
  if (pw.length < 10) return "Use at least 10 characters.";
  if (!/[a-z]/i.test(pw) || !/\d/.test(pw)) return "Use letters and at least one number.";
  return null;
}

/* ---------------------- brute-force protection (per IP) ---------------------- */

const g = globalThis as unknown as { __tsiLoginFails?: Map<string, { n: number; until: number }> };
const fails = (g.__tsiLoginFails ??= new Map());
const WINDOW = 15 * 60_000;
const MAX = 8;

export function loginBlocked(ip: string): number {
  const f = fails.get(ip);
  if (!f) return 0;
  if (Date.now() > f.until) {
    fails.delete(ip);
    return 0;
  }
  return f.n >= MAX ? Math.ceil((f.until - Date.now()) / 60_000) : 0;
}
export function recordLoginFailure(ip: string) {
  const f = fails.get(ip);
  if (!f || Date.now() > f.until) fails.set(ip, { n: 1, until: Date.now() + WINDOW });
  else f.n++;
}
export function clearLoginFailures(ip: string) {
  fails.delete(ip);
}
