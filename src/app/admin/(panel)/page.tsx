import Link from "next/link";
import {
  Users,
  Eye,
  FileText,
  Search,
  BarChart3,
  Settings,
  ArrowRight,
} from "lucide-react";
import { adminConfigured } from "@/lib/firebaseAdmin";

const STATS = [
  { label: "Live visitors", value: "—", icon: Users, hint: "Right now" },
  { label: "Visits today", value: "—", icon: Eye, hint: "Last 24h" },
  { label: "From search", value: "—", icon: Search, hint: "Google / Bing" },
  { label: "Blog posts", value: "—", icon: FileText, hint: "Published" },
];

const SHORTCUTS = [
  { href: "/admin/analytics", label: "Analytics", text: "Live users, traffic sources and trends.", icon: BarChart3 },
  { href: "/admin/visitors", label: "Visitors", text: "Every visitor and the pages they viewed.", icon: Users },
  { href: "/admin/blog", label: "Blog", text: "Write and manage blog posts.", icon: FileText },
  { href: "/admin/settings", label: "Settings", text: "Search Console, Bing, captcha and more.", icon: Settings },
];

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Welcome back to your control panel.</p>
        </div>
      </div>

      {!adminConfigured && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          Firebase Admin is not fully configured yet — analytics and blog data will be empty until it is connected.
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map(({ label, value, icon: Icon, hint }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
              <Icon className="h-4 w-4 text-brand-500" aria-hidden="true" />
            </div>
            <p className="mt-3 text-3xl font-extrabold tabular-nums text-slate-900">{value}</p>
            <p className="mt-1 text-xs text-slate-400">{hint}</p>
          </div>
        ))}
      </div>

      {/* Shortcuts */}
      <h2 className="mt-10 text-sm font-bold uppercase tracking-wider text-slate-400">Manage</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {SHORTCUTS.map(({ href, label, text, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">{label}</h3>
                <ArrowRight className="h-4 w-4 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-brand-500" aria-hidden="true" />
              </div>
              <p className="mt-1 text-sm text-slate-500">{text}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
