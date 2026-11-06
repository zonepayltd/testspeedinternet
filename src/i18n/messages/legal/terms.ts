import type { Locale } from "../../config";
import type { LegalDoc } from "../legal";

const en: LegalDoc = {
  meta: {
    title: "Terms of Service",
    description:
      "The terms that govern your use of TestSpeedInternet, a free internet speed test and IP tools website operated by ZONEPAY LTD. Please read them carefully.",
  },
  badge: "Legal",
  title: "Terms of Service",
  intro: "These Terms govern your use of {brand}, operated by {company}. By using the site, you agree to them.",
  sections: [
    {
      id: "acceptance",
      heading: "Acceptance of terms",
      body: [
        'By accessing or using {brand} (the "service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.',
      ],
    },
    {
      id: "use-of-the-service",
      heading: "Use of the service",
      body: [
        "The service is provided free of charge to help you measure your internet connection and view information about your IP address. You may use it for personal and lawful purposes only.",
      ],
    },
    {
      id: "accuracy",
      heading: "Accuracy of results",
      body: [
        "Speed test and IP results are estimates that depend on your device, network, WiFi, third-party servers and conditions at the time of testing. We provide them on a best-effort basis and do not guarantee their accuracy or that they match figures from your internet provider.",
      ],
    },
    {
      id: "acceptable-use",
      heading: "Acceptable use",
      body: [
        "You agree not to misuse the service, including attempting to disrupt it, overload it with automated requests, reverse engineer it, or use it to violate the rights of others or any applicable law.",
      ],
    },
    {
      id: "intellectual-property",
      heading: "Intellectual property",
      body: [
        "The {brand} name, design, content and software are owned by {company} and protected by applicable laws. Third-party trademarks and logos shown (such as provider logos) belong to their respective owners. See our [DMCA & Copyright Policy](/dmca) to report infringement.",
      ],
    },
    {
      id: "third-party-services",
      heading: "Third-party services",
      body: [
        "The service relies on third-party providers (including Cloudflare, ip-api.com, proxycheck.io, Logo.dev, flagcdn.com and OpenStreetMap). We are not responsible for the availability, content or policies of these third parties. Our [Privacy Policy](/privacy) explains what data they may receive.",
      ],
    },
    {
      id: "disclaimer",
      heading: "Disclaimer of warranties",
      body: [
        'The service is provided "as is" and "as available" without warranties of any kind, whether express or implied, including fitness for a particular purpose and uninterrupted availability.',
      ],
    },
    {
      id: "limitation-of-liability",
      heading: "Limitation of liability",
      body: [
        "To the maximum extent permitted by law, {company} shall not be liable for any indirect, incidental or consequential damages arising from your use of, or inability to use, the service.",
      ],
    },
    {
      id: "changes",
      heading: "Changes to these terms",
      body: [
        'We may update these Terms from time to time. Continued use of the service after changes means you accept the updated Terms. The "Last updated" date reflects the latest version.',
      ],
    },
    {
      id: "contact",
      heading: "Contact",
      body: ["Questions about these Terms can be sent to {company} at {email} or through our [contact page](/contact)."],
    },
  ],
};

const fr: LegalDoc = {
  meta: {
    title: "Conditions d'utilisation",
    description:
      "Les conditions qui régissent l'utilisation de TestSpeedInternet, site gratuit de test de débit et d'outils IP exploité par ZONEPAY LTD. Lisez-les attentivement.",
  },
  badge: "Mentions légales",
  title: "Conditions d'utilisation",
  intro:
    "Les présentes Conditions régissent votre utilisation de {brand}, exploité par {company}. En utilisant le site, vous les acceptez.",
  sections: [
    {
      id: "acceptance",
      heading: "Acceptation des conditions",
      body: [
        "En accédant à {brand} (le « service ») ou en l'utilisant, vous acceptez d'être lié par les présentes Conditions d'utilisation. Si vous ne les acceptez pas, veuillez ne pas utiliser le service.",
      ],
    },
    {
      id: "use-of-the-service",
      heading: "Utilisation du service",
      body: [
        "Le service est fourni gratuitement pour vous aider à mesurer votre connexion Internet et à consulter des informations sur votre adresse IP. Vous ne pouvez l'utiliser qu'à des fins personnelles et licites.",
      ],
    },
    {
      id: "accuracy",
      heading: "Exactitude des résultats",
      body: [
        "Les résultats des tests de débit et des outils IP sont des estimations qui dépendent de votre appareil, de votre réseau, de votre WiFi, des serveurs tiers et des conditions au moment du test. Nous les fournissons dans la mesure de nos moyens et ne garantissons ni leur exactitude ni leur concordance avec les chiffres de votre fournisseur d'accès à Internet.",
      ],
    },
    {
      id: "acceptable-use",
      heading: "Utilisation acceptable",
      body: [
        "Vous vous engagez à ne pas faire un usage abusif du service, notamment en tentant de le perturber, de le surcharger de requêtes automatisées, de le soumettre à de l'ingénierie inverse, ou de l'utiliser pour porter atteinte aux droits d'autrui ou enfreindre toute loi applicable.",
      ],
    },
    {
      id: "intellectual-property",
      heading: "Propriété intellectuelle",
      body: [
        "Le nom, le design, le contenu et le logiciel {brand} appartiennent à {company} et sont protégés par les lois applicables. Les marques et logos de tiers affichés (tels que les logos des fournisseurs) appartiennent à leurs propriétaires respectifs. Consultez notre [Politique DMCA et droits d'auteur](/dmca) pour signaler une violation.",
      ],
    },
    {
      id: "third-party-services",
      heading: "Services tiers",
      body: [
        "Le service s'appuie sur des prestataires tiers (notamment Cloudflare, ip-api.com, proxycheck.io, Logo.dev, flagcdn.com et OpenStreetMap). Nous ne sommes pas responsables de la disponibilité, du contenu ou des politiques de ces tiers. Notre [Politique de confidentialité](/privacy) explique quelles données ils peuvent recevoir.",
      ],
    },
    {
      id: "disclaimer",
      heading: "Exclusion de garanties",
      body: [
        "Le service est fourni « en l'état » et « selon disponibilité », sans garantie d'aucune sorte, expresse ou implicite, y compris quant à l'adéquation à un usage particulier et à une disponibilité ininterrompue.",
      ],
    },
    {
      id: "limitation-of-liability",
      heading: "Limitation de responsabilité",
      body: [
        "Dans toute la mesure permise par la loi, {company} ne saurait être tenue responsable des dommages indirects, accessoires ou consécutifs découlant de votre utilisation du service ou de l'impossibilité de l'utiliser.",
      ],
    },
    {
      id: "changes",
      heading: "Modifications des présentes conditions",
      body: [
        "Nous pouvons mettre à jour ces Conditions de temps à autre. Continuer à utiliser le service après une modification vaut acceptation des Conditions mises à jour. La date de « Dernière mise à jour » correspond à la version la plus récente.",
      ],
    },
    {
      id: "contact",
      heading: "Contact",
      body: [
        "Toute question concernant ces Conditions peut être adressée à {company} à {email} ou via notre [page de contact](/contact).",
      ],
    },
  ],
};

const es: LegalDoc = {
  meta: {
    title: "Términos del servicio",
    description:
      "Los términos que rigen el uso de TestSpeedInternet, sitio gratuito de test de velocidad de internet y herramientas IP operado por ZONEPAY LTD. Léelos con atención.",
  },
  badge: "Legal",
  title: "Términos del servicio",
  intro:
    "Estos Términos rigen el uso de {brand}, operado por {company}. Al utilizar el sitio, los aceptas.",
  sections: [
    {
      id: "acceptance",
      heading: "Aceptación de los términos",
      body: [
        "Al acceder a {brand} (el «servicio») o utilizarlo, aceptas quedar vinculado por estos Términos del servicio. Si no estás de acuerdo, no utilices el servicio.",
      ],
    },
    {
      id: "use-of-the-service",
      heading: "Uso del servicio",
      body: [
        "El servicio se ofrece de forma gratuita para ayudarte a medir tu conexión a internet y consultar información sobre tu dirección IP. Solo puedes utilizarlo con fines personales y lícitos.",
      ],
    },
    {
      id: "accuracy",
      heading: "Exactitud de los resultados",
      body: [
        "Los resultados del test de velocidad y de IP son estimaciones que dependen de tu dispositivo, tu red, tu WiFi, los servidores de terceros y las condiciones en el momento de la prueba. Los ofrecemos según nuestro mejor esfuerzo y no garantizamos su exactitud ni que coincidan con las cifras de tu proveedor de internet.",
      ],
    },
    {
      id: "acceptable-use",
      heading: "Uso aceptable",
      body: [
        "Te comprometes a no hacer un uso indebido del servicio, lo que incluye intentar interrumpirlo, sobrecargarlo con solicitudes automatizadas, aplicarle ingeniería inversa o utilizarlo para vulnerar los derechos de terceros o cualquier ley aplicable.",
      ],
    },
    {
      id: "intellectual-property",
      heading: "Propiedad intelectual",
      body: [
        "El nombre, el diseño, el contenido y el software de {brand} son propiedad de {company} y están protegidos por las leyes aplicables. Las marcas y logotipos de terceros que se muestran (como los logotipos de los proveedores) pertenecen a sus respectivos propietarios. Consulta nuestra [Política DMCA y de derechos de autor](/dmca) para denunciar una infracción.",
      ],
    },
    {
      id: "third-party-services",
      heading: "Servicios de terceros",
      body: [
        "El servicio depende de proveedores externos (entre ellos Cloudflare, ip-api.com, proxycheck.io, Logo.dev, flagcdn.com y OpenStreetMap). No somos responsables de la disponibilidad, el contenido ni las políticas de dichos terceros. Nuestra [Política de privacidad](/privacy) explica qué datos pueden recibir.",
      ],
    },
    {
      id: "disclaimer",
      heading: "Exención de garantías",
      body: [
        "El servicio se proporciona «tal cual» y «según disponibilidad», sin garantías de ningún tipo, ya sean expresas o implícitas, incluidas la idoneidad para un fin determinado y la disponibilidad ininterrumpida.",
      ],
    },
    {
      id: "limitation-of-liability",
      heading: "Limitación de responsabilidad",
      body: [
        "En la máxima medida permitida por la ley, {company} no será responsable de ningún daño indirecto, incidental o consecuente derivado del uso del servicio o de la imposibilidad de utilizarlo.",
      ],
    },
    {
      id: "changes",
      heading: "Cambios en estos términos",
      body: [
        "Podemos actualizar estos Términos periódicamente. Si sigues utilizando el servicio después de los cambios, aceptas los Términos actualizados. La fecha de «Última actualización» refleja la versión más reciente.",
      ],
    },
    {
      id: "contact",
      heading: "Contacto",
      body: [
        "Puedes enviar tus preguntas sobre estos Términos a {company} en {email} o a través de nuestra [página de contacto](/contact).",
      ],
    },
  ],
};

const ar: LegalDoc = {
  meta: {
    title: "شروط الخدمة",
    description:
      "الشروط التي تحكم استخدامك لموقع TestSpeedInternet، الموقع المجاني لاختبار سرعة الإنترنت وأدوات عنوان IP الذي تديره شركة ZONEPAY LTD. يُرجى قراءتها بعناية قبل الاستخدام.",
  },
  badge: "قانوني",
  title: "شروط الخدمة",
  intro: "تحكم هذه الشروط استخدامك لموقع {brand} الذي تديره شركة {company}. وباستخدامك للموقع فإنك توافق عليها.",
  sections: [
    {
      id: "acceptance",
      heading: "قبول الشروط",
      body: [
        "بدخولك إلى {brand} («الخدمة») أو استخدامها، فإنك توافق على الالتزام بشروط الخدمة هذه. وإذا كنت لا توافق عليها، فيُرجى عدم استخدام الخدمة.",
      ],
    },
    {
      id: "use-of-the-service",
      heading: "استخدام الخدمة",
      body: [
        "تُقدَّم الخدمة مجانًا لمساعدتك على قياس اتصالك بالإنترنت والاطلاع على معلومات حول عنوان IP الخاص بك. ولا يجوز لك استخدامها إلا لأغراض شخصية ومشروعة.",
      ],
    },
    {
      id: "accuracy",
      heading: "دقة النتائج",
      body: [
        "نتائج اختبار السرعة وعنوان IP هي تقديرات تعتمد على جهازك وشبكتك واتصال WiFi والخوادم التابعة لجهات خارجية والظروف السائدة وقت إجراء الاختبار. ونقدّمها على أساس بذل أفضل جهد ممكن، ولا نضمن دقتها ولا تطابقها مع الأرقام التي يقدّمها مزوّد خدمة الإنترنت لديك.",
      ],
    },
    {
      id: "acceptable-use",
      heading: "الاستخدام المقبول",
      body: [
        "توافق على عدم إساءة استخدام الخدمة، بما في ذلك محاولة تعطيلها، أو إغراقها بطلبات آلية، أو إجراء هندسة عكسية لها، أو استخدامها لانتهاك حقوق الآخرين أو أي قانون معمول به.",
      ],
    },
    {
      id: "intellectual-property",
      heading: "الملكية الفكرية",
      body: [
        "اسم {brand} وتصميمه ومحتواه وبرمجياته مملوكة لشركة {company} ومحمية بموجب القوانين المعمول بها. أما العلامات التجارية والشعارات العائدة لجهات خارجية والمعروضة على الموقع (مثل شعارات مزوّدي الخدمة) فهي ملك لأصحابها. راجع [سياسة DMCA وحقوق النشر](/dmca) للإبلاغ عن أي انتهاك.",
      ],
    },
    {
      id: "third-party-services",
      heading: "خدمات الجهات الخارجية",
      body: [
        "تعتمد الخدمة على مزوّدين خارجيين (منهم Cloudflare وip-api.com وproxycheck.io وLogo.dev وflagcdn.com وOpenStreetMap). ولسنا مسؤولين عن توفر هذه الجهات أو محتواها أو سياساتها. وتوضّح [سياسة الخصوصية](/privacy) البيانات التي قد تتلقاها.",
      ],
    },
    {
      id: "disclaimer",
      heading: "إخلاء المسؤولية عن الضمانات",
      body: [
        "تُقدَّم الخدمة «كما هي» و«حسب توفرها» دون أي ضمانات من أي نوع، صريحة كانت أو ضمنية، بما في ذلك ملاءمتها لغرض معيّن أو توفرها دون انقطاع.",
      ],
    },
    {
      id: "limitation-of-liability",
      heading: "تحديد المسؤولية",
      body: [
        "إلى أقصى حد يسمح به القانون، لا تتحمّل شركة {company} المسؤولية عن أي أضرار غير مباشرة أو عرضية أو تبعية تنشأ عن استخدامك للخدمة أو عن عدم قدرتك على استخدامها.",
      ],
    },
    {
      id: "changes",
      heading: "التغييرات على هذه الشروط",
      body: [
        "قد نحدّث هذه الشروط من وقت لآخر. ويُعدّ استمرارك في استخدام الخدمة بعد إجراء التغييرات قبولًا منك للشروط المحدَّثة. ويشير تاريخ «آخر تحديث» إلى أحدث إصدار.",
      ],
    },
    {
      id: "contact",
      heading: "التواصل",
      body: [
        "يمكن إرسال الأسئلة المتعلقة بهذه الشروط إلى شركة {company} على {email} أو عبر [صفحة الاتصال](/contact).",
      ],
    },
  ],
};

const ru: LegalDoc = {
  meta: {
    title: "Условия использования",
    description:
      "Условия использования TestSpeedInternet — бесплатного сайта для теста скорости интернета и проверки IP, которым управляет ZONEPAY LTD. Внимательно ознакомьтесь с ними.",
  },
  badge: "Правовая информация",
  title: "Условия использования",
  intro:
    "Настоящие Условия регулируют использование {brand}, которым управляет {company}. Пользуясь сайтом, вы соглашаетесь с ними.",
  sections: [
    {
      id: "acceptance",
      heading: "Принятие условий",
      body: [
        "Получая доступ к {brand} («сервис») или используя его, вы соглашаетесь соблюдать настоящие Условия использования. Если вы не согласны с ними, пожалуйста, не пользуйтесь сервисом.",
      ],
    },
    {
      id: "use-of-the-service",
      heading: "Использование сервиса",
      body: [
        "Сервис предоставляется бесплатно, чтобы помочь вам измерить скорость интернет-соединения и получить сведения о вашем IP-адресе. Вы можете использовать его только в личных и законных целях.",
      ],
    },
    {
      id: "accuracy",
      heading: "Точность результатов",
      body: [
        "Результаты теста скорости и проверки IP являются оценочными и зависят от вашего устройства, сети, WiFi, сторонних серверов и условий в момент тестирования. Мы предоставляем их по принципу «максимальных усилий» и не гарантируем их точность или совпадение с показателями вашего интернет-провайдера.",
      ],
    },
    {
      id: "acceptable-use",
      heading: "Допустимое использование",
      body: [
        "Вы обязуетесь не злоупотреблять сервисом, в том числе не пытаться нарушить его работу, перегружать его автоматическими запросами, осуществлять его обратную разработку или использовать его для нарушения прав других лиц или любого применимого законодательства.",
      ],
    },
    {
      id: "intellectual-property",
      heading: "Интеллектуальная собственность",
      body: [
        "Название, дизайн, контент и программное обеспечение {brand} принадлежат {company} и охраняются применимым законодательством. Товарные знаки и логотипы третьих лиц, отображаемые на сайте (например, логотипы провайдеров), принадлежат их владельцам. Чтобы сообщить о нарушении, ознакомьтесь с нашей [Политикой DMCA и авторских прав](/dmca).",
      ],
    },
    {
      id: "third-party-services",
      heading: "Сторонние сервисы",
      body: [
        "Сервис использует сторонних поставщиков (в том числе Cloudflare, ip-api.com, proxycheck.io, Logo.dev, flagcdn.com и OpenStreetMap). Мы не несём ответственности за доступность, контент или политики этих третьих лиц. В нашей [Политике конфиденциальности](/privacy) указано, какие данные они могут получать.",
      ],
    },
    {
      id: "disclaimer",
      heading: "Отказ от гарантий",
      body: [
        "Сервис предоставляется «как есть» и «по мере доступности» без каких-либо гарантий, явных или подразумеваемых, включая пригодность для определённой цели и бесперебойную работу.",
      ],
    },
    {
      id: "limitation-of-liability",
      heading: "Ограничение ответственности",
      body: [
        "В максимальной степени, допустимой законом, {company} не несёт ответственности за любые косвенные, случайные или последующие убытки, возникшие в результате использования вами сервиса или невозможности его использования.",
      ],
    },
    {
      id: "changes",
      heading: "Изменения условий",
      body: [
        "Мы можем время от времени обновлять настоящие Условия. Продолжая пользоваться сервисом после внесения изменений, вы принимаете обновлённые Условия. Дата «Последнее обновление» соответствует актуальной версии.",
      ],
    },
    {
      id: "contact",
      heading: "Контакты",
      body: [
        "Вопросы об этих Условиях можно направить в {company} по адресу {email} или через нашу [страницу контактов](/contact).",
      ],
    },
  ],
};

export const termsMessages: Record<Locale, LegalDoc> = { en, fr, es, ar, ru };
