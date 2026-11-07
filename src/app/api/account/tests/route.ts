import { adminDb } from "@/lib/firebaseAdmin";
import { body, err, isResponse, ok, requireVerifiedUser, str, tsMs } from "../_util";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export type AccountTest = {
  id: string; ts: number; mode: string; status: string; provider: string; providerDomain: string; isp: string; server: string;
  download: number | null; upload: number | null; ping: number | null; jitter: number | null; countryCode: string; city: string;
};

// GET    /api/account/tests → { tests: AccountTest[] } (completed tests, newest first)
// DELETE /api/account/tests { id } → removes it from the user's history (the anonymous test stays in site stats)
export async function GET() {
  const u = await requireVerifiedUser();
  if (isResponse(u)) return u;
  const snap = await adminDb().collection("tests").where("userId", "==", u.id).limit(1000).get();
  const { ispBrand } = await import("@/lib/isp");
  const tests: AccountTest[] = snap.docs
    .map((d) => {
      const x = d.data();
      const brand = x.ispBrand ? ispBrand(x.ispBrand) : x.isp ? ispBrand(x.isp) : null;
      return {
        id: d.id,
        ts: tsMs(x.startedAt) || tsMs(x.ts) || tsMs(x.finishedAt),
        mode: String(x.mode || "full"),
        status: String(x.status || ""),
        provider: String(x.ispBrand || brand?.name || x.isp || ""),
        providerDomain: brand?.domain || "",
        isp: String(x.isp || ""),
        server: String(x.server || ""),
        download: x.download ?? null,
        upload: x.upload ?? null,
        ping: x.ping ?? null,
        jitter: x.jitter ?? null,
        countryCode: String(x.countryCode || "").toUpperCase(),
        city: String(x.city || ""),
      };
    })
    .filter((t) => t.status === "completed")
    .sort((a, b) => b.ts - a.ts);
  return ok({ tests });
}

export async function DELETE(req: Request) {
  const u = await requireVerifiedUser();
  if (isResponse(u)) return u;
  const b = await body(req);
  const ids = (Array.isArray(b.ids) ? b.ids : [b.id]).map((x) => str(x, 64)).filter(Boolean).slice(0, 200);
  if (!ids.length) return err("generic");
  const db = adminDb();
  let removed = 0;
  for (const id of ids) {
    const ref = db.collection("tests").doc(id);
    const t = await ref.get();
    if (t.exists && t.get("userId") === u.id) {
      await ref.update({ userId: null });
      removed++;
    }
  }
  return ok({ removed });
}
