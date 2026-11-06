import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";
import { parseUA } from "@/lib/ua";
import { deleteVisitorCascade, fail, ms, ok } from "@/components/admin/analytics/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET    /api/admin/visitors/[id] → { visitor, visits (page-view timeline), tests, online }
// DELETE /api/admin/visitors/[id] → deletes the visitor + their visits, tests and presence
export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" });
  const { id } = await ctx.params;
  const db = adminDb();
  try {
    // Equality-only queries (no composite index needed); sorted in memory.
    const [doc, vSnap, tSnap, pDoc] = await Promise.all([
      db.collection("visitors").doc(id).get(),
      db.collection("visits").where("visitorId", "==", id).limit(1000).get(),
      db.collection("tests").where("visitorId", "==", id).limit(300).get(),
      db.collection("presence").doc(id).get(),
    ]);
    const x = doc.exists ? doc.data()! : null;
    const visitor = x
      ? {
          id,
          visits: x.visits || 0,
          firstSeen: ms(x.firstSeen),
          lastSeen: ms(x.lastSeen),
          country: x.country || "",
          countryCode: x.countryCode || "",
          city: x.city || "",
          ip: x.ip || "",
          ua: x.ua || "",
          source: x.source || "Direct",
          lastPath: x.lastPath || "/",
          ...parseUA(x.ua || ""),
        }
      : null;
    const visits = vSnap.docs
      .map((d) => {
        const v = d.data();
        return { id: d.id, path: v.path || "/", referrer: v.referrer || "", source: v.source || "Direct", sessionId: v.sessionId || "", countryCode: v.countryCode || "", city: v.city || "", ip: v.ip || "", screen: v.screen || "", ts: ms(v.ts) };
      })
      .sort((a, b) => b.ts - a.ts);
    const tests = tSnap.docs
      .map((d) => {
        const t = d.data();
        return { id: d.id, status: t.status || "started", mode: t.mode || "full", download: t.download ?? null, upload: t.upload ?? null, ping: t.ping ?? null, jitter: t.jitter ?? null, ispBrand: t.ispBrand || t.isp || "", server: t.server || "", ts: ms(t.ts) || ms(t.startedAt) };
      })
      .sort((a, b) => b.ts - a.ts);
    const presence = pDoc.exists ? pDoc.data()! : null;
    const online = presence ? Date.now() - ms(presence.lastSeen) < 60_000 : false;
    if (!visitor && !visits.length && !tests.length) return Response.json({ ok: false, error: "Visitor not found" }, { status: 404 });
    return ok({ visitor, visits, tests, online, onlinePath: online ? presence?.path || "" : "" });
  } catch (err) {
    return fail(err);
  }
}

export async function DELETE(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" });
  const { id } = await ctx.params;
  try {
    const r = await deleteVisitorCascade(adminDb(), id);
    return ok({ deleted: { visitors: 1, ...r } });
  } catch (err) {
    return fail(err);
  }
}
