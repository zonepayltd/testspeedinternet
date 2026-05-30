import Link from "next/link";
import { Gauge, Mail } from "lucide-react";
import AppDownloads from "@/components/AppDownloads";
import SocialLinks from "@/components/SocialLinks";
import Trustpilot from "@/components/Trustpilot";

const FOOTER_SECTIONS = [
  {
    title: "Speed Tests",
    links: [
      { href: "/", label: "Internet Speed Test" },
      { href: "/tools/download-speed-test", label: "Download Speed Test" },
      { href: "/tools/upload-speed-test", label: "Upload Speed Test" },
      { href: "/tools/ping-test", label: "Ping & Latency Test" },
      { href: "/tools/wifi-speed-test", label: "WiFi Speed Test" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/what-is-my-ip", label: "What Is My IP" },
      { href: "/ip-risk-score", label: "IP Risk Score" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/blog", label: "Blog" },
      { href: "/faq", label: "FAQ" },
      { href: "/guides/good-internet-speed", label: "What Is a Good Speed?" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/dmca", label: "DMCA" },
    ],
  },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-600">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5" aria-label="TestSpeedInternet home">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-600/20">
                <Gauge className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                Test Speed <span className="text-brand-600">Internet</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
              The fastest way to test your internet speed. Measure your download
              speed, upload speed, ping and latency for free. No app, no signup,
              on any device.
            </p>

            <SocialLinks />

            <div className="mt-4">
              <Trustpilot />
            </div>

            <a
              href="mailto:hello@testspeedinternet.com"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-brand-600"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              hello@testspeedinternet.com
            </a>
          </div>

          {/* Link columns */}
          {FOOTER_SECTIONS.map((section) => (
            <nav key={section.title} aria-label={section.title}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                {section.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 transition-colors hover:text-brand-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* App downloads */}
        <div className="mt-12 border-t border-slate-200 pt-8">
          <AppDownloads />
        </div>

        {/* SEO blurb */}
        <div className="mt-10 border-t border-slate-200 pt-8">
          <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-slate-400">
            TestSpeedInternet is a free internet speed test tool that measures your
            broadband connection&apos;s download speed, upload speed and ping in real
            time. Whether you&apos;re on WiFi, fiber, 5G or cable, run a quick speed
            test to check if you&apos;re getting the bandwidth you pay for from your
            internet service provider (ISP).
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200 bg-white">
        <div className="container flex flex-col items-center justify-between gap-3 py-5 text-xs text-slate-500 sm:flex-row">
          <p>© {year} TestSpeedInternet. Operated by ZONEPAY LTD. All rights reserved.</p>
          <ul className="flex items-center gap-5">
            <li>
              <Link href="/privacy" className="hover:text-brand-600">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-brand-600">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/sitemap.xml" className="hover:text-brand-600">
                Sitemap
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
