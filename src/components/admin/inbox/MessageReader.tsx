"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Mail,
  MailOpen,
  MessageCircle,
  Phone,
  Reply,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Badge, Button, IconButton, useAdminUI } from "@/components/admin/ui";
import { Avatar } from "./MessageList";
import { fullDate, phoneDigits, replyHref, subjectTone, whatsappHref, type Message } from "./shared";

function CopyField({ icon: Icon, label, value, href }: { icon: typeof Mail; label: string; value: string; href: string }) {
  const { toast } = useAdminUI();
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      toast(`${label} copied`);
      setTimeout(() => setDone(false), 1500);
    } catch {
      toast("Could not copy to clipboard", "error");
    }
  };
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 py-1.5 pe-1.5 ps-3 dark:border-white/[0.08] dark:bg-white/[0.02]">
      <Icon className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</p>
        <a href={href} className="block truncate text-sm font-medium text-slate-800 hover:text-brand-600 dark:text-slate-100 dark:hover:text-brand-300">
          {value}
        </a>
      </div>
      <IconButton icon={done ? Check : Copy} label={`Copy ${label.toLowerCase()}`} onClick={copy} />
    </div>
  );
}

export default function MessageReader({
  m,
  onBack,
  onPrev,
  onNext,
  onToggleRead,
  onToggleHandled,
  onDelete,
}: {
  m: Message;
  onBack: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onToggleRead: () => void;
  onToggleHandled: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="flex h-full min-h-0 flex-col" aria-label={`Message from ${m.name || m.email}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-slate-100 px-3 py-2 dark:border-white/[0.06] sm:px-4">
        <IconButton icon={ArrowLeft} label="Back to inbox" onClick={onBack} className="lg:hidden" />
        <IconButton icon={m.read ? Mail : MailOpen} label={m.read ? "Mark as unread (u)" : "Mark as read (u)"} onClick={onToggleRead} />
        <IconButton
          icon={m.handled ? RotateCcw : CheckCircle2}
          label={m.handled ? "Mark as not handled (e)" : "Mark as handled (e)"}
          onClick={onToggleHandled}
          className={m.handled ? "" : "text-emerald-600 dark:text-emerald-400"}
        />
        <IconButton icon={Trash2} label="Delete message (#)" variant="danger-ghost" onClick={onDelete} />
        <div className="ms-auto flex items-center gap-1">
          <span className="me-1 hidden text-xs text-slate-400 xl:inline">
            <kbd className="rounded border border-slate-200 px-1 font-sans dark:border-white/10">j</kbd> /{" "}
            <kbd className="rounded border border-slate-200 px-1 font-sans dark:border-white/10">k</kbd> to navigate
          </span>
          <IconButton icon={ChevronUp} label="Newer message (k)" onClick={onPrev} disabled={!onPrev} />
          <IconButton icon={ChevronDown} label="Older message (j)" onClick={onNext} disabled={!onNext} />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={m.subject ? subjectTone(m.subject) : "slate"}>Contact form</Badge>
          {m.handled ? (
            <Badge tone="green">
              <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> Handled
            </Badge>
          ) : (
            <Badge tone="amber">Open</Badge>
          )}
          {!m.read && <Badge tone="blue">Unread</Badge>}
        </div>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
          {m.subject || "Contact message"}
        </h2>

        <div className="mt-4 flex items-center gap-3">
          <Avatar m={m} size="lg" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{m.name || "Unknown sender"}</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {m.email} · <time dateTime={new Date(m.ts).toISOString()}>{fullDate(m.ts)}</time>
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="mt-5 whitespace-pre-wrap break-words rounded-2xl border border-slate-100 bg-white px-5 py-4 text-[15px] leading-relaxed text-slate-700 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-slate-200" dir="auto">
          {m.message || <span className="italic text-slate-400">(empty message)</span>}
        </div>

        {/* Contact */}
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {m.email && <CopyField icon={Mail} label="Email" value={m.email} href={`mailto:${m.email}`} />}
          {m.phone && <CopyField icon={Phone} label="Phone" value={m.phone} href={`tel:${phoneDigits(m.phone)}`} />}
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-wrap gap-2">
          {m.email && (
            <a
              href={replyHref(m)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400"
            >
              <Reply className="h-4 w-4" aria-hidden="true" /> Reply by email
            </a>
          )}
          {m.phone && (
            <>
              <a
                href={`tel:${phoneDigits(m.phone)}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
              >
                <Phone className="h-4 w-4" aria-hidden="true" /> Call
              </a>
              <a
                href={whatsappHref(m.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-medium text-emerald-700 shadow-sm hover:bg-emerald-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-emerald-300 dark:hover:bg-emerald-400/10"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
              </a>
            </>
          )}
          <Button variant={m.handled ? "ghost" : "secondary"} icon={m.handled ? RotateCcw : CheckCircle2} onClick={onToggleHandled}>
            {m.handled ? "Reopen" : "Mark handled"}
          </Button>
        </div>
      </div>
    </article>
  );
}
