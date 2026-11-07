"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, GitCompareArrows, Loader2, Timer, Trophy } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useLocale } from "@/i18n/client";
import { pick } from "@/i18n/config";
import { accountMessages, fmt } from "@/i18n/messages/account";
import { speedTestMessages } from "@/i18n/messages/speedtest";
import { RATING_TONE, coloCity, rateConnection } from "@/components/speedtest/format";
import { EmptyBox, ProviderMark, fmtDate, msf, sp, testLabel, type AccountTest } from "./shared";

type Metric = "download" | "upload" | "ping";
const METRICS: { key: Metric; higher: boolean; icon: typeof ArrowDown; unit: string }[] = [
  { key: "download", higher: true, icon: ArrowDown, unit: "Mbps" },
  { key: "upload", higher: true, icon: ArrowUp, unit: "Mbps" },
  { key: "ping", higher: false, icon: Timer, unit: "ms" },
];

export default function CompareTab({ tests, initialA, initialB }: { tests: AccountTest[] | null; initialA: string; initialB: string }) {
  const locale = useLocale();
  const t = pick(accountMessages, locale);
  const st = pick(speedTestMessages, locale);
  const [a, setA] = useState(initialA);
  const [b, setB] = useState(initialB);

  // Default: the two most recent tests (prefer two different providers).
  useEffect(() => {
    if (!tests || tests.length < 2) return;
    if (!a || !tests.some((x) => x.id === a)) setA(tests[0].id);
    if (!b || !tests.some((x) => x.id === b)) {
      const other = tests.find((x) => x.id !== tests[0].id && x.provider !== tests[0].provider) || tests[1];
      setB(other.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tests]);

  const A = tests?.find((x) => x.id === a) || null;
  const B = tests?.find((x) => x.id === b) || null;

  const rows = useMemo(() => {
    if (!A || !B) return [];
    return METRICS.map((m) => {
      const va = A[m.key];
      const vb = B[m.key];
      let winner: "a" | "b" | "tie" | null = null;
      let pct: number | null = null;
      if (va != null && vb != null) {
        if (Math.abs(va - vb) < 1e-9) winner = "tie";
        else winner = m.higher ? (va > vb ? "a" : "b") : va < vb ? "a" : "b";
        const better = winner === "a" ? va : vb;
        const worse = winner === "a" ? vb : va;
        if (winner !== "tie" && worse > 0) pct = Math.round((m.higher ? (better - worse) / worse : (worse - better) / worse) * 100);
      }
      return { ...m, va, vb, winner, pct };
    });
  }, [A, B]);

  if (!tests) return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-slate-400" aria-label={t.dash.loading} /></div>;
  if (tests.length < 2) return <EmptyBox icon={GitCompareArrows} title={t.compare.title} text={t.compare.needTwo} />;

  const winsA = rows.filter((r) => r.winner === "a").length;
  const winsB = rows.filter((r) => r.winner === "b").length;
  const overall = winsA === winsB ? null : winsA > winsB ? "a" : "b";
  const chart = [
    { name: t.tests.down, A: A?.download ?? 0, B: B?.download ?? 0 },
    { name: t.tests.up, A: A?.upload ?? 0, B: B?.upload ?? 0 },
  ];

  const Select = ({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) => (
    <label className="block">
      <span className="label">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="input">
        {tests.map((x) => (
          <option key={x.id} value={x.id}>
            {testLabel(x, locale, t.tests.unknown)}
          </option>
        ))}
      </select>
    </label>
  );

  const Card = ({ x, side }: { x: AccountTest; side: "a" | "b" }) => {
    const rating = rateConnection({ download: x.download, upload: x.upload, ping: x.ping, jitter: x.jitter });
    const win = overall === side;
    return (
      <div className={`card relative p-5 ${win ? "ring-2 ring-emerald-500/60" : ""}`}>
        {win && (
          <span className="absolute -top-3 end-4 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white shadow">
            <Trophy className="h-3.5 w-3.5" aria-hidden="true" /> {t.compare.overall}
          </span>
        )}
        <p className="kicker">{side === "a" ? t.compare.a : t.compare.b}</p>
        <div className="mt-3 flex items-center gap-3">
          <ProviderMark name={x.provider || "?"} domain={x.providerDomain} size={44} />
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-slate-900 dark:text-white">{x.provider || t.tests.unknown}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {fmtDate(x.ts, locale)}
              {x.server ? ` · ${coloCity(x.server)}` : ""}
            </p>
          </div>
        </div>
        {rating && <span className={`mt-3 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${RATING_TONE[rating.rating]}`}>{st.verdict.ratings[rating.rating]}</span>}
        <dl className="mt-4 grid grid-cols-3 gap-2">
          {rows.map((r) => {
            const v = side === "a" ? r.va : r.vb;
            const best = r.winner === side;
            return (
              <div key={r.key} className={`rounded-xl p-2.5 ${best ? "bg-emerald-50 dark:bg-emerald-400/10" : "bg-slate-50 dark:bg-white/[0.04]"}`}>
                <dt className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  <r.icon className="h-3 w-3" aria-hidden="true" /> {r.key === "download" ? t.tests.down : r.key === "upload" ? t.tests.up : t.tests.ping}
                </dt>
                <dd className={`mt-0.5 text-lg font-extrabold tabular-nums ${best ? "text-emerald-700 dark:text-emerald-300" : "text-slate-900 dark:text-white"}`} dir="ltr">
                  {r.key === "ping" ? msf(v, locale) : sp(v, locale)} <span className="text-[10px] font-semibold text-slate-400">{r.unit}</span>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <section className="card p-5 sm:p-6">
        <h2 className="h-card">{t.compare.title}</h2>
        <p className="muted mt-1 text-sm">{t.compare.subtitle}</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Select value={a} onChange={setA} label={t.compare.a} />
          <Select value={b} onChange={setB} label={t.compare.b} />
        </div>
      </section>

      {A && B && (
        <>
          <div className="grid gap-5 pt-2 md:grid-cols-2">
            <Card x={A} side="a" />
            <Card x={B} side="b" />
          </div>

          <section className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-white/[0.06] dark:text-slate-400 [&_th]:px-4 [&_th]:py-3">
                  <th className="text-start">{t.compare.metric}</th>
                  <th className="text-end">{t.compare.a}</th>
                  <th className="text-end">{t.compare.b}</th>
                  <th className="text-end">{t.compare.winner}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06] [&_td]:px-4 [&_td]:py-3">
                {rows.map((r) => (
                  <tr key={r.key}>
                    <td className="font-medium text-slate-700 dark:text-slate-200">{r.key === "download" ? t.tests.down : r.key === "upload" ? t.tests.up : t.tests.ping}</td>
                    <td className={`text-end tabular-nums ${r.winner === "a" ? "font-bold text-emerald-600 dark:text-emerald-400" : ""}`}>{r.key === "ping" ? msf(r.va, locale) : sp(r.va, locale)}</td>
                    <td className={`text-end tabular-nums ${r.winner === "b" ? "font-bold text-emerald-600 dark:text-emerald-400" : ""}`}>{r.key === "ping" ? msf(r.vb, locale) : sp(r.vb, locale)}</td>
                    <td className="text-end text-xs">
                      {r.winner === "tie" ? (
                        <span className="text-slate-500">{t.compare.tie}</span>
                      ) : r.winner ? (
                        <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                          {r.winner === "a" ? t.compare.a : t.compare.b}
                          {r.pct != null && r.pct > 0 && <span className="ms-1 font-normal text-slate-500">· {fmt(r.higher ? t.compare.faster : t.compare.lower, { p: r.pct })}</span>}
                        </span>
                      ) : (
                        "–"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!overall && <p className="border-t border-slate-100 px-4 py-3 text-center text-sm font-semibold text-slate-600 dark:border-white/[0.06] dark:text-slate-300">{t.compare.draw}</p>}
          </section>

          <section className="card p-4 sm:p-6">
            <div className="h-64 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-white/10" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={44} />
                  <Tooltip formatter={(v: number) => `${sp(v, locale)} Mbps`} contentStyle={{ borderRadius: 12, fontSize: 12 }} cursor={{ fill: "rgba(148,163,184,.12)" }} />
                  <Legend formatter={(v) => `${v === "A" ? t.compare.a : t.compare.b}: ${(v === "A" ? A.provider : B.provider) || t.tests.unknown}`} wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="A" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={64} />
                  <Bar dataKey="B" fill="#8b5cf6" radius={[6, 6, 0, 0]} maxBarSize={64} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
