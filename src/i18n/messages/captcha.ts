import type { Locale } from "../config";

const en = {
  verify: "Verify you're human",
  verifyHint: "Click to verify",
  verified: "Verified",
  title: "Complete the puzzle",
  subtitle: "Drag the slider to fit the piece into the gap.",
  slide: "Slide to complete the image",
  refresh: "New puzzle",
  close: "Close",
  checking: "Checking…",
  success: "Done! You're verified.",
  fail: "Not quite — try again.",
  expired: "The puzzle expired. Here's a new one.",
  error: "Couldn't load the puzzle. Try again.",
  keyboard: "Use the arrow keys to move the piece and Enter to confirm.",
  privacy: "Built-in check, no third-party tracking",
};
export type CaptchaMessages = typeof en;

const fr: CaptchaMessages = {
  verify: "Vérifiez que vous êtes humain",
  verifyHint: "Cliquez pour vérifier",
  verified: "Vérifié",
  title: "Complétez le puzzle",
  subtitle: "Faites glisser le curseur pour placer la pièce dans l'emplacement.",
  slide: "Glissez pour compléter l'image",
  refresh: "Nouveau puzzle",
  close: "Fermer",
  checking: "Vérification…",
  success: "C'est bon, vous êtes vérifié.",
  fail: "Pas tout à fait, réessayez.",
  expired: "Le puzzle a expiré. En voici un nouveau.",
  error: "Impossible de charger le puzzle. Réessayez.",
  keyboard: "Utilisez les flèches pour déplacer la pièce et Entrée pour valider.",
  privacy: "Vérification intégrée, sans suivi par un tiers",
};

const es: CaptchaMessages = {
  verify: "Verifica que eres humano",
  verifyHint: "Haz clic para verificar",
  verified: "Verificado",
  title: "Completa el puzle",
  subtitle: "Arrastra el control para encajar la pieza en el hueco.",
  slide: "Desliza para completar la imagen",
  refresh: "Nuevo puzle",
  close: "Cerrar",
  checking: "Comprobando…",
  success: "¡Listo! Estás verificado.",
  fail: "Casi. Inténtalo de nuevo.",
  expired: "El puzle ha caducado. Aquí tienes uno nuevo.",
  error: "No se pudo cargar el puzle. Inténtalo de nuevo.",
  keyboard: "Usa las flechas para mover la pieza y Enter para confirmar.",
  privacy: "Verificación propia, sin rastreo de terceros",
};

const ar: CaptchaMessages = {
  verify: "تحقّق من أنك إنسان",
  verifyHint: "انقر للتحقق",
  verified: "تم التحقق",
  title: "أكمل اللغز",
  subtitle: "اسحب المؤشر لوضع القطعة في مكانها.",
  slide: "اسحب لإكمال الصورة",
  refresh: "لغز جديد",
  close: "إغلاق",
  checking: "جارٍ التحقق…",
  success: "تم! لقد تم التحقق منك.",
  fail: "ليس تمامًا، حاول مرة أخرى.",
  expired: "انتهت صلاحية اللغز. إليك لغزًا جديدًا.",
  error: "تعذّر تحميل اللغز. حاول مرة أخرى.",
  keyboard: "استخدم مفاتيح الأسهم لتحريك القطعة وEnter للتأكيد.",
  privacy: "تحقق مدمج دون تتبع من أطراف خارجية",
};

const ru: CaptchaMessages = {
  verify: "Подтвердите, что вы человек",
  verifyHint: "Нажмите для проверки",
  verified: "Проверено",
  title: "Соберите пазл",
  subtitle: "Перетащите ползунок, чтобы вставить фрагмент на место.",
  slide: "Сдвиньте, чтобы собрать картинку",
  refresh: "Новый пазл",
  close: "Закрыть",
  checking: "Проверяем…",
  success: "Готово! Проверка пройдена.",
  fail: "Почти. Попробуйте ещё раз.",
  expired: "Время пазла истекло. Вот новый.",
  error: "Не удалось загрузить пазл. Попробуйте ещё раз.",
  keyboard: "Используйте стрелки, чтобы двигать фрагмент, и Enter для подтверждения.",
  privacy: "Встроенная проверка без сторонних трекеров",
};

export const captchaMessages: Record<Locale, CaptchaMessages> = { en, fr, es, ar, ru };
