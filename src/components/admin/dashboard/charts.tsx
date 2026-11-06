"use client";

// Recharts wrappers themed for the admin (light + dark, selected — not flipped).

import { useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipProps } from "recharts";
import { fmtCompact, fmtNum } from "@/components/admin/ui";

/** Tracks `html.dark` (ThemeToggle flips the class). */
export function useIsDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const read = () => setDark(el.classList.contains("dark"));
    read();
    const mo = new MutationObserver(read);
    mo.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);
  return dark;
}

/** Categorical slots (validated reference palette), light / dark steps. */
export function usePalette() {
  const dark = useIsDark();
  return dark
    ? { s1: "#3987e5", s2: "#d95926", s3: "#199e70", s4: "#c98500", grid: "rgba(255,255,255,0.06)", axis: "#64748b", cursor: "rgba(255,255,255,0.12)", surface: "#0c1324", dark }
    : { s1: "#2a78d6", s2: "#eb6834", s3: "#1baf7a", s4: "#eda100", grid: "#eef2f6", axis: "#94a3b8", cursor: "#cbd5e1", surface: "#ffffff", dark };
}

export type SeriesPoint = { t: number; pageViews: number; visitors: number; started: number; completed: number };

const fmtTick = (hourly: boolean) => (t: number) =>
  hourly ? new Date(t).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const fmtLabel = (hourly: boolean, t: number) =>
  hourly
    ? `${new Date(t).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })} · ${new Date(t).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`
    : new Date(t).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

function ChartTooltip({ active, payload, label, hourly, extra }: TooltipProps<number, string> & { hourly: boolean; extra?: (p: SeriesPoint) => React.ReactNode }) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload as SeriesPoint;
  return (
    <div className="min-w-[180px] rounded-xl border border-slate-200 bg-white/95 px-3.5 py-3 text-xs shadow-xl backdrop-blur dark:border-white/10 dark:bg-ink-850/95">
      <p className="mb-2 font-medium text-slate-500 dark:text-slate-400">{fmtLabel(hourly, Number(label))}</p>
      <ul className="space-y-1.5">
        {payload.map((p) => (
          <li key={String(p.dataKey)} className="flex items-center justify-between gap-6">
            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full" style={{ background: p.color }} aria-hidden="true" />
              {p.name}
            </span>
            <span className="font-semibold tabular-nums text-slate-900 dark:text-white">{fmtNum(Number(p.value))}</span>
          </li>
        ))}
      </ul>
      {extra && point && <div className="mt-2 border-t border-slate-100 pt-2 text-slate-500 dark:border-white/[0.06] dark:text-slate-400">{extra(point)}</div>}
    </div>
  );
}

function Legend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
      {items.map((i) => (
        <span key={i.label} className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: i.color }} aria-hidden="true" />
          {i.label}
        </span>
      ))}
    </div>
  );
}

const axisProps = (color: string) => ({ tickLine: false, axisLine: false, tick: { fill: color, fontSize: 11 }, tickMargin: 8 });

/** Visitors + page views over time (two areas, one axis). */
export function TrafficChart({ data, hourly, height = 280 }: { data: SeriesPoint[]; hourly: boolean; height?: number }) {
  const c = usePalette();
  return (
    <div>
      <Legend items={[{ label: "Page views", color: c.s1 }, { label: "Visitors", color: c.s2 }]} />
      <div className="mt-3" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: -12 }}>
            <defs>
              <linearGradient id="g-pv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c.s1} stopOpacity={c.dark ? 0.35 : 0.22} />
                <stop offset="100%" stopColor={c.s1} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={c.grid} />
            <XAxis dataKey="t" tickFormatter={fmtTick(hourly)} minTickGap={28} {...axisProps(c.axis)} />
            <YAxis allowDecimals={false} tickFormatter={(v) => fmtCompact(v)} width={44} {...axisProps(c.axis)} />
            <Tooltip cursor={{ stroke: c.cursor, strokeWidth: 1 }} content={<ChartTooltip hourly={hourly} />} />
            <Area type="monotone" dataKey="pageViews" name="Page views" stroke={c.s1} strokeWidth={2} fill="url(#g-pv)" activeDot={{ r: 4, strokeWidth: 2, stroke: c.surface }} />
            <Area type="monotone" dataKey="visitors" name="Visitors" stroke={c.s2} strokeWidth={2} fill="transparent" activeDot={{ r: 4, strokeWidth: 2, stroke: c.surface }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/** Speed tests per bucket: started vs completed (grouped bars). */
export function TestsChart({ data, hourly, height = 240 }: { data: SeriesPoint[]; hourly: boolean; height?: number }) {
  const c = usePalette();
  const dense = data.length > 31;
  return (
    <div>
      <Legend items={[{ label: "Started", color: c.s1 }, { label: "Completed", color: c.s3 }]} />
      <div className="mt-3" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: -12 }} barGap={2} barCategoryGap={dense ? "15%" : "25%"}>
            <CartesianGrid vertical={false} stroke={c.grid} />
            <XAxis dataKey="t" tickFormatter={fmtTick(hourly)} minTickGap={28} {...axisProps(c.axis)} />
            <YAxis allowDecimals={false} width={44} {...axisProps(c.axis)} />
            <Tooltip
              cursor={{ fill: c.dark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.04)" }}
              content={
                <ChartTooltip
                  hourly={hourly}
                  extra={(p) => (p.started ? <>Completion rate <b className="text-slate-900 dark:text-white">{Math.round((p.completed / p.started) * 100)}%</b></> : null)}
                />
              }
            />
            <Bar dataKey="started" name="Started" fill={c.s1} radius={[3, 3, 0, 0]} maxBarSize={18} />
            <Bar dataKey="completed" name="Completed" fill={c.s3} radius={[3, 3, 0, 0]} maxBarSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/** Tiny trend line for KPI cards. */
export function Sparkline({ data, dataKey, color }: { data: SeriesPoint[]; dataKey: keyof SeriesPoint; color: string }) {
  return (
    <div className="mt-3 h-10" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`sp-${String(dataKey)}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1.5} fill={`url(#sp-${String(dataKey)})`} isAnimationActive={false} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
