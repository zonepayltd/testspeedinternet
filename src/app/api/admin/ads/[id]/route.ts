import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";
import { mapAd } from "@/lib/adsModel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clean(b: Record<string, unknown>) {
  const str = (v: unknown) => String(v ?? "").trim();
  return {
    name: str(b.name) || "Untitled ad",
    type: b.type === "custom" ? "custom" : "adsense",
    placement: str(b.placement) || "top",
    scope: str(b.scope) || "all",
    pathPrefix: str(b.pathPrefix),
    enabled: b.enabled !== false,
    adsenseSlot: str(b.adsenseSlot),
    customFormat: ["image", "text", "card"].includes(str(b.customFormat)) ? str(b.customFormat) : "card",
    image: str(b.image),
    title: str(b.title),
    description: str(b.description),
    link: str(b.link),
    order: Number.isFinite(Number(b.order)) ? Number(b.order) : 0,
  };
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false }, { status: 200 });
  const { id } = await ctx.params;
  const doc = await adminDb().collection("ads").doc(id).get();
  if (!doc.exists) return Response.json({ ok: false, error: "Not found" }, { status: 404 });
  return Response.json({ ok: true, ad: mapAd(doc.id, doc.data()!) });
}

export async function PUT(request: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false }, { status: 200 });
  const { id } = await ctx.params;

  let b: Record<string, unknown>;
  try {
    b = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  await adminDb()
    .collection("ads")
    .doc(id)
    .set({ ...clean(b), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  return Response.json({ ok: true });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false }, { status: 200 });
  const { id } = await ctx.params;
  await adminDb().collection("ads").doc(id).delete();
  return Response.json({ ok: true });
}
