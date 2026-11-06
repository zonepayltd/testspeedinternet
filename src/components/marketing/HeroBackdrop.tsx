import Image from "next/image";
import heroDark from "../../../public/hero/hero-dark.jpg";
import heroLight from "../../../public/hero/hero-light.jpg";

// Hero background: fiber-optic light streams + network floor (generated with
// Codex for TestSpeedInternet). A light and a dark version follow the theme;
// overlays keep the headline and gauge readable and blend into the page.
export default function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#eef4ff] dark:bg-[#050a1c]">
      <div className="hero-drift absolute inset-0">
        <Image
          src={heroLight}
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          quality={80}
          className="object-cover object-center dark:hidden"
        />
        <Image
          src={heroDark}
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          quality={80}
          className="hidden object-cover object-center dark:block"
        />
      </div>

      {/* Soft spotlight behind the headline + gauge for readability */}
      <div className="absolute inset-0 bg-[radial-gradient(42%_48%_at_50%_42%,rgba(255,255,255,0.55),transparent_75%)] dark:bg-[radial-gradient(42%_48%_at_50%_45%,rgba(37,99,235,0.18),transparent_75%)]" />

      {/* Fade the top under the header and the bottom into the next section */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/70 to-transparent dark:from-ink-950/70" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white dark:to-ink-950" />
    </div>
  );
}
