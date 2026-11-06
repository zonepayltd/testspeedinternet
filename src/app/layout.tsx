import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import Script from "next/script";
import SiteShell from "@/components/SiteShell";
import { getSiteConfig } from "@/lib/siteConfig";
import { getLocale } from "@/i18n/server";
import { LOCALE_META, type Locale } from "@/i18n/config";
import { themeInitScript } from "@/components/theme/ThemeToggle";
import { COMPANY } from "@/lib/company";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const arabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-arabic",
  display: "swap",
  preload: false,
});

const SITE_URL = COMPANY.siteUrl;

// Render every public page on demand so config-driven head tags (Google Search
// Console verification, Analytics, AdSense) always reflect the latest values
// saved in the admin panel, with no rebuild required.
export const dynamic = "force-dynamic";

const SITE_META: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Internet Speed Test: Free Download, Upload & Ping Test",
    description:
      "Run a free internet speed test in seconds. Check your download speed, upload speed, ping and latency on any device. Accurate, no-app-needed broadband speed test.",
  },
  fr: {
    title: "Test de vitesse Internet gratuit : débit, upload et ping",
    description:
      "Testez gratuitement votre connexion Internet en quelques secondes : débit descendant, débit montant, ping et latence, sur tous les appareils et sans application.",
  },
  es: {
    title: "Test de velocidad de internet gratis: descarga, subida y ping",
    description:
      "Mide gratis tu velocidad de internet en segundos: descarga, subida, ping y latencia en cualquier dispositivo. Test de velocidad preciso y sin instalar nada.",
  },
  ar: {
    title: "اختبار سرعة الإنترنت مجانًا: التنزيل والرفع والـ Ping",
    description:
      "اختبر سرعة الإنترنت مجانًا خلال ثوانٍ: سرعة التنزيل وسرعة الرفع وزمن الاستجابة على أي جهاز، بدقة ودون الحاجة إلى تطبيق.",
  },
  ru: {
    title: "Тест скорости интернета бесплатно: загрузка, отдача и пинг",
    description:
      "Бесплатно проверьте скорость интернета за несколько секунд: загрузка, отдача, пинг и задержка на любом устройстве. Точный тест без установки приложений.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const [cfg, locale] = await Promise.all([getSiteConfig(), getLocale()]);
  const m = SITE_META[locale];
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: m.title, template: "%s | TestSpeedInternet" },
    description: m.description,
    applicationName: "TestSpeedInternet",
    authors: [{ name: COMPANY.legalName }],
    creator: COMPANY.legalName,
    publisher: COMPANY.legalName,
    category: "technology",
    formatDetection: { telephone: false, email: false, address: false },
    alternates: { types: { "application/rss+xml": `${SITE_URL}/feed.xml` } },
    openGraph: {
      type: "website",
      url: SITE_URL,
      siteName: COMPANY.brand,
      title: m.title,
      description: m.description,
      locale: LOCALE_META[locale].og,
    },
    twitter: { card: "summary_large_image", title: m.title, description: m.description },
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#070b16" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [cfg, locale] = await Promise.all([getSiteConfig(), getLocale()]);
  const meta = LOCALE_META[locale];
  const gaId = cfg.gaMeasurementId;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Test Speed Internet",
        legalName: COMPANY.legalName,
        url: SITE_URL,
        logo: `${SITE_URL}/icon.svg`,
        email: COMPANY.email,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Test Speed Internet",
        description: SITE_META.en.description,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: ["en", "fr", "es", "ar", "ru"],
      },
    ],
  };

  return (
    <html
      lang={meta.htmlLang}
      dir={meta.dir}
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${arabic.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        <SiteShell locale={locale}>{children}</SiteShell>

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
