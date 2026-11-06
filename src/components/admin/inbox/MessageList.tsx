"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2, Phone } from "lucide-react";
import { Badge } from "@/components/admin/ui";
import { avatarCls, fullDate, initials, shortTime, subjectTone, type Message } from "./shared";

export function Checkbox({ checked, indeterminate, onChange, label }: { checked: boolean; indeterminate?: boolean; onChange: (v: boolean) => void; label: string }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = Boolean(indeterminate && !checked);
  }, [indeterminate, checked]);
  return (
    <input
      ref={ref}
      type="checkbox"
      aria-label={label}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      onClick={(e) => e.stopPropagation()}
      className="h-4 w-4 cursor-pointer rounded accent-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 dark:accent-brand-500"
    />
  );
}

export function Avatar({ m, size = "md" }: { m: Pick<Message, "name" | "email">; size?: "md" | "lg" }) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${size === "lg" ? "h-11 w-11 text-sm" : "h-9 w-9 text-xs"} ${avatarCls(m.email || m.name)}`}
    >
      {initials(m.name, m.email)}
    </span>
  );
}

export function MessageRow({
  m,
  active,
  checked,
  onOpen,
  onCheck,
}: {
  m: Message;
  active: boolean;
  checked: boolean;
  onOpen: () => void;
  onCheck: (v: boolean) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <li
      ref={ref}
      aria-selected={active}
      className={`group relative flex cursor-pointer gap-3 border-b border-slate-100 px-4 py-3 transition-colors dark:border-white/[0.06] ${
        active
          ? "bg-brand-50/70 dark:bg-brand-400/[0.08]"
          : checked
            ? "bg-slate-50 dark:bg-white/[0.03]"
            : "hover:bg-slate-50 dark:hover:bg-white/[0.02]"
      }`}
      onClick={onOpen}
    >
      {active && <span className="absolute inset-y-0 start-0 w-0.5 bg-brand-500" aria-hidden="true" />}
      <div className="flex flex-col items-center gap-2 pt-0.5">
        <Checkbox checked={checked} onChange={onCheck} label={`Select message from ${m.name || m.email}`} />
      </div>
      <Avatar m={m} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            className={`min-w-0 flex-1 truncate text-start text-sm focus:outline-none focus-visible:underline ${
              m.read ? "font-medium text-slate-700 dark:text-slate-300" : "font-semibold text-slate-900 dark:text-white"
            }`}
          >
            {m.name || m.email || "Unknown sender"}
          </button>
          <time
            dateTime={new Date(m.ts).toISOString()}
            title={fullDate(m.ts)}
            className={`shrink-0 text-xs tabular-nums ${m.read ? "text-slate-400 dark:text-slate-500" : "font-semibold text-brand-600 dark:text-brand-300"}`}
          >
            {shortTime(m.ts)}
          </time>
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          {m.subject && (
            <Badge tone={subjectTone(m.subject)} className="!px-1.5 !py-0 text-[11px]">
              {m.subject}
            </Badge>
          )}
          {m.handled && (
            <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> Handled
            </span>
          )}
          {m.phone && <Phone className="h-3 w-3 text-slate-400" aria-label="Has phone number" />}
          {!m.read && <span className="ms-auto h-2 w-2 shrink-0 rounded-full bg-brand-500" aria-label="Unread" />}
        </div>
        <p className={`mt-1 line-clamp-2 text-[13px] leading-snug ${m.read ? "text-slate-500 dark:text-slate-400" : "text-slate-600 dark:text-slate-300"}`}>{m.message}</p>
      </div>
    </li>
  );
}
