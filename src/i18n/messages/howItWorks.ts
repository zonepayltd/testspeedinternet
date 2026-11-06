import type { Locale } from "../config";

// "How it works" methodology page.
const en = {
  meta: {
    title: "How Our Internet Speed Test Works",
    description:
      "Learn how our internet speed test works. See how we measure your download speed, upload speed, ping and jitter using global servers and parallel connections.",
    keywords: [
      "how internet speed test works",
      "how speed test measures",
      "how is internet speed measured",
      "download upload ping explained",
      "speed test methodology",
    ],
  },
  hero: {
    eyebrow: "How it works",
    titleLead: "How our speed test",
    titleHighlight: "measures your connection",
    intro:
      "A simple, transparent process that checks your download, upload, ping and jitter in less than a minute, right in your browser.",
  },
  stepsTitle: "What happens when you press GO",
  stepsIntro: "The test runs in five stages. Each one measures a different part of your connection.",
  stepLabel: "Step",
  steps: [
    {
      title: "You press GO",
      text: "The test starts instantly in your browser. There is nothing to install and no account to create.",
    },
    {
      title: "We measure ping and jitter",
      text: "First we send a series of small requests to a nearby server. The fastest round trip is your ping, and the variation between them is your jitter, both in milliseconds.",
    },
    {
      title: "We test download speed",
      text: "We open several parallel connections and download data for a few seconds, measuring how fast your connection receives it in Mbps.",
    },
    {
      title: "We test upload speed",
      text: "Next we send data the other way to measure how fast your connection can upload, again using multiple parallel streams.",
    },
    {
      title: "You get your results",
      text: "We calculate your real throughput and show your download, upload, ping and jitter, together with your provider and approximate location.",
    },
  ],
  detailsTitle: "Built for accurate results",
  detailsIntro: "The same techniques professional speed tests rely on, with nothing hidden.",
  details: [
    {
      title: "Global server network",
      text: "Tests run against a worldwide edge network with servers in hundreds of cities, so your data travels over the real internet to a location close to you.",
    },
    {
      title: "Parallel connections",
      text: "Several simultaneous connections fully saturate your line, revealing your true maximum speed instead of the limit of a single connection.",
    },
    {
      title: "Live measurement",
      text: "Speed is sampled continuously while data flows, and the gauge shows it in real time. The first moments of each transfer are treated as warm-up and excluded, so connection setup doesn't drag your result down.",
    },
    {
      title: "Private by design",
      text: "The test only moves random data. We don't read your traffic or ask for personal details, and you don't need an account.",
    },
  ],
  accuracy: {
    title: "How to get the most accurate result",
    intro: "Your result reflects the whole path from your device to the server. These habits remove the most common sources of error.",
    items: [
      "Use a wired Ethernet connection to measure the speed your provider delivers.",
      "Pause downloads, streaming, cloud backups and game updates on other devices.",
      "Disconnect from your VPN unless you want to measure the VPN itself.",
      "Close other browser tabs and keep this tab visible during the test.",
      "Run two or three tests at different times of day and compare them.",
    ],
  },
  faqTitle: "Methodology FAQ",
  faqs: [
    {
      q: "Why do different speed tests show different results?",
      a: "Each service uses different servers, locations and measurement methods, and your connection changes from second to second. Small differences are normal; compare results from the same tool over time for the most meaningful picture.",
    },
    {
      q: "Why does the test use several connections at once?",
      a: "A single connection often can't fill a fast line on its own. Using several parallel streams is the standard way to measure the full capacity of your connection, and it matches how browsers and apps download today.",
    },
    {
      q: "Does the test store my personal data?",
      a: "No account is needed and the test only transfers random data. Your IP address is used to show your provider and approximate location, as explained in our privacy policy.",
    },
    {
      q: "Why is my ping higher in games than in the test?",
      a: "The test measures latency to a nearby server. Game servers are often further away, and games add their own processing time, so in-game ping is usually higher.",
    },
  ],
  howToName: "How to test your internet speed",
  cta: {
    title: "See it in action",
    text: "Run a free test now. It takes less than a minute.",
    button: "Try it now",
  },
};

export type HowItWorksMessages = typeof en;

const fr: HowItWorksMessages = {
  meta: {
    title: "Comment fonctionne notre test de débit",
    description:
      "Découvrez comment fonctionne notre test de débit : mesure du débit descendant, montant, du ping et de la gigue via des serveurs mondiaux et flux parallèles.",
    keywords: [
      "comment fonctionne un test de débit",
      "comment mesurer son débit internet",
      "test de vitesse internet explication",
      "débit descendant montant ping expliqué",
      "méthodologie test de débit",
    ],
  },
  hero: {
    eyebrow: "Fonctionnement",
    titleLead: "Comment notre test de débit",
    titleHighlight: "mesure votre connexion",
    intro:
      "Un processus simple et transparent qui vérifie votre débit descendant, votre débit montant, votre ping et votre gigue en moins d'une minute, directement dans votre navigateur.",
  },
  stepsTitle: "Que se passe-t-il quand vous appuyez sur GO ?",
  stepsIntro: "Le test se déroule en cinq étapes. Chacune mesure un aspect différent de votre connexion.",
  stepLabel: "Étape",
  steps: [
    {
      title: "Vous appuyez sur GO",
      text: "Le test démarre instantanément dans votre navigateur. Rien à installer, aucun compte à créer.",
    },
    {
      title: "Nous mesurons le ping et la gigue",
      text: "Nous envoyons d'abord une série de petites requêtes à un serveur proche. L'aller-retour le plus rapide correspond à votre ping, et la variation entre ces mesures à votre gigue, les deux en millisecondes.",
    },
    {
      title: "Nous testons le débit descendant",
      text: "Nous ouvrons plusieurs connexions parallèles et téléchargeons des données pendant quelques secondes pour mesurer, en Mbps, la vitesse à laquelle votre connexion les reçoit.",
    },
    {
      title: "Nous testons le débit montant",
      text: "Nous envoyons ensuite des données dans l'autre sens pour mesurer la vitesse d'envoi de votre connexion, là encore avec plusieurs flux parallèles.",
    },
    {
      title: "Vous obtenez vos résultats",
      text: "Nous calculons votre débit réel et affichons votre débit descendant, votre débit montant, votre ping et votre gigue, ainsi que votre fournisseur d'accès et votre localisation approximative.",
    },
  ],
  detailsTitle: "Conçu pour des résultats précis",
  detailsIntro: "Les mêmes techniques que les tests de débit professionnels, en toute transparence.",
  details: [
    {
      title: "Réseau de serveurs mondial",
      text: "Les tests s'appuient sur un réseau edge mondial avec des serveurs dans des centaines de villes : vos données transitent par le véritable internet jusqu'à un point proche de chez vous.",
    },
    {
      title: "Connexions parallèles",
      text: "Plusieurs connexions simultanées saturent entièrement votre ligne et révèlent votre véritable débit maximal, au lieu de la limite d'une seule connexion.",
    },
    {
      title: "Mesure en temps réel",
      text: "Le débit est échantillonné en continu pendant le transfert des données, et le compteur l'affiche en temps réel. Les premiers instants de chaque transfert servent de phase de démarrage et sont exclus, afin que l'établissement de la connexion ne fasse pas baisser votre résultat.",
    },
    {
      title: "Confidentialité par conception",
      text: "Le test ne transfère que des données aléatoires. Nous ne lisons pas votre trafic, ne demandons aucune information personnelle, et aucun compte n'est nécessaire.",
    },
  ],
  accuracy: {
    title: "Comment obtenir le résultat le plus précis",
    intro: "Votre résultat reflète tout le trajet entre votre appareil et le serveur. Ces bonnes pratiques éliminent les sources d'erreur les plus courantes.",
    items: [
      "Utilisez une connexion Ethernet filaire pour mesurer le débit réellement fourni par votre opérateur.",
      "Mettez en pause les téléchargements, le streaming, les sauvegardes cloud et les mises à jour de jeux sur vos autres appareils.",
      "Déconnectez-vous de votre VPN, sauf si vous souhaitez mesurer le VPN lui-même.",
      "Fermez les autres onglets du navigateur et gardez cet onglet visible pendant le test.",
      "Effectuez deux ou trois tests à différents moments de la journée et comparez-les.",
    ],
  },
  faqTitle: "FAQ sur la méthodologie",
  faqs: [
    {
      q: "Pourquoi les tests de débit donnent-ils des résultats différents ?",
      a: "Chaque service utilise des serveurs, des emplacements et des méthodes de mesure différents, et votre connexion varie d'une seconde à l'autre. De petits écarts sont normaux ; pour une vision vraiment pertinente, comparez dans le temps les résultats d'un même outil.",
    },
    {
      q: "Pourquoi le test utilise-t-il plusieurs connexions à la fois ?",
      a: "Une seule connexion ne suffit souvent pas à remplir une ligne rapide. Utiliser plusieurs flux parallèles est la méthode standard pour mesurer la pleine capacité de votre connexion, et cela correspond à la façon dont les navigateurs et les applications téléchargent aujourd'hui.",
    },
    {
      q: "Le test conserve-t-il mes données personnelles ?",
      a: "Aucun compte n'est nécessaire et le test ne transfère que des données aléatoires. Votre adresse IP sert à afficher votre fournisseur d'accès et votre localisation approximative, comme l'explique notre politique de confidentialité.",
    },
    {
      q: "Pourquoi mon ping est-il plus élevé en jeu que dans le test ?",
      a: "Le test mesure la latence vers un serveur proche. Les serveurs de jeu sont souvent plus éloignés, et les jeux ajoutent leur propre temps de traitement : le ping en jeu est donc généralement plus élevé.",
    },
  ],
  howToName: "Comment tester votre débit internet",
  cta: {
    title: "Voyez-le en action",
    text: "Lancez un test gratuit maintenant. Cela prend moins d'une minute.",
    button: "Essayer maintenant",
  },
};

const es: HowItWorksMessages = {
  meta: {
    title: "Cómo funciona nuestro test de velocidad",
    description:
      "Descubre cómo funciona nuestro test de velocidad: medimos tu velocidad de descarga, de subida, ping y jitter con servidores globales y conexiones paralelas.",
    keywords: [
      "cómo funciona un test de velocidad",
      "cómo se mide la velocidad de internet",
      "test de velocidad de internet explicado",
      "descarga subida y ping explicados",
      "metodología del test de velocidad",
    ],
  },
  hero: {
    eyebrow: "Cómo funciona",
    titleLead: "Cómo nuestro test de velocidad",
    titleHighlight: "mide tu conexión",
    intro:
      "Un proceso sencillo y transparente que comprueba tu descarga, subida, ping y jitter en menos de un minuto, directamente en tu navegador.",
  },
  stepsTitle: "Qué ocurre cuando pulsas GO",
  stepsIntro: "La prueba se realiza en cinco etapas. Cada una mide un aspecto distinto de tu conexión.",
  stepLabel: "Paso",
  steps: [
    {
      title: "Pulsas GO",
      text: "La prueba comienza al instante en tu navegador. No hay nada que instalar ni ninguna cuenta que crear.",
    },
    {
      title: "Medimos el ping y el jitter",
      text: "Primero enviamos una serie de pequeñas solicitudes a un servidor cercano. El viaje de ida y vuelta más rápido es tu ping, y la variación entre ellos es tu jitter, ambos en milisegundos.",
    },
    {
      title: "Medimos la velocidad de descarga",
      text: "Abrimos varias conexiones paralelas y descargamos datos durante unos segundos para medir, en Mbps, a qué velocidad los recibe tu conexión.",
    },
    {
      title: "Medimos la velocidad de subida",
      text: "Después enviamos datos en sentido contrario para medir a qué velocidad puede subir datos tu conexión, de nuevo con varios flujos paralelos.",
    },
    {
      title: "Obtienes tus resultados",
      text: "Calculamos tu rendimiento real y mostramos tu descarga, subida, ping y jitter, junto con tu proveedor y tu ubicación aproximada.",
    },
  ],
  detailsTitle: "Diseñado para obtener resultados precisos",
  detailsIntro: "Las mismas técnicas que usan los tests de velocidad profesionales, sin nada oculto.",
  details: [
    {
      title: "Red global de servidores",
      text: "Las pruebas se realizan sobre una red edge mundial con servidores en cientos de ciudades, de modo que tus datos viajan por internet real hasta un punto cercano a ti.",
    },
    {
      title: "Conexiones paralelas",
      text: "Varias conexiones simultáneas saturan por completo tu línea y revelan tu verdadera velocidad máxima, en lugar del límite de una sola conexión.",
    },
    {
      title: "Medición en tiempo real",
      text: "La velocidad se mide de forma continua mientras fluyen los datos, y el indicador la muestra en tiempo real. Los primeros instantes de cada transferencia se consideran de calentamiento y se excluyen, para que el establecimiento de la conexión no reduzca tu resultado.",
    },
    {
      title: "Privacidad desde el diseño",
      text: "La prueba solo transfiere datos aleatorios. No leemos tu tráfico ni pedimos datos personales, y no necesitas una cuenta.",
    },
  ],
  accuracy: {
    title: "Cómo obtener el resultado más preciso",
    intro: "Tu resultado refleja todo el trayecto entre tu dispositivo y el servidor. Estos hábitos eliminan las fuentes de error más comunes.",
    items: [
      "Usa una conexión Ethernet por cable para medir la velocidad que realmente ofrece tu proveedor.",
      "Pausa descargas, streaming, copias de seguridad en la nube y actualizaciones de juegos en otros dispositivos.",
      "Desconéctate de tu VPN, salvo que quieras medir la propia VPN.",
      "Cierra las demás pestañas del navegador y mantén esta pestaña visible durante la prueba.",
      "Haz dos o tres pruebas a distintas horas del día y compáralas.",
    ],
  },
  faqTitle: "Preguntas frecuentes sobre la metodología",
  faqs: [
    {
      q: "¿Por qué distintos tests de velocidad muestran resultados diferentes?",
      a: "Cada servicio usa servidores, ubicaciones y métodos de medición diferentes, y tu conexión cambia de un segundo a otro. Las pequeñas diferencias son normales; para obtener una imagen más fiable, compara a lo largo del tiempo los resultados de una misma herramienta.",
    },
    {
      q: "¿Por qué la prueba usa varias conexiones a la vez?",
      a: "Una sola conexión a menudo no basta para llenar una línea rápida. Usar varios flujos paralelos es el método estándar para medir la capacidad total de tu conexión, y coincide con la forma en que descargan hoy los navegadores y las aplicaciones.",
    },
    {
      q: "¿La prueba guarda mis datos personales?",
      a: "No necesitas una cuenta y la prueba solo transfiere datos aleatorios. Tu dirección IP se usa para mostrar tu proveedor y tu ubicación aproximada, tal como se explica en nuestra política de privacidad.",
    },
    {
      q: "¿Por qué mi ping es más alto en los juegos que en la prueba?",
      a: "La prueba mide la latencia hacia un servidor cercano. Los servidores de juegos suelen estar más lejos y los juegos añaden su propio tiempo de procesamiento, por lo que el ping dentro del juego suele ser más alto.",
    },
  ],
  howToName: "Cómo medir la velocidad de tu internet",
  cta: {
    title: "Pruébalo en acción",
    text: "Haz una prueba gratuita ahora. Tarda menos de un minuto.",
    button: "Probar ahora",
  },
};

const ar: HowItWorksMessages = {
  meta: {
    title: "كيف يعمل اختبار سرعة الإنترنت لدينا",
    description:
      "تعرّف على طريقة عمل اختبار سرعة الإنترنت لدينا، وكيف نقيس سرعة التنزيل والرفع والـ Ping والتذبذب (Jitter) باستخدام خوادم عالمية واتصالات متوازية متعددة.",
    keywords: [
      "كيف يعمل اختبار سرعة الإنترنت",
      "كيف يتم قياس سرعة الإنترنت",
      "اختبار سرعة الإنترنت",
      "شرح سرعة التنزيل والرفع والبينغ",
      "منهجية اختبار السرعة",
    ],
  },
  hero: {
    eyebrow: "طريقة العمل",
    titleLead: "كيف يقيس اختبار السرعة لدينا",
    titleHighlight: "أداء اتصالك",
    intro:
      "عملية بسيطة وشفافة تفحص سرعة التنزيل والرفع والـ Ping والتذبذب في أقل من دقيقة، مباشرةً من متصفحك.",
  },
  stepsTitle: "ماذا يحدث عند الضغط على «ابدأ»",
  stepsIntro: "يمر الاختبار بخمس مراحل، تقيس كل منها جانبًا مختلفًا من اتصالك.",
  stepLabel: "الخطوة",
  steps: [
    {
      title: "تضغط على «ابدأ»",
      text: "يبدأ الاختبار فورًا في متصفحك، دون الحاجة إلى تثبيت أي شيء أو إنشاء حساب.",
    },
    {
      title: "نقيس الـ Ping والتذبذب",
      text: "نرسل أولًا سلسلة من الطلبات الصغيرة إلى خادم قريب. أسرع رحلة ذهاب وإياب هي قيمة الـ Ping، والتفاوت بينها هو التذبذب (Jitter)، وكلاهما بالمللي ثانية (ms).",
    },
    {
      title: "نختبر سرعة التنزيل",
      text: "نفتح عدة اتصالات متوازية وننزّل البيانات لبضع ثوانٍ، لنقيس بوحدة Mbps مدى سرعة استقبال اتصالك لها.",
    },
    {
      title: "نختبر سرعة الرفع",
      text: "بعد ذلك نرسل البيانات في الاتجاه المعاكس لقياس سرعة الرفع في اتصالك، مستخدمين مرة أخرى عدة تدفقات متوازية.",
    },
    {
      title: "تحصل على نتائجك",
      text: "نحسب معدل النقل الفعلي ونعرض سرعة التنزيل والرفع والـ Ping والتذبذب، إلى جانب مزوّد الخدمة وموقعك التقريبي.",
    },
  ],
  detailsTitle: "مصمم لنتائج دقيقة",
  detailsIntro: "نفس التقنيات التي تعتمد عليها اختبارات السرعة الاحترافية، بشفافية تامة.",
  details: [
    {
      title: "شبكة خوادم عالمية",
      text: "تُجرى الاختبارات عبر شبكة طرفية عالمية تضم خوادم في مئات المدن، فتنتقل بياناتك عبر الإنترنت الحقيقي إلى موقع قريب منك.",
    },
    {
      title: "اتصالات متوازية",
      text: "تعمل عدة اتصالات متزامنة على إشباع خطك بالكامل، فتكشف سرعتك القصوى الحقيقية بدلًا من حدود اتصال واحد.",
    },
    {
      title: "قياس مباشر",
      text: "تُقاس السرعة باستمرار أثناء تدفق البيانات، ويعرضها المؤشر في الوقت الفعلي. وتُعدّ اللحظات الأولى من كل عملية نقل مرحلة إحماء فتُستبعد، حتى لا يؤدي إعداد الاتصال إلى خفض نتيجتك.",
    },
    {
      title: "الخصوصية في صميم التصميم",
      text: "لا ينقل الاختبار سوى بيانات عشوائية. لا نقرأ حركة بياناتك ولا نطلب أي معلومات شخصية، ولا تحتاج إلى حساب.",
    },
  ],
  accuracy: {
    title: "كيف تحصل على أدق نتيجة",
    intro: "تعكس نتيجتك المسار الكامل من جهازك إلى الخادم. تساعدك هذه العادات على التخلص من أكثر مصادر الخطأ شيوعًا.",
    items: [
      "استخدم اتصال Ethernet سلكيًا لقياس السرعة التي يقدمها مزوّد الخدمة فعليًا.",
      "أوقف مؤقتًا التنزيلات والبث والنسخ الاحتياطي السحابي وتحديثات الألعاب على الأجهزة الأخرى.",
      "افصل اتصال VPN، إلا إذا كنت تريد قياس سرعة الـ VPN نفسه.",
      "أغلق علامات التبويب الأخرى في المتصفح وأبقِ هذه الصفحة ظاهرة أثناء الاختبار.",
      "أجرِ اختبارين أو ثلاثة في أوقات مختلفة من اليوم وقارن بينها.",
    ],
  },
  faqTitle: "أسئلة شائعة حول المنهجية",
  faqs: [
    {
      q: "لماذا تُظهر اختبارات السرعة المختلفة نتائج مختلفة؟",
      a: "تستخدم كل خدمة خوادم ومواقع وطرق قياس مختلفة، كما أن اتصالك يتغير من ثانية إلى أخرى. الفروق الصغيرة أمر طبيعي؛ وللحصول على صورة أوضح، قارن نتائج الأداة نفسها على مدار الوقت.",
    },
    {
      q: "لماذا يستخدم الاختبار عدة اتصالات في الوقت نفسه؟",
      a: "غالبًا لا يستطيع اتصال واحد بمفرده استغلال خط سريع بالكامل. واستخدام عدة تدفقات متوازية هو الطريقة المعتمدة لقياس السعة الكاملة لاتصالك، وهو يطابق الطريقة التي تنزّل بها المتصفحات والتطبيقات البيانات اليوم.",
    },
    {
      q: "هل يحتفظ الاختبار ببياناتي الشخصية؟",
      a: "لا حاجة إلى حساب، ولا ينقل الاختبار سوى بيانات عشوائية. يُستخدم عنوان IP الخاص بك لعرض مزوّد الخدمة وموقعك التقريبي، كما هو موضح في سياسة الخصوصية لدينا.",
    },
    {
      q: "لماذا يكون الـ Ping في الألعاب أعلى منه في الاختبار؟",
      a: "يقيس الاختبار زمن الاستجابة إلى خادم قريب. أما خوادم الألعاب فغالبًا ما تكون أبعد، وتضيف الألعاب وقت معالجة خاصًا بها، لذا يكون الـ Ping داخل اللعبة أعلى عادةً.",
    },
  ],
  howToName: "كيفية اختبار سرعة الإنترنت لديك",
  cta: {
    title: "شاهده أثناء العمل",
    text: "أجرِ اختبارًا مجانيًا الآن، فهو يستغرق أقل من دقيقة.",
    button: "جرّبه الآن",
  },
};

const ru: HowItWorksMessages = {
  meta: {
    title: "Как работает наш тест скорости интернета",
    description:
      "Узнайте, как работает наш тест скорости интернета: как мы измеряем скорость загрузки и отдачи, пинг и джиттер через глобальные серверы и параллельные потоки.",
    keywords: [
      "как работает тест скорости интернета",
      "как измеряется скорость интернета",
      "тест скорости интернета",
      "загрузка отдача пинг что это",
      "методика измерения скорости",
    ],
  },
  hero: {
    eyebrow: "Как это работает",
    titleLead: "Как наш тест скорости",
    titleHighlight: "измеряет ваше соединение",
    intro:
      "Простой и прозрачный процесс, который проверяет скорость загрузки, отдачи, пинг и джиттер меньше чем за минуту прямо в браузере.",
  },
  stepsTitle: "Что происходит после нажатия «Старт»",
  stepsIntro: "Тест проходит в пять этапов. Каждый из них измеряет отдельный параметр вашего соединения.",
  stepLabel: "Шаг",
  steps: [
    {
      title: "Вы нажимаете «Старт»",
      text: "Тест мгновенно запускается в браузере. Ничего не нужно устанавливать, и регистрироваться тоже не нужно.",
    },
    {
      title: "Мы измеряем пинг и джиттер",
      text: "Сначала мы отправляем серию небольших запросов на ближайший сервер. Самый быстрый отклик — это ваш пинг, а разброс между ними — ваш джиттер; оба значения указываются в миллисекундах.",
    },
    {
      title: "Мы проверяем скорость загрузки",
      text: "Мы открываем несколько параллельных соединений и в течение нескольких секунд загружаем данные, измеряя в Мбит/с, как быстро ваше соединение их принимает.",
    },
    {
      title: "Мы проверяем скорость отдачи",
      text: "Затем мы отправляем данные в обратном направлении, чтобы измерить скорость отдачи, снова используя несколько параллельных потоков.",
    },
    {
      title: "Вы получаете результаты",
      text: "Мы рассчитываем реальную пропускную способность и показываем скорость загрузки, отдачи, пинг и джиттер, а также вашего провайдера и примерное местоположение.",
    },
  ],
  detailsTitle: "Создан для точных результатов",
  detailsIntro: "Те же методы, что используют профессиональные тесты скорости, — без каких-либо секретов.",
  details: [
    {
      title: "Глобальная сеть серверов",
      text: "Тесты проводятся через всемирную edge-сеть с серверами в сотнях городов, поэтому данные идут по реальному интернету до ближайшей к вам точки.",
    },
    {
      title: "Параллельные соединения",
      text: "Несколько одновременных соединений полностью загружают канал и показывают вашу реальную максимальную скорость, а не предел одного соединения.",
    },
    {
      title: "Измерение в реальном времени",
      text: "Скорость измеряется непрерывно во время передачи данных, а спидометр отображает её в реальном времени. Первые мгновения каждой передачи считаются разогревом и не учитываются, чтобы установка соединения не занижала результат.",
    },
    {
      title: "Конфиденциальность по умолчанию",
      text: "Тест передаёт только случайные данные. Мы не читаем ваш трафик и не запрашиваем личные данные, а аккаунт не нужен.",
    },
  ],
  accuracy: {
    title: "Как получить максимально точный результат",
    intro: "Результат отражает весь путь от вашего устройства до сервера. Эти привычки устраняют самые частые источники ошибок.",
    items: [
      "Подключитесь по кабелю Ethernet, чтобы измерить скорость, которую действительно предоставляет провайдер.",
      "Приостановите загрузки, стриминг, облачное резервное копирование и обновления игр на других устройствах.",
      "Отключите VPN, если только вы не хотите измерить скорость самого VPN.",
      "Закройте другие вкладки браузера и не сворачивайте эту вкладку во время теста.",
      "Проведите два-три теста в разное время суток и сравните результаты.",
    ],
  },
  faqTitle: "Вопросы о методике",
  faqs: [
    {
      q: "Почему разные тесты скорости показывают разные результаты?",
      a: "Каждый сервис использует свои серверы, расположения и методы измерения, а ваше соединение меняется каждую секунду. Небольшие расхождения — это нормально; для наиболее объективной картины сравнивайте результаты одного и того же сервиса во времени.",
    },
    {
      q: "Почему тест использует сразу несколько соединений?",
      a: "Одного соединения часто недостаточно, чтобы полностью загрузить быстрый канал. Несколько параллельных потоков — стандартный способ измерить полную пропускную способность соединения, и именно так сегодня загружают данные браузеры и приложения.",
    },
    {
      q: "Сохраняет ли тест мои личные данные?",
      a: "Аккаунт не нужен, а тест передаёт только случайные данные. Ваш IP-адрес используется, чтобы показать провайдера и примерное местоположение, как описано в нашей политике конфиденциальности.",
    },
    {
      q: "Почему в играх пинг выше, чем в тесте?",
      a: "Тест измеряет задержку до ближайшего сервера. Игровые серверы часто находятся дальше, а игры добавляют собственное время обработки, поэтому пинг в игре обычно выше.",
    },
  ],
  howToName: "Как проверить скорость интернета",
  cta: {
    title: "Попробуйте в деле",
    text: "Запустите бесплатный тест прямо сейчас. Это займёт меньше минуты.",
    button: "Попробовать",
  },
};

export const howItWorksMessages: Record<Locale, HowItWorksMessages> = { en, fr, es, ar, ru };
