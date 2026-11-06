import type { Locale } from "../config";

// FAQ page. Answers are plain text (they are also used in FAQPage JSON-LD).
const en = {
  meta: {
    title: "Speed Test FAQ: Your Questions Answered",
    description:
      "Answers to common questions about internet speed tests: download and upload speed, ping, jitter, accuracy and how to get faster internet at home.",
    keywords: [
      "internet speed test faq",
      "speed test questions",
      "what is a good internet speed",
      "why is my internet slow",
      "download upload ping explained",
    ],
  },
  hero: {
    badge: "Help center",
    titleA: "Frequently asked",
    titleB: "questions",
    lead: "Everything you need to know about testing your internet speed and understanding your results.",
  },
  topics: "Topics",
  groups: [
    {
      id: "using-the-test",
      heading: "Using the speed test",
      faqs: [
        {
          q: "How do I test my internet speed?",
          a: "Open the homepage and press the GO button. The test measures your download speed, upload speed, ping and jitter in a few seconds. No app or signup is required.",
        },
        {
          q: "Is the speed test free?",
          a: "Yes, completely free. You can run as many tests as you like on any device, with no account and no app download.",
        },
        {
          q: "How accurate is the test?",
          a: "We measure against global Cloudflare servers using several parallel connections, the same method professional tools use. For the most accurate result, test on a wired connection with other devices idle.",
        },
        {
          q: "Does it work on mobile?",
          a: "Yes. The test is fully responsive and works in any modern browser on phones, tablets, laptops and desktops.",
        },
      ],
    },
    {
      id: "understanding-results",
      heading: "Understanding your results",
      faqs: [
        {
          q: "What do download and upload speed mean?",
          a: "Download speed is how fast you receive data (streaming, browsing). Upload speed is how fast you send data (video calls, backups). Both are measured in megabits per second (Mbps).",
        },
        {
          q: "What are ping and jitter?",
          a: "Ping (latency) is your connection's response time in milliseconds; lower is better. Jitter is how much that response time varies, which affects gaming and video calls.",
        },
        {
          q: "What is a good internet speed?",
          a: "For most homes 25–100 Mbps is good. Light browsing needs only 5–10 Mbps, while 4K streaming, gaming and busy households benefit from 100 Mbps or more.",
        },
      ],
    },
    {
      id: "fixing-slow-internet",
      heading: "Fixing slow internet",
      faqs: [
        {
          q: "Why is my speed slower than my plan?",
          a: "WiFi interference, distance from the router, old hardware, VPNs, background downloads and peak-hour congestion can all lower your measured speed. A wired connection usually gives the best result.",
        },
        {
          q: "How can I make my internet faster?",
          a: "Restart your router, move closer to it or use the 5 GHz WiFi band, switch to a wired connection, close bandwidth-heavy apps, and contact your ISP if speeds stay far below your plan.",
        },
      ],
    },
  ],
  more: {
    title: "Still have a question?",
    text: "Learn how the test measures your connection, or send us a message and we'll get back to you.",
    howItWorks: "How it works",
    contact: "Contact us",
  },
  cta: {
    title: "Still curious about your connection?",
    button: "Run a free speed test",
  },
};

export type FaqMessages = typeof en;

const fr: FaqMessages = {
  meta: {
    title: "FAQ test de débit : vos questions, nos réponses",
    description:
      "Réponses aux questions fréquentes sur le test de débit Internet : débit descendant et montant, ping, gigue, fiabilité et conseils pour accélérer votre connexion.",
    keywords: [
      "faq test de débit",
      "questions test de vitesse internet",
      "quel est un bon débit internet",
      "pourquoi ma connexion est lente",
      "débit descendant montant ping expliqué",
    ],
  },
  hero: {
    badge: "Centre d'aide",
    titleA: "Questions",
    titleB: "fréquentes",
    lead: "Tout ce que vous devez savoir pour tester votre débit Internet et comprendre vos résultats.",
  },
  topics: "Thèmes",
  groups: [
    {
      id: "using-the-test",
      heading: "Utiliser le test de débit",
      faqs: [
        {
          q: "Comment tester mon débit Internet ?",
          a: "Ouvrez la page d'accueil et appuyez sur le bouton GO. Le test mesure votre débit descendant, votre débit montant, votre ping et votre gigue en quelques secondes. Aucune application ni inscription n'est nécessaire.",
        },
        {
          q: "Le test de débit est-il gratuit ?",
          a: "Oui, entièrement gratuit. Vous pouvez lancer autant de tests que vous le souhaitez, sur n'importe quel appareil, sans compte ni application à télécharger.",
        },
        {
          q: "Le test est-il fiable ?",
          a: "Nous mesurons votre connexion avec les serveurs mondiaux de Cloudflare en utilisant plusieurs connexions parallèles, la même méthode que les outils professionnels. Pour un résultat le plus précis possible, testez en filaire avec les autres appareils inactifs.",
        },
        {
          q: "Le test fonctionne-t-il sur mobile ?",
          a: "Oui. Le test est entièrement responsive et fonctionne dans tout navigateur récent sur smartphone, tablette, ordinateur portable ou de bureau.",
        },
      ],
    },
    {
      id: "understanding-results",
      heading: "Comprendre vos résultats",
      faqs: [
        {
          q: "Que signifient débit descendant et débit montant ?",
          a: "Le débit descendant correspond à la vitesse à laquelle vous recevez des données (streaming, navigation). Le débit montant correspond à la vitesse à laquelle vous envoyez des données (appels vidéo, sauvegardes). Tous deux se mesurent en mégabits par seconde (Mbps).",
        },
        {
          q: "Que sont le ping et la gigue ?",
          a: "Le ping (latence) est le temps de réponse de votre connexion, en millisecondes : plus il est bas, mieux c'est. La gigue (jitter) indique à quel point ce temps de réponse varie, ce qui affecte les jeux en ligne et les appels vidéo.",
        },
        {
          q: "Qu'est-ce qu'un bon débit Internet ?",
          a: "Pour la plupart des foyers, 25 à 100 Mbps constituent un bon débit. Une navigation légère ne demande que 5 à 10 Mbps, tandis que le streaming 4K, le jeu en ligne et les foyers très connectés profitent de 100 Mbps ou plus.",
        },
      ],
    },
    {
      id: "fixing-slow-internet",
      heading: "Résoudre une connexion lente",
      faqs: [
        {
          q: "Pourquoi mon débit est-il inférieur à celui de mon abonnement ?",
          a: "Les interférences WiFi, la distance par rapport au routeur, un matériel ancien, les VPN, les téléchargements en arrière-plan et la saturation aux heures de pointe peuvent tous réduire le débit mesuré. Une connexion filaire donne généralement le meilleur résultat.",
        },
        {
          q: "Comment accélérer ma connexion Internet ?",
          a: "Redémarrez votre routeur, rapprochez-vous-en ou utilisez la bande WiFi 5 GHz, passez à une connexion filaire, fermez les applications gourmandes en bande passante et contactez votre fournisseur d'accès si le débit reste bien inférieur à votre abonnement.",
        },
      ],
    },
  ],
  more: {
    title: "Vous avez encore une question ?",
    text: "Découvrez comment le test mesure votre connexion, ou envoyez-nous un message et nous vous répondrons.",
    howItWorks: "Fonctionnement",
    contact: "Nous contacter",
  },
  cta: {
    title: "Envie d'en savoir plus sur votre connexion ?",
    button: "Lancer un test de débit gratuit",
  },
};

const es: FaqMessages = {
  meta: {
    title: "Preguntas frecuentes del test de velocidad",
    description:
      "Respuestas a las dudas más comunes sobre el test de velocidad de internet: descarga, subida, ping, jitter, precisión y cómo conseguir un internet más rápido en casa.",
    keywords: [
      "preguntas frecuentes test de velocidad",
      "dudas test de velocidad de internet",
      "qué es una buena velocidad de internet",
      "por qué mi internet va lento",
      "descarga subida ping explicado",
    ],
  },
  hero: {
    badge: "Centro de ayuda",
    titleA: "Preguntas",
    titleB: "frecuentes",
    lead: "Todo lo que necesitas saber para medir tu velocidad de internet y entender tus resultados.",
  },
  topics: "Temas",
  groups: [
    {
      id: "using-the-test",
      heading: "Usar el test de velocidad",
      faqs: [
        {
          q: "¿Cómo mido mi velocidad de internet?",
          a: "Abre la página de inicio y pulsa el botón GO. El test mide tu velocidad de descarga, tu velocidad de subida, el ping y el jitter en pocos segundos. No necesitas aplicación ni registro.",
        },
        {
          q: "¿El test de velocidad es gratis?",
          a: "Sí, completamente gratis. Puedes hacer todos los tests que quieras en cualquier dispositivo, sin cuenta y sin descargar ninguna aplicación.",
        },
        {
          q: "¿Qué tan preciso es el test?",
          a: "Medimos con los servidores globales de Cloudflare usando varias conexiones paralelas, el mismo método que emplean las herramientas profesionales. Para obtener el resultado más preciso, haz el test con conexión por cable y con los demás dispositivos inactivos.",
        },
        {
          q: "¿Funciona en el móvil?",
          a: "Sí. El test es totalmente adaptable y funciona en cualquier navegador moderno en teléfonos, tabletas, portátiles y ordenadores de escritorio.",
        },
      ],
    },
    {
      id: "understanding-results",
      heading: "Entender tus resultados",
      faqs: [
        {
          q: "¿Qué significan la velocidad de descarga y de subida?",
          a: "La velocidad de descarga indica lo rápido que recibes datos (streaming, navegación). La velocidad de subida indica lo rápido que envías datos (videollamadas, copias de seguridad). Ambas se miden en megabits por segundo (Mbps).",
        },
        {
          q: "¿Qué son el ping y el jitter?",
          a: "El ping (latencia) es el tiempo de respuesta de tu conexión en milisegundos; cuanto más bajo, mejor. El jitter es cuánto varía ese tiempo de respuesta, algo que afecta a los videojuegos y a las videollamadas.",
        },
        {
          q: "¿Qué es una buena velocidad de internet?",
          a: "Para la mayoría de los hogares, entre 25 y 100 Mbps es una buena velocidad. La navegación ligera solo necesita entre 5 y 10 Mbps, mientras que el streaming en 4K, los videojuegos y los hogares con muchos usuarios se benefician de 100 Mbps o más.",
        },
      ],
    },
    {
      id: "fixing-slow-internet",
      heading: "Solucionar un internet lento",
      faqs: [
        {
          q: "¿Por qué mi velocidad es menor que la de mi plan?",
          a: "Las interferencias del WiFi, la distancia al router, el hardware antiguo, las VPN, las descargas en segundo plano y la congestión en horas punta pueden reducir la velocidad medida. Una conexión por cable suele dar el mejor resultado.",
        },
        {
          q: "¿Cómo puedo hacer que mi internet sea más rápido?",
          a: "Reinicia el router, acércate a él o usa la banda WiFi de 5 GHz, cámbiate a una conexión por cable, cierra las aplicaciones que consumen mucho ancho de banda y contacta con tu proveedor si la velocidad sigue muy por debajo de tu plan.",
        },
      ],
    },
  ],
  more: {
    title: "¿Todavía tienes alguna pregunta?",
    text: "Descubre cómo mide el test tu conexión o envíanos un mensaje y te responderemos.",
    howItWorks: "Cómo funciona",
    contact: "Contáctanos",
  },
  cta: {
    title: "¿Quieres saber más sobre tu conexión?",
    button: "Hacer un test de velocidad gratis",
  },
};

const ar: FaqMessages = {
  meta: {
    title: "الأسئلة الشائعة حول اختبار سرعة الإنترنت",
    description:
      "إجابات عن الأسئلة الشائعة حول اختبار سرعة الإنترنت: سرعة التنزيل والرفع وزمن الاستجابة والتذبذب ودقة القياس، وكيفية الحصول على إنترنت أسرع في المنزل.",
    keywords: [
      "أسئلة شائعة اختبار سرعة الإنترنت",
      "أسئلة حول قياس سرعة النت",
      "ما هي سرعة الإنترنت الجيدة",
      "لماذا الإنترنت بطيء",
      "شرح سرعة التنزيل والرفع والبينغ",
    ],
  },
  hero: {
    badge: "مركز المساعدة",
    titleA: "الأسئلة",
    titleB: "الشائعة",
    lead: "كل ما تحتاج إلى معرفته لاختبار سرعة الإنترنت لديك وفهم نتائجك.",
  },
  topics: "المواضيع",
  groups: [
    {
      id: "using-the-test",
      heading: "استخدام اختبار السرعة",
      faqs: [
        {
          q: "كيف أختبر سرعة الإنترنت لديّ؟",
          a: "افتح الصفحة الرئيسية واضغط على زر GO. يقيس الاختبار سرعة التنزيل وسرعة الرفع وزمن الاستجابة (Ping) والتذبذب (Jitter) خلال ثوانٍ، دون الحاجة إلى تطبيق أو تسجيل.",
        },
        {
          q: "هل اختبار السرعة مجاني؟",
          a: "نعم، مجاني تمامًا. يمكنك إجراء أي عدد من الاختبارات على أي جهاز، دون حساب ودون تنزيل أي تطبيق.",
        },
        {
          q: "ما مدى دقة الاختبار؟",
          a: "نقيس الاتصال عبر خوادم Cloudflare المنتشرة حول العالم باستخدام عدة اتصالات متوازية، وهي الطريقة نفسها التي تعتمدها الأدوات الاحترافية. للحصول على أدق نتيجة، أجرِ الاختبار عبر اتصال سلكي مع إيقاف نشاط الأجهزة الأخرى.",
        },
        {
          q: "هل يعمل الاختبار على الهاتف المحمول؟",
          a: "نعم. الاختبار متجاوب بالكامل ويعمل في أي متصفح حديث على الهواتف والأجهزة اللوحية والحواسيب المحمولة والمكتبية.",
        },
      ],
    },
    {
      id: "understanding-results",
      heading: "فهم نتائجك",
      faqs: [
        {
          q: "ماذا تعني سرعة التنزيل وسرعة الرفع؟",
          a: "سرعة التنزيل هي مدى سرعة استقبالك للبيانات (البث والتصفح)، وسرعة الرفع هي مدى سرعة إرسالك للبيانات (مكالمات الفيديو والنسخ الاحتياطي). وتُقاس كلتاهما بالميغابت في الثانية (Mbps).",
        },
        {
          q: "ما هما زمن الاستجابة (Ping) والتذبذب (Jitter)؟",
          a: "زمن الاستجابة (Ping) هو الوقت الذي يستغرقه اتصالك للاستجابة بالمللي ثانية، وكلما انخفض كان أفضل. أما التذبذب (Jitter) فهو مقدار تغيّر زمن الاستجابة هذا، وهو يؤثر في الألعاب ومكالمات الفيديو.",
        },
        {
          q: "ما هي سرعة الإنترنت الجيدة؟",
          a: "بالنسبة إلى معظم المنازل، تُعدّ سرعة 25–100 Mbps جيدة. يحتاج التصفح الخفيف إلى 5–10 Mbps فقط، بينما يستفيد البث بدقة 4K والألعاب والمنازل كثيرة الاستخدام من 100 Mbps أو أكثر.",
        },
      ],
    },
    {
      id: "fixing-slow-internet",
      heading: "إصلاح بطء الإنترنت",
      faqs: [
        {
          q: "لماذا سرعتي أقل من سرعة باقتي؟",
          a: "قد تؤدي تداخلات WiFi، والبعد عن الراوتر، والأجهزة القديمة، وشبكات VPN، والتنزيلات في الخلفية، والازدحام في أوقات الذروة إلى خفض السرعة المقيسة. وعادةً ما يمنح الاتصال السلكي أفضل نتيجة.",
        },
        {
          q: "كيف أجعل الإنترنت لديّ أسرع؟",
          a: "أعد تشغيل الراوتر، واقترب منه أو استخدم نطاق WiFi بتردد 5 GHz، وانتقل إلى اتصال سلكي، وأغلق التطبيقات التي تستهلك عرض نطاق كبيرًا، وتواصل مع مزوّد خدمة الإنترنت إذا بقيت السرعة أقل بكثير من باقتك.",
        },
      ],
    },
  ],
  more: {
    title: "هل لا يزال لديك سؤال؟",
    text: "تعرّف على طريقة قياس الاختبار لاتصالك، أو أرسل إلينا رسالة وسنردّ عليك.",
    howItWorks: "كيف يعمل",
    contact: "اتصل بنا",
  },
  cta: {
    title: "هل تريد معرفة المزيد عن اتصالك؟",
    button: "أجرِ اختبار سرعة مجانيًا",
  },
};

const ru: FaqMessages = {
  meta: {
    title: "FAQ: вопросы о тесте скорости интернета",
    description:
      "Ответы на частые вопросы о тесте скорости интернета: скорость загрузки и отдачи, пинг, джиттер, точность измерений и как ускорить домашний интернет.",
    keywords: [
      "тест скорости интернета вопросы",
      "частые вопросы проверка скорости",
      "какая скорость интернета считается хорошей",
      "почему медленный интернет",
      "загрузка отдача пинг что это",
    ],
  },
  hero: {
    badge: "Центр помощи",
    titleA: "Часто задаваемые",
    titleB: "вопросы",
    lead: "Всё, что нужно знать о проверке скорости интернета и о том, как понимать результаты.",
  },
  topics: "Темы",
  groups: [
    {
      id: "using-the-test",
      heading: "Как пользоваться тестом",
      faqs: [
        {
          q: "Как проверить скорость интернета?",
          a: "Откройте главную страницу и нажмите кнопку GO. За несколько секунд тест измерит скорость загрузки, скорость отдачи, пинг и джиттер. Не нужны ни приложение, ни регистрация.",
        },
        {
          q: "Тест скорости бесплатный?",
          a: "Да, полностью бесплатный. Можно проводить сколько угодно тестов на любом устройстве — без учётной записи и без установки приложений.",
        },
        {
          q: "Насколько точен тест?",
          a: "Мы измеряем скорость через глобальную сеть серверов Cloudflare с использованием нескольких параллельных соединений — тем же методом, что и профессиональные инструменты. Для максимально точного результата подключитесь по кабелю, а другие устройства оставьте без нагрузки.",
        },
        {
          q: "Работает ли тест на смартфоне?",
          a: "Да. Тест полностью адаптивен и работает в любом современном браузере на смартфонах, планшетах, ноутбуках и настольных компьютерах.",
        },
      ],
    },
    {
      id: "understanding-results",
      heading: "Как понимать результаты",
      faqs: [
        {
          q: "Что означают скорость загрузки и скорость отдачи?",
          a: "Скорость загрузки показывает, как быстро вы получаете данные (стриминг, просмотр сайтов). Скорость отдачи показывает, как быстро вы отправляете данные (видеозвонки, резервное копирование). Обе измеряются в мегабитах в секунду (Мбит/с).",
        },
        {
          q: "Что такое пинг и джиттер?",
          a: "Пинг (задержка) — это время отклика соединения в миллисекундах (мс); чем меньше, тем лучше. Джиттер показывает, насколько это время отклика колеблется, что влияет на онлайн-игры и видеозвонки.",
        },
        {
          q: "Какая скорость интернета считается хорошей?",
          a: "Для большинства домохозяйств хорошей считается скорость 25–100 Мбит/с. Для простого просмотра сайтов достаточно 5–10 Мбит/с, а для стриминга в 4K, игр и семей с большим числом устройств лучше 100 Мбит/с и выше.",
        },
      ],
    },
    {
      id: "fixing-slow-internet",
      heading: "Если интернет медленный",
      faqs: [
        {
          q: "Почему скорость ниже, чем в моём тарифе?",
          a: "Помехи WiFi, удалённость от роутера, устаревшее оборудование, VPN, фоновые загрузки и перегрузка сети в часы пик — всё это может снижать измеренную скорость. Наилучший результат обычно даёт кабельное подключение.",
        },
        {
          q: "Как ускорить интернет?",
          a: "Перезагрузите роутер, расположитесь ближе к нему или используйте диапазон WiFi 5 ГГц, подключитесь по кабелю, закройте приложения, активно расходующие трафик, и обратитесь к провайдеру, если скорость остаётся намного ниже заявленной в тарифе.",
        },
      ],
    },
  ],
  more: {
    title: "Остались вопросы?",
    text: "Узнайте, как тест измеряет ваше соединение, или напишите нам — мы ответим.",
    howItWorks: "Как это работает",
    contact: "Связаться с нами",
  },
  cta: {
    title: "Хотите узнать больше о своём соединении?",
    button: "Пройти бесплатный тест скорости",
  },
};

export const faqMessages: Record<Locale, FaqMessages> = { en, fr, es, ar, ru };
