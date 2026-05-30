import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ms = (t?: Timestamp) => (t ? t.toMillis() : 0);

export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, visits: [] }, { status: 200 });

  const { id } = await ctx.params;

  try {
    // Equality-only query (no composite index needed); sort in memory.
    const snap = await adminDb()
      .collection("visits")
      .where("visitorId", "==", id)
      .limit(500)
      .get();

    const visits = snap.docs
      .map((d) => {
        const x = d.data();
        return {
          path: x.path || "/",
          referrer: x.referrer || "",
          source: x.source || "Direct",
          country: x.country || "",
          countryCode: x.countryCode || "",
          ip: x.ip || "",
          city: x.city || "",
          ts: ms(x.ts),
        };
      })
      .sort((a, b) => b.ts - a.ts)
      .slice(0, 200);

    return Response.json({ ok: true, visits });
  } catch (err) {
    return Response.json(
      { ok: false, visits: [], error: err instanceof Error ? err.message : "Failed" },
      { status: 200 }
    );
  }
}
