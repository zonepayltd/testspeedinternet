"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, FileText, Pencil, Trash2 } from "lucide-react";

type PostRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  updatedAt: number;
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/posts", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => (d.ok ? setPosts(d.posts) : setError(d.error || "Could not load posts")))
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, []);

  const remove = async (id: string, title: string) => {
    if (!confirm(`Delete "${title || "this post"}" permanently?`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      const d = await res.json();
      if (d.ok) setPosts((p) => p.filter((x) => x.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Blog</h1>
          <p className="mt-1 text-sm text-slate-500">Write and manage your blog posts.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" /> New post
        </Link>
      </div>

      {loading && <p className="mt-6 text-sm text-slate-400">Loading…</p>}
      {error && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">{error}</div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <FileText className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">No posts yet.</p>
          <Link href="/admin/blog/new" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
            <Plus className="h-4 w-4" /> Write your first post
          </Link>
        </div>
      )}

      {posts.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/blog/${p.id}`} className="font-semibold text-slate-900 hover:text-brand-600">
                      {p.title || "(untitled)"}
                    </Link>
                    <div className="font-mono text-[11px] text-slate-400">/blog/{p.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        p.status === "published"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-slate-500 sm:table-cell">
                    {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/blog/${p.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Link>
                      <button
                        onClick={() => remove(p.id, p.title)}
                        disabled={deleting === p.id}
                        className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
