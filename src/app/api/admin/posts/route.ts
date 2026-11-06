import fs from "node:fs";
import path from "node:path";
import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";
import { postFields, uniqueSlug } from "@/components/admin/blog/postFields";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ms = (t?: Timestamp) => (t && typeof t.toMillis === "function" ? t.toMillis() : 0);
const CHUNK = 450;

const ids = (v: unknown): string[] =>
  Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === "string" && x.length > 0 && x.length < 200))] : [];

async function readBody(request: Request): Promise<Record<string, unknown> | null> {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Count the Markdown articles shipped with the code (src/content/blog/<locale>/*.md). */
function builtinCounts(): { total: number; locales: Record<string, number> } {
  const root = path.join(process.cwd(), "src", "content", "blog");
  const locales: Record<string, number> = {};
  let total = 0;
  try {
    for (const loc of fs.readdirSync(root)) {
      try {
        const n = fs.readdirSync(path.join(root, loc)).filter((f) => f.endsWith(".md")).length;
        if (n) {
          locales[loc] = n;
          total += n;
        }
      } catch {
        /* not a directory */
      }
    }
  } catch {
    /* content folder not on disk (e.g. some serverless bundles) */
  }
  return { total, locales };
}

/** GET /api/admin/posts → { ok, posts, builtin: { total, locales } } */
export async function GET() {
  if (!(await requireAdmin())) return unauthorized();
  const builtin = builtinCounts();
  if (!adminConfigured) return Response.json({ ok: false, posts: [], builtin, error: "Firebase not configured" }, { status: 200 });

  try {
    const snap = await adminDb().collection("posts").orderBy("updatedAt", "desc").limit(300).get();
    const posts = snap.docs.map((d) => {
      const x = d.data();
      const content = String(x.content || "");
      return {
        id: d.id,
        slug: x.slug || "",
        title: x.title || "",
        excerpt: x.excerpt || "",
        coverImage: x.coverImage || "",
        category: x.category || "",
        status: x.status === "published" ? "published" : "draft",
        tags: Array.isArray(x.tags) ? x.tags : [],
        words: content.split(/\s+/).filter(Boolean).length,
        createdAt: ms(x.createdAt),
        updatedAt: ms(x.updatedAt),
      };
    });
    return Response.json({ ok: true, posts, builtin });
  } catch (err) {
    return Response.json({ ok: false, posts: [], builtin, error: String(err) }, { status: 200 });
  }
}

/**
 * POST /api/admin/posts
 *   { title, slug?, excerpt, content, coverImage, tags, status, seoTitle?, description?, category?, keywords?, faq? } → create
 *   { duplicateOf: id } → copy an existing post as a new draft
 * Returns { ok, id, slug }.
 */
export async function POST(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" }, { status: 200 });

  const b = await readBody(request);
  if (!b) return Response.json({ ok: false, error: "Invalid body" }, { status: 400 });
  const col = adminDb().collection("posts");
  const now = FieldValue.serverTimestamp();

  try {
    if (typeof b.duplicateOf === "string" && b.duplicateOf) {
      const src = await col.doc(b.duplicateOf).get();
      if (!src.exists) return Response.json({ ok: false, error: "Post not found" }, { status: 404 });
      const x = src.data()!;
      const title = `${x.title || "Untitled"} (copy)`;
      const slug = await uniqueSlug(`${x.slug || x.title || "post"}-copy`);
      const ref = await col.add({ ...x, title, slug, status: "draft", createdAt: now, updatedAt: now });
      return Response.json({ ok: true, id: ref.id, slug });
    }

    const fields = postFields(b);
    if (!fields.title) return Response.json({ ok: false, error: "Title is required" }, { status: 400 });
    const slug = await uniqueSlug(String(b.slug || fields.title));
    const ref = await col.add({ ...fields, slug, createdAt: now, updatedAt: now });
    return Response.json({ ok: true, id: ref.id, slug });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

/** PATCH /api/admin/posts { ids: string[], status: "draft"|"published" } — bulk publish / unpublish. */
export async function PATCH(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" }, { status: 200 });

  const b = await readBody(request);
  const list = ids(b?.ids);
  if (!b || !list.length || (b.status !== "draft" && b.status !== "published"))
    return Response.json({ ok: false, error: "Expected { ids, status }" }, { status: 400 });

  try {
    const db = adminDb();
    for (let i = 0; i < list.length; i += CHUNK) {
      const batch = db.batch();
      for (const id of list.slice(i, i + CHUNK)) batch.update(db.collection("posts").doc(id), { status: b.status, updatedAt: FieldValue.serverTimestamp() });
      await batch.commit();
    }
    return Response.json({ ok: true, updated: list.length });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

/** DELETE /api/admin/posts { ids: string[] } — bulk delete. */
export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" }, { status: 200 });

  const b = await readBody(request);
  const list = ids(b?.ids);
  if (!list.length) return Response.json({ ok: false, error: "No posts selected" }, { status: 400 });

  try {
    const db = adminDb();
    for (let i = 0; i < list.length; i += CHUNK) {
      const batch = db.batch();
      for (const id of list.slice(i, i + CHUNK)) batch.delete(db.collection("posts").doc(id));
      await batch.commit();
    }
    return Response.json({ ok: true, deleted: list.length });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
