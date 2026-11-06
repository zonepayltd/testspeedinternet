import type { Locale } from "../config";

// Small site-chrome strings not covered by common.ts: app badges, Trustpilot, custom ads.
const en = {
  apps: {
    heading: "Download our apps",
    googlePlayTop: "Get it on",
    appleTop: "Download on the",
    amazonTop: "Available at",
    apkTop: "Direct",
    apkLabel: "Download APK",
    comingSoon: "Coming soon",
  },
  trustpilot: "Reviews on Trustpilot",
  adShort: "Ad",
};

export type ChromeMessages = typeof en;

const fr: ChromeMessages = {
  apps: {
    heading: "Téléchargez nos applications",
    googlePlayTop: "Disponible sur",
    appleTop: "Télécharger dans l'",
    amazonTop: "Disponible sur",
    apkTop: "Direct",
    apkLabel: "Télécharger l'APK",
    comingSoon: "Bientôt disponible",
  },
  trustpilot: "Avis sur Trustpilot",
  adShort: "Pub",
};

const es: ChromeMessages = {
  apps: {
    heading: "Descarga nuestras apps",
    googlePlayTop: "Disponible en",
    appleTop: "Descárgalo en el",
    amazonTop: "Disponible en",
    apkTop: "Directo",
    apkLabel: "Descargar APK",
    comingSoon: "Próximamente",
  },
  trustpilot: "Opiniones en Trustpilot",
  adShort: "Anuncio",
};

const ar: ChromeMessages = {
  apps: {
    heading: "حمّل تطبيقاتنا",
    googlePlayTop: "احصل عليه من",
    appleTop: "حمّله من",
    amazonTop: "متوفر على",
    apkTop: "تنزيل مباشر",
    apkLabel: "تنزيل APK",
    comingSoon: "قريبًا",
  },
  trustpilot: "تقييماتنا على Trustpilot",
  adShort: "إعلان",
};

const ru: ChromeMessages = {
  apps: {
    heading: "Скачайте наши приложения",
    googlePlayTop: "Доступно в",
    appleTop: "Загрузите в",
    amazonTop: "Доступно в",
    apkTop: "Напрямую",
    apkLabel: "Скачать APK",
    comingSoon: "Скоро",
  },
  trustpilot: "Отзывы на Trustpilot",
  adShort: "Реклама",
};

export const chromeMessages: Record<Locale, ChromeMessages> = { en, fr, es, ar, ru };
