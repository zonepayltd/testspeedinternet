import type { Locale } from "../config";

// 404 and error boundary pages.
const en = {
  notFound: {
    metaTitle: "Page not found (404)",
    code: "Error 404",
    title: "This page took a wrong turn",
    text: "The page you're looking for doesn't exist or has been moved. Let's get you back on track.",
    home: "Back to home",
    contact: "Report a broken link",
    popular: "Popular pages",
    links: {
      speedTest: { title: "Speed test", text: "Test download, upload and ping" },
      myIp: { title: "What is my IP", text: "See your public IP address" },
      ipRisk: { title: "IP risk score", text: "Check an IP's reputation" },
      blog: { title: "Blog", text: "Guides on WiFi and internet speed" },
      faq: { title: "FAQ", text: "Answers to common questions" },
      contact: { title: "Contact", text: "Get in touch with our team" },
    },
  },
  error: {
    code: "Unexpected error",
    title: "Something went wrong",
    text: "An unexpected error occurred while loading this page. Please try again. If the problem continues, let us know.",
    retry: "Try again",
    home: "Back to home",
    contact: "Contact support",
    reference: "Error reference",
  },
};

export type ErrorMessages = typeof en;

const fr: ErrorMessages = {
  notFound: {
    metaTitle: "Page introuvable (404)",
    code: "Erreur 404",
    title: "Cette page s'est égarée",
    text: "La page que vous recherchez n'existe pas ou a été déplacée. Voici de quoi reprendre le bon chemin.",
    home: "Retour à l'accueil",
    contact: "Signaler un lien cassé",
    popular: "Pages populaires",
    links: {
      speedTest: { title: "Test de vitesse", text: "Mesurez le débit descendant, montant et le ping" },
      myIp: { title: "Quelle est mon IP", text: "Affichez votre adresse IP publique" },
      ipRisk: { title: "Score de risque IP", text: "Vérifiez la réputation d'une IP" },
      blog: { title: "Blog", text: "Guides sur le WiFi et le débit Internet" },
      faq: { title: "FAQ", text: "Réponses aux questions fréquentes" },
      contact: { title: "Contact", text: "Écrivez à notre équipe" },
    },
  },
  error: {
    code: "Erreur inattendue",
    title: "Un problème est survenu",
    text: "Une erreur inattendue s'est produite lors du chargement de cette page. Veuillez réessayer. Si le problème persiste, prévenez-nous.",
    retry: "Réessayer",
    home: "Retour à l'accueil",
    contact: "Contacter le support",
    reference: "Référence de l'erreur",
  },
};

const es: ErrorMessages = {
  notFound: {
    metaTitle: "Página no encontrada (404)",
    code: "Error 404",
    title: "Esta página tomó un camino equivocado",
    text: "La página que buscas no existe o se ha movido. Te ayudamos a volver al buen camino.",
    home: "Volver al inicio",
    contact: "Informar de un enlace roto",
    popular: "Páginas populares",
    links: {
      speedTest: { title: "Test de velocidad", text: "Mide la descarga, la subida y el ping" },
      myIp: { title: "Cuál es mi IP", text: "Consulta tu dirección IP pública" },
      ipRisk: { title: "Puntuación de riesgo IP", text: "Comprueba la reputación de una IP" },
      blog: { title: "Blog", text: "Guías sobre WiFi y velocidad de internet" },
      faq: { title: "Preguntas frecuentes", text: "Respuestas a las dudas más comunes" },
      contact: { title: "Contacto", text: "Escribe a nuestro equipo" },
    },
  },
  error: {
    code: "Error inesperado",
    title: "Algo salió mal",
    text: "Se produjo un error inesperado al cargar esta página. Inténtalo de nuevo. Si el problema continúa, avísanos.",
    retry: "Intentar de nuevo",
    home: "Volver al inicio",
    contact: "Contactar con soporte",
    reference: "Referencia del error",
  },
};

const ar: ErrorMessages = {
  notFound: {
    metaTitle: "الصفحة غير موجودة (404)",
    code: "خطأ 404",
    title: "يبدو أن هذه الصفحة ضلّت طريقها",
    text: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها. دعنا نساعدك على العودة إلى المسار الصحيح.",
    home: "العودة إلى الرئيسية",
    contact: "الإبلاغ عن رابط معطّل",
    popular: "صفحات شائعة",
    links: {
      speedTest: { title: "اختبار السرعة", text: "اختبر سرعة التنزيل والرفع والـ Ping" },
      myIp: { title: "ما هو عنوان IP الخاص بي", text: "اعرف عنوان IP العام الخاص بك" },
      ipRisk: { title: "درجة مخاطر IP", text: "تحقّق من سمعة عنوان IP" },
      blog: { title: "المدونة", text: "أدلة حول الواي فاي وسرعة الإنترنت" },
      faq: { title: "الأسئلة الشائعة", text: "إجابات عن الأسئلة المتكررة" },
      contact: { title: "اتصل بنا", text: "تواصل مع فريقنا" },
    },
  },
  error: {
    code: "خطأ غير متوقع",
    title: "حدث خطأ ما",
    text: "حدث خطأ غير متوقع أثناء تحميل هذه الصفحة. يُرجى المحاولة مرة أخرى، وإذا استمرت المشكلة فأخبرنا بذلك.",
    retry: "إعادة المحاولة",
    home: "العودة إلى الرئيسية",
    contact: "التواصل مع الدعم",
    reference: "مرجع الخطأ",
  },
};

const ru: ErrorMessages = {
  notFound: {
    metaTitle: "Страница не найдена (404)",
    code: "Ошибка 404",
    title: "Эта страница свернула не туда",
    text: "Страница, которую вы ищете, не существует или была перемещена. Давайте вернёмся на верный путь.",
    home: "На главную",
    contact: "Сообщить о битой ссылке",
    popular: "Популярные страницы",
    links: {
      speedTest: { title: "Тест скорости", text: "Проверьте загрузку, отдачу и пинг" },
      myIp: { title: "Мой IP-адрес", text: "Узнайте свой публичный IP-адрес" },
      ipRisk: { title: "Оценка риска IP", text: "Проверьте репутацию IP-адреса" },
      blog: { title: "Блог", text: "Статьи о WiFi и скорости интернета" },
      faq: { title: "Вопросы и ответы", text: "Ответы на частые вопросы" },
      contact: { title: "Контакты", text: "Напишите нашей команде" },
    },
  },
  error: {
    code: "Непредвиденная ошибка",
    title: "Что-то пошло не так",
    text: "При загрузке страницы произошла непредвиденная ошибка. Пожалуйста, попробуйте ещё раз. Если проблема сохранится, сообщите нам.",
    retry: "Попробовать снова",
    home: "На главную",
    contact: "Написать в поддержку",
    reference: "Код ошибки",
  },
};

export const errorMessages: Record<Locale, ErrorMessages> = { en, fr, es, ar, ru };
