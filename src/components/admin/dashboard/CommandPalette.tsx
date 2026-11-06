"use client";

// Cmd/Ctrl+K quick-jump palette for admin pages (client-only, no backend).

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, ExternalLink, LogOut, PenSquare, Plus, Search, type LucideIcon } from "lucide-react";
import { NAV_GROUPS } from "./nav";

type Cmd = { id: string; label: string; group: string; icon: LucideIcon; keywords?: string; run: () => void };

export default function CommandPalette({ open, onClose, onSignOut }: { open: boolean; onClose: () => void; onSignOut: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const commands = useMemo<Cmd[]>(() => {
    const go = (href: string) => () => router.push(href);
    return [
      ...NAV_GROUPS.flatMap((g) => g.items.map((n) => ({ id: n.href, label: n.label, group: "Pages", icon: n.icon, keywords: `${g.label} ${n.keywords || ""}`, run: go(n.href) }))),
      { id: "new-post", label: "Write a new blog post", group: "Actions", icon: PenSquare, keywords: "create article", run: go("/admin/blog/new") },
      { id: "new-ad", label: "Create a new ad", group: "Actions", icon: Plus, keywords: "banner script image", run: go("/admin/ads/new") },
      { id: "site", label: "View public site", group: "Actions", icon: ExternalLink, keywords: "open website", run: () => window.open("/", "_blank", "noopener") },
      { id: "logout", label: "Sign out", group: "Actions", icon: LogOut, keywords: "logout exit", run: onSignOut },
    ];
  }, [router, onSignOut]);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return commands;
    return commands.filter((c) => `${c.label} ${c.keywords || ""}`.toLowerCase().includes(s));
  }, [q, commands]);

  useEffect(() => {
    if (open) {
      setQ("");
      setIdx(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);
  useEffect(() => setIdx(0), [q]);
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${idx}"]`)?.scrollIntoView({ block: "nearest" });
  }, [idx]);

  if (!open) return null;

  const exec = (c?: Cmd) => {
    if (!c) return;
    onClose();
    c.run();
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIdx((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIdx((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      exec(results[idx]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  let lastGroup = "";
  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-center bg-slate-950/40 p-4 pt-[12vh] backdrop-blur-sm" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Quick jump"
        className="w-full max-w-lg animate-scale-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-ink-900"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKey}
      >
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 dark:border-white/[0.06]">
          <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Jump to a page or action…"
            aria-label="Search admin pages"
            role="combobox"
            aria-expanded="true"
            aria-controls="cmdk-list"
            aria-activedescendant={results[idx] ? `cmdk-${results[idx].id}` : undefined}
            className="h-12 w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
          />
          <kbd className="hidden rounded border border-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:border-white/10 sm:block">ESC</kbd>
        </div>
        <ul ref={listRef} id="cmdk-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-slate-400">No results for “{q}”</li>}
          {results.map((c, i) => {
            const header = c.group !== lastGroup ? c.group : "";
            lastGroup = c.group;
            const Icon = c.icon;
            return (
              <li key={c.id} role="presentation">
                {header && <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{header}</p>}
                <button
                  type="button"
                  id={`cmdk-${c.id}`}
                  role="option"
                  aria-selected={i === idx}
                  data-idx={i}
                  onMouseMove={() => setIdx(i)}
                  onClick={() => exec(c)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-start text-sm ${i === idx ? "bg-brand-50 text-brand-700 dark:bg-brand-400/10 dark:text-brand-200" : "text-slate-700 dark:text-slate-200"}`}
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />
                  <span className="flex-1 truncate">{c.label}</span>
                  {i === idx && <CornerDownLeft className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-4 border-t border-slate-100 px-4 py-2 text-[11px] text-slate-400 dark:border-white/[0.06]">
          <span>↑↓ to navigate</span>
          <span>↵ to open</span>
          <span>esc to close</span>
        </div>
      </div>
    </div>
  );
}
