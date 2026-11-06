"use client";

import { useId } from "react";

// 270° dial with the gap at the bottom.
const C = 140;
const R = 114;
const START = -135;
const SWEEP = 270;

export type Tone = "download" | "upload" | "ping";

const TONES: Record<Tone, [string, string]> = {
  download: ["#22d3ee", "#2563eb"],
  upload: ["#c084fc", "#7c3aed"],
  ping: ["#6ee7b7", "#10b981"],
};

function pt(angle: number, r = R) {
  const a = (angle * Math.PI) / 180;
  return { x: C + r * Math.sin(a), y: C - r * Math.cos(a) };
}

function arc(from: number, to: number, r = R) {
  const s = pt(from, r);
  const e = pt(to, r);
  const large = to - from > 180 ? 1 : 0;
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

const TRACK = arc(START, START + SWEEP);
const SPINNER = arc(START, START + 60);

/**
 * Presentational SVG gauge. `fraction` (0–1) is already eased by the parent.
 * Always rendered left-to-right (dir="ltr") so the dial reads the same in RTL.
 */
export default function Gauge({
  fraction,
  ticks,
  tone,
  spinning,
  dim,
  label,
  children,
}: {
  fraction: number;
  ticks: string[];
  tone: Tone;
  spinning?: boolean;
  dim?: boolean;
  label: string;
  children?: React.ReactNode;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const gid = `g-${uid}`;
  const f = Math.max(0, Math.min(1, fraction));
  const showArc = !spinning && f > 0.002;
  const angle = START + SWEEP * f;
  const tip = pt(angle);
  const [c1, c2] = TONES[tone];
  const segments = ticks.length - 1;
  const minorPerSeg = 4;

  return (
    <div dir="ltr" className="relative aspect-square w-full">
      <svg viewBox="0 0 280 280" className="h-full w-full" role="img" aria-label={label}>
        <defs>
          <linearGradient id={gid} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
        </defs>

        {/* Inner face */}
        <circle
          cx={C}
          cy={C}
          r={R - 44}
          className="fill-white stroke-slate-200/70 dark:fill-white/[0.02] dark:stroke-white/[0.06]"
          strokeWidth={1}
        />

        {/* Track */}
        <path
          d={TRACK}
          fill="none"
          strokeWidth={14}
          strokeLinecap="round"
          className="stroke-slate-200/80 dark:stroke-white/[0.07]"
        />

        {/* Minor + major ticks */}
        {Array.from({ length: segments * minorPerSeg + 1 }, (_, i) => {
          const major = i % minorPerSeg === 0;
          const pos = i / (segments * minorPerSeg);
          const a = START + SWEEP * pos;
          const p1 = pt(a, R - 15);
          const p2 = pt(a, major ? R - 23 : R - 19);
          const passed = showArc && pos <= f + 1e-6;
          return (
            <line
              key={i}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              strokeWidth={major ? 2 : 1.25}
              strokeLinecap="round"
              className={
                passed
                  ? "stroke-slate-500 dark:stroke-slate-300"
                  : dim
                    ? "stroke-slate-200 dark:stroke-white/10"
                    : "stroke-slate-300 dark:stroke-white/20"
              }
            />
          );
        })}
        {ticks.map((label, i) => {
          const a = START + SWEEP * (i / segments);
          const p = pt(a, R - 35);
          return (
            <text
              key={i}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="10"
              fontWeight="600"
              className={`tabular transition-colors ${
                dim ? "fill-slate-300 dark:fill-slate-600" : "fill-slate-400 dark:fill-slate-500"
              }`}
            >
              {label}
            </text>
          );
        })}

        {/* Indeterminate spinner (latency phase) */}
        {spinning && (
          <g style={{ transformOrigin: `${C}px ${C}px` }} className="motion-safe:animate-spin">
            <path d={SPINNER} fill="none" stroke={`url(#${gid})`} strokeWidth={14} strokeLinecap="round" />
          </g>
        )}

        {/* Progress arc: soft halo + crisp stroke */}
        {showArc && (
          <>
            <path
              d={arc(START, angle)}
              fill="none"
              stroke={`url(#${gid})`}
              strokeWidth={26}
              strokeLinecap="round"
              opacity={0.14}
            />
            <path d={arc(START, angle)} fill="none" stroke={`url(#${gid})`} strokeWidth={14} strokeLinecap="round" />
            <circle cx={tip.x} cy={tip.y} r={9.5} className="fill-white dark:fill-ink-950" stroke={c2} strokeWidth={4} />
          </>
        )}
      </svg>

      {/* Centre read-out */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
}
