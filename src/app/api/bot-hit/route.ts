import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { identifyBot } from "@/lib/bots";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Called by the middleware (fire-and-forget) when a crawler requests a page,
// robots.txt, a sitemap or ads.txt. One doc per hit in "bots"; the admin
// aggregates them. Kept apart from "visits" so bots never count as visitors.
const KEEP_DAYS = 60;

// Small per-instance limiter so a flood can't run up Firestore writes.
let windowStart = 0;
let windowCount = 0;
const MAX_PER_MINUTE = 300;

export async function POST(request: Request) {
  if (!adminConfigured) return Response.json({ ok: true });
  const now = Date.now();
  if (now - windowStart > 60_000) {
    windowStart = now;
    windowCount = 0;
  }
  if (++windowCount > MAX_PER_MINUTE) return Response.json({ ok: false, limited: true });

  let b: { path?: unknown; ua?: unknown; ip?: unknown; country?: unknown; status?: unknown };
  try {
    b = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const ua = String(b.ua || "").slice(0, 400);
  const bot = identifyBot(ua);
  if (!bot) return Response.json({ ok: false, error: "not a bot" }, { status: 400 });

  const path = String(b.path || "/").slice(0, 300);
  const ip = String(b.ip || "").slice(0, 60);
  const countryCode = String(b.country || "").toUpperCase().slice(0, 2);

  try {
    const db = adminDb();
    await db.collection("bots").add({ name: bot.name, kind: bot.kind, path, ua, ip, countryCode, ts: FieldValue.serverTimestamp() });

    // Occasionally trim old hits.
    if (Math.random() < 0.02) {
      const old = await db.collection("bots").where("ts", "<", Timestamp.fromMillis(now - KEEP_DAYS * 86_400_000)).limit(200).select().get();
      if (!old.empty) {
        const batch = db.batch();
        old.docs.forEach((d) => batch.delete(d.ref));
        await batch.commit();
      }
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false });
  }
}
