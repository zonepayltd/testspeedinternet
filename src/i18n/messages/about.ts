import type { Locale } from "../config";

// About page. Inline markup: [label](/path), {email}, {brand}, {company} (see <Rich> in LegalPage.tsx).
const en = {
  meta: {
    title: "About Us: Who Runs This Speed Test",
    description:
      "Learn about TestSpeedInternet, the free internet speed test operated by ZONEPAY LTD: our mission, our tools and guides, how the test works and our standards.",
  },
  hero: {
    badge: "About us",
    titleA: "The team behind",
    lead: "{brand} is a free internet speed test and network tools website operated by {company}. Our mission is to give everyone a fast, accurate and private way to measure their internet connection.",
    ctaPrimary: "Test your speed",
    ctaSecondary: "Contact us",
  },
  facts: [
    { label: "Operated by", value: "{company}" },
    { label: "Price", value: "Free, no signup" },
    { label: "Languages", value: "5 languages" },
    { label: "Contact", value: "{email}" },
  ],
  mission: {
    kicker: "Our mission",
    title: "Know exactly what your connection delivers",
    paragraphs: [
      "Many people pay for internet every month without an easy way to know if they are getting what they pay for. We built {brand} to change that: a clean, modern speed test that measures your download speed, upload speed, ping and jitter in seconds, then explains what the numbers mean.",
      "Beyond speed, we help you understand your connection with tools like our [What Is My IP](/what-is-my-ip) page and our [IP Risk Score](/ip-risk-score) checker, and with practical guides written in plain language.",
    ],
  },
  offer: {
    kicker: "What we offer",
    title: "Tools and guides for a better connection",
    lead: "Everything is free to use in your browser, on any device. No app and no account.",
    items: [
      {
        title: "Internet speed test",
        text: "Measure download, upload, ping and jitter in a few seconds, with results anyone can understand.",
        href: "/",
        cta: "Run a test",
      },
      {
        title: "What Is My IP",
        text: "See your public IP address, approximate location and internet provider at a glance.",
        href: "/what-is-my-ip",
        cta: "Check my IP",
      },
      {
        title: "IP Risk Score",
        text: "Check whether an IP address looks like a proxy, VPN or a source of abuse.",
        href: "/ip-risk-score",
        cta: "Check an IP",
      },
      {
        title: "Guides and articles",
        text: "Practical help on WiFi, ping, streaming, home networking and fixing slow internet.",
        href: "/blog",
        cta: "Read the blog",
      },
    ],
  },
  how: {
    kicker: "How the test works",
    title: "Real transfers, measured in your browser",
    lead: "The speed test runs entirely in your browser and measures real data transfers over several parallel connections.",
    steps: [
      { title: "Latency", text: "We send a series of small requests to measure ping (response time) and jitter (how much it varies)." },
      { title: "Download", text: "Your browser downloads test data over several parallel connections to measure how fast you receive data." },
      { title: "Upload", text: "Your browser then sends test data back to measure how fast you can send data." },
      { title: "Results", text: "We show your download, upload, ping and jitter, and explain what they mean for everyday use." },
    ],
    more: "Read the full details on [how our speed test works](/how-it-works), or see [what counts as a good internet speed](/guides/good-internet-speed).",
  },
  editorial: {
    kicker: "Editorial standards",
    title: "Guides you can trust",
    text: "Our editorial team publishes practical guides on the [{brand} blog](/blog). Every article is researched from official documentation and standards, checked for accuracy and updated when things change. Advertisers never influence what we write.",
    cta: "Read our editorial policy",
  },
  values: {
    kicker: "Our values",
    title: "What we stand for",
    items: [
      {
        title: "Accurate by design",
        text: "We measure real transfers with parallel connections, so your results reflect your real-world speed.",
      },
      {
        title: "Private and free",
        text: "No signup, no app and no selling of personal data. Run as many tests as you like, on any device.",
      },
      {
        title: "Simple for everyone",
        text: "One tap to test your download, upload, ping and jitter, with results anyone can understand.",
      },
      {
        title: "Transparent",
        text: "We explain how our tools work, where our information comes from and how the site is funded.",
      },
    ],
  },
  company: {
    title: "Operated by {company}",
    subtitle: "The company behind {brand}",
    text: "{brand} is owned and operated by {company}. For partnerships, press or general enquiries, get in touch through our [contact page](/contact) or email {email}.",
    links: "Policies",
  },
  cta: {
    title: "Ready to check your connection?",
    text: "Run a free speed test in seconds. No app, no signup.",
    button: "Start speed test",
  },
};

export type AboutMessages = typeof en;

const fr: AboutMessages = {
  meta: {
    title: "À propos : qui gère ce test de débit",
    description:
      "Découvrez TestSpeedInternet, le test de débit Internet gratuit exploité par ZONEPAY LTD : notre mission, nos outils et guides, le fonctionnement du test et nos engagements.",
  },
  hero: {
    badge: "À propos",
    titleA: "L'équipe derrière",
    lead: "{brand} est un site gratuit de test de débit Internet et d'outils réseau, exploité par {company}. Notre mission : offrir à chacun un moyen rapide, fiable et respectueux de la vie privée de mesurer sa connexion Internet.",
    ctaPrimary: "Tester mon débit",
    ctaSecondary: "Nous contacter",
  },
  facts: [
    { label: "Exploité par", value: "{company}" },
    { label: "Prix", value: "Gratuit, sans inscription" },
    { label: "Langues", value: "5 langues" },
    { label: "Contact", value: "{email}" },
  ],
  mission: {
    kicker: "Notre mission",
    title: "Savoir exactement ce que vaut votre connexion",
    paragraphs: [
      "Beaucoup de personnes paient leur abonnement Internet chaque mois sans moyen simple de vérifier qu'elles obtiennent ce pour quoi elles paient. Nous avons créé {brand} pour changer cela : un test de débit moderne et épuré qui mesure en quelques secondes votre débit descendant, votre débit montant, votre ping et votre gigue, puis vous explique ce que signifient ces chiffres.",
      "Au-delà du débit, nous vous aidons à comprendre votre connexion grâce à des outils comme notre page [Quelle est mon IP](/what-is-my-ip) et notre vérificateur de [score de risque IP](/ip-risk-score), ainsi qu'à des guides pratiques rédigés dans un langage clair.",
    ],
  },
  offer: {
    kicker: "Ce que nous proposons",
    title: "Des outils et des guides pour une meilleure connexion",
    lead: "Tout est gratuit et fonctionne dans votre navigateur, sur n'importe quel appareil. Sans application ni compte.",
    items: [
      {
        title: "Test de débit Internet",
        text: "Mesurez le débit descendant, le débit montant, le ping et la gigue en quelques secondes, avec des résultats compréhensibles par tous.",
        href: "/",
        cta: "Lancer un test",
      },
      {
        title: "Quelle est mon IP",
        text: "Affichez en un coup d'œil votre adresse IP publique, votre localisation approximative et votre fournisseur d'accès.",
        href: "/what-is-my-ip",
        cta: "Voir mon IP",
      },
      {
        title: "Score de risque IP",
        text: "Vérifiez si une adresse IP ressemble à un proxy, à un VPN ou à une source d'abus.",
        href: "/ip-risk-score",
        cta: "Vérifier une IP",
      },
      {
        title: "Guides et articles",
        text: "Des conseils pratiques sur le WiFi, le ping, le streaming, le réseau domestique et les connexions lentes.",
        href: "/blog",
        cta: "Lire le blog",
      },
    ],
  },
  how: {
    kicker: "Fonctionnement du test",
    title: "De vrais transferts, mesurés dans votre navigateur",
    lead: "Le test de débit s'exécute entièrement dans votre navigateur et mesure de vrais transferts de données sur plusieurs connexions parallèles.",
    steps: [
      { title: "Latence", text: "Nous envoyons une série de petites requêtes pour mesurer le ping (temps de réponse) et la gigue (sa variation)." },
      { title: "Débit descendant", text: "Votre navigateur télécharge des données de test sur plusieurs connexions parallèles pour mesurer la vitesse à laquelle vous recevez des données." },
      { title: "Débit montant", text: "Votre navigateur renvoie ensuite des données de test pour mesurer la vitesse à laquelle vous pouvez envoyer des données." },
      { title: "Résultats", text: "Nous affichons votre débit descendant, votre débit montant, votre ping et votre gigue, et expliquons ce qu'ils signifient au quotidien." },
    ],
    more: "Découvrez en détail [comment fonctionne notre test de débit](/how-it-works), ou consultez [ce qu'est un bon débit Internet](/guides/good-internet-speed).",
  },
  editorial: {
    kicker: "Ligne éditoriale",
    title: "Des guides dignes de confiance",
    text: "Notre équipe éditoriale publie des guides pratiques sur le [blog {brand}](/blog). Chaque article s'appuie sur la documentation officielle et les normes, est vérifié pour son exactitude et mis à jour lorsque les choses évoluent. Les annonceurs n'influencent jamais ce que nous écrivons.",
    cta: "Lire notre politique éditoriale",
  },
  values: {
    kicker: "Nos valeurs",
    title: "Ce qui nous guide",
    items: [
      {
        title: "Précis par conception",
        text: "Nous mesurons de vrais transferts avec des connexions parallèles, pour que vos résultats reflètent votre débit réel.",
      },
      {
        title: "Confidentiel et gratuit",
        text: "Sans inscription, sans application et sans revente de données personnelles. Lancez autant de tests que vous voulez, sur n'importe quel appareil.",
      },
      {
        title: "Simple pour tous",
        text: "Un seul geste pour tester votre débit descendant, votre débit montant, votre ping et votre gigue, avec des résultats compréhensibles par tous.",
      },
      {
        title: "Transparent",
        text: "Nous expliquons le fonctionnement de nos outils, l'origine de nos informations et la manière dont le site est financé.",
      },
    ],
  },
  company: {
    title: "Exploité par {company}",
    subtitle: "La société derrière {brand}",
    text: "{brand} est détenu et exploité par {company}. Pour toute demande de partenariat, de presse ou d'ordre général, contactez-nous via notre [page de contact](/contact) ou écrivez à {email}.",
    links: "Politiques",
  },
  cta: {
    title: "Prêt à vérifier votre connexion ?",
    text: "Lancez un test de débit gratuit en quelques secondes. Sans application ni inscription.",
    button: "Lancer le test de débit",
  },
};

const es: AboutMessages = {
  meta: {
    title: "Sobre nosotros: quién está detrás del test",
    description:
      "Conoce TestSpeedInternet, el test de velocidad de internet gratuito operado por ZONEPAY LTD: nuestra misión, herramientas y guías, cómo funciona el test y nuestros estándares.",
  },
  hero: {
    badge: "Sobre nosotros",
    titleA: "El equipo detrás de",
    lead: "{brand} es un sitio web gratuito de test de velocidad de internet y herramientas de red operado por {company}. Nuestra misión es ofrecer a todos una forma rápida, precisa y privada de medir su conexión a internet.",
    ctaPrimary: "Medir mi velocidad",
    ctaSecondary: "Contáctanos",
  },
  facts: [
    { label: "Operado por", value: "{company}" },
    { label: "Precio", value: "Gratis, sin registro" },
    { label: "Idiomas", value: "5 idiomas" },
    { label: "Contacto", value: "{email}" },
  ],
  mission: {
    kicker: "Nuestra misión",
    title: "Saber exactamente lo que ofrece tu conexión",
    paragraphs: [
      "Mucha gente paga internet cada mes sin una forma sencilla de saber si recibe lo que paga. Creamos {brand} para cambiar eso: un test de velocidad limpio y moderno que mide en segundos tu velocidad de descarga, tu velocidad de subida, el ping y el jitter, y luego te explica qué significan los resultados.",
      "Más allá de la velocidad, te ayudamos a entender tu conexión con herramientas como nuestra página [Cuál es mi IP](/what-is-my-ip) y nuestro verificador de [puntuación de riesgo de IP](/ip-risk-score), además de guías prácticas escritas en un lenguaje claro.",
    ],
  },
  offer: {
    kicker: "Lo que ofrecemos",
    title: "Herramientas y guías para una mejor conexión",
    lead: "Todo es gratuito y funciona en tu navegador, en cualquier dispositivo. Sin aplicación y sin cuenta.",
    items: [
      {
        title: "Test de velocidad de internet",
        text: "Mide la descarga, la subida, el ping y el jitter en pocos segundos, con resultados que cualquiera puede entender.",
        href: "/",
        cta: "Hacer un test",
      },
      {
        title: "Cuál es mi IP",
        text: "Consulta de un vistazo tu dirección IP pública, tu ubicación aproximada y tu proveedor de internet.",
        href: "/what-is-my-ip",
        cta: "Ver mi IP",
      },
      {
        title: "Puntuación de riesgo de IP",
        text: "Comprueba si una dirección IP parece un proxy, una VPN o una fuente de abuso.",
        href: "/ip-risk-score",
        cta: "Comprobar una IP",
      },
      {
        title: "Guías y artículos",
        text: "Ayuda práctica sobre WiFi, ping, streaming, redes domésticas y cómo solucionar un internet lento.",
        href: "/blog",
        cta: "Leer el blog",
      },
    ],
  },
  how: {
    kicker: "Cómo funciona el test",
    title: "Transferencias reales, medidas en tu navegador",
    lead: "El test de velocidad se ejecuta íntegramente en tu navegador y mide transferencias de datos reales a través de varias conexiones paralelas.",
    steps: [
      { title: "Latencia", text: "Enviamos una serie de pequeñas solicitudes para medir el ping (tiempo de respuesta) y el jitter (cuánto varía)." },
      { title: "Descarga", text: "Tu navegador descarga datos de prueba a través de varias conexiones paralelas para medir la rapidez con la que recibes datos." },
      { title: "Subida", text: "Después, tu navegador envía datos de prueba para medir la rapidez con la que puedes enviar datos." },
      { title: "Resultados", text: "Mostramos tu descarga, subida, ping y jitter, y explicamos lo que significan para el uso diario." },
    ],
    more: "Lee todos los detalles sobre [cómo funciona nuestro test de velocidad](/how-it-works) o descubre [qué se considera una buena velocidad de internet](/guides/good-internet-speed).",
  },
  editorial: {
    kicker: "Estándares editoriales",
    title: "Guías en las que puedes confiar",
    text: "Nuestro equipo editorial publica guías prácticas en el [blog de {brand}](/blog). Cada artículo se documenta a partir de fuentes oficiales y estándares, se revisa para garantizar su exactitud y se actualiza cuando algo cambia. Los anunciantes nunca influyen en lo que escribimos.",
    cta: "Leer nuestra política editorial",
  },
  values: {
    kicker: "Nuestros valores",
    title: "Lo que defendemos",
    items: [
      {
        title: "Precisión desde el diseño",
        text: "Medimos transferencias reales con conexiones paralelas, para que tus resultados reflejen tu velocidad real.",
      },
      {
        title: "Privado y gratuito",
        text: "Sin registro, sin aplicación y sin venta de datos personales. Haz tantos tests como quieras, en cualquier dispositivo.",
      },
      {
        title: "Sencillo para todos",
        text: "Un solo toque para medir tu descarga, subida, ping y jitter, con resultados que cualquiera puede entender.",
      },
      {
        title: "Transparente",
        text: "Explicamos cómo funcionan nuestras herramientas, de dónde procede nuestra información y cómo se financia el sitio.",
      },
    ],
  },
  company: {
    title: "Operado por {company}",
    subtitle: "La empresa detrás de {brand}",
    text: "{brand} es propiedad de {company}, que también lo opera. Para colaboraciones, prensa o consultas generales, ponte en contacto a través de nuestra [página de contacto](/contact) o escribe a {email}.",
    links: "Políticas",
  },
  cta: {
    title: "¿Listo para comprobar tu conexión?",
    text: "Haz un test de velocidad gratuito en segundos. Sin aplicación y sin registro.",
    button: "Iniciar test de velocidad",
  },
};

const ar: AboutMessages = {
  meta: {
    title: "من نحن: الجهة المشغّلة لاختبار السرعة",
    description:
      "تعرّف على TestSpeedInternet، أداة اختبار سرعة الإنترنت المجانية التي تشغّلها ZONEPAY LTD: مهمتنا وأدواتنا وأدلتنا، وكيف يعمل الاختبار، والمعايير التي نلتزم بها.",
  },
  hero: {
    badge: "من نحن",
    titleA: "الفريق الذي يقف وراء",
    lead: "{brand} موقع مجاني لاختبار سرعة الإنترنت وأدوات الشبكات، تشغّله شركة {company}. مهمتنا أن نوفّر للجميع وسيلة سريعة ودقيقة وتحترم الخصوصية لقياس اتصالهم بالإنترنت.",
    ctaPrimary: "اختبر سرعتك",
    ctaSecondary: "اتصل بنا",
  },
  facts: [
    { label: "الجهة المشغّلة", value: "{company}" },
    { label: "السعر", value: "مجاني ودون تسجيل" },
    { label: "اللغات", value: "5 لغات" },
    { label: "التواصل", value: "{email}" },
  ],
  mission: {
    kicker: "مهمتنا",
    title: "اعرف بدقة ما يقدّمه لك اتصالك",
    paragraphs: [
      "يدفع كثير من الناس اشتراك الإنترنت كل شهر دون وسيلة سهلة لمعرفة ما إذا كانوا يحصلون فعلًا على ما يدفعون مقابله. أنشأنا {brand} لتغيير ذلك: اختبار سرعة حديث وواضح يقيس سرعة التنزيل وسرعة الرفع وزمن الاستجابة (Ping) والتذبذب (Jitter) في ثوانٍ، ثم يشرح لك ما تعنيه هذه الأرقام.",
      "وإلى جانب السرعة، نساعدك على فهم اتصالك من خلال أدوات مثل صفحة [ما هو عنوان IP الخاص بي](/what-is-my-ip) وأداة [تقييم مخاطر IP](/ip-risk-score)، ومن خلال أدلة عملية مكتوبة بلغة بسيطة.",
    ],
  },
  offer: {
    kicker: "ما نقدّمه",
    title: "أدوات وأدلة لاتصال أفضل",
    lead: "كل شيء مجاني ويعمل في متصفحك على أي جهاز، دون تطبيق ودون حساب.",
    items: [
      {
        title: "اختبار سرعة الإنترنت",
        text: "قِس سرعة التنزيل والرفع وزمن الاستجابة والتذبذب في ثوانٍ، بنتائج يفهمها الجميع.",
        href: "/",
        cta: "ابدأ الاختبار",
      },
      {
        title: "ما هو عنوان IP الخاص بي",
        text: "اطّلع بنظرة سريعة على عنوان IP العام وموقعك التقريبي ومزوّد خدمة الإنترنت.",
        href: "/what-is-my-ip",
        cta: "اعرض عنوان IP",
      },
      {
        title: "تقييم مخاطر IP",
        text: "تحقّق مما إذا كان عنوان IP يبدو كخادم وكيل (Proxy) أو شبكة VPN أو مصدرًا لإساءة الاستخدام.",
        href: "/ip-risk-score",
        cta: "افحص عنوان IP",
      },
      {
        title: "أدلة ومقالات",
        text: "مساعدة عملية حول شبكات WiFi وزمن الاستجابة والبث والشبكات المنزلية وإصلاح بطء الإنترنت.",
        href: "/blog",
        cta: "اقرأ المدونة",
      },
    ],
  },
  how: {
    kicker: "كيف يعمل الاختبار",
    title: "عمليات نقل حقيقية تُقاس في متصفحك",
    lead: "يعمل اختبار السرعة بالكامل داخل متصفحك ويقيس عمليات نقل بيانات حقيقية عبر عدة اتصالات متوازية.",
    steps: [
      { title: "زمن الاستجابة", text: "نرسل سلسلة من الطلبات الصغيرة لقياس زمن الاستجابة (Ping) والتذبذب (مدى تغيّره)." },
      { title: "التنزيل", text: "ينزّل متصفحك بيانات اختبارية عبر عدة اتصالات متوازية لقياس سرعة استقبالك للبيانات." },
      { title: "الرفع", text: "ثم يرسل متصفحك بيانات اختبارية لقياس سرعة إرسالك للبيانات." },
      { title: "النتائج", text: "نعرض سرعة التنزيل والرفع وزمن الاستجابة والتذبذب، ونشرح ما تعنيه في الاستخدام اليومي." },
    ],
    more: "اقرأ التفاصيل الكاملة حول [طريقة عمل اختبار السرعة لدينا](/how-it-works)، أو اطّلع على [ما يُعدّ سرعة إنترنت جيدة](/guides/good-internet-speed).",
  },
  editorial: {
    kicker: "المعايير التحريرية",
    title: "أدلة يمكنك الوثوق بها",
    text: "ينشر فريقنا التحريري أدلة عملية على [مدونة {brand}](/blog). يستند كل مقال إلى الوثائق والمعايير الرسمية، ويُراجَع للتأكد من دقته، ويُحدَّث عند تغيّر المعلومات. ولا يؤثّر المعلنون أبدًا فيما نكتبه.",
    cta: "اقرأ سياستنا التحريرية",
  },
  values: {
    kicker: "قيمنا",
    title: "المبادئ التي نلتزم بها",
    items: [
      {
        title: "الدقة في صميم التصميم",
        text: "نقيس عمليات نقل حقيقية عبر اتصالات متوازية، لتعكس نتائجك سرعتك الفعلية.",
      },
      {
        title: "خصوصية ومجانية",
        text: "دون تسجيل ودون تطبيق ودون بيع للبيانات الشخصية. أجرِ ما تشاء من الاختبارات على أي جهاز.",
      },
      {
        title: "بساطة للجميع",
        text: "نقرة واحدة لاختبار سرعة التنزيل والرفع وزمن الاستجابة والتذبذب، بنتائج يفهمها الجميع.",
      },
      {
        title: "الشفافية",
        text: "نشرح كيف تعمل أدواتنا، ومن أين تأتي معلوماتنا، وكيف يُموَّل الموقع.",
      },
    ],
  },
  company: {
    title: "تشغّله {company}",
    subtitle: "الشركة التي تقف وراء {brand}",
    text: "{brand} مملوك لشركة {company} وتتولى تشغيله. للشراكات أو الاستفسارات الصحفية أو العامة، تواصل معنا عبر [صفحة الاتصال](/contact) أو راسلنا على {email}.",
    links: "السياسات",
  },
  cta: {
    title: "هل أنت مستعد لفحص اتصالك؟",
    text: "أجرِ اختبار سرعة مجانيًا في ثوانٍ، دون تطبيق ودون تسجيل.",
    button: "ابدأ اختبار السرعة",
  },
};

const ru: AboutMessages = {
  meta: {
    title: "О нас: кто создал этот тест скорости",
    description:
      "О сервисе TestSpeedInternet — бесплатном тесте скорости интернета от ZONEPAY LTD: наша миссия, инструменты и статьи, как работает тест и каких стандартов мы придерживаемся.",
  },
  hero: {
    badge: "О нас",
    titleA: "Команда, которая создала",
    lead: "{brand} — бесплатный сайт для проверки скорости интернета и сетевых инструментов, которым управляет компания {company}. Наша миссия — дать каждому быстрый, точный и конфиденциальный способ измерить своё интернет-соединение.",
    ctaPrimary: "Проверить скорость",
    ctaSecondary: "Связаться с нами",
  },
  facts: [
    { label: "Оператор", value: "{company}" },
    { label: "Стоимость", value: "Бесплатно, без регистрации" },
    { label: "Языки", value: "5 языков" },
    { label: "Контакты", value: "{email}" },
  ],
  mission: {
    kicker: "Наша миссия",
    title: "Точно знать, что даёт ваше подключение",
    paragraphs: [
      "Многие платят за интернет каждый месяц, но не имеют простого способа проверить, получают ли они то, за что платят. Мы создали {brand}, чтобы это изменить: современный и понятный тест скорости, который за несколько секунд измеряет скорость загрузки, скорость отдачи, пинг и джиттер, а затем объясняет, что означают эти цифры.",
      "Помимо скорости, мы помогаем разобраться в подключении с помощью таких инструментов, как страница [Мой IP-адрес](/what-is-my-ip) и проверка [оценки риска IP](/ip-risk-score), а также практических руководств, написанных простым языком.",
    ],
  },
  offer: {
    kicker: "Что мы предлагаем",
    title: "Инструменты и руководства для лучшего соединения",
    lead: "Всё бесплатно и работает прямо в браузере на любом устройстве. Без приложений и без учётной записи.",
    items: [
      {
        title: "Тест скорости интернета",
        text: "Измерьте скорость загрузки и отдачи, пинг и джиттер за несколько секунд — с понятными каждому результатами.",
        href: "/",
        cta: "Запустить тест",
      },
      {
        title: "Мой IP-адрес",
        text: "Сразу узнайте свой публичный IP-адрес, примерное местоположение и интернет-провайдера.",
        href: "/what-is-my-ip",
        cta: "Узнать мой IP",
      },
      {
        title: "Оценка риска IP",
        text: "Проверьте, похож ли IP-адрес на прокси, VPN или источник злоупотреблений.",
        href: "/ip-risk-score",
        cta: "Проверить IP",
      },
      {
        title: "Руководства и статьи",
        text: "Практические советы о WiFi, пинге, стриминге, домашней сети и устранении медленного интернета.",
        href: "/blog",
        cta: "Читать блог",
      },
    ],
  },
  how: {
    kicker: "Как работает тест",
    title: "Реальная передача данных, измеренная в браузере",
    lead: "Тест скорости полностью выполняется в вашем браузере и измеряет реальную передачу данных по нескольким параллельным соединениям.",
    steps: [
      { title: "Задержка", text: "Мы отправляем серию небольших запросов, чтобы измерить пинг (время отклика) и джиттер (насколько оно колеблется)." },
      { title: "Загрузка", text: "Браузер скачивает тестовые данные по нескольким параллельным соединениям, чтобы измерить, как быстро вы получаете данные." },
      { title: "Отдача", text: "Затем браузер отправляет тестовые данные обратно, чтобы измерить, как быстро вы можете передавать данные." },
      { title: "Результаты", text: "Мы показываем скорость загрузки и отдачи, пинг и джиттер и объясняем, что они значат для повседневного использования." },
    ],
    more: "Подробнее о том, [как работает наш тест скорости](/how-it-works), или узнайте, [какая скорость интернета считается хорошей](/guides/good-internet-speed).",
  },
  editorial: {
    kicker: "Редакционные стандарты",
    title: "Руководства, которым можно доверять",
    text: "Наша редакция публикует практические руководства в [блоге {brand}](/blog). Каждая статья основана на официальной документации и стандартах, проверяется на точность и обновляется, когда что-то меняется. Рекламодатели никогда не влияют на то, что мы пишем.",
    cta: "Наша редакционная политика",
  },
  values: {
    kicker: "Наши ценности",
    title: "Наши принципы",
    items: [
      {
        title: "Точность по умолчанию",
        text: "Мы измеряем реальную передачу данных по параллельным соединениям, поэтому результаты отражают вашу реальную скорость.",
      },
      {
        title: "Конфиденциально и бесплатно",
        text: "Без регистрации, без приложений и без продажи персональных данных. Проводите сколько угодно тестов на любом устройстве.",
      },
      {
        title: "Просто для всех",
        text: "Одно нажатие — и вы узнаете скорость загрузки и отдачи, пинг и джиттер, с понятными каждому результатами.",
      },
      {
        title: "Прозрачность",
        text: "Мы объясняем, как работают наши инструменты, откуда берётся информация и как финансируется сайт.",
      },
    ],
  },
  company: {
    title: "Оператор — {company}",
    subtitle: "Компания, стоящая за {brand}",
    text: "{brand} принадлежит компании {company}, которая и управляет сервисом. По вопросам партнёрства, для прессы или с общими вопросами пишите через [страницу контактов](/contact) или на {email}.",
    links: "Документы",
  },
  cta: {
    title: "Готовы проверить соединение?",
    text: "Бесплатный тест скорости за несколько секунд. Без приложений и регистрации.",
    button: "Начать тест скорости",
  },
};

export const aboutMessages: Record<Locale, AboutMessages> = { en, fr, es, ar, ru };
