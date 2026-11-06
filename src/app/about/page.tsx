import type { Metadata } from "next";
import Link from "next/link";
import { Gauge, Target, ShieldCheck, Building2, ChevronRight } from "lucide-react";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "About Us: Who Runs This Speed Test",
  description:
    "Learn about TestSpeedInternet, a free internet speed test operated by ZONEPAY LTD. Our mission is to give everyone a fast, accurate and private way to check their connection.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  {
    icon: Target,
    title: "Accurate by design",
    text: "We measure against a global server network with parallel connections, so your results reflect your real-world speed.",
  },
  {
    icon: ShieldCheck,
    title: "Private & free",
    text: "No signup, no app and no selling of personal data. Run as many tests as you like, on any device.",
  },
  {
    icon: Gauge,
    title: "Simple for everyone",
    text: "One tap to test your download, upload, ping and jitter, with results anyone can understand.",
  },
];

export default function AboutPage() {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY.brand,
    url: COMPANY.siteUrl,
    email: COMPANY.email,
    parentOrganization: {
      "@type": "Organization",
      name: COMPANY.legalName,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/80 via-white to-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(37,99,235,0.12),transparent)]" />
        <div className="container relative flex flex-col items-center py-14 text-center md:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 shadow-sm backdrop-blur">
            <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
            About Us
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
            The team behind{" "}
            <span className="bg-gradient-to-r from-brand-600 to-cyan-500 bg-clip-text text-transparent">
              TestSpeedInternet
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
            TestSpeedInternet is a free internet speed test tool operated by{" "}
            <strong className="font-semibold text-slate-700">{COMPANY.legalName}</strong>. Our
            mission is to give everyone a fast, accurate and private way to measure their
            internet connection.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Our mission</h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Millions of people pay for internet every month without an easy way to know if they
            are getting what they pay for. We built TestSpeedInternet to change that: a clean,
            modern speed test that measures your download speed, upload speed, ping and jitter in
            seconds, then explains what the numbers mean.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Beyond speed, we also help you understand your connection with tools like our{" "}
            <Link href="/what-is-my-ip" className="font-semibold text-brand-600 hover:text-brand-700">What Is My IP</Link>{" "}
            page and our{" "}
            <Link href="/ip-risk-score" className="font-semibold text-brand-600 hover:text-brand-700">IP Risk Score</Link>{" "}
            checker.
          </p>
          <h2 className="mt-12 text-2xl font-extrabold tracking-tight text-slate-900">Guides you can trust</h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Our editorial team publishes practical guides on WiFi, ping, streaming, home networking and fixing
            slow internet on the{" "}
            <Link href="/blog" className="font-semibold text-brand-600 hover:text-brand-700">TestSpeedInternet blog</Link>.
            Every article is researched from official documentation and standards, checked for accuracy and
            updated when things change. Our{" "}
            <Link href="/editorial-policy" className="font-semibold text-brand-600 hover:text-brand-700">editorial policy</Link>{" "}
            explains how we work, and that advertisers never influence what we write.
          </p>
          <h2 className="mt-12 text-2xl font-extrabold tracking-tight text-slate-900">How we keep the test accurate</h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            The speed test runs in your browser and measures real transfers over several parallel connections, then
            reports download, upload, ping and jitter. Read{" "}
            <Link href="/how-it-works" className="font-semibold text-brand-600 hover:text-brand-700">how it works</Link>{" "}
            for the details, or our guide to{" "}
            <Link href="/blog/how-to-test-internet-speed-accurately" className="font-semibold text-brand-600 hover:text-brand-700">
              testing your speed accurately
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-slate-100 bg-slate-50 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">What we stand for</h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/25">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company */}
      <section className="py-16 md:py-24">
        <div className="container max-w-3xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <Building2 className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Operated by {COMPANY.legalName}</h2>
                <p className="text-sm text-slate-500">The company behind TestSpeedInternet</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-slate-600">
              TestSpeedInternet is owned and operated by {COMPANY.legalName}. For partnerships,
              press or general enquiries, get in touch through our{" "}
              <Link href="/contact" className="font-semibold text-brand-600 hover:text-brand-700">contact page</Link>{" "}
              or email{" "}
              <a href={`mailto:${COMPANY.email}`} className="font-semibold text-brand-600 hover:text-brand-700">{COMPANY.email}</a>.
            </p>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-transform hover:scale-105"
            >
              <Gauge className="h-5 w-5" aria-hidden="true" />
              Test your speed
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
