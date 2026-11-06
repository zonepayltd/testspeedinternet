import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description:
    "How the TestSpeedInternet editorial team researches, writes, fact-checks and updates its internet speed, WiFi and networking guides.",
  alternates: { canonical: "/editorial-policy" },
};

export default function EditorialPolicyPage() {
  return (
    <LegalPage
      badge="Our standards"
      title="Editorial Policy"
      updated="November 6, 2026"
      intro={`Our guides help people understand and improve their internet connection. This page explains how the ${COMPANY.brand} editorial team creates, checks and maintains that content.`}
      sections={[
        {
          heading: "Who writes our content",
          body: [
            `Articles on ${COMPANY.brand} are produced by our in-house editorial team at ${COMPANY.legalName}. The team focuses on home networking, broadband, WiFi and online performance, and writes for everyday users rather than network engineers.`,
          ],
        },
        {
          heading: "How we research",
          body: [
            "We base our guides on official documentation and standards: internet provider and streaming service help pages, Wi-Fi Alliance and IEEE specifications, regulator guidance (such as the FCC and Ofcom), and router and operating system manuals.",
            "Where an article gives figures, such as the speed a streaming service recommends or a typical ping range, we use conservative, widely documented numbers and describe them as typical rather than guaranteed. Real-world results depend on your provider, equipment and home.",
          ],
        },
        {
          heading: "Accuracy and fact-checking",
          body: [
            "Before an article is published, it is reviewed for technical accuracy, clarity and completeness. Steps such as Windows or macOS settings are checked against the current versions of those systems.",
            "We do not publish invented statistics, fake reviews or made-up quotes.",
          ],
        },
        {
          heading: "Updates and corrections",
          body: [
            "Technology changes quickly. We review our guides regularly and update them when standards, service requirements or best practices change. When an article is meaningfully updated, its \"Updated\" date changes.",
            `If you spot an error, please tell us through our contact page or at ${COMPANY.email}. We review every correction request and fix confirmed mistakes promptly.`,
          ],
        },
        {
          heading: "Independence and advertising",
          body: [
            "Our content is editorially independent. Advertisers do not review, approve or influence our articles, and we do not accept payment to change our recommendations.",
            "The site is funded by advertising, including Google AdSense. Ads are always clearly separated from editorial content and labeled where required. Sponsored links, if any, are marked as sponsored.",
          ],
        },
        {
          heading: "Our tools",
          body: [
            "Our speed test, IP lookup and IP risk tools are built and maintained by the same team. The How It Works page explains how the speed test measures download, upload, ping and jitter so you can understand and trust your results.",
          ],
        },
      ]}
    />
  );
}
