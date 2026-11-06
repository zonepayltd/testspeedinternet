import Link from "next/link";
import { Gauge } from "lucide-react";

type Props = { title: string; text: string; button: string; href: string };

/** Closing call-to-action panel (brand gradient in both themes). */
export default function CtaBanner({ title, text, button, href }: Props) {
  return (
    <section className="section">
      <div className="container">
        <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 px-6 py-14 text-center shadow-xl shadow-brand-900/20 ring-1 ring-inset ring-white/10 dark:from-brand-600 dark:via-brand-800 dark:to-ink-900 dark:shadow-none sm:px-12 md:py-20">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(70%_70%_at_50%_0%,black,transparent)]"
          />
          <div aria-hidden="true" className="absolute -top-24 start-1/2 -z-10 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-cyan-400/25 blur-3xl rtl:translate-x-1/2" />
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-brand-100 sm:text-lg">{text}</p>
          <Link href={href} className="btn-white mt-8 px-7 py-3.5 text-base">
            <Gauge className="h-5 w-5" aria-hidden="true" />
            {button}
          </Link>
        </div>
      </div>
    </section>
  );
}
