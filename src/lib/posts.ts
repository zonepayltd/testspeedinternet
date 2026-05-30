import "server-only";
import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  status: "draft" | "published";
  createdAt: number;
  updatedAt: number;
};

const ms = (t?: Timestamp) => (t ? t.toMillis() : 0);

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function toPost(id: string, x: FirebaseFirestore.DocumentData): Post {
  return {
    id,
    slug: x.slug || "",
    title: x.title || "",
    excerpt: x.excerpt || "",
    content: x.content || "",
    coverImage: x.coverImage || "",
    tags: Array.isArray(x.tags) ? x.tags : [],
    status: x.status === "published" ? "published" : "draft",
    createdAt: ms(x.createdAt),
    updatedAt: ms(x.updatedAt),
  };
}

export async function getPublishedPosts(): Promise<Post[]> {
  if (!adminConfigured) return [];
  try {
    const snap = await adminDb()
      .collection("posts")
      .where("status", "==", "published")
      .limit(100)
      .get();
    return snap.docs
      .map((d) => toPost(d.id, d.data()))
      .sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!adminConfigured) return null;
  try {
    const snap = await adminDb().collection("posts").where("slug", "==", slug).limit(1).get();
    if (snap.empty) return null;
    return toPost(snap.docs[0].id, snap.docs[0].data());
  } catch {
    return null;
  }
}
