import { verifyTurnstile } from "@/lib/turnstile";
import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let b: Record<string, unknown>;
  try {
    b = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot — bots fill this; humans never see it.
  if (b.website) return Response.json({ ok: true });

  const name = String(b.name || "").trim();
  const email = String(b.email || "").trim();
  const phone = String(b.phone || "").trim();
  const subject = String(b.subject || "").trim();
  const message = String(b.message || "").trim();
  const captchaToken = b.captchaToken ? String(b.captchaToken) : undefined;

  if (name.length < 2 || !emailRe.test(email) || message.length < 10) {
    return Response.json({ ok: false, error: "Please fill in all required fields." }, { status: 400 });
  }

  // Captcha — if it fails, the message is NOT sent.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const captchaOk = await verifyTurnstile(captchaToken, ip);
  if (!captchaOk) {
    return Response.json(
      { ok: false, error: "Captcha verification failed. Please try again." },
      { status: 400 }
    );
  }

  // Store the message (admin can read it from Firestore).
  if (adminConfigured) {
    try {
      await adminDb().collection("messages").add({
        name,
        email,
        phone,
        subject,
        message,
        read: false,
        handled: false,
        ts: FieldValue.serverTimestamp(),
      });
    } catch {
      /* don't fail the user over storage */
    }
  }

  return Response.json({ ok: true });
}
