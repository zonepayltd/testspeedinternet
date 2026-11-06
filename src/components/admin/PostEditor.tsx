"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, Clock, ExternalLink, FileText, Globe, Image as ImageIcon, Link2, RefreshCw, Save, Search, Send, Tag, Trash2, Type } from "lucide-react";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import { Badge, Button, Card, EmptyState, Segmented, Skeleton, api, fmtDateTime, fmtNum, inputCls, timeAgo, useAdminUI } from "@/components/admin/ui";
import { FaqEditor, Field, SeoPreview, TagInput, type Faq } from "@/components/admin/blog/EditorParts";
import { CoverThumb, slugify, wordCount, type PostStatus } from "@/components/admin/blog/shared";

const SITE = "https://www.testspeedinternet.com";

type Form = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverAlt: string;
  tags: string[];
  status: PostStatus;
  seoTitle: string;
  description: string;
  category: string;
  keywords: string[];
  faq: Faq[];
};

const EMPTY: Form = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  coverAlt: "",
  tags: [],
  status: "draft",
  seoTitle: "",
  description: "",
  category: "",
  keywords: [],
  faq: [],
};

type Loaded = Form & { id: string; createdAt: number; updatedAt: number };

export default function PostEditor({ postId }: { postId?: string }) {
  const router = useRouter();
  const { confirm, toast } = useAdminUI();
  const [form, setForm] = useState<Form>(EMPTY);
  const [saved, setSaved] = useState<string>(JSON.stringify(EMPTY));
  const [meta, setMeta] = useState<{ createdAt: number; updatedAt: number } | null>(null);
  const [loading, setLoading] = useState(Boolean(postId));
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState<null | PostStatus>(null);
  const [slugAuto, setSlugAuto] = useState(!postId);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    setLoadError(null);
    try {
      const d = await api<{ post: Loaded }>(`/api/admin/posts/${postId}`);
      const p = d.post;
      const f: Form = {
        title: p.title || "",
        slug: p.slug || "",
        excerpt: p.excerpt || "",
        content: p.content || "",
        coverImage: p.coverImage || "",
        coverAlt: p.coverAlt || "",
        tags: p.tags || [],
        status: p.status === "published" ? "published" : "draft",
        seoTitle: p.seoTitle || "",
        description: p.description || "",
        category: p.category || "",
        keywords: p.keywords || [],
        faq: p.faq || [],
      };
      setForm(f);
      setSaved(JSON.stringify(f));
      setMeta({ createdAt: p.createdAt, updatedAt: p.updatedAt });
      setSlugAuto(false);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Could not load post");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    load();
  }, [load]);

  const dirty = JSON.stringify(form) !== saved;

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((f) => ({ ...f, [k]: v, ...(k === "title" && slugAuto ? { slug: slugify(String(v)) } : {}) }));

  const words = useMemo(() => wordCount(form.content), [form.content]);
  const minutes = Math.max(1, Math.round(words / 220));

  const save = async (status: PostStatus = form.status) => {
    setError(null);
    if (!form.title.trim()) {
      setError("Please add a title before saving.");
      return;
    }
    setSaving(status);
    const payload = { ...form, status, slug: form.slug || slugify(form.title), faq: form.faq.filter((f) => f.q.trim() && f.a.trim()) };
    try {
      const d = await api<{ id: string; slug: string }>(postId ? `/api/admin/posts/${postId}` : "/api/admin/posts", { method: postId ? "PUT" : "POST", json: payload });
      const next = { ...payload, slug: d.slug || payload.slug };
      setForm(next);
      setSaved(JSON.stringify(next));
      setMeta((m) => ({ createdAt: m?.createdAt || Date.now(), updatedAt: Date.now() }));
      setSlugAuto(false);
      toast(status === "published" ? (form.status === "published" ? "Changes published" : "Post published") : "Draft saved");
      if (d.slug && d.slug !== payload.slug) toast(`Slug was taken — saved as “${d.slug}”`, "info");
      if (!postId) router.replace(`/admin/blog/${d.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(null);
    }
  };

  // ⌘/Ctrl+S saves with the current status.
  const saveRef = useRef(save);
  saveRef.current = save;
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveRef.current();
      }
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  const remove = async () => {
    if (!postId) return;
    const ok = await confirm({
      title: "Delete this post?",
      message: `“${form.title || "Untitled"}” will be permanently deleted${form.status === "published" ? " and removed from the blog" : ""}.`,
      confirmLabel: "Delete post",
    });
    if (!ok) return;
    try {
      await api(`/api/admin/posts/${postId}`, { method: "DELETE" });
      setSaved(JSON.stringify(form));
      toast("Post deleted");
      router.push("/admin/blog");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed", "error");
    }
  };

  const goBack = async () => {
    if (dirty && !(await confirm({ title: "Discard unsaved changes?", message: "You have changes that haven’t been saved yet.", confirmLabel: "Discard" }))) return;
    router.push("/admin/blog");
  };

  if (loading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Skeleton className="h-[32rem] w-full !rounded-2xl" />
          <Skeleton className="h-[32rem] w-full !rounded-2xl" />
        </div>
      </div>
    );

  if (loadError)
    return (
      <Card>
        <EmptyState
          icon={AlertTriangle}
          title="Couldn’t load this post"
          description={loadError}
          action={
            <div className="flex gap-2">
              <Button icon={ArrowLeft} onClick={() => router.push("/admin/blog")}>
                All posts
              </Button>
              <Button variant="primary" icon={RefreshCw} onClick={load}>
                Try again
              </Button>
            </div>
          }
        />
      </Card>
    );

  const published = form.status === "published";
  const isLive = Boolean(postId) && JSON.parse(saved).status === "published";
  const url = `${SITE}/blog/${form.slug || "your-post"}`;
  const seoTitle = form.seoTitle || `${form.title || "Your article title"} | TestSpeedInternet`;
  const seoDesc = form.description || form.excerpt;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <button type="button" onClick={goBack} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All posts
          </button>
          <div className="mt-2 flex flex-wrap items-center gap-2.5">
            <h1 className="truncate text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{postId ? "Edit post" : "New post"}</h1>
            <Badge tone={isLive ? "green" : "amber"}>{isLive ? "Published" : "Draft"}</Badge>
            <span className={`text-xs ${dirty ? "font-medium text-amber-600 dark:text-amber-400" : "text-slate-400 dark:text-slate-500"}`}>
              {dirty ? "● Unsaved changes" : meta ? `Saved ${timeAgo(meta.updatedAt)}` : ""}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {postId && <Button variant="danger-ghost" icon={Trash2} onClick={remove}>Delete</Button>}
          {isLive && form.slug && (
            <a
              href={`/blog/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" /> View
            </a>
          )}
          <Button icon={Save} onClick={() => save("draft")} loading={saving === "draft"} disabled={saving !== null}>
            {isLive ? "Unpublish" : "Save draft"}
          </Button>
          <Button variant="primary" icon={Send} onClick={() => save("published")} loading={saving === "published"} disabled={saving !== null}>
            {isLive ? "Update" : "Publish"}
          </Button>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-5 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300">
          <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" /> {error}
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* ---------------- Main column ---------------- */}
        <div className="min-w-0 space-y-6">
          <Card bodyClassName="p-5 space-y-5">
            <Field label="Title" htmlFor="pe-title" count={form.title.length} max={70}>
              <input
                id="pe-title"
                className={`${inputCls} !h-11 text-lg font-semibold`}
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="How to fix slow WiFi at home"
                autoFocus={!postId}
              />
            </Field>

            <Field
              label="URL slug"
              htmlFor="pe-slug"
              hint={slugAuto ? "Generated from the title — edit it to customise." : "Lowercase letters, numbers and dashes. Changing it breaks existing links."}
            >
              <div className="flex items-stretch overflow-hidden rounded-lg border border-slate-200 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10 dark:border-white/10">
                <span className="hidden items-center border-e border-slate-200 bg-slate-50 px-3 text-xs text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400 sm:flex">
                  testspeedinternet.com/blog/
                </span>
                <input
                  id="pe-slug"
                  className="h-9 min-w-0 flex-1 border-0 bg-white px-3 font-mono text-sm text-slate-900 focus:outline-none focus:ring-0 dark:bg-white/[0.04] dark:text-white"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugAuto(false);
                    set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
                  }}
                  onBlur={() => set("slug", slugify(form.slug))}
                  placeholder="how-to-fix-slow-wifi"
                />
                <button
                  type="button"
                  title="Regenerate from title"
                  aria-label="Regenerate slug from title"
                  onClick={() => {
                    setSlugAuto(true);
                    setForm((f) => ({ ...f, slug: slugify(f.title) }));
                  }}
                  className="flex items-center border-s border-slate-200 px-2.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700 dark:border-white/10 dark:hover:bg-white/[0.06] dark:hover:text-white"
                >
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </Field>

            <Field label="Excerpt" htmlFor="pe-excerpt" count={form.excerpt.length} max={200} hint="Shown on the blog card and used as the meta description if you don’t set one.">
              <textarea
                id="pe-excerpt"
                className={`${inputCls} !h-auto resize-y py-2`}
                rows={2}
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                placeholder="A one or two sentence summary of the article."
              />
            </Field>
          </Card>

          <div>
            <MarkdownEditor
              value={form.content}
              onChange={(v) => set("content", v)}
              footer={
                <>
                  <span className="inline-flex items-center gap-1.5 tabular-nums">
                    <Type className="h-3.5 w-3.5" aria-hidden="true" /> {fmtNum(words)} words
                  </span>
                  <span className="inline-flex items-center gap-1.5 tabular-nums">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {minutes} min read
                  </span>
                  <span className="tabular-nums">{fmtNum(form.content.length)} characters</span>
                  <span className="ms-auto hidden sm:inline">Markdown · ⌘S to save</span>
                </>
              }
            />
          </div>

          <Card title="FAQ" icon={FileText} description="Optional questions shown at the end of the article (and as FAQ rich results).">
            <FaqEditor value={form.faq} onChange={(v) => set("faq", v)} />
          </Card>
        </div>

        {/* ---------------- Sidebar ---------------- */}
        <aside className="min-w-0 space-y-6">
          <Card title="Publishing" icon={Globe}>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Status</span>
                <Segmented<PostStatus>
                  value={form.status}
                  onChange={(v) => set("status", v)}
                  options={[
                    { value: "draft", label: "Draft" },
                    { value: "published", label: "Published" },
                  ]}
                />
              </div>
              <dl className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-white/[0.03]">
                  <dt className="text-slate-400 dark:text-slate-500">Words</dt>
                  <dd className="mt-0.5 text-sm font-semibold tabular-nums text-slate-900 dark:text-white">{fmtNum(words)}</dd>
                </div>
                <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-white/[0.03]">
                  <dt className="text-slate-400 dark:text-slate-500">Reading time</dt>
                  <dd className="mt-0.5 text-sm font-semibold tabular-nums text-slate-900 dark:text-white">{minutes} min</dd>
                </div>
                <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-white/[0.03]">
                  <dt className="text-slate-400 dark:text-slate-500">Created</dt>
                  <dd className="mt-0.5 font-medium tabular-nums text-slate-700 dark:text-slate-200">{meta ? fmtDateTime(meta.createdAt) : "Not saved yet"}</dd>
                </div>
                <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-white/[0.03]">
                  <dt className="text-slate-400 dark:text-slate-500">Updated</dt>
                  <dd className="mt-0.5 font-medium tabular-nums text-slate-700 dark:text-slate-200">{meta ? fmtDateTime(meta.updatedAt) : "—"}</dd>
                </div>
              </dl>
              <Button variant="primary" className="w-full" icon={published ? Send : Save} onClick={() => save()} loading={saving !== null} disabled={saving !== null}>
                {published ? (isLive ? "Save & keep published" : "Save & publish") : isLive ? "Save as draft (unpublish)" : "Save draft"}
              </Button>
            </div>
          </Card>

          <Card title="Cover image" icon={ImageIcon}>
            <div className="space-y-3">
              {form.coverImage ? (
                <CoverThumb src={form.coverImage} alt={form.coverAlt} className="aspect-[1200/630] w-full" />
              ) : (
                <div className="flex aspect-[1200/630] w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-slate-200 text-xs text-slate-400 dark:border-white/10">
                  <ImageIcon className="h-5 w-5" aria-hidden="true" />
                  1200 × 630 recommended
                </div>
              )}
              <Field label="Image URL" htmlFor="pe-cover">
                <input id="pe-cover" className={inputCls} value={form.coverImage} onChange={(e) => set("coverImage", e.target.value.trim())} placeholder="https://… or /blog/image.jpg" />
              </Field>
              <Field label="Alt text" htmlFor="pe-alt">
                <input id="pe-alt" className={inputCls} value={form.coverAlt} onChange={(e) => set("coverAlt", e.target.value)} placeholder="Describe the image" />
              </Field>
            </div>
          </Card>

          <Card title="Organisation" icon={Tag}>
            <div className="space-y-4">
              <Field label="Category" htmlFor="pe-cat" hint="Defaults to the first tag, or “Guides”.">
                <input id="pe-cat" className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="Guides" list="pe-cat-list" />
                <datalist id="pe-cat-list">
                  {["Guides", "Speed test", "WiFi", "ISPs", "Gaming", "Streaming", "Security", "News"].map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </Field>
              <Field label="Tags" htmlFor="pe-tags" hint="Press Enter or comma to add.">
                <TagInput id="pe-tags" value={form.tags} onChange={(v) => set("tags", v)} placeholder="wifi, speed, router…" />
              </Field>
            </div>
          </Card>

          <Card title="SEO" icon={Search} description="How the article appears on Google.">
            <div className="space-y-4">
              <SeoPreview title={seoTitle} description={seoDesc} url={url} />
              <Field label="SEO title" htmlFor="pe-seo-title" count={form.seoTitle.length} max={60} hint="Optional. Overrides the page title in search results.">
                <input id="pe-seo-title" className={inputCls} value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} placeholder={`${form.title || "Title"} | TestSpeedInternet`} />
              </Field>
              <Field label="Meta description" htmlFor="pe-desc" count={form.description.length} max={160} hint="Optional. Falls back to the excerpt.">
                <textarea id="pe-desc" className={`${inputCls} !h-auto resize-y py-2`} rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder={form.excerpt || "Summarise the article in ~150 characters."} />
              </Field>
              <Field label="Keywords" htmlFor="pe-kw" hint="Falls back to tags.">
                <TagInput id="pe-kw" value={form.keywords} onChange={(v) => set("keywords", v)} placeholder="internet speed test…" />
              </Field>
              <p className="flex items-center gap-1.5 truncate text-xs text-slate-400 dark:text-slate-500">
                <Link2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {url}
              </p>
            </div>
          </Card>

          {postId && (
            <p className="text-center text-xs text-slate-400 dark:text-slate-500">
              <Link href="/admin/blog" className="hover:text-slate-700 dark:hover:text-slate-300">
                ← Back to all posts
              </Link>
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
