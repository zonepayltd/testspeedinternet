import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";
import { postFields, uniqueSlug } from "@/components/admin/blog/postFields";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ms = (t?: Timestamp) => (t && typeof t.toMillis === "function" ? t.toMillis() : 0);
type Ctx = { params: Promise<{ id: string }> };
const notConfigured = () => Response.json({ ok: false, error: "Firebase not configured" }, { status: 200 });

async function readBody(request: Request): Promise<Record<string, unknown> | null> {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** GET /api/admin/posts/:id → { ok, post } */
export async function GET(_req: Request, ctx: Ctx) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return notConfigured();
  const { id } = await ctx.params;

  try {
    const doc = await adminDb().collection("posts").doc(id).get();
    if (!doc.exists) return Response.json({ ok: false, error: "Not found" }, { status: 404 });
    const x = doc.data()!;
    return Response.json({
      ok: true,
      post: {
        id: doc.id,
        slug: x.slug || "",
        title: x.title || "",
        excerpt: x.excerpt || "",
        content: x.content || "",
        coverImage: x.coverImage || "",
        coverAlt: x.coverAlt || "",
        tags: Array.isArray(x.tags) ? x.tags : [],
        status: x.status === "published" ? "published" : "draft",
        seoTitle: x.seoTitle || "",
        description: x.description || "",
        category: x.category || "",
        keywords: Array.isArray(x.keywords) ? x.keywords : [],
        faq: Array.isArray(x.faq) ? x.faq : [],
        createdAt: ms(x.createdAt),
        updatedAt: ms(x.updatedAt),
      },
    });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

async function save(request: Request, ctx: Ctx, partial: boolean) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return notConfigured();
  const { id } = await ctx.params;

  const b = await readBody(request);
  if (!b) return Response.json({ ok: false, error: "Invalid body" }, { status: 400 });

  const fields = postFields(b, partial);
  // Optional SEO/extra fields are only overwritten when the client sends them.
  for (const k of ["seoTitle", "description", "category", "keywords", "faq", "coverAlt"]) if (!(k in b)) delete fields[k];
  if ((!partial || "title" in b) && !fields.title) return Response.json({ ok: false, error: "Title is required" }, { status: 400 });

  try {
    const ref = adminDb().collection("posts").doc(id);
    const existing = await ref.get();
    if (!existing.exists) return Response.json({ ok: false, error: "Not found" }, { status: 404 });
    let slug: string | undefined;
    if (!partial || "slug" in b) slug = await uniqueSlug(String(b.slug || fields.title || existing.data()?.title || "post"), id);
    await ref.set({ ...fields, ...(slug ? { slug } : {}), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    return Response.json({ ok: true, id, slug: slug ?? existing.data()?.slug ?? "" });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

/** PUT /api/admin/posts/:id — full save from the editor. */
export function PUT(request: Request, ctx: Ctx) {
  return save(request, ctx, false);
}

/** PATCH /api/admin/posts/:id — partial update, e.g. { status: "published" }. */
export function PATCH(request: Request, ctx: Ctx) {
  return save(request, ctx, true);
}

/** DELETE /api/admin/posts/:id */
export async function DELETE(_req: Request, ctx: Ctx) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return notConfigured();
  const { id } = await ctx.params;
  try {
    await adminDb().collection("posts").doc(id).delete();
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
