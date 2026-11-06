"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AlertTriangle, ChevronDown, ChevronRight, ExternalLink, Gauge, LogOut, Menu, Search, X } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { NAV_GROUPS, activeNav, type NavItem } from "@/components/admin/dashboard/nav";
import CommandPalette from "@/components/admin/dashboard/CommandPalette";

function Logo() {
  return (
    <Link href="/admin" className="flex items-center gap-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm shadow-brand-600/30">
        <Gauge className="h-[18px] w-[18px]" aria-hidden="true" />
      </span>
      <span className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">TestSpeedInternet</span>
      <span className="rounded-md bg-slate-900 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white dark:bg-white/10 dark:text-slate-200">Admin</span>
    </Link>
  );
}

function NavBadge({ item, online, unread }: { item: NavItem; online: number | null; unread: number }) {
  if (item.badge === "online" && online != null)
    return (
      <span className="ms-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-px text-[11px] font-semibold tabular-nums text-emerald-700 ring-1 ring-inset ring-emerald-200/70 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20">
        <span className={`h-1.5 w-1.5 rounded-full ${online > 0 ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`} aria-hidden="true" />
        {online}
        <span className="sr-only"> online</span>
      </span>
    );
  if (item.badge === "unread" && unread > 0)
    return (
      <span className="ms-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-semibold tabular-nums text-white">
        {unread > 99 ? "99+" : unread}
        <span className="sr-only"> unread</span>
      </span>
    );
  return null;
}

export default function AdminShell({ username, children }: { username: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawer, setDrawer] = useState(false);
  const [palette, setPalette] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [online, setOnline] = useState<number | null>(null);
  const [unread, setUnread] = useState(0);
  const userRef = useRef<HTMLDivElement>(null);

  // Badges: one cheap call returns the online count and unread messages.
  useEffect(() => {
    let alive = true;
    const load = () => {
      if (document.visibilityState === "hidden") return;
      fetch("/api/admin/online", { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => {
          if (!alive || !d?.ok) return;
          setOnline(d.count ?? 0);
          setUnread(d.unread ?? 0);
        })
        .catch(() => {});
    };
    load();
    const t = setInterval(load, 30_000);
    // Pages can ask for an immediate refresh (e.g. after marking messages read).
    window.addEventListener("admin:refresh-badges", load);
    return () => {
      alive = false;
      clearInterval(t);
      window.removeEventListener("admin:refresh-badges", load);
    };
  }, [pathname]);

  // Close drawer on navigation; Cmd/Ctrl+K opens the palette.
  useEffect(() => setDrawer(false), [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((v) => !v);
      } else if (e.key === "Escape") {
        setDrawer(false);
        setUserMenu(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);
  useEffect(() => {
    if (!userMenu) return;
    const close = (e: MouseEvent) => userRef.current && !userRef.current.contains(e.target as Node) && setUserMenu(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [userMenu]);

  const logout = useCallback(async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    router.replace("/admin/login");
    router.refresh();
  }, [router]);

  const current = activeNav(pathname);
  // Breadcrumb tail for nested pages, e.g. /admin/blog/new → "New".
  const tail = (() => {
    if (!current || !pathname || pathname === current.href) return "";
    const seg = pathname.slice(current.href.length).split("/").filter(Boolean)[0] || "";
    if (!seg) return "";
    if (seg === "new") return "New";
    if (seg === "data") return "Data & privacy";
    return seg.length > 18 ? "Edit" : decodeURIComponent(seg);
  })();

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center justify-between px-5">
        <Logo />
        <button type="button" onClick={() => setDrawer(false)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/[0.06] lg:hidden" aria-label="Close menu">
          <X className="h-4 w-4" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 pb-4" aria-label="Admin">
        {NAV_GROUPS.map((g) => (
          <div key={g.label} className="mt-4 first:mt-1">
            <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{g.label}</p>
            <ul className="space-y-0.5">
              {g.items.map((item) => {
                const active = current?.href === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                        active
                          ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80 dark:bg-white/[0.07] dark:text-white dark:shadow-none dark:ring-white/[0.06]"
                          : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.04] dark:hover:text-white"
                      }`}
                    >
                      {active && <span className="absolute inset-y-2 start-0 w-0.5 rounded-full bg-brand-600 dark:bg-brand-400" aria-hidden="true" />}
                      <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-brand-600 dark:text-brand-400" : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"}`} aria-hidden="true" />
                      <span className="truncate">{item.label}</span>
                      <NavBadge item={item} online={online} unread={unread} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="shrink-0 border-t border-slate-200/80 p-3 dark:border-white/[0.06]">
        <a href="/" target="_blank" rel="noopener" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.04] dark:hover:text-white">
          <ExternalLink className="h-[18px] w-[18px] text-slate-400" aria-hidden="true" />
          View site
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-ink-950 dark:text-slate-100">
      {/* Sidebar — fixed on desktop, drawer on mobile */}
      <aside className="fixed inset-y-0 start-0 z-40 hidden w-64 border-e border-slate-200/80 bg-slate-50 dark:border-white/[0.06] dark:bg-ink-950 lg:block">{sidebar}</aside>
      <div className={`fixed inset-0 z-50 lg:hidden ${drawer ? "" : "pointer-events-none"}`} aria-hidden={!drawer}>
        <div className={`absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] transition-opacity ${drawer ? "opacity-100" : "opacity-0"}`} onClick={() => setDrawer(false)} />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          className={`absolute inset-y-0 start-0 w-72 max-w-[85vw] border-e border-slate-200 bg-slate-50 shadow-2xl transition-transform duration-200 dark:border-white/[0.08] dark:bg-ink-950 ${drawer ? "translate-x-0" : "-translate-x-full"}`}
        >
          {drawer && sidebar}
        </aside>
      </div>

      <div className="lg:ps-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200/80 bg-slate-50/85 px-4 backdrop-blur-md dark:border-white/[0.06] dark:bg-ink-950/80 sm:px-6 lg:px-8">
          <button type="button" onClick={() => setDrawer(true)} className="-ms-1 inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-white/[0.06] lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>

          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
            <Link href="/admin" className="hidden text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 sm:inline">
              Admin
            </Link>
            <ChevronRight className="hidden h-3.5 w-3.5 shrink-0 text-slate-300 dark:text-slate-600 sm:block" aria-hidden="true" />
            {tail && current ? (
              <>
                <Link href={current.href} className="truncate text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">
                  {current.label}
                </Link>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300 dark:text-slate-600" aria-hidden="true" />
                <span className="truncate font-semibold text-slate-900 dark:text-white">{tail}</span>
              </>
            ) : (
              <span className="truncate font-semibold text-slate-900 dark:text-white">{current?.label || "Admin"}</span>
            )}
          </nav>

          <div className="ms-auto flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setPalette(true)}
              className="hidden h-9 w-64 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-400 shadow-sm transition-colors hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/20 md:flex"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span className="flex-1 text-start">Search…</span>
              <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-px font-sans text-[10px] font-medium text-slate-500 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-400">⌘K</kbd>
            </button>
            <button type="button" onClick={() => setPalette(true)} className="icon-btn md:hidden" aria-label="Search (Ctrl+K)">
              <Search className="h-[18px] w-[18px]" />
            </button>
            <a href="/" target="_blank" rel="noopener" className="hidden h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white sm:inline-flex">
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              View site
            </a>
            <ThemeToggle />
            <div ref={userRef} className="relative">
              <button
                type="button"
                onClick={() => setUserMenu((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={userMenu}
                aria-label="Account menu"
                className="flex h-9 items-center gap-1.5 rounded-lg ps-1 pe-1.5 hover:bg-slate-200/60 dark:hover:bg-white/[0.06]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-[11px] font-bold uppercase text-white">{username.slice(0, 2)}</span>
                <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" aria-hidden="true" />
              </button>
              {userMenu && (
                <div role="menu" className="absolute end-0 top-11 z-50 w-56 animate-scale-in overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-xl dark:border-white/10 dark:bg-ink-900">
                  <div className="px-3 py-2.5">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{username}</p>
                  </div>
                  <div className="my-1 h-px bg-slate-100 dark:bg-white/[0.06]" />
                  <Link role="menuitem" href="/admin/settings" onClick={() => setUserMenu(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/[0.06]">
                    Settings
                  </Link>
                  <a role="menuitem" href="/" target="_blank" rel="noopener" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/[0.06] sm:hidden">
                    View site
                  </a>
                  <button role="menuitem" type="button" onClick={logout} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-400/10">
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <FirebaseBanner />
        <main className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>

      <CommandPalette open={palette} onClose={() => setPalette(false)} onSignOut={logout} />
    </div>
  );
}

/** Slim warning shown on every admin page while this server has no Firebase key. */
function FirebaseBanner() {
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    fetch("/api/admin/account", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setMissing(d?.ok === true && d.firebase === false))
      .catch(() => {});
  }, []);
  if (!missing) return null;
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-3 gap-y-1">
        <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="font-medium">Firebase isn&apos;t connected on this server, so your data can&apos;t load.</span>
        <Link href="/admin" className="font-semibold underline underline-offset-2">How to connect →</Link>
      </div>
    </div>
  );
}
