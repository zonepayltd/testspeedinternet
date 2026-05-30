import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ms = (t?: Timestamp) => (t ? t.toMillis() : 0);

export async function GET() {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, messages: [] }, { status: 200 });

  try {
    const snap = await adminDb().collection("messages").orderBy("ts", "desc").limit(300).get();
    const messages = snap.docs.map((d) => {
      const x = d.data();
      return {
        id: d.id,
        name: x.name || "",
        email: x.email || "",
        phone: x.phone || "",
        subject: x.subject || "",
        message: x.message || "",
        read: x.read === true,
        handled: x.handled === true,
        ts: ms(x.ts),
      };
    });
    const unread = messages.filter((m) => !m.read).length;
    return Response.json({ ok: true, messages, unread });
  } catch (err) {
    return Response.json({ ok: false, messages: [], error: String(err) }, { status: 200 });
  }
}
