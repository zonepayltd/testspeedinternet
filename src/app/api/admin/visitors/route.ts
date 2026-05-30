import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ms = (t?: Timestamp) => (t ? t.toMillis() : 0);

export async function GET() {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, visitors: [] }, { status: 200 });

  try {
    const snap = await adminDb()
      .collection("visitors")
      .orderBy("lastSeen", "desc")
      .limit(100)
      .get();

    const visitors = snap.docs.map((d) => {
      const x = d.data();
      return {
        id: d.id,
        visits: x.visits || 0,
        lastSeen: ms(x.lastSeen),
        firstSeen: ms(x.firstSeen),
        country: x.country || "",
        countryCode: x.countryCode || "",
        city: x.city || "",
        ip: x.ip || "",
        ua: x.ua || "",
        source: x.source || "Direct",
        lastPath: x.lastPath || "/",
      };
    });

    return Response.json({ ok: true, visitors });
  } catch (err) {
    return Response.json(
      { ok: false, visitors: [], error: err instanceof Error ? err.message : "Failed" },
      { status: 200 }
    );
  }
}
