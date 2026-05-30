import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Eye, Globe2, Network, ChevronRight, Gauge } from "lucide-react";
import IpDetails from "@/components/IpDetails";
import IpSecurity from "@/components/IpSecurity";

export const metadata: Metadata = {
  title: "What Is My IP Address | See Your Public IP, Location & ISP",
  description:
    "Instantly find out what your IP address is. See your public IP, approximate location on a map, internet provider (ISP), city, country and time zone. Free and private.",
  keywords: [
    "what is my ip",
    "my ip address",
    "what is my ip address",
    "ip address lookup",
    "find my ip",
    "show my ip",
    "public ip address",
    "my location",
    "ip reputation check",
    "vpn detection",
    "proxy check",
    "is my ip clean",
  ],
  alternates: { canonical: "/what-is-my-ip" },
  openGraph: {
    type: "website",
    url: "https://testspeedinternet.com/what-is-my-ip",
    title: "What Is My IP Address?",
    description:
      "See your public IP address, location on a map, internet provider, city, country and time zone.",
  },
};

const INFO_CARDS = [
  {
    icon: Globe2,
    title: "What is an IP address?",
    text: "An IP (Internet Protocol) address is a unique number that identifies your device on the internet. Websites use it to send data back to you, much like a postal address for your connection.",
  },
  {
    icon: Network,
    title: "IPv4 vs IPv6",
    text: "IPv4 looks like 192.0.2.1 and is the most common format. IPv6 is newer and longer (e.g. 2001:db8::1), created because the world ran out of IPv4 addresses.",
  },
  {
    icon: Eye,
    title: "Public vs private IP",
    text: "Your public IP is what the internet sees and is assigned by your ISP. Your private IP (like 192.168.x.x) is used only inside your home or office network.",
  },
  {
    icon: Shield,
    title: "How to hide your IP",
    text: "A VPN or proxy routes your traffic through another server, replacing your real IP with theirs. This adds privacy and can let you appear in a different location.",
  },
];

const FAQS = [
  {
    q: "What is my IP address?",
    a: "Your IP address is shown at the top of this page. It is the public IP assigned to your connection by your internet service provider, and it is how websites and online services identify and send data to you.",
  },
  {
    q: "Is showing my IP address dangerous?",
    a: "Your public IP is visible to every website you visit, so seeing it here is normal and safe. It does not reveal your name or exact home address, only your approximate city and your internet provider. Use a VPN if you want to keep it private.",
  },
  {
    q: "Why is my location on the map not exact?",
    a: "IP-based location is approximate. It is based on where your internet provider registers the IP, which is often your city or a nearby one, not your precise street address.",
  },
  {
    q: "How can I change or hide my IP address?",
    a: "You can change your IP by restarting your router (for a dynamic IP), contacting your ISP, or using a VPN or proxy server. A VPN is the easiest way to hide your real IP and appear in another location.",
  },
  {
    q: "What is the difference between IPv4 and IPv6?",
    a: "IPv4 uses a 32-bit format (e.g. 192.0.2.1) with about 4.3 billion addresses. IPv6 uses a 128-bit format (e.g. 2001:db8::1) with a virtually unlimited supply, created to handle the growing number of internet-connected devices.",
  },
];

export default function WhatIsMyIpPage() {
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
          <div className="absolute -right-24 top-32 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
        </div>

        <div className="container relative flex flex-col items-center py-14 text-center md:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 shadow-sm backdrop-blur">
            <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
            IP Address Lookup
          </span>

          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
            What Is My{" "}
            <span className="bg-gradient-to-r from-brand-600 to-cyan-500 bg-clip-text text-transparent">
              IP Address?
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
            Here is your public IP address, your approximate location on the map, and
            details about your internet provider. Free, instant and private.
          </p>

          <div className="mt-10 w-full">
            <IpDetails />
          </div>

          <div className="mt-5 w-full">
            <IpSecurity />
          </div>

          <Link
            href="/#speed-test"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            <Gauge className="h-4 w-4" aria-hidden="true" />
            Test your internet speed
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Info cards */}
      <section className="border-t border-slate-100 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Understanding your IP address
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              Everything you need to know about IP addresses, in plain language.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {INFO_CARDS.map(({ icon: Icon, title, text }) => (
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
      <section className="border-t border-slate-100 bg-slate-50 py-16 md:py-24">
        <div className="container max-w-3xl">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            IP address FAQ
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
