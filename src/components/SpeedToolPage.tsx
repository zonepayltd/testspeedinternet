import Link from "next/link";
import { Zap, ShieldCheck, ChevronRight, Gauge, type LucideIcon } from "lucide-react";
import SpeedTest from "@/components/SpeedTest";

export type FAQ = { q: string; a: string };
export type Section = { icon: LucideIcon; title: string; text: string };

type Props = {
  badge: string;
  titleLead: string;
  titleHighlight: string;
  intro: string;
  mode?: "full" | "download" | "upload" | "ping";
  highlights?: string[];
  sectionsHeading: string;
  sections: Section[];
  faqHeading: string;
  faqs: FAQ[];
};

export default function SpeedToolPage({
  badge,
  titleLead,
  titleHighlight,
  intro,
  mode = "full",
  highlights = ["Accurate real-time results", "No app needed", "Works on every device"],
  sectionsHeading,
  sections,
  faqHeading,
  faqs,
}: Props) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero + test */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/80 via-white to-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-[440px] bg-[radial-gradient(70%_60%_at_50%_0%,rgba(37,99,235,0.12),transparent)]" />
          <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="absolute -right-24 top-40 h-72 w-72 rounded-full bg-brand-300/20 blur-3xl" />
        </div>

        <div className="container relative flex flex-col items-center py-14 text-center md:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 shadow-sm backdrop-blur">
            <Zap className="h-3.5 w-3.5" aria-hidden="true" />
            {badge}
          </span>

          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
            {titleLead}{" "}
            <span className="bg-gradient-to-r from-brand-600 to-cyan-500 bg-clip-text text-transparent">
              {titleHighlight}
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
            {intro}
          </p>

          <div id="speed-test" className="mt-10 w-full scroll-mt-24">
            <SpeedTest mode={mode} />
          </div>

          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent-500" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* About / content */}
      <section className="border-t border-slate-100 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {sectionsHeading}
            </h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-2">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-600/5"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-100/60 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/25 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="relative mt-4 text-lg font-bold text-slate-900">{s.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-slate-500">{s.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-slate-100 bg-slate-50 py-16 md:py-24">
        <div className="container max-w-3xl">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {faqHeading}
          </h2>
          <div className="mt-10 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-slate-200 bg-white p-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-semibold text-slate-900">
                  {faq.q}
                  <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-90" aria-hidden="true" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{faq.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              <Gauge className="h-4 w-4" aria-hidden="true" />
              Run the full internet speed test
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
