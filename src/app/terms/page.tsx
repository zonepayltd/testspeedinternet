import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Terms of Service | TestSpeedInternet",
  description:
    "The terms that govern your use of TestSpeedInternet, a free internet speed test operated by ZONEPAY LTD.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="May 29, 2026"
      intro={`These Terms govern your use of ${COMPANY.brand}, operated by ${COMPANY.legalName}. By using the site, you agree to them.`}
      sections={[
        {
          heading: "Acceptance of terms",
          body: [
            `By accessing or using ${COMPANY.brand} (the "service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.`,
          ],
        },
        {
          heading: "Use of the service",
          body: [
            "The service is provided free of charge to help you measure your internet connection and view information about your IP address. You may use it for personal and lawful purposes only.",
          ],
        },
        {
          heading: "Accuracy of results",
          body: [
            "Speed test and IP results are estimates that depend on your device, network, WiFi, third-party servers and conditions at the time of testing. We provide them on a best-effort basis and do not guarantee their accuracy or that they match figures from your internet provider.",
          ],
        },
        {
          heading: "Acceptable use",
          body: [
            "You agree not to misuse the service, including attempting to disrupt it, overload it with automated requests, reverse engineer it, or use it to violate the rights of others or any applicable law.",
          ],
        },
        {
          heading: "Intellectual property",
          body: [
            `The ${COMPANY.brand} name, design, content and software are owned by ${COMPANY.legalName} and protected by applicable laws. Third-party trademarks and logos shown (such as provider logos) belong to their respective owners.`,
          ],
        },
        {
          heading: "Third-party services",
          body: [
            "The service relies on third-party providers (including Cloudflare, ip-api.com, proxycheck.io, Logo.dev, flagcdn.com and OpenStreetMap). We are not responsible for the availability, content or policies of these third parties.",
          ],
        },
        {
          heading: "Disclaimer of warranties",
          body: [
            'The service is provided "as is" and "as available" without warranties of any kind, whether express or implied, including fitness for a particular purpose and uninterrupted availability.',
          ],
        },
        {
          heading: "Limitation of liability",
          body: [
            `To the maximum extent permitted by law, ${COMPANY.legalName} shall not be liable for any indirect, incidental or consequential damages arising from your use of, or inability to use, the service.`,
          ],
        },
        {
          heading: "Changes to these terms",
          body: [
            "We may update these Terms from time to time. Continued use of the service after changes means you accept the updated Terms. The 'Last updated' date reflects the latest version.",
          ],
        },
        {
          heading: "Contact",
          body: [
            `Questions about these Terms can be sent to ${COMPANY.legalName} at ${COMPANY.email}.`,
          ],
        },
      ]}
    />
  );
}
