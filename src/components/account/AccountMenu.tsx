"use client";

// Header account entry: "Sign in" when signed out; avatar + menu when signed in.
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GitCompareArrows, LayoutDashboard, ListChecks, LogIn, LogOut, Settings, UserPlus } from "lucide-react";
import { useLocale } from "@/i18n/client";
import { lp, pick } from "@/i18n/config";
import { accountMessages } from "@/i18n/messages/account";
import { initials, signOut, useAccount } from "./useAccount";

export default function AccountMenu() {
  const locale = useLocale();
  const t = pick(accountMessages, locale);
  const router = useRouter();
  const { user, loading } = useAccount();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (loading) return <span className="mx-1 hidden h-9 w-9 animate-pulse rounded-full bg-slate-100 dark:bg-white/[0.06] sm:block" aria-hidden="true" />;

  if (!user) {
    return (
      <Link
        href={lp(locale, "/account/login")}
        className="ms-1 hidden items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-white/[0.07] dark:hover:text-white sm:inline-flex"
      >
        <LogIn className="h-4 w-4" aria-hidden="true" />
        {t.nav.signIn}
      </Link>
    );
  }

  const items = [
    { href: "/account", icon: LayoutDashboard, label: t.nav.dashboard },
    { href: "/account?tab=tests", icon: ListChecks, label: t.nav.myTests },
    { href: "/account?tab=compare", icon: GitCompareArrows, label: t.nav.compare },
    { href: "/account?tab=settings", icon: Settings, label: t.nav.settings },
  ];
  const href = (h: string) => {
    const [p, q] = h.split("?");
    return `${lp(locale, p)}${q ? `?${q}` : ""}`;
  };

  return (
    <div ref={ref} className="relative ms-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t.nav.account}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 text-xs font-bold text-white shadow-sm ring-2 ring-white transition-transform hover:scale-105 dark:ring-ink-950"
      >
        {initials(user.name)}
      </button>
      {open && (
        <div role="menu" className="menu-pop end-0 w-64">
          <div className="border-b border-slate-100 px-3 pb-2.5 pt-1.5 dark:border-white/[0.06]">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400" dir="ltr">
              {user.email}
            </p>
          </div>
          <div className="py-1">
            {items.map(({ href: h, icon: Icon, label }) => (
              <Link key={h} href={href(h)} role="menuitem" onClick={() => setOpen(false)} className="menu-item">
                <Icon className="h-4 w-4 text-slate-400" aria-hidden="true" /> {label}
              </Link>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-1 dark:border-white/[0.06]">
            <button
              type="button"
              role="menuitem"
              onClick={async () => {
                setOpen(false);
                await signOut();
                router.push(lp(locale, "/"));
                router.refresh();
              }}
              className="menu-item text-rose-600 dark:text-rose-400"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" /> {t.nav.signOut}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Account links for the mobile menu. */
export function MobileAccountLinks() {
  const locale = useLocale();
  const t = pick(accountMessages, locale);
  const router = useRouter();
  const { user, loading } = useAccount();
  if (loading) return null;
  if (!user) {
    return (
      <div className="grid grid-cols-2 gap-2">
        <Link href={lp(locale, "/account/login")} className="btn-secondary">
          <LogIn className="h-4 w-4" aria-hidden="true" /> {t.nav.signIn}
        </Link>
        <Link href={lp(locale, "/account/signup")} className="btn-primary">
          <UserPlus className="h-4 w-4" aria-hidden="true" /> {t.nav.createAccount}
        </Link>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-slate-200 p-3 dark:border-white/[0.08]">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 text-sm font-bold text-white">{initials(user.name)}</span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
          <p className="truncate text-xs text-slate-500" dir="ltr">
            {user.email}
          </p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link href={lp(locale, "/account")} className="btn-primary px-3 py-2.5">
          <LayoutDashboard className="h-4 w-4" aria-hidden="true" /> {t.nav.dashboard}
        </Link>
        <button
          type="button"
          onClick={async () => {
            await signOut();
            router.push(lp(locale, "/"));
            router.refresh();
          }}
          className="btn-secondary px-3 py-2.5"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" /> {t.nav.signOut}
        </button>
      </div>
    </div>
  );
}
