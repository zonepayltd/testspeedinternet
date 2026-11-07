import { adminConfigured } from "@/lib/firebaseAdmin";
import { verifyPass } from "@/lib/captcha";
import { clientIp } from "@/lib/geo";
import { findUserByEmail, isEmail, issueToken, normalizeEmail, rateLimit } from "@/lib/userAuth";
import { sendMail } from "@/lib/mailer";
import { resetPasswordMail, siteLink } from "@/lib/emails";
import { body, err, localeOf, ok, str } from "../_util";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/account/forgot { email, captchaToken, locale }
// Always answers ok (never reveals whether an account exists).
export async function POST(req: Request) {
  if (!adminConfigured) return err("notConfigured", 503);
  const b = await body(req);
  if (!verifyPass(str(b.captchaToken, 2000), "account")) return err("captchaFailed");
  const email = normalizeEmail(str(b.email, 254));
  if (!isEmail(email)) return err("email");
  const ip = clientIp(req) || "unknown";
  if (!rateLimit(`forgot-ip:${ip}`, 10, 60 * 60_000) || !rateLimit(`forgot:${email}`, 3, 60 * 60_000)) return ok();

  const snap = await findUserByEmail(email).catch(() => null);
  if (snap && snap.get("status") !== "disabled") {
    const locale = localeOf(b.locale || snap.get("locale"));
    const token = await issueToken({ type: "reset", email, uid: snap.id, locale });
    const m = resetPasswordMail(locale, String(snap.get("name") || "").split(" ")[0], siteLink(locale, `/account/reset?token=${token}`, req));
    await sendMail({ to: email, ...m }).catch(() => null);
  }
  return ok();
}
