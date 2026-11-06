"use client";

import { useMemo, useRef, useState } from "react";
import { marked } from "marked";
import {
  Bold,
  Code,
  Columns2,
  Eye,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Pencil,
  Quote,
  Strikethrough,
  Table as TableIcon,
  type LucideIcon,
} from "lucide-react";

marked.setOptions({ gfm: true, breaks: true });

type Tab = "write" | "preview" | "split";

/**
 * Markdown editor with a formatting toolbar and Write / Preview / Split tabs.
 * Keyboard: ⌘/Ctrl+B bold, ⌘/Ctrl+I italic, ⌘/Ctrl+K link, Tab indents.
 */
export default function MarkdownEditor({
  value,
  onChange,
  rows = 22,
  footer,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  footer?: React.ReactNode;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = useState<Tab>("write");

  // Replace the current selection and restore the caret afterwards.
  const apply = (transform: (sel: string) => { text: string; selStart: number; selEnd: number }) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const before = value.slice(0, start);
    const selected = value.slice(start, end);
    const after = value.slice(end);
    const { text, selStart, selEnd } = transform(selected);
    onChange(before + text + after);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(before.length + selStart, before.length + selEnd);
    });
  };

  const wrap = (marker: string, placeholder: string) =>
    apply((sel) => {
      const inner = sel || placeholder;
      return { text: `${marker}${inner}${marker}`, selStart: marker.length, selEnd: marker.length + inner.length };
    });

  const linePrefix = (prefix: string | ((i: number) => string), placeholder: string) =>
    apply((sel) => {
      const lines = (sel || placeholder).split("\n");
      const text = lines.map((l, i) => `${typeof prefix === "string" ? prefix : prefix(i)}${l.replace(/^(#{1,6}\s|[-*]\s|\d+\.\s|>\s)/, "")}`).join("\n");
      const first = typeof prefix === "string" ? prefix.length : prefix(0).length;
      return { text, selStart: first, selEnd: text.length };
    });

  const insertBlock = (block: string) =>
    apply(() => {
      const text = `\n${block}\n`;
      return { text, selStart: text.length, selEnd: text.length };
    });

  const insertLink = () => {
    const url = window.prompt("Link URL (https://… or /path)", "https://");
    if (!url) return;
    apply((sel) => {
      const label = sel || "link text";
      return { text: `[${label}](${url})`, selStart: 1, selEnd: 1 + label.length };
    });
  };

  const insertImage = () => {
    const url = window.prompt("Image URL (https://…)", "https://");
    if (!url) return;
    const alt = window.prompt("Image description (alt text — good for SEO and accessibility)", "") || "";
    insertBlock(`![${alt}](${url})\n`);
  };

  const tools: ({ title: string; icon: LucideIcon; run: () => void } | "sep")[] = [
    { title: "Heading 2", icon: Heading2, run: () => linePrefix("## ", "Heading") },
    { title: "Heading 3", icon: Heading3, run: () => linePrefix("### ", "Subheading") },
    "sep",
    { title: "Bold (⌘B)", icon: Bold, run: () => wrap("**", "bold text") },
    { title: "Italic (⌘I)", icon: Italic, run: () => wrap("*", "italic text") },
    { title: "Strikethrough", icon: Strikethrough, run: () => wrap("~~", "text") },
    { title: "Inline code", icon: Code, run: () => wrap("`", "code") },
    "sep",
    { title: "Link (⌘K)", icon: LinkIcon, run: insertLink },
    { title: "Image", icon: ImageIcon, run: insertImage },
    { title: "Quote", icon: Quote, run: () => linePrefix("> ", "Quote") },
    "sep",
    { title: "Bullet list", icon: List, run: () => linePrefix("- ", "List item") },
    { title: "Numbered list", icon: ListOrdered, run: () => linePrefix((i) => `${i + 1}. `, "List item") },
    { title: "Table", icon: TableIcon, run: () => insertBlock("| Plan | Download | Upload |\n| --- | --- | --- |\n| Fiber 100 | 100 Mbps | 50 Mbps |\n") },
    { title: "Divider", icon: Minus, run: () => insertBlock("\n---\n") },
  ];

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const mod = e.metaKey || e.ctrlKey;
    if (mod && e.key.toLowerCase() === "b") {
      e.preventDefault();
      wrap("**", "bold text");
    } else if (mod && e.key.toLowerCase() === "i") {
      e.preventDefault();
      wrap("*", "italic text");
    } else if (mod && e.key.toLowerCase() === "k") {
      e.preventDefault();
      insertLink();
    } else if (e.key === "Tab" && !e.shiftKey && !mod) {
      e.preventDefault();
      apply(() => ({ text: "  ", selStart: 2, selEnd: 2 }));
    }
  };

  const showPreview = tab !== "write";
  const html = useMemo(
    () => (showPreview ? (marked.parse(value || "*Nothing to preview yet.*") as string) : ""),
    [value, showPreview]
  );

  const tabBtn = (t: Tab, label: string, Icon: LucideIcon, extra = "") => (
    <button
      type="button"
      onClick={() => setTab(t)}
      aria-pressed={tab === t}
      className={`items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${extra || "inline-flex"} ${
        tab === t ? "bg-white text-slate-900 shadow-sm dark:bg-white/10 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      }`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {label}
    </button>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-500/10 dark:border-white/10 dark:bg-white/[0.02]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50/80 px-2 py-1.5 dark:border-white/10 dark:bg-white/[0.03]">
        {tools.map((t, i) =>
          t === "sep" ? (
            <span key={`sep${i}`} className="mx-1 h-5 w-px bg-slate-200 dark:bg-white/10" aria-hidden="true" />
          ) : (
            <button
              key={t.title}
              type="button"
              title={t.title}
              aria-label={t.title}
              onClick={t.run}
              disabled={tab === "preview"}
              className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-white hover:text-slate-900 disabled:opacity-40 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <t.icon className="h-4 w-4" aria-hidden="true" />
            </button>
          )
        )}

        <div className="ms-auto flex rounded-lg border border-slate-200 bg-slate-100/80 p-0.5 dark:border-white/10 dark:bg-white/[0.04]">
          {tabBtn("write", "Write", Pencil)}
          {tabBtn("preview", "Preview", Eye)}
          {tabBtn("split", "Split", Columns2, "hidden lg:inline-flex")}
        </div>
      </div>

      <div className={tab === "split" ? "grid lg:grid-cols-2 lg:divide-x lg:divide-slate-200 dark:lg:divide-white/10" : ""}>
        {tab !== "preview" && (
          <textarea
            ref={ref}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck
            aria-label="Article content (Markdown)"
            placeholder={"## Heading\n\nWrite your article in **Markdown**. Use the toolbar for headings, links, images and tables."}
            className="block min-h-[22rem] w-full resize-y border-0 bg-transparent px-4 py-3.5 font-mono text-[13.5px] leading-relaxed text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 dark:text-slate-200 dark:placeholder:text-slate-600"
          />
        )}
        {showPreview && (
          <div
            className={`post-body overflow-y-auto px-5 py-4 !text-[15px] ${tab === "split" ? "max-h-[40rem] border-t border-slate-200 dark:border-white/10 lg:border-t-0" : "min-h-[22rem]"}`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>

      {footer && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-200 bg-slate-50/80 px-4 py-2 text-xs text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
          {footer}
        </div>
      )}
    </div>
  );
}
