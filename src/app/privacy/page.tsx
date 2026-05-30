import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Privacy Policy | TestSpeedInternet",
  description:
    "How TestSpeedInternet, operated by ZONEPAY LTD, handles your data when you run an internet speed test or use our IP tools.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="May 29, 2026"
      intro={`This Privacy Policy explains how ${COMPANY.brand}, operated by ${COMPANY.legalName}, handles information when you use our website and tools.`}
      sections={[
        {
          heading: "Who we are",
          body: [
            `${COMPANY.brand} ("we", "us") is a free internet speed test and IP information service operated by ${COMPANY.legalName}. You can reach us at ${COMPANY.email}.`,
          ],
        },
        {
          heading: "Information we process",
          body: [
            "When you run a speed test or use our IP tools, we process your public IP address and technical data such as approximate location (city and country), your internet service provider (ISP), connection type and browser information.",
            "We use this data only to display your results and to power features like location, provider and IP reputation. We do not ask for your name, and we do not sell your personal data.",
          ],
        },
        {
          heading: "Third-party services",
          body: [
            "To provide the service we rely on trusted third parties: Cloudflare (speed-test data servers), ip-api.com (IP geolocation), proxycheck.io (IP reputation), Logo.dev (provider logos), flagcdn.com (country flags) and OpenStreetMap (maps). When a feature loads, your IP may be shared with the relevant provider to return a result.",
          ],
        },
        {
          heading: "Advertising (Google AdSense)",
          body: [
            "We may display ads through Google AdSense and other partners. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this and other websites. Google's use of advertising cookies enables it and its partners to serve ads based on your visits.",
            "You can opt out of personalized advertising by visiting Google Ads Settings (adssettings.google.com), and you can manage cookies through your browser. In regions where it is required (such as the EEA and UK), we ask for your consent before non-essential and advertising cookies are used.",
          ],
        },
        {
          heading: "Cookies and analytics",
          body: [
            "We use a small number of cookies for essential functionality, optional analytics (such as Google Analytics) and, where enabled, advertising. Analytics help us understand aggregate, anonymous usage so we can improve the service. You can clear or block cookies in your browser at any time.",
          ],
        },
        {
          heading: "Data retention",
          body: [
            "Speed test measurements run in your browser and are shown to you in real time. We do not build a personal profile from your individual test results or IP address.",
          ],
        },
        {
          heading: "Your rights",
          body: [
            `Depending on where you live, you may have rights to access, correct or delete personal data we hold about you. To make a request, email ${COMPANY.email} and we will respond in line with applicable law.`,
          ],
        },
        {
          heading: "Children's privacy",
          body: [
            "Our service is intended for a general audience and is not directed at children under 13. We do not knowingly collect personal data from children.",
          ],
        },
        {
          heading: "Changes to this policy",
          body: [
            "We may update this Privacy Policy from time to time. Material changes will be reflected by the 'Last updated' date at the top of this page.",
          ],
        },
        {
          heading: "Contact",
          body: [
            `For any privacy question, contact ${COMPANY.legalName} at ${COMPANY.email}.`,
          ],
        },
      ]}
    />
  );
}
