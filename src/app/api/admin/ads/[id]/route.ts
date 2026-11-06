import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";
import { mapAd } from "@/lib/adsModel";
import { cleanAd, deleteImagesIfUnused } from "@/lib/adsServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };
const notConfigured = () => Response.json({ ok: false, error: "Firebase not configured" }, { status: 200 });

// GET /api/admin/ads/:id → { ok, ad }
export async function GET(_req: Request, ctx: Ctx) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return notConfigured();
  const { id } = await ctx.params;
  try {
    const doc = await adminDb().collection("ads").doc(id).get();
    if (!doc.exists) return Response.json({ ok: false, error: "Ad not found" }, { status: 404 });
    return Response.json({ ok: true, ad: mapAd(doc.id, doc.data()!) });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

// PUT /api/admin/ads/:id  body: Ad fields → { ok }  (stats are kept)
export async function PUT(request: Request, ctx: Ctx) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return notConfigured();
  const { id } = await ctx.params;
  let b: Record<string, unknown>;
  try {
    b = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }
  const { data, error } = cleanAd(b);
  if (!data) return Response.json({ ok: false, error }, { status: 400 });
  try {
    const db = adminDb();
    const ref = db.collection("ads").doc(id);
    const prev = await ref.get();
    if (!prev.exists) return Response.json({ ok: false, error: "Ad not found" }, { status: 404 });
    await ref.set({ ...data, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

// PATCH /api/admin/ads/:id  body: { enabled?: boolean, order?: number, resetStats?: true } → { ok }
export async function PATCH(request: Request, ctx: Ctx) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return notConfigured();
  const { id } = await ctx.params;
  let b: { enabled?: unknown; order?: unknown; resetStats?: unknown };
  try {
    b = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }
  const update: Record<string, unknown> = {};
  if (typeof b.enabled === "boolean") update.enabled = b.enabled;
  if (typeof b.order === "number" && Number.isFinite(b.order)) update.order = Math.round(b.order);
  if (b.resetStats === true) {
    Object.assign(update, { impressions: 0, clicks: 0, impByCountry: {}, clickByCountry: {}, impByDay: {}, clickByDay: {}, statsResetAt: FieldValue.serverTimestamp() });
  }
  if (!Object.keys(update).length) return Response.json({ ok: false, error: "Nothing to update" }, { status: 400 });
  try {
    // update() (not set+merge) so the stat maps are replaced, not merged.
    await adminDb().collection("ads").doc(id).update({ ...update, updatedAt: FieldValue.serverTimestamp() });
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

// DELETE /api/admin/ads/:id?deleteImage=1 → { ok, imagesDeleted }
export async function DELETE(req: Request, ctx: Ctx) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return notConfigured();
  const { id } = await ctx.params;
  try {
    const db = adminDb();
    const ref = db.collection("ads").doc(id);
    const doc = await ref.get();
    const imageId = doc.exists ? String(doc.get("imageId") || "") : "";
    await ref.delete();
    const wantImage = new URL(req.url).searchParams.get("deleteImage") === "1";
    const imagesDeleted = wantImage && imageId ? await deleteImagesIfUnused(db, [imageId]) : 0;
    return Response.json({ ok: true, imagesDeleted });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
