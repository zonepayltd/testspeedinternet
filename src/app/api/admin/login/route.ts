import { setSessionCookie } from "@/lib/adminSession";
import { verifyPass } from "@/lib/captcha";
import { checkAdminLogin, clearLoginFailures, loginBlocked, recordLoginFailure } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let payload: { username?: string; password?: string; captchaToken?: string };
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const { username = "", password = "", captchaToken } = payload;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";

  // 0) Too many wrong attempts from this address?
  const wait = loginBlocked(ip);
  if (wait) {
    return Response.json({ ok: false, error: `Too many attempts. Try again in ${wait} min.` }, { status: 429 });
  }

  // 1) Captcha (always required) — built-in slider captcha, single-use pass token.
  if (!verifyPass(captchaToken, "login")) {
    return Response.json({ ok: false, error: "Captcha verification failed." }, { status: 400 });
  }

  // 2) Credentials: Vercel env vars OR the credentials saved in Firebase.
  const user = await checkAdminLogin(username, password);
  if (!user) {
    recordLoginFailure(ip);
    return Response.json({ ok: false, error: "Invalid username or password." }, { status: 401 });
  }

  clearLoginFailures(ip);
  try {
    await setSessionCookie(user);
  } catch {
    return Response.json({ ok: false, error: "Login is not configured on the server (Firebase or ADMIN_SESSION_SECRET missing)." }, { status: 500 });
  }
  return Response.json({ ok: true });
}
