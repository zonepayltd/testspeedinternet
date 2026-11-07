import { cookies } from "next/headers";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { rateLimit } from "@/lib/userAuth";
import { clientIp } from "@/lib/geo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/reviews/:id/helpful → { ok, helpful, already? }  (once per browser, rate-limited per IP)
const COOKIE = "tsi_helpful";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!adminConfigured || !/^[A-Za-z0-9]{10,40}$/.test(id)) return Response.json({ ok: false }, { status: 400 });
  const jar = await cookies();
  const voted = (jar.get(COOKIE)?.value || "").split(".").filter(Boolean);
  if (voted.includes(id)) return Response.json({ ok: true, already: true });
  if (!rateLimit(`helpful:${clientIp(request) || "?"}`, 40, 60 * 60_000)) return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });
  const ref = adminDb().collection("reviews").doc(id);
  try {
    const helpful = await adminDb().runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists || snap.get("status") !== "published") return null;
      tx.update(ref, { helpful: FieldValue.increment(1) });
      return (Number(snap.get("helpful")) || 0) + 1;
    });
    if (helpful == null) return Response.json({ ok: false }, { status: 404 });
    jar.set(COOKIE, [...voted, id].slice(-150).join("."), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 365 * 86_400, secure: process.env.NODE_ENV === "production" });
    return Response.json({ ok: true, helpful });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
