"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import ProviderLogo from "@/components/reviews/ProviderLogo";
import { StarDisplay } from "@/components/reviews/Stars";
import { useLocale } from "@/i18n/client";
import { LOCALE_META, lp, pick } from "@/i18n/config";
import { fill, reviewsCountText, reviewsMessages } from "@/i18n/messages/reviews";

export type DirectoryItem = { slug: string; name: string; domain: string; count: number; average: number };

const norm = (s: string) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function ProvidersDirectory({ items }: { items: DirectoryItem[] }) {
  const locale = useLocale();
  const m = pick(reviewsMessages, locale);
  const [q, setQ] = useState("");
  const nf = new Intl.NumberFormat(LOCALE_META[locale].htmlLang, { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  const shown = useMemo(() => (q.trim() ? items.filter((i) => norm(i.name).includes(norm(q.trim()))) : items), [items, q]);

  return (
    <div>
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={m.index.search} aria-label={m.index.search} className="input ps-10" />
      </div>
      {shown.length === 0 ? (
        <p className="mt-8 text-sm muted">{m.index.noMatch}</p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <li key={p.slug}>
              <Link href={lp(locale, `/providers/${p.slug}`)} className="card card-hover group flex h-full items-center gap-4 p-4">
                <ProviderLogo name={p.name} domain={p.domain} size={52} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900 dark:text-white">{p.name}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm">
                    <StarDisplay value={p.average} size={14} label={fill(m.starOf, { n: nf.format(p.average) })} />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{nf.format(p.average)}</span>
                    <span className="muted">· {reviewsCountText(m, p.count)}</span>
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
