"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Star, Trash2 } from "lucide-react";
import { useLocale } from "@/i18n/client";
import { lp, pick } from "@/i18n/config";
import { accountMessages } from "@/i18n/messages/account";
import { apiJson } from "../useAccount";
import { EmptyBox, ProviderMark, Stars, fmtDate, type MyReview } from "./shared";

const TONE: Record<string, string> = {
  published: "bg-emerald-50 text-emerald-700 ring-emerald-600/15 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20",
  hidden: "bg-slate-100 text-slate-600 ring-slate-500/15 dark:bg-white/10 dark:text-slate-300 dark:ring-white/10",
};

export default function ReviewsTab() {
  const locale = useLocale();
  const t = pick(accountMessages, locale);
  const [list, setList] = useState<MyReview[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = () => apiJson<{ reviews?: MyReview[] }>("/api/account/reviews", "GET").then((r) => setList(r.ok ? r.reviews || [] : []));
  useEffect(() => {
    load();
  }, []);

  const del = async (id: string) => {
    if (!window.confirm(t.reviews.deleteConfirm)) return;
    setBusy(id);
    await apiJson("/api/account/reviews", "DELETE", { id });
    await load();
    setBusy(null);
  };

  if (!list) return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-slate-400" aria-label={t.dash.loading} /></div>;
  if (!list.length)
    return <EmptyBox icon={Star} title={t.reviews.title} text={t.reviews.empty} action={<Link href={`${lp(locale, "/")}#speed-test`} className="btn-primary">{t.dash.runTest}</Link>} />;

  return (
    <div className="space-y-4">
      <h2 className="h-card">{t.reviews.title}</h2>
      {list.map((r) => {
        const status = (["published", "pending", "hidden"].includes(r.status) ? r.status : "pending") as "published" | "pending" | "hidden";
        return (
          <article key={r.id} className="card p-5">
            <div className="flex flex-wrap items-start gap-3">
              <ProviderMark name={r.provider} domain={r.providerDomain} size={40} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-white">{r.provider}</h3>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${TONE[status]}`}>{t.reviews.status[status]}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                  <Stars value={r.rating} /> <span>{fmtDate(r.createdAt, locale, false)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {status === "published" && r.providerSlug && (
                  <Link href={lp(locale, `/providers/${r.providerSlug}`)} className="btn-ghost px-3 py-1.5 text-xs">
                    {t.reviews.view}
                  </Link>
                )}
                <button type="button" onClick={() => del(r.id)} disabled={busy === r.id} aria-label={t.reviews.delete} title={t.reviews.delete} className="icon-btn h-8 w-8 text-slate-400 hover:text-rose-600">
                  {busy === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {r.title && <p className="mt-3 font-semibold text-slate-900 dark:text-white">{r.title}</p>}
            <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">{r.comment}</p>
          </article>
        );
      })}
    </div>
  );
}
