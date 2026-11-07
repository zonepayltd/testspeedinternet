import { isValidPhoneNumber } from "libphonenumber-js/min";
import { toPublicUser } from "@/lib/userAuth";
import { body, err, isResponse, localeOf, ok, requireUser, str } from "../_util";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PUT /api/account/profile { name?, phone?, country?, countryCode?, locale?, marketing? }
export async function PUT(req: Request) {
  const u = await requireUser();
  if (isResponse(u)) return u;
  const b = await body(req);
  const update: Record<string, unknown> = {};
  if (b.name !== undefined) {
    const name = str(b.name, 80).replace(/\s+/g, " ");
    if (name.length < 2) return err("name");
    update.name = name;
  }
  if (b.phone !== undefined) {
    const phone = str(b.phone, 20);
    if (phone && (!/^\+\d{7,15}$/.test(phone) || !isValidPhoneNumber(phone))) return err("phone");
    update.phone = phone;
  }
  if (b.countryCode !== undefined) {
    const cc = str(b.countryCode, 2).toUpperCase();
    if (!/^[A-Z]{2}$/.test(cc)) return err("country");
    update.countryCode = cc;
    let country = str(b.country, 60);
    if (!country) {
      try {
        country = new Intl.DisplayNames(["en"], { type: "region" }).of(cc) || cc;
      } catch {
        country = cc;
      }
    }
    update.country = country;
  }
  if (b.locale !== undefined) update.locale = localeOf(b.locale);
  if (b.marketing !== undefined) update.marketing = b.marketing === true;
  if (Object.keys(update).length) await u.ref.update(update);
  return ok({ user: toPublicUser(await u.ref.get()) });
}
