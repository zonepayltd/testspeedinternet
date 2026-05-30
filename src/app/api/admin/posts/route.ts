import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { requireAdmin, unauthorized } from "@/lib/requireAdmin";
import { slugify } from "@/lib/posts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ms = (t?: Timestamp) => (t ? t.toMillis() : 0);

export async function GET() {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, posts: [] }, { status: 200 });

  try {
    const snap = await adminDb().collection("posts").orderBy("updatedAt", "desc").limit(200).get();
    const posts = snap.docs.map((d) => {
      const x = d.data();
      return {
        id: d.id,
        slug: x.slug || "",
        title: x.title || "",
        excerpt: x.excerpt || "",
        status: x.status || "draft",
        tags: x.tags || [],
        updatedAt: ms(x.updatedAt),
      };
    });
    return Response.json({ ok: true, posts });
  } catch (err) {
    return Response.json({ ok: false, posts: [], error: String(err) }, { status: 200 });
  }
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return unauthorized();
  if (!adminConfigured) return Response.json({ ok: false, error: "Firebase not configured" }, { status: 200 });

  let b: Record<string, unknown>;
  try {
    b = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const title = String(b.title || "").trim();
  if (!title) return Response.json({ ok: false, error: "Title is required" }, { status: 400 });

  const slug = slugify(String(b.slug || title));
  const now = FieldValue.serverTimestamp();

  const doc = {
    title,
    slug,
    excerpt: String(b.excerpt || "").trim(),
    content: String(b.content || ""),
    coverImage: String(b.coverImage || "").trim(),
    tags: Array.isArray(b.tags) ? b.tags.map(String) : [],
    status: b.status === "published" ? "published" : "draft",
    createdAt: now,
    updatedAt: now,
  };

  const ref = await adminDb().collection("posts").add(doc);
  return Response.json({ ok: true, id: ref.id });
}
