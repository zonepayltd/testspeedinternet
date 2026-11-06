"use client";

import { Copy, Database, ExternalLink, KeyRound, Terminal } from "lucide-react";
import { useState } from "react";

/** True when an API error means "this server has no Firebase credentials". */
export const isFirebaseMissing = (msg?: string | null) => !!msg && /firebase (admin )?(is )?not (configured|connected)/i.test(msg);

function CopyLine({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <div className="flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 font-mono text-[12px] text-slate-100 dark:bg-black/40">
      <span className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap">{text}</span>
      <button
        type="button"
        onClick={() => navigator.clipboard?.writeText(text).then(() => { setDone(true); setTimeout(() => setDone(false), 1500); })}
        className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white"
        aria-label="Copy command"
      >
        {done ? <span className="text-[11px] text-emerald-400">Copied</span> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

/** Friendly panel shown instead of "Firebase not configured" errors. */
export default function FirebaseSetup({ compact = false }: { compact?: boolean }) {
  const steps = [
    {
      icon: ExternalLink,
      title: "Download your Firebase key",
      body: (
        <>
          Open{" "}
          <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-600 underline-offset-2 hover:underline dark:text-brand-400">
            console.firebase.google.com
          </a>{" "}
          → your project → ⚙️ <b>Project settings</b> → <b>Service accounts</b> → <b>Generate new private key</b>. A <code>.json</code> file downloads. Keep it private — never share or upload it.
        </>
      ),
    },
    {
      icon: Terminal,
      title: "Connect it (once)",
      body: (
        <>
          Put the file in your project folder and run this in the VS Code terminal (replace the file name):
          <div className="mt-2">
            <CopyLine text="node scripts/setup-firebase.mjs ./your-key-file.json" />
          </div>
        </>
      ),
    },
    {
      icon: KeyRound,
      title: "Restart and refresh",
      body: (
        <>
          Stop the dev server (<b>Ctrl+C</b>), start it again with <code>npm run dev</code>, and refresh this page. On the live site (Vercel) Firebase is set in <b>Settings → Environment Variables</b>.
        </>
      ),
    },
  ];

  return (
    <div className={`overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50 to-white dark:border-amber-400/20 dark:from-amber-400/[0.06] dark:to-transparent ${compact ? "" : "mx-auto max-w-3xl"}`}>
      <div className="flex items-start gap-3 border-b border-amber-200/70 px-5 py-4 dark:border-amber-400/15">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300">
          <Database className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Connect Firebase to see your data</h2>
          <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">
            Visitors, speed tests, messages, ads and settings are stored in Firebase. This server doesn&apos;t have the Firebase key yet, so there&apos;s nothing to show.
          </p>
        </div>
      </div>
      <ol className="divide-y divide-amber-100 dark:divide-white/[0.05]">
        {steps.map((s, i) => (
          <li key={s.title} className="flex gap-3 px-5 py-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-amber-700 ring-1 ring-amber-200 dark:bg-white/5 dark:text-amber-300 dark:ring-amber-400/20">{i + 1}</span>
            <div className="min-w-0 text-sm text-slate-600 dark:text-slate-300 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:font-mono [&_code]:text-[12px] dark:[&_code]:bg-white/10">
              <p className="font-semibold text-slate-900 dark:text-white">{s.title}</p>
              <div className="mt-1 leading-relaxed">{s.body}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
