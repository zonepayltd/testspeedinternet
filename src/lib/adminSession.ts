// Signed admin session token (HMAC-SHA256). Server-only.
import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "tsi_admin";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? "";
}

function sign(data: string): string {
  return crypto.createHmac("sha256", secret()).update(data).digest("base64url");
}

export function createToken(username: string): string {
  const exp = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = `${username}.${exp}`;
  const encoded = Buffer.from(payload).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifyToken(token: string | undefined): { username: string } | null {
  if (!token || !secret()) return null;
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return null;

  const expected = sign(encoded);
  // constant-time compare
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const [username, expStr] = Buffer.from(encoded, "base64url").toString().split(".");
    if (!username || !expStr) return null;
    if (Date.now() > Number(expStr)) return null;
    return { username };
  } catch {
    return null;
  }
}

export async function setSessionCookie(username: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, createToken(username), {
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
