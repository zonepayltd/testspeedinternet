"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Button, IconButton, inputCls } from "@/components/admin/ui";

/** Label + optional hint/counter wrapper for editor fields. */
export function Field({
  label,
  hint,
  count,
  max,
  children,
  htmlFor,
}: {
  label: string;
  hint?: React.ReactNode;
  count?: number;
  max?: number;
  children: React.ReactNode;
  htmlFor?: string;
}) {
  const over = max != null && count != null && count > max;
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label htmlFor={htmlFor} className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </label>
        {count != null && (
          <span className={`text-xs tabular-nums ${over ? "font-semibold text-amber-600 dark:text-amber-400" : "text-slate-400 dark:text-slate-500"}`}>
            {count}
            {max != null && ` / ${max}`}
          </span>
        )}
      </div>
      {children}
      {hint && <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">{hint}</p>}
    </div>
  );
}

/** Chip input: Enter or comma adds, Backspace on empty removes the last chip. */
export function TagInput({ id, value, onChange, placeholder = "Add a tag…", max = 30 }: { id?: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string; max?: number }) {
  const [draft, setDraft] = useState("");
  const add = (raw: string) => {
    const parts = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!parts.length) return;
    const next = [...value];
    for (const p of parts) if (!next.some((t) => t.toLowerCase() === p.toLowerCase()) && next.length < max) next.push(p);
    onChange(next);
    setDraft("");
  };
  return (
    <div className="flex min-h-[36px] w-full flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1.5 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10 dark:border-white/10 dark:bg-white/[0.04]">
      {value.map((t) => (
        <span key={t} className="inline-flex items-center gap-1 rounded-md bg-slate-100 py-0.5 pe-1 ps-2 text-xs font-medium text-slate-700 dark:bg-white/10 dark:text-slate-200">
          {t}
          <button type="button" aria-label={`Remove ${t}`} onClick={() => onChange(value.filter((x) => x !== t))} className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white">
            <X className="h-3 w-3" aria-hidden="true" />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(e) => (e.target.value.includes(",") ? add(e.target.value) : setDraft(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add(draft);
          } else if (e.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => add(draft)}
        placeholder={value.length ? "" : placeholder}
        className="min-w-[80px] flex-1 border-0 bg-transparent px-1 py-0.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 dark:text-white dark:placeholder:text-slate-500"
      />
    </div>
  );
}

/** How the article could look as a Google result. */
export function SeoPreview({ title, description, url }: { title: string; description: string; url: string }) {
  const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
  const crumbs = url.replace(/^https?:\/\//, "").split("/").filter(Boolean);
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-brand-600 ring-1 ring-slate-200 dark:bg-white/10 dark:text-brand-300 dark:ring-white/10">TS</span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[13px] text-slate-800 dark:text-slate-200">TestSpeedInternet</p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            {crumbs[0]}
            {crumbs.slice(1).map((c) => ` › ${c}`)}
          </p>
        </div>
      </div>
      <p className="mt-2 line-clamp-2 text-lg leading-snug text-[#1a0dab] dark:text-[#8ab4f8]">{clip(title || "Your article title", 65)}</p>
      <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">{clip(description || "Add an excerpt or meta description — it’s shown under the title in search results.", 160)}</p>
    </div>
  );
}

export type Faq = { q: string; a: string };

/** Q&A pairs rendered as an FAQ section (and FAQPage structured data) on the article. */
export function FaqEditor({ value, onChange }: { value: Faq[]; onChange: (v: Faq[]) => void }) {
  const set = (i: number, k: keyof Faq, v: string) => onChange(value.map((f, j) => (j === i ? { ...f, [k]: v } : f)));
  return (
    <div className="space-y-3">
      {value.map((f, i) => (
        <div key={i} className="space-y-2 rounded-xl border border-slate-200 p-3 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Q{i + 1}</span>
            <input className={`${inputCls} !h-8`} value={f.q} onChange={(e) => set(i, "q", e.target.value)} placeholder="Question" aria-label={`Question ${i + 1}`} />
            <IconButton icon={Trash2} label={`Remove question ${i + 1}`} variant="danger-ghost" onClick={() => onChange(value.filter((_, j) => j !== i))} />
          </div>
          <textarea className={`${inputCls} !h-auto resize-y py-2`} rows={2} value={f.a} onChange={(e) => set(i, "a", e.target.value)} placeholder="Answer" aria-label={`Answer ${i + 1}`} />
        </div>
      ))}
      <Button size="sm" icon={Plus} onClick={() => onChange([...value, { q: "", a: "" }])}>
        Add question
      </Button>
    </div>
  );
}
