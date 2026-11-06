import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";
import { mapAd } from "@/lib/adsModel";
import { cleanAd, deleteImagesIfUnused } from "@/lib/adsServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const notConfigured = () => Response.json({ ok: false, error: "Firebase not configured" }, { status: 200 });

// GET /api/admin/ads → { ok, ads: Ad[] } (sorted by priority, then most recently updated)
export async function GET() {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, ads: [], error: "Firebase not configured" });
  try {
    const snap = await adminDb().collection("ads").get();
    const ads = snap.docs.map((d) => mapAd(d.id, d.data())).sort((a, b) => a.order - b.order || b.updatedAt - a.updatedAt);
    return Response.json({ ok: true, ads });
  } catch (err) {
    return Response.json({ ok: false, ads: [], error: String(err) });
  }
}

// POST /api/admin/ads  body: Ad fields → { ok, id }
//                      body: { duplicateOf: id } → copies an ad (disabled, stats reset) → { ok, id }
export async function POST(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return notConfigured();

  let b: Record<string, unknown>;
  try {
    b = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }
  const db = adminDb();
  const stamps = { createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() };
  const zero = { impressions: 0, clicks: 0, impByCountry: {}, clickByCountry: {}, impByDay: {}, clickByDay: {} };

  try {
    if (typeof b.duplicateOf === "string") {
      const src = await db.collection("ads").doc(b.duplicateOf).get();
      if (!src.exists) return Response.json({ ok: false, error: "Ad not found" }, { status: 404 });
      const a = mapAd(src.id, src.data()!);
      const { data } = cleanAd({ ...a, name: `${a.name} (copy)`.slice(0, 120), enabled: false } as unknown as Record<string, unknown>);
      if (!data) return Response.json({ ok: false, error: "Could not copy this ad" });
      const ref = await db.collection("ads").add({ ...data, ...zero, ...stamps });
      return Response.json({ ok: true, id: ref.id });
    }

    const { data, error } = cleanAd(b);
    if (!data) return Response.json({ ok: false, error }, { status: 400 });
    const ref = await db.collection("ads").add({ ...data, ...zero, ...stamps });
    return Response.json({ ok: true, id: ref.id });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

// DELETE /api/admin/ads  body: { ids: string[], deleteImages?: boolean } | { all: true, deleteImages?: boolean }
//   → { ok, deleted, imagesDeleted }. Uploaded images are only removed when no other ad uses them.
export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return notConfigured();

  let b: { ids?: unknown; all?: unknown; deleteImages?: unknown } = {};
  try {
    b = await request.json();
  } catch {
    /* empty body */
  }
  const db = adminDb();
  try {
    let docs: FirebaseFirestore.DocumentSnapshot[];
    if (b.all === true) {
      docs = (await db.collection("ads").get()).docs;
    } else {
      const ids = Array.isArray(b.ids) ? b.ids.filter((x): x is string => typeof x === "string" && x.length > 0).slice(0, 1000) : [];
      if (!ids.length) return Response.json({ ok: false, error: "No ads selected" }, { status: 400 });
      docs = ids.length ? await db.getAll(...ids.map((id) => db.collection("ads").doc(id))) : [];
    }
    const existing = docs.filter((d) => d.exists);
    const imageIds = existing.map((d) => String(d.get("imageId") || "")).filter(Boolean);
    for (let i = 0; i < existing.length; i += 450) {
      const batch = db.batch();
      existing.slice(i, i + 450).forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
    const imagesDeleted = b.deleteImages === true ? await deleteImagesIfUnused(db, imageIds) : 0;
    return Response.json({ ok: true, deleted: existing.length, imagesDeleted });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
