import type { Locale } from "../config";

// Homepage copy (hero, explainers, features, speed-needs table, FAQ, CTA).
const en = {
  meta: {
    title: "Internet Speed Test: Free Download, Upload & Ping Test",
    description:
      "Run a free internet speed test now. Measure your download speed, upload speed, ping and jitter in seconds on any device. No app or signup required.",
    keywords: [
      "internet speed test",
      "speed test",
      "wifi speed test",
      "test my internet speed",
      "broadband speed test",
      "download speed test",
      "upload speed test",
      "ping test",
    ],
  },
  hero: {
    eyebrow: "Free · No signup · Real-time results",
    titleLead: "Test your internet speed",
    titleHighlight: "in seconds",
    intro:
      "Check your download, upload, ping and jitter on any device. Start the test and find out if you're getting the speed you pay for.",
  },
  trust: [
    { title: "100% free", text: "Unlimited tests, no hidden fees" },
    { title: "No signup", text: "No account, no app to install" },
    { title: "Private", text: "We never sell your test data" },
    { title: "Any device", text: "Phone, tablet, laptop or desktop" },
  ],
  metrics: {
    kicker: "Understand your results",
    title: "What your speed test results mean",
    intro:
      "A speed test gives you four numbers. Here is what each one measures and what a good value looks like for a typical home connection.",
    goodLabel: "Good value",
    items: [
      {
        name: "Download speed",
        unit: "Mbps",
        text: "How fast your connection receives data from the internet. It drives streaming quality, page loading, app updates and file downloads.",
        good: "25 Mbps or more",
      },
      {
        name: "Upload speed",
        unit: "Mbps",
        text: "How fast you can send data. It matters for video calls, posting photos and videos, cloud backups and live streaming.",
        good: "10 Mbps or more",
      },
      {
        name: "Ping (latency)",
        unit: "ms",
        text: "The time a small packet takes to reach a server and come back. Lower is better: it makes games, calls and browsing feel responsive.",
        good: "Under 50 ms",
      },
      {
        name: "Jitter",
        unit: "ms",
        text: "How much your ping varies from one moment to the next. Low jitter means a stable connection without lag spikes or choppy calls.",
        good: "Under 30 ms",
      },
    ],
  },
  features: {
    kicker: "Why TestSpeedInternet",
    title: "A fast, accurate and private speed test",
    intro: "Everything you need to check your connection, and nothing you don't.",
    items: [
      {
        title: "Instant and accurate",
        text: "Precise download, upload and ping results in seconds, using multiple parallel connections to saturate your line.",
      },
      {
        title: "Free and private",
        text: "No signup, no app and no selling of personal data. Open the page, press GO and get your results.",
      },
      {
        title: "Works on any device",
        text: "Test on your phone, tablet, laptop or desktop, in any modern browser. The tool adapts to every screen.",
      },
      {
        title: "WiFi, fiber, 5G and cable",
        text: "Whatever your connection type, measure the real bandwidth you get from your internet service provider.",
      },
      {
        title: "Global network",
        text: "Tests run over a worldwide edge network, so your data takes a real internet path to a nearby server.",
      },
      {
        title: "Clear, honest results",
        text: "Plain-language explanations of every number, so you know whether your connection fits how you use it.",
      },
    ],
  },
  steps: {
    kicker: "How it works",
    title: "Three steps to measure your connection",
    intro: "No downloads, no setup. The whole test takes less than a minute.",
    items: [
      { title: "Press GO", text: "Start the test with one click. It runs entirely in your browser." },
      {
        title: "We measure your line",
        text: "We exchange data with a nearby server to measure your ping, jitter, download and upload speed.",
      },
      {
        title: "Read your results",
        text: "See your speed in Mbps and compare it with your plan and with what your activities need.",
      },
    ],
    cta: "Learn how the test works",
  },
  needs: {
    kicker: "Speed guide",
    title: "How much internet speed do you need?",
    intro:
      "The speed you need depends on what you do online and how many devices share your connection. Compare your result with this table.",
    colUse: "What you do",
    colSpeed: "Recommended download",
    rows: [
      { use: "Web browsing and email", speed: "5–10 Mbps" },
      { use: "HD video streaming", speed: "10–25 Mbps" },
      { use: "4K streaming and online gaming", speed: "25–100 Mbps" },
      { use: "Several users, 4K and remote work", speed: "100–500 Mbps" },
      { use: "Heavy households and creators", speed: "500–1000+ Mbps" },
    ],
    guideCta: "Read the full speed guide",
    runCta: "Run your speed test",
  },
  tools: {
    kicker: "Free tools",
    title: "More ways to check your connection",
    intro: "Focused tests for each part of your connection, plus tools to inspect your IP address.",
  },
  about: {
    title: "Why test your internet speed?",
    paragraphs: [
      "Internet providers advertise speeds of “up to” a certain number of megabits per second, but the speed you actually get can vary with the time of day, your WiFi setup, your devices and network congestion. A quick speed test shows the real download speed, upload speed and latency reaching your device right now.",
      "Testing regularly helps you spot problems early: if streaming buffers, video calls freeze or games lag, your results tell you whether the issue is your plan, your WiFi or something else. You can also use the results when you contact your ISP or compare offers before switching provider.",
      "For the most accurate reading, test on a wired Ethernet connection, pause other downloads and streaming, and run the test two or three times at different hours. Comparing WiFi and wired results shows how much speed your wireless network is costing you.",
    ],
  },
  guides: {
    kicker: "Guides",
    title: "Guides to a faster connection",
    intro: "Plain-language help with WiFi, ping, streaming and slow internet.",
    all: "All articles",
  },
  faq: {
    kicker: "FAQ",
    title: "Frequently asked questions",
    items: [
      {
        q: "What is a good internet speed?",
        a: "For most households, a download speed of 25–100 Mbps is good for streaming, browsing and video calls. Larger homes, 4K streaming or gaming benefit from 100–500 Mbps. The right speed depends on how many devices use your connection at once.",
      },
      {
        q: "How does this internet speed test work?",
        a: "Our speed test measures your download speed (how fast you receive data), upload speed (how fast you send data), and ping and jitter (how quickly and how consistently your connection responds). It opens several connections to a nearby server, transfers data for a few seconds and calculates your real throughput in Mbps.",
      },
      {
        q: "Why is my speed test result lower than my plan?",
        a: "WiFi interference, distance from your router, the device you're using, background downloads, VPNs and peak-hour congestion can all lower your measured speed. For the most accurate result, test on a wired connection with other devices idle.",
      },
      {
        q: "What do download, upload and ping mean?",
        a: "Download speed is how fast you can pull data from the internet (streaming, browsing). Upload speed is how fast you can send data (video calls, backups). Ping is the response time of your connection in milliseconds, and lower is better, especially for gaming.",
      },
      {
        q: "What is the difference between Mbps and MB/s?",
        a: "Internet speeds are measured in megabits per second (Mbps), while file sizes are usually shown in megabytes (MB). One byte equals eight bits, so a 100 Mbps connection downloads at about 12.5 MB per second at most.",
      },
      {
        q: "Is it better to test on WiFi or with a cable?",
        a: "A wired Ethernet connection shows the true speed delivered by your provider. A WiFi test shows what your devices actually experience. Running both tells you whether a slow result comes from your plan or from your wireless network.",
      },
      {
        q: "How much data does a speed test use?",
        a: "It depends on your speed, because the test runs for a fixed number of seconds: a slow line may use only tens of megabytes, while a fast fiber connection can use several hundred megabytes or more. If you are on a limited mobile data plan, keep that in mind before testing repeatedly.",
      },
      {
        q: "Is this internet speed test free?",
        a: "Yes. TestSpeedInternet is completely free, requires no signup and no app download. You can run as many speed tests as you like, on any device.",
      },
    ],
  },
  cta: {
    title: "Ready to test your internet speed?",
    text: "It's free, fast and works on any device. Find out your real download and upload speed now.",
    button: "Start speed test",
  },
  jsonLd: {
    appDescription:
      "Free internet speed test to measure your download speed, upload speed, ping and jitter on any device.",
  },
};

export type HomeMessages = typeof en;

const fr: HomeMessages = {
  meta: {
    title: "Test de débit internet gratuit : download, upload et ping",
    description:
      "Faites un test de débit internet gratuit : mesurez vos débits descendant et montant, le ping et la gigue en quelques secondes. Sans application ni inscription.",
    keywords: [
      "test de débit",
      "test de vitesse internet",
      "test de connexion",
      "test de débit internet",
      "test débit wifi",
      "mesurer son débit internet",
      "test ping",
      "speed test",
    ],
  },
  hero: {
    eyebrow: "Gratuit · Sans inscription · Résultats en temps réel",
    titleLead: "Testez votre débit internet",
    titleHighlight: "en quelques secondes",
    intro:
      "Mesurez vos débits descendant et montant, le ping et la gigue sur n’importe quel appareil. Lancez le test et vérifiez si vous obtenez le débit pour lequel vous payez.",
  },
  trust: [
    { title: "100 % gratuit", text: "Tests illimités, sans frais cachés" },
    { title: "Sans inscription", text: "Ni compte, ni application à installer" },
    { title: "Confidentiel", text: "Nous ne vendons jamais vos données" },
    { title: "Tous appareils", text: "Smartphone, tablette ou ordinateur" },
  ],
  metrics: {
    kicker: "Comprendre vos résultats",
    title: "Que signifient les résultats de votre test de débit ?",
    intro:
      "Un test de débit vous donne quatre chiffres. Voici ce que mesure chacun d’eux et la valeur à viser pour une connexion domestique classique.",
    goodLabel: "Bonne valeur",
    items: [
      {
        name: "Débit descendant",
        unit: "Mbps",
        text: "La vitesse à laquelle votre connexion reçoit des données depuis internet. Il détermine la qualité du streaming, le chargement des pages, les mises à jour et les téléchargements.",
        good: "25 Mbps ou plus",
      },
      {
        name: "Débit montant",
        unit: "Mbps",
        text: "La vitesse à laquelle vous envoyez des données. Il compte pour les appels vidéo, la publication de photos et de vidéos, les sauvegardes dans le cloud et le streaming en direct.",
        good: "10 Mbps ou plus",
      },
      {
        name: "Ping (latence)",
        unit: "ms",
        text: "Le temps que met un petit paquet pour atteindre un serveur et revenir. Plus il est bas, mieux c’est : jeux, appels et navigation deviennent plus réactifs.",
        good: "Moins de 50 ms",
      },
      {
        name: "Gigue (jitter)",
        unit: "ms",
        text: "L’ampleur des variations de votre ping d’un instant à l’autre. Une gigue faible signifie une connexion stable, sans pics de lag ni appels saccadés.",
        good: "Moins de 30 ms",
      },
    ],
  },
  features: {
    kicker: "Pourquoi TestSpeedInternet",
    title: "Un test de débit rapide, précis et confidentiel",
    intro: "Tout ce qu’il faut pour vérifier votre connexion, rien de superflu.",
    items: [
      {
        title: "Instantané et précis",
        text: "Des résultats précis de débit descendant, montant et de ping en quelques secondes, grâce à plusieurs connexions parallèles qui saturent votre ligne.",
      },
      {
        title: "Gratuit et confidentiel",
        text: "Ni inscription, ni application, ni revente de données personnelles. Ouvrez la page, appuyez sur GO et obtenez vos résultats.",
      },
      {
        title: "Sur tous les appareils",
        text: "Testez sur smartphone, tablette ou ordinateur, dans n’importe quel navigateur récent. L’outil s’adapte à tous les écrans.",
      },
      {
        title: "Wi-Fi, fibre, 5G et câble",
        text: "Quel que soit votre type de connexion, mesurez la bande passante réelle fournie par votre fournisseur d’accès à internet.",
      },
      {
        title: "Réseau mondial",
        text: "Les tests passent par un réseau edge mondial : vos données empruntent un vrai chemin internet jusqu’à un serveur proche.",
      },
      {
        title: "Des résultats clairs et honnêtes",
        text: "Chaque chiffre est expliqué simplement, pour savoir si votre connexion correspond à vos usages.",
      },
    ],
  },
  steps: {
    kicker: "Comment ça marche",
    title: "Trois étapes pour mesurer votre connexion",
    intro: "Aucun téléchargement, aucune configuration. Le test complet prend moins d’une minute.",
    items: [
      { title: "Appuyez sur GO", text: "Lancez le test en un clic. Il s’exécute entièrement dans votre navigateur." },
      {
        title: "Nous mesurons votre ligne",
        text: "Nous échangeons des données avec un serveur proche pour mesurer votre ping, votre gigue et vos débits descendant et montant.",
      },
      {
        title: "Consultez vos résultats",
        text: "Découvrez votre débit en Mbps et comparez-le à votre abonnement et aux besoins de vos usages.",
      },
    ],
    cta: "Découvrir le fonctionnement du test",
  },
  needs: {
    kicker: "Guide des débits",
    title: "De quel débit internet avez-vous besoin ?",
    intro:
      "Le débit nécessaire dépend de vos usages en ligne et du nombre d’appareils qui partagent votre connexion. Comparez votre résultat à ce tableau.",
    colUse: "Votre usage",
    colSpeed: "Débit descendant conseillé",
    rows: [
      { use: "Navigation web et e-mails", speed: "5–10 Mbps" },
      { use: "Streaming vidéo HD", speed: "10–25 Mbps" },
      { use: "Streaming 4K et jeux en ligne", speed: "25–100 Mbps" },
      { use: "Plusieurs utilisateurs, 4K et télétravail", speed: "100–500 Mbps" },
      { use: "Foyers très connectés et créateurs", speed: "500–1000+ Mbps" },
    ],
    guideCta: "Lire le guide complet des débits",
    runCta: "Lancer votre test de débit",
  },
  tools: {
    kicker: "Outils gratuits",
    title: "D’autres façons de vérifier votre connexion",
    intro: "Des tests ciblés pour chaque aspect de votre connexion, ainsi que des outils pour inspecter votre adresse IP.",
  },
  about: {
    title: "Pourquoi tester votre débit internet ?",
    paragraphs: [
      "Les fournisseurs d’accès annoncent des débits « jusqu’à » un certain nombre de mégabits par seconde, mais le débit que vous obtenez réellement varie selon l’heure, votre installation Wi-Fi, vos appareils et la congestion du réseau. Un test de débit rapide montre les débits descendant et montant et la latence qui parviennent réellement à votre appareil, à cet instant.",
      "Tester régulièrement permet de repérer les problèmes tôt : si le streaming charge en boucle, si les appels vidéo se figent ou si les jeux lagguent, vos résultats indiquent si le problème vient de votre abonnement, de votre Wi-Fi ou d’autre chose. Ils vous serviront aussi pour contacter votre fournisseur d’accès ou comparer les offres avant d’en changer.",
      "Pour une mesure la plus fiable possible, testez en Ethernet filaire, mettez en pause les autres téléchargements et streamings, et lancez le test deux ou trois fois à des heures différentes. Comparer les résultats en Wi-Fi et en filaire montre combien de débit votre réseau sans fil vous fait perdre.",
    ],
  },
  guides: {
    kicker: "Guides",
    title: "Nos guides pour une connexion plus rapide",
    intro: "Des conseils clairs sur le Wi-Fi, le ping, le streaming et les connexions lentes.",
    all: "Tous les articles",
  },
  faq: {
    kicker: "FAQ",
    title: "Questions fréquentes",
    items: [
      {
        q: "Qu’est-ce qu’un bon débit internet ?",
        a: "Pour la plupart des foyers, un débit descendant de 25–100 Mbps suffit pour le streaming, la navigation et les appels vidéo. Les grands foyers, le streaming 4K ou le jeu en ligne profitent de 100–500 Mbps. Le bon débit dépend du nombre d’appareils connectés en même temps.",
      },
      {
        q: "Comment fonctionne ce test de débit internet ?",
        a: "Notre test mesure votre débit descendant (la vitesse à laquelle vous recevez des données), votre débit montant (la vitesse à laquelle vous en envoyez), ainsi que le ping et la gigue (la rapidité et la régularité avec lesquelles votre connexion répond). Il ouvre plusieurs connexions vers un serveur proche, transfère des données pendant quelques secondes et calcule votre débit réel en Mbps.",
      },
      {
        q: "Pourquoi mon résultat est-il inférieur au débit de mon abonnement ?",
        a: "Les interférences Wi-Fi, la distance avec votre box, l’appareil utilisé, les téléchargements en arrière-plan, les VPN et la saturation aux heures de pointe peuvent tous réduire le débit mesuré. Pour un résultat plus fiable, testez en filaire avec les autres appareils inactifs.",
      },
      {
        q: "Que signifient download, upload et ping ?",
        a: "Le débit descendant (download) est la vitesse à laquelle vous récupérez des données depuis internet (streaming, navigation). Le débit montant (upload) est la vitesse à laquelle vous en envoyez (appels vidéo, sauvegardes). Le ping est le temps de réponse de votre connexion en millisecondes : plus il est bas, mieux c’est, surtout pour les jeux.",
      },
      {
        q: "Quelle est la différence entre Mbps et Mo/s ?",
        a: "Les débits internet se mesurent en mégabits par seconde (Mbps), tandis que la taille des fichiers s’exprime généralement en mégaoctets (Mo). Un octet vaut huit bits : une connexion à 100 Mbps télécharge donc au maximum à environ 12,5 Mo par seconde.",
      },
      {
        q: "Vaut-il mieux tester en Wi-Fi ou en filaire ?",
        a: "Une connexion Ethernet filaire montre le débit réel fourni par votre opérateur. Un test en Wi-Fi montre ce que vos appareils obtiennent vraiment. Faire les deux permet de savoir si un résultat faible vient de votre abonnement ou de votre réseau sans fil.",
      },
      {
        q: "Combien de données consomme un test de débit ?",
        a: "Cela dépend de votre débit, car le test dure un nombre fixe de secondes : une ligne lente peut n’utiliser que quelques dizaines de mégaoctets, alors qu’une connexion fibre rapide peut en consommer plusieurs centaines, voire davantage. Si vous avez un forfait mobile limité, gardez-le en tête avant de multiplier les tests.",
      },
      {
        q: "Ce test de débit internet est-il gratuit ?",
        a: "Oui. TestSpeedInternet est entièrement gratuit, sans inscription ni application à télécharger. Vous pouvez lancer autant de tests de débit que vous le souhaitez, sur n’importe quel appareil.",
      },
    ],
  },
  cta: {
    title: "Prêt à tester votre débit internet ?",
    text: "C’est gratuit, rapide et compatible avec tous les appareils. Découvrez dès maintenant vos débits descendant et montant réels.",
    button: "Lancer le test de débit",
  },
  jsonLd: {
    appDescription:
      "Test de débit internet gratuit pour mesurer votre débit descendant, votre débit montant, le ping et la gigue sur n’importe quel appareil.",
  },
};

const es: HomeMessages = {
  meta: {
    title: "Test de velocidad internet gratis: descarga, subida y ping",
    description:
      "Haz un test de velocidad de internet gratis: mide tu velocidad de descarga y subida, el ping y el jitter en segundos desde cualquier dispositivo. Sin registro.",
    keywords: [
      "test de velocidad",
      "test de velocidad de internet",
      "test de velocidad internet",
      "medir velocidad de internet",
      "prueba de velocidad de internet",
      "test de velocidad wifi",
      "test de ping",
      "speed test",
    ],
  },
  hero: {
    eyebrow: "Gratis · Sin registro · Resultados en tiempo real",
    titleLead: "Mide la velocidad de tu internet",
    titleHighlight: "en segundos",
    intro:
      "Comprueba tu descarga, subida, ping y jitter en cualquier dispositivo. Inicia la prueba y descubre si recibes la velocidad que pagas.",
  },
  trust: [
    { title: "100 % gratis", text: "Pruebas ilimitadas, sin costos ocultos" },
    { title: "Sin registro", text: "Sin cuenta ni apps que instalar" },
    { title: "Privado", text: "Nunca vendemos tus datos" },
    { title: "Cualquier dispositivo", text: "Móvil, tableta, portátil o PC" },
  ],
  metrics: {
    kicker: "Entiende tus resultados",
    title: "Qué significan los resultados de tu test de velocidad",
    intro:
      "Un test de velocidad te da cuatro cifras. Esto es lo que mide cada una y cuál es un buen valor para una conexión doméstica típica.",
    goodLabel: "Buen valor",
    items: [
      {
        name: "Velocidad de descarga",
        unit: "Mbps",
        text: "La rapidez con la que tu conexión recibe datos de internet. Determina la calidad del streaming, la carga de páginas, las actualizaciones de apps y las descargas de archivos.",
        good: "25 Mbps o más",
      },
      {
        name: "Velocidad de subida",
        unit: "Mbps",
        text: "La rapidez con la que envías datos. Es clave para videollamadas, publicar fotos y videos, copias de seguridad en la nube y transmisiones en directo.",
        good: "10 Mbps o más",
      },
      {
        name: "Ping (latencia)",
        unit: "ms",
        text: "El tiempo que tarda un pequeño paquete en llegar a un servidor y volver. Cuanto más bajo, mejor: los juegos, las llamadas y la navegación responden más rápido.",
        good: "Menos de 50 ms",
      },
      {
        name: "Jitter (fluctuación)",
        unit: "ms",
        text: "Cuánto varía tu ping de un momento a otro. Un jitter bajo indica una conexión estable, sin picos de lag ni llamadas entrecortadas.",
        good: "Menos de 30 ms",
      },
    ],
  },
  features: {
    kicker: "Por qué TestSpeedInternet",
    title: "Un test de velocidad rápido, preciso y privado",
    intro: "Todo lo que necesitas para comprobar tu conexión, y nada que sobre.",
    items: [
      {
        title: "Instantáneo y preciso",
        text: "Resultados precisos de descarga, subida y ping en segundos, con varias conexiones en paralelo para saturar tu línea.",
      },
      {
        title: "Gratis y privado",
        text: "Sin registro, sin apps y sin vender datos personales. Abre la página, pulsa GO y obtén tus resultados.",
      },
      {
        title: "Funciona en cualquier dispositivo",
        text: "Haz la prueba en tu móvil, tableta, portátil o PC, en cualquier navegador moderno. La herramienta se adapta a todas las pantallas.",
      },
      {
        title: "WiFi, fibra, 5G y cable",
        text: "Sea cual sea tu tipo de conexión, mide el ancho de banda real que te ofrece tu proveedor de internet.",
      },
      {
        title: "Red global",
        text: "Las pruebas se ejecutan en una red edge mundial, así que tus datos recorren una ruta real de internet hasta un servidor cercano.",
      },
      {
        title: "Resultados claros y honestos",
        text: "Explicaciones sencillas de cada cifra para que sepas si tu conexión se ajusta a tu forma de usarla.",
      },
    ],
  },
  steps: {
    kicker: "Cómo funciona",
    title: "Tres pasos para medir tu conexión",
    intro: "Sin descargas ni configuración. La prueba completa dura menos de un minuto.",
    items: [
      { title: "Pulsa GO", text: "Inicia la prueba con un clic. Se ejecuta por completo en tu navegador." },
      {
        title: "Medimos tu línea",
        text: "Intercambiamos datos con un servidor cercano para medir tu ping, tu jitter y tu velocidad de descarga y subida.",
      },
      {
        title: "Consulta tus resultados",
        text: "Mira tu velocidad en Mbps y compárala con tu plan y con lo que necesitan tus actividades.",
      },
    ],
    cta: "Descubre cómo funciona la prueba",
  },
  needs: {
    kicker: "Guía de velocidad",
    title: "¿Qué velocidad de internet necesitas?",
    intro:
      "La velocidad que necesitas depende de lo que haces en línea y de cuántos dispositivos comparten tu conexión. Compara tu resultado con esta tabla.",
    colUse: "Lo que haces",
    colSpeed: "Descarga recomendada",
    rows: [
      { use: "Navegación web y correo", speed: "5–10 Mbps" },
      { use: "Streaming de video HD", speed: "10–25 Mbps" },
      { use: "Streaming 4K y juegos en línea", speed: "25–100 Mbps" },
      { use: "Varios usuarios, 4K y teletrabajo", speed: "100–500 Mbps" },
      { use: "Hogares muy conectados y creadores", speed: "500–1000+ Mbps" },
    ],
    guideCta: "Lee la guía completa de velocidad",
    runCta: "Haz tu test de velocidad",
  },
  tools: {
    kicker: "Herramientas gratis",
    title: "Más formas de comprobar tu conexión",
    intro: "Pruebas específicas para cada parte de tu conexión, además de herramientas para consultar tu dirección IP.",
  },
  about: {
    title: "¿Por qué medir la velocidad de tu internet?",
    paragraphs: [
      "Los proveedores de internet anuncian velocidades «de hasta» cierta cantidad de megabits por segundo, pero la velocidad que realmente recibes puede variar según la hora del día, tu configuración WiFi, tus dispositivos y la congestión de la red. Un test de velocidad rápido muestra la velocidad de descarga, la de subida y la latencia reales que llegan a tu dispositivo en este momento.",
      "Hacer pruebas con regularidad te ayuda a detectar problemas a tiempo: si el streaming se queda cargando, las videollamadas se congelan o los juegos van con lag, tus resultados te dicen si el problema es tu plan, tu WiFi u otra cosa. También puedes usarlos al contactar con tu proveedor o para comparar ofertas antes de cambiar de compañía.",
      "Para obtener la medición más precisa, conéctate por cable Ethernet, pausa otras descargas y reproducciones, y repite el test dos o tres veces a distintas horas. Comparar los resultados por WiFi y por cable muestra cuánta velocidad te está costando tu red inalámbrica.",
    ],
  },
  guides: {
    kicker: "Guías",
    title: "Guías para una conexión más rápida",
    intro: "Ayuda clara sobre WiFi, ping, streaming e internet lento.",
    all: "Todos los artículos",
  },
  faq: {
    kicker: "FAQ",
    title: "Preguntas frecuentes",
    items: [
      {
        q: "¿Cuál es una buena velocidad de internet?",
        a: "Para la mayoría de los hogares, una velocidad de descarga de 25–100 Mbps es buena para streaming, navegación y videollamadas. Los hogares más grandes, el streaming en 4K o los juegos se benefician de 100–500 Mbps. La velocidad adecuada depende de cuántos dispositivos usan tu conexión a la vez.",
      },
      {
        q: "¿Cómo funciona este test de velocidad de internet?",
        a: "Nuestro test mide tu velocidad de descarga (lo rápido que recibes datos), tu velocidad de subida (lo rápido que envías datos), y el ping y el jitter (la rapidez y la regularidad con que responde tu conexión). Abre varias conexiones con un servidor cercano, transfiere datos durante unos segundos y calcula tu velocidad real en Mbps.",
      },
      {
        q: "¿Por qué mi resultado es más bajo que la velocidad de mi plan?",
        a: "Las interferencias del WiFi, la distancia al router, el dispositivo que usas, las descargas en segundo plano, las VPN y la congestión en horas pico pueden reducir la velocidad medida. Para un resultado más preciso, haz la prueba por cable con los demás dispositivos inactivos.",
      },
      {
        q: "¿Qué significan descarga, subida y ping?",
        a: "La velocidad de descarga es lo rápido que obtienes datos de internet (streaming, navegación). La velocidad de subida es lo rápido que envías datos (videollamadas, copias de seguridad). El ping es el tiempo de respuesta de tu conexión en milisegundos; cuanto más bajo, mejor, sobre todo para jugar.",
      },
      {
        q: "¿Cuál es la diferencia entre Mbps y MB/s?",
        a: "La velocidad de internet se mide en megabits por segundo (Mbps), mientras que el tamaño de los archivos suele expresarse en megabytes (MB). Un byte equivale a ocho bits, así que una conexión de 100 Mbps descarga como máximo a unos 12.5 MB por segundo.",
      },
      {
        q: "¿Es mejor hacer la prueba por WiFi o por cable?",
        a: "Una conexión Ethernet por cable muestra la velocidad real que entrega tu proveedor. Una prueba por WiFi muestra lo que realmente reciben tus dispositivos. Hacer ambas te indica si un resultado lento se debe a tu plan o a tu red inalámbrica.",
      },
      {
        q: "¿Cuántos datos consume un test de velocidad?",
        a: "Depende de tu velocidad, porque la prueba dura un número fijo de segundos: una línea lenta puede usar solo unas decenas de megabytes, mientras que una conexión de fibra rápida puede consumir varios cientos de megabytes o más. Si tienes un plan de datos móviles limitado, tenlo en cuenta antes de repetir la prueba muchas veces.",
      },
      {
        q: "¿Este test de velocidad de internet es gratis?",
        a: "Sí. TestSpeedInternet es totalmente gratis y no requiere registro ni descargar ninguna app. Puedes hacer todos los tests de velocidad que quieras, en cualquier dispositivo.",
      },
    ],
  },
  cta: {
    title: "¿Listo para medir la velocidad de tu internet?",
    text: "Es gratis, rápido y funciona en cualquier dispositivo. Descubre ahora tu velocidad real de descarga y subida.",
    button: "Iniciar test de velocidad",
  },
  jsonLd: {
    appDescription:
      "Test de velocidad de internet gratis para medir tu velocidad de descarga, velocidad de subida, ping y jitter en cualquier dispositivo.",
  },
};

const ar: HomeMessages = {
  meta: {
    title: "اختبار سرعة الإنترنت مجانًا: التحميل والرفع والبينغ",
    description:
      "أجرِ اختبار سرعة الإنترنت مجانًا الآن، وقِس سرعة التحميل والرفع والبينغ والتذبذب خلال ثوانٍ على أي جهاز دون تطبيق أو تسجيل. قياس سرعة النت بدقة وبسهولة.",
    keywords: [
      "اختبار سرعة الإنترنت",
      "قياس سرعة النت",
      "قياس سرعة الانترنت",
      "اختبار سرعة النت",
      "فحص سرعة الإنترنت",
      "اختبار سرعة الواي فاي",
      "سبيد تست",
      "اختبار البينغ",
    ],
  },
  hero: {
    eyebrow: "مجاني · بدون تسجيل · نتائج فورية",
    titleLead: "اختبر سرعة الإنترنت لديك",
    titleHighlight: "في ثوانٍ",
    intro:
      "تحقّق من سرعة التحميل والرفع والبينغ والتذبذب على أي جهاز. ابدأ الاختبار واعرف ما إذا كنت تحصل على السرعة التي تدفع مقابلها.",
  },
  trust: [
    { title: "مجاني 100%", text: "اختبارات غير محدودة بلا رسوم خفية" },
    { title: "بدون تسجيل", text: "لا حساب ولا تطبيق للتثبيت" },
    { title: "خصوصية تامة", text: "لا نبيع بيانات اختباراتك أبدًا" },
    { title: "أي جهاز", text: "هاتف أو جهاز لوحي أو حاسوب" },
  ],
  metrics: {
    kicker: "افهم نتائجك",
    title: "ماذا تعني نتائج اختبار السرعة؟",
    intro:
      "يمنحك اختبار السرعة أربعة أرقام. إليك ما يقيسه كل منها، وما القيمة الجيدة لاتصال منزلي نموذجي.",
    goodLabel: "القيمة الجيدة",
    items: [
      {
        name: "سرعة التحميل",
        unit: "Mbps",
        text: "مدى سرعة استقبال اتصالك للبيانات من الإنترنت. تحدد جودة البث وسرعة فتح الصفحات وتحديثات التطبيقات وتنزيل الملفات.",
        good: "25 Mbps أو أكثر",
      },
      {
        name: "سرعة الرفع",
        unit: "Mbps",
        text: "مدى سرعة إرسالك للبيانات. وهي مهمة لمكالمات الفيديو ونشر الصور والفيديوهات والنسخ الاحتياطي السحابي والبث المباشر.",
        good: "10 Mbps أو أكثر",
      },
      {
        name: "البينغ (زمن الاستجابة)",
        unit: "ms",
        text: "الوقت الذي تستغرقه حزمة صغيرة للوصول إلى خادم والعودة. كلما انخفض كان أفضل، إذ يجعل الألعاب والمكالمات والتصفح أكثر استجابة.",
        good: "أقل من 50 ms",
      },
      {
        name: "التذبذب (Jitter)",
        unit: "ms",
        text: "مقدار تغيّر البينغ من لحظة إلى أخرى. التذبذب المنخفض يعني اتصالًا مستقرًا بلا قفزات في التأخير أو تقطّع في المكالمات.",
        good: "أقل من 30 ms",
      },
    ],
  },
  features: {
    kicker: "لماذا TestSpeedInternet",
    title: "اختبار سرعة سريع ودقيق يحترم خصوصيتك",
    intro: "كل ما تحتاجه لفحص اتصالك، ولا شيء زائد.",
    items: [
      {
        title: "فوري ودقيق",
        text: "نتائج دقيقة للتحميل والرفع والبينغ خلال ثوانٍ، باستخدام عدة اتصالات متوازية لاستغلال كامل سعة خطك.",
      },
      {
        title: "مجاني وخاص",
        text: "بلا تسجيل ولا تطبيق ولا بيع للبيانات الشخصية. افتح الصفحة واضغط «ابدأ» واحصل على نتائجك.",
      },
      {
        title: "يعمل على أي جهاز",
        text: "اختبر على هاتفك أو جهازك اللوحي أو حاسوبك المحمول أو المكتبي، في أي متصفح حديث. تتكيّف الأداة مع جميع الشاشات.",
      },
      {
        title: "WiFi وألياف و5G وكابل",
        text: "أيًّا كان نوع اتصالك، قِس عرض النطاق الفعلي الذي يقدمه لك مزود خدمة الإنترنت.",
      },
      {
        title: "شبكة عالمية",
        text: "تُجرى الاختبارات عبر شبكة طرفية عالمية، فتسلك بياناتك مسارًا حقيقيًا على الإنترنت إلى خادم قريب منك.",
      },
      {
        title: "نتائج واضحة وصادقة",
        text: "شرح مبسّط لكل رقم، لتعرف ما إذا كان اتصالك يناسب طريقة استخدامك.",
      },
    ],
  },
  steps: {
    kicker: "كيف يعمل",
    title: "ثلاث خطوات لقياس اتصالك",
    intro: "لا تنزيلات ولا إعدادات. يستغرق الاختبار كله أقل من دقيقة.",
    items: [
      { title: "اضغط «ابدأ»", text: "ابدأ الاختبار بنقرة واحدة. يعمل بالكامل داخل متصفحك." },
      {
        title: "نقيس خطك",
        text: "نتبادل البيانات مع خادم قريب لقياس البينغ والتذبذب وسرعة التحميل والرفع.",
      },
      {
        title: "اقرأ نتائجك",
        text: "اطّلع على سرعتك بوحدة Mbps وقارنها بباقتك وبما تحتاجه أنشطتك.",
      },
    ],
    cta: "تعرّف على طريقة عمل الاختبار",
  },
  needs: {
    kicker: "دليل السرعة",
    title: "ما سرعة الإنترنت التي تحتاجها؟",
    intro:
      "تعتمد السرعة التي تحتاجها على ما تفعله عبر الإنترنت وعدد الأجهزة التي تتشارك اتصالك. قارن نتيجتك بهذا الجدول.",
    colUse: "ما تفعله",
    colSpeed: "سرعة التحميل الموصى بها",
    rows: [
      { use: "تصفح الويب والبريد الإلكتروني", speed: "5–10 Mbps" },
      { use: "بث الفيديو بدقة HD", speed: "10–25 Mbps" },
      { use: "بث 4K والألعاب عبر الإنترنت", speed: "25–100 Mbps" },
      { use: "عدة مستخدمين و4K والعمل عن بُعد", speed: "100–500 Mbps" },
      { use: "المنازل كثيفة الاستخدام وصنّاع المحتوى", speed: "500–1000+ Mbps" },
    ],
    guideCta: "اقرأ دليل السرعة الكامل",
    runCta: "أجرِ اختبار السرعة",
  },
  tools: {
    kicker: "أدوات مجانية",
    title: "طرق أخرى لفحص اتصالك",
    intro: "اختبارات مخصصة لكل جانب من اتصالك، إلى جانب أدوات لفحص عنوان IP الخاص بك.",
  },
  about: {
    title: "لماذا تختبر سرعة الإنترنت؟",
    paragraphs: [
      "يعلن مزودو الإنترنت عن سرعات «تصل إلى» عدد معين من الميغابت في الثانية، لكن السرعة التي تحصل عليها فعليًا قد تختلف بحسب وقت اليوم وإعدادات WiFi لديك وأجهزتك وازدحام الشبكة. ويكشف اختبار سرعة سريع عن سرعة التحميل والرفع وزمن الاستجابة الفعلية التي تصل إلى جهازك الآن.",
      "يساعدك الاختبار المنتظم على اكتشاف المشكلات مبكرًا: إذا كان البث يتوقف للتحميل أو تتجمد مكالمات الفيديو أو تتأخر الألعاب، فستخبرك نتائجك ما إذا كانت المشكلة في باقتك أم في شبكة WiFi أم في شيء آخر. ويمكنك أيضًا الاستعانة بالنتائج عند التواصل مع مزود الخدمة أو عند مقارنة العروض قبل تغيير المزود.",
      "للحصول على أدق قياس، اختبر عبر اتصال Ethernet سلكي، وأوقف التنزيلات والبث الأخرى مؤقتًا، وكرّر الاختبار مرتين أو ثلاثًا في أوقات مختلفة. وتكشف مقارنة نتائج WiFi والاتصال السلكي مقدار السرعة الذي تخسره بسبب شبكتك اللاسلكية.",
    ],
  },
  guides: {
    kicker: "أدلة",
    title: "أدلة لاتصال أسرع",
    intro: "شروح مبسّطة حول WiFi والبينغ والبث وبطء الإنترنت.",
    all: "كل المقالات",
  },
  faq: {
    kicker: "الأسئلة الشائعة",
    title: "أسئلة متكررة",
    items: [
      {
        q: "ما سرعة الإنترنت الجيدة؟",
        a: "بالنسبة لمعظم المنازل، تُعد سرعة تحميل بين 25–100 Mbps جيدة للبث والتصفح ومكالمات الفيديو. أما المنازل الأكبر أو بث 4K أو الألعاب فتستفيد من 100–500 Mbps. وتعتمد السرعة المناسبة على عدد الأجهزة التي تستخدم اتصالك في الوقت نفسه.",
      },
      {
        q: "كيف يعمل اختبار سرعة الإنترنت هذا؟",
        a: "يقيس اختبارنا سرعة التحميل (مدى سرعة استقبالك للبيانات)، وسرعة الرفع (مدى سرعة إرسالك للبيانات)، والبينغ والتذبذب (مدى سرعة استجابة اتصالك وثباتها). يفتح الاختبار عدة اتصالات مع خادم قريب، وينقل البيانات لبضع ثوانٍ، ثم يحسب سرعتك الفعلية بوحدة Mbps.",
      },
      {
        q: "لماذا نتيجة الاختبار أقل من سرعة باقتي؟",
        a: "قد تؤدي تداخلات WiFi، والبعد عن الراوتر، والجهاز الذي تستخدمه، والتنزيلات في الخلفية، وشبكات VPN، والازدحام في أوقات الذروة إلى خفض السرعة المقاسة. للحصول على أدق نتيجة، اختبر عبر اتصال سلكي مع إبقاء الأجهزة الأخرى خاملة.",
      },
      {
        q: "ماذا تعني سرعة التحميل والرفع والبينغ؟",
        a: "سرعة التحميل هي مدى سرعة جلب البيانات من الإنترنت (البث، التصفح). وسرعة الرفع هي مدى سرعة إرسال البيانات (مكالمات الفيديو، النسخ الاحتياطي). أما البينغ فهو زمن استجابة اتصالك بالمللي ثانية، وكلما انخفض كان أفضل، خاصة للألعاب.",
      },
      {
        q: "ما الفرق بين Mbps وMB/s؟",
        a: "تُقاس سرعة الإنترنت بالميغابت في الثانية (Mbps)، بينما تُعرض أحجام الملفات عادةً بالميغابايت (MB). البايت الواحد يساوي ثماني بتات، لذا فإن اتصالًا بسرعة 100 Mbps ينزّل بحد أقصى نحو 12.5 MB في الثانية.",
      },
      {
        q: "هل الأفضل الاختبار عبر WiFi أم بالكابل؟",
        a: "يُظهر اتصال Ethernet السلكي السرعة الحقيقية التي يقدمها مزود الخدمة، أما اختبار WiFi فيُظهر ما تحصل عليه أجهزتك فعليًا. وإجراء الاختبارين يخبرك ما إذا كانت النتيجة البطيئة سببها باقتك أم شبكتك اللاسلكية.",
      },
      {
        q: "كم يستهلك اختبار السرعة من البيانات؟",
        a: "يعتمد ذلك على سرعتك، لأن الاختبار يستمر عددًا ثابتًا من الثواني: قد يستهلك الخط البطيء بضع عشرات من الميغابايت فقط، بينما قد يستهلك اتصال ألياف سريع عدة مئات من الميغابايت أو أكثر. إذا كانت باقة بيانات الجوال لديك محدودة، فضع ذلك في الحسبان قبل تكرار الاختبار.",
      },
      {
        q: "هل اختبار سرعة الإنترنت هذا مجاني؟",
        a: "نعم. TestSpeedInternet مجاني تمامًا، ولا يتطلب تسجيلًا ولا تنزيل أي تطبيق. يمكنك إجراء ما تشاء من اختبارات السرعة على أي جهاز.",
      },
    ],
  },
  cta: {
    title: "هل أنت مستعد لاختبار سرعة الإنترنت؟",
    text: "مجاني وسريع ويعمل على أي جهاز. اكتشف الآن سرعة التحميل والرفع الحقيقية لديك.",
    button: "ابدأ اختبار السرعة",
  },
  jsonLd: {
    appDescription:
      "اختبار سرعة إنترنت مجاني لقياس سرعة التحميل والرفع والبينغ والتذبذب على أي جهاز.",
  },
};

const ru: HomeMessages = {
  meta: {
    title: "Тест скорости интернета бесплатно: загрузка, отдача и пинг",
    description:
      "Проверьте скорость интернета бесплатно: спидтест измерит загрузку, отдачу, пинг и джиттер за секунды на любом устройстве. Без приложений и регистрации.",
    keywords: [
      "тест скорости интернета",
      "проверить скорость интернета",
      "спидтест",
      "проверка скорости интернета",
      "замер скорости интернета",
      "скорость интернета онлайн",
      "тест скорости wi-fi",
      "проверить пинг",
    ],
  },
  hero: {
    eyebrow: "Бесплатно · Без регистрации · Результаты в реальном времени",
    titleLead: "Проверьте скорость интернета",
    titleHighlight: "за считаные секунды",
    intro:
      "Измерьте скорость загрузки и отдачи, пинг и джиттер на любом устройстве. Запустите тест и узнайте, получаете ли вы ту скорость, за которую платите.",
  },
  trust: [
    { title: "100% бесплатно", text: "Без ограничений и скрытых платежей" },
    { title: "Без регистрации", text: "Ни аккаунта, ни приложений" },
    { title: "Конфиденциально", text: "Мы не продаём данные ваших тестов" },
    { title: "Любое устройство", text: "Смартфон, планшет, ноутбук или ПК" },
  ],
  metrics: {
    kicker: "Разберитесь в результатах",
    title: "Что означают результаты теста скорости",
    intro:
      "Тест скорости показывает четыре числа. Вот что измеряет каждое из них и какое значение считается хорошим для обычного домашнего подключения.",
    goodLabel: "Хорошее значение",
    items: [
      {
        name: "Скорость загрузки",
        unit: "Мбит/с",
        text: "Насколько быстро ваше подключение получает данные из интернета. От неё зависят качество видео, загрузка страниц, обновления приложений и скачивание файлов.",
        good: "От 25 Мбит/с",
      },
      {
        name: "Скорость отдачи",
        unit: "Мбит/с",
        text: "Насколько быстро вы отправляете данные. Это важно для видеозвонков, публикации фото и видео, облачных резервных копий и прямых трансляций.",
        good: "От 10 Мбит/с",
      },
      {
        name: "Пинг (задержка)",
        unit: "мс",
        text: "Время, за которое небольшой пакет доходит до сервера и возвращается обратно. Чем меньше, тем лучше: игры, звонки и сайты откликаются быстрее.",
        good: "Менее 50 мс",
      },
      {
        name: "Джиттер",
        unit: "мс",
        text: "Насколько сильно пинг меняется от момента к моменту. Низкий джиттер означает стабильное соединение без скачков задержки и прерывистых звонков.",
        good: "Менее 30 мс",
      },
    ],
  },
  features: {
    kicker: "Почему TestSpeedInternet",
    title: "Быстрый, точный и конфиденциальный тест скорости",
    intro: "Всё, что нужно для проверки подключения, и ничего лишнего.",
    items: [
      {
        title: "Мгновенно и точно",
        text: "Точные результаты загрузки, отдачи и пинга за секунды благодаря нескольким параллельным соединениям, которые полностью загружают канал.",
      },
      {
        title: "Бесплатно и конфиденциально",
        text: "Без регистрации, приложений и продажи персональных данных. Откройте страницу, нажмите «Старт» и получите результат.",
      },
      {
        title: "Работает на любом устройстве",
        text: "Проверяйте скорость на смартфоне, планшете, ноутбуке или компьютере в любом современном браузере. Инструмент адаптируется под любой экран.",
      },
      {
        title: "Wi-Fi, оптоволокно, 5G и кабель",
        text: "Какой бы ни был тип подключения, измерьте реальную пропускную способность, которую даёт ваш провайдер.",
      },
      {
        title: "Глобальная сеть",
        text: "Тесты проходят через мировую edge-сеть, поэтому данные идут реальным интернет-маршрутом до ближайшего сервера.",
      },
      {
        title: "Понятные и честные результаты",
        text: "Каждое число объяснено простым языком, чтобы вы понимали, подходит ли подключение для ваших задач.",
      },
    ],
  },
  steps: {
    kicker: "Как это работает",
    title: "Три шага, чтобы измерить подключение",
    intro: "Ничего не нужно скачивать и настраивать. Весь тест занимает меньше минуты.",
    items: [
      { title: "Нажмите «Старт»", text: "Запустите тест одним кликом. Он полностью выполняется в браузере." },
      {
        title: "Мы измеряем канал",
        text: "Мы обмениваемся данными с ближайшим сервером, чтобы измерить пинг, джиттер, скорость загрузки и отдачи.",
      },
      {
        title: "Смотрите результаты",
        text: "Узнайте свою скорость в Мбит/с и сравните её с тарифом и с тем, что нужно для ваших задач.",
      },
    ],
    cta: "Узнать, как работает тест",
  },
  needs: {
    kicker: "Гид по скорости",
    title: "Какая скорость интернета вам нужна?",
    intro:
      "Нужная скорость зависит от того, чем вы занимаетесь в интернете и сколько устройств используют подключение. Сравните свой результат с этой таблицей.",
    colUse: "Чем вы занимаетесь",
    colSpeed: "Рекомендуемая загрузка",
    rows: [
      { use: "Сайты и электронная почта", speed: "5–10 Мбит/с" },
      { use: "Видео в HD", speed: "10–25 Мбит/с" },
      { use: "4K-видео и онлайн-игры", speed: "25–100 Мбит/с" },
      { use: "Несколько пользователей, 4K и удалённая работа", speed: "100–500 Мбит/с" },
      { use: "Большие семьи и авторы контента", speed: "500–1000+ Мбит/с" },
    ],
    guideCta: "Читать полный гид по скорости",
    runCta: "Запустить тест скорости",
  },
  tools: {
    kicker: "Бесплатные инструменты",
    title: "Другие способы проверить подключение",
    intro: "Отдельные тесты для каждого параметра подключения, а также инструменты для проверки IP-адреса.",
  },
  about: {
    title: "Зачем проверять скорость интернета?",
    paragraphs: [
      "Провайдеры рекламируют скорость «до» определённого числа мегабит в секунду, но реальная скорость может меняться в зависимости от времени суток, настройки Wi-Fi, ваших устройств и загруженности сети. Быстрый тест скорости показывает реальную скорость загрузки, отдачи и задержку, которые получает ваше устройство прямо сейчас.",
      "Регулярные проверки помогают вовремя заметить проблемы: если видео подвисает, видеозвонки зависают, а игры лагают, результаты подскажут, в чём причина — в тарифе, в Wi-Fi или в чём-то ещё. Результаты также пригодятся при обращении к провайдеру или при сравнении предложений перед сменой оператора.",
      "Для самого точного замера подключитесь по кабелю Ethernet, приостановите другие загрузки и трансляции и запустите тест два-три раза в разное время суток. Сравнение результатов по Wi-Fi и по кабелю покажет, сколько скорости теряется в беспроводной сети.",
    ],
  },
  guides: {
    kicker: "Статьи",
    title: "Советы для более быстрого интернета",
    intro: "Простые объяснения о Wi-Fi, пинге, стриминге и медленном интернете.",
    all: "Все статьи",
  },
  faq: {
    kicker: "Вопросы и ответы",
    title: "Частые вопросы",
    items: [
      {
        q: "Какая скорость интернета считается хорошей?",
        a: "Для большинства домохозяйств хорошей считается скорость загрузки 25–100 Мбит/с: её достаточно для видео, сёрфинга и видеозвонков. Большим семьям, для 4K-видео или игр лучше подойдут 100–500 Мбит/с. Нужная скорость зависит от того, сколько устройств одновременно пользуются подключением.",
      },
      {
        q: "Как работает этот тест скорости интернета?",
        a: "Наш тест измеряет скорость загрузки (как быстро вы получаете данные), скорость отдачи (как быстро вы их отправляете), а также пинг и джиттер (насколько быстро и стабильно отвечает подключение). Он открывает несколько соединений с ближайшим сервером, передаёт данные несколько секунд и рассчитывает реальную пропускную способность в Мбит/с.",
      },
      {
        q: "Почему результат теста ниже, чем скорость по тарифу?",
        a: "Помехи Wi-Fi, расстояние до роутера, используемое устройство, фоновые загрузки, VPN и перегрузка сети в часы пик — всё это может снижать измеренную скорость. Для самого точного результата проверяйте по кабелю, когда остальные устройства не используют сеть.",
      },
      {
        q: "Что означают загрузка, отдача и пинг?",
        a: "Скорость загрузки — это то, как быстро вы получаете данные из интернета (видео, сайты). Скорость отдачи — как быстро вы отправляете данные (видеозвонки, резервные копии). Пинг — время отклика подключения в миллисекундах; чем он ниже, тем лучше, особенно для игр.",
      },
      {
        q: "Чем Мбит/с отличается от МБ/с?",
        a: "Скорость интернета измеряют в мегабитах в секунду (Мбит/с), а размер файлов обычно указывают в мегабайтах (МБ). В одном байте восемь бит, поэтому подключение на 100 Мбит/с скачивает максимум около 12,5 МБ в секунду.",
      },
      {
        q: "Где лучше проверять скорость: по Wi-Fi или по кабелю?",
        a: "Проводное подключение Ethernet показывает реальную скорость, которую даёт провайдер. Тест по Wi-Fi показывает, что на самом деле получают ваши устройства. Проверив оба варианта, вы поймёте, в чём причина низкой скорости — в тарифе или в беспроводной сети.",
      },
      {
        q: "Сколько трафика расходует тест скорости?",
        a: "Это зависит от скорости, потому что тест длится фиксированное число секунд: на медленной линии он может израсходовать лишь несколько десятков мегабайт, а на быстром оптоволокне — несколько сотен мегабайт и больше. Если у вас мобильный тариф с ограниченным трафиком, учитывайте это перед повторными проверками.",
      },
      {
        q: "Этот тест скорости интернета бесплатный?",
        a: "Да. TestSpeedInternet полностью бесплатен и не требует регистрации или установки приложений. Проверяйте скорость сколько угодно раз на любом устройстве.",
      },
    ],
  },
  cta: {
    title: "Готовы проверить скорость интернета?",
    text: "Это бесплатно, быстро и работает на любом устройстве. Узнайте реальную скорость загрузки и отдачи прямо сейчас.",
    button: "Начать тест скорости",
  },
  jsonLd: {
    appDescription:
      "Бесплатный тест скорости интернета для измерения скорости загрузки и отдачи, пинга и джиттера на любом устройстве.",
  },
};

export const homeMessages: Record<Locale, HomeMessages> = { en, fr, es, ar, ru };
