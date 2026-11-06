import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { href?: string; label: string };

/** Pass already-localized hrefs (lp(locale, "/blog")). */
export default function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
        {items.map((c, i) => (
          <li key={`${c.label}-${i}`} className="inline-flex min-w-0 items-center gap-1.5">
            {i > 0 && (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300 rtl:rotate-180 dark:text-slate-600" aria-hidden="true" />
            )}
            {c.href && i < items.length - 1 ? (
              <Link href={c.href} className="transition-colors hover:text-slate-900 dark:hover:text-white">
                {c.label}
              </Link>
            ) : (
              <span
                aria-current={i === items.length - 1 ? "page" : undefined}
                className="truncate font-medium text-slate-700 dark:text-slate-200"
              >
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
