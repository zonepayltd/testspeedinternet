import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false }, { status: 200 });
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

  await adminDb().collection("messages").doc(id).set(update, { merge: true });
  return Response.json({ ok: true });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false }, { status: 200 });
  const { id } = await ctx.params;
  await adminDb().collection("messages").doc(id).delete();
  return Response.json({ ok: true });
}
