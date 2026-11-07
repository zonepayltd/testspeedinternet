import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";
import { csv, fail, iso, ms, ok, readJson } from "@/components/admin/analytics/server";
import { deleteUserCascade } from "@/components/admin/users/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET    /api/admin/users?q&status=verified|unverified|disabled&country&page&limit [&format=csv]
//        → { users (page), total, pages, totalAll, stats, facets }
//        Reads the newest users (capped) and filters in memory — no composite indexes.
// DELETE /api/admin/users  body { ids: string[] }  (cascade: tests unlinked, reviews deleted, profile removed)
const CAP = 5_000;
const WEEK = 7 * 86_400_000;

export async function GET(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured", users: [] });

  const sp = new URL(request.url).searchParams;
  const q = (sp.get("q") || "").trim().toLowerCase();
  const status = sp.get("status") || "";
  const country = (sp.get("country") || "").toUpperCase();
  const limit = Math.min(200, Math.max(5, Number(sp.get("limit")) || 25));
  const page = Math.max(1, Number(sp.get("page")) || 1);

  try {
    const db = adminDb();
    const [snap, testsSnap, reviewsSnap] = await Promise.all([
      db.collection("users").orderBy("createdAt", "desc").limit(CAP).get(),
      // Only the userId field — cheap, used for per-user counts.
      db.collection("tests").where("userId", "!=", null).select("userId").limit(50_000).get().catch(() => null),
      db.collection("reviews").select("userId").limit(20_000).get().catch(() => null),
    ]);
    const testCount = new Map<string, number>();
    testsSnap?.docs.forEach((d) => {
      const u = d.get("userId");
      if (u) testCount.set(u, (testCount.get(u) || 0) + 1);
    });
    const reviewCount = new Map<string, number>();
    reviewsSnap?.docs.forEach((d) => {
      const u = d.get("userId");
      if (u) reviewCount.set(u, (reviewCount.get(u) || 0) + 1);
    });

    const all = snap.docs.map((d) => {
      const x = d.data();
      return {
        id: d.id,
        name: String(x.name || ""),
        email: String(x.email || ""),
        phone: String(x.phone || ""),
        country: String(x.country || ""),
        countryCode: String(x.countryCode || "").toUpperCase(),
        locale: String(x.locale || "en"),
        emailVerified: !!x.emailVerified,
        status: (x.status === "disabled" ? "disabled" : "active") as "active" | "disabled",
        marketing: !!x.marketing,
        createdAt: ms(x.createdAt),
        verifiedAt: ms(x.verifiedAt),
        lastLoginAt: ms(x.lastLoginAt),
        tests: testCount.get(d.id) || 0,
        reviews: reviewCount.get(d.id) || 0,
      };
    });

    const filtered = all.filter(
      (u) =>
        (!status ||
          (status === "verified" && u.emailVerified) ||
          (status === "unverified" && !u.emailVerified) ||
          (status === "disabled" && u.status === "disabled")) &&
        (!country || u.countryCode === country) &&
        (!q || [u.id, u.name, u.email, u.phone, u.country, u.countryCode].some((f) => f.toLowerCase().includes(q))),
    );

    if (sp.get("format") === "csv") {
      return csv(
        [
          ["id", "name", "email", "emailVerified", "phone", "country", "countryCode", "language", "status", "marketingOptIn", "tests", "reviews", "createdAt", "lastLoginAt"],
          ...filtered.map((u) => [u.id, u.name, u.email, u.emailVerified ? "yes" : "no", u.phone, u.country, u.countryCode, u.locale, u.status, u.marketing ? "yes" : "no", u.tests, u.reviews, iso(u.createdAt), iso(u.lastLoginAt)]),
        ],
        `users-${new Date().toISOString().slice(0, 10)}.csv`,
      );
    }

    const countries = new Map<string, { count: number; name: string }>();
    for (const u of all) if (u.countryCode) countries.set(u.countryCode, { count: (countries.get(u.countryCode)?.count || 0) + 1, name: u.country || u.countryCode });
    const now = Date.now();

    return ok({
      users: filtered.slice((page - 1) * limit, page * limit),
      total: filtered.length,
      page,
      pages: Math.max(1, Math.ceil(filtered.length / limit)),
      totalAll: all.length,
      capped: all.length >= CAP,
      stats: {
        total: all.length,
        verified: all.filter((u) => u.emailVerified).length,
        unverified: all.filter((u) => !u.emailVerified).length,
        disabled: all.filter((u) => u.status === "disabled").length,
        newThisWeek: all.filter((u) => now - u.createdAt < WEEK).length,
        withReviews: all.filter((u) => u.reviews > 0).length,
        withTests: all.filter((u) => u.tests > 0).length,
      },
      facets: {
        countries: [...countries.entries()].sort((a, b) => b[1].count - a[1].count).map(([value, v]) => ({ value, count: v.count, name: v.name })),
      },
    });
  } catch (err) {
    return fail(err);
  }
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" });
  const body = await readJson<{ ids?: unknown }>(request);
  if (!Array.isArray(body.ids)) return Response.json({ ok: false, error: "Provide ids" }, { status: 400 });
  const ids = body.ids.filter((x): x is string => typeof x === "string" && !!x && !x.includes("/")).slice(0, 200);
  try {
    let tests = 0;
    let reviews = 0;
    for (const id of ids) {
      const r = await deleteUserCascade(id);
      tests += r.tests;
      reviews += r.reviews;
    }
    return ok({ deleted: { users: ids.length, testsUnlinked: tests, reviews } });
  } catch (err) {
    return fail(err);
  }
}
