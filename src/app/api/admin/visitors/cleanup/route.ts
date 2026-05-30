import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function deleteOld(collection: string, field: string, cutoff: Timestamp | null): Promise<number> {
  const db = adminDb();
  let total = 0;
  // Cap iterations so a huge collection can't run forever in one request.
  for (let i = 0; i < 50; i++) {
    let q = db.collection(collection).limit(400) as FirebaseFirestore.Query;
    if (cutoff) q = db.collection(collection).where(field, "<", cutoff).limit(400);
    const snap = await q.get();
    if (snap.empty) break;
    const batch = db.batch();
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
    total += snap.size;
    if (snap.size < 400) break;
  }
  return total;
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" }, { status: 200 });

  let body: { days?: number };
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const days = Number(body.days);
  // days <= 0 (or NaN treated as "all") → wipe everything; otherwise older than N days.
  const cutoff =
    Number.isFinite(days) && days > 0
      ? Timestamp.fromMillis(Date.now() - days * 86_400_000)
      : null;

  try {
    const visits = await deleteOld("visits", "ts", cutoff);
    const visitors = await deleteOld("visitors", "lastSeen", cutoff);
    return Response.json({ ok: true, deleted: { visits, visitors } });
  } catch (err) {
    return Response.json({ ok: false, error: err instanceof Error ? err.message : "Failed" }, { status: 200 });
  }
}
