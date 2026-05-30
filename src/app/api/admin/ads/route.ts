import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";
import { mapAd } from "@/lib/adsModel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, ads: [] }, { status: 200 });

  try {
    const snap = await adminDb().collection("ads").get();
    const ads = snap.docs
      .map((d) => mapAd(d.id, d.data()))
      .sort((a, b) => a.order - b.order || b.updatedAt - a.updatedAt);
    return Response.json({ ok: true, ads });
  } catch (err) {
    return Response.json({ ok: false, ads: [], error: String(err) }, { status: 200 });
  }
}

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

export async function POST(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" }, { status: 200 });

  let b: Record<string, unknown>;
  try {
    b = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const ref = await adminDb()
    .collection("ads")
    .add({ ...clean(b), createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
  return Response.json({ ok: true, id: ref.id });
}
