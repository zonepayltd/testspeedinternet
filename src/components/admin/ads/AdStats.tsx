"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Eye, MousePointerClick, Percent, RotateCcw } from "lucide-react";
import { Button, Card, Flag, Table, THead, TBody, fmtNum } from "@/components/admin/ui";
import type { Ad } from "@/lib/adsModel";
import { ctrOf, fmtPct } from "./shared";

let regionNames: Intl.DisplayNames | null = null;
const countryName = (cc: string) => {
  try {
    regionNames ??= new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(cc) || cc;
  } catch {
    return cc;
  }
};

export default function AdStats({ ad, onReset, resetting, isScript }: { ad: Ad; onReset: () => void; resetting?: boolean; isScript?: boolean }) {
  const days = useMemo(() => {
    const out: { day: string; label: string; impressions: number; clicks: number }[] = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i));
      const k = d.toISOString().slice(0, 10);
      out.push({ day: k, label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }), impressions: ad.impByDay[k] || 0, clicks: ad.clickByDay[k] || 0 });
    }
    return out;
  }, [ad]);
  const hasDaily = days.some((d) => d.impressions || d.clicks);

  const countries = useMemo(() => {
    const keys = new Set([...Object.keys(ad.impByCountry), ...Object.keys(ad.clickByCountry)]);
    return Array.from(keys)
      .map((cc) => ({ cc, imp: ad.impByCountry[cc] || 0, clk: ad.clickByCountry[cc] || 0 }))
      .sort((a, b) => b.imp - a.imp || b.clk - a.clk)
      .slice(0, 15);
  }, [ad]);

  const ctr = ctrOf(ad.clicks, ad.impressions);
  const tiles = [
    { label: "Impressions", value: fmtNum(ad.impressions), icon: Eye },
    { label: "Clicks", value: fmtNum(ad.clicks), icon: MousePointerClick },
    { label: "CTR", value: fmtPct(ctr), icon: Percent },
  ];

  return (
    <Card
      title="Performance"
      description={isScript ? "Clicks inside script ads are estimated" : "Since the ad was created or last reset"}
      actions={
        <Button size="sm" variant="ghost" icon={RotateCcw} onClick={onReset} loading={resetting}>
          Reset stats
        </Button>
      }
      bodyClassName="p-0"
    >
      <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 dark:divide-white/[0.06] dark:border-white/[0.06]">
        {tiles.map((t) => (
          <div key={t.label} className="px-4 py-3.5">
            <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              <t.icon className="h-3.5 w-3.5" aria-hidden="true" />
              {t.label}
            </p>
            <p className="mt-1 text-xl font-bold tabular-nums text-slate-900 dark:text-white">{t.value}</p>
          </div>
        ))}
      </div>

      <div className="px-3 pb-2 pt-4">
        <p className="px-2 text-xs font-medium text-slate-500 dark:text-slate-400">Last 30 days</p>
        {hasDaily ? (
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={days} margin={{ top: 10, right: 8, left: -18, bottom: 0 }} barGap={1}>
                <CartesianGrid vertical={false} stroke="currentColor" className="text-slate-100 dark:text-white/[0.06]" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={10} interval={6} stroke="#94a3b8" />
                <YAxis tickLine={false} axisLine={false} fontSize={10} allowDecimals={false} stroke="#94a3b8" width={44} />
                <Tooltip cursor={{ fill: "rgba(148,163,184,0.12)" }} content={<ChartTip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="impressions" name="Impressions" fill="#3b82f6" radius={[3, 3, 0, 0]} maxBarSize={14} />
                <Bar dataKey="clicks" name="Clicks" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-slate-400">No daily data yet — impressions appear here as visitors see the ad.</p>
        )}
      </div>

      <div className="border-t border-slate-100 dark:border-white/[0.06]">
        {countries.length ? (
          <Table>
            <THead>
              <tr>
                <th>Country</th>
                <th className="!text-end">Impr.</th>
                <th className="!text-end">Clicks</th>
                <th className="!text-end">CTR</th>
              </tr>
            </THead>
            <TBody>
              {countries.map((c) => (
                <tr key={c.cc}>
                  <td>
                    <span className="flex items-center gap-2">
                      <Flag cc={c.cc} />
                      <span className="truncate">{countryName(c.cc)}</span>
                    </span>
                  </td>
                  <td className="text-end tabular-nums">{fmtNum(c.imp)}</td>
                  <td className="text-end tabular-nums">{fmtNum(c.clk)}</td>
                  <td className="text-end tabular-nums text-slate-500">{fmtPct(ctrOf(c.clk, c.imp))}</td>
                </tr>
              ))}
            </TBody>
          </Table>
        ) : (
          <p className="py-6 text-center text-sm text-slate-400">No country data yet.</p>
        )}
      </div>
    </Card>
  );
}

function ChartTip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-white/10 dark:bg-ink-900">
      <p className="mb-1 font-semibold text-slate-900 dark:text-white">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          {p.name}: <span className="font-semibold tabular-nums">{fmtNum(p.value)}</span>
        </p>
      ))}
    </div>
  );
}
