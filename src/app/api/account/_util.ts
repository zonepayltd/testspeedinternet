// Shared helpers for /api/account/* routes (not a route itself).
import "server-only";
import type { DocumentSnapshot } from "firebase-admin/firestore";
import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { getSessionUserSnap } from "@/lib/userAuth";
import { isLocale, type Locale } from "@/i18n/config";

/** Error codes match accountMessages.errors keys so the UI can translate them. */
export type ErrCode =
  | "generic" | "network" | "name" | "email" | "phone" | "country" | "short" | "weak" | "terms" | "captcha" | "captchaFailed"
  | "emailTaken" | "badLogin" | "tooMany" | "disabled" | "wrongPassword" | "tokenInvalid" | "notConfigured" | "unauthorized";

export const ok = (data: Record<string, unknown> = {}) => Response.json({ ok: true, ...data }, { headers: { "Cache-Control": "no-store" } });
export const err = (error: ErrCode, status = 400, extra: Record<string, unknown> = {}) =>
  Response.json({ ok: false, error, ...extra }, { status, headers: { "Cache-Control": "no-store" } });

export async function body<T = Record<string, unknown>>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    return {} as T;
  }
}

export const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");
export const localeOf = (v: unknown): Locale => (isLocale(v) ? v : "en");

/** Returns the session user's snapshot, or a 401 Response. */
export async function requireUser(): Promise<DocumentSnapshot | Response> {
  if (!adminConfigured) return err("notConfigured", 503);
  const snap = await getSessionUserSnap();
  return snap || err("unauthorized", 401);
}

export const isResponse = (x: unknown): x is Response => x instanceof Response;

export const tsMs = (t: unknown) => (t && typeof (t as { toMillis?: () => number }).toMillis === "function" ? (t as { toMillis: () => number }).toMillis() : 0);

/** E.164 phone: + and 7–15 digits. Empty is allowed. */
export const validPhone = (p: string) => !p || /^\+[1-9]\d{6,14}$/.test(p);

/** Attach a guest test (run in this browser just before signing up / in) to the user. */
export async function claimGuestTest(rawId: unknown, uid: string): Promise<boolean> {
  const id = str(rawId, 64).replace(/[^a-zA-Z0-9-]/g, "");
  if (!id) return false;
  try {
    const ref = adminDb().collection("tests").doc(id);
    return await adminDb().runTransaction(async (tx) => {
      const t = await tx.get(ref);
      const started = tsMs(t.get("startedAt"));
      if (!t.exists || t.get("userId") || Date.now() - started > 3 * 3600_000) return false;
      tx.update(ref, { userId: uid });
      return true;
    });
  } catch {
    return false;
  }
}
