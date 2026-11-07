"use client";

// Settings → Email: SMTP account used for confirmation / password-reset / review emails.
// The password is write-only: the API never sends it back.
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Eye, EyeOff, Loader2, Mail, PlugZap, Send, XCircle } from "lucide-react";
import { Badge, Button, api, inputCls, useAdminUI } from "@/components/admin/ui";
import { Note, Section } from "./fields";

type Status = {
  source: "admin" | "env" | "none";
  host: string; port: number; user: string; fromName: string; hasPassword: boolean;
  saved: { host: string; port: number; user: string; fromName: string; hasPassword: boolean };
  envConfigured: boolean;
  verify?: { ok: boolean; error?: string };
};

const DEFAULTS = { host: "smtp0001.neo.space", port: "465", user: "support@testspeedinternet.com", fromName: "TestSpeedInternet" };

export default function EmailPanel() {
  const { toast } = useAdminUI();
  const [st, setSt] = useState<Status | null>(null);
  const [form, setForm] = useState({ ...DEFAULTS, pass: "" });
  const [showPass, setShowPass] = useState(false);
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(false);
  const [conn, setConn] = useState<{ ok: boolean; error?: string } | null>(null);
  const [to, setTo] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const apply = (s: Status) => {
    setSt(s);
    const src = s.saved.user ? s.saved : s.source !== "none" ? s : null;
    setForm((f) => ({
      ...f,
      host: src?.host || DEFAULTS.host,
      port: String(src?.port || DEFAULTS.port),
      user: src?.user || DEFAULTS.user,
      fromName: src?.fromName || DEFAULTS.fromName,
      pass: "",
    }));
    setTo((t) => t || s.user || DEFAULTS.user);
  };

  const check = useCallback(async () => {
    setChecking(true);
    try {
      const s = await api<Status>("/api/admin/mail?verify=1");
      apply(s);
      setConn(s.verify || null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't load email settings");
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    api<Status>("/api/admin/mail")
      .then((s) => {
        apply(s);
        if (s.source !== "none") check();
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Couldn't load email settings"));
  }, [check]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const s = await api<Status>("/api/admin/mail", { method: "PUT", json: { ...form, port: Number(form.port) } });
      apply(s);
      setConn(s.verify || null);
      if (s.verify?.ok) toast("Saved — connected to the mail server");
      else toast("Saved, but the mail server rejected the login", "error");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const sendTest = async () => {
    setSending(true);
    try {
      const r = await api<{ message: string }>("/api/admin/mail", { method: "POST", json: { to } });
      toast(r.message);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Couldn't send", "error");
    } finally {
      setSending(false);
    }
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const sourceLabel = st?.source === "admin" ? "Saved here" : st?.source === "env" ? "Server environment (Vercel)" : "Not configured";

  return (
    <div className="space-y-6">
      <Section
        title="Connection"
        description="The mailbox the site sends from: account confirmations, password resets and review confirmations."
        actions={
          st ? (
            <span className="flex items-center gap-2">
              {checking ? (
                <Badge tone="slate"><Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />Checking…</Badge>
              ) : conn ? (
                conn.ok ? <Badge tone="green"><CheckCircle2 className="h-3 w-3" aria-hidden="true" />Connected</Badge> : <Badge tone="rose"><XCircle className="h-3 w-3" aria-hidden="true" />Login failed</Badge>
              ) : (
                <Badge tone={st.source === "none" ? "amber" : "slate"}>{sourceLabel}</Badge>
              )}
            </span>
          ) : null
        }
      >
        <div className="space-y-4 px-5 py-4">
          {!st && !error ? (
            <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" />Loading…</div>
          ) : (
            <>
              {conn && !conn.ok && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300">
                  <p className="font-semibold">The mail server refused the login.</p>
                  <p className="mt-0.5 break-words text-xs opacity-90">{conn.error}</p>
                  <p className="mt-1.5 text-xs">Check the mailbox password (the one you use to log in at mail.neo.space) and that SMTP access is allowed for this mailbox in your Neo admin.</p>
                </div>
              )}
              {st?.source === "env" && (
                <Note>Currently using the SMTP_* variables from the server environment. Saving here takes priority over them.</Note>
              )}
              <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
                <Field label="SMTP server" hint="Neo mail: smtp0001.neo.space">
                  <input value={form.host} onChange={set("host")} className={`${inputCls} font-mono`} placeholder="smtp0001.neo.space" autoComplete="off" />
                </Field>
                <Field label="Port" hint="465 = SSL (recommended), 587 = STARTTLS">
                  <select value={form.port} onChange={(e) => setForm((f) => ({ ...f, port: e.target.value }))} className={inputCls}>
                    <option value="465">465 (SSL)</option>
                    <option value="587">587 (STARTTLS)</option>
                  </select>
                </Field>
                <Field label="Email address (username)" hint="The full mailbox address">
                  <input type="email" value={form.user} onChange={set("user")} className={inputCls} placeholder="support@testspeedinternet.com" autoComplete="off" />
                </Field>
                <Field label="Password" hint={st?.saved.hasPassword ? "Saved · leave empty to keep it" : "Mailbox password"}>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} value={form.pass} onChange={set("pass")} className={`${inputCls} pe-10`} placeholder={st?.saved.hasPassword ? "••••••••••" : ""} autoComplete="new-password" />
                    <button type="button" onClick={() => setShowPass((v) => !v)} aria-label={showPass ? "Hide password" : "Show password"} className="absolute inset-y-0 end-0 flex w-9 items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </Field>
                <Field label="Sender name" hint="Shown as “From” in the inbox">
                  <input value={form.fromName} onChange={set("fromName")} className={inputCls} placeholder="TestSpeedInternet" maxLength={80} />
                </Field>
                <div className="flex items-end gap-2 sm:col-span-2">
                  <Button type="submit" variant="primary" icon={Mail} loading={saving}>Save &amp; test connection</Button>
                  {st && st.source !== "none" && <Button type="button" icon={PlugZap} loading={checking} onClick={check}>Test connection</Button>}
                </div>
              </form>
              {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}
            </>
          )}
        </div>
      </Section>

      <Section title="Send a test email" description="Sends a short branded test message so you can check delivery and the spam folder.">
        <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row">
          <input type="email" value={to} onChange={(e) => setTo(e.target.value)} className={`${inputCls} sm:max-w-sm`} placeholder="you@example.com" aria-label="Send test email to" />
          <Button icon={Send} loading={sending} disabled={!st || st.source === "none" || !to} onClick={sendTest}>Send test email</Button>
        </div>
      </Section>

      <Note>
        <span>
          Tip: add SPF/DKIM records for testspeedinternet.com in your Neo admin so confirmation emails don&apos;t land in spam. The list of sent emails is on the{" "}
          <Link href="/admin/emails" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">Emails</Link> page.
        </span>
      </Note>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{hint}</span>}
    </label>
  );
}
