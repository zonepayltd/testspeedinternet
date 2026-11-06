"use client";

import { useEffect, useRef, useState } from "react";
import { CloudUpload, Images, Link2, Loader2, Trash2, X } from "lucide-react";
import { Button, IconButton, inputCls, api, useAdminUI } from "@/components/admin/ui";
import { fmtBytes } from "./shared";

const MAX_W = 1600;
const TARGET = 700 * 1024;

type Img = { id: string; url: string; name: string; width: number; height: number; size: number; usedBy: number };

function loadImage(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("This file isn't a readable image"));
    img.src = url;
  });
}

const toDataUrl = (b: Blob) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("Could not read the image"));
    r.readAsDataURL(b);
  });

/** Resize (max 1600px wide) and compress to WebP (< 700 KB) in the browser. Small GIFs keep their animation. */
export async function compressImage(file: File): Promise<{ blob: Blob; width: number; height: number; type: string }> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file (JPG, PNG, WebP or GIF).");
  if (file.type === "image/svg+xml") throw new Error("SVG isn't supported — export it as PNG or WebP.");
  const img = await loadImage(file);
  const w0 = img.naturalWidth;
  const h0 = img.naturalHeight;
  if (file.type === "image/gif" && file.size <= TARGET) return { blob: file, width: w0, height: h0, type: "image/gif" };

  let maxW = Math.min(MAX_W, w0);
  for (let attempt = 0; attempt < 6; attempt++) {
    const w = Math.round(maxW);
    const h = Math.round((h0 * w) / w0);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not available");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, w, h);
    for (const q of [0.86, 0.76, 0.66, 0.56]) {
      let blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", q));
      // Browsers without a WebP encoder return PNG — fall back to JPEG.
      if (!blob || blob.type !== "image/webp") blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", q));
      if (blob && blob.size <= TARGET) return { blob, width: w, height: h, type: blob.type };
    }
    maxW *= 0.75;
  }
  throw new Error("Couldn't compress this image under 700 KB — try a smaller one.");
}

/** Drop zone + URL field + library of uploaded images. */
export default function ImageUpload({ value, onChange }: { value: string; onChange: (url: string, meta?: { width: number; height: number }) => void }) {
  const { toast, confirm } = useAdminUI();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [lib, setLib] = useState<Img[] | null>(null);
  const [libOpen, setLibOpen] = useState(false);

  const upload = async (file?: File | null) => {
    if (!file) return;
    try {
      setBusy("Compressing…");
      const { blob, width, height, type } = await compressImage(file);
      setBusy(`Uploading ${fmtBytes(blob.size)}…`);
      const data = await toDataUrl(blob);
      const r = await api<{ id: string; url: string }>("/api/admin/ad-images", { method: "POST", json: { data, type, width, height, name: file.name } });
      onChange(r.url, { width, height });
      setLib(null);
      toast(`Image uploaded · ${width}×${height} · ${fmtBytes(blob.size)}`);
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setBusy(null);
    }
  };

  useEffect(() => {
    if (!libOpen || lib) return;
    api<{ images: Img[] }>("/api/admin/ad-images")
      .then((d) => setLib(d.images))
      .catch((e) => {
        setLib([]);
        toast((e as Error).message, "error");
      });
  }, [libOpen, lib, toast]);

  const removeImg = async (img: Img) => {
    const ok = await confirm({
      title: "Delete this image?",
      message: img.usedBy ? `It is used by ${img.usedBy} ad(s) — they will show a broken image.` : "It isn't used by any ad.",
    });
    if (!ok) return;
    try {
      await api("/api/admin/ad-images", { method: "DELETE", json: { ids: [img.id] } });
      setLib((l) => (l ? l.filter((x) => x.id !== img.id) : l));
      if (value === img.url) onChange("");
      toast("Image deleted");
    } catch (e) {
      toast((e as Error).message, "error");
    }
  };

  return (
    <div className="space-y-3">
      {value ? (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 dark:border-white/10 dark:bg-white/[0.03]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-14 w-24 shrink-0 rounded-lg bg-white object-contain ring-1 ring-slate-200 dark:bg-ink-950 dark:ring-white/10" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{value.startsWith("/api/ad-image/") ? "Uploaded image" : "External image"}</p>
            <p className="truncate font-mono text-xs text-slate-400">{value}</p>
          </div>
          <Button size="sm" onClick={() => input.current?.click()} loading={!!busy}>
            Replace
          </Button>
          <IconButton icon={X} label="Remove image" onClick={() => onChange("")} />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            upload(e.dataTransfer.files?.[0]);
          }}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-7 text-center transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20 ${drag ? "border-brand-400 bg-brand-50/60 dark:border-brand-400/60 dark:bg-brand-400/10" : "border-slate-200 hover:border-brand-300 hover:bg-slate-50 dark:border-white/10 dark:hover:border-brand-400/40 dark:hover:bg-white/[0.03]"}`}
        >
          {busy ? <Loader2 className="h-6 w-6 animate-spin text-brand-500" /> : <CloudUpload className="h-6 w-6 text-slate-400" />}
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{busy || "Drop an image here, or click to choose"}</span>
          <span className="text-xs text-slate-400">JPG, PNG, WebP or GIF · resized to 1600px and compressed to WebP automatically</span>
        </button>
      )}
      <input ref={input} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={(e) => { upload(e.target.files?.[0]); e.target.value = ""; }} />

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Link2 className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input aria-label="Image URL" className={`${inputCls} ps-9`} value={value} onChange={(e) => onChange(e.target.value.trim())} placeholder="…or paste an image URL (https://…)" />
        </div>
        <Button icon={Images} onClick={() => setLibOpen((o) => !o)} aria-expanded={libOpen}>
          Library
        </Button>
      </div>

      {libOpen && (
        <div className="rounded-xl border border-slate-200 p-3 dark:border-white/10">
          {!lib ? (
            <p className="py-4 text-center text-sm text-slate-400">Loading images…</p>
          ) : lib.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-400">No uploaded images yet.</p>
          ) : (
            <ul className="grid max-h-64 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
              {lib.map((img) => (
                <li key={img.id} className={`group relative overflow-hidden rounded-lg ring-1 ${value === img.url ? "ring-2 ring-brand-500" : "ring-slate-200 dark:ring-white/10"}`}>
                  <button type="button" onClick={() => onChange(img.url, { width: img.width, height: img.height })} className="block w-full" title={`${img.name || img.id} · ${img.width}×${img.height} · ${fmtBytes(img.size)}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.name || "Uploaded image"} loading="lazy" className="h-20 w-full bg-slate-50 object-contain dark:bg-ink-950" />
                    <span className="block truncate px-1.5 py-1 text-start text-[10px] text-slate-500 dark:text-slate-400">
                      {img.width}×{img.height} · {fmtBytes(img.size)}
                      {img.usedBy ? ` · ${img.usedBy} ad${img.usedBy > 1 ? "s" : ""}` : " · unused"}
                    </span>
                  </button>
                  <IconButton icon={Trash2} label="Delete image" variant="danger" onClick={() => removeImg(img)} className="absolute end-1 top-1 !h-6 !w-6 opacity-0 group-hover:opacity-100 focus:opacity-100" />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
