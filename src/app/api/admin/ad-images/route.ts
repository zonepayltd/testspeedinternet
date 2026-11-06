import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Images uploaded for ads live in Firestore (`adImages`) as base64 — the browser
// resizes/compresses them first, so each doc stays well under the 1 MiB limit.
const TYPES = ["image/webp", "image/jpeg", "image/png", "image/gif"];
const MAX_BYTES = 740 * 1024;
const notConfigured = () => Response.json({ ok: false, error: "Firebase not configured" }, { status: 200 });

// GET /api/admin/ad-images → { ok, images: [{id, url, type, width, height, size, createdAt, usedBy}] }
export async function GET() {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return notConfigured();
  try {
    const db = adminDb();
    const [imgs, ads] = await Promise.all([
      db.collection("adImages").select("type", "width", "height", "size", "createdAt", "name").orderBy("createdAt", "desc").limit(200).get(),
      db.collection("ads").select("imageId").get(),
    ]);
    const used: Record<string, number> = {};
    ads.docs.forEach((d) => {
      const id = d.get("imageId");
      if (id) used[id] = (used[id] || 0) + 1;
    });
    const images = imgs.docs.map((d) => ({
      id: d.id,
      url: `/api/ad-image/${d.id}`,
      name: d.get("name") || "",
      type: d.get("type") || "",
      width: d.get("width") || 0,
      height: d.get("height") || 0,
      size: d.get("size") || 0,
      createdAt: d.get("createdAt")?.toMillis?.() || 0,
      usedBy: used[d.id] || 0,
    }));
    return Response.json({ ok: true, images });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

// POST /api/admin/ad-images  body: { data: base64 (no data: prefix ok either way), type, width, height, name? }
//   → { ok, id, url: "/api/ad-image/<id>" }
export async function POST(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return notConfigured();
  let b: { data?: unknown; type?: unknown; width?: unknown; height?: unknown; name?: unknown };
  try {
    b = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }
  let data = String(b.data || "");
  const m = /^data:([^;]+);base64,/.exec(data);
  let type = String(b.type || "");
  if (m) {
    type = type || m[1];
    data = data.slice(m[0].length);
  }
  if (!TYPES.includes(type)) return Response.json({ ok: false, error: "Only WebP, JPEG, PNG or GIF images are allowed" }, { status: 400 });
  if (!data || !/^[A-Za-z0-9+/=]+$/.test(data)) return Response.json({ ok: false, error: "Invalid image data" }, { status: 400 });
  const size = Math.floor((data.length * 3) / 4) - (data.endsWith("==") ? 2 : data.endsWith("=") ? 1 : 0);
  if (size > MAX_BYTES) return Response.json({ ok: false, error: `Image is too large (${Math.round(size / 1024)} KB, max ${Math.round(MAX_BYTES / 1024)} KB)` }, { status: 413 });

  try {
    const ref = await adminDb().collection("adImages").add({
      data,
      type,
      width: Math.max(0, Math.round(Number(b.width) || 0)),
      height: Math.max(0, Math.round(Number(b.height) || 0)),
      size,
      name: String(b.name || "").slice(0, 120),
      createdAt: FieldValue.serverTimestamp(),
    });
    return Response.json({ ok: true, id: ref.id, url: `/api/ad-image/${ref.id}` });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

// DELETE /api/admin/ad-images  body: { ids: string[] } | { unused: true } → { ok, deleted }
export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return notConfigured();
  let b: { ids?: unknown; unused?: unknown } = {};
  try {
    b = await request.json();
  } catch {
    /* empty */
  }
  try {
    const db = adminDb();
    let ids: string[] = Array.isArray(b.ids) ? b.ids.filter((x): x is string => typeof x === "string" && !!x).slice(0, 450) : [];
    if (b.unused === true) {
      const [imgs, ads] = await Promise.all([db.collection("adImages").select().get(), db.collection("ads").select("imageId").get()]);
      const used = new Set(ads.docs.map((d) => d.get("imageId")).filter(Boolean));
      ids = imgs.docs.map((d) => d.id).filter((id) => !used.has(id));
    }
    if (!ids.length) return Response.json({ ok: true, deleted: 0 });
    for (let i = 0; i < ids.length; i += 450) {
      const batch = db.batch();
      ids.slice(i, i + 450).forEach((id) => batch.delete(db.collection("adImages").doc(id)));
      await batch.commit();
    }
    return Response.json({ ok: true, deleted: ids.length });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
