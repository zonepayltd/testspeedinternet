"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Inbox, Mail, MailOpen, RefreshCw, Trash2 } from "lucide-react";
import { Button, EmptyState, IconButton, PageHeader, SearchInput, Segmented, Select, Skeleton, api, fmtNum, useAdminUI } from "@/components/admin/ui";
import { Checkbox, MessageRow } from "@/components/admin/inbox/MessageList";
import MessageReader from "@/components/admin/inbox/MessageReader";
import type { Folder, Message } from "@/components/admin/inbox/shared";

const PAGE = 60;
type Patch = { read?: boolean; handled?: boolean };

export default function MessagesPage() {
  const { confirm, toast } = useAdminUI();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [folder, setFolder] = useState<Folder>("all");
  const [subject, setSubject] = useState("all");
  const [q, setQ] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [shown, setShown] = useState(PAGE);
  const [busy, setBusy] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async (quiet = false) => {
    if (quiet) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const d = await api<{ messages: Message[] }>("/api/admin/messages");
      setMessages(d.messages || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load messages");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const unread = useMemo(() => messages.filter((m) => !m.read).length, [messages]);
  /** Ask the shell to re-fetch the sidebar badges right away (after read/unread/delete). */
  const refreshBadges = () => window.dispatchEvent(new Event("admin:refresh-badges"));

  // Deep link: /admin/messages?id=<messageId> opens that message once the list has loaded.
  const deepLinked = useRef(false);
  useEffect(() => {
    if (loading || error || deepLinked.current) return;
    deepLinked.current = true;
    const id = new URLSearchParams(window.location.search).get("id");
    const m = id ? messages.find((x) => x.id === id) : null;
    if (m) open(m);
    else if (id) toast("That message no longer exists", "info");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, messages]);

  const subjects = useMemo(() => {
    const counts = new Map<string, number>();
    messages.forEach((m) => m.subject && counts.set(m.subject, (counts.get(m.subject) || 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [messages]);

  const counts = useMemo(
    () => ({ all: messages.length, unread, handled: messages.filter((m) => m.handled).length }),
    [messages, unread]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return messages.filter((m) => {
      if (folder === "unread" && m.read) return false;
      if (folder === "handled" && !m.handled) return false;
      if (subject !== "all" && m.subject !== subject) return false;
      if (needle && !`${m.name} ${m.email} ${m.phone} ${m.subject} ${m.message}`.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [messages, folder, subject, q]);

  useEffect(() => setShown(PAGE), [folder, subject, q]);
  const visible = filtered.slice(0, shown);
  const active = messages.find((m) => m.id === activeId) || null;
  const activeIdx = active ? filtered.findIndex((m) => m.id === active.id) : -1;

  /* ---------------------------------------------------------------- actions */

  const applyLocal = (ids: string[], patch: Patch) =>
    setMessages((list) => list.map((m) => (ids.includes(m.id) ? { ...m, ...patch } : m)));

  const update = async (ids: string[], patch: Patch, note?: string) => {
    if (!ids.length) return;
    const before = messages;
    applyLocal(ids, patch);
    try {
      if (ids.length === 1) await api(`/api/admin/messages/${ids[0]}`, { method: "PATCH", json: patch });
      else await api("/api/admin/messages", { method: "PATCH", json: { ids, ...patch } });
      if ("read" in patch) refreshBadges();
      if (note) toast(note);
    } catch (e) {
      setMessages(before);
      toast(e instanceof Error ? e.message : "Update failed", "error");
    }
  };

  const open = (m: Message) => {
    setActiveId(m.id);
    if (!m.read) update([m.id], { read: true });
  };

  const move = (dir: 1 | -1) => {
    if (!filtered.length) return;
    const idx = activeIdx < 0 ? (dir === 1 ? 0 : filtered.length - 1) : activeIdx + dir;
    const next = filtered[Math.max(0, Math.min(filtered.length - 1, idx))];
    if (next && next.id !== activeId) {
      if (idx >= shown) setShown((s) => s + PAGE);
      open(next);
    }
  };

  /** Remove locally, keeping the reading pane on the next message. */
  const dropLocal = (ids: string[]) => {
    if (activeId && ids.includes(activeId)) {
      const rest = filtered.filter((m) => !ids.includes(m.id));
      const after = filtered.slice(activeIdx + 1).find((m) => !ids.includes(m.id));
      const nextActive = after || rest[rest.length - 1];
      setActiveId(nextActive ? nextActive.id : null);
    }
    setMessages((list) => list.filter((m) => !ids.includes(m.id)));
    setSelected((s) => new Set([...s].filter((id) => !ids.includes(id))));
  };

  const removeIds = async (ids: string[]) => {
    if (!ids.length) return;
    const one = ids.length === 1 ? messages.find((m) => m.id === ids[0]) : null;
    const ok = await confirm({
      title: one ? "Delete this message?" : `Delete ${fmtNum(ids.length)} messages?`,
      message: one ? `The message from ${one.name || one.email} will be permanently deleted.` : "The selected messages will be permanently deleted. This can’t be undone.",
      confirmLabel: "Delete",
    });
    if (!ok) return;
    const before = messages;
    dropLocal(ids);
    try {
      if (ids.length === 1) await api(`/api/admin/messages/${ids[0]}`, { method: "DELETE" });
      else await api("/api/admin/messages", { method: "DELETE", json: { ids } });
      refreshBadges();
      toast(ids.length === 1 ? "Message deleted" : `${fmtNum(ids.length)} messages deleted`);
    } catch (e) {
      setMessages(before);
      toast(e instanceof Error ? e.message : "Delete failed", "error");
    }
  };

  const removeBulk = async (kind: "handled" | "all") => {
    const n = kind === "all" ? counts.all : counts.handled;
    if (!n) return toast(kind === "all" ? "The inbox is already empty" : "No handled messages to delete", "info");
    const ok = await confirm({
      title: kind === "all" ? "Delete ALL messages?" : "Delete all handled messages?",
      message:
        kind === "all"
          ? `This permanently deletes every message in the inbox (${fmtNum(n)}), including unread ones. This can’t be undone.`
          : `This permanently deletes ${fmtNum(n)} message${n === 1 ? "" : "s"} marked as handled. Open messages are kept.`,
      confirmLabel: kind === "all" ? "Delete everything" : "Delete handled",
    });
    if (!ok) return;
    setBusy(true);
    try {
      const d = await api<{ deleted: number }>("/api/admin/messages", { method: "DELETE", json: kind === "all" ? { all: true } : { handled: true } });
      toast(`${fmtNum(d.deleted)} message${d.deleted === 1 ? "" : "s"} deleted`);
      refreshBadges();
      setSelected(new Set());
      if (kind === "all" || active?.handled) setActiveId(null);
      await load(true);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed", "error");
    } finally {
      setBusy(false);
    }
  };

  /* --------------------------------------------------------------- keyboard */

  const keyRef = useRef<(e: KeyboardEvent) => void>(() => {});
  keyRef.current = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (t && (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName))) {
      if (e.key === "Escape") t.blur();
      return;
    }
    if (document.querySelector('[role="alertdialog"]')) return;
    if (e.key === "j" || e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "k" || e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "/") {
      e.preventDefault();
      searchRef.current?.querySelector("input")?.focus();
    } else if (e.key === "Escape") {
      setActiveId(null);
    } else if (active && (e.key === "e" || e.key === "E")) {
      e.preventDefault();
      update([active.id], { handled: !active.handled }, active.handled ? "Marked as not handled" : "Marked as handled");
    } else if (active && (e.key === "u" || e.key === "U")) {
      e.preventDefault();
      update([active.id], { read: !active.read });
    } else if (active && (e.key === "#" || e.key === "Delete")) {
      e.preventDefault();
      removeIds([active.id]);
    }
  };
  useEffect(() => {
    const h = (e: KeyboardEvent) => keyRef.current(e);
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  /* -------------------------------------------------------------- selection */

  const selIds = [...selected].filter((id) => messages.some((m) => m.id === id));
  const allVisibleSelected = visible.length > 0 && visible.every((m) => selected.has(m.id));
  const toggleAll = (v: boolean) => setSelected(v ? new Set(filtered.map((m) => m.id)) : new Set());
  const toggleOne = (id: string, v: boolean) =>
    setSelected((s) => {
      const n = new Set(s);
      if (v) n.add(id);
      else n.delete(id);
      return n;
    });

  /* ----------------------------------------------------------------- render */

  return (
    <div>
      <PageHeader
        title="Messages"
        icon={Inbox}
        description={loading ? "Loading inbox…" : `${fmtNum(counts.unread)} unread · ${fmtNum(counts.all)} total · ${fmtNum(counts.handled)} handled`}
        actions={
          <>
            <Button icon={RefreshCw} onClick={() => load(true)} loading={refreshing} disabled={loading}>
              Refresh
            </Button>
            <Button variant="danger-ghost" icon={CheckCircle2} onClick={() => removeBulk("handled")} disabled={busy || loading}>
              Delete handled…
            </Button>
            <Button variant="danger-ghost" icon={Trash2} onClick={() => removeBulk("all")} disabled={busy || loading}>
              Delete all…
            </Button>
          </>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.02] dark:border-white/[0.08] dark:bg-ink-900 lg:grid lg:h-[calc(100dvh-13rem)] lg:min-h-[560px] lg:grid-cols-[minmax(340px,420px)_1fr]">
        {/* ---------------- List pane ---------------- */}
        <section className={`min-h-0 flex-col border-slate-100 dark:border-white/[0.06] lg:flex lg:border-e ${active ? "hidden" : "flex"}`} aria-label="Message list">
          <div className="space-y-2.5 border-b border-slate-100 p-3 dark:border-white/[0.06]">
            <div ref={searchRef}>
              <SearchInput value={q} onChange={setQ} placeholder="Search name, email or text…" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Segmented<Folder>
                value={folder}
                onChange={setFolder}
                options={[
                  { value: "all", label: `All ${counts.all}` },
                  { value: "unread", label: `Unread ${counts.unread}` },
                  { value: "handled", label: `Handled ${counts.handled}` },
                ]}
              />
              <Select
                value={subject}
                onChange={setSubject}
                className="!h-8 min-w-[150px] flex-1 text-xs"
                options={[{ value: "all", label: "All subjects" }, ...subjects.map(([s, n]) => ({ value: s, label: `${s} (${n})` }))]}
              />
            </div>
          </div>

          {/* Bulk bar */}
          <div className="flex h-11 shrink-0 items-center gap-3 border-b border-slate-100 bg-slate-50/70 px-4 text-xs text-slate-500 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-slate-400">
            <Checkbox checked={allVisibleSelected} indeterminate={selIds.length > 0} onChange={toggleAll} label="Select all messages in this view" />
            {selIds.length > 0 ? (
              <>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{fmtNum(selIds.length)} selected</span>
                <div className="ms-auto flex items-center gap-0.5">
                  <IconButton icon={MailOpen} label="Mark selected as read" onClick={() => update(selIds, { read: true }, `${selIds.length} marked as read`)} />
                  <IconButton icon={Mail} label="Mark selected as unread" onClick={() => update(selIds, { read: false }, `${selIds.length} marked as unread`)} />
                  <IconButton icon={CheckCircle2} label="Mark selected as handled" onClick={() => update(selIds, { handled: true, read: true }, `${selIds.length} marked as handled`)} />
                  <IconButton icon={Trash2} label="Delete selected" variant="danger-ghost" onClick={() => removeIds(selIds)} />
                </div>
              </>
            ) : (
              <span>
                {loading ? "…" : `${fmtNum(filtered.length)} message${filtered.length === 1 ? "" : "s"}`}
                {(q || subject !== "all" || folder !== "all") && !loading && (
                  <button
                    type="button"
                    className="ms-2 font-medium text-brand-600 hover:underline dark:text-brand-300"
                    onClick={() => {
                      setQ("");
                      setSubject("all");
                      setFolder("all");
                    }}
                  >
                    Clear filters
                  </button>
                )}
              </span>
            )}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {loading ? (
              <ul>
                {Array.from({ length: 7 }).map((_, i) => (
                  <li key={i} className="flex gap-3 border-b border-slate-100 px-4 py-3.5 dark:border-white/[0.06]">
                    <Skeleton className="h-9 w-9 !rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-1/2" />
                      <Skeleton className="h-3 w-1/4" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : error ? (
              <EmptyState icon={AlertTriangle} title="Couldn’t load messages" description={error} action={<Button icon={RefreshCw} onClick={() => load()}>Try again</Button>} />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={Inbox}
                title={messages.length ? "No messages match" : "Inbox zero"}
                description={messages.length ? "Try another search or filter." : "Messages sent through the contact form will appear here."}
              />
            ) : (
              <>
                <ul>
                  {visible.map((m) => (
                    <MessageRow key={m.id} m={m} active={m.id === activeId} checked={selected.has(m.id)} onOpen={() => open(m)} onCheck={(v) => toggleOne(m.id, v)} />
                  ))}
                </ul>
                {filtered.length > shown && (
                  <div className="p-3 text-center">
                    <Button size="sm" onClick={() => setShown((s) => s + PAGE)}>
                      Load {fmtNum(Math.min(PAGE, filtered.length - shown))} more
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* ---------------- Reading pane ---------------- */}
        <section className={`min-h-0 ${active ? "block" : "hidden lg:block"}`} aria-label="Reading pane">
          {active ? (
            <MessageReader
              m={active}
              onBack={() => setActiveId(null)}
              onPrev={activeIdx > 0 ? () => move(-1) : undefined}
              onNext={activeIdx >= 0 && activeIdx < filtered.length - 1 ? () => move(1) : undefined}
              onToggleRead={() => update([active.id], { read: !active.read })}
              onToggleHandled={() => update([active.id], { handled: !active.handled }, active.handled ? "Marked as not handled" : "Marked as handled")}
              onDelete={() => removeIds([active.id])}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <EmptyState
                icon={Mail}
                title="Select a message"
                description="Pick a message from the list to read it. Shortcuts: j / k to move, e to mark handled, u to toggle read, # to delete, / to search."
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
