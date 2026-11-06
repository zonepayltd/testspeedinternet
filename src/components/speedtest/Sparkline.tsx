"use client";

import { useId } from "react";

const W = 120;
const H = 32;

/** Tiny area chart of live samples. Time runs left-to-right in every language. */
export default function Sparkline({
  data,
  color,
  className = "",
}: {
  data: number[];
  color: string;
  className?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  if (data.length < 2) {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={className} aria-hidden="true">
        <line x1={0} y1={H - 1} x2={W} y2={H - 1} className="stroke-slate-200 dark:stroke-white/10" strokeWidth={1} strokeDasharray="2 3" />
      </svg>
    );
  }
  const max = Math.max(...data) * 1.15 || 1;
  const step = W / (data.length - 1);
  const pts = data.map((v, i) => [i * step, H - 1.5 - (Math.max(v, 0) / max) * (H - 4)] as const);
  // Smooth with a simple midpoint-quadratic curve.
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2;
    d += ` Q ${x0.toFixed(1)} ${y0.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
    if (i === pts.length - 1) d += ` T ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  const area = `${d} L ${W} ${H} L 0 ${H} Z`;
  const gid = `sp-${uid}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.28} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={d} fill="none" stroke={color} strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
