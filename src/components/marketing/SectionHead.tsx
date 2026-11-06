import type { ReactNode } from "react";

type Props = {
  kicker?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "center" | "start";
  as?: "h2" | "h3";
  className?: string;
};

/** Kicker + section title + lead paragraph, centered by default. */
export default function SectionHead({ kicker, title, intro, align = "center", as: Tag = "h2", className = "" }: Props) {
  return (
    <div className={`${align === "center" ? "section-head" : "max-w-2xl text-start"} ${className}`}>
      {kicker && <p className="kicker">{kicker}</p>}
      <Tag className={`h-section ${kicker ? "mt-3" : ""}`}>{title}</Tag>
      {intro && <p className="lead mt-4">{intro}</p>}
    </div>
  );
}
