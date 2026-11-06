import type { Locale } from "../../config";
import type { LegalDoc } from "../legal";

const en: LegalDoc = {
  meta: {
    title: "Editorial Policy",
    description:
      "How the TestSpeedInternet editorial team researches, writes, fact-checks and updates its internet speed, WiFi and home networking guides, and why ads never influence them.",
  },
  badge: "Our standards",
  title: "Editorial Policy",
  intro:
    "Our guides help people understand and improve their internet connection. This page explains how the {brand} editorial team creates, checks and maintains that content.",
  sections: [
    {
      id: "who-writes",
      heading: "Who writes our content",
      body: [
        "Articles on {brand} are produced by our in-house editorial team at {company}. The team focuses on home networking, broadband, WiFi and online performance, and writes for everyday users rather than network engineers.",
      ],
    },
    {
      id: "research",
      heading: "How we research",
      body: [
        "We base our guides on official documentation and standards: internet provider and streaming service help pages, Wi-Fi Alliance and IEEE specifications, regulator guidance (such as the FCC and Ofcom), and router and operating system manuals.",
        "Where an article gives figures, such as the speed a streaming service recommends or a typical ping range, we use conservative, widely documented numbers and describe them as typical rather than guaranteed. Real-world results depend on your provider, equipment and home.",
      ],
    },
    {
      id: "fact-checking",
      heading: "Accuracy and fact-checking",
      body: [
        "Before an article is published, it is reviewed for technical accuracy, clarity and completeness. Steps such as Windows or macOS settings are checked against the current versions of those systems.",
        "We do not publish invented statistics, fake reviews or made-up quotes.",
      ],
    },
    {
      id: "corrections",
      heading: "Updates and corrections",
      body: [
        'Technology changes quickly. We review our guides regularly and update them when standards, service requirements or best practices change. When an article is meaningfully updated, its "Updated" date changes.',
        "If you spot an error, please tell us through our [contact page](/contact) or at {email}. We review every correction request and fix confirmed mistakes promptly.",
      ],
    },
    {
      id: "independence",
      heading: "Independence and advertising",
      body: [
        "Our content is editorially independent. Advertisers do not review, approve or influence our articles, and we do not accept payment to change our recommendations.",
        "The site is funded by advertising, including Google AdSense. Ads are always clearly separated from editorial content and labeled where required. Sponsored links, if any, are marked as sponsored.",
      ],
    },
    {
      id: "our-tools",
      heading: "Our tools",
      body: [
        "Our [speed test](/), [IP lookup](/what-is-my-ip) and [IP risk](/ip-risk-score) tools are built and maintained by the same team. The [How It Works](/how-it-works) page explains how the speed test measures download, upload, ping and jitter so you can understand and trust your results.",
      ],
    },
  ],
};

const fr: LegalDoc = {
  meta: {
    title: "Politique éditoriale",
    description:
      "Comment l'équipe éditoriale de TestSpeedInternet recherche, rédige, vérifie et met à jour ses guides sur le débit Internet, le WiFi et le réseau domestique, sans influence publicitaire.",
  },
  badge: "Nos standards",
  title: "Politique éditoriale",
  intro:
    "Nos guides aident chacun à comprendre et à améliorer sa connexion Internet. Cette page explique comment l'équipe éditoriale de {brand} crée, vérifie et tient à jour ces contenus.",
  sections: [
    {
      id: "who-writes",
      heading: "Qui rédige nos contenus",
      body: [
        "Les articles de {brand} sont produits par notre équipe éditoriale interne chez {company}. L'équipe se consacre au réseau domestique, au haut débit, au WiFi et aux performances en ligne, et écrit pour le grand public plutôt que pour des ingénieurs réseau.",
      ],
    },
    {
      id: "research",
      heading: "Nos méthodes de recherche",
      body: [
        "Nos guides s'appuient sur des documentations et des normes officielles : pages d'aide des fournisseurs d'accès et des services de streaming, spécifications de la Wi-Fi Alliance et de l'IEEE, recommandations des régulateurs (comme la FCC et l'Ofcom) et manuels des routeurs et des systèmes d'exploitation.",
        "Lorsqu'un article donne des chiffres, comme le débit recommandé par un service de streaming ou une plage de ping habituelle, nous retenons des valeurs prudentes et largement documentées, présentées comme indicatives et non garanties. Les résultats réels dépendent de votre fournisseur, de votre équipement et de votre logement.",
      ],
    },
    {
      id: "fact-checking",
      heading: "Exactitude et vérification des faits",
      body: [
        "Avant sa publication, chaque article est relu pour vérifier son exactitude technique, sa clarté et son exhaustivité. Les manipulations, par exemple les réglages de Windows ou de macOS, sont vérifiées sur les versions actuelles de ces systèmes.",
        "Nous ne publions ni statistiques inventées, ni faux avis, ni citations fabriquées.",
      ],
    },
    {
      id: "corrections",
      heading: "Mises à jour et corrections",
      body: [
        "La technologie évolue vite. Nous révisons régulièrement nos guides et les mettons à jour lorsque les normes, les exigences des services ou les bonnes pratiques changent. Lorsqu'un article est mis à jour de manière significative, sa date de « Mise à jour » change.",
        "Si vous repérez une erreur, signalez-la-nous via notre [page de contact](/contact) ou à {email}. Nous examinons chaque demande de correction et corrigeons rapidement les erreurs confirmées.",
      ],
    },
    {
      id: "independence",
      heading: "Indépendance et publicité",
      body: [
        "Nos contenus sont éditorialement indépendants. Les annonceurs ne relisent, n'approuvent ni n'influencent nos articles, et nous n'acceptons aucune rémunération pour modifier nos recommandations.",
        "Le site est financé par la publicité, notamment Google AdSense. Les annonces sont toujours clairement séparées du contenu éditorial et signalées comme telles lorsque c'est requis. Les éventuels liens sponsorisés sont identifiés comme sponsorisés.",
      ],
    },
    {
      id: "our-tools",
      heading: "Nos outils",
      body: [
        "Nos outils de [test de débit](/), de [recherche d'adresse IP](/what-is-my-ip) et d'[évaluation du risque IP](/ip-risk-score) sont conçus et maintenus par la même équipe. La page [Comment ça marche](/how-it-works) explique comment le test mesure le débit descendant, le débit montant, le ping et la gigue, pour que vous puissiez comprendre vos résultats et leur faire confiance.",
      ],
    },
  ],
};

const es: LegalDoc = {
  meta: {
    title: "Política editorial",
    description:
      "Cómo el equipo editorial de TestSpeedInternet investiga, redacta, verifica y actualiza sus guías sobre velocidad de internet, WiFi y redes domésticas, sin influencia de anunciantes.",
  },
  badge: "Nuestros estándares",
  title: "Política editorial",
  intro:
    "Nuestras guías ayudan a las personas a entender y mejorar su conexión a internet. Esta página explica cómo el equipo editorial de {brand} crea, revisa y mantiene ese contenido.",
  sections: [
    {
      id: "who-writes",
      heading: "Quién escribe nuestro contenido",
      body: [
        "Los artículos de {brand} los elabora nuestro equipo editorial interno de {company}. El equipo se especializa en redes domésticas, banda ancha, WiFi y rendimiento en línea, y escribe para usuarios cotidianos, no para ingenieros de redes.",
      ],
    },
    {
      id: "research",
      heading: "Cómo investigamos",
      body: [
        "Basamos nuestras guías en documentación y estándares oficiales: páginas de ayuda de proveedores de internet y servicios de streaming, especificaciones de la Wi-Fi Alliance y del IEEE, orientaciones de organismos reguladores (como la FCC y Ofcom) y manuales de routers y sistemas operativos.",
        "Cuando un artículo ofrece cifras, como la velocidad que recomienda un servicio de streaming o un rango de ping habitual, usamos valores prudentes y ampliamente documentados, y los presentamos como orientativos, no garantizados. Los resultados reales dependen de tu proveedor, tu equipo y tu hogar.",
      ],
    },
    {
      id: "fact-checking",
      heading: "Exactitud y verificación de datos",
      body: [
        "Antes de publicarse, cada artículo se revisa para comprobar su exactitud técnica, claridad y exhaustividad. Los pasos, como los ajustes de Windows o macOS, se verifican con las versiones actuales de esos sistemas.",
        "No publicamos estadísticas inventadas, reseñas falsas ni citas fabricadas.",
      ],
    },
    {
      id: "corrections",
      heading: "Actualizaciones y correcciones",
      body: [
        "La tecnología cambia rápido. Revisamos nuestras guías con regularidad y las actualizamos cuando cambian los estándares, los requisitos de los servicios o las buenas prácticas. Cuando un artículo se actualiza de forma significativa, cambia su fecha de «Actualizado».",
        "Si detectas un error, avísanos a través de nuestra [página de contacto](/contact) o en {email}. Revisamos cada solicitud de corrección y subsanamos con rapidez los errores confirmados.",
      ],
    },
    {
      id: "independence",
      heading: "Independencia y publicidad",
      body: [
        "Nuestro contenido es editorialmente independiente. Los anunciantes no revisan, aprueban ni influyen en nuestros artículos, y no aceptamos pagos para cambiar nuestras recomendaciones.",
        "El sitio se financia con publicidad, incluida Google AdSense. Los anuncios están siempre claramente separados del contenido editorial y se identifican cuando es obligatorio. Los enlaces patrocinados, si los hay, se marcan como patrocinados.",
      ],
    },
    {
      id: "our-tools",
      heading: "Nuestras herramientas",
      body: [
        "Nuestras herramientas de [test de velocidad](/), [consulta de IP](/what-is-my-ip) y [riesgo de IP](/ip-risk-score) las desarrolla y mantiene el mismo equipo. La página [Cómo funciona](/how-it-works) explica cómo el test mide la descarga, la subida, el ping y el jitter para que puedas entender tus resultados y confiar en ellos.",
      ],
    },
  ],
};

const ar: LegalDoc = {
  meta: {
    title: "السياسة التحريرية",
    description:
      "كيف يبحث فريق التحرير في TestSpeedInternet ويكتب أدلته حول سرعة الإنترنت والواي فاي والشبكات المنزلية ويدقّقها ويحدّثها، ولماذا لا تؤثر الإعلانات فيها أبدًا.",
  },
  badge: "معاييرنا",
  title: "السياسة التحريرية",
  intro:
    "تساعد أدلتنا الناس على فهم اتصالهم بالإنترنت وتحسينه. وتوضّح هذه الصفحة كيف يُعِدّ فريق التحرير في {brand} هذا المحتوى ويدقّقه ويحافظ على تحديثه.",
  sections: [
    {
      id: "who-writes",
      heading: "من يكتب محتوانا",
      body: [
        "يُعِدّ مقالات {brand} فريقُ التحرير الداخلي لدينا في شركة {company}. ويركّز الفريق على الشبكات المنزلية والإنترنت عريض النطاق والواي فاي والأداء عبر الإنترنت، ويكتب للمستخدمين العاديين لا لمهندسي الشبكات.",
      ],
    },
    {
      id: "research",
      heading: "كيف نُجري أبحاثنا",
      body: [
        "نعتمد في أدلتنا على الوثائق والمعايير الرسمية: صفحات المساعدة لدى مزوّدي الإنترنت وخدمات البث، ومواصفات Wi-Fi Alliance وIEEE، وإرشادات الجهات التنظيمية (مثل FCC وOfcom)، وأدلة أجهزة الراوتر وأنظمة التشغيل.",
        "عندما يقدّم المقال أرقامًا، مثل السرعة التي توصي بها خدمة بث أو النطاق المعتاد لزمن الاستجابة (Ping)، فإننا نستخدم أرقامًا متحفّظة وموثّقة على نطاق واسع، ونصفها بأنها نموذجية لا مضمونة. فالنتائج الفعلية تعتمد على مزوّد الخدمة لديك وأجهزتك ومنزلك.",
      ],
    },
    {
      id: "fact-checking",
      heading: "الدقة والتحقق من المعلومات",
      body: [
        "قبل نشر أي مقال، تجري مراجعته للتحقق من دقته التقنية ووضوحه واكتماله. ويُتحقَّق من الخطوات، مثل إعدادات Windows أو macOS، على الإصدارات الحالية من هذه الأنظمة.",
        "لا ننشر إحصاءات مختلَقة أو مراجعات مزيّفة أو اقتباسات ملفّقة.",
      ],
    },
    {
      id: "corrections",
      heading: "التحديثات والتصحيحات",
      body: [
        "تتغيّر التقنية بسرعة. لذلك نراجع أدلتنا بانتظام ونحدّثها عندما تتغيّر المعايير أو متطلبات الخدمات أو أفضل الممارسات. وعندما يُحدَّث مقال تحديثًا جوهريًا، يتغيّر تاريخ «آخر تحديث» الخاص به.",
        "إذا لاحظت خطأً، فيُرجى إبلاغنا عبر [صفحة الاتصال](/contact) أو على {email}. ونحن نراجع كل طلب تصحيح ونصلح الأخطاء المؤكَّدة على الفور.",
      ],
    },
    {
      id: "independence",
      heading: "الاستقلالية والإعلانات",
      body: [
        "محتوانا مستقل تحريريًا. فالمعلنون لا يراجعون مقالاتنا ولا يوافقون عليها ولا يؤثرون فيها، ولا نقبل أي مقابل مادي لتغيير توصياتنا.",
        "يُموَّل الموقع من الإعلانات، ومنها Google AdSense. وتكون الإعلانات دائمًا منفصلة بوضوح عن المحتوى التحريري، ويُشار إليها بصفتها إعلانات حيثما يكون ذلك مطلوبًا. أما الروابط المموَّلة، إن وُجدت، فيُشار إليها بأنها مموَّلة.",
      ],
    },
    {
      id: "our-tools",
      heading: "أدواتنا",
      body: [
        "يتولى الفريق نفسه بناء أدواتنا وصيانتها: [اختبار السرعة](/) و[البحث عن عنوان IP](/what-is-my-ip) و[تقييم مخاطر IP](/ip-risk-score). وتشرح صفحة [كيف يعمل الاختبار](/how-it-works) كيفية قياس سرعة التنزيل والرفع وزمن الاستجابة (Ping) والتذبذب (Jitter)، لتتمكّن من فهم نتائجك والثقة بها.",
      ],
    },
  ],
};

const ru: LegalDoc = {
  meta: {
    title: "Редакционная политика",
    description:
      "Как редакция TestSpeedInternet исследует, пишет, проверяет и обновляет руководства о скорости интернета, WiFi и домашних сетях и почему реклама никогда на них не влияет.",
  },
  badge: "Наши стандарты",
  title: "Редакционная политика",
  intro:
    "Наши руководства помогают людям разобраться в своём интернет-соединении и улучшить его. На этой странице рассказано, как редакция {brand} создаёт, проверяет и поддерживает этот контент в актуальном состоянии.",
  sections: [
    {
      id: "who-writes",
      heading: "Кто пишет наши материалы",
      body: [
        "Статьи на {brand} готовит наша штатная редакция в {company}. Команда специализируется на домашних сетях, широкополосном доступе, WiFi и производительности в интернете и пишет для обычных пользователей, а не для сетевых инженеров.",
      ],
    },
    {
      id: "research",
      heading: "Как мы собираем информацию",
      body: [
        "Наши руководства основаны на официальной документации и стандартах: справочных страницах интернет-провайдеров и стриминговых сервисов, спецификациях Wi-Fi Alliance и IEEE, рекомендациях регуляторов (например, FCC и Ofcom), а также руководствах к роутерам и операционным системам.",
        "Когда в статье приводятся цифры — например, скорость, рекомендуемая стриминговым сервисом, или типичный диапазон пинга, — мы используем консервативные, широко задокументированные значения и называем их типичными, а не гарантированными. Реальные результаты зависят от вашего провайдера, оборудования и условий дома.",
      ],
    },
    {
      id: "fact-checking",
      heading: "Точность и проверка фактов",
      body: [
        "Перед публикацией каждая статья проверяется на техническую точность, ясность и полноту. Инструкции, например настройки Windows или macOS, сверяются с актуальными версиями этих систем.",
        "Мы не публикуем выдуманную статистику, фальшивые отзывы или вымышленные цитаты.",
      ],
    },
    {
      id: "corrections",
      heading: "Обновления и исправления",
      body: [
        "Технологии быстро меняются. Мы регулярно пересматриваем наши руководства и обновляем их, когда меняются стандарты, требования сервисов или лучшие практики. При существенном обновлении статьи меняется её дата «Обновлено».",
        "Если вы заметили ошибку, сообщите нам через [страницу контактов](/contact) или по адресу {email}. Мы рассматриваем каждый запрос на исправление и оперативно устраняем подтверждённые ошибки.",
      ],
    },
    {
      id: "independence",
      heading: "Независимость и реклама",
      body: [
        "Наш контент редакционно независим. Рекламодатели не просматривают, не согласовывают наши статьи и не влияют на них, и мы не принимаем оплату за изменение наших рекомендаций.",
        "Сайт финансируется за счёт рекламы, в том числе Google AdSense. Реклама всегда чётко отделена от редакционного контента и помечается, когда это требуется. Спонсорские ссылки, если они есть, отмечаются как спонсорские.",
      ],
    },
    {
      id: "our-tools",
      heading: "Наши инструменты",
      body: [
        "Наши инструменты — [тест скорости](/), [проверка IP](/what-is-my-ip) и [оценка риска IP](/ip-risk-score) — разрабатывает и поддерживает та же команда. На странице [Как это работает](/how-it-works) объясняется, как тест измеряет загрузку, отдачу, пинг и джиттер, чтобы вы могли понимать свои результаты и доверять им.",
      ],
    },
  ],
};

export const editorialMessages: Record<Locale, LegalDoc> = { en, fr, es, ar, ru };
