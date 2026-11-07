"use client";

import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUp, Gauge, Hash, Loader2, Timer, Trophy } from "lucide-react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useLocale } from "@/i18n/client";
import { lp, pick } from "@/i18n/config";
import { accountMessages } from "@/i18n/messages/account";
import { numberLocale } from "@/components/speedtest/format";
import { COLORS, EmptyBox, ProviderMark, StatTile, fmtDate, msf, sp, type AccountTest } from "./shared";

const avg = (v: (number | null)[]) => {
  const n = v.filter((x): x is number => typeof x === "number");
  return n.length ? n.reduce((a, b) => a + b, 0) / n.length : null;
};

export default function Overview({ tests, onTab }: { tests: AccountTest[] | null; onTab: (t: "tests") => void }) {
  const locale = useLocale();
  const t = pick(accountMessages, locale);

  if (!tests) return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-slate-400" aria-label={t.dash.loading} /></div>;
  if (!tests.length) {
    return (
      <EmptyBox
        icon={Gauge}
        title={t.dash.emptyTitle}
        text={t.dash.emptyText}
        action={
          <Link href={`${lp(locale, "/")}#speed-test`} className="btn-primary">
            {t.dash.runTest}
          </Link>
        }
      />
    );
  }

  const downs = tests.map((x) => x.download);
  const best = Math.max(...downs.filter((x): x is number => typeof x === "number"), 0);
  const chart = [...tests]
    .reverse()
    .slice(-40)
    .map((x) => ({ t: x.ts, download: x.download, upload: x.upload }));
  const dateFmt = new Intl.DateTimeFormat(numberLocale(locale), { day: "numeric", month: "short" });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        <StatTile label={t.dash.stats.tests} value={String(tests.length)} icon={Hash} tone="bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300" />
        <StatTile label={t.dash.stats.avgDown} value={sp(avg(downs), locale)} unit="Mbps" icon={ArrowDown} tone="bg-blue-50 text-blue-600 dark:bg-blue-400/10 dark:text-blue-300" />
        <StatTile label={t.dash.stats.avgUp} value={sp(avg(tests.map((x) => x.upload)), locale)} unit="Mbps" icon={ArrowUp} tone="bg-violet-50 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300" />
        <StatTile label={t.dash.stats.avgPing} value={msf(avg(tests.map((x) => x.ping)), locale)} unit="ms" icon={Timer} tone="bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300" />
        <div className="col-span-2 lg:col-span-1">
          <StatTile label={t.dash.stats.bestDown} value={best ? sp(best, locale) : "–"} unit="Mbps" icon={Trophy} tone="bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300" />
        </div>
      </div>

      <section className="card p-4 sm:p-6">
        <h2 className="h-card">{t.dash.chartTitle}</h2>
        {chart.length < 2 ? (
          <p className="muted mt-3 text-sm">{t.dash.chartEmpty}</p>
        ) : (
          <div className="mt-4 h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-white/10" vertical={false} />
                <XAxis dataKey="t" tickFormatter={(v) => dateFmt.format(v)} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} minTickGap={24} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={44} />
                <Tooltip
                  labelFormatter={(v) => fmtDate(Number(v), locale)}
                  formatter={(v: number, name: string) => [`${sp(v, locale)} Mbps`, name === "download" ? t.tests.down : t.tests.up]}
                  contentStyle={{ borderRadius: 12, border: "1px solid rgba(148,163,184,.3)", fontSize: 12 }}
                />
                <Legend formatter={(v) => (v === "download" ? t.tests.down : t.tests.up)} wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="download" stroke={COLORS.download} strokeWidth={2.5} dot={{ r: 2.5 }} connectNulls />
                <Line type="monotone" dataKey="upload" stroke={COLORS.upload} strokeWidth={2.5} dot={{ r: 2.5 }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-white/[0.06] sm:px-6">
          <h2 className="h-card">{t.dash.latest}</h2>
          <button type="button" onClick={() => onTab("tests")} className="link inline-flex items-center gap-1 text-sm font-semibold">
            {t.dash.viewAll} <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </button>
        </div>
        <ul className="divide-y divide-slate-100 dark:divide-white/[0.06]">
          {tests.slice(0, 5).map((x) => (
            <li key={x.id} className="flex items-center gap-3 px-4 py-3 sm:px-6">
              <ProviderMark name={x.provider || "?"} domain={x.providerDomain} size={34} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{x.provider || t.tests.unknown}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{fmtDate(x.ts, locale)}</p>
              </div>
              <div className="flex gap-4 text-end text-sm tabular-nums" dir="ltr">
                <span className="font-semibold text-blue-600 dark:text-blue-400">↓ {sp(x.download, locale)}</span>
                <span className="hidden font-semibold text-violet-600 dark:text-violet-400 sm:inline">↑ {sp(x.upload, locale)}</span>
                <span className="hidden text-slate-500 md:inline">{msf(x.ping, locale)} ms</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
