"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  MailOpen,
  Phone,
  Tag,
  X,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Send,
  Inbox,
} from "lucide-react";

type Message = {
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

const fmt = (ms: number) => (ms ? new Date(ms).toLocaleString() : "—");

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Message | null>(null);
  const [reply, setReply] = useState("");

  const load = () => {
    setLoading(true);
    fetch("/api/admin/messages", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => (d.ok ? setMessages(d.messages) : setError(d.error || "Could not load messages")))
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const patch = async (id: string, body: { read?: boolean; handled?: boolean }) => {
    await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  };

  const open = (m: Message) => {
    setSelected(m);
    setReply("");
    if (!m.read) {
      patch(m.id, { read: true });
      setMessages((list) => list.map((x) => (x.id === m.id ? { ...x, read: true } : x)));
    }
  };

  const sendReply = () => {
    if (!selected) return;
    const subject = `Re: ${selected.subject || "Your message"}`;
    const url = `mailto:${selected.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(reply)}`;
    window.location.href = url;
    patch(selected.id, { handled: true });
    setMessages((list) => list.map((x) => (x.id === selected.id ? { ...x, handled: true } : x)));
    setSelected((s) => (s ? { ...s, handled: true } : s));
  };

  const toggleHandled = (m: Message) => {
    const v = !m.handled;
    patch(m.id, { handled: v });
    setMessages((list) => list.map((x) => (x.id === m.id ? { ...x, handled: v } : x)));
    if (selected?.id === m.id) setSelected({ ...m, handled: v });
  };

  const remove = async (m: Message) => {
    if (!confirm(`Delete the message from ${m.name || m.email}?`)) return;
    await fetch(`/api/admin/messages/${m.id}`, { method: "DELETE" });
    setMessages((list) => list.filter((x) => x.id !== m.id));
    if (selected?.id === m.id) setSelected(null);
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Messages</h1>
          <p className="mt-1 text-sm text-slate-500">
            Contact form submissions{unread > 0 ? ` · ${unread} unread` : ""}.
          </p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {loading && <p className="mt-6 text-sm text-slate-400">Loading…</p>}
      {error && <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">{error}</div>}

      {!loading && !error && messages.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <Inbox className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">No messages yet.</p>
        </div>
      )}

      {messages.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <ul className="divide-y divide-slate-100">
            {messages.map((m) => (
              <li
                key={m.id}
                className={`flex items-center transition-colors hover:bg-slate-50 ${!m.read ? "bg-brand-50/40" : ""}`}
              >
                <button
                  onClick={() => open(m)}
                  className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3.5 text-left"
                >
                  <span className={!m.read ? "text-brand-600" : "text-slate-300"}>
                    {m.read ? <MailOpen className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`truncate ${!m.read ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}>
                        {m.name || m.email}
                      </span>
                      {m.subject && (
                        <span className="hidden rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 sm:inline">
                          {m.subject}
                        </span>
                      )}
                      {m.handled && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                    </div>
                    <p className="mt-0.5 truncate text-sm text-slate-500">{m.message}</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400">{fmt(m.ts)}</span>
                </button>
                <button
                  onClick={() => remove(m)}
                  aria-label="Delete message"
                  title="Delete"
                  className="mr-2 shrink-0 rounded-lg p-2 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30" onClick={() => setSelected(null)}>
          <div className="flex h-full w-full max-w-lg flex-col bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-slate-200 p-5">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold text-slate-900">{selected.name || "Message"}</h2>
                <a href={`mailto:${selected.email}`} className="text-sm font-medium text-brand-600 hover:underline">{selected.email}</a>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                {selected.subject && <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1"><Tag className="h-3 w-3" />{selected.subject}</span>}
                {selected.phone && <a href={`tel:${selected.phone}`} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 hover:text-brand-600"><Phone className="h-3 w-3" />{selected.phone}</a>}
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">{fmt(selected.ts)}</span>
              </div>

              <div className="mt-4 whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-sm leading-relaxed text-slate-700">
                {selected.message}
              </div>

              {/* Reply */}
              <div className="mt-5">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Reply by email</label>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={5}
                  placeholder={`Hi ${selected.name?.split(" ")[0] || "there"},`}
                  className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
                <button
                  onClick={sendReply}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
                >
                  <Send className="h-4 w-4" /> Send reply
                </button>
                <p className="mt-1.5 text-xs text-slate-400">Opens your email app pre-filled to {selected.email}.</p>
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between gap-3 border-t border-slate-200 p-4">
              <button
                onClick={() => toggleHandled(selected)}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${selected.handled ? "bg-emerald-50 text-emerald-600" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
              >
                <CheckCircle2 className="h-4 w-4" /> {selected.handled ? "Handled" : "Mark handled"}
              </button>
              <button onClick={() => remove(selected)} className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
