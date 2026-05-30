import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Records an ad impression or click (with country) for the admin stats.
export async function POST(request: Request) {
  if (!adminConfigured) return Response.json({ ok: true });

  let b: { adId?: string; type?: string; visitorId?: string };
  try {
    b = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const { adId, type, visitorId } = b;
  if (!adId || (type !== "impression" && type !== "click")) {
    return Response.json({ ok: true });
  }

  try {
    const db = adminDb();

    // Country: from edge headers, else from the visitor's stored profile.
    let cc =
      request.headers.get("cf-ipcountry") || request.headers.get("x-vercel-ip-country") || "";
    if (!cc && visitorId) {
      try {
        const vs = await db.collection("visitors").doc(visitorId).get();
        cc = vs.exists ? String(vs.get("countryCode") || "") : "";
      } catch {
        /* ignore */
      }
    }

    const update: Record<string, FirebaseFirestore.FieldValue> = {};
    if (type === "impression") {
      update.impressions = FieldValue.increment(1);
      if (cc) update[`impByCountry.${cc}`] = FieldValue.increment(1);
    } else {
      update.clicks = FieldValue.increment(1);
      if (cc) update[`clickByCountry.${cc}`] = FieldValue.increment(1);
    }

    await db.collection("ads").doc(adId).update(update);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: true });
  }
}
