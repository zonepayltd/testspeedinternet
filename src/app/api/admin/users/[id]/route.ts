import { FieldValue } from "firebase-admin/firestore";
import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";
import { issueToken } from "@/lib/userAuth";
import { sendMail } from "@/lib/mailer";
import { siteLink, verifyEmailMail } from "@/lib/emails";
import { isLocale, type Locale } from "@/i18n/config";
import { fail, ms, ok, readJson } from "@/components/admin/analytics/server";
import { deleteUserCascade } from "@/components/admin/users/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET    /api/admin/users/:id → { user, tests, reviews }   (never the password hash)
// PATCH  /api/admin/users/:id  body { action: "verify" | "unverify" | "disable" | "enable" | "resend" | "logout" | "edit", name?, phone?, country?, countryCode? }
// DELETE /api/admin/users/:id  (cascade: tests unlinked, reviews deleted, profile removed)
type Ctx = { params: Promise<{ id: string }> };
const validId = (id: string) => !!id && !id.includes("/") && id.length < 200;

export async function GET(_req: Request, { params }: Ctx) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" });
  const { id } = await params;
  if (!validId(id)) return Response.json({ ok: false, error: "Bad id" }, { status: 400 });
  try {
    const db = adminDb();
    const [snap, testsSnap, reviewsSnap] = await Promise.all([
      db.collection("users").doc(id).get(),
      db.collection("tests").where("userId", "==", id).limit(500).get(),
      db.collection("reviews").where("userId", "==", id).limit(500).get(),
    ]);
    if (!snap.exists) return Response.json({ ok: false, error: "User not found" }, { status: 404 });
    const x = snap.data() || {};
    const user = {
      id,
      name: String(x.name || ""),
      email: String(x.email || ""),
      phone: String(x.phone || ""),
      country: String(x.country || ""),
      countryCode: String(x.countryCode || "").toUpperCase(),
      city: String(x.city || ""),
      locale: String(x.locale || "en"),
      emailVerified: !!x.emailVerified,
      status: x.status === "disabled" ? "disabled" : "active",
      marketing: !!x.marketing,
      createdAt: ms(x.createdAt),
      verifiedAt: ms(x.verifiedAt),
      lastLoginAt: ms(x.lastLoginAt),
      signupIp: String(x.signupIp || ""),
    };
    const tests = testsSnap.docs
      .map((d) => {
        const t = d.data();
        return {
          id: d.id, status: String(t.status || ""), mode: String(t.mode || "full"),
          download: t.download ?? null, upload: t.upload ?? null, ping: t.ping ?? null, jitter: t.jitter ?? null,
          ispBrand: String(t.ispBrand || t.isp || ""), server: String(t.server || ""), countryCode: String(t.countryCode || ""), city: String(t.city || ""),
          ts: ms(t.ts) || ms(t.startedAt),
        };
      })
      .sort((a, b) => b.ts - a.ts);
    const reviews = reviewsSnap.docs
      .map((d) => {
        const r = d.data();
        return {
          id: d.id, provider: String(r.provider || ""), providerDomain: String(r.providerDomain || ""), rating: Number(r.rating) || 0,
          title: String(r.title || ""), comment: String(r.comment || ""), status: String(r.status || "pending"), createdAt: ms(r.createdAt),
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);
    return ok({ user, tests, reviews });
  } catch (err) {
    return fail(err);
  }
}

export async function PATCH(request: Request, { params }: Ctx) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" });
  const { id } = await params;
  if (!validId(id)) return Response.json({ ok: false, error: "Bad id" }, { status: 400 });
  const b = await readJson<{ action?: string; name?: unknown; phone?: unknown; country?: unknown; countryCode?: unknown }>(request);
  const ref = adminDb().collection("users").doc(id);
  try {
    const snap = await ref.get();
    if (!snap.exists) return Response.json({ ok: false, error: "User not found" }, { status: 404 });
    switch (b.action) {
      case "verify":
        await ref.update({ emailVerified: true, verifiedAt: FieldValue.serverTimestamp() });
        return ok({ message: "Email marked as verified" });
      case "unverify":
        await ref.update({ emailVerified: false, verifiedAt: null });
        return ok({ message: "Email marked as not verified" });
      case "disable":
        // Bumping the session version logs the user out everywhere.
        await ref.update({ status: "disabled", sv: FieldValue.increment(1) });
        return ok({ message: "Account disabled and logged out" });
      case "enable":
        await ref.update({ status: "active" });
        return ok({ message: "Account enabled" });
      case "logout":
        await ref.update({ sv: FieldValue.increment(1) });
        return ok({ message: "Logged out on all devices" });
      case "resend": {
        const email = String(snap.get("email") || "");
        const name = String(snap.get("name") || "").split(" ")[0] || "there";
        const loc = String(snap.get("locale") || "en");
        const locale: Locale = isLocale(loc) ? loc : "en";
        const token = await issueToken({ type: "verify", email, uid: id, locale });
        const mail = verifyEmailMail(locale, name, siteLink(locale, `/account/verify?token=${encodeURIComponent(token)}`, request));
        const r = await sendMail({ to: email, ...mail });
        if (!r.ok) return Response.json({ ok: false, error: `Email not sent: ${r.error}` });
        return ok({ message: `Verification email sent to ${email}` });
      }
      case "edit": {
        const upd: Record<string, string> = {};
        if (typeof b.name === "string") upd.name = b.name.trim().slice(0, 80);
        if (typeof b.phone === "string") upd.phone = b.phone.trim().slice(0, 20);
        if (typeof b.country === "string") upd.country = b.country.trim().slice(0, 60);
        if (typeof b.countryCode === "string") upd.countryCode = b.countryCode.trim().toUpperCase().slice(0, 2);
        if (upd.name !== undefined && upd.name.length < 2) return Response.json({ ok: false, error: "Name is too short" }, { status: 400 });
        if (!Object.keys(upd).length) return Response.json({ ok: false, error: "Nothing to update" }, { status: 400 });
        await ref.update(upd);
        return ok({ message: "Profile updated" });
      }
      default:
        return Response.json({ ok: false, error: "Unknown action" }, { status: 400 });
    }
  } catch (err) {
    return fail(err);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" });
  const { id } = await params;
  if (!validId(id)) return Response.json({ ok: false, error: "Bad id" }, { status: 400 });
  try {
    const r = await deleteUserCascade(id);
    return ok({ deleted: { users: 1, testsUnlinked: r.tests, reviews: r.reviews } });
  } catch (err) {
    return fail(err);
  }
}
