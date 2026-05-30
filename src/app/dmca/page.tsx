import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "DMCA Policy | TestSpeedInternet",
  description:
    "DMCA / copyright policy for TestSpeedInternet, owned and operated by ZONEPAY LTD. How to submit a takedown notice.",
  alternates: { canonical: "/dmca" },
};

export default function DmcaPage() {
  return (
    <LegalPage
      title="DMCA & Copyright Policy"
      updated="May 29, 2026"
      intro={`${COMPANY.brand} is owned and operated by ${COMPANY.legalName}. We respect intellectual property rights and respond to valid copyright notices.`}
      sections={[
        {
          heading: "Ownership",
          body: [
            `The ${COMPANY.brand} website, its design, code, content and branding are the property of ${COMPANY.legalName} and are protected by copyright and other laws. Third-party trademarks and logos shown on the site belong to their respective owners.`,
          ],
        },
        {
          heading: "Reporting copyright infringement",
          body: [
            `If you believe content on ${COMPANY.brand} infringes your copyright, send a written notice (a "DMCA notice") to ${COMPANY.email} with the subject line "DMCA Takedown".`,
          ],
        },
        {
          heading: "What your notice must include",
          body: [
            "1) Your physical or electronic signature. 2) Identification of the copyrighted work you claim is infringed. 3) The exact URL(s) of the material you want removed. 4) Your name, address, email and phone number. 5) A statement that you have a good-faith belief the use is not authorized. 6) A statement, under penalty of perjury, that the information is accurate and that you are the owner or authorized to act on the owner's behalf.",
          ],
        },
        {
          heading: "Our response",
          body: [
            "Once we receive a valid notice, we will review it and remove or disable access to the allegedly infringing material within a reasonable time, and notify the party who posted it where applicable.",
          ],
        },
        {
          heading: "Counter-notice",
          body: [
            `If you believe your content was removed by mistake or misidentification, you may send a counter-notice to ${COMPANY.email} including your contact details, identification of the removed material and its location, and a statement under penalty of perjury that you have a good-faith belief it was removed in error.`,
          ],
        },
        {
          heading: "Repeat infringers",
          body: [
            `${COMPANY.legalName} may, in appropriate circumstances, restrict or remove content and access for parties who repeatedly infringe copyright.`,
          ],
        },
        {
          heading: "Contact",
          body: [`Copyright matters: ${COMPANY.legalName} — ${COMPANY.email}.`],
        },
      ]}
    />
  );
}
