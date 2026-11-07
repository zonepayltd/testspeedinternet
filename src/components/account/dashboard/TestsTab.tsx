"use client";

import { useState } from "react";
import Link from "next/link";
import { GitCompareArrows, ListChecks, Loader2, Trash2 } from "lucide-react";
import { useLocale } from "@/i18n/client";
import { lp, pick } from "@/i18n/config";
import { accountMessages, fmt } from "@/i18n/messages/account";
import { coloCity, flagUrl } from "@/components/speedtest/format";
import { apiJson } from "../useAccount";
import { EmptyBox, ProviderMark, fmtDate, msf, sp, type AccountTest } from "./shared";

export default function TestsTab({ tests, onChange, onCompare }: { tests: AccountTest[] | null; onChange: () => Promise<void> | void; onCompare: (a: string, b: string) => void }) {
  const locale = useLocale();
  const t = pick(accountMessages, locale);
  const [sel, setSel] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  if (!tests) return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-slate-400" aria-label={t.dash.loading} /></div>;
  if (!tests.length)
    return (
      <EmptyBox icon={ListChecks} title={t.dash.emptyTitle} text={t.dash.emptyText} action={<Link href={`${lp(locale, "/")}#speed-test`} className="btn-primary">{t.dash.runTest}</Link>} />
    );

  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s.slice(-1), id]));
  const remove = async (id: string) => {
    if (!window.confirm(t.tests.removeConfirm)) return;
    setBusy(id);
    await apiJson("/api/account/tests", "DELETE", { id });
    setSel((s) => s.filter((x) => x !== id));
    await onChange();
    setBusy(null);
  };

  return (
    <section className="card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 dark:border-white/[0.06] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="h-card">{t.dash.tabs.tests}</h2>
          <p className="muted text-xs">{fmt(t.tests.count, { n: tests.length })} · {t.tests.selectHint}</p>
        </div>
        <button type="button" disabled={sel.length !== 2} onClick={() => onCompare(sel[0], sel[1])} className="btn-primary px-4 py-2.5 text-sm">
          <GitCompareArrows className="h-4 w-4" aria-hidden="true" /> {t.tests.compareSel} {sel.length > 0 && `(${sel.length}/2)`}
        </button>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-start text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-white/[0.06] dark:text-slate-400 [&_th]:px-4 [&_th]:py-3 [&_th]:text-start">
              <th className="w-10"><span className="sr-only">✓</span></th>
              <th>{t.tests.date}</th>
              <th>{t.tests.provider}</th>
              <th>{t.tests.server}</th>
              <th className="!text-end">{t.tests.down}</th>
              <th className="!text-end">{t.tests.up}</th>
              <th className="!text-end">{t.tests.ping}</th>
              <th className="w-12"><span className="sr-only">{t.tests.actions}</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
            {tests.map((x) => {
              const checked = sel.includes(x.id);
              const flag = flagUrl(x.countryCode);
              return (
                <tr key={x.id} className={`transition-colors ${checked ? "bg-brand-50/70 dark:bg-brand-400/[0.07]" : "hover:bg-slate-50 dark:hover:bg-white/[0.03]"} [&_td]:px-4 [&_td]:py-3`}>
                  <td>
                    <input type="checkbox" checked={checked} onChange={() => toggle(x.id)} aria-label={t.tests.compareSel} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                  </td>
                  <td className="whitespace-nowrap text-slate-600 dark:text-slate-300">
                    {fmtDate(x.ts, locale)}
                    <span className="mt-0.5 block text-[11px] text-slate-400">{t.tests.modes[x.mode as keyof typeof t.tests.modes] || x.mode}</span>
                  </td>
                  <td>
                    <span className="flex items-center gap-2.5">
                      <ProviderMark name={x.provider || "?"} domain={x.providerDomain} size={30} />
                      <span className="min-w-0">
                        <span className="block max-w-[14rem] truncate font-semibold text-slate-900 dark:text-white">{x.provider || t.tests.unknown}</span>
                        {(x.city || x.countryCode) && (
                          <span className="flex items-center gap-1 text-[11px] text-slate-400">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            {flag && <img src={flag} alt="" width={14} height={10} className="h-2.5 w-3.5 rounded-[1px] object-cover" />}
                            {x.city || x.countryCode}
                          </span>
                        )}
                      </span>
                    </span>
                  </td>
                  <td className="whitespace-nowrap text-slate-500 dark:text-slate-400">{x.server ? coloCity(x.server) : "–"}</td>
                  <td className="text-end font-semibold tabular-nums text-blue-600 dark:text-blue-400">{sp(x.download, locale)}</td>
                  <td className="text-end font-semibold tabular-nums text-violet-600 dark:text-violet-400">{sp(x.upload, locale)}</td>
                  <td className="text-end tabular-nums text-slate-600 dark:text-slate-300">{msf(x.ping, locale)}</td>
                  <td className="text-end">
                    <button type="button" onClick={() => remove(x.id)} disabled={busy === x.id} aria-label={t.tests.remove} title={t.tests.remove} className="icon-btn h-8 w-8 text-slate-400 hover:text-rose-600">
                      {busy === x.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="divide-y divide-slate-100 dark:divide-white/[0.06] md:hidden">
        {tests.map((x) => {
          const checked = sel.includes(x.id);
          return (
            <li key={x.id} className={`flex items-start gap-3 px-4 py-3 ${checked ? "bg-brand-50/70 dark:bg-brand-400/[0.07]" : ""}`}>
              <input type="checkbox" checked={checked} onChange={() => toggle(x.id)} aria-label={t.tests.compareSel} className="mt-2 h-4 w-4 rounded border-slate-300 text-brand-600" />
              <ProviderMark name={x.provider || "?"} domain={x.providerDomain} size={34} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{x.provider || t.tests.unknown}</p>
                <p className="text-xs text-slate-500">{fmtDate(x.ts, locale)}</p>
                <p className="mt-1 flex gap-3 text-xs font-semibold tabular-nums" dir="ltr">
                  <span className="text-blue-600 dark:text-blue-400">↓ {sp(x.download, locale)}</span>
                  <span className="text-violet-600 dark:text-violet-400">↑ {sp(x.upload, locale)}</span>
                  <span className="text-slate-500">{msf(x.ping, locale)} ms</span>
                </p>
              </div>
              <button type="button" onClick={() => remove(x.id)} aria-label={t.tests.remove} className="icon-btn h-8 w-8 text-slate-400">
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
