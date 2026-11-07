// Visitor accounts (not the admin). Server-only.
//
// Firestore:
//   users/{uid}            profile + scrypt password hash (see UserDoc)
//   userEmails/{sha256}    { uid }  — unique-email index (created in the same transaction)
//   emailTokens/{sha256}   one-time links: verify email, reset password, confirm review
//
// Session: signed cookie "tsi_user" = base64url(uid.exp.sv) + HMAC. `sv` (session
// version) is bumped on password change / "log out everywhere" to kill old cookies.
//
// Queries only use single-field filters (no composite indexes needed).
import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { FieldValue, type DocumentSnapshot } from "firebase-admin/firestore";
import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { getSessionSecret } from "@/lib/adminSession";
import { hashPassword } from "@/lib/adminAuth";
import type { Locale } from "@/i18n/config";

export const USER_COOKIE = "tsi_user";
const SESSION_DAYS = 30;

export type UserDoc = {
  email: string; // lower-case
  name: string;
  phone: string; // E.164, e.g. +212612345678 ("" if not given)
  country: string; // English country name
  countryCode: string; // ISO-2, upper-case
  city?: string;
  locale: Locale;
  passwordHash: string;
  emailVerified: boolean;
  status: "active" | "disabled";
  sv: number; // session version
  marketing?: boolean; // agreed to product news
  createdAt?: FirebaseFirestore.Timestamp;
  verifiedAt?: FirebaseFirestore.Timestamp | null;
  lastLoginAt?: FirebaseFirestore.Timestamp | null;
  signupIp?: string;
};

/** What the browser may see about the logged-in user. */
export type PublicUser = {
  id: string;
  email: string;
  name: string;
  phone: string;
  country: string;
  countryCode: string;
  locale: Locale;
  emailVerified: boolean;
  createdAt: number;
};

const users = () => adminDb().collection("users");
const emailIndex = () => adminDb().collection("userEmails");
const tokens = () => adminDb().collection("emailTokens");
const sha = (s: string) => crypto.createHash("sha256").update(s).digest("hex");
const ms = (t: unknown) => (t && typeof (t as { toMillis?: () => number }).toMillis === "function" ? (t as { toMillis: () => number }).toMillis() : 0);

export const normalizeEmail = (e: string) => String(e || "").trim().toLowerCase();
export const isEmail = (e: string) => /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,24}$/i.test(e) && e.length <= 254;

/** Password rules for visitor accounts. Returns an error code or null. */
export function userPasswordProblem(pw: string): "short" | "weak" | null {
  if (typeof pw !== "string" || pw.length < 8) return "short";
  if (pw.length > 200) return "weak";
  if (!/[a-z]/i.test(pw) || !/\d/.test(pw)) return "weak";
  return null;
}

export function checkPassword(password: string, stored: string): boolean {
  const [alg, saltB64, hashB64] = String(stored || "").split("$");
  if (alg !== "scrypt" || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64");
  const actual = crypto.scryptSync(password, Buffer.from(saltB64, "base64"), expected.length, { N: 16384, r: 8, p: 1 });
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

export function toPublicUser(snap: DocumentSnapshot): PublicUser {
  const d = (snap.data() || {}) as Partial<UserDoc>;
  return {
    id: snap.id,
    email: d.email || "",
    name: d.name || "",
    phone: d.phone || "",
    country: d.country || "",
    countryCode: (d.countryCode || "").toUpperCase(),
    locale: (d.locale || "en") as Locale,
    emailVerified: !!d.emailVerified,
    createdAt: ms(d.createdAt),
  };
}

export async function findUserByEmail(email: string): Promise<DocumentSnapshot | null> {
  const e = normalizeEmail(email);
  if (!e) return null;
  const idx = await emailIndex().doc(sha(e)).get();
  if (idx.exists) {
    const snap = await users().doc(String(idx.get("uid"))).get();
    if (snap.exists) return snap;
  }
  return null;
}

export class EmailTakenError extends Error {
  constructor() {
    super("email_taken");
  }
}

/** Creates the user (throws EmailTakenError if the email is used). Returns the new uid. */
export async function createUser(input: {
  email: string; name: string; phone: string; country: string; countryCode: string; city?: string; locale: Locale; password: string; marketing?: boolean; ip?: string;
}): Promise<string> {
  const email = normalizeEmail(input.email);
  const ref = users().doc();
  const idxRef = emailIndex().doc(sha(email));
  await adminDb().runTransaction(async (tx) => {
    const idx = await tx.get(idxRef);
    if (idx.exists) throw new EmailTakenError();
    const doc: UserDoc = {
      email,
      name: input.name.trim().slice(0, 80),
      phone: input.phone.trim().slice(0, 20),
      country: input.country.trim().slice(0, 60),
      countryCode: input.countryCode.trim().toUpperCase().slice(0, 2),
      city: (input.city || "").slice(0, 80),
      locale: input.locale,
      passwordHash: hashPassword(input.password),
      emailVerified: false,
      status: "active",
      sv: 1,
      marketing: !!input.marketing,
      signupIp: (input.ip || "").slice(0, 60),
    };
    tx.set(ref, { ...doc, createdAt: FieldValue.serverTimestamp(), verifiedAt: null, lastLoginAt: FieldValue.serverTimestamp() });
    tx.set(idxRef, { uid: ref.id, email });
  });
  return ref.id;
}

/** Changes a user's email (keeps the unique index in sync). Marks it unverified. */
export async function changeUserEmail(uid: string, newEmail: string): Promise<void> {
  const email = normalizeEmail(newEmail);
  const ref = users().doc(uid);
  await adminDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new Error("not_found");
    const old = String(snap.get("email") || "");
    if (old === email) return;
    const newIdx = emailIndex().doc(sha(email));
    if ((await tx.get(newIdx)).exists) throw new EmailTakenError();
    tx.set(newIdx, { uid, email });
    if (old) tx.delete(emailIndex().doc(sha(old)));
    tx.update(ref, { email, emailVerified: false, verifiedAt: null });
  });
}

/** Deletes the user profile + email index. (Callers decide what to do with their tests/reviews.) */
export async function deleteUserRecord(uid: string): Promise<void> {
  const ref = users().doc(uid);
  const snap = await ref.get();
  if (!snap.exists) return;
  const email = String(snap.get("email") || "");
  const batch = adminDb().batch();
  batch.delete(ref);
  if (email) batch.delete(emailIndex().doc(sha(email)));
  await batch.commit();
}

/* --------------------------------- sessions -------------------------------- */

async function key(): Promise<string> {
  const s = await getSessionSecret();
  return s ? `user:${s}` : "";
}
const sign = (k: string, data: string) => crypto.createHmac("sha256", k).update(data).digest("base64url");

export async function setUserSession(uid: string, sv: number) {
  const k = await key();
  if (!k) throw new Error("No session secret");
  const exp = Date.now() + SESSION_DAYS * 86_400_000;
  const enc = Buffer.from(`${uid}.${exp}.${sv}`).toString("base64url");
  (await cookies()).set(USER_COOKIE, `${enc}.${sign(k, enc)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86_400,
  });
}

export async function clearUserSession() {
  (await cookies()).set(USER_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

/** Reads + checks the session cookie. Returns the user's doc snapshot or null. */
export async function getSessionUserSnap(): Promise<DocumentSnapshot | null> {
  if (!adminConfigured) return null;
  const raw = (await cookies()).get(USER_COOKIE)?.value;
  if (!raw) return null;
  const [enc, sig] = raw.split(".");
  const k = await key();
  if (!enc || !sig || !k) return null;
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(k, enc));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  const [uid, expS, svS] = Buffer.from(enc, "base64url").toString().split(".");
  if (!uid || !(Number(expS) > Date.now())) return null;
  try {
    const snap = await users().doc(uid).get();
    if (!snap.exists || snap.get("status") === "disabled") return null;
    if (Number(snap.get("sv") || 1) !== Number(svS)) return null;
    return snap;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<PublicUser | null> {
  const snap = await getSessionUserSnap();
  return snap ? toPublicUser(snap) : null;
}

/* ------------------------------ one-time tokens ----------------------------- */

export type TokenType = "verify" | "reset" | "review";
export type TokenData = { type: TokenType; email: string; uid?: string; reviewId?: string; locale?: Locale; exp: number; used: boolean };

const TTL: Record<TokenType, number> = { verify: 48 * 3600_000, reset: 3600_000, review: 7 * 86_400_000 };

/** Creates a one-time token and returns the raw value to put in a link (only its hash is stored). */
export async function issueToken(data: Omit<TokenData, "exp" | "used">): Promise<string> {
  const raw = crypto.randomBytes(32).toString("base64url");
  await tokens().doc(sha(raw)).set({ ...data, exp: Date.now() + TTL[data.type], used: false, createdAt: FieldValue.serverTimestamp() });
  return raw;
}

/** Marks a token used and returns its data, or null if missing / expired / used / wrong type. */
export async function consumeToken(raw: string, type: TokenType): Promise<TokenData | null> {
  if (!raw || raw.length > 100) return null;
  const ref = tokens().doc(sha(raw));
  try {
    return await adminDb().runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const d = snap.data() as TokenData | undefined;
      if (!d || d.type !== type || d.used || Date.now() > d.exp) return null;
      tx.update(ref, { used: true, usedAt: FieldValue.serverTimestamp() });
      return d;
    });
  } catch {
    return null;
  }
}

/** Looks at a token without using it (e.g. to show the reset form). */
export async function peekToken(raw: string, type: TokenType): Promise<TokenData | null> {
  if (!raw || raw.length > 100) return null;
  const d = (await tokens().doc(sha(raw)).get()).data() as TokenData | undefined;
  return d && d.type === type && !d.used && Date.now() <= d.exp ? d : null;
}

/* ------------------------------ rate limiting ------------------------------- */

const g = globalThis as unknown as { __tsiUserRL?: Map<string, number[]> };
const hits: Map<string, number[]> = (g.__tsiUserRL ??= new Map());

/** Simple sliding-window limiter (per server instance). Returns true if allowed. */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (arr.length >= max) {
    hits.set(key, arr);
    return false;
  }
  arr.push(now);
  hits.set(key, arr);
  return true;
}
