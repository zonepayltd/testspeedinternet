import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Which cookies and similar technologies TestSpeedInternet uses, including Google AdSense and Analytics, and how you can control them.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      updated="November 6, 2026"
      intro={`This Cookie Policy explains how ${COMPANY.brand}, operated by ${COMPANY.legalName}, uses cookies and similar technologies, and the choices you have.`}
      sections={[
        {
          heading: "What cookies are",
          body: [
            "Cookies are small text files stored on your device by your browser. Similar technologies include local storage and pixels. They let a website remember information such as your preferences, and help measure and fund the service.",
          ],
        },
        {
          heading: "Essential storage",
          body: [
            "We store a small number of values in your browser that the site needs to work, for example your cookie consent choice and an anonymous visitor ID used to count visits and prevent abuse. These do not identify you personally.",
          ],
        },
        {
          heading: "Analytics",
          body: [
            "If enabled, we use Google Analytics to understand, in aggregate, how visitors use the site (for example which pages are popular). Google Analytics sets cookies such as _ga. You can opt out with the Google Analytics opt-out browser add-on.",
          ],
        },
        {
          heading: "Advertising cookies (Google AdSense)",
          body: [
            "We show ads through Google AdSense. Google and its partners use cookies to serve ads based on your prior visits to this and other websites, to limit how often you see an ad and to measure ad performance.",
            "You can opt out of personalized advertising at Google's Ads Settings (adssettings.google.com) or at www.aboutads.info. To learn more, see \"How Google uses information from sites or apps that use our services\" at policies.google.com/technologies/partner-sites.",
            "In the European Economic Area, the UK and Switzerland, we ask for your consent before personalized advertising cookies are used. If you decline, Google may still serve non-personalized ads, which use cookies only for purposes such as frequency capping and fraud prevention.",
          ],
        },
        {
          heading: "Managing cookies",
          body: [
            "You can change or withdraw your choice at any time by clearing this site's data in your browser, which shows the consent banner again. Most browsers also let you block or delete cookies in their settings. Blocking some cookies may affect how the site works.",
          ],
        },
        {
          heading: "Contact",
          body: [`Questions about this policy? Contact us at ${COMPANY.email}.`],
        },
      ]}
    />
  );
}
