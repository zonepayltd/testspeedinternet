import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";
import { publishReview, rebuildProviderAggregates, toProviderSummary, unpublishReview } from "@/lib/reviews";
import { csv, fail, iso, ms, ok, readJson } from "@/components/admin/analytics/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET    /api/admin/reviews?status=pending|published|hidden|reported&provider&rating&q&page&limit [&format=csv]
//        → { reviews (page), total, pages, counts, avgRating, providers }
// GET    /api/admin/reviews?count=1 → { pending, reported } (sidebar badge, cheap)
// PATCH  /api/admin/reviews  body { ids, action: "publish" | "hide" | "pending" }
// DELETE /api/admin/reviews  body { ids }
// POST   /api/admin/reviews  body { action: "rebuild" } → recompute provider ratings
const CAP = 5_000;

export async function GET(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured", reviews: [] });
  const sp = new URL(request.url).searchParams;
  const db = adminDb();

  try {
    if (sp.get("count")) {
      const [pending, reported] = await Promise.all([
        db.collection("reviews").where("status", "==", "pending").count().get(),
        db.collection("reviews").where("reports", ">", 0).count().get().catch(() => null),
      ]);
      return ok({ pending: pending.data().count, reported: reported ? reported.data().count : 0 });
    }

    const status = sp.get("status") || "";
    const provider = sp.get("provider") || "";
    const rating = Number(sp.get("rating")) || 0;
    const q = (sp.get("q") || "").trim().toLowerCase();
    const limit = Math.min(200, Math.max(5, Number(sp.get("limit")) || 25));
    const page = Math.max(1, Number(sp.get("page")) || 1);

    const [snap, provSnap] = await Promise.all([
      db.collection("reviews").orderBy("createdAt", "desc").limit(CAP).get(),
      db.collection("providers").orderBy("count", "desc").limit(300).get(),
    ]);

    const all = snap.docs.map((d) => {
      const r = d.data();
      return {
        id: d.id,
        providerSlug: String(r.providerSlug || ""),
        provider: String(r.provider || ""),
        providerDomain: String(r.providerDomain || ""),
        rating: Number(r.rating) || 0,
        title: String(r.title || ""),
        comment: String(r.comment || ""),
        name: String(r.name || ""),
        email: String(r.email || ""),
        userId: r.userId ? String(r.userId) : null,
        countryCode: String(r.countryCode || "").toUpperCase(),
        city: String(r.city || ""),
        locale: String(r.locale || ""),
        testId: r.testId ? String(r.testId) : null,
        download: r.download ?? null,
        upload: r.upload ?? null,
        ping: r.ping ?? null,
        status: String(r.status || "pending") as "pending" | "published" | "hidden",
        emailVerified: !!r.emailVerified,
        helpful: Number(r.helpful) || 0,
        reports: Number(r.reports) || 0,
        ip: String(r.ip || ""),
        createdAt: ms(r.createdAt),
        publishedAt: ms(r.publishedAt),
      };
    });

    const filtered = all.filter(
      (r) =>
        (!status || (status === "reported" ? r.reports > 0 : r.status === status)) &&
        (!provider || r.providerSlug === provider) &&
        (!rating || r.rating === rating) &&
        (!q || [r.title, r.comment, r.name, r.email, r.provider, r.city].some((f) => f.toLowerCase().includes(q))),
    );

    if (sp.get("format") === "csv") {
      return csv(
        [
          ["id", "provider", "rating", "title", "comment", "name", "email", "userId", "status", "emailVerified", "country", "city", "download", "upload", "ping", "helpful", "reports", "createdAt"],
          ...filtered.map((r) => [r.id, r.provider, r.rating, r.title, r.comment, r.name, r.email, r.userId, r.status, r.emailVerified ? "yes" : "no", r.countryCode, r.city, r.download, r.upload, r.ping, r.helpful, r.reports, iso(r.createdAt)]),
        ],
        `reviews-${new Date().toISOString().slice(0, 10)}.csv`,
      );
    }

    const published = all.filter((r) => r.status === "published");
    const counts = {
      all: all.length,
      published: published.length,
      pending: all.filter((r) => r.status === "pending").length,
      hidden: all.filter((r) => r.status === "hidden").length,
      reported: all.filter((r) => r.reports > 0).length,
    };
    const avgRating = published.length ? Math.round((published.reduce((a, r) => a + r.rating, 0) / published.length) * 10) / 10 : 0;

    // Providers: aggregates (public ratings) + how many reviews in any status (for the filter).
    const anyCount = new Map<string, { name: string; domain: string; n: number }>();
    for (const r of all) {
      const p = anyCount.get(r.providerSlug) || { name: r.provider, domain: r.providerDomain, n: 0 };
      p.n++;
      anyCount.set(r.providerSlug, p);
    }
    const summaries = new Map(provSnap.docs.map((d) => [d.id, toProviderSummary(d)]));
    const providers = [...anyCount.entries()]
      .map(([slug, p]) => {
        const s = summaries.get(slug);
        return { slug, name: s?.name || p.name, domain: s?.domain || p.domain, total: p.n, count: s?.count || 0, average: s?.average || 0 };
      })
      .sort((a, b) => b.total - a.total);

    return ok({
      reviews: filtered.slice((page - 1) * limit, page * limit),
      total: filtered.length,
      page,
      pages: Math.max(1, Math.ceil(filtered.length / limit)),
      capped: all.length >= CAP,
      counts,
      avgRating,
      providers,
    });
  } catch (err) {
    return fail(err);
  }
}

const cleanIds = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && !!x && !x.includes("/")).slice(0, 500) : []);

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" });
  const b = await readJson<{ ids?: unknown; action?: string }>(request);
  const ids = cleanIds(b.ids);
  if (!ids.length) return Response.json({ ok: false, error: "Provide ids" }, { status: 400 });
  try {
    let changed = 0;
    for (const id of ids) {
      if (b.action === "publish") changed += (await publishReview(id)) ? 1 : 0;
      else if (b.action === "hide" || b.action === "pending") {
        // unpublishReview handles the aggregate when the review was public; for others it just sets the status.
        changed += (await unpublishReview(id, b.action === "hide" ? "hidden" : "pending")) ? 1 : 0;
      } else if (b.action === "clear-reports") {
        await adminDb().collection("reviews").doc(id).update({ reports: 0 });
        changed++;
      } else return Response.json({ ok: false, error: "Unknown action" }, { status: 400 });
    }
    return ok({ changed });
  } catch (err) {
    return fail(err);
  }
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" });
  const ids = cleanIds((await readJson<{ ids?: unknown }>(request)).ids);
  if (!ids.length) return Response.json({ ok: false, error: "Provide ids" }, { status: 400 });
  try {
    let deleted = 0;
    for (const id of ids) deleted += (await unpublishReview(id, "delete")) ? 1 : 0;
    return ok({ deleted });
  } catch (err) {
    return fail(err);
  }
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" });
  const b = await readJson<{ action?: string }>(request);
  if (b.action !== "rebuild") return Response.json({ ok: false, error: "Unknown action" }, { status: 400 });
  try {
    return ok({ providers: await rebuildProviderAggregates() });
  } catch (err) {
    return fail(err);
  }
}
