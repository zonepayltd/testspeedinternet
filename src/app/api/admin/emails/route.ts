import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";
import { csv, fail, iso, ms, ok } from "@/components/admin/analytics/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/emails?source=account|review|contact&marketing=1&verified=1&q&page&limit [&format=csv|txt]
//     → every unique email address collected by the site (accounts, reviews, contact form), merged.
// GET /api/admin/emails?log=1 → last 100 emails the site sent (mailLog)
type Source = "account" | "review" | "contact";
type Row = {
  email: string; name: string; sources: Source[]; verified: boolean; marketing: boolean; userId: string | null;
  countryCode: string; accounts: number; reviews: number; messages: number; firstSeen: number; lastSeen: number;
};

export async function GET(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured", emails: [] });
  const sp = new URL(request.url).searchParams;
  const db = adminDb();

  try {
    if (sp.get("log")) {
      const snap = await db.collection("mailLog").orderBy("ts", "desc").limit(100).get();
      return ok({
        log: snap.docs.map((d) => ({ id: d.id, to: String(d.get("to") || ""), subject: String(d.get("subject") || ""), ok: !!d.get("ok"), error: d.get("error") ? String(d.get("error")) : null, ts: ms(d.get("ts")) })),
      });
    }

    const [users, reviews, messages] = await Promise.all([
      db.collection("users").select("email", "name", "emailVerified", "marketing", "countryCode", "createdAt", "lastLoginAt").limit(20_000).get(),
      db.collection("reviews").select("email", "name", "emailVerified", "userId", "countryCode", "createdAt").limit(20_000).get(),
      db.collection("messages").select("email", "name", "ts").limit(20_000).get(),
    ]);

    const map = new Map<string, Row>();
    const touch = (raw: unknown, src: Source, o: { name?: unknown; verified?: boolean; marketing?: boolean; userId?: string | null; cc?: unknown; t: number; t2?: number }) => {
      const email = String(raw || "").trim().toLowerCase();
      if (!email || !email.includes("@")) return;
      const r = map.get(email) || { email, name: "", sources: [], verified: false, marketing: false, userId: null, countryCode: "", accounts: 0, reviews: 0, messages: 0, firstSeen: 0, lastSeen: 0 };
      if (!r.sources.includes(src)) r.sources.push(src);
      if (src === "account") r.accounts++;
      else if (src === "review") r.reviews++;
      else r.messages++;
      // Prefer the account name, then any name.
      const name = String(o.name || "").trim();
      if (name && (src === "account" || !r.name)) r.name = name;
      if (o.verified) r.verified = true;
      if (o.marketing) r.marketing = true;
      if (o.userId && !r.userId) r.userId = o.userId;
      const cc = String(o.cc || "").toUpperCase();
      if (cc && !r.countryCode) r.countryCode = cc;
      const times = [o.t, o.t2 || 0].filter(Boolean);
      for (const t of times) {
        if (!r.firstSeen || t < r.firstSeen) r.firstSeen = t;
        if (t > r.lastSeen) r.lastSeen = t;
      }
      map.set(email, r);
    };
    users.docs.forEach((d) => touch(d.get("email"), "account", { name: d.get("name"), verified: !!d.get("emailVerified"), marketing: !!d.get("marketing"), userId: d.id, cc: d.get("countryCode"), t: ms(d.get("createdAt")), t2: ms(d.get("lastLoginAt")) }));
    reviews.docs.forEach((d) => touch(d.get("email"), "review", { name: d.get("name"), verified: !!d.get("emailVerified"), userId: d.get("userId") || null, cc: d.get("countryCode"), t: ms(d.get("createdAt")) }));
    messages.docs.forEach((d) => touch(d.get("email"), "contact", { name: d.get("name"), t: ms(d.get("ts")) }));

    const all = [...map.values()].sort((a, b) => b.lastSeen - a.lastSeen);
    const source = sp.get("source") || "";
    const q = (sp.get("q") || "").trim().toLowerCase();
    const filtered = all.filter(
      (r) =>
        (!source || r.sources.includes(source as Source)) &&
        (!sp.get("marketing") || r.marketing) &&
        (!sp.get("verified") || r.verified) &&
        (!q || r.email.includes(q) || r.name.toLowerCase().includes(q)),
    );

    const fmt = sp.get("format");
    if (fmt === "csv") {
      return csv(
        [
          ["email", "name", "sources", "verified", "marketingOptIn", "country", "accounts", "reviews", "contactMessages", "firstSeen", "lastSeen"],
          ...filtered.map((r) => [r.email, r.name, r.sources.join("|"), r.verified ? "yes" : "no", r.marketing ? "yes" : "no", r.countryCode, r.accounts, r.reviews, r.messages, iso(r.firstSeen), iso(r.lastSeen)]),
        ],
        `emails-${new Date().toISOString().slice(0, 10)}.csv`,
      );
    }
    if (fmt === "txt") return ok({ emails: filtered.map((r) => r.email) });

    const limit = Math.min(500, Math.max(5, Number(sp.get("limit")) || 50));
    const page = Math.max(1, Number(sp.get("page")) || 1);
    return ok({
      emails: filtered.slice((page - 1) * limit, page * limit),
      total: filtered.length,
      page,
      pages: Math.max(1, Math.ceil(filtered.length / limit)),
      stats: {
        total: all.length,
        verified: all.filter((r) => r.verified).length,
        marketing: all.filter((r) => r.marketing).length,
        account: all.filter((r) => r.sources.includes("account")).length,
        review: all.filter((r) => r.sources.includes("review")).length,
        contact: all.filter((r) => r.sources.includes("contact")).length,
      },
    });
  } catch (err) {
    return fail(err);
  }
}
