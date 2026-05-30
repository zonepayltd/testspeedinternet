import { ShieldCheck } from "lucide-react";

export type LegalSection = { heading: string; body: string[] };

type Props = {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
};

export default function LegalPage({ title, intro, updated, sections }: Props) {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/80 via-white to-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(37,99,235,0.10),transparent)]" />
        <div className="container relative py-14 text-center md:py-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 shadow-sm backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Legal
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-500">
            {intro}
          </p>
          <p className="mt-3 text-xs font-medium uppercase tracking-wider text-slate-400">
            Last updated: {updated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-16 md:pb-24">
        <div className="container max-w-3xl space-y-8">
          {sections.map((s, i) => (
            <div key={s.heading}>
              <h2 className="text-xl font-bold text-slate-900">
                {i + 1}. {s.heading}
              </h2>
              {s.body.map((p, j) => (
                <p key={j} className="mt-3 text-sm leading-relaxed text-slate-600">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
