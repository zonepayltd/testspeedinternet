import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ms = (t?: Timestamp) => (t && typeof t.toMillis === "function" ? t.toMillis() : 0);
const CHUNK = 450;

const ids = (v: unknown): string[] =>
  Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === "string" && x.length > 0 && x.length < 200))] : [];

async function readBody(request: Request): Promise<Record<string, unknown>> {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/** GET /api/admin/messages → { ok, messages, unread, total, handled } (newest first, max 500). */
export async function GET() {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, messages: [], unread: 0, error: "Firebase not configured" }, { status: 200 });

  try {
    const snap = await adminDb().collection("messages").orderBy("ts", "desc").limit(500).get();
    const messages = snap.docs.map((d) => {
      const x = d.data();
      return {
        id: d.id,
        name: String(x.name || ""),
        email: String(x.email || ""),
        phone: String(x.phone || ""),
        subject: String(x.subject || ""),
        message: String(x.message || ""),
        read: x.read === true,
        handled: x.handled === true,
        ts: ms(x.ts),
      };
    });
    const unread = messages.filter((m) => !m.read).length;
    const handled = messages.filter((m) => m.handled).length;
    return Response.json({ ok: true, messages, unread, handled, total: messages.length });
  } catch (err) {
    return Response.json({ ok: false, messages: [], unread: 0, error: String(err) }, { status: 200 });
  }
}

/** PATCH /api/admin/messages  { ids: string[], read?: boolean, handled?: boolean } — bulk update. */
export async function PATCH(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" }, { status: 200 });

  const b = await readBody(request);
  const list = ids(b.ids);
  const update: Record<string, boolean> = {};
  if (typeof b.read === "boolean") update.read = b.read;
  if (typeof b.handled === "boolean") update.handled = b.handled;
  if (!list.length || !Object.keys(update).length) return Response.json({ ok: false, error: "Nothing to update" }, { status: 400 });

  try {
    const db = adminDb();
    for (let i = 0; i < list.length; i += CHUNK) {
      const batch = db.batch();
      for (const id of list.slice(i, i + CHUNK)) batch.set(db.collection("messages").doc(id), update, { merge: true });
      await batch.commit();
    }
    return Response.json({ ok: true, updated: list.length });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/messages
 *   { ids: string[] }   delete these messages
 *   { handled: true }   delete every handled message
 *   { all: true }       delete every message
 */
export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" }, { status: 200 });

  const b = await readBody(request);
  const db = adminDb();
  const col = db.collection("messages");

  try {
    let deleted = 0;
    if (b.all === true || b.handled === true) {
      // Page through the collection so huge inboxes don't load in one go.
      for (;;) {
        const q = b.all === true ? col.limit(CHUNK) : col.where("handled", "==", true).limit(CHUNK);
        const snap = await q.select().get();
        if (snap.empty) break;
        const batch = db.batch();
        snap.docs.forEach((d) => batch.delete(d.ref));
        await batch.commit();
        deleted += snap.size;
        if (snap.size < CHUNK) break;
      }
    } else {
      const list = ids(b.ids);
      if (!list.length) return Response.json({ ok: false, error: "No messages selected" }, { status: 400 });
      for (let i = 0; i < list.length; i += CHUNK) {
        const batch = db.batch();
        for (const id of list.slice(i, i + CHUNK)) batch.delete(col.doc(id));
        await batch.commit();
      }
      deleted = list.length;
    }
    return Response.json({ ok: true, deleted });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
