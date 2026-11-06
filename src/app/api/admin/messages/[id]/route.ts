import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" }, { status: 200 });
  const { id } = await ctx.params;

  let b: { read?: boolean; handled?: boolean };
  try {
    b = await request.json();
  } catch {
    b = {};
  }

  const update: Record<string, boolean> = {};
  if (typeof b.read === "boolean") update.read = b.read;
  if (typeof b.handled === "boolean") update.handled = b.handled;
  if (Object.keys(update).length === 0) return Response.json({ ok: true });

  try {
    await adminDb().collection("messages").doc(id).update(update);
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" }, { status: 200 });
  const { id } = await ctx.params;
  try {
    await adminDb().collection("messages").doc(id).delete();
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
