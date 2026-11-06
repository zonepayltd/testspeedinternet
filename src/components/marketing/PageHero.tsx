import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type Props = {
  eyebrow: string;
  icon?: LucideIcon;
  titleLead: string;
  titleHighlight: string;
  intro: string;
  children?: ReactNode;
  /** Extra classes on the inner container (e.g. tighter bottom padding). */
  className?: string;
};

/** Standard page hero: soft brand glow + grid, eyebrow, H1 with gradient highlight, lead. */
export default function PageHero({ eyebrow, icon: Icon, titleLead, titleHighlight, intro, children, className = "" }: Props) {
  return (
    <section className="hero-bg isolate">
      <div aria-hidden="true" className="hero-glow" />
      <div aria-hidden="true" className="hero-grid" />
      <div className={`container relative flex flex-col items-center pb-14 pt-12 text-center md:pb-20 md:pt-16 ${className}`}>
        <span className="eyebrow">
          {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
          {eyebrow}
        </span>
        <h1 className="h-display mt-5 max-w-4xl text-balance">
          {titleLead} <span className="text-gradient">{titleHighlight}</span>
        </h1>
        <p className="lead mt-5 max-w-2xl text-pretty">{intro}</p>
        {children}
      </div>
    </section>
  );
}
