// Decorative hero background: perspective network floor, speed rings behind the
// gauge, and glowing data streams flowing toward the centre. Pure SVG (no image
// download), themed with Tailwind classes so it has a light and a dark look.

const W = 1600;
const H = 1000;
const CX = W / 2;
const HORIZON = 600; // vanishing line of the floor grid

// Floor grid: lines fanning out from the vanishing point + horizontal rows that
// get closer together toward the horizon.
const fanLines = Array.from({ length: 25 }, (_, i) => {
  const x = -900 + i * ((W + 1800) / 24);
  return `M${CX} ${HORIZON} L${x} ${H}`;
});
const rows = Array.from({ length: 9 }, (_, i) => {
  const t = (i + 1) / 9;
  return HORIZON + (H - HORIZON) * t * t;
});

// Data streams: curves from the edges into the centre (mirrored left/right).
const STREAMS = [
  "M-40 180 C 260 200, 420 360, 640 430",
  "M-40 420 C 220 420, 420 470, 610 500",
  "M-40 700 C 240 640, 430 560, 640 540",
  "M120 -40 C 220 160, 420 300, 660 400",
];
const mirror = (d: string) =>
  d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => `${W - Number(x)} ${y}`);

// Network points (left half, mirrored for the right).
const NODES: [number, number, number][] = [
  [150, 170, 3], [260, 300, 2.5], [90, 520, 3], [330, 610, 2], [210, 760, 2.5],
  [420, 210, 2], [470, 430, 2.5], [60, 330, 2], [380, 820, 2], [520, 120, 2],
];

export default function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Base colour wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#eef4ff] via-[#f5f8ff] to-white dark:from-[#050a1c] dark:via-[#06102a] dark:to-ink-950" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <radialGradient id="hb-core-light" cx="50%" cy="58%" r="45%">
            <stop offset="0" stopColor="#60a5fa" stopOpacity="0.30" />
            <stop offset="0.55" stopColor="#67e8f9" stopOpacity="0.08" />
            <stop offset="1" stopColor="#67e8f9" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hb-core-dark" cx="50%" cy="58%" r="45%">
            <stop offset="0" stopColor="#3b82f6" stopOpacity="0.45" />
            <stop offset="0.55" stopColor="#22d3ee" stopOpacity="0.10" />
            <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hb-stream" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="0.6" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hb-stream-r" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="0.6" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hb-floor-fade" x1="0" y1={HORIZON} x2="0" y2={H} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.35" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.2" />
          </linearGradient>
          <mask id="hb-floor-mask">
            <rect x="0" y={HORIZON} width={W} height={H - HORIZON} fill="url(#hb-floor-fade)" />
          </mask>
          {/* keep the centre (headline + gauge) calm */}
          <radialGradient id="hb-calm" cx="50%" cy="42%" r="42%" gradientTransform="translate(0.5 0.42) scale(1.25 1) translate(-0.5 -0.42)">
            <stop offset="0.45" stopColor="#000" />
            <stop offset="1" stopColor="#fff" />
          </radialGradient>
          <linearGradient id="hb-horizon" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.3" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.42" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.58" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.7" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="hb-horizon-mask">
            <rect width={W} height={H} fill="url(#hb-horizon)" />
          </mask>
          <mask id="hb-calm-mask">
            <rect width={W} height={H} fill="url(#hb-calm)" />
          </mask>
        </defs>

        {/* Core glow behind the speed test */}
        <rect width={W} height={H} fill="url(#hb-core-light)" className="dark:hidden" />
        <rect width={W} height={H} fill="url(#hb-core-dark)" className="hidden dark:block" />

        {/* Perspective network floor */}
        <g mask="url(#hb-floor-mask)" className="stroke-brand-500/25 dark:stroke-sky-400/20" strokeWidth="1">
          {fanLines.map((d, i) => (
            <path key={i} d={d} />
          ))}
          {rows.map((y, i) => (
            <line key={i} x1="0" x2={W} y1={y} y2={y} />
          ))}
        </g>
        <line mask="url(#hb-horizon-mask)" x1="0" x2={W} y1={HORIZON} y2={HORIZON} className="stroke-brand-400/30 dark:stroke-cyan-300/30" strokeWidth="1.5" />

        {/* Speed rings around the gauge */}
        <g className="stroke-brand-500/15 dark:stroke-sky-300/[0.12]" strokeWidth="1.2">
          <circle cx={CX} cy="600" r="250" strokeDasharray="2 10" />
          <circle cx={CX} cy="600" r="340" />
          <circle cx={CX} cy="600" r="440" strokeDasharray="1 14" />
          <circle cx={CX} cy="600" r="560" className="stroke-brand-500/10 dark:stroke-sky-300/[0.07]" />
        </g>

        {/* Data streams flowing toward the centre */}
        <g mask="url(#hb-calm-mask)" strokeLinecap="round">
          {STREAMS.map((d, i) => (
            <g key={i}>
              <path d={d} stroke="url(#hb-stream)" strokeWidth="1.5" className="opacity-40 dark:opacity-60" />
              <path d={d} stroke="url(#hb-stream)" strokeWidth="2.5" className="hero-stream opacity-70 dark:opacity-90" style={{ animationDelay: `${i * -0.7}s` }} />
              <path d={mirror(d)} stroke="url(#hb-stream-r)" strokeWidth="1.5" className="opacity-40 dark:opacity-60" />
              <path d={mirror(d)} stroke="url(#hb-stream-r)" strokeWidth="2.5" className="hero-stream opacity-70 dark:opacity-90" style={{ animationDelay: `${i * -0.9 - 0.4}s` }} />
            </g>
          ))}
        </g>

        {/* Network points */}
        <g className="fill-brand-500/50 dark:fill-cyan-300/70">
          {NODES.flatMap(([x, y, r], i) => [
            <circle key={`l${i}`} cx={x} cy={y} r={r} className={i % 3 === 0 ? "hero-node" : undefined} style={{ animationDelay: `${i * -0.6}s` }} />,
            <circle key={`r${i}`} cx={W - x} cy={y + (i % 2 ? 30 : -20)} r={r} className={i % 3 === 1 ? "hero-node" : undefined} style={{ animationDelay: `${i * -0.8}s` }} />,
          ])}
        </g>
      </svg>

      {/* Fine dot texture */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(37,99,235,0.10)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:radial-gradient(70%_55%_at_50%_30%,black,transparent)] dark:bg-[radial-gradient(rgba(148,197,255,0.10)_1px,transparent_1px)]" />

      {/* Blend into the next section */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-white dark:to-ink-950" />
    </div>
  );
}
