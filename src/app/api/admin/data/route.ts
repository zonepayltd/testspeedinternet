import { Timestamp, type Query } from "firebase-admin/firestore";
import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Data management for the admin: counts, bulk deletes and exports.
//
// GET                                   → { ok, counts: { visits, visitors, presence, tests, messages, ads }, adStats: { impressions, clicks } }
// GET ?collection=<c>[&olderThanDays=N] → { ok, count } (preview for a delete)
// GET ?export=<collection>&format=json|csv[&limit=N]  → file download (capped, newest first)
// DELETE { collection, olderThanDays?: number, all?: true } → { ok, deleted, more }
//   Deletes in batches of ≤ 450 and stops after MAX_PER_REQUEST docs; when
//   `more` is true the client should call again until it is false.
// POST { action: "resetAdStats" }       → { ok, reset } (zeroes impressions/clicks/impByCountry on all ads)

const COLLECTIONS = {
  visits: "ts",
  visitors: "lastSeen",
  presence: "lastSeen",
  tests: "ts",
  messages: "ts",
} as const;
type Coll = keyof typeof COLLECTIONS;

const BATCH = 450;
const MAX_PER_REQUEST = 2250; // 5 batches, keeps each request well under timeouts
const EXPORT_DEFAULT = 5000;
const EXPORT_MAX = 20000;

const isColl = (c: unknown): c is Coll => typeof c === "string" && c in COLLECTIONS;
const fail = (error: string, status = 200) => Response.json({ ok: false, error }, { status });

async function count(q: Query): Promise<number> {
  const snap = await q.count().get();
  return snap.data().count;
}

export async function GET(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return fail("Firebase not configured");
  const db = adminDb();
  const url = new URL(request.url);
  const exp = url.searchParams.get("export");

  try {
    // Preview: how many docs a delete would remove.
    const preview = url.searchParams.get("collection");
    if (preview) {
      if (!isColl(preview)) return fail("Unknown collection", 400);
      const days = Number(url.searchParams.get("olderThanDays"));
      let q: Query = db.collection(preview);
      if (Number.isFinite(days) && days > 0) q = q.where(COLLECTIONS[preview], "<", Timestamp.fromMillis(Date.now() - days * 86_400_000));
      return Response.json({ ok: true, count: await count(q) });
    }
    if (exp) return await exportCollection(exp, url.searchParams.get("format") === "csv" ? "csv" : "json", Number(url.searchParams.get("limit")) || EXPORT_DEFAULT);

    const names = Object.keys(COLLECTIONS) as Coll[];
    const [counts, adsSnap] = await Promise.all([
      Promise.all(names.map((n) => count(db.collection(n)))),
      db.collection("ads").select("impressions", "clicks").get(),
    ]);
    let impressions = 0;
    let clicks = 0;
    adsSnap.forEach((d) => {
      impressions += Number(d.get("impressions")) || 0;
      clicks += Number(d.get("clicks")) || 0;
    });
    return Response.json({
      ok: true,
      counts: { ...Object.fromEntries(names.map((n, i) => [n, counts[i]])), ads: adsSnap.size },
      adStats: { impressions, clicks },
    });
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Failed to load counts");
  }
}

/* ---------------------------------- export --------------------------------- */

function plain(v: unknown): unknown {
  if (v instanceof Timestamp) return v.toDate().toISOString();
  if (Array.isArray(v)) return v.map(plain);
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v as Record<string, unknown>).map(([k, x]) => [k, plain(x)]));
  return v;
}

function csvCell(v: unknown): string {
  if (v == null) return "";
  const s = typeof v === "object" ? JSON.stringify(v) : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

async function exportCollection(name: string, format: "json" | "csv", limitRaw: number) {
  if (!isColl(name)) return fail("Unknown collection", 400);
  const limit = Math.min(EXPORT_MAX, Math.max(1, Math.floor(limitRaw)));
  const snap = await adminDb().collection(name).orderBy(COLLECTIONS[name], "desc").limit(limit).get();
  const rows = snap.docs.map((d) => ({ id: d.id, ...(plain(d.data()) as Record<string, unknown>) }));
  const stamp = new Date().toISOString().slice(0, 10);
  const filename = `${name}-${stamp}.${format}`;

  let body: string;
  if (format === "csv") {
    const cols: string[] = [];
    for (const r of rows) for (const k of Object.keys(r)) if (!cols.includes(k)) cols.push(k);
    body = [cols.join(","), ...rows.map((r) => cols.map((c) => csvCell((r as Record<string, unknown>)[c])).join(","))].join("\n");
  } else {
    body = JSON.stringify(rows, null, 2);
  }
  return new Response(body, {
    headers: {
      "Content-Type": format === "csv" ? "text/csv; charset=utf-8" : "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
      "X-Export-Rows": String(rows.length),
    },
  });
}

/* ---------------------------------- delete --------------------------------- */

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return fail("Firebase not configured");

  let b: { collection?: unknown; olderThanDays?: unknown; all?: unknown };
  try {
    b = await request.json();
  } catch {
    return fail("Invalid body", 400);
  }
  if (!isColl(b.collection)) return fail("Unknown collection", 400);
  const days = Number(b.olderThanDays);
  const all = b.all === true;
  if (!all && !(Number.isFinite(days) && days > 0)) return fail("Pass olderThanDays (> 0) or all: true", 400);

  const db = adminDb();
  let q: Query = db.collection(b.collection);
  if (!all) {
    const cutoff = Timestamp.fromMillis(Date.now() - days * 86_400_000);
    q = q.where(COLLECTIONS[b.collection], "<", cutoff);
  }

  let deleted = 0;
  try {
    while (deleted < MAX_PER_REQUEST) {
      const snap = await q.select().limit(Math.min(BATCH, MAX_PER_REQUEST - deleted)).get();
      if (snap.empty) return Response.json({ ok: true, deleted, more: false });
      const batch = db.batch();
      snap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
      deleted += snap.size;
      if (snap.size < BATCH && deleted < MAX_PER_REQUEST) return Response.json({ ok: true, deleted, more: false });
    }
    // Hit the per-request cap: tell the client whether anything is left.
    const left = await q.select().limit(1).get();
    return Response.json({ ok: true, deleted, more: !left.empty });
  } catch (err) {
    return Response.json({ ok: false, error: err instanceof Error ? err.message : "Delete failed", deleted }, { status: 200 });
  }
}

/* ------------------------------ reset ad stats ------------------------------ */

export async function POST(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return fail("Firebase not configured");
  let b: { action?: unknown };
  try {
    b = await request.json();
  } catch {
    return fail("Invalid body", 400);
  }
  if (b.action !== "resetAdStats") return fail("Unknown action", 400);

  try {
    const db = adminDb();
    const snap = await db.collection("ads").select().get();
    for (let i = 0; i < snap.docs.length; i += BATCH) {
      const batch = db.batch();
      // A map value in update() replaces the whole field, wiping every country key.
      snap.docs.slice(i, i + BATCH).forEach((d) => batch.update(d.ref, { impressions: 0, clicks: 0, impByCountry: {} }));
      await batch.commit();
    }
    return Response.json({ ok: true, reset: snap.size });
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Reset failed");
  }
}
