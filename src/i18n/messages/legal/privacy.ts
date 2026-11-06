import type { Locale } from "../../config";
import type { LegalDoc } from "../legal";

const en: LegalDoc = {
  meta: {
    title: "Privacy Policy",
    description:
      "How TestSpeedInternet, operated by ZONEPAY LTD, handles your data when you run an internet speed test or use our IP tools, including cookies and Google AdSense.",
  },
  badge: "Legal",
  title: "Privacy Policy",
  intro:
    "This Privacy Policy explains how {brand}, operated by {company}, handles information when you use our website and tools.",
  sections: [
    {
      id: "who-we-are",
      heading: "Who we are",
      body: [
        '{brand} ("we", "us") is a free internet speed test and IP information service operated by {company}. You can reach us at {email}.',
      ],
    },
    {
      id: "information-we-process",
      heading: "Information we process",
      body: [
        "When you run a speed test or use our IP tools, we process your public IP address and technical data such as approximate location (city and country), your internet service provider (ISP), connection type and browser information.",
        "We use this data only to display your results and to power features like location, provider and IP reputation. We do not ask for your name, and we do not sell your personal data.",
      ],
    },
    {
      id: "third-party-services",
      heading: "Third-party services",
      body: [
        "To provide the service we rely on trusted third parties:",
        {
          list: [
            "Cloudflare (speed-test data servers)",
            "ip-api.com (IP geolocation)",
            "proxycheck.io (IP reputation)",
            "Logo.dev (provider logos)",
            "flagcdn.com (country flags)",
            "OpenStreetMap (maps)",
          ],
        },
        "When a feature loads, your IP may be shared with the relevant provider to return a result.",
      ],
    },
    {
      id: "advertising",
      heading: "Advertising (Google AdSense)",
      body: [
        "We may display ads through Google AdSense and other partners. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this and other websites. Google's use of advertising cookies enables it and its partners to serve ads based on your visits.",
        "You can opt out of personalized advertising by visiting [Google Ads Settings](https://adssettings.google.com), and you can manage cookies through your browser. In regions where it is required (such as the EEA and UK), we ask for your consent before non-essential and advertising cookies are used.",
      ],
    },
    {
      id: "cookies-and-analytics",
      heading: "Cookies and analytics",
      body: [
        "We use a small number of cookies for essential functionality, optional analytics (such as Google Analytics) and, where enabled, advertising. Analytics help us understand aggregate, anonymous usage so we can improve the service. You can clear or block cookies in your browser at any time.",
        "Our [Cookie Policy](/cookies) lists the cookies we use and how to control them.",
      ],
    },
    {
      id: "data-retention",
      heading: "Data retention",
      body: [
        "Speed test measurements run in your browser and are shown to you in real time. We do not build a personal profile from your individual test results or IP address.",
      ],
    },
    {
      id: "your-rights",
      heading: "Your rights",
      body: [
        "Depending on where you live, you may have rights to access, correct or delete personal data we hold about you. To make a request, email {email} and we will respond in line with applicable law.",
      ],
    },
    {
      id: "childrens-privacy",
      heading: "Children's privacy",
      body: [
        "Our service is intended for a general audience and is not directed at children under 13. We do not knowingly collect personal data from children.",
      ],
    },
    {
      id: "changes",
      heading: "Changes to this policy",
      body: [
        'We may update this Privacy Policy from time to time. Material changes will be reflected by the "Last updated" date at the top of this page.',
      ],
    },
    {
      id: "contact",
      heading: "Contact",
      body: [
        "For any privacy question, contact {company} at {email} or use our [contact page](/contact).",
      ],
    },
  ],
};

const fr: LegalDoc = {
  meta: {
    title: "Politique de confidentialité",
    description:
      "Comment TestSpeedInternet, exploité par ZONEPAY LTD, traite vos données lors d'un test de débit Internet ou de l'utilisation de nos outils IP, cookies et Google AdSense inclus.",
  },
  badge: "Mentions légales",
  title: "Politique de confidentialité",
  intro:
    "La présente Politique de confidentialité explique comment {brand}, exploité par {company}, traite les informations lorsque vous utilisez notre site web et nos outils.",
  sections: [
    {
      id: "who-we-are",
      heading: "Qui sommes-nous",
      body: [
        "{brand} (« nous ») est un service gratuit de test de vitesse Internet et d'informations sur les adresses IP exploité par {company}. Vous pouvez nous contacter à l'adresse {email}.",
      ],
    },
    {
      id: "information-we-process",
      heading: "Informations que nous traitons",
      body: [
        "Lorsque vous lancez un test de vitesse ou utilisez nos outils IP, nous traitons votre adresse IP publique ainsi que des données techniques telles que votre localisation approximative (ville et pays), votre fournisseur d'accès à Internet (FAI), votre type de connexion et des informations sur votre navigateur.",
        "Nous utilisons ces données uniquement pour afficher vos résultats et faire fonctionner des fonctionnalités comme la localisation, l'identification du fournisseur et la réputation IP. Nous ne vous demandons pas votre nom et nous ne vendons pas vos données personnelles.",
      ],
    },
    {
      id: "third-party-services",
      heading: "Services tiers",
      body: [
        "Pour fournir le service, nous faisons appel à des prestataires tiers de confiance :",
        {
          list: [
            "Cloudflare (serveurs de données pour le test de vitesse)",
            "ip-api.com (géolocalisation IP)",
            "proxycheck.io (réputation IP)",
            "Logo.dev (logos des fournisseurs)",
            "flagcdn.com (drapeaux des pays)",
            "OpenStreetMap (cartes)",
          ],
        },
        "Lorsqu'une fonctionnalité se charge, votre adresse IP peut être transmise au prestataire concerné afin d'obtenir un résultat.",
      ],
    },
    {
      id: "advertising",
      heading: "Publicité (Google AdSense)",
      body: [
        "Nous pouvons afficher des annonces par l'intermédiaire de Google AdSense et d'autres partenaires. Des fournisseurs tiers, dont Google, utilisent des cookies pour diffuser des annonces en fonction de vos visites antérieures sur ce site et sur d'autres sites web. L'utilisation de cookies publicitaires par Google lui permet, ainsi qu'à ses partenaires, de diffuser des annonces en fonction de vos visites.",
        "Vous pouvez désactiver la publicité personnalisée dans les [Paramètres des annonces Google](https://adssettings.google.com) et gérer les cookies depuis votre navigateur. Dans les régions où cela est obligatoire (comme l'EEE et le Royaume-Uni), nous vous demandons votre consentement avant d'utiliser des cookies non essentiels et publicitaires.",
      ],
    },
    {
      id: "cookies-and-analytics",
      heading: "Cookies et mesure d'audience",
      body: [
        "Nous utilisons un petit nombre de cookies pour les fonctionnalités essentielles, pour une mesure d'audience facultative (comme Google Analytics) et, lorsqu'elle est activée, pour la publicité. La mesure d'audience nous aide à comprendre l'utilisation globale et anonyme du service afin de l'améliorer. Vous pouvez effacer ou bloquer les cookies dans votre navigateur à tout moment.",
        "Notre [Politique relative aux cookies](/cookies) répertorie les cookies que nous utilisons et explique comment les contrôler.",
      ],
    },
    {
      id: "data-retention",
      heading: "Conservation des données",
      body: [
        "Les mesures du test de vitesse sont effectuées dans votre navigateur et vous sont présentées en temps réel. Nous ne constituons pas de profil personnel à partir de vos résultats de test individuels ou de votre adresse IP.",
      ],
    },
    {
      id: "your-rights",
      heading: "Vos droits",
      body: [
        "Selon votre lieu de résidence, vous pouvez disposer de droits d'accès, de rectification ou de suppression des données personnelles que nous détenons à votre sujet. Pour exercer une demande, écrivez à {email} et nous vous répondrons conformément à la législation applicable.",
      ],
    },
    {
      id: "childrens-privacy",
      heading: "Protection de la vie privée des enfants",
      body: [
        "Notre service s'adresse au grand public et ne vise pas les enfants de moins de 13 ans. Nous ne collectons pas sciemment de données personnelles concernant des enfants.",
      ],
    },
    {
      id: "changes",
      heading: "Modifications de la présente politique",
      body: [
        "Nous pouvons mettre à jour la présente Politique de confidentialité de temps à autre. Les modifications importantes seront signalées par la date de « Dernière mise à jour » indiquée en haut de cette page.",
      ],
    },
    {
      id: "contact",
      heading: "Contact",
      body: [
        "Pour toute question relative à la confidentialité, contactez {company} à l'adresse {email} ou utilisez notre [page de contact](/contact).",
      ],
    },
  ],
};

const es: LegalDoc = {
  meta: {
    title: "Política de privacidad",
    description:
      "Cómo TestSpeedInternet, operado por ZONEPAY LTD, trata tus datos al hacer un test de velocidad de internet o usar nuestras herramientas IP, incluidas cookies y AdSense.",
  },
  badge: "Legal",
  title: "Política de privacidad",
  intro:
    "Esta Política de privacidad explica cómo {brand}, operado por {company}, trata la información cuando utilizas nuestro sitio web y nuestras herramientas.",
  sections: [
    {
      id: "who-we-are",
      heading: "Quiénes somos",
      body: [
        "{brand} («nosotros») es un servicio gratuito de test de velocidad de internet e información sobre direcciones IP operado por {company}. Puedes contactarnos en {email}.",
      ],
    },
    {
      id: "information-we-process",
      heading: "Información que tratamos",
      body: [
        "Cuando realizas un test de velocidad o utilizas nuestras herramientas IP, tratamos tu dirección IP pública y datos técnicos como tu ubicación aproximada (ciudad y país), tu proveedor de servicios de internet (ISP), el tipo de conexión y la información del navegador.",
        "Utilizamos estos datos únicamente para mostrar tus resultados y hacer funcionar funciones como la ubicación, el proveedor y la reputación de la IP. No te pedimos tu nombre y no vendemos tus datos personales.",
      ],
    },
    {
      id: "third-party-services",
      heading: "Servicios de terceros",
      body: [
        "Para prestar el servicio recurrimos a terceros de confianza:",
        {
          list: [
            "Cloudflare (servidores de datos del test de velocidad)",
            "ip-api.com (geolocalización IP)",
            "proxycheck.io (reputación de IP)",
            "Logo.dev (logotipos de proveedores)",
            "flagcdn.com (banderas de países)",
            "OpenStreetMap (mapas)",
          ],
        },
        "Cuando se carga una función, tu IP puede compartirse con el proveedor correspondiente para obtener un resultado.",
      ],
    },
    {
      id: "advertising",
      heading: "Publicidad (Google AdSense)",
      body: [
        "Podemos mostrar anuncios a través de Google AdSense y otros socios. Los proveedores externos, incluido Google, utilizan cookies para mostrar anuncios basados en tus visitas anteriores a este y otros sitios web. El uso de cookies publicitarias por parte de Google le permite, a él y a sus socios, mostrar anuncios basados en tus visitas.",
        "Puedes desactivar la publicidad personalizada en la [Configuración de anuncios de Google](https://adssettings.google.com) y gestionar las cookies desde tu navegador. En las regiones donde es obligatorio (como el EEE y el Reino Unido), solicitamos tu consentimiento antes de utilizar cookies no esenciales y publicitarias.",
      ],
    },
    {
      id: "cookies-and-analytics",
      heading: "Cookies y analítica",
      body: [
        "Utilizamos un pequeño número de cookies para funciones esenciales, analítica opcional (como Google Analytics) y, cuando está habilitada, publicidad. La analítica nos ayuda a comprender el uso agregado y anónimo para mejorar el servicio. Puedes borrar o bloquear las cookies en tu navegador en cualquier momento.",
        "Nuestra [Política de cookies](/cookies) enumera las cookies que utilizamos y cómo controlarlas.",
      ],
    },
    {
      id: "data-retention",
      heading: "Conservación de datos",
      body: [
        "Las mediciones del test de velocidad se ejecutan en tu navegador y se te muestran en tiempo real. No creamos un perfil personal a partir de tus resultados individuales ni de tu dirección IP.",
      ],
    },
    {
      id: "your-rights",
      heading: "Tus derechos",
      body: [
        "Según el lugar donde vivas, puedes tener derecho a acceder, rectificar o suprimir los datos personales que conservamos sobre ti. Para realizar una solicitud, escribe a {email} y te responderemos conforme a la legislación aplicable.",
      ],
    },
    {
      id: "childrens-privacy",
      heading: "Privacidad de los menores",
      body: [
        "Nuestro servicio está destinado al público general y no está dirigido a menores de 13 años. No recopilamos a sabiendas datos personales de menores.",
      ],
    },
    {
      id: "changes",
      heading: "Cambios en esta política",
      body: [
        "Podemos actualizar esta Política de privacidad periódicamente. Los cambios importantes se reflejarán en la fecha de «Última actualización» que figura en la parte superior de esta página.",
      ],
    },
    {
      id: "contact",
      heading: "Contacto",
      body: [
        "Para cualquier consulta sobre privacidad, contacta con {company} en {email} o utiliza nuestra [página de contacto](/contact).",
      ],
    },
  ],
};

const ar: LegalDoc = {
  meta: {
    title: "سياسة الخصوصية",
    description:
      "كيف يتعامل TestSpeedInternet، الذي تديره شركة ZONEPAY LTD، مع بياناتك عند إجراء اختبار سرعة الإنترنت أو استخدام أدوات IP، بما في ذلك ملفات تعريف الارتباط وGoogle AdSense.",
  },
  badge: "قانوني",
  title: "سياسة الخصوصية",
  intro:
    "توضح سياسة الخصوصية هذه كيف يتعامل {brand}، الذي تديره شركة {company}، مع المعلومات عند استخدامك لموقعنا وأدواتنا.",
  sections: [
    {
      id: "who-we-are",
      heading: "من نحن",
      body: [
        "{brand} (“نحن”) خدمة مجانية لاختبار سرعة الإنترنت وتقديم معلومات عن عناوين IP، تديرها شركة {company}. يمكنك التواصل معنا عبر {email}.",
      ],
    },
    {
      id: "information-we-process",
      heading: "المعلومات التي نعالجها",
      body: [
        "عند إجراء اختبار السرعة أو استخدام أدوات IP لدينا، نعالج عنوان IP العام الخاص بك وبيانات تقنية مثل موقعك التقريبي (المدينة والدولة)، ومزوّد خدمة الإنترنت (ISP)، ونوع الاتصال، ومعلومات المتصفح.",
        "نستخدم هذه البيانات فقط لعرض نتائجك وتشغيل ميزات مثل تحديد الموقع والمزوّد وسمعة عنوان IP. لا نطلب اسمك، ولا نبيع بياناتك الشخصية.",
      ],
    },
    {
      id: "third-party-services",
      heading: "خدمات الأطراف الثالثة",
      body: [
        "لتقديم الخدمة، نعتمد على أطراف ثالثة موثوقة:",
        {
          list: [
            "Cloudflare (خوادم بيانات اختبار السرعة)",
            "ip-api.com (تحديد الموقع الجغرافي لعنوان IP)",
            "proxycheck.io (سمعة عنوان IP)",
            "Logo.dev (شعارات المزوّدين)",
            "flagcdn.com (أعلام الدول)",
            "OpenStreetMap (الخرائط)",
          ],
        },
        "عند تحميل إحدى الميزات، قد تتم مشاركة عنوان IP الخاص بك مع المزوّد المعني للحصول على النتيجة.",
      ],
    },
    {
      id: "advertising",
      heading: "الإعلانات (Google AdSense)",
      body: [
        "قد نعرض إعلانات عبر Google AdSense وشركاء آخرين. يستخدم مورّدو الطرف الثالث، ومنهم Google، ملفات تعريف الارتباط لعرض الإعلانات استنادًا إلى زياراتك السابقة لهذا الموقع ولمواقع أخرى. ويتيح استخدام Google لملفات تعريف الارتباط الإعلانية لها ولشركائها عرض الإعلانات استنادًا إلى زياراتك.",
        "يمكنك إلغاء الاشتراك في الإعلانات المخصّصة من خلال [إعدادات إعلانات Google](https://adssettings.google.com)، كما يمكنك إدارة ملفات تعريف الارتباط من خلال متصفحك. وفي المناطق التي يُشترط فيها ذلك (مثل المنطقة الاقتصادية الأوروبية والمملكة المتحدة)، نطلب موافقتك قبل استخدام ملفات تعريف الارتباط غير الضرورية والإعلانية.",
      ],
    },
    {
      id: "cookies-and-analytics",
      heading: "ملفات تعريف الارتباط والتحليلات",
      body: [
        "نستخدم عددًا قليلًا من ملفات تعريف الارتباط للوظائف الأساسية، وللتحليلات الاختيارية (مثل Google Analytics)، وللإعلانات عند تفعيلها. تساعدنا التحليلات على فهم الاستخدام الإجمالي المجهول الهوية لتحسين الخدمة. يمكنك مسح ملفات تعريف الارتباط أو حظرها في متصفحك في أي وقت.",
        "تسرد [سياسة ملفات تعريف الارتباط](/cookies) الخاصة بنا الملفات التي نستخدمها وكيفية التحكم فيها.",
      ],
    },
    {
      id: "data-retention",
      heading: "الاحتفاظ بالبيانات",
      body: [
        "تُجرى قياسات اختبار السرعة في متصفحك وتُعرض عليك في الوقت الفعلي. ولا ننشئ ملفًا شخصيًا عنك انطلاقًا من نتائج اختباراتك الفردية أو عنوان IP الخاص بك.",
      ],
    },
    {
      id: "your-rights",
      heading: "حقوقك",
      body: [
        "بحسب مكان إقامتك، قد يحق لك الوصول إلى البيانات الشخصية التي نحتفظ بها عنك أو تصحيحها أو حذفها. لتقديم طلب، راسلنا على {email} وسنرد عليك وفقًا للقانون المعمول به.",
      ],
    },
    {
      id: "childrens-privacy",
      heading: "خصوصية الأطفال",
      body: [
        "خدمتنا موجّهة إلى الجمهور العام وليست موجّهة إلى الأطفال دون سن 13 عامًا. ولا نجمع عن قصد أي بيانات شخصية من الأطفال.",
      ],
    },
    {
      id: "changes",
      heading: "التغييرات على هذه السياسة",
      body: [
        "قد نحدّث سياسة الخصوصية هذه من وقت لآخر. وستنعكس التغييرات الجوهرية في تاريخ “آخر تحديث” الظاهر أعلى هذه الصفحة.",
      ],
    },
    {
      id: "contact",
      heading: "التواصل",
      body: [
        "لأي سؤال يتعلق بالخصوصية، تواصل مع شركة {company} عبر {email} أو استخدم [صفحة الاتصال](/contact) الخاصة بنا.",
      ],
    },
  ],
};

const ru: LegalDoc = {
  meta: {
    title: "Политика конфиденциальности",
    description:
      "Как TestSpeedInternet (оператор — ZONEPAY LTD) обрабатывает ваши данные при тесте скорости интернета и использовании IP-инструментов, включая cookie и Google AdSense.",
  },
  badge: "Правовая информация",
  title: "Политика конфиденциальности",
  intro:
    "Настоящая Политика конфиденциальности объясняет, как {brand}, оператором которого является {company}, обрабатывает информацию при использовании вами нашего сайта и инструментов.",
  sections: [
    {
      id: "who-we-are",
      heading: "Кто мы",
      body: [
        "{brand} («мы») — бесплатный сервис для проверки скорости интернета и получения информации об IP-адресах, оператором которого является {company}. Связаться с нами можно по адресу {email}.",
      ],
    },
    {
      id: "information-we-process",
      heading: "Какие данные мы обрабатываем",
      body: [
        "Когда вы запускаете тест скорости или пользуетесь нашими IP-инструментами, мы обрабатываем ваш публичный IP-адрес и технические данные, такие как примерное местоположение (город и страна), ваш интернет-провайдер, тип подключения и сведения о браузере.",
        "Мы используем эти данные только для отображения ваших результатов и работы таких функций, как определение местоположения, провайдера и репутации IP. Мы не запрашиваем ваше имя и не продаём ваши персональные данные.",
      ],
    },
    {
      id: "third-party-services",
      heading: "Сторонние сервисы",
      body: [
        "Для работы сервиса мы пользуемся услугами надёжных третьих сторон:",
        {
          list: [
            "Cloudflare (серверы данных для теста скорости)",
            "ip-api.com (геолокация по IP)",
            "proxycheck.io (репутация IP)",
            "Logo.dev (логотипы провайдеров)",
            "flagcdn.com (флаги стран)",
            "OpenStreetMap (карты)",
          ],
        },
        "При загрузке той или иной функции ваш IP-адрес может передаваться соответствующему поставщику для получения результата.",
      ],
    },
    {
      id: "advertising",
      heading: "Реклама (Google AdSense)",
      body: [
        "Мы можем показывать рекламу через Google AdSense и других партнёров. Сторонние поставщики, в том числе Google, используют файлы cookie для показа рекламы на основе ваших предыдущих посещений этого и других сайтов. Использование рекламных файлов cookie позволяет Google и её партнёрам показывать рекламу на основе ваших посещений.",
        "Вы можете отказаться от персонализированной рекламы в [настройках рекламы Google](https://adssettings.google.com), а также управлять файлами cookie в своём браузере. В регионах, где это требуется (например, в ЕЭЗ и Великобритании), мы запрашиваем ваше согласие перед использованием необязательных и рекламных файлов cookie.",
      ],
    },
    {
      id: "cookies-and-analytics",
      heading: "Файлы cookie и аналитика",
      body: [
        "Мы используем небольшое количество файлов cookie для основных функций, необязательной аналитики (например, Google Analytics) и, если она включена, рекламы. Аналитика помогает нам понимать обобщённое анонимное использование сервиса, чтобы улучшать его. Вы можете в любой момент удалить или заблокировать файлы cookie в браузере.",
        "В нашей [Политике использования файлов cookie](/cookies) перечислены используемые нами файлы cookie и способы управления ими.",
      ],
    },
    {
      id: "data-retention",
      heading: "Хранение данных",
      body: [
        "Измерения теста скорости выполняются в вашем браузере и показываются вам в реальном времени. Мы не создаём персональный профиль на основе ваших отдельных результатов теста или IP-адреса.",
      ],
    },
    {
      id: "your-rights",
      heading: "Ваши права",
      body: [
        "В зависимости от места вашего проживания у вас могут быть права на доступ к хранящимся у нас персональным данным о вас, их исправление или удаление. Чтобы направить запрос, напишите на {email}, и мы ответим в соответствии с применимым законодательством.",
      ],
    },
    {
      id: "childrens-privacy",
      heading: "Конфиденциальность детей",
      body: [
        "Наш сервис предназначен для широкой аудитории и не ориентирован на детей младше 13 лет. Мы сознательно не собираем персональные данные детей.",
      ],
    },
    {
      id: "changes",
      heading: "Изменения настоящей политики",
      body: [
        "Мы можем время от времени обновлять настоящую Политику конфиденциальности. Существенные изменения будут отражены в дате «Последнее обновление» в верхней части этой страницы.",
      ],
    },
    {
      id: "contact",
      heading: "Контакты",
      body: [
        "По любым вопросам конфиденциальности обращайтесь в {company} по адресу {email} или через нашу [страницу контактов](/contact).",
      ],
    },
  ],
};

export const privacyMessages: Record<Locale, LegalDoc> = { en, fr, es, ar, ru };
