import Link from "next/link";
import { ArrowRight, BookOpen, Gauge, Globe2, HelpCircle, Home, Mail, ShieldAlert } from "lucide-react";
import { lp, pick, type Locale } from "@/i18n/config";
import { errorMessages } from "@/i18n/messages/errors";

const LINKS = [
  { key: "speedTest", href: "/", icon: Gauge },
  { key: "myIp", href: "/what-is-my-ip", icon: Globe2 },
  { key: "ipRisk", href: "/ip-risk-score", icon: ShieldAlert },
  { key: "blog", href: "/blog", icon: BookOpen },
  { key: "faq", href: "/faq", icon: HelpCircle },
  { key: "contact", href: "/contact", icon: Mail },
] as const;

/** Branded, translated 404 used by app/not-found.tsx and app/[locale]/not-found.tsx. */
export default function NotFoundView({ locale }: { locale: Locale }) {
  const t = pick(errorMessages, locale).notFound;

  return (
    <section className="hero-bg">
      <div aria-hidden="true" className="hero-glow" />
      <div aria-hidden="true" className="hero-grid" />
      <div className="container relative flex flex-col items-center py-16 text-center md:py-24">
        <span className="eyebrow">{t.code}</span>
        <p
          aria-hidden="true"
          className="text-gradient mt-6 select-none text-8xl font-extrabold leading-none tracking-tighter sm:text-9xl"
          dir="ltr"
        >
          404
        </p>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">{t.title}</h1>
        <p className="lead mt-4 max-w-lg">{t.text}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href={lp(locale, "/")} className="btn-primary">
            <Home className="h-4 w-4" aria-hidden="true" />
            {t.home}
          </Link>
          <Link href={lp(locale, "/contact")} className="btn-secondary">
            {t.contact}
          </Link>
        </div>

        <div className="mt-16 w-full max-w-4xl text-start">
          <p className="kicker text-center">{t.popular}</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LINKS.map(({ key, href, icon: Icon }) => (
              <li key={key}>
                <Link href={lp(locale, href)} className="card card-hover group flex items-center gap-4 p-4">
                  <span className="icon-tile h-10 w-10">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-900 dark:text-white">{t.links[key].title}</span>
                    <span className="muted block truncate text-xs">{t.links[key].text}</span>
                  </span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600 rtl:rotate-180 rtl:group-hover:-translate-x-0.5 dark:group-hover:text-brand-400"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
