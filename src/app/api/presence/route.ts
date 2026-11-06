import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { parseUA } from "@/lib/ua";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Heartbeat from open pages (every ~30 s while the tab is visible).
// presence/{visitorId} = who is online right now and on which page.
// The admin counts a visitor as "online" if lastSeen is within the last 60 s.
export async function POST(request: Request) {
  if (!adminConfigured) return Response.json({ ok: true });

  let b: { visitorId?: string; path?: string; locale?: string; leaving?: boolean };
  try {
    b = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const visitorId = String(b.visitorId || "").slice(0, 80);
  const path = String(b.path || "/").slice(0, 300);
  if (!visitorId || path.startsWith("/admin")) return Response.json({ ok: true });

  try {
    const ref = adminDb().collection("presence").doc(visitorId);
    if (b.leaving) {
      await ref.delete();
      return Response.json({ ok: true });
    }
    const ua = request.headers.get("user-agent") || "";
    const { device, os, browser } = parseUA(ua);
    if (device === "bot") return Response.json({ ok: true });
    const countryCode = request.headers.get("cf-ipcountry") || request.headers.get("x-vercel-ip-country") || "";
    const city = decodeURIComponent(request.headers.get("x-vercel-ip-city") || "");
    const data: Record<string, unknown> = {
      lastSeen: FieldValue.serverTimestamp(),
      path,
      locale: String(b.locale || "en").slice(0, 5),
      device,
      os,
      browser,
    };
    if (countryCode) data.countryCode = countryCode;
    if (city) data.city = city;
    await ref.set(data, { merge: true });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 200 });
  }
}
