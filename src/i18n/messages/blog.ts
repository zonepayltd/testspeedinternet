import type { Locale } from "../config";

// Blog index + article page UI text. Article content itself lives in src/content/blog/<locale>/.
const en = {
  meta: {
    title: "Blog: Internet Speed & WiFi Guides",
    description:
      "Practical guides on internet speed, WiFi, ping, streaming and fixing slow connections. Clear, tested advice from the TestSpeedInternet editorial team.",
  },
  index: {
    eyebrow: "Blog & Guides",
    titleStart: "Internet speed",
    titleHighlight: "tips & guides",
    lead: "Clear, practical advice to test, understand and speed up your internet connection and home WiFi.",
    all: "All articles",
    categoriesLabel: "Categories",
    featured: "Featured",
    latest: "Latest articles",
    readArticle: "Read article",
    empty: "No articles in this category yet. Check back soon.",
    emptyCta: "Test your speed",
    viewAll: "View all articles",
  },
  post: {
    notFound: "Article not found",
    editorialTeam: "TestSpeedInternet Editorial Team",
    published: "Published",
    updated: "Updated",
    inThisArticle: "In this article",
    tocLabel: "Table of contents",
    faqHeading: "Frequently asked questions",
    tagsLabel: "Tags",
    authorBioStart:
      "We write practical, plain-English guides on internet speed, WiFi and home networking, and check every article for accuracy. Read our",
    authorBioPolicy: "editorial policy",
    authorBioOr: "or",
    authorBioCorrection: "send us a correction",
    ctaTitle: "Check your own connection",
    ctaText: "Measure your download, upload, ping and jitter in about 30 seconds. Free, no app needed.",
    ctaButton: "Run a speed test",
    sideTitle: "Free speed test",
    sideText: "See your real download, upload and ping now.",
    sideCta: "Start test",
    keepReading: "Keep reading",
    allArticles: "All articles",
  },
  categories: {
    "Speed Testing": "Speed Testing",
    "WiFi & Routers": "WiFi & Routers",
    "Gaming & Latency": "Gaming & Latency",
    Streaming: "Streaming",
    "Connection Types": "Connection Types",
    Troubleshooting: "Troubleshooting",
    "Privacy & Security": "Privacy & Security",
    "Remote Work": "Remote Work",
  } as Record<string, string>,
  minRead: "{n} min read",
  ogFallbackTitle: "Internet speed tips & guides",
};

export type BlogMessages = typeof en;

const fr: BlogMessages = {
  meta: {
    title: "Blog : guides débit Internet et WiFi",
    description:
      "Guides pratiques sur le débit Internet, le WiFi, le ping, le streaming et les connexions lentes. Des conseils clairs et testés par l'équipe TestSpeedInternet.",
  },
  index: {
    eyebrow: "Blog et guides",
    titleStart: "Débit Internet :",
    titleHighlight: "conseils et guides",
    lead: "Des conseils clairs et concrets pour tester, comprendre et accélérer votre connexion Internet et votre WiFi.",
    all: "Tous les articles",
    categoriesLabel: "Catégories",
    featured: "À la une",
    latest: "Derniers articles",
    readArticle: "Lire l'article",
    empty: "Aucun article dans cette catégorie pour le moment. Revenez bientôt.",
    emptyCta: "Tester mon débit",
    viewAll: "Voir tous les articles",
  },
  post: {
    notFound: "Article introuvable",
    editorialTeam: "La rédaction TestSpeedInternet",
    published: "Publié le",
    updated: "Mis à jour le",
    inThisArticle: "Dans cet article",
    tocLabel: "Sommaire",
    faqHeading: "Questions fréquentes",
    tagsLabel: "Mots-clés",
    authorBioStart:
      "Nous rédigeons des guides pratiques et accessibles sur le débit Internet, le WiFi et les réseaux domestiques, et vérifions chaque article. Consultez notre",
    authorBioPolicy: "politique éditoriale",
    authorBioOr: "ou",
    authorBioCorrection: "signalez-nous une erreur",
    ctaTitle: "Testez votre propre connexion",
    ctaText: "Mesurez votre débit descendant, montant, votre ping et votre gigue en 30 secondes environ. Gratuit, sans application.",
    ctaButton: "Lancer un test de débit",
    sideTitle: "Test de débit gratuit",
    sideText: "Découvrez dès maintenant vos vrais débits et votre ping.",
    sideCta: "Lancer le test",
    keepReading: "À lire aussi",
    allArticles: "Tous les articles",
  },
  categories: {
    "Speed Testing": "Tests de débit",
    "WiFi & Routers": "WiFi et routeurs",
    "Gaming & Latency": "Jeu vidéo et latence",
    Streaming: "Streaming",
    "Connection Types": "Types de connexion",
    Troubleshooting: "Dépannage",
    "Privacy & Security": "Confidentialité et sécurité",
    "Remote Work": "Télétravail",
  },
  minRead: "{n} min de lecture",
  ogFallbackTitle: "Débit Internet : conseils et guides",
};

const es: BlogMessages = {
  meta: {
    title: "Blog: guías de velocidad de internet y WiFi",
    description:
      "Guías prácticas sobre velocidad de internet, WiFi, ping, streaming y cómo arreglar una conexión lenta. Consejos claros y probados del equipo de TestSpeedInternet.",
  },
  index: {
    eyebrow: "Blog y guías",
    titleStart: "Velocidad de internet:",
    titleHighlight: "consejos y guías",
    lead: "Consejos claros y prácticos para medir, entender y acelerar tu conexión a internet y tu WiFi de casa.",
    all: "Todos los artículos",
    categoriesLabel: "Categorías",
    featured: "Destacado",
    latest: "Últimos artículos",
    readArticle: "Leer artículo",
    empty: "Todavía no hay artículos en esta categoría. Vuelve pronto.",
    emptyCta: "Medir mi velocidad",
    viewAll: "Ver todos los artículos",
  },
  post: {
    notFound: "Artículo no encontrado",
    editorialTeam: "Equipo editorial de TestSpeedInternet",
    published: "Publicado",
    updated: "Actualizado",
    inThisArticle: "En este artículo",
    tocLabel: "Índice",
    faqHeading: "Preguntas frecuentes",
    tagsLabel: "Etiquetas",
    authorBioStart:
      "Escribimos guías prácticas y fáciles de entender sobre velocidad de internet, WiFi y redes domésticas, y revisamos cada artículo. Consulta nuestra",
    authorBioPolicy: "política editorial",
    authorBioOr: "o",
    authorBioCorrection: "envíanos una corrección",
    ctaTitle: "Comprueba tu propia conexión",
    ctaText: "Mide tu descarga, subida, ping y jitter en unos 30 segundos. Gratis y sin instalar nada.",
    ctaButton: "Hacer un test de velocidad",
    sideTitle: "Test de velocidad gratis",
    sideText: "Descubre ahora tu velocidad real de descarga, subida y ping.",
    sideCta: "Iniciar test",
    keepReading: "Sigue leyendo",
    allArticles: "Todos los artículos",
  },
  categories: {
    "Speed Testing": "Tests de velocidad",
    "WiFi & Routers": "WiFi y routers",
    "Gaming & Latency": "Gaming y latencia",
    Streaming: "Streaming",
    "Connection Types": "Tipos de conexión",
    Troubleshooting: "Solución de problemas",
    "Privacy & Security": "Privacidad y seguridad",
    "Remote Work": "Teletrabajo",
  },
  minRead: "{n} min de lectura",
  ogFallbackTitle: "Velocidad de internet: consejos y guías",
};

const ar: BlogMessages = {
  meta: {
    title: "المدونة: أدلة سرعة الإنترنت والواي فاي",
    description:
      "أدلة عملية حول سرعة الإنترنت والواي فاي وزمن الاستجابة والبث وحل مشكلات بطء الاتصال. نصائح واضحة ومجرَّبة من فريق تحرير TestSpeedInternet.",
  },
  index: {
    eyebrow: "المدونة والأدلة",
    titleStart: "سرعة الإنترنت:",
    titleHighlight: "نصائح وأدلة",
    lead: "نصائح واضحة وعملية لاختبار اتصالك بالإنترنت وشبكة الواي فاي المنزلية وفهمهما وتسريعهما.",
    all: "كل المقالات",
    categoriesLabel: "التصنيفات",
    featured: "مقال مميز",
    latest: "أحدث المقالات",
    readArticle: "اقرأ المقال",
    empty: "لا توجد مقالات في هذا التصنيف حتى الآن. عُد قريبًا.",
    emptyCta: "اختبر سرعتك",
    viewAll: "عرض كل المقالات",
  },
  post: {
    notFound: "المقال غير موجود",
    editorialTeam: "فريق تحرير TestSpeedInternet",
    published: "نُشر في",
    updated: "حُدّث في",
    inThisArticle: "في هذا المقال",
    tocLabel: "جدول المحتويات",
    faqHeading: "الأسئلة الشائعة",
    tagsLabel: "الوسوم",
    authorBioStart:
      "نكتب أدلة عملية وسهلة الفهم حول سرعة الإنترنت والواي فاي والشبكات المنزلية، ونراجع دقة كل مقال. اطّلع على",
    authorBioPolicy: "سياستنا التحريرية",
    authorBioOr: "أو",
    authorBioCorrection: "أرسل إلينا تصحيحًا",
    ctaTitle: "اختبر اتصالك بنفسك",
    ctaText: "قِس سرعة التنزيل والرفع وزمن الاستجابة والتذبذب في نحو 30 ثانية. مجانًا ودون أي تطبيق.",
    ctaButton: "ابدأ اختبار السرعة",
    sideTitle: "اختبار سرعة مجاني",
    sideText: "اعرف الآن سرعة التنزيل والرفع الحقيقية وزمن الاستجابة.",
    sideCta: "ابدأ الاختبار",
    keepReading: "تابع القراءة",
    allArticles: "كل المقالات",
  },
  categories: {
    "Speed Testing": "اختبار السرعة",
    "WiFi & Routers": "الواي فاي والراوترات",
    "Gaming & Latency": "الألعاب وزمن الاستجابة",
    Streaming: "البث",
    "Connection Types": "أنواع الاتصال",
    Troubleshooting: "حل المشكلات",
    "Privacy & Security": "الخصوصية والأمان",
    "Remote Work": "العمل عن بُعد",
  },
  minRead: "{n} دقائق قراءة",
  ogFallbackTitle: "سرعة الإنترنت: نصائح وأدلة",
};

const ru: BlogMessages = {
  meta: {
    title: "Блог: скорость интернета и Wi-Fi",
    description:
      "Практические руководства о скорости интернета, Wi-Fi, пинге, стриминге и устранении медленного соединения. Понятные и проверенные советы от редакции TestSpeedInternet.",
  },
  index: {
    eyebrow: "Блог и руководства",
    titleStart: "Скорость интернета:",
    titleHighlight: "советы и руководства",
    lead: "Понятные практические советы, которые помогут проверить, понять и ускорить ваш интернет и домашний Wi-Fi.",
    all: "Все статьи",
    categoriesLabel: "Рубрики",
    featured: "Главное",
    latest: "Новые статьи",
    readArticle: "Читать статью",
    empty: "В этой рубрике пока нет статей. Загляните позже.",
    emptyCta: "Проверить скорость",
    viewAll: "Все статьи",
  },
  post: {
    notFound: "Статья не найдена",
    editorialTeam: "Редакция TestSpeedInternet",
    published: "Опубликовано",
    updated: "Обновлено",
    inThisArticle: "В этой статье",
    tocLabel: "Содержание",
    faqHeading: "Частые вопросы",
    tagsLabel: "Теги",
    authorBioStart:
      "Мы пишем практичные и понятные руководства о скорости интернета, Wi-Fi и домашних сетях и проверяем точность каждой статьи. Прочитайте нашу",
    authorBioPolicy: "редакционную политику",
    authorBioOr: "или",
    authorBioCorrection: "сообщите нам об ошибке",
    ctaTitle: "Проверьте своё подключение",
    ctaText: "Измерьте скорость загрузки и отдачи, пинг и джиттер примерно за 30 секунд. Бесплатно и без приложений.",
    ctaButton: "Запустить тест скорости",
    sideTitle: "Бесплатный тест скорости",
    sideText: "Узнайте реальную скорость загрузки, отдачи и пинг прямо сейчас.",
    sideCta: "Начать тест",
    keepReading: "Читайте также",
    allArticles: "Все статьи",
  },
  categories: {
    "Speed Testing": "Тесты скорости",
    "WiFi & Routers": "Wi-Fi и роутеры",
    "Gaming & Latency": "Игры и задержка",
    Streaming: "Стриминг",
    "Connection Types": "Типы подключения",
    Troubleshooting: "Решение проблем",
    "Privacy & Security": "Конфиденциальность и безопасность",
    "Remote Work": "Удалённая работа",
  },
  minRead: "{n} мин чтения",
  ogFallbackTitle: "Скорость интернета: советы и руководства",
};

export const blogMessages: Record<Locale, BlogMessages> = { en, fr, es, ar, ru };

/** Translated label for a post category (stored as the English key); falls back to the raw value. */
export function categoryLabel(category: string, locale: Locale): string {
  return blogMessages[locale]?.categories[category] || category;
}

/** "5 min read" in the right language (with Arabic plural forms). */
export function readingTime(n: number, locale: Locale): string {
  if (locale === "ar") {
    if (n === 1) return "دقيقة قراءة واحدة";
    if (n === 2) return "دقيقتان للقراءة";
    if (n <= 10) return `${n} دقائق قراءة`;
    return `${n} دقيقة قراءة`;
  }
  return (blogMessages[locale] ?? blogMessages.en).minRead.replace("{n}", String(n));
}

/** Long localized date, always with Latin digits (also for Arabic). */
export function formatPostDate(ms: number, locale: Locale): string {
  if (!ms) return "";
  try {
    return new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", day: "numeric", numberingSystem: "latn" }).format(
      new Date(ms),
    );
  } catch {
    return new Date(ms).toISOString().slice(0, 10);
  }
}
