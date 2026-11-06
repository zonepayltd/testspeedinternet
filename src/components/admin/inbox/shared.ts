import type { Tone } from "@/components/admin/ui";

export type Message = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  handled: boolean;
  ts: number;
};

export type Folder = "all" | "unread" | "handled";

export function initials(name: string, email: string): string {
  const src = name.trim() || email.split("@")[0] || "?";
  const parts = src.split(/[\s._-]+/).filter(Boolean);
  const s = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : src.slice(0, 2);
  return s.toUpperCase();
}

const AVATARS = [
  "bg-brand-100 text-brand-700 dark:bg-brand-400/15 dark:text-brand-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-300",
];

/** Stable colour per sender. */
export function avatarCls(key: string): string {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return AVATARS[h % AVATARS.length];
}

export function subjectTone(subject: string): Tone {
  const s = subject.toLowerCase();
  if (s.includes("bug") || s.includes("problem") || s.includes("error")) return "rose";
  if (s.includes("support") || s.includes("help")) return "blue";
  if (s.includes("advert") || s.includes("ads") || s.includes("business")) return "amber";
  if (s.includes("feedback") || s.includes("suggest")) return "green";
  if (s.includes("partner") || s.includes("press")) return "violet";
  return "slate";
}

/** Mail-client style time: "14:05" today, "Mon" this week, "5 Nov" this year, else "5 Nov 2024". */
export function shortTime(ms: number): string {
  if (!ms) return "";
  const d = new Date(ms);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const days = (now.getTime() - ms) / 86_400_000;
  if (days < 6) return d.toLocaleDateString("en-GB", { weekday: "short" });
  if (d.getFullYear() === now.getFullYear()) return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export const fullDate = (ms: number) =>
  ms ? new Date(ms).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "–";

export function replyHref(m: Message): string {
  const subject = `Re: ${m.subject || "Your message to TestSpeedInternet"}`;
  const quoted = m.message
    .split("\n")
    .map((l) => `> ${l}`)
    .join("\n");
  const body = `Hi ${m.name.split(" ")[0] || "there"},\n\n\n\n—\nOn ${fullDate(m.ts)}, ${m.name || m.email} wrote:\n${quoted}`;
  return `mailto:${m.email.replace(/[?&#\s]/g, "")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export const phoneDigits = (p: string) => p.replace(/[^\d+]/g, "");
export const whatsappHref = (p: string) => `https://wa.me/${p.replace(/\D/g, "")}`;
