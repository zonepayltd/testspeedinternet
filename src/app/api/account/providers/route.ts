import { adminDb } from "@/lib/firebaseAdmin";
import { ispBrand } from "@/lib/isp";
import { getProviderSummary, providerSlug, type ProviderSummary } from "@/lib/reviews";
import { isResponse, ok, requireVerifiedUser, tsMs } from "../_util";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export type MyProvider = {
  name: string; slug: string; domain: string; tests: number; lastTest: number;
  avgDownload: number | null; avgUpload: number | null; avgPing: number | null; bestDownload: number | null; bestUpload: number | null; bestPing: number | null;
  community: ProviderSummary | null;
};

const avg = (v: number[]) => (v.length ? Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10 : null);

// GET /api/account/providers → the user's providers (from their completed tests) + community rating.
export async function GET() {
  const u = await requireVerifiedUser();
  if (isResponse(u)) return u;
  const snap = await adminDb().collection("tests").where("userId", "==", u.id).limit(1000).get();
  const groups = new Map<string, { name: string; domain: string; d: number[]; up: number[]; p: number[]; last: number }>();
  for (const doc of snap.docs) {
    const x = doc.data();
    if (x.status !== "completed") continue;
    const raw = String(x.ispBrand || x.isp || "");
    if (!raw) continue;
    const brand = ispBrand(raw);
    const name = String(x.ispBrand || brand.name || raw);
    const slug = providerSlug(name);
    if (!slug) continue;
    const g = groups.get(slug) || { name, domain: brand.domain || "", d: [], up: [], p: [], last: 0 };
    if (typeof x.download === "number") g.d.push(x.download);
    if (typeof x.upload === "number") g.up.push(x.upload);
    if (typeof x.ping === "number") g.p.push(x.ping);
    g.last = Math.max(g.last, tsMs(x.startedAt) || tsMs(x.ts));
    groups.set(slug, g);
  }
  const providers: MyProvider[] = await Promise.all(
    [...groups.entries()].map(async ([slug, g]) => ({
      name: g.name,
      slug,
      domain: g.domain,
      tests: Math.max(g.d.length, g.up.length, g.p.length),
      lastTest: g.last,
      avgDownload: avg(g.d),
      avgUpload: avg(g.up),
      avgPing: avg(g.p),
      bestDownload: g.d.length ? Math.max(...g.d) : null,
      bestUpload: g.up.length ? Math.max(...g.up) : null,
      bestPing: g.p.length ? Math.min(...g.p) : null,
      community: await getProviderSummary(slug).catch(() => null),
    })),
  );
  providers.sort((a, b) => b.tests - a.tests || b.lastTest - a.lastTest);
  return ok({ providers });
}
