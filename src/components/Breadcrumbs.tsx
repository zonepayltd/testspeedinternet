import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { href?: string; label: string };

export default function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
        {items.map((c, i) => (
          <li key={`${c.label}-${i}`} className="inline-flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-300" aria-hidden="true" />}
            {c.href && i < items.length - 1 ? (
              <Link href={c.href} className="hover:text-slate-800">
                {c.label}
              </Link>
            ) : (
              <span aria-current={i === items.length - 1 ? "page" : undefined} className="text-slate-700">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
