// Branded transactional emails in the 5 site languages. Server-only.
import "server-only";
import { COMPANY } from "@/lib/company";
import { LOCALE_META, type Locale } from "@/i18n/config";

const SITE = COMPANY.siteUrl;
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type Built = { subject: string; html: string; text: string };

const COMMON: Record<Locale, { hi: (n: string) => string; ignore: string; linkHelp: string; footer: string; team: string }> = {
  en: { hi: (n) => `Hi ${n},`, ignore: "If you didn't ask for this, you can safely ignore this email.", linkHelp: "Button not working? Copy this link into your browser:", footer: "You received this email because of an action on testspeedinternet.com.", team: "The TestSpeedInternet team" },
  fr: { hi: (n) => `Bonjour ${n},`, ignore: "Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet e-mail.", linkHelp: "Le bouton ne fonctionne pas ? Copiez ce lien dans votre navigateur :", footer: "Vous recevez cet e-mail suite à une action sur testspeedinternet.com.", team: "L'équipe TestSpeedInternet" },
  es: { hi: (n) => `Hola ${n}:`, ignore: "Si no lo solicitaste, puedes ignorar este correo.", linkHelp: "¿El botón no funciona? Copia este enlace en tu navegador:", footer: "Recibes este correo por una acción realizada en testspeedinternet.com.", team: "El equipo de TestSpeedInternet" },
  ar: { hi: (n) => `مرحبًا ${n}،`, ignore: "إذا لم تطلب ذلك، يمكنك تجاهل هذه الرسالة بأمان.", linkHelp: "الزر لا يعمل؟ انسخ هذا الرابط في المتصفح:", footer: "وصلتك هذه الرسالة بسبب إجراء على testspeedinternet.com.", team: "فريق TestSpeedInternet" },
  ru: { hi: (n) => `Здравствуйте, ${n}!`, ignore: "Если вы этого не запрашивали, просто проигнорируйте письмо.", linkHelp: "Кнопка не работает? Скопируйте ссылку в браузер:", footer: "Вы получили это письмо из-за действия на testspeedinternet.com.", team: "Команда TestSpeedInternet" },
};

function layout(locale: Locale, o: { name: string; title: string; intro: string; button: string; link: string; note?: string }): { html: string; text: string } {
  const c = COMMON[locale];
  const dir = LOCALE_META[locale].dir;
  const align = dir === "rtl" ? "right" : "left";
  const html = `<!doctype html><html lang="${LOCALE_META[locale].htmlLang}" dir="${dir}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(o.title)}</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0f172a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(15,23,42,.08)">
<tr><td style="background:linear-gradient(135deg,#2563eb,#4338ca);padding:22px 28px;text-align:${align}">
<a href="${SITE}" style="color:#ffffff;text-decoration:none;font-size:18px;font-weight:800;letter-spacing:-.2px">&#9889; TestSpeedInternet</a></td></tr>
<tr><td style="padding:32px 28px 8px;text-align:${align}" dir="${dir}">
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#0f172a">${esc(o.title)}</h1>
<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#334155">${esc(c.hi(o.name))}</p>
<p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#334155">${esc(o.intro)}</p>
<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:10px;background:#2563eb">
<a href="${esc(o.link)}" style="display:inline-block;padding:13px 24px;color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;border-radius:10px">${esc(o.button)}</a></td></tr></table>
${o.note ? `<p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:#64748b">${esc(o.note)}</p>` : ""}
<p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:#64748b">${esc(c.ignore)}</p>
<p style="margin:20px 0 4px;font-size:12px;color:#94a3b8">${esc(c.linkHelp)}</p>
<p style="margin:0 0 24px;font-size:12px;word-break:break-all"><a href="${esc(o.link)}" style="color:#2563eb">${esc(o.link)}</a></p>
<p style="margin:0 0 28px;font-size:14px;color:#334155">— ${esc(c.team)}</p></td></tr>
<tr><td style="background:#f8fafc;padding:16px 28px;font-size:12px;line-height:1.5;color:#94a3b8;text-align:${align}">${esc(c.footer)}<br>${esc(COMPANY.legalName)} · <a href="mailto:${COMPANY.email}" style="color:#64748b">${COMPANY.email}</a></td></tr>
</table></td></tr></table></body></html>`;
  const text = `${c.hi(o.name)}\n\n${o.intro}\n\n${o.button}: ${o.link}\n${o.note ? `\n${o.note}\n` : ""}\n${c.ignore}\n\n— ${c.team}\n${SITE}`;
  return { html, text };
}

const VERIFY: Record<Locale, { subject: string; title: string; intro: string; button: string; note: string }> = {
  en: { subject: "Confirm your email – TestSpeedInternet", title: "Confirm your email address", intro: "Thanks for creating a TestSpeedInternet account. Please confirm your email to save your speed tests, compare providers and write reviews.", button: "Confirm my email", note: "This link expires in 48 hours." },
  fr: { subject: "Confirmez votre e-mail – TestSpeedInternet", title: "Confirmez votre adresse e-mail", intro: "Merci d'avoir créé un compte TestSpeedInternet. Confirmez votre e-mail pour enregistrer vos tests, comparer les fournisseurs et publier des avis.", button: "Confirmer mon e-mail", note: "Ce lien expire dans 48 heures." },
  es: { subject: "Confirma tu correo – TestSpeedInternet", title: "Confirma tu dirección de correo", intro: "Gracias por crear una cuenta en TestSpeedInternet. Confirma tu correo para guardar tus tests, comparar proveedores y escribir reseñas.", button: "Confirmar mi correo", note: "Este enlace caduca en 48 horas." },
  ar: { subject: "أكّد بريدك الإلكتروني – TestSpeedInternet", title: "أكّد عنوان بريدك الإلكتروني", intro: "شكرًا لإنشاء حساب في TestSpeedInternet. أكّد بريدك لحفظ اختباراتك ومقارنة المزوّدين وكتابة التقييمات.", button: "تأكيد بريدي", note: "تنتهي صلاحية هذا الرابط خلال 48 ساعة." },
  ru: { subject: "Подтвердите e-mail – TestSpeedInternet", title: "Подтвердите адрес электронной почты", intro: "Спасибо за регистрацию в TestSpeedInternet. Подтвердите e-mail, чтобы сохранять тесты, сравнивать провайдеров и оставлять отзывы.", button: "Подтвердить e-mail", note: "Ссылка действительна 48 часов." },
};

const RESET: Record<Locale, { subject: string; title: string; intro: string; button: string; note: string }> = {
  en: { subject: "Reset your password – TestSpeedInternet", title: "Reset your password", intro: "We received a request to reset the password of your TestSpeedInternet account. Click the button to choose a new one.", button: "Choose a new password", note: "This link expires in 1 hour and can be used once." },
  fr: { subject: "Réinitialisez votre mot de passe – TestSpeedInternet", title: "Réinitialiser votre mot de passe", intro: "Nous avons reçu une demande de réinitialisation du mot de passe de votre compte TestSpeedInternet. Cliquez sur le bouton pour en choisir un nouveau.", button: "Choisir un nouveau mot de passe", note: "Ce lien expire dans 1 heure et ne peut être utilisé qu'une fois." },
  es: { subject: "Restablece tu contraseña – TestSpeedInternet", title: "Restablece tu contraseña", intro: "Recibimos una solicitud para restablecer la contraseña de tu cuenta de TestSpeedInternet. Pulsa el botón para elegir una nueva.", button: "Elegir nueva contraseña", note: "Este enlace caduca en 1 hora y solo se puede usar una vez." },
  ar: { subject: "إعادة تعيين كلمة المرور – TestSpeedInternet", title: "إعادة تعيين كلمة المرور", intro: "تلقّينا طلبًا لإعادة تعيين كلمة مرور حسابك في TestSpeedInternet. اضغط الزر لاختيار كلمة مرور جديدة.", button: "اختيار كلمة مرور جديدة", note: "تنتهي صلاحية الرابط خلال ساعة ويُستخدم مرة واحدة." },
  ru: { subject: "Сброс пароля – TestSpeedInternet", title: "Сброс пароля", intro: "Мы получили запрос на сброс пароля вашего аккаунта TestSpeedInternet. Нажмите кнопку, чтобы задать новый пароль.", button: "Задать новый пароль", note: "Ссылка действует 1 час и только один раз." },
};

const REVIEW: Record<Locale, { subject: (p: string) => string; title: string; intro: (p: string) => string; button: string; note: string }> = {
  en: { subject: (p) => `Confirm your review of ${p}`, title: "Confirm your review", intro: (p) => `Thanks for reviewing ${p}! Confirm your email and your review goes live for other customers to read.`, button: "Publish my review", note: "This link expires in 7 days." },
  fr: { subject: (p) => `Confirmez votre avis sur ${p}`, title: "Confirmez votre avis", intro: (p) => `Merci pour votre avis sur ${p} ! Confirmez votre e-mail et il sera publié pour les autres clients.`, button: "Publier mon avis", note: "Ce lien expire dans 7 jours." },
  es: { subject: (p) => `Confirma tu reseña de ${p}`, title: "Confirma tu reseña", intro: (p) => `¡Gracias por tu reseña de ${p}! Confirma tu correo y se publicará para otros clientes.`, button: "Publicar mi reseña", note: "Este enlace caduca en 7 días." },
  ar: { subject: (p) => `أكّد تقييمك لـ ${p}`, title: "أكّد تقييمك", intro: (p) => `شكرًا لتقييمك ${p}! أكّد بريدك الإلكتروني ليُنشر تقييمك لبقية العملاء.`, button: "نشر تقييمي", note: "تنتهي صلاحية الرابط خلال 7 أيام." },
  ru: { subject: (p) => `Подтвердите отзыв о ${p}`, title: "Подтвердите отзыв", intro: (p) => `Спасибо за отзыв о ${p}! Подтвердите e-mail, и отзыв увидят другие клиенты.`, button: "Опубликовать отзыв", note: "Ссылка действует 7 дней." },
};

export function verifyEmailMail(locale: Locale, name: string, link: string): Built {
  const m = VERIFY[locale];
  return { subject: m.subject, ...layout(locale, { name, title: m.title, intro: m.intro, button: m.button, link, note: m.note }) };
}

export function resetPasswordMail(locale: Locale, name: string, link: string): Built {
  const m = RESET[locale];
  return { subject: m.subject, ...layout(locale, { name, title: m.title, intro: m.intro, button: m.button, link, note: m.note }) };
}

export function confirmReviewMail(locale: Locale, name: string, provider: string, link: string): Built {
  const m = REVIEW[locale];
  return { subject: m.subject(provider), ...layout(locale, { name, title: m.title, intro: m.intro(provider), button: m.button, link, note: m.note }) };
}

export function testMail(): Built {
  return {
    subject: "Test email from TestSpeedInternet ✔",
    ...layout("en", { name: "admin", title: "Email is working", intro: "This is a test email from your TestSpeedInternet admin. If you can read it, sending works.", button: "Open the website", link: SITE }),
  };
}

/** Absolute link on the site for a locale, e.g. siteLink("fr", "/account/verify?token=…").
 *  Pass the request to link back to the same host (useful locally / on previews). */
export function siteLink(locale: Locale, path: string, req?: Request): string {
  let base: string = SITE;
  if (req) {
    try {
      const u = new URL(req.url);
      if (/^(localhost|127\.0\.0\.1)$/.test(u.hostname) || u.hostname.endsWith(".vercel.app")) base = u.origin;
    } catch {
      /* keep SITE */
    }
  }
  return `${base}${locale === "en" ? "" : `/${locale}`}${path}`;
}
