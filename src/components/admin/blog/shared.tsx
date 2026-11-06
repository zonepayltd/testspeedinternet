"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";

export type PostStatus = "draft" | "published";

export type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  status: PostStatus;
  tags: string[];
  words: number;
  createdAt: number;
  updatedAt: number;
};

export type Builtin = { total: number; locales: Record<string, number> };

/** Same rules as `slugify` in src/lib/posts.ts (server), usable in the browser. */
export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

export function wordCount(md: string): number {
  return md.replace(/[#*_>`|[\]()!-]/g, " ").split(/\s+/).filter(Boolean).length;
}

/** Thumbnail with a neutral placeholder when there's no image or it fails to load. */
export function CoverThumb({ src, alt = "", className = "h-10 w-16" }: { src: string; alt?: string; className?: string }) {
  const [broken, setBroken] = useState(false);
  if (!src || broken)
    return (
      <span className={`flex shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-300 ring-1 ring-inset ring-slate-200 dark:bg-white/[0.04] dark:text-slate-600 dark:ring-white/[0.06] ${className}`}>
        <ImageIcon className="h-4 w-4" aria-hidden="true" />
      </span>
    );
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" onError={() => setBroken(true)} className={`shrink-0 rounded-lg object-cover ring-1 ring-inset ring-black/5 dark:ring-white/10 ${className}`} />
  );
}
