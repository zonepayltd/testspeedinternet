import Link from "next/link";
import { Gauge, Home, Search, Newspaper } from "lucide-react";

export const metadata = {
  title: "Page not found (404)",
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: "/", label: "Speed test", icon: Gauge },
  { href: "/what-is-my-ip", label: "What is my IP", icon: Search },
  { href: "/blog", label: "Blog", icon: Newspaper },
];

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(37,99,235,0.12),transparent)]" />
      <div className="container flex flex-col items-center py-16 text-center">
        <p className="bg-gradient-to-r from-brand-600 to-cyan-500 bg-clip-text text-7xl font-extrabold tracking-tight text-transparent sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          This page took a wrong turn
        </h1>
        <p className="mt-3 max-w-md text-slate-500">
          The page you&apos;re looking for doesn&apos;t exist or was moved. Let&apos;s get you
          back on track.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-transform hover:scale-105"
        >
          <Home className="h-5 w-5" aria-hidden="true" />
          Back to home
        </Link>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-brand-200 hover:text-brand-600"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
