import Link from "next/link";
import { ArrowRight, ArrowUp, BookOpenCheck, CalendarDays, Languages, Mail, ShieldCheck } from "lucide-react";
import { COMPANY } from "@/lib/company";
import { LOCALE_META, lp, pick, type Locale } from "@/i18n/config";
import { commonMessages } from "@/i18n/messages/common";
import { legalUiMessages, type LegalBlock, type LegalDoc } from "@/i18n/messages/legal";

/* --------------------------------------------------------------------------
   <Rich>: renders message strings with a tiny inline markup
     [label](/path)      -> localized internal link
     [label](https://…)  -> external link, new tab
     {email}             -> mailto link
     {brand} {company}   -> brand / legal name
   -------------------------------------------------------------------------- */
const TOKEN = /\[([^\]]+)\]\(([^)\s]+)\)|\{email\}/g;

/** Replace {brand} / {company} placeholders with plain text. */
export function fill(text: string): string {
  return text.split("{brand}").join(COMPANY.brand).split("{company}").join(COMPANY.legalName);
}

/** Plain-text version (links reduced to their labels), e.g. for metadata or JSON-LD. */
export function plain(text: string): string {
  return fill(text).replace(TOKEN, (all, label) => (all === "{email}" ? COMPANY.email : label));
}

export function Rich({ text, locale, className = "link" }: { text: string; locale: Locale; className?: string }) {
  const src = fill(text);
  const out: React.ReactNode[] = [];
  const re = new RegExp(TOKEN.source, "g");
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (m.index > last) out.push(src.slice(last, m.index));
    const key = `t${m.index}`;
    if (m[0] === "{email}") {
      out.push(
        <a key={key} href={`mailto:${COMPANY.email}`} className={className}>
          <bdi dir="ltr">{COMPANY.email}</bdi>
        </a>
      );
    } else if (m[2].startsWith("/")) {
      out.push(
        <Link key={key} href={lp(locale, m[2])} className={className}>
          {m[1]}
        </Link>
      );
    } else {
      out.push(
        <a key={key} href={m[2]} target="_blank" rel="noopener noreferrer" className={className}>
          {m[1]}
        </a>
      );
    }
    last = m.index + m[0].length;
  }
  if (last < src.length) out.push(src.slice(last));
  return <>{out}</>;
}

/** Localized long date, e.g. "6 novembre 2026". Latin digits everywhere for consistency. */
export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(`${LOCALE_META[locale].htmlLang}-u-nu-latn`, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T12:00:00Z`));
}

const RELATED = [
  { path: "/privacy", key: "privacy" },
  { path: "/cookies", key: "cookies" },
  { path: "/terms", key: "terms" },
  { path: "/dmca", key: "dmca" },
  { path: "/editorial-policy", key: "editorial" },
] as const;

function Block({ block, locale }: { block: LegalBlock; locale: Locale }) {
  if (typeof block === "string") {
    return (
      <p>
        <Rich text={block} locale={locale} />
      </p>
    );
  }
  const items = block.list.map((item, i) => (
    <li key={i} className="ps-1.5">
      <Rich text={item} locale={locale} />
    </li>
  ));
  return block.ordered ? (
    <ol className="list-decimal space-y-2.5 ps-6 marker:font-semibold marker:text-brand-600 dark:marker:text-brand-400">
      {items}
    </ol>
  ) : (
    <ul className="list-disc space-y-2 ps-6 marker:text-brand-500 dark:marker:text-brand-400">{items}</ul>
  );
}

type Props = {
  locale: Locale;
  /** Unlocalized path of this page, e.g. "/privacy". */
  path: string;
  doc: LegalDoc;
  /** ISO date (YYYY-MM-DD). */
  updated: string;
};

export default function LegalPage({ locale, path, doc, updated }: Props) {
  const ui = pick(legalUiMessages, locale);
  const links = pick(commonMessages, locale).footer.links;
  const BadgeIcon = path === "/editorial-policy" ? BookOpenCheck : ShieldCheck;
  const [noticeBefore, noticeAfter = ""] = ui.translationNotice.split("{link}");

  return (
    <>
      {/* Hero */}
      <section className="hero-bg border-b border-slate-200/70 dark:border-white/[0.06]">
        <div aria-hidden="true" className="hero-glow" />
        <div aria-hidden="true" className="hero-grid" />
        <div className="container relative max-w-4xl py-14 text-center md:py-20">
          <span className="eyebrow">
            <BadgeIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {doc.badge}
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            {doc.title}
          </h1>
          <p className="lead mx-auto mt-4 max-w-2xl">
            <Rich text={doc.intro} locale={locale} />
          </p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3.5 py-1.5 text-xs font-medium text-slate-600 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            <CalendarDays className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
            <span>{ui.lastUpdated}</span>
            <time dateTime={updated} className="font-semibold text-slate-900 dark:text-white">
              {formatDate(updated, locale)}
            </time>
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="py-12 md:py-16">
        <div className="container max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-16">
            {/* Table of contents */}
            <aside>
              <nav
                aria-label={ui.onThisPage}
                className="card-muted p-5 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 dark:lg:bg-transparent"
              >
                <p className="kicker">{ui.onThisPage}</p>
                <ol className="mt-3 space-y-0.5 border-s border-slate-200 text-sm dark:border-white/10">
                  {doc.sections.map((s, i) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="-ms-px flex gap-2 border-s-2 border-transparent py-1.5 ps-3.5 leading-snug text-slate-600 transition-colors hover:border-brand-500 hover:text-slate-900 dark:text-slate-400 dark:hover:border-brand-400 dark:hover:text-white"
                      >
                        <span className="tabular w-5 shrink-0 text-slate-400 dark:text-slate-500">{i + 1}</span>
                        <span>{s.heading}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            {/* Document */}
            <article className="min-w-0 max-w-3xl">
              {locale !== "en" && (
                <div className="mb-10 flex gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 text-sm leading-relaxed text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/[0.06] dark:text-amber-100/90">
                  <Languages className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-300" aria-hidden="true" />
                  <p>
                    {noticeBefore}
                    <Link
                      href={lp("en", path)}
                      hrefLang="en"
                      className="font-semibold underline decoration-amber-400 underline-offset-4 hover:decoration-current dark:decoration-amber-300/50"
                    >
                      {ui.englishVersion}
                    </Link>
                    {noticeAfter}
                  </p>
                </div>
              )}

              <div className="space-y-12">
                {doc.sections.map((s, i) => (
                  <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-24">
                    <h2
                      id={`${s.id}-h`}
                      className="flex items-center gap-3 text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl"
                    >
                      <span className="tabular inline-flex h-8 min-w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 px-2 text-sm font-bold text-brand-700 ring-1 ring-inset ring-brand-100 dark:bg-brand-400/10 dark:text-brand-300 dark:ring-brand-400/20">
                        {i + 1}
                      </span>
                      <span>{s.heading}</span>
                    </h2>
                    <div className="mt-4 space-y-4 text-[0.975rem] leading-[1.75] text-slate-700 dark:text-slate-300">
                      {s.body.map((b, j) => (
                        <Block key={j} block={b} locale={locale} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <div className="mt-10 flex justify-end">
                <a href="#main" className="btn-ghost px-3 py-2 text-xs">
                  <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                  {ui.backToTop}
                </a>
              </div>

              {/* Contact card */}
              <div className="card mt-4 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                <div className="flex items-start gap-4">
                  <span className="icon-tile">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="h-card">{ui.questions}</h2>
                    <p className="muted mt-1 text-sm leading-relaxed">{ui.questionsText}</p>
                    <a href={`mailto:${COMPANY.email}`} className="link mt-1 inline-block text-sm">
                      <bdi dir="ltr">{COMPANY.email}</bdi>
                    </a>
                  </div>
                </div>
                <Link href={lp(locale, "/contact")} className="btn-primary shrink-0">
                  {ui.contactUs}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                </Link>
              </div>

              {/* Related policies */}
              <nav aria-label={ui.related} className="mt-10">
                <p className="kicker">{ui.related}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {RELATED.filter((r) => r.path !== path).map((r) => (
                    <li key={r.path}>
                      <Link
                        href={lp(locale, r.path)}
                        className="pill py-1.5 text-sm transition-colors hover:border-brand-300 hover:text-brand-700 dark:hover:border-brand-400/40 dark:hover:text-white"
                      >
                        {links[r.key]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
