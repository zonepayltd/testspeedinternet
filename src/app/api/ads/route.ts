import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { mapAd, toPublicAd, inSchedule, adIsRenderable } from "@/lib/adsModel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public list of ACTIVE ads (enabled + within schedule + complete) with only the
// fields needed to render them. The client re-checks the schedule, so the short
// cache never shows an ad past its end date.
export async function GET() {
  if (!adminConfigured) {
    return Response.json({ ads: [] }, { headers: { "Cache-Control": "public, max-age=60" } });
  }
  try {
    const now = Date.now();
    const snap = await adminDb().collection("ads").where("enabled", "==", true).get();
    const ads = snap.docs
      .map((d) => mapAd(d.id, d.data()))
      .filter((a) => inSchedule(a, now) && adIsRenderable(a))
      .sort((a, b) => a.order - b.order || b.updatedAt - a.updatedAt)
      .map(toPublicAd);
    return Response.json({ ads }, { headers: { "Cache-Control": "public, max-age=60" } });
  } catch {
    return Response.json({ ads: [] }, { headers: { "Cache-Control": "no-store" } });
  }
}
