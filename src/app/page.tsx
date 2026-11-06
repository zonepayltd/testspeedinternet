import type { Metadata } from "next";
import {
  Gauge,
  ShieldCheck,
  Zap,
  Smartphone,
  Wifi,
  BarChart3,
  Server,
  ChevronRight,
} from "lucide-react";
import SpeedTest from "@/components/SpeedTest";
import AdSlot from "@/components/ads/AdSlot";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import { getPublishedPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: { absolute: "Internet Speed Test: Free Download, Upload & Ping Test" },
  description:
    "Run a free internet speed test now. Measure your download speed, upload speed, ping and jitter in seconds on any device. No app or signup required.",
  alternates: { canonical: "/" },
};

const FEATURES = [
  {
    icon: Zap,
    title: "Instant & Accurate",
    text: "Get precise download, upload and ping results in seconds using multiple parallel connections.",
  },
  {
    icon: ShieldCheck,
    title: "100% Free & Private",
    text: "No signup, no app, no tracking of your personal data. Just open the page and hit GO.",
  },
  {
    icon: Smartphone,
    title: "Works on Any Device",
    text: "Test your speed on your phone, tablet, laptop or desktop. The tool is fully responsive.",
  },
  {
    icon: Wifi,
    title: "WiFi, Fiber, 5G & Cable",
    text: "Whatever connection you're on, measure the real bandwidth you get from your provider.",
  },
];

const STEPS = [
  {
    icon: Gauge,
    title: "Press GO",
    text: "Click the GO button to start your internet speed test instantly.",
  },
  {
    icon: Server,
    title: "We measure your line",
    text: "We send and receive data to measure your download, upload, ping and jitter.",
  },
  {
    icon: BarChart3,
    title: "Read your results",
    text: "See your speed in Mbps and check if you're getting what you pay for.",
  },
];

const SPEED_GUIDE = [
  { use: "Web browsing & email", speed: "5–10 Mbps" },
  { use: "HD video streaming", speed: "10–25 Mbps" },
  { use: "4K streaming & gaming", speed: "25–100 Mbps" },
  { use: "Multiple users / 4K + work", speed: "100–500 Mbps" },
  { use: "Heavy households & creators", speed: "500–1000+ Mbps" },
];

const FAQS = [
  {
    q: "What is a good internet speed?",
    a: "For most households, a download speed of 25–100 Mbps is good for streaming, browsing and video calls. Larger homes, 4K streaming or gaming benefit from 100–500 Mbps. The right speed depends on how many devices use your connection at once.",
  },
  {
    q: "How does this internet speed test work?",
    a: "Our speed test measures three things: download speed (how fast you receive data), upload speed (how fast you send data), and ping/latency (how quickly your connection responds). It opens several connections to our servers, transfers data for a few seconds, and calculates your real throughput in Mbps.",
  },
  {
    q: "Why is my speed test result lower than my plan?",
    a: "WiFi interference, distance from your router, the device you're using, background downloads, VPNs and peak-hour congestion can all lower your measured speed. For the most accurate result, test on a wired connection with other devices idle.",
  },
  {
    q: "What do download, upload and ping mean?",
    a: "Download speed is how fast you can pull data from the internet (streaming, browsing). Upload speed is how fast you can send data (video calls, backups). Ping is the response time of your connection in milliseconds, and lower is better, especially for gaming.",
  },
  {
    q: "Is this internet speed test free?",
    a: "Yes. TestSpeedInternet is completely free, requires no signup and no app download. You can run as many speed tests as you like, on any device.",
  },
];

export default async function HomePage() {
  const latest = (await getPublishedPosts()).slice(0, 6);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "TestSpeedInternet",
    url: "https://www.testspeedinternet.com",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    description:
      "Free internet speed test to measure your download speed, upload speed, ping and jitter on any device.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />

      {/* Hero + Speed Test — full viewport, test as the centerpiece */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-gradient-to-b from-brand-50/80 via-white to-white">
        {/* Decorative background */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(70%_60%_at_50%_0%,rgba(37,99,235,0.12),transparent)]" />
          <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="absolute -right-24 top-40 h-72 w-72 rounded-full bg-brand-300/20 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(60%_50%_at_50%_0%,black,transparent)]" />
        </div>

        <div className="container relative flex flex-col items-center py-8 text-center sm:py-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-600 shadow-sm backdrop-blur sm:px-3.5 sm:py-1.5 sm:text-xs">
            <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
            Free • No signup • Real-time results
          </span>

          <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:mt-5 sm:text-5xl">
            Test Your Internet Speed{" "}
            <span className="bg-gradient-to-r from-brand-600 to-cyan-500 bg-clip-text text-transparent">
              in Seconds
            </span>
          </h1>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500 sm:mt-4 sm:max-w-xl sm:text-lg">
            Check your download, upload, ping and jitter on any device. Press GO and see
            if you&apos;re getting the speed you pay for.
          </p>

          {/* Speed test — the centerpiece */}
          <div id="speed-test" className="mt-6 w-full scroll-mt-24 sm:mt-10">
            <SpeedTest />
          </div>
        </div>
      </section>

      {/* In-content ad */}
      <AdSlot placement="inContent" className="container max-w-4xl px-4 py-8" />

      {/* Features */}
      <section className="border-t border-slate-100 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Why use our internet speed test?
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              A fast, accurate and private way to measure your connection.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-slate-100 bg-slate-50 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              How the speed test works
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              Three simple steps to measure your internet connection.
            </p>
          </div>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li
                key={title}
                className="relative rounded-2xl border border-slate-200 bg-white p-6"
              >
                <span className="absolute -top-3 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Good speed guide */}
      <section className="border-t border-slate-100 py-16 md:py-24">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              What is a good internet speed?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-500">
              The internet speed you need depends on what you do online and how
              many devices share your connection. Use this guide to see whether
              your speed test result fits your needs.
            </p>
            <a
              href="#speed-test"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Run your speed test
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">What you do</th>
                  <th className="px-5 py-3 font-semibold">Recommended speed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {SPEED_GUIDE.map((row) => (
                  <tr key={row.use} className="bg-white">
                    <td className="px-5 py-3 text-slate-700">{row.use}</td>
                    <td className="px-5 py-3 font-semibold text-slate-900">
                      {row.speed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-slate-100 bg-slate-50 py-16 md:py-24">
        <div className="container max-w-3xl">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Frequently asked questions
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
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Latest guides */}
      {latest.length > 0 && (
        <section className="border-t border-slate-100 py-16 md:py-24">
          <div className="container">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  Guides to a faster connection
                </h2>
                <p className="mt-3 text-lg text-slate-500">
                  Plain-English help with WiFi, ping, streaming and slow internet.
                </p>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                All articles
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-14 text-center shadow-xl">
            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Ready to test your internet speed?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
              It&apos;s free, fast and works on any device. Find out your real
              download and upload speed now.
            </p>
            <a
              href="#speed-test"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 text-base font-bold text-brand-700 shadow-lg transition-transform hover:scale-105"
            >
              <Gauge className="h-5 w-5" aria-hidden="true" />
              Start Speed Test
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
