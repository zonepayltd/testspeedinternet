import type { Locale } from "../config";

// "What is a good internet speed?" guide.
const en = {
  meta: {
    title: "What Is a Good Internet Speed? Mbps Guide (2026)",
    description:
      "What is a good internet speed? See recommended download and upload speeds in Mbps for streaming, gaming, video calls and big households, and check yours.",
    keywords: [
      "what is a good internet speed",
      "good download speed",
      "good upload speed",
      "how many mbps do i need",
      "internet speed for streaming",
      "internet speed for gaming",
    ],
  },
  hero: {
    eyebrow: "Speed guide",
    titleLead: "What is a good",
    titleHighlight: "internet speed?",
    intro:
      "The right speed depends on what you do online and how many devices share your connection. Here is how many Mbps you really need.",
    cta: "Test your speed now",
    secondary: "See the table",
  },
  summary: {
    title: "The short answer",
    text: "For most households, 25–100 Mbps download and 5–20 Mbps upload is good. One or two light users can manage with 10–25 Mbps, while busy homes with 4K streaming, gaming and remote work are best served by 100–500 Mbps. A low, stable ping under 50 ms matters as much as raw speed.",
  },
  tiers: {
    title: "Internet speed tiers at a glance",
    intro: "How a download speed result typically feels in everyday use.",
    items: [
      { range: "Under 10 Mbps", label: "Slow", text: "Basic browsing and email. Video may buffer, and several users will struggle." },
      { range: "10–50 Mbps", label: "Basic", text: "HD streaming and video calls for one to three people." },
      { range: "50–200 Mbps", label: "Good", text: "4K streaming, gaming and remote work for a typical family." },
      { range: "200–500 Mbps", label: "Fast", text: "Many simultaneous 4K streams, large downloads and smart homes." },
      { range: "500+ Mbps", label: "Very fast", text: "Gigabit fiber territory: heavy households, creators and huge files." },
    ],
  },
  uses: {
    title: "How much speed do you need?",
    intro: "Recommended download speeds by activity.",
    items: [
      { title: "Browsing and email", speed: "5–10 Mbps", text: "Web pages, email, social media and music streaming for one or two people." },
      { title: "Video calls", speed: "5–15 Mbps", text: "Smooth HD video calls on Zoom, Meet or Teams, including upload." },
      { title: "HD and 4K streaming", speed: "25–50 Mbps", text: "Netflix, YouTube and Disney+ in HD or 4K without buffering." },
      { title: "Online gaming", speed: "25–100 Mbps", text: "Low-lag gaming. Speed matters less than a low, stable ping here." },
      { title: "Busy households", speed: "100–500 Mbps", text: "Several people streaming, gaming and working online at the same time." },
      { title: "Creators and heavy use", speed: "500–1000+ Mbps", text: "Large uploads, cloud backups and 4K streaming to many devices at once." },
    ],
  },
  table: {
    title: "Recommended speed by household",
    intro: "Download and upload speeds to aim for, depending on who lives with you and what they do.",
    cols: ["Household", "Download", "Upload"],
    rows: [
      { use: "1–2 people, browsing and SD video", down: "10–25 Mbps", up: "3–5 Mbps" },
      { use: "HD streaming and video calls", down: "25–50 Mbps", up: "5–10 Mbps" },
      { use: "4K streaming and gaming", down: "50–100 Mbps", up: "10–20 Mbps" },
      { use: "Family of 3–5, many devices", down: "100–300 Mbps", up: "20–50 Mbps" },
      { use: "Power users and creators", down: "500–1000+ Mbps", up: "50–200 Mbps" },
    ],
  },
  factors: {
    title: "What decides the speed you need",
    items: [
      {
        title: "Number of people and devices",
        text: "Speed is shared. Two people streaming 4K while a third is on a video call need the sum of all three, plus headroom for phones and smart devices updating in the background.",
      },
      {
        title: "Upload, not just download",
        text: "Video calls, cloud backups, online gaming and live streaming all send data. If you work from home or create content, check the upload speed of a plan, not only its headline download number.",
      },
      {
        title: "Ping and stability",
        text: "Games and calls are more sensitive to latency and jitter than to bandwidth. A stable connection with a ping under 50 ms often feels better than a faster but less consistent one.",
      },
      {
        title: "Your home network",
        text: "A fast plan cannot help if your WiFi is weak. Router placement, the WiFi standard of your devices and the number of walls between you and the router can cut speeds dramatically.",
      },
    ],
  },
  units: {
    title: "Mbps, MB/s and Gbps explained",
    paragraphs: [
      "Internet speeds are measured in megabits per second (Mbps). File sizes are measured in megabytes (MB). Because one byte is eight bits, divide a speed in Mbps by eight to get the maximum megabytes per second: 100 Mbps is about 12.5 MB/s.",
      "1 Gbps (gigabit per second) equals 1,000 Mbps. Gigabit plans are increasingly common on fiber, but you will only see those speeds on a wired connection or with a recent WiFi 6, 6E or 7 router and device.",
    ],
  },
  faqTitle: "Good internet speed FAQ",
  faqs: [
    {
      q: "What is a good internet speed?",
      a: "For most households a download speed of 25–100 Mbps is good. It comfortably handles HD and 4K streaming, video calls and several connected devices. Light users are fine with 10–25 Mbps, while large or heavy-use homes benefit from 100–500 Mbps.",
    },
    {
      q: "Is 100 Mbps fast?",
      a: "Yes. 100 Mbps is fast enough for 4K streaming, online gaming and a busy household with multiple devices online at once. It is a great target for most families.",
    },
    {
      q: "What is a good upload speed?",
      a: "5–10 Mbps is enough for most people and video calls. If you upload large files, back up to the cloud or live stream, aim for 20 Mbps or more, which fiber connections usually provide.",
    },
    {
      q: "Is 1 Gbps worth it?",
      a: "Gigabit internet is worth it for large households, creators who move big files, and homes with many 4K screens. For one or two people who mostly browse and stream, 100–300 Mbps usually feels identical in daily use.",
    },
    {
      q: "What internet speed do I need to work from home?",
      a: "Aim for at least 25 Mbps download and 10 Mbps upload per person working from home, with a ping below 50 ms. Regular video calls and large file transfers benefit from more upload.",
    },
    {
      q: "Does a higher speed always mean better internet?",
      a: "Not always. Beyond what your activities need, extra speed adds little. A low and stable ping, good WiFi coverage and reliability often matter more for everyday experience than a very high Mbps number.",
    },
  ],
  cta: {
    title: "How fast is your connection?",
    text: "Run a free speed test and compare your result with the recommendations above.",
    button: "Start speed test",
  },
};

export type GuideMessages = typeof en;

const fr: GuideMessages = {
  meta: {
    title: "Quel est un bon débit internet ? Guide des Mbps (2026)",
    description:
      "Quel est un bon débit internet ? Débits descendant et montant conseillés en Mbps pour le streaming, le jeu, la visio et les grands foyers, et testez le vôtre.",
    keywords: [
      "bon débit internet",
      "quel débit internet choisir",
      "débit internet recommandé",
      "combien de mbps faut-il",
      "bon débit montant",
      "débit pour streaming",
      "débit pour jouer en ligne",
    ],
  },
  hero: {
    eyebrow: "Guide des débits",
    titleLead: "Quel est un bon",
    titleHighlight: "débit internet ?",
    intro:
      "Le bon débit dépend de vos usages en ligne et du nombre d’appareils qui partagent votre connexion. Voici combien de Mbps il vous faut vraiment.",
    cta: "Tester mon débit",
    secondary: "Voir le tableau",
  },
  summary: {
    title: "La réponse courte",
    text: "Pour la plupart des foyers, 25–100 Mbps en débit descendant et 5–20 Mbps en débit montant suffisent. Un ou deux utilisateurs occasionnels s’en sortent avec 10–25 Mbps, tandis que les foyers très connectés (streaming 4K, jeux, télétravail) seront mieux servis par 100–500 Mbps. Un ping bas et stable, sous 50 ms, compte autant que le débit brut.",
  },
  tiers: {
    title: "Les niveaux de débit en un coup d’œil",
    intro: "Ce que donne en pratique un résultat de débit descendant au quotidien.",
    items: [
      { range: "Moins de 10 Mbps", label: "Lent", text: "Navigation simple et e-mails. La vidéo peut saccader et plusieurs utilisateurs seront à l’étroit." },
      { range: "10–50 Mbps", label: "Correct", text: "Streaming HD et appels vidéo pour une à trois personnes." },
      { range: "50–200 Mbps", label: "Bon", text: "Streaming 4K, jeux et télétravail pour une famille classique." },
      { range: "200–500 Mbps", label: "Rapide", text: "Plusieurs flux 4K simultanés, gros téléchargements et maison connectée." },
      { range: "500+ Mbps", label: "Très rapide", text: "Le territoire de la fibre gigabit : foyers très connectés, créateurs et fichiers volumineux." },
    ],
  },
  uses: {
    title: "De quel débit avez-vous besoin ?",
    intro: "Débits descendants conseillés selon l’usage.",
    items: [
      { title: "Navigation et e-mails", speed: "5–10 Mbps", text: "Pages web, e-mails, réseaux sociaux et musique en streaming pour une ou deux personnes." },
      { title: "Appels vidéo", speed: "5–15 Mbps", text: "Des appels vidéo HD fluides sur Zoom, Meet ou Teams, upload compris." },
      { title: "Streaming HD et 4K", speed: "25–50 Mbps", text: "Netflix, YouTube et Disney+ en HD ou en 4K sans mise en mémoire tampon." },
      { title: "Jeux en ligne", speed: "25–100 Mbps", text: "Jouer sans lag. Ici, le débit compte moins qu’un ping bas et stable." },
      { title: "Foyers très connectés", speed: "100–500 Mbps", text: "Plusieurs personnes qui regardent des vidéos, jouent et travaillent en ligne en même temps." },
      { title: "Créateurs et usage intensif", speed: "500–1000+ Mbps", text: "Gros envois de fichiers, sauvegardes cloud et streaming 4K sur de nombreux appareils à la fois." },
    ],
  },
  table: {
    title: "Débit conseillé selon le foyer",
    intro: "Les débits descendant et montant à viser selon la composition de votre foyer et vos usages.",
    cols: ["Foyer", "Débit descendant", "Débit montant"],
    rows: [
      { use: "1–2 personnes, navigation et vidéo SD", down: "10–25 Mbps", up: "3–5 Mbps" },
      { use: "Streaming HD et appels vidéo", down: "25–50 Mbps", up: "5–10 Mbps" },
      { use: "Streaming 4K et jeux", down: "50–100 Mbps", up: "10–20 Mbps" },
      { use: "Famille de 3–5 personnes, nombreux appareils", down: "100–300 Mbps", up: "20–50 Mbps" },
      { use: "Utilisateurs intensifs et créateurs", down: "500–1000+ Mbps", up: "50–200 Mbps" },
    ],
  },
  factors: {
    title: "Ce qui détermine le débit dont vous avez besoin",
    items: [
      {
        title: "Le nombre de personnes et d’appareils",
        text: "Le débit se partage. Deux personnes en streaming 4K pendant qu’une troisième est en visio ont besoin de la somme des trois, plus une marge pour les smartphones et objets connectés qui se mettent à jour en arrière-plan.",
      },
      {
        title: "L’upload, pas seulement le download",
        text: "Appels vidéo, sauvegardes cloud, jeux en ligne et streaming en direct envoient tous des données. Si vous télétravaillez ou créez du contenu, vérifiez le débit montant d’une offre, pas seulement son débit descendant affiché.",
      },
      {
        title: "Ping et stabilité",
        text: "Les jeux et les appels sont plus sensibles à la latence et à la gigue qu’à la bande passante. Une connexion stable avec un ping inférieur à 50 ms paraît souvent meilleure qu’une connexion plus rapide mais moins régulière.",
      },
      {
        title: "Votre réseau domestique",
        text: "Une offre rapide ne sert à rien si votre Wi-Fi est faible. L’emplacement de la box, la norme Wi-Fi de vos appareils et le nombre de murs entre vous et le routeur peuvent faire chuter le débit de façon spectaculaire.",
      },
    ],
  },
  units: {
    title: "Mbps, Mo/s et Gbps : les unités expliquées",
    paragraphs: [
      "Les débits internet se mesurent en mégabits par seconde (Mbps), la taille des fichiers en mégaoctets (Mo). Comme un octet vaut huit bits, divisez un débit en Mbps par huit pour obtenir le maximum de mégaoctets par seconde : 100 Mbps correspondent à environ 12,5 Mo/s.",
      "1 Gbps (gigabit par seconde) équivaut à 1 000 Mbps. Les offres gigabit sont de plus en plus courantes en fibre, mais vous n’atteindrez ces débits qu’en filaire ou avec une box et un appareil récents compatibles Wi-Fi 6, 6E ou 7.",
    ],
  },
  faqTitle: "FAQ sur le bon débit internet",
  faqs: [
    {
      q: "Quel est un bon débit internet ?",
      a: "Pour la plupart des foyers, un débit descendant de 25–100 Mbps est bon. Il permet sans difficulté le streaming HD et 4K, les appels vidéo et plusieurs appareils connectés. Les petits utilisateurs se contentent de 10–25 Mbps, tandis que les grands foyers ou les usages intensifs profitent de 100–500 Mbps.",
    },
    {
      q: "100 Mbps, est-ce rapide ?",
      a: "Oui. 100 Mbps suffisent pour le streaming 4K, le jeu en ligne et un foyer actif avec plusieurs appareils connectés en même temps. C’est un excellent objectif pour la plupart des familles.",
    },
    {
      q: "Quel est un bon débit montant ?",
      a: "5–10 Mbps suffisent pour la plupart des gens et pour les appels vidéo. Si vous envoyez de gros fichiers, sauvegardez dans le cloud ou diffusez en direct, visez 20 Mbps ou plus, ce que la fibre offre généralement.",
    },
    {
      q: "Le 1 Gbps vaut-il le coup ?",
      a: "Internet gigabit vaut le coup pour les grands foyers, les créateurs qui manipulent de gros fichiers et les maisons équipées de nombreux écrans 4K. Pour une ou deux personnes qui naviguent et regardent surtout des vidéos, 100–300 Mbps donnent généralement la même impression au quotidien.",
    },
    {
      q: "Quel débit internet pour télétravailler ?",
      a: "Visez au moins 25 Mbps en débit descendant et 10 Mbps en débit montant par personne en télétravail, avec un ping inférieur à 50 ms. Les appels vidéo fréquents et les gros transferts de fichiers profitent d’un débit montant plus élevé.",
    },
    {
      q: "Un débit plus élevé signifie-t-il toujours un meilleur internet ?",
      a: "Pas toujours. Au-delà de ce dont vos usages ont besoin, un débit supplémentaire apporte peu. Un ping bas et stable, une bonne couverture Wi-Fi et la fiabilité comptent souvent plus au quotidien qu’un nombre de Mbps très élevé.",
    },
  ],
  cta: {
    title: "Quel est le débit de votre connexion ?",
    text: "Lancez un test de débit gratuit et comparez votre résultat aux recommandations ci-dessus.",
    button: "Lancer le test de débit",
  },
};

const es: GuideMessages = {
  meta: {
    title: "¿Qué es una buena velocidad de internet? Guía Mbps (2026)",
    description:
      "¿Qué es una buena velocidad de internet? Consulta las velocidades de descarga y subida recomendadas en Mbps para streaming, juegos, videollamadas y hogares.",
    keywords: [
      "buena velocidad de internet",
      "qué velocidad de internet necesito",
      "cuántos megas necesito",
      "cuántos mbps necesito",
      "buena velocidad de subida",
      "velocidad de internet para streaming",
      "velocidad de internet para jugar",
    ],
  },
  hero: {
    eyebrow: "Guía de velocidad",
    titleLead: "¿Qué es una buena",
    titleHighlight: "velocidad de internet?",
    intro:
      "La velocidad adecuada depende de lo que haces en línea y de cuántos dispositivos comparten tu conexión. Estos son los Mbps que realmente necesitas.",
    cta: "Mide tu velocidad ahora",
    secondary: "Ver la tabla",
  },
  summary: {
    title: "La respuesta corta",
    text: "Para la mayoría de los hogares, 25–100 Mbps de descarga y 5–20 Mbps de subida es una buena velocidad. Uno o dos usuarios con un uso ligero pueden arreglarse con 10–25 Mbps, mientras que los hogares con streaming 4K, juegos y teletrabajo están mejor servidos con 100–500 Mbps. Un ping bajo y estable, por debajo de 50 ms, importa tanto como la velocidad bruta.",
  },
  tiers: {
    title: "Niveles de velocidad de internet de un vistazo",
    intro: "Cómo se nota en el día a día un resultado de velocidad de descarga.",
    items: [
      { range: "Menos de 10 Mbps", label: "Lenta", text: "Navegación básica y correo. El video puede cortarse y varios usuarios tendrán problemas." },
      { range: "10–50 Mbps", label: "Básica", text: "Streaming HD y videollamadas para una a tres personas." },
      { range: "50–200 Mbps", label: "Buena", text: "Streaming 4K, juegos y teletrabajo para una familia típica." },
      { range: "200–500 Mbps", label: "Rápida", text: "Varias transmisiones 4K simultáneas, descargas grandes y hogares inteligentes." },
      { range: "500+ Mbps", label: "Muy rápida", text: "Terreno de la fibra gigabit: hogares con uso intensivo, creadores y archivos enormes." },
    ],
  },
  uses: {
    title: "¿Cuánta velocidad necesitas?",
    intro: "Velocidades de descarga recomendadas según la actividad.",
    items: [
      { title: "Navegación y correo", speed: "5–10 Mbps", text: "Páginas web, correo, redes sociales y música en streaming para una o dos personas." },
      { title: "Videollamadas", speed: "5–15 Mbps", text: "Videollamadas HD fluidas en Zoom, Meet o Teams, incluida la subida." },
      { title: "Streaming HD y 4K", speed: "25–50 Mbps", text: "Netflix, YouTube y Disney+ en HD o 4K sin cortes." },
      { title: "Juegos en línea", speed: "25–100 Mbps", text: "Juega sin lag. Aquí importa menos la velocidad que un ping bajo y estable." },
      { title: "Hogares muy conectados", speed: "100–500 Mbps", text: "Varias personas viendo series, jugando y trabajando en línea al mismo tiempo." },
      { title: "Creadores y uso intensivo", speed: "500–1000+ Mbps", text: "Subidas grandes, copias de seguridad en la nube y streaming 4K en muchos dispositivos a la vez." },
    ],
  },
  table: {
    title: "Velocidad recomendada según el hogar",
    intro: "Velocidades de descarga y subida a las que apuntar, según quién vive contigo y qué hace.",
    cols: ["Hogar", "Descarga", "Subida"],
    rows: [
      { use: "1–2 personas, navegación y video SD", down: "10–25 Mbps", up: "3–5 Mbps" },
      { use: "Streaming HD y videollamadas", down: "25–50 Mbps", up: "5–10 Mbps" },
      { use: "Streaming 4K y juegos", down: "50–100 Mbps", up: "10–20 Mbps" },
      { use: "Familia de 3–5, muchos dispositivos", down: "100–300 Mbps", up: "20–50 Mbps" },
      { use: "Usuarios avanzados y creadores", down: "500–1000+ Mbps", up: "50–200 Mbps" },
    ],
  },
  factors: {
    title: "Qué determina la velocidad que necesitas",
    items: [
      {
        title: "Número de personas y dispositivos",
        text: "La velocidad se comparte. Dos personas viendo contenido en 4K mientras una tercera está en una videollamada necesitan la suma de las tres, más un margen para móviles y dispositivos inteligentes que se actualizan en segundo plano.",
      },
      {
        title: "La subida, no solo la descarga",
        text: "Las videollamadas, las copias de seguridad en la nube, los juegos en línea y las transmisiones en directo envían datos. Si teletrabajas o creas contenido, revisa la velocidad de subida de un plan, no solo la cifra de descarga que anuncia.",
      },
      {
        title: "Ping y estabilidad",
        text: "Los juegos y las llamadas son más sensibles a la latencia y al jitter que al ancho de banda. Una conexión estable con un ping inferior a 50 ms suele sentirse mejor que una más rápida pero menos constante.",
      },
      {
        title: "Tu red doméstica",
        text: "Un plan rápido no sirve de mucho si tu WiFi es débil. La ubicación del router, el estándar WiFi de tus dispositivos y la cantidad de paredes entre tú y el router pueden reducir drásticamente la velocidad.",
      },
    ],
  },
  units: {
    title: "Mbps, MB/s y Gbps explicados",
    paragraphs: [
      "La velocidad de internet se mide en megabits por segundo (Mbps). El tamaño de los archivos se mide en megabytes (MB). Como un byte son ocho bits, divide una velocidad en Mbps entre ocho para obtener los megabytes por segundo máximos: 100 Mbps equivalen a unos 12.5 MB/s.",
      "1 Gbps (gigabit por segundo) equivale a 1000 Mbps. Los planes de un gigabit son cada vez más comunes en fibra, pero solo verás esas velocidades con una conexión por cable o con un router y un dispositivo recientes con WiFi 6, 6E o 7.",
    ],
  },
  faqTitle: "Preguntas frecuentes sobre la velocidad de internet",
  faqs: [
    {
      q: "¿Qué es una buena velocidad de internet?",
      a: "Para la mayoría de los hogares, una velocidad de descarga de 25–100 Mbps es buena. Permite sin problemas streaming en HD y 4K, videollamadas y varios dispositivos conectados. A los usuarios con un uso ligero les bastan 10–25 Mbps, mientras que los hogares grandes o con uso intensivo se benefician de 100–500 Mbps.",
    },
    {
      q: "¿100 Mbps es rápido?",
      a: "Sí. 100 Mbps es suficiente para streaming en 4K, juegos en línea y un hogar activo con varios dispositivos conectados a la vez. Es un objetivo excelente para la mayoría de las familias.",
    },
    {
      q: "¿Qué es una buena velocidad de subida?",
      a: "5–10 Mbps bastan para la mayoría de las personas y para videollamadas. Si subes archivos grandes, haces copias de seguridad en la nube o transmites en directo, apunta a 20 Mbps o más, algo que suelen ofrecer las conexiones de fibra.",
    },
    {
      q: "¿Vale la pena 1 Gbps?",
      a: "Internet de un gigabit vale la pena para hogares grandes, creadores que mueven archivos pesados y casas con muchas pantallas 4K. Para una o dos personas que sobre todo navegan y ven series, 100–300 Mbps suelen sentirse igual en el uso diario.",
    },
    {
      q: "¿Qué velocidad de internet necesito para teletrabajar?",
      a: "Apunta a al menos 25 Mbps de descarga y 10 Mbps de subida por cada persona que teletrabaja, con un ping inferior a 50 ms. Las videollamadas frecuentes y las transferencias de archivos grandes se benefician de más subida.",
    },
    {
      q: "¿Más velocidad siempre significa mejor internet?",
      a: "No siempre. Más allá de lo que necesitan tus actividades, la velocidad extra aporta poco. Un ping bajo y estable, una buena cobertura WiFi y la fiabilidad suelen importar más en el día a día que una cifra de Mbps muy alta.",
    },
  ],
  cta: {
    title: "¿Qué tan rápida es tu conexión?",
    text: "Haz un test de velocidad gratis y compara tu resultado con las recomendaciones anteriores.",
    button: "Iniciar test de velocidad",
  },
};

const ar: GuideMessages = {
  meta: {
    title: "ما هي سرعة الإنترنت الجيدة؟ دليل Mbps (2026)",
    description:
      "ما هي سرعة الإنترنت الجيدة؟ تعرّف على سرعات التحميل والرفع الموصى بها بوحدة Mbps للبث والألعاب ومكالمات الفيديو والمنازل الكبيرة، ثم اختبر سرعة النت لديك.",
    keywords: [
      "سرعة الإنترنت الجيدة",
      "كم سرعة الإنترنت التي أحتاجها",
      "كم ميغابت أحتاج",
      "سرعة التحميل الجيدة",
      "سرعة الرفع الجيدة",
      "سرعة الإنترنت للبث",
      "سرعة الإنترنت للألعاب",
    ],
  },
  hero: {
    eyebrow: "دليل السرعة",
    titleLead: "ما هي",
    titleHighlight: "سرعة الإنترنت الجيدة؟",
    intro:
      "تعتمد السرعة المناسبة على ما تفعله عبر الإنترنت وعدد الأجهزة التي تتشارك اتصالك. إليك عدد الـ Mbps الذي تحتاجه فعلًا.",
    cta: "اختبر سرعتك الآن",
    secondary: "اطّلع على الجدول",
  },
  summary: {
    title: "الإجابة المختصرة",
    text: "بالنسبة لمعظم المنازل، تُعد سرعة تحميل بين 25–100 Mbps وسرعة رفع بين 5–20 Mbps جيدة. ويكفي مستخدمًا أو اثنين بالاستخدام الخفيف 10–25 Mbps، بينما تحتاج المنازل المزدحمة التي تشهد بث 4K والألعاب والعمل عن بُعد إلى 100–500 Mbps. ويهمّ البينغ المنخفض والمستقر، أي أقل من 50 ms، بقدر أهمية السرعة نفسها.",
  },
  tiers: {
    title: "مستويات سرعة الإنترنت باختصار",
    intro: "كيف تبدو نتيجة سرعة التحميل عادةً في الاستخدام اليومي.",
    items: [
      { range: "أقل من 10 Mbps", label: "بطيئة", text: "تصفح أساسي وبريد إلكتروني. قد يتقطع الفيديو، وسيواجه عدة مستخدمين صعوبة." },
      { range: "10–50 Mbps", label: "أساسية", text: "بث بدقة HD ومكالمات فيديو لشخص إلى ثلاثة أشخاص." },
      { range: "50–200 Mbps", label: "جيدة", text: "بث 4K والألعاب والعمل عن بُعد لعائلة نموذجية." },
      { range: "200–500 Mbps", label: "سريعة", text: "عدة بثوث 4K في آن واحد، وتنزيلات كبيرة، ومنازل ذكية." },
      { range: "500+ Mbps", label: "سريعة جدًا", text: "مستوى ألياف الغيغابت: منازل كثيفة الاستخدام وصنّاع محتوى وملفات ضخمة." },
    ],
  },
  uses: {
    title: "ما السرعة التي تحتاجها؟",
    intro: "سرعات التحميل الموصى بها حسب النشاط.",
    items: [
      { title: "التصفح والبريد الإلكتروني", speed: "5–10 Mbps", text: "صفحات الويب والبريد ووسائل التواصل الاجتماعي وبث الموسيقى لشخص أو اثنين." },
      { title: "مكالمات الفيديو", speed: "5–15 Mbps", text: "مكالمات فيديو سلسة بدقة HD عبر Zoom أو Meet أو Teams، بما في ذلك الرفع." },
      { title: "بث HD و4K", speed: "25–50 Mbps", text: "Netflix وYouTube وDisney+ بدقة HD أو 4K دون تقطيع." },
      { title: "الألعاب عبر الإنترنت", speed: "25–100 Mbps", text: "لعب بلا تأخير. هنا تهمّ السرعة أقل من بينغ منخفض ومستقر." },
      { title: "المنازل المزدحمة", speed: "100–500 Mbps", text: "عدة أشخاص يشاهدون البث ويلعبون ويعملون عبر الإنترنت في الوقت نفسه." },
      { title: "صنّاع المحتوى والاستخدام المكثف", speed: "500–1000+ Mbps", text: "رفع ملفات كبيرة ونسخ احتياطي سحابي وبث 4K على أجهزة كثيرة في آن واحد." },
    ],
  },
  table: {
    title: "السرعة الموصى بها حسب المنزل",
    intro: "سرعات التحميل والرفع التي ينبغي استهدافها، بحسب من يعيش معك وما يفعلونه.",
    cols: ["المنزل", "التحميل", "الرفع"],
    rows: [
      { use: "1–2 شخص، تصفح وفيديو SD", down: "10–25 Mbps", up: "3–5 Mbps" },
      { use: "بث HD ومكالمات فيديو", down: "25–50 Mbps", up: "5–10 Mbps" },
      { use: "بث 4K وألعاب", down: "50–100 Mbps", up: "10–20 Mbps" },
      { use: "عائلة من 3–5 أفراد وأجهزة كثيرة", down: "100–300 Mbps", up: "20–50 Mbps" },
      { use: "المستخدمون المحترفون وصنّاع المحتوى", down: "500–1000+ Mbps", up: "50–200 Mbps" },
    ],
  },
  factors: {
    title: "ما الذي يحدد السرعة التي تحتاجها",
    items: [
      {
        title: "عدد الأشخاص والأجهزة",
        text: "السرعة مشتركة. شخصان يشاهدان بثًا بدقة 4K بينما يجري ثالث مكالمة فيديو يحتاجون إلى مجموع احتياجاتهم الثلاثة، مع هامش إضافي للهواتف والأجهزة الذكية التي تُحدَّث في الخلفية.",
      },
      {
        title: "الرفع، لا التحميل فقط",
        text: "مكالمات الفيديو والنسخ الاحتياطي السحابي والألعاب عبر الإنترنت والبث المباشر كلها ترسل بيانات. إذا كنت تعمل من المنزل أو تصنع محتوى، فتحقق من سرعة الرفع في الباقة، لا من رقم التحميل المُعلن فقط.",
      },
      {
        title: "البينغ والاستقرار",
        text: "الألعاب والمكالمات أكثر تأثرًا بزمن الاستجابة والتذبذب منها بعرض النطاق. وغالبًا ما يبدو الاتصال المستقر ببينغ أقل من 50 ms أفضل من اتصال أسرع لكنه أقل ثباتًا.",
      },
      {
        title: "شبكتك المنزلية",
        text: "لن تفيدك باقة سريعة إذا كانت شبكة WiFi ضعيفة. فموضع الراوتر ومعيار WiFi في أجهزتك وعدد الجدران بينك وبين الراوتر قد تخفض السرعة بشكل كبير.",
      },
    ],
  },
  units: {
    title: "شرح Mbps وMB/s وGbps",
    paragraphs: [
      "تُقاس سرعة الإنترنت بالميغابت في الثانية (Mbps)، بينما تُقاس أحجام الملفات بالميغابايت (MB). ولأن البايت الواحد يساوي ثماني بتات، اقسم السرعة بوحدة Mbps على ثمانية لتحصل على الحد الأقصى من الميغابايت في الثانية: 100 Mbps تعادل نحو 12.5 MB/s.",
      "1 Gbps (غيغابت في الثانية) يساوي 1000 Mbps. أصبحت باقات الغيغابت شائعة بشكل متزايد على الألياف، لكنك لن ترى هذه السرعات إلا عبر اتصال سلكي أو مع راوتر وجهاز حديثين يدعمان WiFi 6 أو 6E أو 7.",
    ],
  },
  faqTitle: "أسئلة شائعة حول سرعة الإنترنت الجيدة",
  faqs: [
    {
      q: "ما هي سرعة الإنترنت الجيدة؟",
      a: "بالنسبة لمعظم المنازل، تُعد سرعة تحميل بين 25–100 Mbps جيدة، إذ تتعامل بسهولة مع بث HD و4K ومكالمات الفيديو وعدة أجهزة متصلة. ويكفي المستخدمين ذوي الاستخدام الخفيف 10–25 Mbps، بينما تستفيد المنازل الكبيرة أو كثيفة الاستخدام من 100–500 Mbps.",
    },
    {
      q: "هل 100 Mbps سرعة عالية؟",
      a: "نعم. سرعة 100 Mbps كافية لبث 4K والألعاب عبر الإنترنت ومنزل مزدحم بعدة أجهزة متصلة في الوقت نفسه. إنها هدف ممتاز لمعظم العائلات.",
    },
    {
      q: "ما سرعة الرفع الجيدة؟",
      a: "تكفي 5–10 Mbps معظم الناس ومكالمات الفيديو. أما إذا كنت ترفع ملفات كبيرة أو تنسخ بياناتك احتياطيًا على السحابة أو تبث مباشرة، فاستهدف 20 Mbps أو أكثر، وهو ما توفره عادةً اتصالات الألياف.",
    },
    {
      q: "هل تستحق سرعة 1 Gbps؟",
      a: "يستحق إنترنت الغيغابت ذلك للمنازل الكبيرة، وصنّاع المحتوى الذين ينقلون ملفات ضخمة، والمنازل التي تضم شاشات 4K كثيرة. أما لشخص أو اثنين يقتصر استخدامهما غالبًا على التصفح والمشاهدة، فعادةً لا يُلاحظ فرق يُذكر مع 100–300 Mbps في الاستخدام اليومي.",
    },
    {
      q: "ما سرعة الإنترنت التي أحتاجها للعمل من المنزل؟",
      a: "استهدف 25 Mbps تحميلًا و10 Mbps رفعًا على الأقل لكل شخص يعمل من المنزل، مع بينغ أقل من 50 ms. وتستفيد مكالمات الفيديو المتكررة ونقل الملفات الكبيرة من سرعة رفع أعلى.",
    },
    {
      q: "هل تعني السرعة الأعلى دائمًا إنترنت أفضل؟",
      a: "ليس دائمًا. فبعد تلبية احتياجات أنشطتك، لا تضيف السرعة الإضافية الكثير. وغالبًا ما يكون البينغ المنخفض والمستقر والتغطية الجيدة لشبكة WiFi والموثوقية أهم في التجربة اليومية من رقم Mbps مرتفع جدًا.",
    },
  ],
  cta: {
    title: "ما مدى سرعة اتصالك؟",
    text: "أجرِ اختبار سرعة مجانيًا وقارن نتيجتك بالتوصيات أعلاه.",
    button: "ابدأ اختبار السرعة",
  },
};

const ru: GuideMessages = {
  meta: {
    title: "Какая скорость интернета хорошая? Гид по Мбит/с (2026)",
    description:
      "Какая скорость интернета считается хорошей? Рекомендуемая скорость загрузки и отдачи в Мбит/с для видео, игр, видеозвонков и больших семей. Проверьте свою.",
    keywords: [
      "какая скорость интернета хорошая",
      "нормальная скорость интернета",
      "сколько мбит нужно",
      "хорошая скорость загрузки",
      "хорошая скорость отдачи",
      "скорость интернета для фильмов",
      "скорость интернета для игр",
    ],
  },
  hero: {
    eyebrow: "Гид по скорости",
    titleLead: "Какая скорость интернета",
    titleHighlight: "считается хорошей?",
    intro:
      "Нужная скорость зависит от того, чем вы занимаетесь в интернете и сколько устройств делят подключение. Разбираемся, сколько Мбит/с вам действительно нужно.",
    cta: "Проверить скорость",
    secondary: "Смотреть таблицу",
  },
  summary: {
    title: "Коротко",
    text: "Для большинства домохозяйств хорошей считается скорость загрузки 25–100 Мбит/с и отдачи 5–20 Мбит/с. Одному-двум нетребовательным пользователям хватит 10–25 Мбит/с, а активным семьям с 4K-видео, играми и удалённой работой лучше подойдут 100–500 Мбит/с. Низкий и стабильный пинг — до 50 мс — важен не меньше самой скорости.",
  },
  tiers: {
    title: "Уровни скорости интернета",
    intro: "Как обычно ощущается та или иная скорость загрузки в повседневном использовании.",
    items: [
      { range: "До 10 Мбит/с", label: "Медленно", text: "Простой сёрфинг и почта. Видео может подтормаживать, а нескольким пользователям будет тесно." },
      { range: "10–50 Мбит/с", label: "Базово", text: "HD-видео и видеозвонки для одного–трёх человек." },
      { range: "50–200 Мбит/с", label: "Хорошо", text: "4K-видео, игры и удалённая работа для обычной семьи." },
      { range: "200–500 Мбит/с", label: "Быстро", text: "Несколько 4K-потоков одновременно, большие загрузки и умный дом." },
      { range: "500+ Мбит/с", label: "Очень быстро", text: "Уровень гигабитной оптики: активные семьи, авторы контента и огромные файлы." },
    ],
  },
  uses: {
    title: "Какая скорость вам нужна?",
    intro: "Рекомендуемая скорость загрузки в зависимости от задач.",
    items: [
      { title: "Сайты и почта", speed: "5–10 Мбит/с", text: "Веб-страницы, почта, соцсети и музыка онлайн для одного-двух человек." },
      { title: "Видеозвонки", speed: "5–15 Мбит/с", text: "Плавные HD-видеозвонки в Zoom, Meet или Teams с учётом отдачи." },
      { title: "HD- и 4K-видео", speed: "25–50 Мбит/с", text: "Netflix, YouTube и Disney+ в HD или 4K без буферизации." },
      { title: "Онлайн-игры", speed: "25–100 Мбит/с", text: "Игры без лагов. Здесь скорость важна меньше, чем низкий и стабильный пинг." },
      { title: "Активные семьи", speed: "100–500 Мбит/с", text: "Несколько человек одновременно смотрят видео, играют и работают онлайн." },
      { title: "Авторы контента и интенсивное использование", speed: "500–1000+ Мбит/с", text: "Отправка больших файлов, облачные бэкапы и 4K-видео на множестве устройств одновременно." },
    ],
  },
  table: {
    title: "Рекомендуемая скорость для дома",
    intro: "К какой скорости загрузки и отдачи стремиться в зависимости от того, кто живёт с вами и чем занимается.",
    cols: ["Домохозяйство", "Загрузка", "Отдача"],
    rows: [
      { use: "1–2 человека, сайты и SD-видео", down: "10–25 Мбит/с", up: "3–5 Мбит/с" },
      { use: "HD-видео и видеозвонки", down: "25–50 Мбит/с", up: "5–10 Мбит/с" },
      { use: "4K-видео и игры", down: "50–100 Мбит/с", up: "10–20 Мбит/с" },
      { use: "Семья из 3–5 человек, много устройств", down: "100–300 Мбит/с", up: "20–50 Мбит/с" },
      { use: "Продвинутые пользователи и авторы контента", down: "500–1000+ Мбит/с", up: "50–200 Мбит/с" },
    ],
  },
  factors: {
    title: "От чего зависит нужная скорость",
    items: [
      {
        title: "Количество людей и устройств",
        text: "Скорость делится между всеми. Если двое смотрят 4K, а третий говорит по видеосвязи, нужна сумма всех трёх потоков плюс запас для телефонов и умных устройств, которые обновляются в фоне.",
      },
      {
        title: "Отдача, а не только загрузка",
        text: "Видеозвонки, облачные бэкапы, онлайн-игры и стримы — всё это отправляет данные. Если вы работаете из дома или создаёте контент, смотрите на скорость отдачи в тарифе, а не только на заявленную скорость загрузки.",
      },
      {
        title: "Пинг и стабильность",
        text: "Игры и звонки чувствительнее к задержке и джиттеру, чем к пропускной способности. Стабильное соединение с пингом до 50 мс часто ощущается лучше, чем более быстрое, но менее ровное.",
      },
      {
        title: "Ваша домашняя сеть",
        text: "Быстрый тариф не поможет, если Wi-Fi слабый. Расположение роутера, стандарт Wi-Fi ваших устройств и количество стен между вами и роутером могут резко снизить скорость.",
      },
    ],
  },
  units: {
    title: "Мбит/с, МБ/с и Гбит/с: в чём разница",
    paragraphs: [
      "Скорость интернета измеряют в мегабитах в секунду (Мбит/с), а размер файлов — в мегабайтах (МБ). Поскольку в одном байте восемь бит, разделите скорость в Мбит/с на восемь, чтобы получить максимум мегабайт в секунду: 100 Мбит/с — это примерно 12,5 МБ/с.",
      "1 Гбит/с (гигабит в секунду) равен 1000 Мбит/с. Гигабитные тарифы всё чаще встречаются на оптоволокне, но такую скорость вы увидите только при подключении по кабелю или с современными роутером и устройством с поддержкой Wi-Fi 6, 6E или 7.",
    ],
  },
  faqTitle: "Вопросы о хорошей скорости интернета",
  faqs: [
    {
      q: "Какая скорость интернета считается хорошей?",
      a: "Для большинства домохозяйств хорошей считается скорость загрузки 25–100 Мбит/с. Её с запасом хватает для HD- и 4K-видео, видеозвонков и нескольких подключённых устройств. Нетребовательным пользователям достаточно 10–25 Мбит/с, а большим семьям или при интенсивном использовании лучше 100–500 Мбит/с.",
    },
    {
      q: "100 Мбит/с — это быстро?",
      a: "Да. 100 Мбит/с достаточно для 4K-видео, онлайн-игр и активной семьи с несколькими устройствами в сети одновременно. Это отличный ориентир для большинства семей.",
    },
    {
      q: "Какая скорость отдачи считается хорошей?",
      a: "Для большинства людей и видеозвонков хватает 5–10 Мбит/с. Если вы загружаете большие файлы, делаете облачные бэкапы или ведёте стримы, ориентируйтесь на 20 Мбит/с и выше — обычно это обеспечивает оптоволокно.",
    },
    {
      q: "Стоит ли подключать 1 Гбит/с?",
      a: "Гигабитный интернет оправдан для больших семей, авторов контента, работающих с тяжёлыми файлами, и домов с множеством 4K-экранов. Для одного-двух человек, которые в основном сидят в интернете и смотрят видео, 100–300 Мбит/с в повседневной жизни обычно ощущаются так же.",
    },
    {
      q: "Какая скорость интернета нужна для удалённой работы?",
      a: "Ориентируйтесь минимум на 25 Мбит/с загрузки и 10 Мбит/с отдачи на каждого, кто работает из дома, при пинге до 50 мс. Для частых видеозвонков и передачи больших файлов полезна более высокая отдача.",
    },
    {
      q: "Чем выше скорость, тем лучше интернет?",
      a: "Не всегда. Сверх того, что нужно для ваших задач, дополнительная скорость почти ничего не даёт. Низкий и стабильный пинг, хорошее покрытие Wi-Fi и надёжность в повседневной жизни часто важнее очень высокого числа Мбит/с.",
    },
  ],
  cta: {
    title: "Насколько быстрое у вас подключение?",
    text: "Запустите бесплатный тест скорости и сравните результат с рекомендациями выше.",
    button: "Начать тест скорости",
  },
};

export const guideMessages: Record<Locale, GuideMessages> = { en, fr, es, ar, ru };
