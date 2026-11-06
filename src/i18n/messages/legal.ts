import type { Locale } from "../config";

/**
 * Legal / policy documents.
 *
 * Inline markup supported by <Rich> (src/components/LegalPage.tsx):
 *   [label](/path)          internal link, localized automatically
 *   [label](https://…)      external link (opens in a new tab)
 *   {email}                 company email as a mailto link
 *   {brand} / {company}     "TestSpeedInternet" / "ZONEPAY LTD"
 */
export type LegalBlock = string | { list: string[]; ordered?: boolean };
export type LegalSection = { id: string; heading: string; body: LegalBlock[] };
export type LegalDoc = {
  meta: { title: string; description: string };
  badge: string;
  title: string;
  intro: string;
  sections: LegalSection[];
};

// Shared labels used by every legal page.
const en = {
  lastUpdated: "Last updated:",
  onThisPage: "On this page",
  // Shown on non-English pages only; {link} is replaced with a link to the English page.
  translationNotice:
    "This is a translation provided for convenience. If there is any discrepancy between this version and the English original, the {link} prevails.",
  englishVersion: "English version",
  related: "Related policies",
  questions: "Questions about this policy?",
  questionsText: "Our team is happy to help. Reach us through the contact form or by email.",
  contactUs: "Contact us",
  backToTop: "Back to top",
};

export type LegalUiMessages = typeof en;

const fr: LegalUiMessages = {
  lastUpdated: "Dernière mise à jour :",
  onThisPage: "Sur cette page",
  translationNotice:
    "Cette traduction est fournie à titre indicatif. En cas de divergence entre cette version et l'original en anglais, la {link} prévaut.",
  englishVersion: "version anglaise",
  related: "Politiques associées",
  questions: "Une question sur cette politique ?",
  questionsText: "Notre équipe est là pour vous aider. Écrivez-nous via le formulaire de contact ou par e-mail.",
  contactUs: "Nous contacter",
  backToTop: "Retour en haut",
};

const es: LegalUiMessages = {
  lastUpdated: "Última actualización:",
  onThisPage: "En esta página",
  translationNotice:
    "Esta traducción se ofrece solo por comodidad. Si existe alguna discrepancia entre esta versión y el original en inglés, prevalecerá la {link}.",
  englishVersion: "versión en inglés",
  related: "Políticas relacionadas",
  questions: "¿Tienes preguntas sobre esta política?",
  questionsText: "Nuestro equipo estará encantado de ayudarte. Escríbenos mediante el formulario de contacto o por correo electrónico.",
  contactUs: "Contáctanos",
  backToTop: "Volver arriba",
};

const ar: LegalUiMessages = {
  lastUpdated: "آخر تحديث:",
  onThisPage: "في هذه الصفحة",
  translationNotice:
    "هذه ترجمة مقدَّمة للتيسير فقط. وفي حال وجود أي تعارض بين هذه النسخة والنص الإنجليزي الأصلي، تكون {link} هي المرجع المعتمد.",
  englishVersion: "النسخة الإنجليزية",
  related: "سياسات ذات صلة",
  questions: "هل لديك أسئلة حول هذه السياسة؟",
  questionsText: "يسعد فريقنا مساعدتك. تواصل معنا عبر نموذج الاتصال أو البريد الإلكتروني.",
  contactUs: "اتصل بنا",
  backToTop: "العودة إلى الأعلى",
};

const ru: LegalUiMessages = {
  lastUpdated: "Последнее обновление:",
  onThisPage: "Содержание",
  translationNotice:
    "Этот перевод предоставлен для удобства. В случае расхождений между данной версией и английским оригиналом преимущественную силу имеет {link}.",
  englishVersion: "английская версия",
  related: "Связанные документы",
  questions: "Есть вопросы по этому документу?",
  questionsText: "Наша команда с радостью поможет. Напишите нам через форму обратной связи или по электронной почте.",
  contactUs: "Связаться с нами",
  backToTop: "Наверх",
};

export const legalUiMessages: Record<Locale, LegalUiMessages> = { en, fr, es, ar, ru };
