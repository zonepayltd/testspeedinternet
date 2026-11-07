import { adminConfigured } from "@/lib/firebaseAdmin";
import { getProviderSummary, providerSlug } from "@/lib/reviews";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/reviews/summary?provider=<name or slug> → { ok, summary: ProviderSummary | null }
export async function GET(request: Request) {
  const slug = providerSlug(new URL(request.url).searchParams.get("provider") || "");
  if (!slug) return Response.json({ ok: false, error: "provider" }, { status: 400 });
  if (!adminConfigured) return Response.json({ ok: true, summary: null });
  try {
    const summary = await getProviderSummary(slug);
    return Response.json(
      { ok: true, slug, summary: summary && summary.count > 0 ? summary : null },
      { headers: { "Cache-Control": "public, max-age=60, s-maxage=60" } },
    );
  } catch {
    return Response.json({ ok: true, slug, summary: null });
  }
}
