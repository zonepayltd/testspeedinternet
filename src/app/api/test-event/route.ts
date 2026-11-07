import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { parseUA } from "@/lib/ua";
import { getSessionUserSnap } from "@/lib/userAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Speed-test analytics: tests/{testId}
//   status "started"  -> visitor pressed GO
//   status "completed" | "error" | "cancelled" -> outcome + results
const STATUSES = new Set(["started", "completed", "error", "cancelled"]);
const MODES = new Set(["full", "download", "upload", "ping"]);
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) && v >= 0 && v < 1e6 ? Math.round(v * 100) / 100 : null);

export async function POST(request: Request) {
  if (!adminConfigured) return Response.json({ ok: true });

  let b: Record<string, unknown>;
  try {
    b = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const testId = String(b.testId || "").replace(/[^a-zA-Z0-9-]/g, "").slice(0, 64);
  const status = String(b.status || "");
  if (!testId || !STATUSES.has(status)) return Response.json({ ok: false }, { status: 400 });

  try {
    const ref = adminDb().collection("tests").doc(testId);
    const now = FieldValue.serverTimestamp();
    if (status === "started") {
      const ua = request.headers.get("user-agent") || "";
      const { device, os, browser } = parseUA(ua);
      if (device === "bot") return Response.json({ ok: true });
      // Logged-in visitors: attach the test to their account (shown in their dashboard).
      const user = await getSessionUserSnap().catch(() => null);
      await ref.set(
        {
          status,
          userId: user?.id || null,
          startedAt: now,
          ts: now,
          visitorId: String(b.visitorId || "").slice(0, 80),
          mode: MODES.has(String(b.mode)) ? String(b.mode) : "full",
          path: String(b.path || "/").slice(0, 300),
          locale: String(b.locale || "en").slice(0, 5),
          isp: String(b.isp || "").slice(0, 160),
          ispBrand: String(b.ispBrand || "").slice(0, 80),
          ip: String(b.ip || "").slice(0, 64),
          countryCode: String(b.countryCode || request.headers.get("cf-ipcountry") || request.headers.get("x-vercel-ip-country") || "").slice(0, 2),
          city: String(b.city || "").slice(0, 80),
          server: String(b.server || "").slice(0, 8),
          device,
          os,
          browser,
        },
        { merge: true },
      );
    } else {
      const data: Record<string, unknown> = {
        status,
        finishedAt: now,
        download: num(b.download),
        upload: num(b.upload),
        ping: num(b.ping),
        jitter: num(b.jitter),
        durationMs: num(b.durationMs),
        error: status === "error" ? String(b.error || "").slice(0, 40) : null,
      };
      const server = String(b.server || "").slice(0, 8);
      if (server) data.server = server;
      await ref.set(data, { merge: true });
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 200 });
  }
}
