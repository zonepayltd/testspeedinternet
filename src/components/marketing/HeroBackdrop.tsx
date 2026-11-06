// Hero background: aurora light + a dotted world map with glowing connection
// arcs between cities (public/hero/world-*.svg, built by scripts/generate-hero.mjs).
// Separate light and dark artwork; overlays keep the headline and gauge readable.
export default function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f4f8ff] via-white to-white dark:from-[#060b1d] dark:via-[#050916] dark:to-ink-950" />

      {/* Aurora light */}
      <div className="absolute -start-[10%] -top-[25%] h-[70%] w-[55%] rounded-full bg-[radial-gradient(closest-side,rgba(59,130,246,0.20),transparent)] blur-2xl dark:bg-[radial-gradient(closest-side,rgba(37,99,235,0.38),transparent)]" />
      <div className="absolute -end-[10%] -top-[20%] h-[65%] w-[50%] rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.16),transparent)] blur-2xl dark:bg-[radial-gradient(closest-side,rgba(6,182,212,0.26),transparent)]" />
      <div className="absolute left-1/2 top-[35%] h-[55%] w-[60%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.08),transparent)] blur-2xl dark:bg-[radial-gradient(closest-side,rgba(79,70,229,0.22),transparent)]" />

      {/* World map */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/hero/world-light.svg" alt="" className="absolute inset-0 h-full w-full object-cover object-center max-sm:opacity-45 [mask-image:radial-gradient(40%_52%_at_50%_44%,transparent_30%,rgba(0,0,0,0.35)_62%,black_92%)] dark:hidden" fetchPriority="high" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/hero/world-dark.svg" alt="" className="absolute inset-0 hidden h-full w-full object-cover object-center max-sm:opacity-45 [mask-image:radial-gradient(40%_52%_at_50%_44%,transparent_30%,rgba(0,0,0,0.35)_62%,black_92%)] dark:block" fetchPriority="high" />

      {/* Calm the centre behind the headline + gauge */}
      <div className="absolute inset-0 bg-[radial-gradient(34%_42%_at_50%_44%,rgba(255,255,255,0.7),rgba(255,255,255,0.25)_55%,transparent_100%)] dark:bg-[radial-gradient(34%_42%_at_50%_46%,rgba(6,11,29,0.6),rgba(6,11,29,0.2)_55%,transparent_100%)]" />

      {/* Fine grain so gradients don't band */}
      <div className="absolute inset-0 opacity-[0.025] mix-blend-multiply [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%22.9%22 numOctaves=%222%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>')] dark:opacity-[0.06] dark:mix-blend-screen" />

      {/* Blend into the next section */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white dark:to-ink-950" />
    </div>
  );
}
