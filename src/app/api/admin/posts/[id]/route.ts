import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";
import { slugify } from "@/lib/posts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ms = (t?: Timestamp) => (t ? t.toMillis() : 0);

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false }, { status: 200 });
  const { id } = await ctx.params;

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
      tags: x.tags || [],
      status: x.status || "draft",
      createdAt: ms(x.createdAt),
      updatedAt: ms(x.updatedAt),
    },
  });
}

export async function PUT(request: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false }, { status: 200 });
  const { id } = await ctx.params;

  let b: Record<string, unknown>;
  try {
    b = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const title = String(b.title || "").trim();
  if (!title) return Response.json({ ok: false, error: "Title is required" }, { status: 400 });

  await adminDb()
    .collection("posts")
    .doc(id)
    .set(
      {
        title,
        slug: slugify(String(b.slug || title)),
        excerpt: String(b.excerpt || "").trim(),
        content: String(b.content || ""),
        coverImage: String(b.coverImage || "").trim(),
        tags: Array.isArray(b.tags) ? b.tags.map(String) : [],
        status: b.status === "published" ? "published" : "draft",
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

  return Response.json({ ok: true });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false }, { status: 200 });
  const { id } = await ctx.params;
  await adminDb().collection("posts").doc(id).delete();
  return Response.json({ ok: true });
}
