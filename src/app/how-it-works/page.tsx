import type { Metadata } from "next";
import Link from "next/link";
import {
  MousePointerClick,
  Server,
  Download,
  Upload,
  Zap,
  BarChart3,
  Gauge,
  ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works | How Our Internet Speed Test Measures Your Connection",
  description:
    "Learn how our internet speed test works. See how we measure your download speed, upload speed, ping and jitter using global servers and parallel connections.",
  keywords: [
    "how internet speed test works",
    "how speed test measures",
    "how is internet speed measured",
    "download upload ping explained",
    "speed test methodology",
  ],
  alternates: { canonical: "/how-it-works" },
};

const STEPS = [
  {
    icon: MousePointerClick,
    title: "You press GO",
    text: "The test starts instantly in your browser. There is nothing to install and no account to create.",
  },
  {
    icon: Zap,
    title: "We measure ping & jitter",
    text: "First we send small requests to a nearby server to measure your latency (ping) and how stable it is (jitter), in milliseconds.",
  },
  {
    icon: Download,
    title: "We test download speed",
    text: "We open several parallel connections and download data for a few seconds, measuring how fast your connection receives it in Mbps.",
  },
  {
    icon: Upload,
    title: "We test upload speed",
    text: "Next we send data the other way to measure how fast your connection can upload, again using multiple parallel streams.",
  },
  {
    icon: BarChart3,
    title: "You get your results",
    text: "We calculate your true throughput and show your download, upload, ping and jitter, plus your provider and location.",
  },
];

const DETAILS = [
  {
    icon: Server,
    title: "Global servers",
    text: "Tests run against the worldwide Cloudflare network, so data travels over the real internet and the results reflect your actual connection — accurate even during local development.",
  },
  {
    icon: Gauge,
    title: "Parallel connections",
    text: "We use several simultaneous connections to fully saturate your line, the same technique professional speed tests use to reveal your real maximum speed.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/80 via-white to-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(37,99,235,0.12),transparent)]" />
        <div className="container relative flex flex-col items-center py-14 text-center md:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 shadow-sm backdrop-blur">
            <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
            How It Works
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
            How Our Speed Test{" "}
            <span className="bg-gradient-to-r from-brand-600 to-cyan-500 bg-clip-text text-transparent">
              Measures Your Connection
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
            A simple, accurate process that checks your download, upload, ping and jitter in just a few seconds.
          </p>
        </div>
      </section>

      {/* Steps timeline */}
      <section className="pb-4">
        <div className="container max-w-3xl">
          <ol className="relative space-y-6 border-l-2 border-brand-100 pl-8">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="relative">
                <span className="absolute -left-[42px] flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-600/25 ring-4 ring-white">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-500">
                      Step {i + 1}
                    </span>
                  </div>
                  <h2 className="mt-1 text-lg font-bold text-slate-900">{title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Details */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2">
            {DETAILS.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-600/5"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/25 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-transform hover:scale-105"
            >
              <Gauge className="h-5 w-5" aria-hidden="true" />
              Try it now
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
