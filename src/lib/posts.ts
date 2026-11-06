import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { adminDb, adminConfigured } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/i18n/config";

export type PostFaq = { q: string; a: string };

export type Post = {
  id: string;
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverAlt: string;
  category: string;
  tags: string[];
  keywords: string[];
  faq: PostFaq[];
  status: "draft" | "published";
  createdAt: number;
  updatedAt: number;
  readingMinutes: number;
  source: "file" | "admin";
  rank: number; // higher shows first among posts published the same day
  locale: Locale;
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

export function readingMinutes(markdown: string): number {
  const words = markdown.replace(/[#*_>`|[\]()-]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function toPost(id: string, x: FirebaseFirestore.DocumentData): Post {
  const content = x.content || "";
  return {
    id,
    slug: x.slug || "",
    title: x.title || "",
    seoTitle: x.seoTitle || "",
    description: x.description || x.excerpt || "",
    excerpt: x.excerpt || "",
    content,
    coverImage: x.coverImage || "",
    coverAlt: x.coverAlt || x.title || "",
    category: x.category || (Array.isArray(x.tags) && x.tags[0]) || "Guides",
    tags: Array.isArray(x.tags) ? x.tags : [],
    keywords: Array.isArray(x.keywords) ? x.keywords : [],
    faq: Array.isArray(x.faq) ? x.faq : [],
    status: x.status === "published" ? "published" : "draft",
    createdAt: ms(x.createdAt),
    updatedAt: ms(x.updatedAt),
    readingMinutes: readingMinutes(content),
    source: "admin",
    rank: 0,
    locale: DEFAULT_LOCALE,
  };
}

// ---- Articles stored as Markdown files in src/content/blog/<locale>/<slug>.md ----
// The same slug is used in every language so translations link to each other.

const CONTENT_ROOT = path.join(process.cwd(), "src", "content", "blog");
const fileCache = new Map<Locale, Post[]>();

function loadFilePosts(locale: Locale): Post[] {
  const cached = fileCache.get(locale);
  if (cached && process.env.NODE_ENV === "production") return cached;
  const dir = path.join(CONTENT_ROOT, locale);
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
  const posts: Post[] = [];
  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      const slug = file.replace(/\.md$/, "");
      const date = Date.parse(data.date || "") || 0;
      const updated = Date.parse(data.updated || "") || date;
      // Covers are generated for every language by scripts/generate-covers.mjs.
      // (public/ isn't on the server filesystem in production, so don't check for the file.)
      const localizedCover = locale !== DEFAULT_LOCALE;
      posts.push({
        id: `file:${locale}:${slug}`,
        slug,
        title: data.title || slug,
        seoTitle: data.seoTitle || "",
        description: data.description || data.excerpt || "",
        excerpt: data.excerpt || "",
        content,
        coverImage: data.cover || (localizedCover ? `/blog/${locale}/${slug}.svg` : `/blog/${slug}.svg`),
        coverAlt: data.coverAlt || data.title || "",
        category: data.category || "Guides",
        tags: Array.isArray(data.tags) ? data.tags : [],
        keywords: Array.isArray(data.keywords) ? data.keywords : [],
        faq: Array.isArray(data.faq) ? data.faq.filter((f: PostFaq) => f && f.q && f.a) : [],
        status: data.draft ? "draft" : "published",
        createdAt: date,
        updatedAt: updated,
        readingMinutes: readingMinutes(content),
        source: "file",
        rank: Number(data.rank) || 0,
        locale,
      });
    } catch {
      /* skip a broken file instead of breaking the blog */
    }
  }
  fileCache.set(locale, posts);
  return posts;
}

/** Languages a given article exists in (for hreflang + the language switcher). */
export function postLocales(slug: string): Locale[] {
  return LOCALES.filter((l) => loadFilePosts(l).some((p) => p.slug === slug && p.status === "published"));
}

async function loadAdminPosts(): Promise<Post[]> {
  if (!adminConfigured) return [];
  try {
    const snap = await adminDb()
      .collection("posts")
      .where("status", "==", "published")
      .limit(200)
      .get();
    return snap.docs.map((d) => toPost(d.id, d.data()));
  } catch {
    return [];
  }
}

// Admin posts win when both sources use the same slug.
// Posts written in the admin panel are English-only.
export async function getPublishedPosts(locale: Locale = DEFAULT_LOCALE): Promise<Post[]> {
  const admin = locale === DEFAULT_LOCALE ? await loadAdminPosts() : [];
  const taken = new Set(admin.map((p) => p.slug));
  const files = loadFilePosts(locale).filter((p) => p.status === "published" && !taken.has(p.slug));
  return [...admin, ...files].sort(
    (a, b) =>
      new Date(b.createdAt).setHours(0, 0, 0, 0) - new Date(a.createdAt).setHours(0, 0, 0, 0) ||
      b.rank - a.rank ||
      b.createdAt - a.createdAt ||
      a.title.localeCompare(b.title),
  );
}

export async function getPostBySlug(slug: string, locale: Locale = DEFAULT_LOCALE): Promise<Post | null> {
  if (locale !== DEFAULT_LOCALE) return loadFilePosts(locale).find((p) => p.slug === slug) || null;
  if (adminConfigured) {
    try {
      const snap = await adminDb().collection("posts").where("slug", "==", slug).limit(1).get();
      if (!snap.empty) return toPost(snap.docs[0].id, snap.docs[0].data());
    } catch {
      /* fall through to files */
    }
  }
  return loadFilePosts(DEFAULT_LOCALE).find((p) => p.slug === slug) || null;
}

export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
  const all = (await getPublishedPosts(post.locale)).filter((p) => p.slug !== post.slug);
  const tags = new Set(post.tags.map((t) => t.toLowerCase()));
  const score = (p: Post) =>
    (p.category === post.category ? 3 : 0) + p.tags.filter((t) => tags.has(t.toLowerCase())).length;
  return all
    .map((p) => ({ p, s: score(p) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.p);
}
