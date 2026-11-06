import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { Timestamp, type DocumentReference } from "firebase-admin/firestore";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ONLINE_MS = 60_000; // online = heartbeat within the last 60 s
const STALE_MS = 2 * 60_000; // "Remove stale sessions" deletes docs older than 2 min
const ms = (t?: Timestamp) => (t && typeof t.toMillis === "function" ? t.toMillis() : 0);

/**
 * GET /api/admin/online → { ok, count, online: [...], unread, stale }
 *   online: presence docs with lastSeen within 60 s, newest first (max 500).
 *   unread: unread contact messages (for the sidebar badge, via a cheap count()).
 *   stale:  number of presence docs older than 2 min (candidates for cleanup).
 */
export async function GET() {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, count: 0, online: [], unread: 0, error: "Firebase not configured" });

  try {
    const db = adminDb();
    const now = Date.now();
    const [snap, unreadAgg, staleAgg] = await Promise.all([
      db.collection("presence").where("lastSeen", ">=", Timestamp.fromMillis(now - ONLINE_MS)).orderBy("lastSeen", "desc").limit(500).get(),
      db.collection("messages").where("read", "==", false).count().get().catch(() => null),
      db.collection("presence").where("lastSeen", "<", Timestamp.fromMillis(now - STALE_MS)).count().get().catch(() => null),
    ]);
    const online = snap.docs.map((d) => {
      const x = d.data();
      return {
        id: d.id,
        lastSeen: ms(x.lastSeen),
        path: String(x.path || "/"),
        locale: String(x.locale || ""),
        device: String(x.device || "desktop"),
        os: String(x.os || ""),
        browser: String(x.browser || ""),
        countryCode: String(x.countryCode || ""),
        city: String(x.city || ""),
      };
    });
    return Response.json({
      ok: true,
      now,
      count: online.length,
      online,
      unread: unreadAgg ? unreadAgg.data().count : 0,
      stale: staleAgg ? staleAgg.data().count : 0,
    });
  } catch (err) {
    return Response.json({ ok: false, count: 0, online: [], unread: 0, error: err instanceof Error ? err.message : "Failed to load presence" });
  }
}

/**
 * DELETE /api/admin/online?stale=1  → delete presence docs older than 2 min
 * DELETE /api/admin/online?id=<visitorId>[&id=…] → delete specific presence docs
 * DELETE /api/admin/online?all=1    → delete every presence doc
 * → { ok, deleted }
 */
export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" });

  const url = new URL(request.url);
  const db = adminDb();
  const col = db.collection("presence");
  try {
    let refs: DocumentReference[] = [];
    const ids = url.searchParams.getAll("id").filter((s) => s && s.length < 200 && !s.includes("/"));
    if (ids.length) refs = ids.map((id) => col.doc(id));
    else if (url.searchParams.get("stale")) {
      const snap = await col.where("lastSeen", "<", Timestamp.fromMillis(Date.now() - STALE_MS)).limit(5000).select().get();
      refs = snap.docs.map((d) => d.ref);
    } else if (url.searchParams.get("all")) {
      const snap = await col.limit(5000).select().get();
      refs = snap.docs.map((d) => d.ref);
    } else {
      return Response.json({ ok: false, error: "Pass ?stale=1, ?all=1 or ?id=…" }, { status: 400 });
    }
    for (let i = 0; i < refs.length; i += 450) {
      const batch = db.batch();
      refs.slice(i, i + 450).forEach((r) => batch.delete(r));
      await batch.commit();
    }
    return Response.json({ ok: true, deleted: refs.length });
  } catch (err) {
    return Response.json({ ok: false, error: err instanceof Error ? err.message : "Delete failed" });
  }
}
