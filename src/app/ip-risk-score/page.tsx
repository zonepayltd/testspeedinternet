import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Gauge as GaugeIcon,
  Eye,
  Server,
  Ban,
  Bot,
  ChevronRight,
  Globe2,
} from "lucide-react";
import IpSecurity from "@/components/IpSecurity";

export const metadata: Metadata = {
  title: "IP Risk Score | Check Your IP Reputation, VPN & Proxy Score",
  description:
    "Check your IP risk score for free. Instantly see if your IP address is flagged as a proxy, VPN, Tor or high-risk, plus your connection type and fraud score (0-100).",
  keywords: [
    "ip risk score",
    "ip reputation check",
    "ip fraud score",
    "check ip risk",
    "is my ip blacklisted",
    "vpn detection",
    "proxy detection",
    "is my ip clean",
    "ip score checker",
    "ip address reputation",
  ],
  alternates: { canonical: "/ip-risk-score" },
  openGraph: {
    type: "website",
    url: "https://testspeedinternet.com/ip-risk-score",
    title: "IP Risk Score Checker",
    description:
      "See if your IP is flagged as a proxy, VPN or high-risk, with a 0-100 fraud score and connection type.",
  },
};

const FACTORS = [
  {
    icon: Eye,
    title: "VPN & proxy use",
    text: "Traffic routed through a VPN, proxy or Tor exit node is the most common reason an IP gets a higher risk score.",
  },
  {
    icon: Server,
    title: "Data-center IPs",
    text: "Addresses owned by hosting and cloud providers score higher than residential ISP connections, because bots often run there.",
  },
  {
    icon: Ban,
    title: "Blacklists & past abuse",
    text: "If an IP (or its range) was used for spam, attacks or fraud, it can be listed on blacklists and flagged for a while.",
  },
  {
    icon: Bot,
    title: "Bot & automated activity",
    text: "Scraping, credential stuffing and other automated behaviour from an IP raises its reputation risk.",
  },
];

const SCORE_BANDS = [
  { range: "0 – 25", label: "Low risk", desc: "Normal residential or business connection. Trusted by most sites.", tone: "text-emerald-600" },
  { range: "26 – 65", label: "Medium risk", desc: "Some risk signals, e.g. a shared or dynamic IP, or light proxy use.", tone: "text-amber-600" },
  { range: "66 – 100", label: "High risk", desc: "Strong proxy / VPN / abuse signals. Often blocked or challenged.", tone: "text-red-600" },
];

const FAQS = [
  {
    q: "What is an IP risk score?",
    a: "An IP risk score is a number from 0 to 100 that estimates how likely an IP address is associated with fraud, bots, proxies, VPNs or past abuse. A lower score means a cleaner, more trusted connection; a higher score means more risk signals.",
  },
  {
    q: "What is a good IP risk score?",
    a: "A score of 0–25 is considered low risk and is typical for a normal home (residential) internet connection. 26–65 is medium risk, and 66–100 is high risk and is more likely to be blocked or shown extra security checks by websites.",
  },
  {
    q: "Why is my IP flagged as a proxy or VPN?",
    a: "If you are connected through a VPN, proxy or Tor, your traffic exits from that service's IP, which is detected and flagged. Data-center and hosting IPs are also commonly labelled as proxies even when you are not actively using one.",
  },
  {
    q: "How can I lower my IP risk score?",
    a: "Turn off any VPN or proxy, use a normal residential connection from your ISP, and request a new IP (restart your router for a dynamic IP, or contact your provider). Avoiding blacklisted ranges and abusive activity also keeps your score low.",
  },
  {
    q: "Is a high IP risk score dangerous for me?",
    a: "Not directly. It mainly means some websites and services may block you, ask for extra verification (like CAPTCHAs), or limit access, because they treat the IP as higher risk. It does not reveal your identity.",
  },
];

export default function IpRiskScorePage() {
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/80 via-white to-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(70%_60%_at_50%_0%,rgba(37,99,235,0.12),transparent)]" />
          <div className="absolute -left-24 top-32 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
        </div>

        <div className="container relative flex flex-col items-center py-14 text-center md:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 shadow-sm backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            IP Reputation Checker
          </span>

          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
            Check Your{" "}
            <span className="bg-gradient-to-r from-brand-600 to-cyan-500 bg-clip-text text-transparent">
              IP Risk Score
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
            Instantly see whether your IP address is clean or flagged as a proxy, VPN or
            high-risk, with a 0-100 risk score and your connection type. Free and private.
          </p>

          <div className="mt-10 w-full">
            <IpSecurity />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <Link href="/what-is-my-ip" className="inline-flex items-center gap-1.5 font-semibold text-brand-600 hover:text-brand-700">
              <Globe2 className="h-4 w-4" aria-hidden="true" />
              See full IP details
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/#speed-test" className="inline-flex items-center gap-1.5 font-semibold text-brand-600 hover:text-brand-700">
              <GaugeIcon className="h-4 w-4" aria-hidden="true" />
              Test your speed
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Score bands */}
      <section className="border-t border-slate-100 py-16 md:py-24">
        <div className="container max-w-4xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              How to read your IP risk score
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              The score runs from 0 (clean) to 100 (high risk). Here is what each range means.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {SCORE_BANDS.map((band) => (
              <div key={band.range} className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
                <p className={`text-2xl font-extrabold ${band.tone}`}>{band.range}</p>
                <p className="mt-1 text-sm font-bold uppercase tracking-wider text-slate-700">{band.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{band.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Factors */}
      <section className="border-t border-slate-100 bg-slate-50 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              What affects your IP risk score?
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              Several signals decide whether an IP looks trustworthy or risky.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FACTORS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md">
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

      {/* FAQ */}
      <section className="border-t border-slate-100 py-16 md:py-24">
        <div className="container max-w-3xl">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            IP risk score FAQ
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
