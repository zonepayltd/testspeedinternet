"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Wifi } from "lucide-react";
import { useLocale } from "@/i18n/client";
import { lp, pick } from "@/i18n/config";
import { accountMessages, fmt } from "@/i18n/messages/account";
import { apiJson } from "../useAccount";
import { EmptyBox, ProviderMark, Stars, fmtDate, msf, sp, type MyProvider } from "./shared";

export default function ProvidersTab() {
  const locale = useLocale();
  const t = pick(accountMessages, locale);
  const [list, setList] = useState<MyProvider[] | null>(null);

  useEffect(() => {
    apiJson<{ providers?: MyProvider[] }>("/api/account/providers", "GET").then((r) => setList(r.ok ? r.providers || [] : []));
  }, []);

  if (!list) return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-slate-400" aria-label={t.dash.loading} /></div>;
  if (!list.length) return <EmptyBox icon={Wifi} title={t.providers.title} text={t.providers.empty} />;

  return (
    <div>
      <div className="mb-4">
        <h2 className="h-card">{t.providers.title}</h2>
        <p className="muted text-sm">{t.providers.subtitle}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {list.map((p) => (
          <article key={p.slug} className="card flex flex-col p-5">
            <div className="flex items-center gap-3">
              <ProviderMark name={p.name} domain={p.domain} size={48} />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-lg font-bold text-slate-900 dark:text-white">{p.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {p.tests} {t.providers.tests} · {fmtDate(p.lastTest, locale, false)}
                </p>
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                { k: t.tests.down, v: sp(p.avgDownload, locale), best: sp(p.bestDownload, locale), u: "Mbps", c: "text-blue-600 dark:text-blue-400" },
                { k: t.tests.up, v: sp(p.avgUpload, locale), best: sp(p.bestUpload, locale), u: "Mbps", c: "text-violet-600 dark:text-violet-400" },
                { k: t.tests.ping, v: msf(p.avgPing, locale), best: msf(p.bestPing, locale), u: "ms", c: "text-emerald-600 dark:text-emerald-400" },
              ].map((m) => (
                <div key={m.k} className="rounded-xl bg-slate-50 p-2.5 dark:bg-white/[0.04]">
                  <dt className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{m.k}</dt>
                  <dd className={`mt-0.5 text-lg font-extrabold tabular-nums ${m.c}`} dir="ltr">
                    {m.v} <span className="text-[10px] font-semibold text-slate-400">{m.u}</span>
                  </dd>
                  <dd className="text-[10.5px] text-slate-400" dir="ltr">
                    {t.providers.best}: {m.best}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-white/[0.06]">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 [html[lang=ar]_&]:normal-case">{t.providers.community}</p>
                {p.community && p.community.count > 0 ? (
                  <p className="mt-1 flex items-center gap-2 text-sm">
                    <Stars value={p.community.average} />
                    <span className="font-bold text-slate-900 dark:text-white">{p.community.average.toFixed(1)}</span>
                    <span className="text-slate-500">· {fmt(t.providers.reviewsN, { n: p.community.count })}</span>
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-slate-500">{t.providers.noReviews}</p>
                )}
              </div>
              <Link href={lp(locale, `/providers/${p.slug}`)} className="btn-secondary shrink-0 px-3 py-2 text-xs">
                {t.providers.see} <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
