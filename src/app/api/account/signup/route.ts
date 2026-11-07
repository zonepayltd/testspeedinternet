import { isValidPhoneNumber } from "libphonenumber-js/min";
import { REQUIRE_EMAIL_VERIFICATION } from "@/lib/features";
import { adminConfigured } from "@/lib/firebaseAdmin";
import { verifyPass } from "@/lib/captcha";
import { clientIp, geoForRequest } from "@/lib/geo";
import { EmailTakenError, createUser, isEmail, issueToken, normalizeEmail, rateLimit, setUserSession, userPasswordProblem } from "@/lib/userAuth";
import { sendMail } from "@/lib/mailer";
import { siteLink, verifyEmailMail } from "@/lib/emails";
import { body, claimGuestTest, err, localeOf, ok, str } from "../_util";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/account/signup
// { name, email, phone, country, countryCode, password, acceptTerms, marketing?, locale, captchaToken, claimTestId? }
export async function POST(req: Request) {
  if (!adminConfigured) return err("notConfigured", 503);
  const b = await body(req);
  const ip = clientIp(req) || "unknown";
  if (!rateLimit(`signup:${ip}`, 8, 60 * 60_000)) return err("tooMany", 429);

  const locale = localeOf(b.locale);
  const name = str(b.name, 80).replace(/\s+/g, " ");
  const email = normalizeEmail(str(b.email, 254));
  const phone = str(b.phone, 20);
  let countryCode = str(b.countryCode, 2).toUpperCase();
  let country = str(b.country, 60);
  const password = typeof b.password === "string" ? b.password : "";

  if (!verifyPass(str(b.captchaToken, 2000), "signup")) return err("captchaFailed");
  if (name.length < 2) return err("name");
  if (!isEmail(email)) return err("email");
  if (!phone || !/^\+\d{7,15}$/.test(phone) || !isValidPhoneNumber(phone)) return err("phone");
  const pw = userPasswordProblem(password);
  if (pw) return err(pw);
  if (b.acceptTerms !== true) return err("terms");

  if (!/^[A-Z]{2}$/.test(countryCode)) {
    const geo = await geoForRequest(req).catch(() => null);
    countryCode = (geo?.countryCode || "").toUpperCase();
    country = country || geo?.country || "";
  }
  if (!/^[A-Z]{2}$/.test(countryCode)) return err("country");
  if (!country) {
    try {
      country = new Intl.DisplayNames(["en"], { type: "region" }).of(countryCode) || countryCode;
    } catch {
      country = countryCode;
    }
  }

  let uid: string;
  try {
    const geo = await geoForRequest(req).catch(() => null);
    uid = await createUser({ email, name, phone, country, countryCode, city: geo?.countryCode === countryCode ? geo?.city : "", locale, password, marketing: b.marketing === true, ip });
  } catch (e) {
    if (e instanceof EmailTakenError) return err("emailTaken", 409);
    return err("generic", 500);
  }

  await setUserSession(uid, 1);

  // Attach the guest test they just ran (same browser, recent, not owned by anyone).
  await claimGuestTest(b.claimTestId, uid);

  let mailSent = false;
  try {
    if (REQUIRE_EMAIL_VERIFICATION) {
    const token = await issueToken({ type: "verify", email, uid, locale });
    const m = verifyEmailMail(locale, name.split(" ")[0], siteLink(locale, `/account/verify?token=${token}`, req));
    mailSent = (await sendMail({ to: email, ...m })).ok;
    }
  } catch {
    mailSent = false;
  }
  return ok({ mailSent, email });
}
