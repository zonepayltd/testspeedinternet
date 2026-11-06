"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";
import { Button, inputCls } from "@/components/admin/ui";

/** "Delete…" dropdown with a "older than N days" action and a "delete everything" action. */
export function DeleteMenu({ allLabel, olderLabel = "Delete older than", onOlder, onAll, busy }: {
  allLabel: string;
  olderLabel?: string;
  onOlder?: (days: number) => void;
  onAll: () => void;
  busy?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState(90);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <Button variant="secondary" icon={Trash2} loading={busy} onClick={() => setOpen(!open)} aria-haspopup="menu" aria-expanded={open} className="text-rose-600 dark:text-rose-400">
        Delete… <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
      </Button>
      {open && (
        <div role="menu" className="absolute end-0 z-50 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-white/10 dark:bg-ink-900">
          {onOlder && (
            <div className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
              <label htmlFor="older-days" className="text-xs font-medium text-slate-500 dark:text-slate-400">{olderLabel}</label>
              <div className="mt-1.5 flex items-center gap-2">
                <input id="older-days" type="number" min={1} max={3650} value={days} onChange={(e) => setDays(Math.max(1, Number(e.target.value) || 1))} className={`${inputCls} h-8 w-20 text-xs tabular-nums`} />
                <span className="text-xs text-slate-500 dark:text-slate-400">days</span>
                <Button size="sm" variant="danger" className="ms-auto" onClick={() => { setOpen(false); onOlder(days); }}>Delete</Button>
              </div>
            </div>
          )}
          <button
            type="button"
            role="menuitem"
            onClick={() => { setOpen(false); onAll(); }}
            className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-start text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-400/10 ${onOlder ? "mt-2" : ""}`}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" /> {allLabel}
          </button>
        </div>
      )}
    </div>
  );
}
