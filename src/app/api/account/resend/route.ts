import { issueToken, rateLimit } from "@/lib/userAuth";
import { sendMail } from "@/lib/mailer";
import { siteLink, verifyEmailMail } from "@/lib/emails";
import { body, err, isResponse, localeOf, ok, requireUser } from "../_util";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/account/resend — send the email confirmation link again.
export async function POST(req: Request) {
  const u = await requireUser();
  if (isResponse(u)) return u;
  if (u.get("emailVerified")) return ok({ alreadyVerified: true });
  if (!rateLimit(`resend:${u.id}`, 3, 30 * 60_000)) return err("tooMany", 429);
  const b = await body(req);
  const locale = localeOf(b.locale || u.get("locale"));
  const email = String(u.get("email"));
  const token = await issueToken({ type: "verify", email, uid: u.id, locale });
  const m = verifyEmailMail(locale, String(u.get("name") || "").split(" ")[0], siteLink(locale, `/account/verify?token=${token}`, req));
  const r = await sendMail({ to: email, ...m });
  return r.ok ? ok({ sent: true }) : err("mailFailed", 502, { mailError: true });
}
