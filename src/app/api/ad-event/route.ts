import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { dayKey } from "@/lib/adsModel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/ad-event  body: { adId, type: "impression" | "click", visitorId? }
// Records an ad impression or click (total, per country, per UTC day).
export async function POST(request: Request) {
  if (!adminConfigured) return Response.json({ ok: true });

  let b: { adId?: unknown; type?: unknown; visitorId?: unknown };
  try {
    b = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const adId = typeof b.adId === "string" ? b.adId : "";
  const type = b.type;
  const visitorId = typeof b.visitorId === "string" ? b.visitorId.slice(0, 80) : "";
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(adId) || (type !== "impression" && type !== "click")) {
    return Response.json({ ok: true });
  }

  try {
    const db = adminDb();

    // Country: from edge headers, else from the visitor's stored profile.
    let cc = request.headers.get("cf-ipcountry") || request.headers.get("x-vercel-ip-country") || "";
    if (!cc && visitorId && !visitorId.includes("/")) {
      try {
        const vs = await db.collection("visitors").doc(visitorId).get();
        cc = vs.exists ? String(vs.get("countryCode") || "") : "";
      } catch {
        /* ignore */
      }
    }
    cc = /^[A-Za-z]{2}$/.test(cc) ? cc.toUpperCase() : "";

    const day = dayKey();
    const update: Record<string, FirebaseFirestore.FieldValue> = {};
    if (type === "impression") {
      update.impressions = FieldValue.increment(1);
      update[`impByDay.${day}`] = FieldValue.increment(1);
      if (cc) update[`impByCountry.${cc}`] = FieldValue.increment(1);
    } else {
      update.clicks = FieldValue.increment(1);
      update[`clickByDay.${day}`] = FieldValue.increment(1);
      if (cc) update[`clickByCountry.${cc}`] = FieldValue.increment(1);
    }

    await db.collection("ads").doc(adId).update(update);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: true });
  }
}
