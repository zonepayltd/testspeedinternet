"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, BookOpen, Copy, Eye, EyeOff, ExternalLink, FileText, Info, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  IconButton,
  PageHeader,
  Pagination,
  SearchInput,
  Segmented,
  Select,
  Skeleton,
  StatCard,
  TBody,
  THead,
  Table,
  Toggle,
  api,
  fmtDateTime,
  fmtNum,
  timeAgo,
  useAdminUI,
} from "@/components/admin/ui";
import { Checkbox } from "@/components/admin/inbox/MessageList";
import { CoverThumb, type Builtin, type PostRow, type PostStatus } from "@/components/admin/blog/shared";

const PER_PAGE = 15;
type StatusFilter = "all" | PostStatus;
type Sort = "updated" | "created" | "title";

export default function AdminBlogPage() {
  const router = useRouter();
  const { confirm, toast } = useAdminUI();
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [builtin, setBuiltin] = useState<Builtin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<Sort>("updated");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await api<{ posts: PostRow[]; builtin: Builtin }>("/api/admin/posts");
      setPosts(d.posts || []);
      setBuiltin(d.builtin || null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(
    () => ({ all: posts.length, published: posts.filter((p) => p.status === "published").length, draft: posts.filter((p) => p.status === "draft").length }),
    [posts]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = posts.filter(
      (p) => (status === "all" || p.status === status) && (!needle || `${p.title} ${p.slug} ${p.excerpt} ${p.tags.join(" ")} ${p.category}`.toLowerCase().includes(needle))
    );
    return list.sort((a, b) => (sort === "title" ? a.title.localeCompare(b.title) : sort === "created" ? b.createdAt - a.createdAt : b.updatedAt - a.updatedAt));
  }, [posts, q, status, sort]);

  useEffect(() => setPage(1), [q, status, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const rows = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const selIds = [...selected].filter((id) => posts.some((p) => p.id === id));
  const allRowsSelected = rows.length > 0 && rows.every((p) => selected.has(p.id));

  const toggleSel = (id: string, v: boolean) =>
    setSelected((s) => {
      const n = new Set(s);
      if (v) n.add(id);
      else n.delete(id);
      return n;
    });
  const toggleAll = (v: boolean) =>
    setSelected((s) => {
      const n = new Set(s);
      rows.forEach((p) => (v ? n.add(p.id) : n.delete(p.id)));
      return n;
    });

  /* ---------------------------------------------------------------- actions */

  const setPostStatus = async (ids: string[], next: PostStatus) => {
    const before = posts;
    setPosts((list) => list.map((p) => (ids.includes(p.id) ? { ...p, status: next, updatedAt: Date.now() } : p)));
    try {
      if (ids.length === 1) await api(`/api/admin/posts/${ids[0]}`, { method: "PATCH", json: { status: next } });
      else await api("/api/admin/posts", { method: "PATCH", json: { ids, status: next } });
      toast(ids.length === 1 ? (next === "published" ? "Post published" : "Post moved to drafts") : `${ids.length} posts ${next === "published" ? "published" : "unpublished"}`);
    } catch (e) {
      setPosts(before);
      toast(e instanceof Error ? e.message : "Update failed", "error");
    }
  };

  const duplicate = async (p: PostRow) => {
    setBusyId(p.id);
    try {
      const d = await api<{ id: string }>("/api/admin/posts", { method: "POST", json: { duplicateOf: p.id } });
      toast("Post duplicated as a draft");
      router.push(`/admin/blog/${d.id}`);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not duplicate", "error");
      setBusyId(null);
    }
  };

  const remove = async (ids: string[]) => {
    if (!ids.length) return;
    const one = ids.length === 1 ? posts.find((p) => p.id === ids[0]) : null;
    const ok = await confirm({
      title: one ? "Delete this post?" : `Delete ${ids.length} posts?`,
      message: one ? `“${one.title}” will be permanently deleted${one.status === "published" ? " and removed from the blog" : ""}.` : "The selected posts will be permanently deleted. Published ones disappear from the blog.",
      confirmLabel: "Delete",
    });
    if (!ok) return;
    const before = posts;
    setPosts((list) => list.filter((p) => !ids.includes(p.id)));
    setSelected((s) => new Set([...s].filter((id) => !ids.includes(id))));
    try {
      if (ids.length === 1) await api(`/api/admin/posts/${ids[0]}`, { method: "DELETE" });
      else await api("/api/admin/posts", { method: "DELETE", json: { ids } });
      toast(ids.length === 1 ? "Post deleted" : `${ids.length} posts deleted`);
    } catch (e) {
      setPosts(before);
      toast(e instanceof Error ? e.message : "Delete failed", "error");
    }
  };

  /* ----------------------------------------------------------------- render */

  const actions = (p: PostRow) => (
    <div className="flex justify-end gap-0.5">
      {p.status === "published" ? (
        <a
          href={`/blog/${p.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View on site"
          title="View on site"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-white"
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      ) : (
        <IconButton icon={ExternalLink} label="Drafts aren’t live — publish to view on the site" disabled />
      )}
      <Link
        href={`/admin/blog/${p.id}`}
        aria-label="Edit"
        title="Edit"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-white"
      >
        <Pencil className="h-4 w-4" aria-hidden="true" />
      </Link>
      <IconButton icon={Copy} label="Duplicate" onClick={() => duplicate(p)} disabled={busyId === p.id} />
      <IconButton icon={Trash2} label="Delete" variant="danger-ghost" onClick={() => remove([p.id])} />
    </div>
  );

  const langs = builtin ? Object.keys(builtin.locales).length : 0;

  return (
    <div>
      <PageHeader
        title="Blog"
        icon={FileText}
        description="Write, publish and manage articles created from the admin."
        actions={
          <>
            <Button icon={RefreshCw} onClick={load} disabled={loading}>
              Refresh
            </Button>
            <Link href="/admin/blog/new" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 text-sm font-medium text-white shadow-sm hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400">
              <Plus className="h-4 w-4" aria-hidden="true" /> New post
            </Link>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Admin posts" value={fmtNum(counts.all)} icon={FileText} loading={loading} hint="Stored in Firestore" />
        <StatCard label="Published" value={fmtNum(counts.published)} icon={Eye} tone="green" loading={loading} hint="Live on /blog" />
        <StatCard label="Drafts" value={fmtNum(counts.draft)} icon={EyeOff} tone="amber" loading={loading} hint="Not visible to visitors" />
        <StatCard label="Built-in articles" value={builtin ? fmtNum(builtin.total) : "100"} icon={BookOpen} tone="violet" loading={loading} hint={langs ? `${langs} languages · in code` : "Managed in code"} />
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-brand-100 bg-brand-50/60 px-4 py-3 text-sm text-slate-600 dark:border-brand-400/20 dark:bg-brand-400/[0.06] dark:text-slate-300">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-300" aria-hidden="true" />
        <p>
          The <strong className="font-semibold text-slate-900 dark:text-white">{builtin ? fmtNum(builtin.total) : "100"} built-in articles</strong>
          {builtin && langs > 0 && (
            <>
              {" "}
              ({Object.entries(builtin.locales)
                .map(([l, n]) => `${n} ${l.toUpperCase()}`)
                .join(" · ")})
            </>
          )}{" "}
          are Markdown files in <code className="rounded bg-white/70 px-1 py-0.5 text-xs dark:bg-white/10">src/content/blog</code> and are managed in the code. Posts below are created here and appear on the English blog when published.
        </p>
      </div>

      <Card bodyClassName="p-0">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 dark:border-white/[0.06] md:flex-row md:items-center">
          <SearchInput value={q} onChange={setQ} placeholder="Search title, slug, tags…" className="md:max-w-xs md:flex-1" />
          <Segmented<StatusFilter>
            value={status}
            onChange={setStatus}
            options={[
              { value: "all", label: `All ${counts.all}` },
              { value: "published", label: `Published ${counts.published}` },
              { value: "draft", label: `Drafts ${counts.draft}` },
            ]}
          />
          <Select<Sort>
            value={sort}
            onChange={setSort}
            className="md:ms-auto md:w-48"
            options={[
              { value: "updated", label: "Recently updated" },
              { value: "created", label: "Newest first" },
              { value: "title", label: "Title A–Z" },
            ]}
          />
        </div>

        {selIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 bg-brand-50/50 px-4 py-2 text-sm dark:border-white/[0.06] dark:bg-brand-400/[0.06]">
            <span className="font-semibold text-slate-700 dark:text-slate-200">{selIds.length} selected</span>
            <div className="ms-auto flex flex-wrap gap-1">
              <Button size="sm" variant="ghost" icon={Eye} onClick={() => setPostStatus(selIds, "published")}>
                Publish
              </Button>
              <Button size="sm" variant="ghost" icon={EyeOff} onClick={() => setPostStatus(selIds, "draft")}>
                Unpublish
              </Button>
              <Button size="sm" variant="danger-ghost" icon={Trash2} onClick={() => remove(selIds)}>
                Delete selected
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
                Clear
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="divide-y divide-slate-100 dark:divide-white/[0.06]">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-4">
                <Skeleton className="h-10 w-16" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-1/3" />
                  <Skeleton className="h-3 w-1/5" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        ) : error ? (
          <EmptyState icon={AlertTriangle} title="Couldn’t load posts" description={error} action={<Button icon={RefreshCw} onClick={load}>Try again</Button>} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={posts.length ? "No posts match" : "No admin posts yet"}
            description={posts.length ? "Try another search or status filter." : "Write your first article — it appears on the blog as soon as you publish it."}
            action={
              !posts.length && (
                <Link href="/admin/blog/new" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 text-sm font-medium text-white hover:bg-brand-700">
                  <Plus className="h-4 w-4" aria-hidden="true" /> New post
                </Link>
              )
            }
          />
        ) : (
          <>
            {/* Phones: cards */}
            <ul className="divide-y divide-slate-100 dark:divide-white/[0.06] md:hidden">
              {rows.map((p) => (
                <li key={p.id} className={`flex gap-3 px-4 py-3.5 ${selected.has(p.id) ? "bg-brand-50/40 dark:bg-brand-400/[0.04]" : ""}`}>
                  <div className="pt-1">
                    <Checkbox checked={selected.has(p.id)} onChange={(v) => toggleSel(p.id, v)} label={`Select ${p.title}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex gap-3">
                      <CoverThumb src={p.coverImage} className="h-12 w-16" />
                      <div className="min-w-0">
                        <Link href={`/admin/blog/${p.id}`} className="line-clamp-2 text-sm font-medium text-slate-900 dark:text-white">
                          {p.title || "Untitled"}
                        </Link>
                        <p className="mt-0.5 text-xs text-slate-400" title={fmtDateTime(p.updatedAt)}>
                          Updated {timeAgo(p.updatedAt)} · {fmtNum(p.words)} words
                        </p>
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Toggle checked={p.status === "published"} onChange={(v) => setPostStatus([p.id], v ? "published" : "draft")} label={p.status === "published" ? "Unpublish" : "Publish"} />
                        <Badge tone={p.status === "published" ? "green" : "amber"}>{p.status === "published" ? "Published" : "Draft"}</Badge>
                      </div>
                      {actions(p)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <Table className="hidden md:block">
              <THead>
                <tr>
                  <th className="w-10">
                    <Checkbox checked={allRowsSelected} indeterminate={rows.some((p) => selected.has(p.id))} onChange={toggleAll} label="Select all posts on this page" />
                  </th>
                  <th>Post</th>
                  <th>Status</th>
                  <th className="hidden md:table-cell">Tags</th>
                  <th>Updated</th>
                  <th className="text-end">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </THead>
              <TBody>
                {rows.map((p) => (
                  <tr key={p.id} className={selected.has(p.id) ? "bg-brand-50/40 dark:bg-brand-400/[0.04]" : ""}>
                    <td>
                      <Checkbox checked={selected.has(p.id)} onChange={(v) => toggleSel(p.id, v)} label={`Select ${p.title}`} />
                    </td>
                    <td className="min-w-[280px]">
                      <div className="flex items-center gap-3">
                        <CoverThumb src={p.coverImage} />
                        <div className="min-w-0">
                          <Link href={`/admin/blog/${p.id}`} className="line-clamp-1 font-medium text-slate-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-300">
                            {p.title || "Untitled"}
                          </Link>
                          <p className="truncate font-mono text-xs text-slate-400 dark:text-slate-500">/blog/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Toggle checked={p.status === "published"} onChange={(v) => setPostStatus([p.id], v ? "published" : "draft")} label={p.status === "published" ? "Unpublish" : "Publish"} />
                        <Badge tone={p.status === "published" ? "green" : "amber"}>{p.status === "published" ? "Published" : "Draft"}</Badge>
                      </div>
                    </td>
                    <td className="hidden md:table-cell">
                      <div className="flex max-w-[220px] flex-wrap gap-1">
                        {p.tags.slice(0, 3).map((t) => (
                          <Badge key={t}>{t}</Badge>
                        ))}
                        {p.tags.length > 3 && <span className="text-xs text-slate-400">+{p.tags.length - 3}</span>}
                        {!p.tags.length && <span className="text-xs text-slate-400">—</span>}
                      </div>
                    </td>
                    <td className="whitespace-nowrap text-xs text-slate-500 tabular-nums dark:text-slate-400" title={fmtDateTime(p.updatedAt)}>
                      {timeAgo(p.updatedAt)}
                      <span className="block text-[11px] text-slate-400 dark:text-slate-500">{fmtNum(p.words)} words</span>
                    </td>
                    <td>
                      {actions(p)}
                    </td>
                  </tr>
                ))}
              </TBody>
            </Table>
            <Pagination page={page} pages={pages} onPage={setPage} />
          </>
        )}
      </Card>
    </div>
  );
}
