"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { Badge, Button, Card, inputCls, api, useAdminUI, timeAgo } from "@/components/admin/ui";

type Account = { username: string; firebase: boolean; storedInFirebase: boolean; storedUsername: string | null; updatedAt: number | null; envLogin: boolean };

function PasswordInput({ id, value, onChange, autoComplete }: { id: string; value: string; onChange: (v: string) => void; autoComplete: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input id={id} type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} className={`${inputCls} pe-10`} />
      <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"} className="absolute inset-y-0 end-0 flex w-9 items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

/** Settings → Security: change the admin username/password (stored in Firebase). */
export default function SecurityPanel() {
  const { toast } = useAdminUI();
  const [acc, setAcc] = useState<Account | null>(null);
  const [username, setUsername] = useState("");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () =>
    api<Account & { ok: boolean }>("/api/admin/account")
      .then((d) => {
        setAcc(d);
        setUsername(d.storedUsername || d.username);
      })
      .catch(() => setError("Couldn't load account info."));
  useEffect(() => {
    load();
  }, []);

  const strength = (() => {
    let s = 0;
    if (next.length >= 10) s++;
    if (next.length >= 14) s++;
    if (/[a-z]/.test(next) && /[A-Z]/.test(next)) s++;
    if (/\d/.test(next)) s++;
    if (/[^a-zA-Z0-9]/.test(next)) s++;
    return s;
  })();
  const strengthLabel = ["Too weak", "Weak", "Fair", "Good", "Strong", "Very strong"][strength];

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (next !== confirm) return setError("The new passwords don't match.");
    setSaving(true);
    try {
      await api("/api/admin/account", { method: "PUT", json: { currentPassword: current, username, newPassword: next } });
      toast("Login updated — saved in Firebase");
      setCurrent("");
      setNext("");
      setConfirm("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Where your login is stored" icon={ShieldCheck}>
        {!acc ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : (
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between gap-3">
              <span className="text-slate-600 dark:text-slate-300">Firebase (main — change it below, works instantly)</span>
              {acc.storedInFirebase ? <Badge tone="green">Saved · {acc.updatedAt ? timeAgo(acc.updatedAt) : "set"}</Badge> : acc.firebase ? <Badge tone="amber">Not set yet</Badge> : <Badge tone="rose">Firebase not connected</Badge>}
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-slate-600 dark:text-slate-300">Vercel environment variables (ADMIN_USERNAME / ADMIN_PASSWORD)</span>
              {acc.envLogin ? <Badge tone="blue">Also works</Badge> : <Badge tone="slate">Not set</Badge>}
            </li>
          </ul>
        )}
        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
          You can sign in with either. The Firebase password is stored only as an encrypted hash. 8 wrong attempts lock sign-in for 15 minutes.
        </p>
      </Card>

      <Card title="Change username & password" icon={KeyRound}>
        <form onSubmit={save} className="grid max-w-lg gap-4">
          <div>
            <label htmlFor="sec-user" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Username</label>
            <input id="sec-user" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" className={inputCls} />
          </div>
          <div>
            <label htmlFor="sec-cur" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Current password</label>
            <PasswordInput id="sec-cur" value={current} onChange={setCurrent} autoComplete="current-password" />
          </div>
          <div>
            <label htmlFor="sec-new" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">New password</label>
            <PasswordInput id="sec-new" value={next} onChange={setNext} autoComplete="new-password" />
            {next && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex flex-1 gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span key={i} className={`h-1.5 flex-1 rounded-full ${i < strength ? (strength >= 4 ? "bg-emerald-500" : strength >= 3 ? "bg-brand-500" : "bg-amber-500") : "bg-slate-200 dark:bg-white/10"}`} />
                  ))}
                </div>
                <span className="w-24 text-end text-xs text-slate-500">{strengthLabel}</span>
              </div>
            )}
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">At least 10 characters, with letters and a number.</p>
          </div>
          <div>
            <label htmlFor="sec-conf" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Confirm new password</label>
            <PasswordInput id="sec-conf" value={confirm} onChange={setConfirm} autoComplete="new-password" />
          </div>
          {error && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-400/10 dark:text-rose-300">{error}</p>}
          <div>
            <Button type="submit" variant="primary" loading={saving} disabled={!acc?.firebase || !current || !next || !username}>
              Save new login
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
