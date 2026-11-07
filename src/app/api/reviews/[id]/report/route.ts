import { FieldValue } from "firebase-admin/firestore";
import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { rateLimit } from "@/lib/userAuth";
import { clientIp } from "@/lib/geo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/reviews/:id/report { reason? } → { ok }. Only flags the review for the admin; never auto-deletes.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!adminConfigured || !/^[A-Za-z0-9]{10,40}$/.test(id)) return Response.json({ ok: false }, { status: 400 });
  if (!rateLimit(`report:${clientIp(request) || "?"}`, 10, 60 * 60_000)) return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });
  let reason = "";
  try {
    reason = String(((await request.json()) as { reason?: unknown }).reason || "").slice(0, 300);
  } catch {
    /* no body */
  }
  const ref = adminDb().collection("reviews").doc(id);
  try {
    const snap = await ref.get();
    if (!snap.exists) return Response.json({ ok: false }, { status: 404 });
    await ref.update({ reports: FieldValue.increment(1), lastReportAt: FieldValue.serverTimestamp(), ...(reason ? { lastReportReason: reason } : {}) });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
