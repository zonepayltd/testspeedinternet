import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";
import { clearMailCache, getMailConfig, sendMail, verifyMailConfig } from "@/lib/mailer";
import { testMail } from "@/lib/emails";
import { fail, ok, readJson } from "@/components/admin/analytics/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET  /api/admin/mail            → status (never the password)
// GET  /api/admin/mail?verify=1   → status + live SMTP login check
// PUT  /api/admin/mail  body { host, port, user, pass?, fromName } → saves config/mail, then tests the login
// POST /api/admin/mail  body { to } → sends a test email
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function status() {
  const c = await getMailConfig(true);
  let saved: Record<string, unknown> = {};
  if (adminConfigured) {
    try {
      saved = (await adminDb().collection("config").doc("mail").get()).data() || {};
    } catch {
      /* ignore */
    }
  }
  return {
    source: c.source,
    host: c.host,
    port: c.port,
    user: c.user,
    fromName: c.fromName,
    hasPassword: !!c.pass,
    // What's stored in the admin settings (form values), even if env is active.
    saved: { host: String(saved.host || ""), port: Number(saved.port) || 0, user: String(saved.user || ""), fromName: String(saved.fromName || ""), hasPassword: !!saved.pass },
    envConfigured: !!(process.env.SMTP_USER && process.env.SMTP_PASS),
  };
}

export async function GET(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  try {
    const s = await status();
    if (new URL(request.url).searchParams.get("verify")) {
      const v = await verifyMailConfig();
      return ok({ ...s, verify: v });
    }
    return ok(s);
  } catch (err) {
    return fail(err);
  }
}

export async function PUT(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" });
  const b = await readJson<{ host?: unknown; port?: unknown; user?: unknown; pass?: unknown; fromName?: unknown }>(request);
  const host = String(b.host || "").trim() || "smtp0001.neo.space";
  const port = Number(b.port) || 465;
  const user = String(b.user || "").trim();
  const fromName = String(b.fromName || "").trim().slice(0, 80) || "TestSpeedInternet";
  if (!/^[a-z0-9.-]+$/i.test(host)) return Response.json({ ok: false, error: "Invalid SMTP host" }, { status: 400 });
  if (![25, 465, 587, 2525].includes(port)) return Response.json({ ok: false, error: "Port should be 465 (SSL) or 587 (STARTTLS)" }, { status: 400 });
  if (!emailRe.test(user)) return Response.json({ ok: false, error: "The username should be the full email address" }, { status: 400 });
  try {
    const ref = adminDb().collection("config").doc("mail");
    const data: Record<string, unknown> = { host, port, user, fromName, updatedAt: new Date() };
    const pass = typeof b.pass === "string" ? b.pass : "";
    if (pass) data.pass = pass;
    else if (!(await ref.get()).get("pass")) return Response.json({ ok: false, error: "Enter the mailbox password" }, { status: 400 });
    await ref.set(data, { merge: true });
    clearMailCache();
    const verify = await verifyMailConfig();
    return ok({ ...(await status()), verify });
  } catch (err) {
    return fail(err);
  }
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  const b = await readJson<{ to?: unknown }>(request);
  const to = String(b.to || "").trim();
  if (!emailRe.test(to)) return Response.json({ ok: false, error: "Enter a valid email address" }, { status: 400 });
  try {
    const r = await sendMail({ to, ...testMail() });
    if (!r.ok) return Response.json({ ok: false, error: r.error });
    return ok({ message: `Test email sent to ${to}` });
  } catch (err) {
    return fail(err);
  }
}
