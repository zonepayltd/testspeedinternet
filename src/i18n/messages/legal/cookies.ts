import type { Locale } from "../../config";
import type { LegalDoc } from "../legal";

const en: LegalDoc = {
  meta: {
    title: "Cookie Policy",
    description:
      "Which cookies and similar technologies TestSpeedInternet uses, including Google AdSense and Google Analytics, and how you can control or withdraw consent.",
  },
  badge: "Legal",
  title: "Cookie Policy",
  intro:
    "This Cookie Policy explains how {brand}, operated by {company}, uses cookies and similar technologies, and the choices you have.",
  sections: [
    {
      id: "what-cookies-are",
      heading: "What cookies are",
      body: [
        "Cookies are small text files stored on your device by your browser. Similar technologies include local storage and pixels. They let a website remember information such as your preferences, and help measure and fund the service.",
      ],
    },
    {
      id: "essential-storage",
      heading: "Essential storage",
      body: [
        "We store a small number of values in your browser that the site needs to work, for example your cookie consent choice and an anonymous visitor ID used to count visits and prevent abuse. These do not identify you personally.",
      ],
    },
    {
      id: "analytics",
      heading: "Analytics",
      body: [
        "If enabled, we use Google Analytics to understand, in aggregate, how visitors use the site (for example which pages are popular). Google Analytics sets cookies such as _ga. You can opt out with the [Google Analytics opt-out browser add-on](https://tools.google.com/dlpage/gaoptout).",
      ],
    },
    {
      id: "advertising-cookies",
      heading: "Advertising cookies (Google AdSense)",
      body: [
        "We show ads through Google AdSense. Google and its partners use cookies to serve ads based on your prior visits to this and other websites, to limit how often you see an ad and to measure ad performance.",
        'You can opt out of personalized advertising at Google\'s [Ads Settings](https://adssettings.google.com) or at [www.aboutads.info](https://www.aboutads.info). To learn more, see ["How Google uses information from sites or apps that use our services"](https://policies.google.com/technologies/partner-sites).',
        "In the European Economic Area, the UK and Switzerland, we ask for your consent before personalized advertising cookies are used. If you decline, Google may still serve non-personalized ads, which use cookies only for purposes such as frequency capping and fraud prevention.",
      ],
    },
    {
      id: "managing-cookies",
      heading: "Managing cookies",
      body: [
        "You can change or withdraw your choice at any time by clearing this site's data in your browser, which shows the consent banner again. Most browsers also let you block or delete cookies in their settings. Blocking some cookies may affect how the site works.",
        "For more on how we handle data in general, see our [Privacy Policy](/privacy).",
      ],
    },
    {
      id: "contact",
      heading: "Contact",
      body: ["Questions about this policy? Contact us at {email} or through our [contact page](/contact)."],
    },
  ],
};

const fr: LegalDoc = {
  meta: {
    title: "Politique relative aux cookies",
    description:
      "Les cookies et technologies similaires utilisés par TestSpeedInternet, dont Google AdSense et Google Analytics, et comment les contrôler ou retirer votre consentement.",
  },
  badge: "Mentions légales",
  title: "Politique relative aux cookies",
  intro:
    "La présente Politique relative aux cookies explique comment {brand}, exploité par {company}, utilise les cookies et technologies similaires, ainsi que les choix dont vous disposez.",
  sections: [
    {
      id: "what-cookies-are",
      heading: "Qu'est-ce qu'un cookie ?",
      body: [
        "Les cookies sont de petits fichiers texte enregistrés sur votre appareil par votre navigateur. Parmi les technologies similaires figurent le stockage local et les pixels. Ils permettent à un site web de mémoriser des informations, comme vos préférences, et contribuent à mesurer et à financer le service.",
      ],
    },
    {
      id: "essential-storage",
      heading: "Stockage essentiel",
      body: [
        "Nous enregistrons dans votre navigateur un petit nombre de valeurs nécessaires au fonctionnement du site, par exemple votre choix en matière de cookies et un identifiant de visiteur anonyme servant à compter les visites et à prévenir les abus. Ces données ne vous identifient pas personnellement.",
      ],
    },
    {
      id: "analytics",
      heading: "Mesure d'audience",
      body: [
        "Lorsqu'il est activé, nous utilisons Google Analytics pour comprendre, de manière agrégée, comment les visiteurs utilisent le site (par exemple, quelles pages sont les plus consultées). Google Analytics dépose des cookies tels que _ga. Vous pouvez vous y opposer à l'aide du [module complémentaire de navigateur pour la désactivation de Google Analytics](https://tools.google.com/dlpage/gaoptout).",
      ],
    },
    {
      id: "advertising-cookies",
      heading: "Cookies publicitaires (Google AdSense)",
      body: [
        "Nous diffusons des annonces via Google AdSense. Google et ses partenaires utilisent des cookies pour diffuser des annonces en fonction de vos visites antérieures sur ce site et sur d'autres sites web, pour limiter le nombre de fois où une même annonce vous est présentée et pour mesurer les performances des annonces.",
        "Vous pouvez désactiver la publicité personnalisée dans les [Paramètres des annonces](https://adssettings.google.com) de Google ou sur [www.aboutads.info](https://www.aboutads.info). Pour en savoir plus, consultez la page [« Comment Google utilise les informations des sites ou applications qui utilisent ses services »](https://policies.google.com/technologies/partner-sites).",
        "Dans l'Espace économique européen, au Royaume-Uni et en Suisse, nous vous demandons votre consentement avant d'utiliser des cookies de publicité personnalisée. Si vous refusez, Google peut tout de même diffuser des annonces non personnalisées, qui n'utilisent des cookies qu'à des fins telles que la limitation de la fréquence d'affichage et la prévention de la fraude.",
      ],
    },
    {
      id: "managing-cookies",
      heading: "Gérer les cookies",
      body: [
        "Vous pouvez modifier ou retirer votre choix à tout moment en effaçant les données de ce site dans votre navigateur, ce qui affichera de nouveau le bandeau de consentement. La plupart des navigateurs permettent également de bloquer ou de supprimer les cookies dans leurs paramètres. Le blocage de certains cookies peut affecter le fonctionnement du site.",
        "Pour en savoir plus sur la façon dont nous traitons les données en général, consultez notre [Politique de confidentialité](/privacy).",
      ],
    },
    {
      id: "contact",
      heading: "Contact",
      body: [
        "Une question sur cette politique ? Contactez-nous à l'adresse {email} ou via notre [page de contact](/contact).",
      ],
    },
  ],
};

const es: LegalDoc = {
  meta: {
    title: "Política de cookies",
    description:
      "Qué cookies y tecnologías similares utiliza TestSpeedInternet, incluidos Google AdSense y Google Analytics, y cómo puedes controlarlas o retirar tu consentimiento.",
  },
  badge: "Legal",
  title: "Política de cookies",
  intro:
    "Esta Política de cookies explica cómo {brand}, operado por {company}, utiliza las cookies y tecnologías similares, y las opciones de las que dispones.",
  sections: [
    {
      id: "what-cookies-are",
      heading: "Qué son las cookies",
      body: [
        "Las cookies son pequeños archivos de texto que tu navegador almacena en tu dispositivo. Entre las tecnologías similares se incluyen el almacenamiento local y los píxeles. Permiten que un sitio web recuerde información como tus preferencias y ayudan a medir y financiar el servicio.",
      ],
    },
    {
      id: "essential-storage",
      heading: "Almacenamiento esencial",
      body: [
        "Guardamos en tu navegador un pequeño número de valores que el sitio necesita para funcionar, por ejemplo tu elección sobre el consentimiento de cookies y un identificador de visitante anónimo que se utiliza para contar visitas y prevenir abusos. Estos datos no te identifican personalmente.",
      ],
    },
    {
      id: "analytics",
      heading: "Analítica",
      body: [
        "Si está habilitado, utilizamos Google Analytics para comprender, de forma agregada, cómo usan el sitio los visitantes (por ejemplo, qué páginas son más populares). Google Analytics instala cookies como _ga. Puedes desactivarlo con el [complemento de inhabilitación para navegadores de Google Analytics](https://tools.google.com/dlpage/gaoptout).",
      ],
    },
    {
      id: "advertising-cookies",
      heading: "Cookies publicitarias (Google AdSense)",
      body: [
        "Mostramos anuncios a través de Google AdSense. Google y sus socios utilizan cookies para mostrar anuncios basados en tus visitas anteriores a este y otros sitios web, limitar la frecuencia con la que ves un anuncio y medir el rendimiento de los anuncios.",
        "Puedes desactivar la publicidad personalizada en la [Configuración de anuncios](https://adssettings.google.com) de Google o en [www.aboutads.info](https://www.aboutads.info). Para obtener más información, consulta [«Cómo utiliza Google la información de sitios web o aplicaciones que utilizan sus servicios»](https://policies.google.com/technologies/partner-sites).",
        "En el Espacio Económico Europeo, el Reino Unido y Suiza, solicitamos tu consentimiento antes de utilizar cookies de publicidad personalizada. Si lo rechazas, Google puede seguir mostrando anuncios no personalizados, que solo utilizan cookies con fines como limitar la frecuencia y prevenir el fraude.",
      ],
    },
    {
      id: "managing-cookies",
      heading: "Gestión de las cookies",
      body: [
        "Puedes cambiar o retirar tu elección en cualquier momento borrando los datos de este sitio en tu navegador, lo que volverá a mostrar el banner de consentimiento. La mayoría de los navegadores también permiten bloquear o eliminar cookies desde su configuración. Bloquear algunas cookies puede afectar al funcionamiento del sitio.",
        "Para saber más sobre cómo tratamos los datos en general, consulta nuestra [Política de privacidad](/privacy).",
      ],
    },
    {
      id: "contact",
      heading: "Contacto",
      body: [
        "¿Tienes preguntas sobre esta política? Escríbenos a {email} o utiliza nuestra [página de contacto](/contact).",
      ],
    },
  ],
};

const ar: LegalDoc = {
  meta: {
    title: "سياسة ملفات تعريف الارتباط",
    description:
      "ملفات تعريف الارتباط والتقنيات المشابهة التي يستخدمها TestSpeedInternet، بما فيها Google AdSense وGoogle Analytics، وكيفية التحكم فيها أو سحب موافقتك.",
  },
  badge: "قانوني",
  title: "سياسة ملفات تعريف الارتباط",
  intro:
    "توضح سياسة ملفات تعريف الارتباط هذه كيف يستخدم {brand}، الذي تديره شركة {company}، ملفات تعريف الارتباط والتقنيات المشابهة، والخيارات المتاحة لك.",
  sections: [
    {
      id: "what-cookies-are",
      heading: "ما هي ملفات تعريف الارتباط",
      body: [
        "ملفات تعريف الارتباط (الكوكيز) ملفات نصية صغيرة يخزّنها متصفحك على جهازك. ومن التقنيات المشابهة التخزين المحلي ووحدات البكسل. وهي تتيح للموقع تذكّر معلومات مثل تفضيلاتك، وتساعد في قياس الخدمة وتمويلها.",
      ],
    },
    {
      id: "essential-storage",
      heading: "التخزين الأساسي",
      body: [
        "نخزّن في متصفحك عددًا قليلًا من القيم التي يحتاجها الموقع ليعمل، مثل اختيارك بشأن الموافقة على ملفات تعريف الارتباط ومعرّف زائر مجهول الهوية يُستخدم لإحصاء الزيارات ومنع إساءة الاستخدام. ولا تُحدِّد هذه القيم هويتك الشخصية.",
      ],
    },
    {
      id: "analytics",
      heading: "التحليلات",
      body: [
        "عند تفعيله، نستخدم Google Analytics لفهم كيفية استخدام الزوار للموقع بصورة إجمالية (مثل الصفحات الأكثر رواجًا). ويضع Google Analytics ملفات تعريف ارتباط مثل _ga. ويمكنك إلغاء الاشتراك باستخدام [إضافة المتصفح لإيقاف Google Analytics](https://tools.google.com/dlpage/gaoptout).",
      ],
    },
    {
      id: "advertising-cookies",
      heading: "ملفات تعريف الارتباط الإعلانية (Google AdSense)",
      body: [
        "نعرض الإعلانات عبر Google AdSense. وتستخدم Google وشركاؤها ملفات تعريف الارتباط لعرض الإعلانات استنادًا إلى زياراتك السابقة لهذا الموقع ولمواقع أخرى، وللحدّ من عدد مرات ظهور الإعلان نفسه لك، ولقياس أداء الإعلانات.",
        "يمكنك إلغاء الاشتراك في الإعلانات المخصّصة من خلال [إعدادات الإعلانات](https://adssettings.google.com) في Google أو عبر [www.aboutads.info](https://www.aboutads.info). ولمعرفة المزيد، راجع صفحة [“كيفية استخدام Google للمعلومات من المواقع أو التطبيقات التي تستخدم خدماتها”](https://policies.google.com/technologies/partner-sites).",
        "في المنطقة الاقتصادية الأوروبية والمملكة المتحدة وسويسرا، نطلب موافقتك قبل استخدام ملفات تعريف الارتباط الخاصة بالإعلانات المخصّصة. وإذا رفضت، فقد تواصل Google عرض إعلانات غير مخصّصة، لا تستخدم ملفات تعريف الارتباط إلا لأغراض مثل تحديد معدّل تكرار الإعلانات ومنع الاحتيال.",
      ],
    },
    {
      id: "managing-cookies",
      heading: "إدارة ملفات تعريف الارتباط",
      body: [
        "يمكنك تغيير اختيارك أو سحبه في أي وقت بمسح بيانات هذا الموقع من متصفحك، وعندها سيظهر شريط الموافقة مجددًا. كما تتيح معظم المتصفحات حظر ملفات تعريف الارتباط أو حذفها من إعداداتها. وقد يؤثر حظر بعض ملفات تعريف الارتباط في طريقة عمل الموقع.",
        "لمعرفة المزيد عن كيفية تعاملنا مع البيانات بشكل عام، راجع [سياسة الخصوصية](/privacy) الخاصة بنا.",
      ],
    },
    {
      id: "contact",
      heading: "التواصل",
      body: [
        "هل لديك أسئلة حول هذه السياسة؟ تواصل معنا عبر {email} أو من خلال [صفحة الاتصال](/contact).",
      ],
    },
  ],
};

const ru: LegalDoc = {
  meta: {
    title: "Политика использования cookie",
    description:
      "Какие файлы cookie и похожие технологии использует TestSpeedInternet, включая Google AdSense и Google Analytics, и как управлять ими или отозвать своё согласие.",
  },
  badge: "Правовая информация",
  title: "Политика использования файлов cookie",
  intro:
    "Настоящая Политика использования файлов cookie объясняет, как {brand}, оператором которого является {company}, использует файлы cookie и аналогичные технологии, а также какой выбор есть у вас.",
  sections: [
    {
      id: "what-cookies-are",
      heading: "Что такое файлы cookie",
      body: [
        "Файлы cookie — это небольшие текстовые файлы, которые браузер сохраняет на вашем устройстве. К аналогичным технологиям относятся локальное хранилище и пиксели. Они позволяют сайту запоминать информацию, например ваши настройки, а также помогают оценивать работу сервиса и финансировать его.",
      ],
    },
    {
      id: "essential-storage",
      heading: "Необходимое хранилище",
      body: [
        "Мы сохраняем в вашем браузере небольшое количество значений, необходимых для работы сайта, например ваш выбор в отношении файлов cookie и анонимный идентификатор посетителя, используемый для подсчёта посещений и предотвращения злоупотреблений. Эти данные не позволяют установить вашу личность.",
      ],
    },
    {
      id: "analytics",
      heading: "Аналитика",
      body: [
        "Если аналитика включена, мы используем Google Analytics, чтобы в обобщённом виде понимать, как посетители пользуются сайтом (например, какие страницы популярны). Google Analytics устанавливает файлы cookie, такие как _ga. Вы можете отказаться от этого с помощью [браузерного расширения для блокировки Google Analytics](https://tools.google.com/dlpage/gaoptout).",
      ],
    },
    {
      id: "advertising-cookies",
      heading: "Рекламные файлы cookie (Google AdSense)",
      body: [
        "Мы показываем рекламу через Google AdSense. Google и её партнёры используют файлы cookie для показа рекламы на основе ваших предыдущих посещений этого и других сайтов, для ограничения частоты показа одного и того же объявления и для оценки эффективности рекламы.",
        "Вы можете отказаться от персонализированной рекламы в [настройках рекламы](https://adssettings.google.com) Google или на сайте [www.aboutads.info](https://www.aboutads.info). Подробнее см. [«Как Google использует информацию с сайтов и из приложений, где используются сервисы Google»](https://policies.google.com/technologies/partner-sites).",
        "В Европейской экономической зоне, Великобритании и Швейцарии мы запрашиваем ваше согласие перед использованием файлов cookie для персонализированной рекламы. Если вы откажетесь, Google может по-прежнему показывать неперсонализированную рекламу, для которой файлы cookie используются только в таких целях, как ограничение частоты показов и предотвращение мошенничества.",
      ],
    },
    {
      id: "managing-cookies",
      heading: "Управление файлами cookie",
      body: [
        "Вы можете в любой момент изменить или отозвать свой выбор, удалив данные этого сайта в браузере, — после этого баннер согласия появится снова. Большинство браузеров также позволяют блокировать или удалять файлы cookie в настройках. Блокировка некоторых файлов cookie может повлиять на работу сайта.",
        "Подробнее о том, как мы обращаемся с данными в целом, читайте в нашей [Политике конфиденциальности](/privacy).",
      ],
    },
    {
      id: "contact",
      heading: "Контакты",
      body: [
        "Есть вопросы по этой политике? Напишите нам на {email} или воспользуйтесь нашей [страницей контактов](/contact).",
      ],
    },
  ],
};

export const cookiesMessages: Record<Locale, LegalDoc> = { en, fr, es, ar, ru };
