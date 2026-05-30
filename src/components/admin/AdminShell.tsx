"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  FileText,
  Megaphone,
  Mail,
  Settings,
  LogOut,
  Gauge,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/visitors", label: "Visitors", icon: Users },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/ads", label: "Ads", icon: Megaphone },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminShell({
  username,
  children,
}: {
  username: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  // Poll unread message count for the notification badge.
  useEffect(() => {
    let active = true;
    const load = () =>
      fetch("/api/admin/messages", { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => {
          if (active && d.ok) setUnread(d.unread || 0);
        })
        .catch(() => {});
    load();
    const t = setInterval(load, 30_000);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, [pathname]);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-slate-200 px-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
            <Gauge className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-sm font-extrabold tracking-tight text-slate-900">
            Test Speed <span className="text-brand-600">Admin</span>
          </span>
        </div>

        <nav className="p-3">
          <ul className="space-y-1">
            {NAV.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive(href)
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span className="flex-1">{label}</span>
                  {href === "/admin/messages" && unread > 0 && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">
                      {unread > 99 ? "99+" : unread}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute inset-x-0 bottom-0 border-t border-slate-200 p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <ExternalLink className="h-5 w-5" aria-hidden="true" />
            View site
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Backdrop (mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex flex-1 items-center justify-end gap-3">
            <span className="text-sm text-slate-500">
              Signed in as <span className="font-semibold text-slate-800">{username}</span>
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold uppercase text-brand-700">
              {username.slice(0, 2)}
            </span>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
