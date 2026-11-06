// Server-only helpers shared by the admin analytics / visitors / tests API routes.
import "server-only";
import type { Firestore, DocumentReference, Query, Timestamp } from "firebase-admin/firestore";

export const BATCH_MAX = 450;
export const DAY = 86_400_000;

export const ms = (t?: Timestamp | null) => (t && typeof t.toMillis === "function" ? t.toMillis() : 0);

export const ok = (data: Record<string, unknown> = {}) => Response.json({ ok: true, ...data });
export const fail = (err: unknown, status = 200) =>
  Response.json({ ok: false, error: err instanceof Error ? err.message : String(err || "Failed") }, { status });

/** Delete refs in chunks of ≤ 450 ops per batch. */
export async function deleteRefs(db: Firestore, refs: DocumentReference[]): Promise<number> {
  for (let i = 0; i < refs.length; i += BATCH_MAX) {
    const batch = db.batch();
    refs.slice(i, i + BATCH_MAX).forEach((r) => batch.delete(r));
    await batch.commit();
  }
  return refs.length;
}

/** Repeatedly delete everything a query matches (in ≤ 450-doc pages). */
export async function deleteQuery(db: Firestore, q: Query, maxRounds = 400): Promise<number> {
  let total = 0;
  for (let i = 0; i < maxRounds; i++) {
    const snap = await q.limit(BATCH_MAX).select().get();
    if (snap.empty) break;
    await deleteRefs(db, snap.docs.map((d) => d.ref));
    total += snap.size;
    if (snap.size < BATCH_MAX) break;
  }
  return total;
}

/** Delete a visitor and everything tied to them: page views, speed tests and presence. */
export async function deleteVisitorCascade(db: Firestore, id: string) {
  const visits = await deleteQuery(db, db.collection("visits").where("visitorId", "==", id));
  const tests = await deleteQuery(db, db.collection("tests").where("visitorId", "==", id));
  await deleteRefs(db, [db.collection("visitors").doc(id), db.collection("presence").doc(id)]);
  return { visits, tests };
}

export async function readJson<T = Record<string, unknown>>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    return {} as T;
  }
}

/** Resolve ?range=today|7d|30d|90d|all or ?from=YYYY-MM-DD&to=YYYY-MM-DD into [from, to) ms.
 *  `tz` = client's Date.getTimezoneOffset() (minutes) so "today" and day buckets match the admin's clock. */
export function resolveRange(sp: URLSearchParams, fallback = "30d") {
  const tz = Number(sp.get("tz")) || 0;
  const now = Date.now();
  // Start of the local day (in the admin's timezone) for a given instant.
  const startOfDay = (t: number) => {
    const local = t - tz * 60_000;
    return local - (((local % DAY) + DAY) % DAY) + tz * 60_000;
  };
  const fromStr = sp.get("from");
  const toStr = sp.get("to");
  let from: number;
  let to = now;
  let range = sp.get("range") || fallback;
  if (fromStr && /^\d{4}-\d{2}-\d{2}$/.test(fromStr)) {
    from = Date.parse(fromStr + "T00:00:00Z") + tz * 60_000;
    if (toStr && /^\d{4}-\d{2}-\d{2}$/.test(toStr)) to = Math.min(now, Date.parse(toStr + "T00:00:00Z") + tz * 60_000 + DAY);
    if (!(to > from)) to = from + DAY;
    range = "custom";
  } else if (range === "today") {
    from = startOfDay(now);
  } else if (range === "all") {
    from = 0;
  } else {
    const days = { "7d": 7, "30d": 30, "90d": 90 }[range] ?? 30;
    from = startOfDay(now) - (days - 1) * DAY;
  }
  return { from, to, tz, range, startOfDay };
}

export function csv(rows: (string | number | null | undefined)[][], filename: string) {
  const esc = (v: string | number | null | undefined) => {
    const s = v == null ? "" : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const body = "﻿" + rows.map((r) => r.map(esc).join(",")).join("\r\n");
  return new Response(body, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${filename}"` },
  });
}

export const LANGS = ["fr", "es", "ar", "ru"] as const;
/** Split "/fr/blog/x" → { lang: "fr", path: "/blog/x" }; English has no prefix. */
export function splitLang(path: string) {
  const m = /^\/(fr|es|ar|ru)(?=\/|$)/.exec(path || "/");
  if (!m) return { lang: "en", path: path || "/" };
  return { lang: m[1], path: path.slice(m[0].length) || "/" };
}

export const iso = (t: number) => (t ? new Date(t).toISOString() : "");
