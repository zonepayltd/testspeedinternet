"use client";

// Overview → Community: accounts and provider reviews at a glance.
import { useEffect, useState } from "react";
import Link from "next/link";
import { BadgeCheck, Clock, MessageSquareText, Star, UserPlus, UserRound } from "lucide-react";
import { Card, EmptyState, Flag, Skeleton, StatCard, api, fmtNum, timeAgo } from "@/components/admin/ui";
import { Avatar, ProviderLogo, Stars } from "@/components/admin/users/bits";

type Users = {
  users: { id: string; name: string; email: string; countryCode: string; emailVerified: boolean; createdAt: number }[];
  stats: { total: number; verified: number; newThisWeek: number };
};
type Reviews = {
  reviews: { id: string; provider: string; providerDomain: string; rating: number; title: string; comment: string; name: string; status: string; createdAt: number }[];
  counts: { published: number; pending: number; reported: number };
  avgRating: number;
};

export default function CommunityPanel() {
  const [u, setU] = useState<Users | null>(null);
  const [r, setR] = useState<Reviews | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    api<Users>("/api/admin/users?limit=5").then(setU).catch(() => setFailed(true));
    api<Reviews>("/api/admin/reviews?limit=5").then(setR).catch(() => setFailed(true));
  }, []);

  if (failed && !u && !r) return null;

  return (
    <section className="mt-4" aria-label="Community">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Link href="/admin/users" className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
          <StatCard label="Registered users" icon={UserRound} tone="blue" loading={!u} value={fmtNum(u?.stats.total)} hint={u ? `${fmtNum(u.stats.verified)} verified` : undefined} />
        </Link>
        <Link href="/admin/users" className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
          <StatCard label="New users this week" icon={UserPlus} tone="violet" loading={!u} value={fmtNum(u?.stats.newThisWeek)} hint="last 7 days" />
        </Link>
        <Link href="/admin/reviews" className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
          <StatCard label="Published reviews" icon={MessageSquareText} tone="green" loading={!r} value={fmtNum(r?.counts.published)} hint={r ? `${fmtNum(r.counts.pending)} awaiting email${r.counts.reported ? ` · ${r.counts.reported} reported` : ""}` : undefined} />
        </Link>
        <Link href="/admin/reviews" className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
          <StatCard label="Average provider rating" icon={Star} tone="amber" loading={!r} value={r?.avgRating ? <span className="flex items-center gap-2">{r.avgRating.toFixed(1)}<Stars value={r.avgRating} size={15} /></span> : "–"} hint="published reviews" />
        </Link>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card title="Newest accounts" icon={UserRound} bodyClassName="p-0" actions={<Link href="/admin/users" className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400">All users →</Link>}>
          {!u ? (
            <div className="space-y-2 p-4">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : u.users.length === 0 ? (
            <EmptyState icon={UserRound} title="No accounts yet" description="Sign-ups will show up here." />
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {u.users.map((x) => (
                <li key={x.id}>
                  <Link href={`/admin/users?u=${encodeURIComponent(x.id)}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-white/[0.03]">
                    <Avatar name={x.name} email={x.email} size={30} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 truncate text-sm font-medium text-slate-900 dark:text-white">
                        {x.name || x.email}
                        {x.emailVerified ? <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" aria-label="Verified" /> : <Clock className="h-3.5 w-3.5 shrink-0 text-amber-500" aria-label="Not verified" />}
                      </span>
                      <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{x.email}</span>
                    </span>
                    <Flag cc={x.countryCode} />
                    <span className="shrink-0 text-xs tabular-nums text-slate-400">{timeAgo(x.createdAt)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Latest reviews" icon={MessageSquareText} bodyClassName="p-0" actions={<Link href="/admin/reviews" className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400">All reviews →</Link>}>
          {!r ? (
            <div className="space-y-2 p-4">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : r.reviews.length === 0 ? (
            <EmptyState icon={MessageSquareText} title="No reviews yet" description="Visitors can rate their provider after a speed test." />
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {r.reviews.map((x) => (
                <li key={x.id} className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <ProviderLogo name={x.provider} domain={x.providerDomain} size={18} />
                    <span className="truncate text-sm font-medium text-slate-900 dark:text-white">{x.provider}</span>
                    <Stars value={x.rating} size={12} />
                    {x.status !== "published" && <span className="rounded bg-amber-50 px-1 text-[10px] font-medium text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">{x.status === "pending" ? "awaiting email" : x.status}</span>}
                    <span className="ms-auto shrink-0 text-xs tabular-nums text-slate-400">{timeAgo(x.createdAt)}</span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{x.name || "Anonymous"}:</span> {x.title || x.comment}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </section>
  );
}
