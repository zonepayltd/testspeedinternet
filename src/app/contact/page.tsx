import type { Metadata } from "next";
import { Mail, LifeBuoy, Building2, MessageSquare, ChevronRight } from "lucide-react";
import { COMPANY } from "@/lib/company";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with TestSpeedInternet, operated by ZONEPAY LTD. Contact us for support, feedback, partnerships or press enquiries.",
  alternates: { canonical: "/contact" },
};

const CHANNELS = [
  {
    icon: Mail,
    title: "General enquiries",
    text: "Questions, feedback or partnership ideas — we read every message.",
    action: COMPANY.email,
    href: `mailto:${COMPANY.email}`,
  },
  {
    icon: LifeBuoy,
    title: "Support",
    text: "Having trouble with the speed test or a tool? Let us know.",
    action: COMPANY.email,
    href: `mailto:${COMPANY.email}`,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/80 via-white to-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(37,99,235,0.12),transparent)]" />
        <div className="container relative flex flex-col items-center py-14 text-center md:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 shadow-sm backdrop-blur">
            <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
            Contact
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
            Get in{" "}
            <span className="bg-gradient-to-r from-brand-600 to-cyan-500 bg-clip-text text-transparent">touch</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
            We&apos;d love to hear from you. Reach out and we&apos;ll get back to you as soon as we can.
          </p>
        </div>
      </section>

      {/* Form + info */}
      <section className="pb-16 md:pb-24">
        <div className="container grid max-w-5xl items-start gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Form */}
          <ContactForm />

          {/* Sidebar */}
          <div className="space-y-4">
            {CHANNELS.map(({ icon: Icon, title, text, action, href }) => (
              <a
                key={title}
                href={href}
                className="group block rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-600/5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-600/25">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="mt-3 text-base font-bold text-slate-900">{title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{text}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                  {action}
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </p>
              </a>
            ))}

            {/* Company */}
            <div className="flex items-start gap-3 rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-600 ring-1 ring-slate-200">
                <Building2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900">{COMPANY.legalName}</h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  TestSpeedInternet is operated by {COMPANY.legalName}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
