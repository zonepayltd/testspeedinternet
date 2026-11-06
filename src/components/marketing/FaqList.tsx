import { ChevronDown } from "lucide-react";
import type { QA } from "./JsonLd";

/** Accessible FAQ accordion built on <details>; works without JavaScript. */
export default function FaqList({ items, className = "" }: { items: QA[]; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((f, i) => (
        <details key={f.q} className="faq-item group" open={i === 0}>
          <summary className="faq-q">
            <span>{f.q}</span>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors group-open:border-brand-200 group-open:bg-brand-50 group-open:text-brand-600 dark:border-white/10 dark:text-slate-400 dark:group-open:border-brand-400/30 dark:group-open:bg-brand-400/10 dark:group-open:text-brand-300">
              <ChevronDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
            </span>
          </summary>
          <p className="faq-a">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
