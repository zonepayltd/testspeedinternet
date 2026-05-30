import crypto from "crypto";
import { setSessionCookie } from "@/lib/adminSession";
import { verifyTurnstile } from "@/lib/turnstile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

export async function POST(request: Request) {
  let payload: { username?: string; password?: string; captchaToken?: string };
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const { username = "", password = "", captchaToken } = payload;

  // 1) Captcha (always checked when Turnstile is configured)
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const captchaOk = await verifyTurnstile(captchaToken, ip);
  if (!captchaOk) {
    return Response.json({ ok: false, error: "Captcha verification failed." }, { status: 400 });
  }

  // 2) Credentials
  const expectedUser = process.env.ADMIN_USERNAME ?? "";
  const expectedPass = process.env.ADMIN_PASSWORD ?? "";
  const ok =
    expectedUser !== "" &&
    expectedPass !== "" &&
    safeEqual(username.trim(), expectedUser) &&
    safeEqual(password, expectedPass);

  if (!ok) {
    return Response.json({ ok: false, error: "Invalid username or password." }, { status: 401 });
  }

  await setSessionCookie(expectedUser);
  return Response.json({ ok: true });
}
