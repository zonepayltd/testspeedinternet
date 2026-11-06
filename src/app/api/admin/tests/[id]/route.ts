import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";
import { fail, ok } from "@/components/admin/analytics/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// DELETE /api/admin/tests/[id] — delete one speed test.
export async function DELETE(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" });
  const { id } = await ctx.params;
  try {
    await adminDb().collection("tests").doc(id).delete();
    return ok({ deleted: 1 });
  } catch (err) {
    return fail(err);
  }
}
