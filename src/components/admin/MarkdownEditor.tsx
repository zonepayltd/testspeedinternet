"use client";

import { useRef, useState } from "react";
import { marked } from "marked";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  Eye,
  Pencil,
} from "lucide-react";

marked.setOptions({ gfm: true, breaks: true });

export default function MarkdownEditor({
  value,
  onChange,
  rows = 18,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = useState<"write" | "preview">("write");

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
    const next = before + text + after;
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(before.length + selStart, before.length + selEnd);
    });
  };

  // Wrap selection between two markers (bold, italic, inline code).
  const wrap = (marker: string, placeholder: string) =>
    apply((sel) => {
      const inner = sel || placeholder;
      return { text: `${marker}${inner}${marker}`, selStart: marker.length, selEnd: marker.length + inner.length };
    });

  // Prefix each selected line (headings, lists, quote).
  const linePrefix = (prefix: string, placeholder: string) =>
    apply((sel) => {
      const base = sel || placeholder;
      const text = base
        .split("\n")
        .map((l) => `${prefix}${l}`)
        .join("\n");
      return { text, selStart: prefix.length, selEnd: text.length };
    });

  const insertLink = () => {
    const url = window.prompt("Link URL (https://…)", "https://");
    if (!url) return;
    apply((sel) => {
      const label = sel || "link text";
      const text = `[${label}](${url})`;
      return { text, selStart: 1, selEnd: 1 + label.length };
    });
  };

  const insertImage = () => {
    const url = window.prompt("Image URL (https://…)", "https://");
    if (!url) return;
    const alt = window.prompt("Image description (alt text, good for SEO)", "") || "";
    apply((sel) => {
      void sel;
      const text = `\n![${alt}](${url})\n`;
      return { text, selStart: text.length, selEnd: text.length };
    });
  };

  const tools: { title: string; icon: React.ComponentType<{ className?: string }>; run: () => void }[] = [
    { title: "Bold", icon: Bold, run: () => wrap("**", "bold text") },
    { title: "Italic", icon: Italic, run: () => wrap("*", "italic text") },
    { title: "Heading 2", icon: Heading2, run: () => linePrefix("## ", "Heading") },
    { title: "Heading 3", icon: Heading3, run: () => linePrefix("### ", "Subheading") },
    { title: "Insert link (URL)", icon: LinkIcon, run: insertLink },
    { title: "Insert image", icon: ImageIcon, run: insertImage },
    { title: "Bullet list", icon: List, run: () => linePrefix("- ", "List item") },
    { title: "Numbered list", icon: ListOrdered, run: () => linePrefix("1. ", "List item") },
    { title: "Quote", icon: Quote, run: () => linePrefix("> ", "Quote") },
    { title: "Inline code", icon: Code, run: () => wrap("`", "code") },
  ];

  const previewHtml = tab === "preview" ? (marked.parse(value || "*Nothing to preview yet.*") as string) : "";

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1.5">
        {tools.map((t) => (
          <button
            key={t.title}
            type="button"
            title={t.title}
            aria-label={t.title}
            onClick={t.run}
            disabled={tab === "preview"}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white hover:text-brand-600 disabled:opacity-40"
          >
            <t.icon className="h-4 w-4" />
          </button>
        ))}

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setTab("write")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
              tab === "write" ? "bg-white text-brand-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Pencil className="h-3.5 w-3.5" /> Write
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
              tab === "preview" ? "bg-white text-brand-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Eye className="h-3.5 w-3.5" /> Preview
          </button>
        </div>
      </div>

      {tab === "write" ? (
        <textarea
          ref={ref}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={"## Heading\n\nWrite your article in **Markdown**. Use the toolbar to add images, links and headings."}
          className="block w-full resize-y border-0 px-3.5 py-3 font-mono text-sm text-slate-900 focus:outline-none focus:ring-0"
        />
      ) : (
        <div className="post-body min-h-[16rem] px-4 py-4" dangerouslySetInnerHTML={{ __html: previewHtml }} />
      )}
    </div>
  );
}
