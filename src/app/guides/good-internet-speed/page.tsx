import type { Metadata } from "next";
import Link from "next/link";
import {
  Globe,
  Tv,
  Gamepad2,
  Users,
  Video,
  Cloud,
  Gauge,
  ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: "What Is a Good Internet Speed? Mbps Guide (2026)" },
  description:
    "What is a good internet speed? See recommended download and upload speeds in Mbps for streaming, gaming, video calls and big households, and check if yours is fast enough.",
  keywords: [
    "what is a good internet speed",
    "good download speed",
    "good upload speed",
    "how many mbps do i need",
    "internet speed for streaming",
    "internet speed for gaming",
  ],
  alternates: { canonical: "/guides/good-internet-speed" },
};

const USES = [
  { icon: Globe, title: "Browsing & email", speed: "5–10 Mbps", text: "Web pages, email, social media and music streaming for one or two people." },
  { icon: Video, title: "Video calls", speed: "5–15 Mbps", text: "Smooth HD video calls on Zoom, Meet or Teams, including upload." },
  { icon: Tv, title: "HD & 4K streaming", speed: "25–50 Mbps", text: "Netflix, YouTube and Disney+ in HD or 4K without buffering." },
  { icon: Gamepad2, title: "Online gaming", speed: "25–100 Mbps", text: "Low-lag gaming. Speed matters less than a low, stable ping here." },
  { icon: Users, title: "Busy households", speed: "100–500 Mbps", text: "Several people streaming, gaming and working online at the same time." },
  { icon: Cloud, title: "Creators & heavy use", speed: "500–1000+ Mbps", text: "Large uploads, cloud backups, 4K streaming to many devices at once." },
];

const TABLE = [
  { use: "1–2 people, browsing & SD video", down: "10–25 Mbps", up: "3–5 Mbps" },
  { use: "HD streaming & video calls", down: "25–50 Mbps", up: "5–10 Mbps" },
  { use: "4K streaming & gaming", down: "50–100 Mbps", up: "10–20 Mbps" },
  { use: "Family of 3–5, many devices", down: "100–300 Mbps", up: "20–50 Mbps" },
  { use: "Power users & creators", down: "500–1000+ Mbps", up: "50–200 Mbps" },
];

const FAQS = [
  {
    q: "What is a good internet speed?",
    a: "For most households a download speed of 25–100 Mbps is good. It comfortably handles HD and 4K streaming, video calls and several connected devices. Light users are fine with 10–25 Mbps, while large or heavy-use homes benefit from 100–500 Mbps.",
  },
  {
    q: "Is 100 Mbps fast?",
    a: "Yes. 100 Mbps is fast enough for 4K streaming, online gaming and a busy household with multiple devices online at once. It is a great target for most families.",
  },
  {
    q: "What is a good upload speed?",
    a: "5–10 Mbps is enough for most people and video calls. If you upload large files, back up to the cloud or live stream, aim for 20 Mbps or more, which fiber connections usually provide.",
  },
  {
    q: "Does a higher speed always mean better internet?",
    a: "Not always. Beyond what your activities need, extra speed adds little. A low and stable ping, good WiFi coverage and reliability often matter more for everyday experience than a very high Mbps number.",
  },
];

export default function GoodSpeedPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/80 via-white to-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(37,99,235,0.12),transparent)]" />
        <div className="container relative flex flex-col items-center py-14 text-center md:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 shadow-sm backdrop-blur">
            <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
            Speed Guide
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
            What Is a Good{" "}
            <span className="bg-gradient-to-r from-brand-600 to-cyan-500 bg-clip-text text-transparent">
              Internet Speed?
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
            The right speed depends on what you do online and how many devices share your
            connection. Here is how many Mbps you really need.
          </p>
          <Link
            href="/"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
          >
            <Gauge className="h-4 w-4" aria-hidden="true" />
            Test your speed now
          </Link>
        </div>
      </section>

      {/* Use cards */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              How much speed do you need?
            </h2>
            <p className="mt-4 text-lg text-slate-500">Recommended speeds by activity.</p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {USES.map(({ icon: Icon, title, speed, text }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-600/5"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/25 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-extrabold text-brand-600">
                    {speed}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="border-t border-slate-100 bg-slate-50 py-16 md:py-24">
        <div className="container max-w-4xl">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Recommended speed by household
          </h2>
          <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Use case</th>
                  <th className="px-5 py-3 font-semibold">Download</th>
                  <th className="px-5 py-3 font-semibold">Upload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {TABLE.map((row) => (
                  <tr key={row.use}>
                    <td className="px-5 py-3 text-slate-700">{row.use}</td>
                    <td className="px-5 py-3 font-semibold text-slate-900">{row.down}</td>
                    <td className="px-5 py-3 font-semibold text-slate-900">{row.up}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-slate-100 py-16 md:py-24">
        <div className="container max-w-3xl">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Good internet speed FAQ
          </h2>
          <div className="mt-10 space-y-3">
            {FAQS.map((faq) => (
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
        </div>
      </section>
    </>
  );
}
