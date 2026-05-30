import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import SiteShell from "@/components/SiteShell";
import { getSiteConfig } from "@/lib/siteConfig";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = "https://testspeedinternet.com";

export async function generateMetadata(): Promise<Metadata> {
  const cfg = await getSiteConfig();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "Test Speed Internet | Free Internet Speed Test (Download, Upload & Ping)",
      template: "%s | TestSpeedInternet",
    },
    description:
      "Run a free internet speed test in seconds. Check your download speed, upload speed, ping and latency on any device. Accurate, no-app-needed broadband speed test.",
    keywords: [
      "internet speed test",
      "test speed internet",
      "speed test",
      "test my internet speed",
      "broadband speed test",
      "download speed test",
      "upload speed test",
      "ping test",
      "wifi speed test",
    ],
    applicationName: "TestSpeedInternet",
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: SITE_URL,
      siteName: "TestSpeedInternet",
      title: "Test Speed Internet | Free Internet Speed Test",
      description:
        "Run a free internet speed test in seconds. Check download, upload, ping and latency on any device.",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: "Test Speed Internet | Free Internet Speed Test",
      description:
        "Run a free internet speed test in seconds. Check download, upload, ping and latency on any device.",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    verification: {
      google: cfg.googleVerification || undefined,
      other: cfg.bingVerification ? { "msvalidate.01": cfg.bingVerification } : {},
    },
    other: cfg.adsenseClient ? { "google-adsense-account": cfg.adsenseClient } : {},
  };
}

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cfg = await getSiteConfig();
  const gaId = cfg.gaMeasurementId;

  return (
    <html lang="en" data-scroll-behavior="smooth" className={inter.variable}>
      <body className="flex min-h-screen flex-col bg-white text-slate-900 antialiased">
        <SiteShell>{children}</SiteShell>

        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}

        {cfg.adsenseClient && (
          <>
            {!cfg.adsPersonalized && (
              <Script id="adsense-npa" strategy="beforeInteractive">
                {`window.adsbygoogle=window.adsbygoogle||[];window.adsbygoogle.requestNonPersonalizedAds=1;`}
              </Script>
            )}
            <Script
              id="adsbygoogle-js"
              strategy="afterInteractive"
              crossOrigin="anonymous"
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${cfg.adsenseClient}`}
            />
          </>
        )}
      </body>
    </html>
  );
}
