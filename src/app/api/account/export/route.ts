import { adminDb } from "@/lib/firebaseAdmin";
import { toPublicUser } from "@/lib/userAuth";
import { isResponse, requireUser, tsMs } from "../_util";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const iso = (t: unknown) => (tsMs(t) ? new Date(tsMs(t)).toISOString() : null);

// GET /api/account/export → JSON file with profile, tests and reviews.
export async function GET() {
  const u = await requireUser();
  if (isResponse(u)) return u;
  const db = adminDb();
  const [tests, reviews] = await Promise.all([
    db.collection("tests").where("userId", "==", u.id).limit(5000).get(),
    db.collection("reviews").where("userId", "==", u.id).limit(1000).get(),
  ]);
  const data = {
    exportedAt: new Date().toISOString(),
    profile: { ...toPublicUser(u), createdAt: iso(u.get("createdAt")), marketing: !!u.get("marketing") },
    tests: tests.docs.map((d) => {
      const x = d.data();
      return { id: d.id, date: iso(x.startedAt || x.ts), status: x.status, mode: x.mode, provider: x.ispBrand || x.isp || "", server: x.server || "", download: x.download ?? null, upload: x.upload ?? null, ping: x.ping ?? null, jitter: x.jitter ?? null, country: x.countryCode || "", city: x.city || "" };
    }),
    reviews: reviews.docs.map((d) => {
      const x = d.data();
      return { id: d.id, provider: x.provider, rating: x.rating, title: x.title, comment: x.comment, status: x.status, date: iso(x.createdAt) };
    }),
  };
  return new Response(JSON.stringify(data, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8", "Content-Disposition": `attachment; filename="testspeedinternet-my-data.json"`, "Cache-Control": "no-store" },
  });
}
