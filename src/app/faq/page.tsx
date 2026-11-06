import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, ChevronRight, Gauge } from "lucide-react";

export const metadata: Metadata = {
  title: "Speed Test FAQ: Your Questions Answered",
  description:
    "Answers to common questions about internet speed tests, download and upload speed, ping, jitter, accuracy and how to get faster internet. Free speed test FAQ.",
  keywords: [
    "internet speed test faq",
    "speed test questions",
    "what is a good internet speed",
    "why is my internet slow",
    "download upload ping explained",
  ],
  alternates: { canonical: "/faq" },
};

const GROUPS = [
  {
    heading: "Using the speed test",
    faqs: [
      {
        q: "How do I test my internet speed?",
        a: "Open the homepage and press the GO button. The test measures your download speed, upload speed, ping and jitter in a few seconds. No app or signup is required.",
      },
      {
        q: "Is the speed test free?",
        a: "Yes, completely free. You can run as many tests as you like on any device, with no account and no app download.",
      },
      {
        q: "How accurate is the test?",
        a: "We measure against global Cloudflare servers using several parallel connections, the same method professional tools use. For the most accurate result, test on a wired connection with other devices idle.",
      },
      {
        q: "Does it work on mobile?",
        a: "Yes. The test is fully responsive and works in any modern browser on phones, tablets, laptops and desktops.",
      },
    ],
  },
  {
    heading: "Understanding your results",
    faqs: [
      {
        q: "What do download and upload speed mean?",
        a: "Download speed is how fast you receive data (streaming, browsing). Upload speed is how fast you send data (video calls, backups). Both are measured in megabits per second (Mbps).",
      },
      {
        q: "What are ping and jitter?",
        a: "Ping (latency) is your connection's response time in milliseconds; lower is better. Jitter is how much that response time varies, which affects gaming and video calls.",
      },
      {
        q: "What is a good internet speed?",
        a: "For most homes 25–100 Mbps is good. Light browsing needs only 5–10 Mbps, while 4K streaming, gaming and busy households benefit from 100 Mbps or more.",
      },
    ],
  },
  {
    heading: "Fixing slow internet",
    faqs: [
      {
        q: "Why is my speed slower than my plan?",
        a: "WiFi interference, distance from the router, old hardware, VPNs, background downloads and peak-hour congestion can all lower your measured speed. A wired connection usually gives the best result.",
      },
      {
        q: "How can I make my internet faster?",
        a: "Restart your router, move closer to it or use the 5 GHz WiFi band, switch to a wired connection, close bandwidth-heavy apps, and contact your ISP if speeds stay far below your plan.",
      },
    ],
  },
];

export default function FaqPage() {
  const allFaqs = GROUPS.flatMap((g) => g.faqs);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.map((f) => ({
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
            <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
            Help Center
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-brand-600 to-cyan-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
            Everything you need to know about testing your internet speed and understanding your results.
          </p>
        </div>
      </section>

      {/* FAQ groups */}
      <section className="pb-16 md:pb-24">
        <div className="container max-w-3xl space-y-12">
          {GROUPS.map((group) => (
            <div key={group.heading}>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">{group.heading}</h2>
              <div className="mt-5 space-y-3">
                {group.faqs.map((faq) => (
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
          ))}

          <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-6 text-center">
            <p className="text-sm text-slate-600">Still curious about your connection?</p>
            <Link
              href="/"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
            >
              <Gauge className="h-4 w-4" aria-hidden="true" />
              Run a free speed test
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
