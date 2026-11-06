import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";
import { DAY, deleteQuery, deleteRefs, fail, ok, readJson } from "@/components/admin/analytics/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// DELETE /api/admin/visits — delete page views.
//   body { olderThanDays: number } | { all: true } | { ids: string[] }
export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" });

  const body = await readJson<{ ids?: unknown; all?: unknown; olderThanDays?: unknown }>(request);
  const db = adminDb();
  try {
    if (Array.isArray(body.ids)) {
      const ids = body.ids.filter((x): x is string => typeof x === "string" && !!x && !x.includes("/")).slice(0, 5000);
      return ok({ deleted: await deleteRefs(db, ids.map((id) => db.collection("visits").doc(id))) });
    }
    if (body.all === true) return ok({ deleted: await deleteQuery(db, db.collection("visits")) });
    const days = Number(body.olderThanDays);
    if (Number.isFinite(days) && days >= 1) {
      const cutoff = Timestamp.fromMillis(Date.now() - days * DAY);
      return ok({ deleted: await deleteQuery(db, db.collection("visits").where("ts", "<", cutoff)) });
    }
    return Response.json({ ok: false, error: "Provide olderThanDays, all:true or ids" }, { status: 400 });
  } catch (err) {
    return fail(err);
  }
}
