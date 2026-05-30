import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { mapAd } from "@/lib/adsModel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public list of ENABLED ad units (no secrets) for the front-end ad slots.
export async function GET() {
  if (!adminConfigured) {
    return Response.json({ ads: [] }, { headers: { "Cache-Control": "public, max-age=60" } });
  }
  try {
    const snap = await adminDb().collection("ads").where("enabled", "==", true).get();
    const ads = snap.docs
      .map((d) => mapAd(d.id, d.data()))
      .sort((a, b) => a.order - b.order)
      .map(({ id, type, placement, scope, pathPrefix, adsenseSlot, customFormat, image, title, description, link }) => ({
        id,
        type,
        placement,
        scope,
        pathPrefix,
        adsenseSlot,
        customFormat,
        image,
        title,
        description,
        link,
      }));
    return Response.json({ ads }, { headers: { "Cache-Control": "public, max-age=60" } });
  } catch {
    return Response.json({ ads: [] }, { headers: { "Cache-Control": "no-store" } });
  }
}
