// Two-column layout for sign in / sign up / password pages: form card + benefits panel.
import { BarChart3, CheckCircle2, GitCompareArrows, ShieldCheck, Star } from "lucide-react";
import type { AccountMessages } from "@/i18n/messages/account";

const ICONS = [BarChart3, GitCompareArrows, Star, ShieldCheck];

export default function AuthShell({ t, title, subtitle, children, aside = true }: { t: AccountMessages; title: string; subtitle?: string; children: React.ReactNode; aside?: boolean }) {
  return (
    <div className="hero-bg">
      <div aria-hidden="true" className="hero-glow" />
      <div className="container relative max-w-6xl py-10 md:py-16">
        <div className={`mx-auto grid items-start gap-8 ${aside ? "max-w-5xl lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-12" : "max-w-md"}`}>
          <div className="card p-6 shadow-xl shadow-slate-900/[0.04] sm:p-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-[1.7rem]">{title}</h1>
            {subtitle && <p className="muted mt-2 text-sm leading-relaxed">{subtitle}</p>}
            <div className="mt-6">{children}</div>
          </div>

          {aside && (
            <aside className="relative hidden overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-800 p-8 text-white shadow-2xl shadow-brand-900/20 ring-1 ring-inset ring-white/10 lg:block">
              <div aria-hidden="true" className="absolute -end-16 -top-20 h-64 w-64 rounded-full bg-cyan-400/30 blur-3xl" />
              <div aria-hidden="true" className="absolute -bottom-24 -start-10 h-56 w-56 rounded-full bg-indigo-400/25 blur-3xl" />
              <p className="relative text-xl font-extrabold leading-snug">{t.signup.title}</p>
              <ul className="relative mt-6 space-y-4">
                {t.signup.benefits.map((b, i) => {
                  const Icon = ICONS[i] || CheckCircle2;
                  return (
                    <li key={b} className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-inset ring-white/20">
                        <Icon className="h-[18px] w-[18px] text-cyan-200" aria-hidden="true" />
                      </span>
                      <span className="pt-1.5 text-sm leading-relaxed text-blue-50">{b}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="relative mt-8 rounded-2xl bg-white/10 p-4 ring-1 ring-inset ring-white/15 backdrop-blur" aria-hidden="true">
                <div className="flex items-end justify-between gap-3">
                  {[
                    ["↓", "248", "Mbps"],
                    ["↑", "41.6", "Mbps"],
                    ["◷", "12", "ms"],
                  ].map(([icon, v, u]) => (
                    <div key={icon} className="flex-1">
                      <p className="text-xs text-blue-100">{icon}</p>
                      <p className="text-xl font-extrabold tabular-nums" dir="ltr">
                        {v} <span className="text-xs font-semibold text-blue-100">{u}</span>
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex h-10 items-end gap-1">
                  {[40, 55, 48, 70, 62, 85, 78, 92, 74, 88, 96, 90].map((h, i) => (
                    <span key={i} className="flex-1 rounded-t bg-cyan-300/70" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
