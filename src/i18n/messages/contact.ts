import type { Locale } from "../config";

// Contact page + contact form.
const en = {
  meta: {
    title: "Contact Us",
    description:
      "Get in touch with TestSpeedInternet, operated by ZONEPAY LTD. Contact us for support, feedback, partnerships, advertising or press enquiries by form or email.",
  },
  hero: {
    badge: "Contact",
    titleA: "Get in",
    titleB: "touch",
    lead: "We'd love to hear from you. Send us a message and we'll get back to you by email as soon as we can.",
  },
  channels: [
    { title: "General enquiries", text: "Questions, feedback or partnership ideas: we read every message." },
    { title: "Support", text: "Having trouble with the speed test or a tool? Let us know." },
  ],
  company: {
    text: "{brand} is operated by {company}.",
  },
  helpful: {
    title: "Looking for a quick answer?",
    faq: "Read the FAQ",
    howItWorks: "How the test works",
    privacy: "Privacy Policy",
  },
  form: {
    title: "Send us a message",
    subtitle: "All fields are required.",
    labels: {
      name: "Full name",
      email: "Email",
      phone: "Phone number",
      subject: "Subject",
      message: "Message",
    },
    placeholders: {
      name: "John Doe",
      email: "you@example.com",
      phone: "600 000000",
      subject: "Select a subject",
      message: "How can we help you?",
    },
    // Keys are the English values sent to the API (unchanged); values are the visible labels.
    subjects: {
      "General enquiry": "General enquiry",
      "Cooperation / Partnership": "Cooperation / Partnership",
      Support: "Support",
      "Press / Media": "Press / Media",
      Advertising: "Advertising",
      Feedback: "Feedback",
      Other: "Other",
    },
    detecting: "Detecting your country…",
    selectCountry: "Select country",
    searchCountry: "Search country or code",
    noCountries: "No countries found",
    international: "International",
    errors: {
      name: "Please enter your full name.",
      email: "Please enter a valid email address.",
      phone: "Please enter a valid phone number for the selected country.",
      subject: "Please choose a subject.",
      message: "Your message should be at least 10 characters.",
      captcha: "Please complete the captcha.",
      captchaFailed: "Captcha verification failed. Please try again.",
      required: "Please fill in all required fields.",
      sendFailed: "Could not send your message. Please try again.",
      network: "Network error. Please try again.",
    },
    sending: "Sending…",
    send: "Send message",
    privacyNote: "We only use your details to reply to your message. See our [Privacy Policy](/privacy).",
    sentTitle: "Message sent",
    // {name} is replaced with the sender's first name
    sentText: "Thanks, {name}! We'll get back to you by email soon.",
    sentFallbackName: "there",
    sendAnother: "Send another message",
    captchaNotConfigured: "Captcha not configured yet (set it in Admin → Settings).",
  },
};

export type ContactMessages = typeof en;

const fr: ContactMessages = {
  meta: {
    title: "Nous contacter",
    description:
      "Contactez TestSpeedInternet, édité par ZONEPAY LTD : assistance, retours, partenariats, publicité ou presse, via notre formulaire de contact ou par e-mail.",
  },
  hero: {
    badge: "Contact",
    titleA: "Contactez-",
    titleB: "nous",
    lead: "Nous serions ravis d'avoir de vos nouvelles. Envoyez-nous un message et nous vous répondrons par e-mail dans les meilleurs délais.",
  },
  channels: [
    { title: "Demandes générales", text: "Questions, suggestions ou idées de partenariat : nous lisons chaque message." },
    { title: "Assistance", text: "Un souci avec le test de débit ou l'un de nos outils ? Dites-le-nous." },
  ],
  company: {
    text: "{brand} est édité par {company}.",
  },
  helpful: {
    title: "Vous cherchez une réponse rapide ?",
    faq: "Consulter la FAQ",
    howItWorks: "Fonctionnement du test",
    privacy: "Politique de confidentialité",
  },
  form: {
    title: "Envoyez-nous un message",
    subtitle: "Tous les champs sont obligatoires.",
    labels: {
      name: "Nom complet",
      email: "E-mail",
      phone: "Numéro de téléphone",
      subject: "Objet",
      message: "Message",
    },
    placeholders: {
      name: "Jean Dupont",
      email: "vous@exemple.com",
      phone: "600 000000",
      subject: "Choisissez un objet",
      message: "Comment pouvons-nous vous aider ?",
    },
    subjects: {
      "General enquiry": "Demande générale",
      "Cooperation / Partnership": "Coopération / Partenariat",
      Support: "Assistance",
      "Press / Media": "Presse / Médias",
      Advertising: "Publicité",
      Feedback: "Retour d'expérience",
      Other: "Autre",
    },
    detecting: "Détection de votre pays…",
    selectCountry: "Choisir le pays",
    searchCountry: "Rechercher un pays ou un indicatif",
    noCountries: "Aucun pays trouvé",
    international: "International",
    errors: {
      name: "Veuillez saisir votre nom complet.",
      email: "Veuillez saisir une adresse e-mail valide.",
      phone: "Veuillez saisir un numéro de téléphone valide pour le pays sélectionné.",
      subject: "Veuillez choisir un objet.",
      message: "Votre message doit comporter au moins 10 caractères.",
      captcha: "Veuillez compléter le captcha.",
      captchaFailed: "La vérification du captcha a échoué. Veuillez réessayer.",
      required: "Veuillez remplir tous les champs obligatoires.",
      sendFailed: "Impossible d'envoyer votre message. Veuillez réessayer.",
      network: "Erreur réseau. Veuillez réessayer.",
    },
    sending: "Envoi en cours…",
    send: "Envoyer le message",
    privacyNote:
      "Nous utilisons vos coordonnées uniquement pour répondre à votre message. Consultez notre [Politique de confidentialité](/privacy).",
    sentTitle: "Message envoyé",
    sentText: "Merci, {name} ! Nous vous répondrons très bientôt par e-mail.",
    sentFallbackName: "à vous",
    sendAnother: "Envoyer un autre message",
    captchaNotConfigured: "Captcha pas encore configuré (à définir dans Admin → Paramètres).",
  },
};

const es: ContactMessages = {
  meta: {
    title: "Contáctanos",
    description:
      "Ponte en contacto con TestSpeedInternet, gestionado por ZONEPAY LTD: soporte, comentarios, colaboraciones, publicidad o prensa, por formulario o correo.",
  },
  hero: {
    badge: "Contacto",
    titleA: "Ponte en",
    titleB: "contacto",
    lead: "Nos encantará saber de ti. Envíanos un mensaje y te responderemos por correo electrónico lo antes posible.",
  },
  channels: [
    { title: "Consultas generales", text: "Preguntas, comentarios o ideas de colaboración: leemos todos los mensajes." },
    { title: "Soporte", text: "¿Tienes problemas con el test de velocidad o con alguna herramienta? Cuéntanoslo." },
  ],
  company: {
    text: "{brand} está gestionado por {company}.",
  },
  helpful: {
    title: "¿Buscas una respuesta rápida?",
    faq: "Leer las preguntas frecuentes",
    howItWorks: "Cómo funciona el test",
    privacy: "Política de privacidad",
  },
  form: {
    title: "Envíanos un mensaje",
    subtitle: "Todos los campos son obligatorios.",
    labels: {
      name: "Nombre completo",
      email: "Correo electrónico",
      phone: "Número de teléfono",
      subject: "Asunto",
      message: "Mensaje",
    },
    placeholders: {
      name: "Juan Pérez",
      email: "tu@ejemplo.com",
      phone: "600 000000",
      subject: "Selecciona un asunto",
      message: "¿En qué podemos ayudarte?",
    },
    subjects: {
      "General enquiry": "Consulta general",
      "Cooperation / Partnership": "Cooperación / Colaboración",
      Support: "Soporte",
      "Press / Media": "Prensa / Medios",
      Advertising: "Publicidad",
      Feedback: "Comentarios",
      Other: "Otro",
    },
    detecting: "Detectando tu país…",
    selectCountry: "Seleccionar país",
    searchCountry: "Buscar país o prefijo",
    noCountries: "No se encontraron países",
    international: "Internacional",
    errors: {
      name: "Introduce tu nombre completo.",
      email: "Introduce una dirección de correo electrónico válida.",
      phone: "Introduce un número de teléfono válido para el país seleccionado.",
      subject: "Elige un asunto.",
      message: "Tu mensaje debe tener al menos 10 caracteres.",
      captcha: "Completa el captcha.",
      captchaFailed: "La verificación del captcha ha fallado. Inténtalo de nuevo.",
      required: "Rellena todos los campos obligatorios.",
      sendFailed: "No se pudo enviar tu mensaje. Inténtalo de nuevo.",
      network: "Error de red. Inténtalo de nuevo.",
    },
    sending: "Enviando…",
    send: "Enviar mensaje",
    privacyNote:
      "Solo usamos tus datos para responder a tu mensaje. Consulta nuestra [Política de privacidad](/privacy).",
    sentTitle: "Mensaje enviado",
    sentText: "¡Gracias, {name}! Te responderemos pronto por correo electrónico.",
    sentFallbackName: "por escribirnos",
    sendAnother: "Enviar otro mensaje",
    captchaNotConfigured: "El captcha aún no está configurado (configúralo en Admin → Ajustes).",
  },
};

const ar: ContactMessages = {
  meta: {
    title: "اتصل بنا",
    description:
      "تواصل مع TestSpeedInternet الذي تديره شركة ZONEPAY LTD للدعم الفني أو الملاحظات أو الشراكات أو الإعلانات أو الاستفسارات الإعلامية، عبر النموذج أو البريد الإلكتروني.",
  },
  hero: {
    badge: "اتصل بنا",
    titleA: "تواصل",
    titleB: "معنا",
    lead: "يسعدنا أن نسمع منك. أرسل إلينا رسالة وسنرد عليك عبر البريد الإلكتروني في أقرب وقت ممكن.",
  },
  channels: [
    { title: "الاستفسارات العامة", text: "أسئلة أو ملاحظات أو أفكار للشراكة: نقرأ كل رسالة تصلنا." },
    { title: "الدعم الفني", text: "هل تواجه مشكلة في اختبار السرعة أو إحدى الأدوات؟ أخبرنا بذلك." },
  ],
  company: {
    text: "تتولى شركة {company} تشغيل {brand}.",
  },
  helpful: {
    title: "هل تبحث عن إجابة سريعة؟",
    faq: "اطّلع على الأسئلة الشائعة",
    howItWorks: "كيف يعمل الاختبار",
    privacy: "سياسة الخصوصية",
  },
  form: {
    title: "أرسل إلينا رسالة",
    subtitle: "جميع الحقول مطلوبة.",
    labels: {
      name: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      subject: "الموضوع",
      message: "الرسالة",
    },
    placeholders: {
      name: "محمد أحمد",
      email: "you@example.com",
      phone: "600 000000",
      subject: "اختر موضوعًا",
      message: "كيف يمكننا مساعدتك؟",
    },
    subjects: {
      "General enquiry": "استفسار عام",
      "Cooperation / Partnership": "تعاون / شراكة",
      Support: "الدعم الفني",
      "Press / Media": "الصحافة / الإعلام",
      Advertising: "الإعلانات",
      Feedback: "ملاحظات",
      Other: "أخرى",
    },
    detecting: "جارٍ تحديد بلدك…",
    selectCountry: "اختر البلد",
    searchCountry: "ابحث عن بلد أو رمز الاتصال",
    noCountries: "لم يتم العثور على أي بلد",
    international: "دولي",
    errors: {
      name: "يُرجى إدخال اسمك الكامل.",
      email: "يُرجى إدخال عنوان بريد إلكتروني صالح.",
      phone: "يُرجى إدخال رقم هاتف صالح للبلد المحدد.",
      subject: "يُرجى اختيار موضوع.",
      message: "يجب ألا تقل رسالتك عن 10 أحرف.",
      captcha: "يُرجى إكمال اختبار التحقق (captcha).",
      captchaFailed: "فشل التحقق من الـ captcha. يُرجى المحاولة مرة أخرى.",
      required: "يُرجى ملء جميع الحقول المطلوبة.",
      sendFailed: "تعذّر إرسال رسالتك. يُرجى المحاولة مرة أخرى.",
      network: "خطأ في الشبكة. يُرجى المحاولة مرة أخرى.",
    },
    sending: "جارٍ الإرسال…",
    send: "إرسال الرسالة",
    privacyNote: "نستخدم بياناتك فقط للرد على رسالتك. راجع [سياسة الخصوصية](/privacy).",
    sentTitle: "تم إرسال الرسالة",
    sentText: "شكرًا لك يا {name}! سنرد عليك عبر البريد الإلكتروني قريبًا.",
    sentFallbackName: "صديقنا",
    sendAnother: "إرسال رسالة أخرى",
    captchaNotConfigured: "لم يتم إعداد الـ captcha بعد (اضبطه من Admin ← Settings).",
  },
};

const ru: ContactMessages = {
  meta: {
    title: "Связаться с нами",
    description:
      "Свяжитесь с TestSpeedInternet (оператор — ZONEPAY LTD): поддержка, отзывы, партнёрство, реклама или запросы СМИ — через форму обратной связи или по e-mail.",
  },
  hero: {
    badge: "Контакты",
    titleA: "Свяжитесь",
    titleB: "с нами",
    lead: "Мы будем рады вашему сообщению. Напишите нам, и мы ответим по электронной почте как можно скорее.",
  },
  channels: [
    { title: "Общие вопросы", text: "Вопросы, отзывы или идеи для сотрудничества: мы читаем каждое сообщение." },
    { title: "Поддержка", text: "Возникли проблемы с тестом скорости или другим инструментом? Сообщите нам." },
  ],
  company: {
    text: "Оператор сервиса {brand} — компания {company}.",
  },
  helpful: {
    title: "Нужен быстрый ответ?",
    faq: "Читать FAQ",
    howItWorks: "Как работает тест",
    privacy: "Политика конфиденциальности",
  },
  form: {
    title: "Напишите нам",
    subtitle: "Все поля обязательны для заполнения.",
    labels: {
      name: "Полное имя",
      email: "Электронная почта",
      phone: "Номер телефона",
      subject: "Тема",
      message: "Сообщение",
    },
    placeholders: {
      name: "Иван Иванов",
      email: "you@example.com",
      phone: "600 000000",
      subject: "Выберите тему",
      message: "Чем мы можем помочь?",
    },
    subjects: {
      "General enquiry": "Общий вопрос",
      "Cooperation / Partnership": "Сотрудничество / Партнёрство",
      Support: "Поддержка",
      "Press / Media": "Пресса / СМИ",
      Advertising: "Реклама",
      Feedback: "Отзыв",
      Other: "Другое",
    },
    detecting: "Определяем вашу страну…",
    selectCountry: "Выберите страну",
    searchCountry: "Поиск страны или кода",
    noCountries: "Страны не найдены",
    international: "Международный",
    errors: {
      name: "Пожалуйста, укажите полное имя.",
      email: "Пожалуйста, укажите корректный адрес электронной почты.",
      phone: "Пожалуйста, укажите корректный номер телефона для выбранной страны.",
      subject: "Пожалуйста, выберите тему.",
      message: "Сообщение должно содержать не менее 10 символов.",
      captcha: "Пожалуйста, пройдите проверку captcha.",
      captchaFailed: "Проверка captcha не пройдена. Попробуйте ещё раз.",
      required: "Пожалуйста, заполните все обязательные поля.",
      sendFailed: "Не удалось отправить сообщение. Попробуйте ещё раз.",
      network: "Ошибка сети. Попробуйте ещё раз.",
    },
    sending: "Отправка…",
    send: "Отправить сообщение",
    privacyNote:
      "Мы используем ваши данные только для ответа на сообщение. Подробнее — в нашей [Политике конфиденциальности](/privacy).",
    sentTitle: "Сообщение отправлено",
    sentText: "Спасибо, {name}! Мы скоро ответим вам по электронной почте.",
    sentFallbackName: "друг",
    sendAnother: "Отправить ещё одно сообщение",
    captchaNotConfigured: "Captcha ещё не настроена (задайте её в Admin → Settings).",
  },
};

export const contactMessages: Record<Locale, ContactMessages> = { en, fr, es, ar, ru };
