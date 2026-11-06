// Server-side helpers shared by the admin posts API routes (sanitising the
// editor payload and keeping slugs unique). Imported only from route handlers.
import { adminDb } from "@/lib/firebaseAdmin";
import { slugify } from "@/lib/posts";

export type PostFaq = { q: string; a: string };

const str = (v: unknown, max = 100_000) => String(v ?? "").trim().slice(0, max);
const strList = (v: unknown) =>
  (Array.isArray(v) ? v : typeof v === "string" ? v.split(",") : [])
    .map((x) => String(x).trim())
    .filter(Boolean)
    .slice(0, 30);

/** Editable fields of a post, sanitised. Only keys present in `b` are returned when `partial`. */
export function postFields(b: Record<string, unknown>, partial = false): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const has = (k: string) => !partial || k in b;
  if (has("title")) out.title = str(b.title, 300);
  if (has("excerpt")) out.excerpt = str(b.excerpt, 1000);
  if (has("content")) out.content = String(b.content ?? "");
  if (has("coverImage")) out.coverImage = str(b.coverImage, 2000);
  if (has("coverAlt")) out.coverAlt = str(b.coverAlt, 300);
  if (has("tags")) out.tags = strList(b.tags);
  if (has("status")) out.status = b.status === "published" ? "published" : "draft";
  if (has("seoTitle")) out.seoTitle = str(b.seoTitle, 300);
  if (has("description")) out.description = str(b.description, 1000);
  if (has("category")) out.category = str(b.category, 100);
  if (has("keywords")) out.keywords = strList(b.keywords);
  if (has("faq"))
    out.faq = (Array.isArray(b.faq) ? b.faq : [])
      .map((f) => ({ q: str((f as PostFaq)?.q, 500), a: str((f as PostFaq)?.a, 5000) }))
      .filter((f) => f.q && f.a)
      .slice(0, 30);
  return out;
}

/** Returns `base` or `base-2`, `base-3`… so no two admin posts share a slug. */
export async function uniqueSlug(base: string, exceptId?: string): Promise<string> {
  const root = slugify(base) || "post";
  const col = adminDb().collection("posts");
  for (let n = 1; n < 50; n++) {
    const candidate = n === 1 ? root : `${root.slice(0, 76)}-${n}`;
    const snap = await col.where("slug", "==", candidate).limit(2).get();
    if (snap.docs.every((d) => d.id === exceptId)) return candidate;
  }
  return `${root.slice(0, 70)}-${Date.now().toString(36)}`;
}
