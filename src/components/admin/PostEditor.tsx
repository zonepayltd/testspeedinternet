"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Trash2, Loader2, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

type Form = {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  tags: string;
  content: string;
  status: "draft" | "published";
};

const EMPTY: Form = {
  title: "",
  slug: "",
  excerpt: "",
  coverImage: "",
  tags: "",
  content: "",
  status: "draft",
};

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);

export default function PostEditor({ postId }: { postId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<Form>(EMPTY);
  const [loading, setLoading] = useState(Boolean(postId));
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;
    fetch(`/api/admin/posts/${postId}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          const p = d.post;
          setForm({
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt,
            coverImage: p.coverImage,
            tags: (p.tags || []).join(", "),
            content: p.content,
            status: p.status,
          });
          setSlugTouched(true);
        } else setError(d.error || "Could not load post");
      })
      .finally(() => setLoading(false));
  }, [postId]);

  const set = (k: keyof Form, v: string) =>
    setForm((f) => ({
      ...f,
      [k]: v,
      ...(k === "title" && !slugTouched ? { slug: slugify(v) } : {}),
    }));

  const save = async (status?: "draft" | "published") => {
    setError(null);
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      status: status || form.status,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      const res = await fetch(postId ? `/api/admin/posts/${postId}` : "/api/admin/posts", {
        method: postId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Save failed");
        setSaving(false);
        return;
      }
      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Network error");
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!postId || !confirm("Delete this post permanently?")) return;
    await fetch(`/api/admin/posts/${postId}`, { method: "DELETE" });
    router.push("/admin/blog");
    router.refresh();
  };

  if (loading) return <p className="text-sm text-slate-400">Loading…</p>;

  const input =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30";

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
          <ArrowLeft className="h-4 w-4" /> Back to posts
        </Link>
        {postId && form.status === "published" && form.slug && (
          <Link href={`/blog/${form.slug}`} target="_blank" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700">
            View live <ExternalLink className="h-4 w-4" />
          </Link>
        )}
      </div>

      <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
        {postId ? "Edit post" : "New post"}
      </h1>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">Title</span>
          <input className={input} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="How to fix slow WiFi" />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">Slug (URL)</span>
          <input
            className={`${input} font-mono`}
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", e.target.value);
            }}
            placeholder="how-to-fix-slow-wifi"
          />
          <span className="mt-1 block text-xs text-slate-400">/blog/{form.slug || "…"}</span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">Excerpt</span>
          <textarea className={`${input} resize-y`} rows={2} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="Short summary shown in listings and search results." />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Cover image URL</span>
            <input className={input} value={form.coverImage} onChange={(e) => set("coverImage", e.target.value)} placeholder="https://…" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Tags (comma separated)</span>
            <input className={input} value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="wifi, speed, tips" />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">Content (Markdown)</span>
          <textarea
            className={`${input} resize-y font-mono`}
            rows={16}
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            placeholder={"## Heading\n\nWrite your article in **Markdown**…"}
          />
        </label>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-5">
        <button
          onClick={() => save("published")}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Publish
        </button>
        <button
          onClick={() => save("draft")}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          Save draft
        </button>
        {postId && (
          <button
            onClick={remove}
            className="ml-auto inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        )}
      </div>
    </div>
  );
}
