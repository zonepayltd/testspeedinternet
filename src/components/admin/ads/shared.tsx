"use client";

import { Code, ImageIcon, LayoutTemplate, Megaphone, Type, type LucideIcon } from "lucide-react";
import { Badge, type Tone } from "@/components/admin/ui";
import type { AdStatus, AdType } from "@/lib/adsModel";

export const TYPE_META: Record<AdType, { label: string; icon: LucideIcon; tone: Tone }> = {
  adsense: { label: "AdSense", icon: Megaphone, tone: "amber" },
  image: { label: "Image", icon: ImageIcon, tone: "blue" },
  card: { label: "Card", icon: LayoutTemplate, tone: "violet" },
  text: { label: "Text", icon: Type, tone: "cyan" },
  html: { label: "HTML / Script", icon: Code, tone: "rose" },
};

export const STATUS_META: Record<AdStatus, { label: string; tone: Tone; dot: string }> = {
  active: { label: "Active", tone: "green", dot: "bg-emerald-500" },
  scheduled: { label: "Scheduled", tone: "blue", dot: "bg-brand-500" },
  expired: { label: "Expired", tone: "amber", dot: "bg-amber-500" },
  disabled: { label: "Disabled", tone: "slate", dot: "bg-slate-400" },
};

export function TypeBadge({ type }: { type: AdType }) {
  const m = TYPE_META[type];
  const Icon = m.icon;
  return (
    <Badge tone={m.tone} className="whitespace-nowrap">
      <Icon className="h-3 w-3" aria-hidden="true" />
      {m.label}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: AdStatus }) {
  const m = STATUS_META[status];
  return (
    <Badge tone={m.tone} className="whitespace-nowrap">
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} aria-hidden="true" />
      {m.label}
    </Badge>
  );
}

export const ctrOf = (clicks: number, imps: number) => (imps ? (clicks / imps) * 100 : 0);
export const fmtPct = (n: number) => `${n.toFixed(n > 0 && n < 10 ? 2 : 1)}%`;

/** ms → value for <input type="datetime-local"> (local time). */
export const toLocalInput = (ms: number) => (ms ? new Date(ms - new Date(ms).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "");
export const fromLocalInput = (v: string) => (v ? new Date(v).getTime() || 0 : 0);

export const fmtBytes = (n: number) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);
