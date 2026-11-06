import type { Locale } from "../../config";
import type { LegalDoc } from "../legal";

const en: LegalDoc = {
  meta: {
    title: "DMCA & Copyright Policy",
    description:
      "DMCA and copyright policy for TestSpeedInternet, owned and operated by ZONEPAY LTD: how to submit a takedown notice or counter-notice, and what to include.",
  },
  badge: "Legal",
  title: "DMCA & Copyright Policy",
  intro:
    "{brand} is owned and operated by {company}. We respect intellectual property rights and respond to valid copyright notices.",
  sections: [
    {
      id: "ownership",
      heading: "Ownership",
      body: [
        "The {brand} website, its design, code, content and branding are the property of {company} and are protected by copyright and other laws. Third-party trademarks and logos shown on the site belong to their respective owners.",
      ],
    },
    {
      id: "reporting-infringement",
      heading: "Reporting copyright infringement",
      body: [
        'If you believe content on {brand} infringes your copyright, send a written notice (a "DMCA notice") to {email} with the subject line "DMCA Takedown".',
      ],
    },
    {
      id: "notice-requirements",
      heading: "What your notice must include",
      body: [
        {
          ordered: true,
          list: [
            "Your physical or electronic signature.",
            "Identification of the copyrighted work you claim is infringed.",
            "The exact URL(s) of the material you want removed.",
            "Your name, address, email and phone number.",
            "A statement that you have a good-faith belief the use is not authorized.",
            "A statement, under penalty of perjury, that the information is accurate and that you are the owner or authorized to act on the owner's behalf.",
          ],
        },
      ],
    },
    {
      id: "our-response",
      heading: "Our response",
      body: [
        "Once we receive a valid notice, we will review it and remove or disable access to the allegedly infringing material within a reasonable time, and notify the party who posted it where applicable.",
      ],
    },
    {
      id: "counter-notice",
      heading: "Counter-notice",
      body: [
        "If you believe your content was removed by mistake or misidentification, you may send a counter-notice to {email} including your contact details, identification of the removed material and its location, and a statement under penalty of perjury that you have a good-faith belief it was removed in error.",
      ],
    },
    {
      id: "repeat-infringers",
      heading: "Repeat infringers",
      body: [
        "{company} may, in appropriate circumstances, restrict or remove content and access for parties who repeatedly infringe copyright.",
      ],
    },
    {
      id: "contact",
      heading: "Contact",
      body: ["Copyright matters: {company} — {email}."],
    },
  ],
};

const fr: LegalDoc = {
  meta: {
    title: "Politique DMCA et droits d'auteur",
    description:
      "Politique DMCA et droits d'auteur de TestSpeedInternet, détenu et exploité par ZONEPAY LTD : comment envoyer une notification de retrait ou une contre-notification.",
  },
  badge: "Mentions légales",
  title: "Politique DMCA et droits d'auteur",
  intro:
    "{brand} est détenu et exploité par {company}. Nous respectons les droits de propriété intellectuelle et donnons suite aux notifications valables relatives aux droits d'auteur.",
  sections: [
    {
      id: "ownership",
      heading: "Propriété",
      body: [
        "Le site {brand}, son design, son code, son contenu et son identité de marque sont la propriété de {company} et sont protégés par le droit d'auteur et d'autres lois. Les marques et logos de tiers affichés sur le site appartiennent à leurs propriétaires respectifs.",
      ],
    },
    {
      id: "reporting-infringement",
      heading: "Signaler une violation du droit d'auteur",
      body: [
        "Si vous estimez qu'un contenu publié sur {brand} porte atteinte à vos droits d'auteur, envoyez une notification écrite (une « notification DMCA ») à {email} avec l'objet « DMCA Takedown » (demande de retrait DMCA).",
      ],
    },
    {
      id: "notice-requirements",
      heading: "Contenu obligatoire de votre notification",
      body: [
        {
          ordered: true,
          list: [
            "Votre signature manuscrite ou électronique.",
            "L'identification de l'œuvre protégée dont vous estimez qu'elle est contrefaite.",
            "L'URL exacte (ou les URL exactes) du contenu dont vous demandez le retrait.",
            "Vos nom, adresse, adresse e-mail et numéro de téléphone.",
            "Une déclaration indiquant que vous estimez de bonne foi que l'utilisation n'est pas autorisée.",
            "Une déclaration, faite sous peine de parjure, attestant que les informations fournies sont exactes et que vous êtes le titulaire des droits ou que vous êtes autorisé à agir en son nom.",
          ],
        },
      ],
    },
    {
      id: "our-response",
      heading: "Notre réponse",
      body: [
        "Dès réception d'une notification valable, nous l'examinerons et retirerons le contenu prétendument contrefaisant ou en désactiverons l'accès dans un délai raisonnable, et en informerons, le cas échéant, la personne qui l'a publié.",
      ],
    },
    {
      id: "counter-notice",
      heading: "Contre-notification",
      body: [
        "Si vous estimez que votre contenu a été retiré par erreur ou à la suite d'une erreur d'identification, vous pouvez envoyer une contre-notification à {email} comprenant vos coordonnées, l'identification du contenu retiré et de son emplacement, ainsi qu'une déclaration, faite sous peine de parjure, attestant que vous estimez de bonne foi qu'il a été retiré par erreur.",
      ],
    },
    {
      id: "repeat-infringers",
      heading: "Récidivistes",
      body: [
        "{company} peut, dans les cas appropriés, restreindre ou supprimer le contenu et l'accès des personnes qui portent atteinte de manière répétée au droit d'auteur.",
      ],
    },
    {
      id: "contact",
      heading: "Contact",
      body: ["Questions relatives au droit d'auteur : {company} — {email}."],
    },
  ],
};

const es: LegalDoc = {
  meta: {
    title: "Política DMCA y de derechos de autor",
    description:
      "Política DMCA y de derechos de autor de TestSpeedInternet, propiedad de ZONEPAY LTD: cómo enviar una notificación de retirada o una contranotificación y qué incluir.",
  },
  badge: "Legal",
  title: "Política DMCA y de derechos de autor",
  intro:
    "{brand} es propiedad de {company}, que también lo opera. Respetamos los derechos de propiedad intelectual y atendemos las notificaciones válidas sobre derechos de autor.",
  sections: [
    {
      id: "ownership",
      heading: "Titularidad",
      body: [
        "El sitio web {brand}, su diseño, código, contenido e imagen de marca son propiedad de {company} y están protegidos por las leyes de derechos de autor y otras normas. Las marcas y logotipos de terceros que aparecen en el sitio pertenecen a sus respectivos propietarios.",
      ],
    },
    {
      id: "reporting-infringement",
      heading: "Cómo denunciar una infracción de derechos de autor",
      body: [
        "Si consideras que algún contenido de {brand} infringe tus derechos de autor, envía una notificación por escrito (una «notificación DMCA») a {email} con el asunto «DMCA Takedown» (solicitud de retirada DMCA).",
      ],
    },
    {
      id: "notice-requirements",
      heading: "Qué debe incluir tu notificación",
      body: [
        {
          ordered: true,
          list: [
            "Tu firma física o electrónica.",
            "La identificación de la obra protegida que consideras infringida.",
            "La URL o URL exactas del material que deseas que se retire.",
            "Tu nombre, dirección, correo electrónico y número de teléfono.",
            "Una declaración de que crees de buena fe que el uso no está autorizado.",
            "Una declaración, bajo pena de perjurio, de que la información es exacta y de que eres el titular de los derechos o estás autorizado para actuar en su nombre.",
          ],
        },
      ],
    },
    {
      id: "our-response",
      heading: "Nuestra respuesta",
      body: [
        "Una vez recibida una notificación válida, la revisaremos y retiraremos o deshabilitaremos el acceso al material presuntamente infractor en un plazo razonable, e informaremos a quien lo publicó cuando corresponda.",
      ],
    },
    {
      id: "counter-notice",
      heading: "Contranotificación",
      body: [
        "Si crees que tu contenido se retiró por error o por una identificación errónea, puedes enviar una contranotificación a {email} que incluya tus datos de contacto, la identificación del material retirado y su ubicación, y una declaración, bajo pena de perjurio, de que crees de buena fe que se retiró por error.",
      ],
    },
    {
      id: "repeat-infringers",
      heading: "Infractores reincidentes",
      body: [
        "{company} podrá, en las circunstancias apropiadas, restringir o eliminar el contenido y el acceso de quienes infrinjan reiteradamente los derechos de autor.",
      ],
    },
    {
      id: "contact",
      heading: "Contacto",
      body: ["Asuntos de derechos de autor: {company} — {email}."],
    },
  ],
};

const ar: LegalDoc = {
  meta: {
    title: "سياسة DMCA وحقوق النشر",
    description:
      "سياسة DMCA وحقوق النشر لموقع TestSpeedInternet المملوك لشركة ZONEPAY LTD والذي تديره: كيفية تقديم إشعار إزالة أو إشعار مضاد، والمعلومات التي يجب أن يتضمنها.",
  },
  badge: "قانوني",
  title: "سياسة DMCA وحقوق النشر",
  intro:
    "موقع {brand} مملوك لشركة {company} وتديره. ونحن نحترم حقوق الملكية الفكرية ونستجيب لإشعارات حقوق النشر الصحيحة.",
  sections: [
    {
      id: "ownership",
      heading: "الملكية",
      body: [
        "موقع {brand} وتصميمه وشيفرته البرمجية ومحتواه وهويته التجارية ملك لشركة {company}، وهي محمية بموجب قوانين حقوق النشر وغيرها من القوانين. أما العلامات التجارية والشعارات العائدة لجهات خارجية والمعروضة على الموقع فهي ملك لأصحابها.",
      ],
    },
    {
      id: "reporting-infringement",
      heading: "الإبلاغ عن انتهاك حقوق النشر",
      body: [
        "إذا كنت تعتقد أن محتوى منشورًا على {brand} ينتهك حقوق النشر الخاصة بك، فأرسل إشعارًا كتابيًا («إشعار DMCA») إلى {email} مع كتابة «DMCA Takedown» (طلب إزالة بموجب DMCA) في سطر الموضوع.",
      ],
    },
    {
      id: "notice-requirements",
      heading: "ما يجب أن يتضمنه إشعارك",
      body: [
        {
          ordered: true,
          list: [
            "توقيعك الخطي أو الإلكتروني.",
            "تحديد العمل المحمي بحقوق النشر الذي تدّعي أنه تعرّض للانتهاك.",
            "عنوان URL الدقيق (أو العناوين الدقيقة) للمواد التي تطلب إزالتها.",
            "اسمك وعنوانك وبريدك الإلكتروني ورقم هاتفك.",
            "إقرار بأنك تعتقد بحسن نية أن الاستخدام غير مصرّح به.",
            "إقرار، تحت طائلة عقوبة شهادة الزور، بأن المعلومات المقدَّمة دقيقة وبأنك المالك أو مفوَّض بالتصرف نيابةً عنه.",
          ],
        },
      ],
    },
    {
      id: "our-response",
      heading: "استجابتنا",
      body: [
        "عند تلقّي إشعار صحيح، سنراجعه ونزيل المواد التي يُدّعى أنها منتهِكة أو نعطّل الوصول إليها خلال مدة معقولة، ونُخطر الطرف الذي نشرها عند الاقتضاء.",
      ],
    },
    {
      id: "counter-notice",
      heading: "الإشعار المضاد",
      body: [
        "إذا كنت تعتقد أن محتواك أُزيل عن طريق الخطأ أو بسبب خطأ في التعريف، فيمكنك إرسال إشعار مضاد إلى {email} يتضمن بيانات الاتصال الخاصة بك، وتحديد المواد التي أُزيلت وموقعها، وإقرارًا، تحت طائلة عقوبة شهادة الزور، بأنك تعتقد بحسن نية أنها أُزيلت عن طريق الخطأ.",
      ],
    },
    {
      id: "repeat-infringers",
      heading: "المنتهِكون المتكرّرون",
      body: [
        "يجوز لشركة {company}، في الظروف المناسبة، تقييد المحتوى والوصول أو إزالتهما بالنسبة إلى الأطراف التي تنتهك حقوق النشر بشكل متكرر.",
      ],
    },
    {
      id: "contact",
      heading: "التواصل",
      body: ["مسائل حقوق النشر: {company} — {email}."],
    },
  ],
};

const ru: LegalDoc = {
  meta: {
    title: "Политика DMCA и авторских прав",
    description:
      "Политика DMCA и авторских прав TestSpeedInternet (владелец и оператор — ZONEPAY LTD): как подать уведомление об удалении или встречное уведомление и что в нём указать.",
  },
  badge: "Правовая информация",
  title: "Политика DMCA и авторских прав",
  intro:
    "{brand} принадлежит компании {company}, которая также управляет сайтом. Мы уважаем права интеллектуальной собственности и реагируем на обоснованные уведомления о нарушении авторских прав.",
  sections: [
    {
      id: "ownership",
      heading: "Права собственности",
      body: [
        "Сайт {brand}, его дизайн, код, контент и фирменный стиль являются собственностью {company} и охраняются законодательством об авторском праве и иными законами. Товарные знаки и логотипы третьих лиц, отображаемые на сайте, принадлежат их владельцам.",
      ],
    },
    {
      id: "reporting-infringement",
      heading: "Как сообщить о нарушении авторских прав",
      body: [
        "Если вы считаете, что материалы на {brand} нарушают ваши авторские права, направьте письменное уведомление («уведомление DMCA») на адрес {email} с темой письма «DMCA Takedown» (запрос на удаление по DMCA).",
      ],
    },
    {
      id: "notice-requirements",
      heading: "Что должно содержать уведомление",
      body: [
        {
          ordered: true,
          list: [
            "Вашу собственноручную или электронную подпись.",
            "Указание произведения, защищённого авторским правом, которое, по вашему утверждению, нарушено.",
            "Точный URL-адрес (или адреса) материалов, которые вы просите удалить.",
            "Ваше имя, адрес, адрес электронной почты и номер телефона.",
            "Заявление о том, что вы добросовестно полагаете, что использование не разрешено.",
            "Заявление, сделанное под страхом ответственности за лжесвидетельство, о том, что предоставленная информация точна и что вы являетесь правообладателем или уполномочены действовать от его имени.",
          ],
        },
      ],
    },
    {
      id: "our-response",
      heading: "Наши действия",
      body: [
        "Получив обоснованное уведомление, мы рассмотрим его и в разумный срок удалим предположительно нарушающие права материалы или заблокируем доступ к ним, а также, где применимо, уведомим разместившее их лицо.",
      ],
    },
    {
      id: "counter-notice",
      heading: "Встречное уведомление",
      body: [
        "Если вы считаете, что ваши материалы были удалены по ошибке или в результате неверной идентификации, вы можете направить встречное уведомление на адрес {email}, указав свои контактные данные, удалённые материалы и их местонахождение, а также заявление, сделанное под страхом ответственности за лжесвидетельство, о том, что вы добросовестно полагаете, что они были удалены по ошибке.",
      ],
    },
    {
      id: "repeat-infringers",
      heading: "Повторные нарушители",
      body: [
        "{company} может в соответствующих случаях ограничивать или удалять материалы и доступ лиц, неоднократно нарушающих авторские права.",
      ],
    },
    {
      id: "contact",
      heading: "Контакты",
      body: ["Вопросы авторского права: {company} — {email}."],
    },
  ],
};

export const dmcaMessages: Record<Locale, LegalDoc> = { en, fr, es, ar, ru };
