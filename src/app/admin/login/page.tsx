"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, Eye, EyeOff, Gauge, Loader2, Lock, ShieldCheck, User } from "lucide-react";
import SliderCaptcha from "@/components/SliderCaptcha";
import { COMPANY } from "@/lib/company";

const fieldCls =
  "h-11 w-full rounded-xl border border-slate-200 bg-white ps-10 text-sm text-slate-900 shadow-sm shadow-slate-900/[0.02] transition-colors placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 aria-[invalid=true]:border-rose-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-brand-400 dark:aria-[invalid=true]:border-rose-400/40";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaKey, setCaptchaKey] = useState(0); // bump to re-render (reset) the widget
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const userRef = useRef<HTMLInputElement>(null);

  const onVerify = useCallback((token: string) => setCaptchaToken(token), []);

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    if (!username.trim() || !password) {
      setError("Enter your username and password.");
      return;
    }
    if (!captchaToken) {
      setError("Please complete the security check.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, captchaToken }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(data.error || (res.status === 429 ? "Too many attempts. Please wait a moment." : "Sign in failed."));
        setLoading(false);
        // Captcha passes are single-use: verify again for the next try.
        setCaptchaToken("");
        setCaptchaKey((k) => k + 1);
        return;
      }
      setSuccess(true);
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Network error. Check your connection and try again.");
      setLoading(false);
    }
  };

  const onPwKey = (e: React.KeyboardEvent<HTMLInputElement>) => setCapsLock(e.getModifierState?.("CapsLock") ?? false);
  const invalid = Boolean(error) && !loading;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50 text-slate-900 dark:bg-ink-950 dark:text-white">
      {/* Background: soft brand glow + faint grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-18rem] h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-brand-400/25 via-brand-500/10 to-transparent blur-3xl dark:from-brand-500/20 dark:via-brand-600/10" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(15_23_42/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(15_23_42/0.04)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)] dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.04)_1px,transparent_1px)]" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-white/70 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to site
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-16 pt-2">
        <div className="w-full max-w-[400px] animate-fade-in-up">
          <div className="mb-7 flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/30 ring-1 ring-inset ring-white/20">
              <Gauge className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="mt-4 text-sm font-semibold tracking-tight text-slate-500 dark:text-slate-400" dir="ltr">
              Test Speed <span className="text-brand-600 dark:text-brand-400">Internet</span>
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Sign in to Admin</h1>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-slate-900/[0.06] backdrop-blur-sm dark:border-white/[0.08] dark:bg-ink-900/90 dark:shadow-black/30 sm:p-7"
          >
            {error && (
              <div role="alert" className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="admin-user" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Username
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                  <input
                    id="admin-user"
                    ref={userRef}
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    required
                    aria-invalid={invalid}
                    placeholder="Username"
                    className={`${fieldCls} pe-3`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="admin-pass" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                  <input
                    id="admin-pass"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyUp={onPwKey}
                    onKeyDown={onPwKey}
                    autoComplete="current-password"
                    required
                    aria-invalid={invalid}
                    placeholder="••••••••"
                    className={`${fieldCls} pe-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                    aria-pressed={showPw}
                    className="absolute inset-y-0 end-0 flex w-11 items-center justify-center rounded-e-xl text-slate-400 transition-colors hover:text-slate-700 focus:outline-none focus-visible:text-brand-600 dark:hover:text-slate-200"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                  </button>
                </div>
                {capsLock && <p className="mt-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">Caps Lock is on</p>}
              </div>

              <SliderCaptcha key={captchaKey} context="login" onChange={onVerify} invalid={!!error && !captchaToken} />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="group mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-all hover:bg-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-brand-500 dark:hover:bg-brand-400"
            >
              {loading || success ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  {success ? "Opening dashboard…" : "Signing in…"}
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Restricted area · {COMPANY.legalName}
          </p>
        </div>
      </main>
    </div>
  );
}
