import type { Locale } from "../config";

// Speed tool pages (download / upload / ping / WiFi) + the shared tools directory.
// Each page has the same shape so SpeedToolPage can render any of them.

const download = {
  meta: {
    title: "Download Speed Test: Check Your Mbps Free & Fast",
    description:
      "Free download speed test. Measure how fast you can download data from the internet in Mbps, on any device, in seconds. Accurate, real-time and no app needed.",
    keywords: [
      "download speed test",
      "test download speed",
      "check download speed",
      "download speed checker",
      "internet download speed",
      "mbps download test",
    ],
  },
  badge: "Free download speed test",
  titleLead: "Download",
  titleHighlight: "Speed Test",
  intro:
    "Measure your real download speed in megabits per second (Mbps). Start the test to see how fast you can pull data from the internet for streaming, browsing, gaming and downloads.",
  sectionsHeading: "About download speed",
  sectionsIntro: "What download speed is, what counts as good, and how we measure it.",
  sections: [
    {
      title: "What is download speed?",
      text: "Download speed is how fast your connection can receive data from the internet, measured in Mbps. It affects streaming quality, page loading, file downloads and video calls.",
    },
    {
      title: "What is a good download speed?",
      text: "5–10 Mbps is fine for browsing, 25 Mbps for HD streaming, and 100 Mbps or more is ideal for 4K, gaming and busy households with many devices.",
    },
    {
      title: "How we measure it",
      text: "We open several parallel connections to a nearby server on a global network and transfer data for a few seconds, then calculate your true download throughput in Mbps.",
    },
    {
      title: "Tips for an accurate test",
      text: "Test on a wired connection if possible, pause other downloads and streaming, and keep this tab open while the test runs for the most reliable result.",
    },
  ],
  table: {
    title: "Download speed you need, by activity",
    intro: "Typical download speeds needed per device. Add them up for everything that runs at the same time in your home.",
    head: ["Activity", "Download speed"],
    rows: [
      ["Email, web browsing, social media", "1–5 Mbps"],
      ["Music streaming", "1–2 Mbps"],
      ["HD video calls", "2–4 Mbps"],
      ["HD (1080p) video streaming", "5–8 Mbps"],
      ["4K (Ultra HD) streaming", "15–25 Mbps"],
      ["Downloading large games and files", "100+ Mbps"],
    ],
  },
  guide: {
    title: "Understanding your download result",
    paragraphs: [
      "Download speed is the number most internet plans advertise, and the one that shapes most of your online experience. Every web page, video, song and app update you receive travels downstream, so a higher download speed means less waiting and higher video quality.",
      "Your result is the speed measured at your device, at this moment. It can be lower than your plan because of WiFi signal strength, other devices using the connection, the age of your router or computer, a VPN, or congestion during busy evening hours. A result consistently below 80% of your plan on a wired connection is worth reporting to your provider.",
      "To see how long a download will take, remember that speeds are given in megabits and file sizes in megabytes. Divide your speed by eight: 200 Mbps is about 25 MB per second, so a 5 GB game takes roughly three and a half minutes in ideal conditions.",
    ],
  },
  tips: {
    title: "How to get a faster download speed",
    items: [
      "Connect with an Ethernet cable, or move closer to your router.",
      "Use the 5 GHz or 6 GHz WiFi band instead of 2.4 GHz.",
      "Pause cloud sync, game updates and streams on other devices.",
      "Restart your router and modem, and keep their firmware up to date.",
      "Disconnect your VPN to see your provider's native speed.",
      "Upgrade your plan if your household regularly needs more bandwidth.",
    ],
  },
  faqHeading: "Download speed FAQ",
  faqs: [
    {
      q: "How do I test my download speed?",
      a: "Just press the GO button above. The test measures your download speed in Mbps in a few seconds. For the most accurate result, close other apps and test on a wired connection.",
    },
    {
      q: "Why is my download speed slower than my plan?",
      a: "WiFi interference, distance from the router, old hardware, VPNs, background downloads and peak-hour congestion can all reduce your measured download speed. Test on a wired connection for the most accurate result.",
    },
    {
      q: "What is a good download speed?",
      a: "For most homes 25–100 Mbps is good. Heavy users, 4K streaming and gaming benefit from 100–500 Mbps, while light browsing works on 5–10 Mbps.",
    },
    {
      q: "Is 50 Mbps a good download speed?",
      a: "Yes, for one to three people. 50 Mbps handles HD and a 4K stream, video calls and browsing at the same time. Larger households that stream on several screens at once will be more comfortable with 100 Mbps or more.",
    },
    {
      q: "How long does it take to download 1 GB?",
      a: "At 25 Mbps about 5.5 minutes, at 100 Mbps about 1.5 minutes, and at 500 Mbps around 16 seconds, assuming the server can keep up and nothing else is using your connection.",
    },
  ],
};

export type ToolPageMessages = typeof download;

const upload: ToolPageMessages = {
  meta: {
    title: "Upload Speed Test: Check Your Upload Mbps Free",
    description:
      "Free upload speed test. Measure how fast you can send data to the internet in Mbps for video calls, backups, streaming and file sharing. Accurate and instant.",
    keywords: [
      "upload speed test",
      "test upload speed",
      "check upload speed",
      "internet upload speed",
      "mbps upload test",
      "upload speed checker",
    ],
  },
  badge: "Free upload speed test",
  titleLead: "Upload",
  titleHighlight: "Speed Test",
  intro:
    "Measure your real upload speed in megabits per second (Mbps). Start the test to see how fast you can send data to the internet for video calls, cloud backups, live streaming and file sharing.",
  sectionsHeading: "About upload speed",
  sectionsIntro: "Why upload speed matters, what is good, and why it is often lower than download.",
  sections: [
    {
      title: "What is upload speed?",
      text: "Upload speed is how fast your connection can send data to the internet, measured in Mbps. It matters for video calls, posting content, online backups and live streaming.",
    },
    {
      title: "What is a good upload speed?",
      text: "3–5 Mbps handles video calls, 10 Mbps is comfortable for most uploads, and 20 Mbps or more suits creators, streamers and large cloud backups.",
    },
    {
      title: "How we measure it",
      text: "We send data through several parallel connections to a nearby server on a global network for a few seconds and calculate your true upload throughput in Mbps.",
    },
    {
      title: "Why upload is slower than download",
      text: "Most cable and DSL plans are asymmetric, giving you far more download than upload because people download more than they send. Fiber connections are usually more balanced.",
    },
  ],
  table: {
    title: "Upload speed you need, by activity",
    intro: "Typical upload speeds needed for common tasks. Remote workers and creators should aim for the higher end.",
    head: ["Activity", "Upload speed"],
    rows: [
      ["Email, messaging, social posts", "1 Mbps"],
      ["HD video calls (Zoom, Teams, Meet)", "3–4 Mbps"],
      ["Group calls and screen sharing", "5–10 Mbps"],
      ["Live streaming in 1080p", "6–10 Mbps"],
      ["Live streaming in 4K", "20–40 Mbps"],
      ["Large cloud backups and video uploads", "50+ Mbps"],
    ],
  },
  guide: {
    title: "Understanding your upload result",
    paragraphs: [
      "Upload speed gets less attention than download, but it decides how you look and sound on video calls, how quickly your photos sync to the cloud and whether a live stream stays sharp. When several people in the same home are on calls at once, upload is often the first thing to run out.",
      "Many cable and DSL plans offer ten times more download than upload, so a low upload figure is not necessarily a fault. Check the upload speed listed in your contract: if your wired result is close to it, your line is working as sold. Fiber plans are usually symmetric, with matching upload and download.",
      "If your upload is far below your plan, look for devices backing up photos or videos in the background, an overloaded WiFi network, or an old router. Testing with a cable and with nothing else running is the quickest way to find the cause.",
    ],
  },
  tips: {
    title: "How to improve your upload speed",
    items: [
      "Use a wired Ethernet connection for calls and streaming.",
      "Pause cloud backups and photo syncing while you work.",
      "Lower the video quality of other calls or streams in your home.",
      "Restart your router and update its firmware.",
      "Ask your provider about plans with higher upload, or switch to fiber.",
    ],
  },
  faqHeading: "Upload speed FAQ",
  faqs: [
    {
      q: "How do I test my upload speed?",
      a: "Press the GO button above. The test measures your upload speed in Mbps within a few seconds.",
    },
    {
      q: "What is a good upload speed?",
      a: "5–10 Mbps is enough for most users and video calls. Streamers, creators and people doing large cloud backups benefit from 20 Mbps or more.",
    },
    {
      q: "Why is my upload speed so low?",
      a: "Many internet plans are asymmetric and intentionally give much lower upload than download. WiFi, old hardware and congestion can lower it further. A fiber plan usually offers higher upload speeds.",
    },
    {
      q: "What upload speed do I need to work from home?",
      a: "For email and occasional video calls, 5 Mbps is enough. If you are on video calls most of the day, share your screen or send large files, aim for 10–20 Mbps per person working from home.",
    },
    {
      q: "What upload speed do I need to stream on Twitch or YouTube?",
      a: "Streaming platforms recommend roughly 3–6 Mbps for 720p and 6–10 Mbps for 1080p at 60 frames per second. Keep around 30% headroom above your stream bitrate so the stream stays stable.",
    },
  ],
};

const ping: ToolPageMessages = {
  meta: {
    title: "Ping Test: Check Your Latency & Jitter Free Online",
    description:
      "Free ping and latency test. Measure your connection's response time (ping) and jitter in milliseconds, essential for gaming, video calls and live streaming.",
    keywords: [
      "ping test",
      "latency test",
      "ping checker",
      "test my ping",
      "jitter test",
      "internet latency test",
      "ping and latency",
    ],
  },
  badge: "Free ping & latency test",
  titleLead: "Ping & Latency",
  titleHighlight: "Test",
  intro:
    "Measure your connection's ping and jitter in milliseconds (ms). Start the test to check your latency, the response time that matters most for online gaming, video calls and live streaming.",
  sectionsHeading: "About ping, latency and jitter",
  sectionsIntro: "The two numbers that decide how responsive your connection feels.",
  sections: [
    {
      title: "What is ping / latency?",
      text: "Ping (latency) is the time it takes for data to travel from your device to a server and back, measured in milliseconds. Lower is better, as it makes everything feel more responsive.",
    },
    {
      title: "What is jitter?",
      text: "Jitter is the variation in your ping over time. High jitter causes lag spikes, stutter in video calls and rubber-banding in games, even when your speed looks fine.",
    },
    {
      title: "What is a good ping?",
      text: "Under 20 ms is excellent, 20–50 ms is good for gaming, 50–100 ms is fine for browsing, and over 150 ms can feel laggy in real-time apps.",
    },
    {
      title: "How to lower your ping",
      text: "Use a wired Ethernet connection, close bandwidth-heavy apps, choose nearby game servers and avoid WiFi interference. A wired link almost always lowers latency and jitter.",
    },
  ],
  table: {
    title: "Ping ranges explained",
    intro: "How different ping values feel in practice. Jitter should ideally stay below 30 ms.",
    head: ["Ping", "What to expect"],
    rows: [
      ["0–20 ms", "Excellent: ideal for competitive gaming"],
      ["20–50 ms", "Very good: smooth gaming and calls"],
      ["50–100 ms", "Good: fine for browsing, streaming and casual gaming"],
      ["100–150 ms", "Fair: noticeable delay in games and calls"],
      ["150+ ms", "Poor: lag in real-time apps"],
    ],
  },
  guide: {
    title: "Why ping matters more than speed for gaming",
    paragraphs: [
      "Online games and video calls exchange small amounts of data constantly. They need very little bandwidth but they need it fast, so a 50 Mbps connection with a 15 ms ping often feels better than a 500 Mbps connection with a 120 ms ping.",
      "Ping depends mostly on distance and on the path your data takes. Fiber and cable usually deliver the lowest latency, 4G and 5G are higher and more variable, and satellite connections can add a lot of delay. WiFi adds a few milliseconds and, more importantly, jitter.",
      "Our test sends a series of small requests to a nearby server and reports the fastest response as your ping and the average variation as your jitter. A game server far from you will show a higher ping than this test, because the data has further to travel.",
    ],
  },
  tips: {
    title: "How to reduce ping and jitter",
    items: [
      "Plug your console or PC into the router with an Ethernet cable.",
      "Stop large downloads, uploads and 4K streams while you play.",
      "Choose game servers in your own region.",
      "Enable QoS or gaming mode on your router if it has one.",
      "Restart your router and replace it if it is several years old.",
      "Turn off your VPN unless it routes you to a closer server.",
    ],
  },
  faqHeading: "Ping & latency FAQ",
  faqs: [
    {
      q: "How do I test my ping?",
      a: "Press the GO button above. The test measures your ping and jitter in milliseconds within a few seconds.",
    },
    {
      q: "What is a good ping for gaming?",
      a: "Under 20 ms is excellent and 20–50 ms is good for online gaming. Above 100 ms you may notice lag, and above 150 ms fast-paced games feel unresponsive.",
    },
    {
      q: "What causes high ping and jitter?",
      a: "WiFi interference, long distance to the server, network congestion, old routers and background downloads all raise ping and jitter. A wired connection is the most effective fix.",
    },
    {
      q: "Is ping the same as latency?",
      a: "In everyday use, yes. Latency is the delay for data to travel across the network, and ping is the tool and the measurement used to check it, usually as a round trip in milliseconds.",
    },
    {
      q: "Does a faster internet plan lower my ping?",
      a: "Not necessarily. More bandwidth helps when your line is congested, but ping is mainly decided by the connection type, the distance to the server and your home network. Switching from WiFi to a cable often helps more than upgrading your plan.",
    },
  ],
};

const wifi: ToolPageMessages = {
  meta: {
    title: "WiFi Speed Test: Check Your Wireless Speed Free",
    description:
      "Free WiFi speed test. Check your wireless download speed, upload speed and ping on any device, in any room. Find dead zones and see if your WiFi is fast enough.",
    keywords: [
      "wifi speed test",
      "wireless speed test",
      "test wifi speed",
      "check wifi speed",
      "wifi internet test",
      "wireless internet connection test",
    ],
  },
  badge: "Free WiFi speed test",
  titleLead: "WiFi",
  titleHighlight: "Speed Test",
  intro:
    "Test your wireless internet speed in seconds. Start the test to measure your WiFi download speed, upload speed and ping, then test in other rooms to find dead zones and the best spot for your router.",
  sectionsHeading: "About WiFi speed",
  sectionsIntro: "How to test your wireless network properly and get more speed out of it.",
  sections: [
    {
      title: "How to test your WiFi speed",
      text: "Connect to your WiFi, press GO, and note the result. Then repeat the test in different rooms to compare signal strength and find weak spots in your home.",
    },
    {
      title: "Why is my WiFi slower than my plan?",
      text: "WiFi loses speed with distance, walls, interference from other devices and older routers. The speed at your device is often lower than the speed reaching your modem.",
    },
    {
      title: "WiFi vs wired speed",
      text: "A wired Ethernet connection is faster and more stable than WiFi. If your WiFi result is much lower than your wired result, the bottleneck is your wireless setup, not your ISP.",
    },
    {
      title: "How to improve WiFi speed",
      text: "Move closer to the router, use the 5 GHz band, reduce interference, update the firmware, or add a mesh system or extender for large homes and dead zones.",
    },
  ],
  table: {
    title: "WiFi bands and standards at a glance",
    intro: "Real-world speeds are lower than the theoretical maximums printed on the box, and fall with distance and walls.",
    head: ["Band or standard", "Best for"],
    rows: [
      ["2.4 GHz band", "Long range and walls, but slower and more crowded"],
      ["5 GHz band", "Much faster at short to medium range"],
      ["6 GHz band (WiFi 6E / 7)", "Very fast, low interference, shortest range"],
      ["WiFi 5 (802.11ac)", "Good for plans up to a few hundred Mbps"],
      ["WiFi 6 / 6E (802.11ax)", "Busy homes with many devices, gigabit plans"],
      ["WiFi 7 (802.11be)", "Multi-gigabit plans and the newest devices"],
    ],
  },
  guide: {
    title: "Getting the most out of your WiFi",
    paragraphs: [
      "Your internet plan sets the maximum speed that reaches your home, but WiFi decides how much of it reaches each device. Walls, floors, mirrors, aquariums and even microwaves weaken the signal, and every extra metre from the router costs speed.",
      "Run this test next to the router first, then in the rooms where you use the internet most. If the speed drops sharply in some rooms, move the router to a central, raised and open spot, or add a mesh system so every room has a strong signal.",
      "Older phones and laptops may only support older WiFi standards and cannot reach the speeds of a modern router. If one device is much slower than the others in the same place, the device, not your connection, is the limit.",
    ],
  },
  tips: {
    title: "Quick fixes for slow WiFi",
    items: [
      "Place the router in a central, open and elevated position.",
      "Connect to the 5 GHz or 6 GHz network when you are close to the router.",
      "Change the WiFi channel if many neighbours' networks are nearby.",
      "Update the router firmware and restart it occasionally.",
      "Use a mesh system or wired access point for large homes.",
      "Plug TVs, consoles and desktops in with a cable when possible.",
    ],
  },
  faqHeading: "WiFi speed FAQ",
  faqs: [
    {
      q: "How do I test my WiFi speed?",
      a: "Connect your device to WiFi and press the GO button above. The test measures your wireless download, upload and ping. Repeat it in different rooms to map your coverage.",
    },
    {
      q: "What is a good WiFi speed?",
      a: "It depends on your plan, but 25–100 Mbps over WiFi is good for most households. If your WiFi result is far below your plan or your wired speed, your wireless setup is the bottleneck.",
    },
    {
      q: "How can I make my WiFi faster?",
      a: "Move closer to the router, switch to the 5 GHz band, reduce interference from other devices, update your router firmware, or add a mesh network or extender to cover dead zones.",
    },
    {
      q: "Why is my WiFi fast on one device and slow on another?",
      a: "Devices support different WiFi standards and antennas. An older phone or laptop can be limited to much lower speeds than a recent one, even in the same spot. Background apps and battery-saving modes can also slow a single device.",
    },
    {
      q: "Is 2.4 GHz or 5 GHz better?",
      a: "5 GHz is faster and less crowded, which makes it the better choice in the same room or nearby. 2.4 GHz reaches further and passes through walls more easily, so it can be more reliable far from the router.",
    },
  ],
};

const en = {
  ui: {
    highlights: ["Accurate real-time results", "No app needed", "Works on every device"],
    learnKicker: "Learn",
    tipsKicker: "Tips",
    faqKicker: "FAQ",
    fullTest: "Run the full internet speed test",
    guideLink: "What is a good internet speed?",
    otherTitle: "More free tools",
    otherIntro: "Test another part of your connection or check your IP address.",
    open: "Open tool",
  },
  directory: {
    full: { title: "Internet Speed Test", text: "Download, upload, ping and jitter in one test." },
    download: { title: "Download Speed Test", text: "How fast you receive data, in Mbps." },
    upload: { title: "Upload Speed Test", text: "How fast you send data for calls and backups." },
    ping: { title: "Ping & Latency Test", text: "Response time and jitter, in milliseconds." },
    wifi: { title: "WiFi Speed Test", text: "Check wireless speed room by room." },
    myIp: { title: "What Is My IP", text: "Your public IP address, ISP and location." },
    ipRisk: { title: "IP Risk Score", text: "Check if an IP is a VPN, proxy or flagged." },
  },
  pages: { download, upload, ping, wifi },
};

export type ToolsMessages = typeof en;

// ---------------------------------------------------------------------------
// Français
// ---------------------------------------------------------------------------

const frDownload: ToolPageMessages = {
  meta: {
    title: "Test de débit descendant : vitesse de téléchargement",
    description:
      "Test de vitesse de téléchargement gratuit. Mesurez votre débit descendant en Mbps sur tout appareil, en quelques secondes. Précis, en temps réel, sans appli.",
    keywords: [
      "test de débit descendant",
      "test de vitesse de téléchargement",
      "débit descendant",
      "vitesse de téléchargement",
      "tester son débit internet",
      "test débit Mbps",
      "mesurer la vitesse de téléchargement",
    ],
  },
  badge: "Test de débit descendant gratuit",
  titleLead: "Test de vitesse",
  titleHighlight: "de téléchargement",
  intro:
    "Mesurez votre vrai débit descendant en mégabits par seconde (Mbps). Lancez le test pour savoir à quelle vitesse vous recevez les données d'internet pour le streaming, la navigation, le jeu en ligne et les téléchargements.",
  sectionsHeading: "Tout savoir sur le débit descendant",
  sectionsIntro: "Ce qu'est le débit descendant, ce qu'est un bon débit et comment nous le mesurons.",
  sections: [
    {
      title: "Qu'est-ce que le débit descendant ?",
      text: "Le débit descendant correspond à la vitesse à laquelle votre connexion reçoit des données d'internet, exprimée en Mbps. Il influe sur la qualité du streaming, le chargement des pages, les téléchargements et les appels vidéo.",
    },
    {
      title: "Qu'est-ce qu'un bon débit descendant ?",
      text: "5–10 Mbps suffisent pour naviguer, 25 Mbps pour le streaming HD, et 100 Mbps ou plus sont idéaux pour la 4K, le jeu en ligne et les foyers avec de nombreux appareils.",
    },
    {
      title: "Comment nous le mesurons",
      text: "Nous ouvrons plusieurs connexions parallèles vers un serveur proche sur un réseau mondial et transférons des données pendant quelques secondes, puis calculons votre débit descendant réel en Mbps.",
    },
    {
      title: "Conseils pour un test fiable",
      text: "Testez si possible en filaire, mettez en pause les autres téléchargements et streams, et gardez cet onglet ouvert pendant le test pour obtenir le résultat le plus fiable.",
    },
  ],
  table: {
    title: "Débit descendant nécessaire selon l'usage",
    intro: "Débits descendants typiques nécessaires par appareil. Additionnez-les pour tout ce qui fonctionne en même temps chez vous.",
    head: ["Usage", "Débit descendant"],
    rows: [
      ["E-mail, navigation web, réseaux sociaux", "1–5 Mbps"],
      ["Streaming musical", "1–2 Mbps"],
      ["Appels vidéo HD", "2–4 Mbps"],
      ["Streaming vidéo HD (1080p)", "5–8 Mbps"],
      ["Streaming 4K (Ultra HD)", "15–25 Mbps"],
      ["Téléchargement de gros jeux et fichiers", "100+ Mbps"],
    ],
  },
  guide: {
    title: "Comprendre votre résultat de débit descendant",
    paragraphs: [
      "Le débit descendant est le chiffre mis en avant par la plupart des offres internet, et celui qui conditionne l'essentiel de votre expérience en ligne. Chaque page web, vidéo, chanson ou mise à jour d'application que vous recevez transite dans ce sens : plus le débit descendant est élevé, moins vous attendez et meilleure est la qualité vidéo.",
      "Votre résultat correspond à la vitesse mesurée sur votre appareil, à cet instant. Il peut être inférieur à celui de votre offre à cause de la qualité du signal Wi-Fi, d'autres appareils connectés, d'une box ou d'un ordinateur ancien, d'un VPN ou de la saturation aux heures de pointe en soirée. Un résultat régulièrement inférieur à 80 % de votre offre en filaire mérite d'être signalé à votre fournisseur.",
      "Pour estimer la durée d'un téléchargement, rappelez-vous que les débits s'expriment en mégabits et la taille des fichiers en mégaoctets. Divisez votre débit par huit : 200 Mbps correspondent à environ 25 Mo/s, si bien qu'un jeu de 5 Go se télécharge en trois minutes et demie environ dans des conditions idéales.",
    ],
  },
  tips: {
    title: "Comment augmenter votre débit descendant",
    items: [
      "Branchez-vous avec un câble Ethernet, ou rapprochez-vous de votre box.",
      "Utilisez la bande Wi-Fi 5 GHz ou 6 GHz plutôt que 2,4 GHz.",
      "Mettez en pause la synchronisation cloud, les mises à jour de jeux et les streams sur les autres appareils.",
      "Redémarrez votre box et votre modem, et maintenez leur firmware à jour.",
      "Désactivez votre VPN pour connaître le débit natif de votre fournisseur.",
      "Passez à une offre supérieure si votre foyer a régulièrement besoin de plus de bande passante.",
    ],
  },
  faqHeading: "FAQ sur le débit descendant",
  faqs: [
    {
      q: "Comment tester mon débit descendant ?",
      a: "Appuyez simplement sur le bouton GO ci-dessus. Le test mesure votre vitesse de téléchargement en Mbps en quelques secondes. Pour un résultat plus précis, fermez les autres applications et testez en filaire.",
    },
    {
      q: "Pourquoi mon débit descendant est-il inférieur à celui de mon offre ?",
      a: "Les interférences Wi-Fi, la distance avec la box, un matériel ancien, un VPN, des téléchargements en arrière-plan et la saturation aux heures de pointe peuvent tous réduire le débit mesuré. Testez en filaire pour obtenir le résultat le plus précis.",
    },
    {
      q: "Qu'est-ce qu'un bon débit descendant ?",
      a: "Pour la plupart des foyers, 25–100 Mbps est un bon débit. Les gros consommateurs, le streaming 4K et le jeu en ligne profitent de 100–500 Mbps, tandis qu'une navigation légère se contente de 5–10 Mbps.",
    },
    {
      q: "50 Mbps, est-ce un bon débit descendant ?",
      a: "Oui, pour une à trois personnes. 50 Mbps permettent de regarder un flux HD et un flux 4K, de passer des appels vidéo et de naviguer en même temps. Les foyers plus nombreux qui regardent des vidéos sur plusieurs écrans à la fois seront plus à l'aise avec 100 Mbps ou plus.",
    },
    {
      q: "Combien de temps faut-il pour télécharger 1 Go ?",
      a: "Environ 5,5 minutes à 25 Mbps, environ 1,5 minute à 100 Mbps et environ 16 secondes à 500 Mbps, à condition que le serveur suive et que rien d'autre n'utilise votre connexion.",
    },
  ],
};

const frUpload: ToolPageMessages = {
  meta: {
    title: "Test de débit montant : test d'upload gratuit en Mbps",
    description:
      "Test de débit montant gratuit. Mesurez votre vitesse d'upload en Mbps pour les appels vidéo, sauvegardes, le streaming en direct et l'envoi de fichiers.",
    keywords: [
      "test de débit montant",
      "débit montant",
      "test d'upload",
      "vitesse d'upload",
      "vitesse d'envoi internet",
      "tester son débit montant",
      "test upload Mbps",
    ],
  },
  badge: "Test de débit montant gratuit",
  titleLead: "Test de",
  titleHighlight: "débit montant",
  intro:
    "Mesurez votre vrai débit montant en mégabits par seconde (Mbps). Lancez le test pour savoir à quelle vitesse vous envoyez des données sur internet pour les appels vidéo, les sauvegardes cloud, le streaming en direct et le partage de fichiers.",
  sectionsHeading: "Tout savoir sur le débit montant",
  sectionsIntro: "Pourquoi le débit montant compte, ce qu'est un bon débit et pourquoi il est souvent inférieur au débit descendant.",
  sections: [
    {
      title: "Qu'est-ce que le débit montant ?",
      text: "Le débit montant correspond à la vitesse à laquelle votre connexion envoie des données sur internet, exprimée en Mbps. Il compte pour les appels vidéo, la publication de contenus, les sauvegardes en ligne et le streaming en direct.",
    },
    {
      title: "Qu'est-ce qu'un bon débit montant ?",
      text: "3–5 Mbps suffisent pour les appels vidéo, 10 Mbps sont confortables pour la plupart des envois, et 20 Mbps ou plus conviennent aux créateurs, streamers et grosses sauvegardes cloud.",
    },
    {
      title: "Comment nous le mesurons",
      text: "Nous envoyons des données via plusieurs connexions parallèles vers un serveur proche sur un réseau mondial pendant quelques secondes, puis calculons votre débit montant réel en Mbps.",
    },
    {
      title: "Pourquoi l'upload est plus lent que le download",
      text: "La plupart des offres câble et ADSL sont asymétriques : elles offrent bien plus de débit descendant que montant, car on télécharge plus qu'on n'envoie. Les connexions fibre sont généralement plus équilibrées.",
    },
  ],
  table: {
    title: "Débit montant nécessaire selon l'usage",
    intro: "Débits montants typiques nécessaires pour les usages courants. Les télétravailleurs et les créateurs devraient viser le haut de la fourchette.",
    head: ["Usage", "Débit montant"],
    rows: [
      ["E-mail, messagerie, publications sur les réseaux sociaux", "1 Mbps"],
      ["Appels vidéo HD (Zoom, Teams, Meet)", "3–4 Mbps"],
      ["Appels de groupe et partage d'écran", "5–10 Mbps"],
      ["Streaming en direct en 1080p", "6–10 Mbps"],
      ["Streaming en direct en 4K", "20–40 Mbps"],
      ["Grosses sauvegardes cloud et envoi de vidéos", "50+ Mbps"],
    ],
  },
  guide: {
    title: "Comprendre votre résultat de débit montant",
    paragraphs: [
      "On prête moins d'attention au débit montant qu'au débit descendant, pourtant c'est lui qui détermine votre image et votre son en appel vidéo, la vitesse de synchronisation de vos photos dans le cloud et la netteté d'un live. Quand plusieurs personnes d'un même foyer sont en visioconférence en même temps, c'est souvent le débit montant qui sature en premier.",
      "De nombreuses offres câble et ADSL proposent dix fois plus de débit descendant que montant : un débit montant faible n'est donc pas forcément une panne. Vérifiez le débit montant indiqué dans votre contrat : si votre résultat en filaire s'en approche, votre ligne fonctionne comme prévu. Les offres fibre sont généralement symétriques, avec un débit montant égal au débit descendant.",
      "Si votre débit montant est très inférieur à celui de votre offre, cherchez les appareils qui sauvegardent des photos ou des vidéos en arrière-plan, un réseau Wi-Fi surchargé ou une box ancienne. Tester avec un câble et sans rien d'autre en cours est le moyen le plus rapide de trouver la cause.",
    ],
  },
  tips: {
    title: "Comment améliorer votre débit montant",
    items: [
      "Utilisez une connexion Ethernet filaire pour les appels et le streaming.",
      "Mettez en pause les sauvegardes cloud et la synchronisation des photos pendant que vous travaillez.",
      "Baissez la qualité vidéo des autres appels ou streams dans votre foyer.",
      "Redémarrez votre box et mettez à jour son firmware.",
      "Renseignez-vous auprès de votre fournisseur sur les offres avec plus de débit montant, ou passez à la fibre.",
    ],
  },
  faqHeading: "FAQ sur le débit montant",
  faqs: [
    {
      q: "Comment tester mon débit montant ?",
      a: "Appuyez sur le bouton GO ci-dessus. Le test mesure votre vitesse d'upload en Mbps en quelques secondes.",
    },
    {
      q: "Qu'est-ce qu'un bon débit montant ?",
      a: "5–10 Mbps suffisent pour la plupart des utilisateurs et pour les appels vidéo. Les streamers, les créateurs et ceux qui font de grosses sauvegardes cloud profitent de 20 Mbps ou plus.",
    },
    {
      q: "Pourquoi mon débit montant est-il si faible ?",
      a: "De nombreuses offres internet sont asymétriques et offrent volontairement bien moins de débit montant que descendant. Le Wi-Fi, un matériel ancien et la saturation du réseau peuvent encore le réduire. Une offre fibre propose généralement un débit montant plus élevé.",
    },
    {
      q: "Quel débit montant faut-il pour télétravailler ?",
      a: "Pour les e-mails et quelques appels vidéo, 5 Mbps suffisent. Si vous passez la majeure partie de la journée en visioconférence, partagez votre écran ou envoyez de gros fichiers, visez 10–20 Mbps par personne en télétravail.",
    },
    {
      q: "Quel débit montant faut-il pour streamer sur Twitch ou YouTube ?",
      a: "Les plateformes de streaming recommandent environ 3–6 Mbps pour du 720p et 6–10 Mbps pour du 1080p à 60 images par seconde. Gardez une marge d'environ 30 % au-dessus du débit de votre stream pour qu'il reste stable.",
    },
  ],
};

const frPing: ToolPageMessages = {
  meta: {
    title: "Test de ping : mesurez latence et gigue gratuitement",
    description:
      "Test de ping et de latence gratuit. Mesurez le temps de réponse (ping) et la gigue de votre connexion en millisecondes, clés pour le jeu en ligne et la visio.",
    keywords: [
      "test de ping",
      "test de latence",
      "tester son ping",
      "latence internet",
      "test ping en ligne",
      "test de gigue",
      "ping et latence",
    ],
  },
  badge: "Test de ping et de latence gratuit",
  titleLead: "Test de",
  titleHighlight: "ping et latence",
  intro:
    "Mesurez le ping et la gigue de votre connexion en millisecondes (ms). Lancez le test pour vérifier votre latence, le temps de réponse qui compte le plus pour le jeu en ligne, les appels vidéo et le streaming en direct.",
  sectionsHeading: "Tout savoir sur le ping, la latence et la gigue",
  sectionsIntro: "Les deux chiffres qui déterminent la réactivité de votre connexion.",
  sections: [
    {
      title: "Qu'est-ce que le ping (latence) ?",
      text: "Le ping (latence) est le temps que mettent les données pour aller de votre appareil à un serveur et revenir, mesuré en millisecondes. Plus il est bas, mieux c'est : tout paraît plus réactif.",
    },
    {
      title: "Qu'est-ce que la gigue ?",
      text: "La gigue (jitter) est la variation de votre ping dans le temps. Une gigue élevée provoque des pics de lag, des saccades en appel vidéo et des effets d'élastique dans les jeux, même lorsque votre débit semble correct.",
    },
    {
      title: "Qu'est-ce qu'un bon ping ?",
      text: "Moins de 20 ms, c'est excellent ; 20–50 ms, c'est bon pour le jeu en ligne ; 50–100 ms suffisent pour naviguer ; au-delà de 150 ms, les applications en temps réel peuvent sembler lentes.",
    },
    {
      title: "Comment réduire votre ping",
      text: "Utilisez une connexion Ethernet filaire, fermez les applications gourmandes en bande passante, choisissez des serveurs de jeu proches et évitez les interférences Wi-Fi. Une liaison filaire réduit presque toujours la latence et la gigue.",
    },
  ],
  table: {
    title: "Les niveaux de ping expliqués",
    intro: "Ce que donnent concrètement les différentes valeurs de ping. Idéalement, la gigue doit rester sous 30 ms.",
    head: ["Ping", "À quoi s'attendre"],
    rows: [
      ["0–20 ms", "Excellent : idéal pour le jeu compétitif"],
      ["20–50 ms", "Très bon : jeux et appels fluides"],
      ["50–100 ms", "Bon : convient à la navigation, au streaming et au jeu occasionnel"],
      ["100–150 ms", "Moyen : décalage perceptible en jeu et en appel"],
      ["150+ ms", "Mauvais : lag dans les applications en temps réel"],
    ],
  },
  guide: {
    title: "Pourquoi le ping compte plus que le débit pour le jeu en ligne",
    paragraphs: [
      "Les jeux en ligne et les appels vidéo échangent en permanence de petites quantités de données. Ils ont besoin de très peu de bande passante, mais il leur faut une réponse rapide : une connexion à 50 Mbps avec un ping de 15 ms paraît souvent meilleure qu'une connexion à 500 Mbps avec un ping de 120 ms.",
      "Le ping dépend surtout de la distance et du chemin emprunté par vos données. La fibre et le câble offrent généralement la latence la plus faible, la 4G et la 5G sont plus élevées et plus variables, et les connexions satellite peuvent ajouter beaucoup de délai. Le Wi-Fi ajoute quelques millisecondes et, surtout, de la gigue.",
      "Notre test envoie une série de petites requêtes à un serveur proche et indique la réponse la plus rapide comme ping, et la variation moyenne comme gigue. Un serveur de jeu éloigné affichera un ping plus élevé que ce test, car les données ont plus de chemin à parcourir.",
    ],
  },
  tips: {
    title: "Comment réduire le ping et la gigue",
    items: [
      "Branchez votre console ou votre PC à la box avec un câble Ethernet.",
      "Arrêtez les gros téléchargements, les envois et les streams 4K pendant que vous jouez.",
      "Choisissez des serveurs de jeu dans votre région.",
      "Activez la QoS ou le mode jeu de votre box si elle en dispose.",
      "Redémarrez votre box, et remplacez-la si elle a plusieurs années.",
      "Désactivez votre VPN, sauf s'il vous oriente vers un serveur plus proche.",
    ],
  },
  faqHeading: "FAQ sur le ping et la latence",
  faqs: [
    {
      q: "Comment tester mon ping ?",
      a: "Appuyez sur le bouton GO ci-dessus. Le test mesure votre ping et votre gigue en millisecondes en quelques secondes.",
    },
    {
      q: "Quel est un bon ping pour jouer en ligne ?",
      a: "Moins de 20 ms, c'est excellent, et 20–50 ms, c'est bon pour le jeu en ligne. Au-delà de 100 ms, vous risquez de ressentir du lag, et au-delà de 150 ms, les jeux rapides deviennent peu réactifs.",
    },
    {
      q: "Qu'est-ce qui provoque un ping et une gigue élevés ?",
      a: "Les interférences Wi-Fi, la distance avec le serveur, la saturation du réseau, une box ancienne et les téléchargements en arrière-plan augmentent tous le ping et la gigue. Une connexion filaire est la solution la plus efficace.",
    },
    {
      q: "Le ping et la latence, est-ce la même chose ?",
      a: "Dans le langage courant, oui. La latence est le délai de transit des données sur le réseau, et le ping est l'outil et la mesure qui permettent de la vérifier, généralement sous forme d'aller-retour en millisecondes.",
    },
    {
      q: "Une offre internet plus rapide réduit-elle mon ping ?",
      a: "Pas forcément. Plus de bande passante aide quand votre ligne est saturée, mais le ping dépend surtout du type de connexion, de la distance avec le serveur et de votre réseau domestique. Passer du Wi-Fi au câble aide souvent davantage que de changer d'offre.",
    },
  ],
};

const frWifi: ToolPageMessages = {
  meta: {
    title: "Test débit Wi-Fi : mesurez votre vitesse sans fil",
    description:
      "Test débit Wi-Fi gratuit. Mesurez votre débit descendant, montant et votre ping sans fil, sur tout appareil, dans chaque pièce. Repérez les zones mortes.",
    keywords: [
      "test débit Wi-Fi",
      "test vitesse Wi-Fi",
      "tester son Wi-Fi",
      "débit Wi-Fi",
      "test connexion sans fil",
      "vitesse wifi",
      "test wifi gratuit",
    ],
  },
  badge: "Test de débit Wi-Fi gratuit",
  titleLead: "Test de débit",
  titleHighlight: "Wi-Fi",
  intro:
    "Testez la vitesse de votre connexion sans fil en quelques secondes. Lancez le test pour mesurer votre débit descendant, votre débit montant et votre ping en Wi-Fi, puis testez dans d'autres pièces pour repérer les zones mortes et le meilleur emplacement pour votre box.",
  sectionsHeading: "Tout savoir sur le débit Wi-Fi",
  sectionsIntro: "Comment bien tester votre réseau sans fil et en tirer plus de vitesse.",
  sections: [
    {
      title: "Comment tester votre débit Wi-Fi",
      text: "Connectez-vous à votre Wi-Fi, appuyez sur GO et notez le résultat. Répétez ensuite le test dans différentes pièces pour comparer la force du signal et repérer les points faibles de votre logement.",
    },
    {
      title: "Pourquoi mon Wi-Fi est-il plus lent que mon offre ?",
      text: "Le Wi-Fi perd en vitesse avec la distance, les murs, les interférences d'autres appareils et les box anciennes. Le débit mesuré sur votre appareil est souvent inférieur à celui qui arrive à votre modem.",
    },
    {
      title: "Wi-Fi ou filaire",
      text: "Une connexion Ethernet filaire est plus rapide et plus stable que le Wi-Fi. Si votre résultat en Wi-Fi est bien inférieur à votre résultat en filaire, le goulot d'étranglement vient de votre installation sans fil, pas de votre fournisseur.",
    },
    {
      title: "Comment améliorer le débit Wi-Fi",
      text: "Rapprochez-vous de la box, utilisez la bande 5 GHz, réduisez les interférences, mettez à jour le firmware, ou ajoutez un système mesh ou un répéteur pour les grands logements et les zones mortes.",
    },
  ],
  table: {
    title: "Bandes et normes Wi-Fi en un coup d'œil",
    intro: "Les débits réels sont inférieurs aux maximums théoriques indiqués sur la boîte et diminuent avec la distance et les murs.",
    head: ["Bande ou norme", "Idéal pour"],
    rows: [
      ["Bande 2,4 GHz", "Longue portée et traversée des murs, mais plus lente et plus encombrée"],
      ["Bande 5 GHz", "Beaucoup plus rapide à courte et moyenne portée"],
      ["Bande 6 GHz (WiFi 6E / 7)", "Très rapide, peu d'interférences, portée la plus courte"],
      ["WiFi 5 (802.11ac)", "Bien pour les offres jusqu'à quelques centaines de Mbps"],
      ["WiFi 6 / 6E (802.11ax)", "Foyers avec de nombreux appareils, offres gigabit"],
      ["WiFi 7 (802.11be)", "Offres multi-gigabit et appareils les plus récents"],
    ],
  },
  guide: {
    title: "Tirer le meilleur parti de votre Wi-Fi",
    paragraphs: [
      "Votre offre internet fixe le débit maximal qui arrive chez vous, mais c'est le Wi-Fi qui détermine la part qui atteint chaque appareil. Les murs, les planchers, les miroirs, les aquariums et même les micro-ondes affaiblissent le signal, et chaque mètre supplémentaire depuis la box coûte du débit.",
      "Lancez d'abord ce test à côté de la box, puis dans les pièces où vous utilisez le plus internet. Si le débit chute fortement dans certaines pièces, placez la box à un endroit central, surélevé et dégagé, ou ajoutez un système mesh pour que chaque pièce reçoive un signal fort.",
      "Les téléphones et ordinateurs portables anciens ne prennent parfois en charge que d'anciennes normes Wi-Fi et ne peuvent pas atteindre les débits d'une box moderne. Si un appareil est beaucoup plus lent que les autres au même endroit, c'est l'appareil, et non votre connexion, qui limite le débit.",
    ],
  },
  tips: {
    title: "Solutions rapides pour un Wi-Fi lent",
    items: [
      "Placez la box à un endroit central, dégagé et en hauteur.",
      "Connectez-vous au réseau 5 GHz ou 6 GHz lorsque vous êtes près de la box.",
      "Changez de canal Wi-Fi si de nombreux réseaux voisins sont à proximité.",
      "Mettez à jour le firmware de la box et redémarrez-la de temps en temps.",
      "Utilisez un système mesh ou un point d'accès filaire pour les grands logements.",
      "Branchez les téléviseurs, consoles et ordinateurs fixes avec un câble lorsque c'est possible.",
    ],
  },
  faqHeading: "FAQ sur le débit Wi-Fi",
  faqs: [
    {
      q: "Comment tester mon débit Wi-Fi ?",
      a: "Connectez votre appareil au Wi-Fi et appuyez sur le bouton GO ci-dessus. Le test mesure votre débit descendant, votre débit montant et votre ping sans fil. Répétez-le dans différentes pièces pour cartographier votre couverture.",
    },
    {
      q: "Qu'est-ce qu'un bon débit Wi-Fi ?",
      a: "Cela dépend de votre offre, mais 25–100 Mbps en Wi-Fi conviennent à la plupart des foyers. Si votre résultat en Wi-Fi est très inférieur à votre offre ou à votre débit filaire, c'est votre installation sans fil qui limite le débit.",
    },
    {
      q: "Comment rendre mon Wi-Fi plus rapide ?",
      a: "Rapprochez-vous de la box, passez sur la bande 5 GHz, réduisez les interférences avec les autres appareils, mettez à jour le firmware de votre box, ou ajoutez un réseau mesh ou un répéteur pour couvrir les zones mortes.",
    },
    {
      q: "Pourquoi mon Wi-Fi est-il rapide sur un appareil et lent sur un autre ?",
      a: "Les appareils prennent en charge des normes Wi-Fi et des antennes différentes. Un téléphone ou un ordinateur portable ancien peut être limité à des débits bien inférieurs à ceux d'un modèle récent, même au même endroit. Les applications en arrière-plan et les modes d'économie d'énergie peuvent aussi ralentir un appareil.",
    },
    {
      q: "Vaut-il mieux le 2,4 GHz ou le 5 GHz ?",
      a: "Le 5 GHz est plus rapide et moins encombré, ce qui en fait le meilleur choix dans la même pièce ou à proximité. Le 2,4 GHz porte plus loin et traverse plus facilement les murs : il peut donc être plus fiable loin de la box.",
    },
  ],
};

const fr: ToolsMessages = {
  ui: {
    highlights: ["Résultats précis en temps réel", "Aucune appli requise", "Fonctionne sur tous les appareils"],
    learnKicker: "Comprendre",
    tipsKicker: "Conseils",
    faqKicker: "FAQ",
    fullTest: "Lancer le test de débit internet complet",
    guideLink: "Qu'est-ce qu'un bon débit internet ?",
    otherTitle: "Plus d'outils gratuits",
    otherIntro: "Testez un autre aspect de votre connexion ou vérifiez votre adresse IP.",
    open: "Ouvrir l'outil",
  },
  directory: {
    full: { title: "Test de débit internet", text: "Débit descendant, montant, ping et gigue en un seul test." },
    download: { title: "Test de débit descendant", text: "La vitesse à laquelle vous recevez les données, en Mbps." },
    upload: { title: "Test de débit montant", text: "La vitesse d'envoi pour les appels et les sauvegardes." },
    ping: { title: "Test de ping et latence", text: "Temps de réponse et gigue, en millisecondes." },
    wifi: { title: "Test de débit Wi-Fi", text: "Vérifiez la vitesse sans fil pièce par pièce." },
    myIp: { title: "Quelle est mon IP", text: "Votre adresse IP publique, votre FAI et votre localisation." },
    ipRisk: { title: "Score de risque IP", text: "Vérifiez si une IP est un VPN, un proxy ou signalée." },
  },
  pages: { download: frDownload, upload: frUpload, ping: frPing, wifi: frWifi },
};

// ---------------------------------------------------------------------------
// Español
// ---------------------------------------------------------------------------

const esDownload: ToolPageMessages = {
  meta: {
    title: "Test de velocidad de descarga: mide tus Mbps gratis",
    description:
      "Test de velocidad de descarga gratis. Mide en segundos qué tan rápido descargas datos de internet en Mbps, en cualquier dispositivo. Preciso y sin apps.",
    keywords: [
      "test de velocidad de descarga",
      "velocidad de descarga",
      "medir velocidad de descarga",
      "prueba de velocidad de descarga",
      "test de velocidad de internet",
      "test de descarga Mbps",
      "comprobar velocidad de descarga",
    ],
  },
  badge: "Test de descarga gratis",
  titleLead: "Test de velocidad",
  titleHighlight: "de descarga",
  intro:
    "Mide tu velocidad de descarga real en megabits por segundo (Mbps). Inicia la prueba para ver qué tan rápido recibes datos de internet para streaming, navegación, juegos y descargas.",
  sectionsHeading: "Sobre la velocidad de descarga",
  sectionsIntro: "Qué es la velocidad de descarga, qué se considera buena y cómo la medimos.",
  sections: [
    {
      title: "¿Qué es la velocidad de descarga?",
      text: "La velocidad de descarga es la rapidez con la que tu conexión recibe datos de internet, medida en Mbps. Influye en la calidad del streaming, la carga de páginas, las descargas de archivos y las videollamadas.",
    },
    {
      title: "¿Cuál es una buena velocidad de descarga?",
      text: "5–10 Mbps bastan para navegar, 25 Mbps para streaming en HD, y 100 Mbps o más es lo ideal para 4K, juegos y hogares con muchos dispositivos conectados.",
    },
    {
      title: "Cómo la medimos",
      text: "Abrimos varias conexiones en paralelo con un servidor cercano de una red global y transferimos datos durante unos segundos; después calculamos tu velocidad de descarga real en Mbps.",
    },
    {
      title: "Consejos para una prueba precisa",
      text: "Si puedes, haz la prueba con cable, pausa otras descargas y reproducciones, y deja esta pestaña abierta mientras dura el test para obtener el resultado más fiable.",
    },
  ],
  table: {
    title: "Velocidad de descarga necesaria según el uso",
    intro: "Velocidades de descarga típicas por dispositivo. Súmalas para todo lo que se usa al mismo tiempo en tu hogar.",
    head: ["Actividad", "Velocidad de descarga"],
    rows: [
      ["Correo, navegación web, redes sociales", "1–5 Mbps"],
      ["Streaming de música", "1–2 Mbps"],
      ["Videollamadas en HD", "2–4 Mbps"],
      ["Streaming de video en HD (1080p)", "5–8 Mbps"],
      ["Streaming en 4K (Ultra HD)", "15–25 Mbps"],
      ["Descarga de juegos y archivos grandes", "100+ Mbps"],
    ],
  },
  guide: {
    title: "Cómo interpretar tu resultado de descarga",
    paragraphs: [
      "La velocidad de descarga es la cifra que anuncian la mayoría de los planes de internet y la que define buena parte de tu experiencia en línea. Cada página web, video, canción y actualización de apps que recibes viaja en sentido descendente, así que una mayor velocidad de descarga significa menos espera y mejor calidad de video.",
      "Tu resultado es la velocidad medida en tu dispositivo en este momento. Puede ser inferior a la de tu plan por la intensidad de la señal WiFi, otros dispositivos que usan la conexión, la antigüedad de tu router o computadora, una VPN o la congestión en las horas punta de la noche. Si con cable obtienes de forma constante menos del 80 % de tu plan, conviene informar a tu proveedor.",
      "Para calcular cuánto tardará una descarga, recuerda que la velocidad se expresa en megabits y el tamaño de los archivos en megabytes. Divide tu velocidad entre ocho: 200 Mbps equivalen a unos 25 MB/s, así que un juego de 5 GB tarda unos tres minutos y medio en condiciones ideales.",
    ],
  },
  tips: {
    title: "Cómo conseguir una descarga más rápida",
    items: [
      "Conéctate con un cable Ethernet o acércate al router.",
      "Usa la banda WiFi de 5 GHz o 6 GHz en lugar de la de 2,4 GHz.",
      "Pausa la sincronización en la nube, las actualizaciones de juegos y el streaming en otros dispositivos.",
      "Reinicia el router y el módem, y mantén su firmware actualizado.",
      "Desconecta la VPN para ver la velocidad real de tu proveedor.",
      "Contrata un plan superior si tu hogar necesita más ancho de banda con frecuencia.",
    ],
  },
  faqHeading: "Preguntas frecuentes sobre la velocidad de descarga",
  faqs: [
    {
      q: "¿Cómo hago un test de velocidad de descarga?",
      a: "Solo pulsa el botón GO de arriba. La prueba mide tu velocidad de descarga en Mbps en pocos segundos. Para un resultado más preciso, cierra otras aplicaciones y haz el test con cable.",
    },
    {
      q: "¿Por qué mi velocidad de descarga es menor que la de mi plan?",
      a: "Las interferencias WiFi, la distancia al router, los equipos antiguos, las VPN, las descargas en segundo plano y la congestión en horas punta pueden reducir la velocidad medida. Haz la prueba con cable para obtener el resultado más preciso.",
    },
    {
      q: "¿Cuál es una buena velocidad de descarga?",
      a: "Para la mayoría de los hogares, 25–100 Mbps es una buena velocidad. Los usuarios intensivos, el streaming en 4K y los juegos se benefician de 100–500 Mbps, mientras que para navegar de forma ligera bastan 5–10 Mbps.",
    },
    {
      q: "¿50 Mbps es una buena velocidad de descarga?",
      a: "Sí, para una a tres personas. Con 50 Mbps puedes ver un video en HD y otro en 4K, hacer videollamadas y navegar a la vez. Los hogares más grandes que ven contenido en varias pantallas al mismo tiempo estarán más cómodos con 100 Mbps o más.",
    },
    {
      q: "¿Cuánto se tarda en descargar 1 GB?",
      a: "Unos 5,5 minutos a 25 Mbps, alrededor de 1,5 minutos a 100 Mbps y unos 16 segundos a 500 Mbps, siempre que el servidor responda a esa velocidad y nada más esté usando tu conexión.",
    },
  ],
};

const esUpload: ToolPageMessages = {
  meta: {
    title: "Test de velocidad de subida: mide tus Mbps de subida",
    description:
      "Test de velocidad de subida gratis. Mide qué tan rápido envías datos a internet en Mbps para videollamadas, copias de seguridad, streaming y compartir archivos.",
    keywords: [
      "test de velocidad de subida",
      "velocidad de subida",
      "medir velocidad de subida",
      "prueba de velocidad de subida",
      "velocidad de carga internet",
      "test de subida Mbps",
      "comprobar velocidad de subida",
    ],
  },
  badge: "Test de subida gratis",
  titleLead: "Test de velocidad",
  titleHighlight: "de subida",
  intro:
    "Mide tu velocidad de subida real en megabits por segundo (Mbps). Inicia la prueba para ver qué tan rápido envías datos a internet para videollamadas, copias de seguridad en la nube, transmisiones en vivo y archivos compartidos.",
  sectionsHeading: "Sobre la velocidad de subida",
  sectionsIntro: "Por qué importa la velocidad de subida, cuál es buena y por qué suele ser menor que la de descarga.",
  sections: [
    {
      title: "¿Qué es la velocidad de subida?",
      text: "La velocidad de subida es la rapidez con la que tu conexión envía datos a internet, medida en Mbps. Es clave para las videollamadas, publicar contenido, las copias de seguridad en línea y las transmisiones en vivo.",
    },
    {
      title: "¿Cuál es una buena velocidad de subida?",
      text: "3–5 Mbps bastan para videollamadas, 10 Mbps resultan cómodos para la mayoría de las subidas, y 20 Mbps o más son adecuados para creadores, streamers y copias de seguridad grandes en la nube.",
    },
    {
      title: "Cómo la medimos",
      text: "Enviamos datos a través de varias conexiones en paralelo a un servidor cercano de una red global durante unos segundos y calculamos tu velocidad de subida real en Mbps.",
    },
    {
      title: "Por qué la subida es más lenta que la descarga",
      text: "La mayoría de los planes de cable y DSL son asimétricos: ofrecen mucha más descarga que subida porque la gente descarga más de lo que envía. Las conexiones de fibra suelen ser más equilibradas.",
    },
  ],
  table: {
    title: "Velocidad de subida necesaria según el uso",
    intro: "Velocidades de subida típicas para tareas habituales. Quienes teletrabajan o crean contenido deberían apuntar a la parte alta del rango.",
    head: ["Actividad", "Velocidad de subida"],
    rows: [
      ["Correo, mensajería, publicaciones en redes sociales", "1 Mbps"],
      ["Videollamadas en HD (Zoom, Teams, Meet)", "3–4 Mbps"],
      ["Llamadas grupales y pantalla compartida", "5–10 Mbps"],
      ["Transmisión en vivo en 1080p", "6–10 Mbps"],
      ["Transmisión en vivo en 4K", "20–40 Mbps"],
      ["Copias de seguridad grandes y subida de videos", "50+ Mbps"],
    ],
  },
  guide: {
    title: "Cómo interpretar tu resultado de subida",
    paragraphs: [
      "La velocidad de subida recibe menos atención que la de descarga, pero determina cómo se te ve y se te oye en las videollamadas, lo rápido que se sincronizan tus fotos en la nube y si una transmisión en vivo se mantiene nítida. Cuando varias personas del mismo hogar están en llamadas a la vez, la subida suele ser lo primero que se agota.",
      "Muchos planes de cable y DSL ofrecen diez veces más descarga que subida, así que una cifra de subida baja no es necesariamente una avería. Revisa la velocidad de subida que figura en tu contrato: si tu resultado con cable se acerca a ella, tu línea funciona según lo contratado. Los planes de fibra suelen ser simétricos, con la misma velocidad de subida y de descarga.",
      "Si tu subida está muy por debajo de la de tu plan, busca dispositivos que estén haciendo copias de seguridad de fotos o videos en segundo plano, una red WiFi saturada o un router antiguo. Hacer la prueba con cable y sin nada más en marcha es la forma más rápida de encontrar la causa.",
    ],
  },
  tips: {
    title: "Cómo mejorar tu velocidad de subida",
    items: [
      "Usa una conexión Ethernet por cable para llamadas y transmisiones.",
      "Pausa las copias de seguridad en la nube y la sincronización de fotos mientras trabajas.",
      "Baja la calidad de video de otras llamadas o transmisiones en tu hogar.",
      "Reinicia el router y actualiza su firmware.",
      "Pregunta a tu proveedor por planes con más subida o cámbiate a fibra.",
    ],
  },
  faqHeading: "Preguntas frecuentes sobre la velocidad de subida",
  faqs: [
    {
      q: "¿Cómo hago un test de velocidad de subida?",
      a: "Pulsa el botón GO de arriba. La prueba mide tu velocidad de subida en Mbps en pocos segundos.",
    },
    {
      q: "¿Cuál es una buena velocidad de subida?",
      a: "5–10 Mbps son suficientes para la mayoría de los usuarios y para videollamadas. Los streamers, creadores y quienes hacen copias de seguridad grandes en la nube se benefician de 20 Mbps o más.",
    },
    {
      q: "¿Por qué mi velocidad de subida es tan baja?",
      a: "Muchos planes de internet son asimétricos y ofrecen a propósito mucha menos subida que descarga. El WiFi, los equipos antiguos y la congestión pueden reducirla aún más. Un plan de fibra suele ofrecer velocidades de subida más altas.",
    },
    {
      q: "¿Qué velocidad de subida necesito para teletrabajar?",
      a: "Para el correo y alguna videollamada ocasional, 5 Mbps son suficientes. Si pasas gran parte del día en videollamadas, compartes pantalla o envías archivos grandes, apunta a 10–20 Mbps por cada persona que teletrabaja.",
    },
    {
      q: "¿Qué velocidad de subida necesito para transmitir en Twitch o YouTube?",
      a: "Las plataformas de streaming recomiendan aproximadamente 3–6 Mbps para 720p y 6–10 Mbps para 1080p a 60 fotogramas por segundo. Deja un margen de alrededor del 30 % por encima del bitrate de tu transmisión para que se mantenga estable.",
    },
  ],
};

const esPing: ToolPageMessages = {
  meta: {
    title: "Test de ping: mide tu latencia y jitter gratis",
    description:
      "Test de ping y latencia gratis. Mide el tiempo de respuesta (ping) y el jitter de tu red en milisegundos, clave para jugar online, videollamadas y streaming.",
    keywords: [
      "test de ping",
      "test de latencia",
      "medir ping",
      "prueba de ping",
      "latencia de internet",
      "test de jitter",
      "ping y latencia",
    ],
  },
  badge: "Test de ping y latencia gratis",
  titleLead: "Test de",
  titleHighlight: "ping y latencia",
  intro:
    "Mide el ping y el jitter de tu conexión en milisegundos (ms). Inicia la prueba para comprobar tu latencia, el tiempo de respuesta que más importa en los juegos online, las videollamadas y las transmisiones en vivo.",
  sectionsHeading: "Sobre el ping, la latencia y el jitter",
  sectionsIntro: "Las dos cifras que deciden lo ágil que se siente tu conexión.",
  sections: [
    {
      title: "¿Qué es el ping o latencia?",
      text: "El ping (latencia) es el tiempo que tardan los datos en ir de tu dispositivo a un servidor y volver, medido en milisegundos. Cuanto más bajo, mejor: todo responde con más rapidez.",
    },
    {
      title: "¿Qué es el jitter?",
      text: "El jitter es la variación de tu ping a lo largo del tiempo. Un jitter alto provoca picos de lag, cortes en las videollamadas y saltos en los juegos, aunque tu velocidad parezca correcta.",
    },
    {
      title: "¿Cuál es un buen ping?",
      text: "Menos de 20 ms es excelente, 20–50 ms es bueno para jugar, 50–100 ms es suficiente para navegar, y por encima de 150 ms las aplicaciones en tiempo real pueden ir con retraso.",
    },
    {
      title: "Cómo bajar tu ping",
      text: "Usa una conexión Ethernet por cable, cierra las aplicaciones que consumen mucho ancho de banda, elige servidores de juego cercanos y evita las interferencias WiFi. Una conexión por cable casi siempre reduce la latencia y el jitter.",
    },
  ],
  table: {
    title: "Rangos de ping explicados",
    intro: "Cómo se notan en la práctica los distintos valores de ping. Lo ideal es que el jitter se mantenga por debajo de 30 ms.",
    head: ["Ping", "Qué esperar"],
    rows: [
      ["0–20 ms", "Excelente: ideal para juegos competitivos"],
      ["20–50 ms", "Muy bueno: juegos y llamadas fluidos"],
      ["50–100 ms", "Bueno: suficiente para navegar, ver streaming y jugar de forma casual"],
      ["100–150 ms", "Regular: retraso perceptible en juegos y llamadas"],
      ["150+ ms", "Malo: lag en aplicaciones en tiempo real"],
    ],
  },
  guide: {
    title: "Por qué el ping importa más que la velocidad para jugar",
    paragraphs: [
      "Los juegos online y las videollamadas intercambian constantemente pequeñas cantidades de datos. Necesitan muy poco ancho de banda, pero lo necesitan rápido, por eso una conexión de 50 Mbps con 15 ms de ping suele sentirse mejor que una de 500 Mbps con 120 ms de ping.",
      "El ping depende sobre todo de la distancia y de la ruta que siguen tus datos. La fibra y el cable suelen ofrecer la latencia más baja, el 4G y el 5G la tienen más alta y variable, y las conexiones por satélite pueden añadir mucho retraso. El WiFi suma unos pocos milisegundos y, lo que es más importante, jitter.",
      "Nuestra prueba envía una serie de pequeñas solicitudes a un servidor cercano e indica la respuesta más rápida como tu ping y la variación media como tu jitter. Un servidor de juego lejano mostrará un ping más alto que esta prueba, porque los datos tienen que recorrer más distancia.",
    ],
  },
  tips: {
    title: "Cómo reducir el ping y el jitter",
    items: [
      "Conecta tu consola o PC al router con un cable Ethernet.",
      "Detén las descargas y subidas grandes y el streaming en 4K mientras juegas.",
      "Elige servidores de juego de tu propia región.",
      "Activa el QoS o el modo gaming del router si lo tiene.",
      "Reinicia el router y cámbialo si tiene varios años.",
      "Desactiva la VPN, salvo que te dirija a un servidor más cercano.",
    ],
  },
  faqHeading: "Preguntas frecuentes sobre ping y latencia",
  faqs: [
    {
      q: "¿Cómo hago un test de ping?",
      a: "Pulsa el botón GO de arriba. La prueba mide tu ping y tu jitter en milisegundos en pocos segundos.",
    },
    {
      q: "¿Cuál es un buen ping para jugar?",
      a: "Menos de 20 ms es excelente y 20–50 ms es bueno para jugar online. Por encima de 100 ms puedes notar lag, y por encima de 150 ms los juegos rápidos dejan de responder con agilidad.",
    },
    {
      q: "¿Qué provoca un ping y un jitter altos?",
      a: "Las interferencias WiFi, la gran distancia al servidor, la congestión de la red, los routers antiguos y las descargas en segundo plano aumentan el ping y el jitter. Una conexión por cable es la solución más eficaz.",
    },
    {
      q: "¿El ping y la latencia son lo mismo?",
      a: "En el uso cotidiano, sí. La latencia es el retraso que sufren los datos al recorrer la red, y el ping es la herramienta y la medida que se usan para comprobarla, normalmente como un viaje de ida y vuelta en milisegundos.",
    },
    {
      q: "¿Un plan de internet más rápido baja mi ping?",
      a: "No necesariamente. Más ancho de banda ayuda cuando tu línea está saturada, pero el ping depende sobre todo del tipo de conexión, la distancia al servidor y tu red doméstica. Pasar del WiFi al cable suele ayudar más que mejorar el plan.",
    },
  ],
};

const esWifi: ToolPageMessages = {
  meta: {
    title: "Test de velocidad WiFi: mide tu conexión inalámbrica",
    description:
      "Test de velocidad WiFi gratis. Comprueba la descarga, la subida y el ping de tu red inalámbrica en cualquier dispositivo y habitación. Detecta zonas sin señal.",
    keywords: [
      "test de velocidad WiFi",
      "velocidad WiFi",
      "medir velocidad WiFi",
      "prueba de velocidad WiFi",
      "test WiFi",
      "test de conexión inalámbrica",
      "comprobar velocidad del WiFi",
    ],
  },
  badge: "Test de velocidad WiFi gratis",
  titleLead: "Test de velocidad",
  titleHighlight: "WiFi",
  intro:
    "Prueba la velocidad de tu internet inalámbrico en segundos. Inicia la prueba para medir la descarga, la subida y el ping de tu WiFi, y luego repite la prueba en otras habitaciones para encontrar zonas sin señal y el mejor lugar para tu router.",
  sectionsHeading: "Sobre la velocidad WiFi",
  sectionsIntro: "Cómo probar bien tu red inalámbrica y sacarle más velocidad.",
  sections: [
    {
      title: "Cómo hacer un test de velocidad WiFi",
      text: "Conéctate a tu WiFi, pulsa GO y anota el resultado. Después repite la prueba en distintas habitaciones para comparar la intensidad de la señal y encontrar los puntos débiles de tu casa.",
    },
    {
      title: "¿Por qué mi WiFi es más lento que mi plan?",
      text: "El WiFi pierde velocidad con la distancia, las paredes, las interferencias de otros dispositivos y los routers antiguos. La velocidad en tu dispositivo suele ser menor que la que llega a tu módem.",
    },
    {
      title: "WiFi frente a cable",
      text: "Una conexión Ethernet por cable es más rápida y estable que el WiFi. Si tu resultado por WiFi es mucho menor que por cable, el cuello de botella está en tu red inalámbrica, no en tu proveedor.",
    },
    {
      title: "Cómo mejorar la velocidad WiFi",
      text: "Acércate al router, usa la banda de 5 GHz, reduce las interferencias, actualiza el firmware o añade un sistema mesh o un repetidor para casas grandes y zonas sin cobertura.",
    },
  ],
  table: {
    title: "Bandas y estándares WiFi de un vistazo",
    intro: "Las velocidades reales son inferiores a los máximos teóricos que figuran en la caja y disminuyen con la distancia y las paredes.",
    head: ["Banda o estándar", "Ideal para"],
    rows: [
      ["Banda de 2,4 GHz", "Largo alcance y atraviesa paredes, pero más lenta y saturada"],
      ["Banda de 5 GHz", "Mucho más rápida a corta y media distancia"],
      ["Banda de 6 GHz (WiFi 6E / 7)", "Muy rápida, pocas interferencias, menor alcance"],
      ["WiFi 5 (802.11ac)", "Buena para planes de hasta unos cientos de Mbps"],
      ["WiFi 6 / 6E (802.11ax)", "Hogares con muchos dispositivos, planes de gigabit"],
      ["WiFi 7 (802.11be)", "Planes multigigabit y los dispositivos más nuevos"],
    ],
  },
  guide: {
    title: "Cómo sacar el máximo partido a tu WiFi",
    paragraphs: [
      "Tu plan de internet fija la velocidad máxima que llega a tu casa, pero el WiFi decide cuánta llega a cada dispositivo. Las paredes, los suelos, los espejos, los acuarios e incluso los microondas debilitan la señal, y cada metro extra de distancia al router resta velocidad.",
      "Haz primero esta prueba junto al router y después en las habitaciones donde más usas internet. Si la velocidad cae mucho en algunas habitaciones, coloca el router en un lugar central, elevado y despejado, o añade un sistema mesh para que todas las habitaciones tengan buena señal.",
      "Los teléfonos y portátiles antiguos pueden ser compatibles solo con estándares WiFi anteriores y no alcanzan las velocidades de un router moderno. Si un dispositivo es mucho más lento que los demás en el mismo lugar, el límite es el dispositivo, no tu conexión.",
    ],
  },
  tips: {
    title: "Soluciones rápidas para un WiFi lento",
    items: [
      "Coloca el router en un lugar central, despejado y elevado.",
      "Conéctate a la red de 5 GHz o 6 GHz cuando estés cerca del router.",
      "Cambia el canal WiFi si hay muchas redes vecinas cerca.",
      "Actualiza el firmware del router y reinícialo de vez en cuando.",
      "Usa un sistema mesh o un punto de acceso por cable en casas grandes.",
      "Conecta por cable los televisores, consolas y equipos de sobremesa siempre que puedas.",
    ],
  },
  faqHeading: "Preguntas frecuentes sobre la velocidad WiFi",
  faqs: [
    {
      q: "¿Cómo hago un test de velocidad WiFi?",
      a: "Conecta tu dispositivo al WiFi y pulsa el botón GO de arriba. La prueba mide la descarga, la subida y el ping de tu red inalámbrica. Repítela en distintas habitaciones para conocer tu cobertura.",
    },
    {
      q: "¿Cuál es una buena velocidad WiFi?",
      a: "Depende de tu plan, pero 25–100 Mbps por WiFi es una buena velocidad para la mayoría de los hogares. Si tu resultado por WiFi está muy por debajo de tu plan o de tu velocidad por cable, el cuello de botella es tu red inalámbrica.",
    },
    {
      q: "¿Cómo puedo hacer que mi WiFi sea más rápido?",
      a: "Acércate al router, cambia a la banda de 5 GHz, reduce las interferencias de otros dispositivos, actualiza el firmware del router o añade una red mesh o un repetidor para cubrir las zonas sin señal.",
    },
    {
      q: "¿Por qué mi WiFi va rápido en un dispositivo y lento en otro?",
      a: "Cada dispositivo admite distintos estándares WiFi y antenas. Un teléfono o portátil antiguo puede estar limitado a velocidades mucho más bajas que uno reciente, incluso en el mismo lugar. Las apps en segundo plano y los modos de ahorro de batería también pueden ralentizar un dispositivo concreto.",
    },
    {
      q: "¿Qué es mejor, 2,4 GHz o 5 GHz?",
      a: "La banda de 5 GHz es más rápida y está menos saturada, por lo que es la mejor opción en la misma habitación o cerca del router. La de 2,4 GHz llega más lejos y atraviesa mejor las paredes, así que puede ser más fiable lejos del router.",
    },
  ],
};

const es: ToolsMessages = {
  ui: {
    highlights: ["Resultados precisos en tiempo real", "Sin instalar apps", "Funciona en cualquier dispositivo"],
    learnKicker: "Aprende",
    tipsKicker: "Consejos",
    faqKicker: "Preguntas frecuentes",
    fullTest: "Hacer el test de velocidad de internet completo",
    guideLink: "¿Cuál es una buena velocidad de internet?",
    otherTitle: "Más herramientas gratis",
    otherIntro: "Prueba otro aspecto de tu conexión o consulta tu dirección IP.",
    open: "Abrir herramienta",
  },
  directory: {
    full: { title: "Test de velocidad de internet", text: "Descarga, subida, ping y jitter en una sola prueba." },
    download: { title: "Test de velocidad de descarga", text: "Qué tan rápido recibes datos, en Mbps." },
    upload: { title: "Test de velocidad de subida", text: "Qué tan rápido envías datos para llamadas y copias de seguridad." },
    ping: { title: "Test de ping y latencia", text: "Tiempo de respuesta y jitter, en milisegundos." },
    wifi: { title: "Test de velocidad WiFi", text: "Comprueba la velocidad inalámbrica habitación por habitación." },
    myIp: { title: "Cuál es mi IP", text: "Tu dirección IP pública, tu proveedor y tu ubicación." },
    ipRisk: { title: "Puntuación de riesgo IP", text: "Comprueba si una IP es una VPN, un proxy o está marcada." },
  },
  pages: { download: esDownload, upload: esUpload, ping: esPing, wifi: esWifi },
};

// ---------------------------------------------------------------------------
// العربية
// ---------------------------------------------------------------------------

const arDownload: ToolPageMessages = {
  meta: {
    title: "اختبار سرعة التحميل: قِس سرعة الإنترنت مجانًا بـ Mbps",
    description:
      "اختبار سرعة التحميل مجانًا. قِس سرعة تنزيل البيانات من الإنترنت بوحدة Mbps على أي جهاز وخلال ثوانٍ. نتائج دقيقة وفورية دون الحاجة إلى تثبيت أي تطبيق.",
    keywords: [
      "اختبار سرعة التحميل",
      "قياس سرعة التحميل",
      "سرعة التنزيل",
      "اختبار سرعة الإنترنت",
      "فحص سرعة النت",
      "قياس سرعة الانترنت Mbps",
      "سرعة تحميل الإنترنت",
    ],
  },
  badge: "اختبار مجاني لسرعة التحميل",
  titleLead: "اختبار",
  titleHighlight: "سرعة التحميل",
  intro:
    "قِس سرعة التحميل الفعلية لديك بالميغابت في الثانية (Mbps). ابدأ الاختبار لترى مدى سرعة استقبالك للبيانات من الإنترنت للبث والتصفح والألعاب وتنزيل الملفات.",
  sectionsHeading: "عن سرعة التحميل",
  sectionsIntro: "ما هي سرعة التحميل، وما السرعة الجيدة، وكيف نقيسها.",
  sections: [
    {
      title: "ما هي سرعة التحميل؟",
      text: "سرعة التحميل هي مدى سرعة استقبال اتصالك للبيانات من الإنترنت، وتُقاس بوحدة Mbps. وهي تؤثر في جودة البث وسرعة تحميل الصفحات وتنزيل الملفات ومكالمات الفيديو.",
    },
    {
      title: "ما هي سرعة التحميل الجيدة؟",
      text: "تكفي 5–10 Mbps للتصفح، و25 Mbps للبث بدقة HD، بينما تُعد 100 Mbps أو أكثر مثالية لمحتوى 4K والألعاب والمنازل المزدحمة بالأجهزة.",
    },
    {
      title: "كيف نقيسها",
      text: "نفتح عدة اتصالات متوازية مع خادم قريب على شبكة عالمية وننقل البيانات لبضع ثوانٍ، ثم نحسب سرعة التحميل الفعلية لديك بوحدة Mbps.",
    },
    {
      title: "نصائح لاختبار دقيق",
      text: "أجرِ الاختبار عبر اتصال سلكي إن أمكن، وأوقف التنزيلات والبث الأخرى مؤقتًا، وأبقِ هذه الصفحة مفتوحة أثناء الاختبار للحصول على أدق نتيجة.",
    },
  ],
  table: {
    title: "سرعة التحميل التي تحتاجها حسب الاستخدام",
    intro: "سرعات التحميل المعتادة اللازمة لكل جهاز. اجمعها لكل ما يعمل في الوقت نفسه في منزلك.",
    head: ["الاستخدام", "سرعة التحميل"],
    rows: [
      ["البريد الإلكتروني وتصفح الويب ووسائل التواصل", "1–5 Mbps"],
      ["بث الموسيقى", "1–2 Mbps"],
      ["مكالمات الفيديو بدقة HD", "2–4 Mbps"],
      ["بث الفيديو بدقة HD (1080p)", "5–8 Mbps"],
      ["البث بدقة 4K (Ultra HD)", "15–25 Mbps"],
      ["تنزيل الألعاب والملفات الكبيرة", "100+ Mbps"],
    ],
  },
  guide: {
    title: "فهم نتيجة سرعة التحميل",
    paragraphs: [
      "سرعة التحميل هي الرقم الذي تعلن عنه معظم باقات الإنترنت، وهي التي تحدد الجزء الأكبر من تجربتك على الإنترنت. فكل صفحة ويب ومقطع فيديو وأغنية وتحديث تطبيق تستقبله يصل إليك في اتجاه التحميل، لذا فإن ارتفاع سرعة التحميل يعني انتظارًا أقل وجودة فيديو أعلى.",
      "نتيجتك هي السرعة المقاسة على جهازك في هذه اللحظة. وقد تكون أقل من سرعة باقتك بسبب قوة إشارة الواي فاي، أو أجهزة أخرى تستخدم الاتصال، أو قِدم الراوتر أو الحاسوب، أو استخدام VPN، أو الازدحام في ساعات الذروة المسائية. وإذا كانت نتيجتك عبر الاتصال السلكي أقل باستمرار من 80% من سرعة باقتك، فمن المفيد إبلاغ مزود الخدمة.",
      "لمعرفة المدة التي يستغرقها التنزيل، تذكّر أن السرعات تُذكر بالميغابت وأحجام الملفات بالميغابايت. اقسم سرعتك على ثمانية: فسرعة 200 Mbps تعادل نحو 25 ميغابايت في الثانية، وبالتالي تستغرق لعبة بحجم 5 GB نحو ثلاث دقائق ونصف في الظروف المثالية.",
    ],
  },
  tips: {
    title: "كيف تحصل على سرعة تحميل أعلى",
    items: [
      "اتصل بكابل إيثرنت، أو اقترب من الراوتر.",
      "استخدم نطاق الواي فاي 5 GHz أو 6 GHz بدلًا من 2.4 GHz.",
      "أوقف مؤقتًا المزامنة السحابية وتحديثات الألعاب والبث على الأجهزة الأخرى.",
      "أعد تشغيل الراوتر والمودم، وحافظ على تحديث البرنامج الثابت لهما.",
      "افصل الـ VPN لمعرفة السرعة الفعلية التي يقدمها مزود الخدمة.",
      "رقِّ باقتك إذا كان منزلك يحتاج بانتظام إلى نطاق ترددي أكبر.",
    ],
  },
  faqHeading: "أسئلة شائعة حول سرعة التحميل",
  faqs: [
    {
      q: "كيف أختبر سرعة التحميل لدي؟",
      a: "اضغط ببساطة على زر «ابدأ» في الأعلى. يقيس الاختبار سرعة التحميل لديك بوحدة Mbps خلال ثوانٍ. وللحصول على أدق نتيجة، أغلق التطبيقات الأخرى وأجرِ الاختبار عبر اتصال سلكي.",
    },
    {
      q: "لماذا سرعة التحميل لدي أبطأ من سرعة باقتي؟",
      a: "قد يؤدي تداخل الواي فاي، والبعد عن الراوتر، والأجهزة القديمة، واستخدام VPN، والتنزيلات في الخلفية، والازدحام في ساعات الذروة إلى خفض السرعة المقاسة. أجرِ الاختبار عبر اتصال سلكي للحصول على أدق نتيجة.",
    },
    {
      q: "ما هي سرعة التحميل الجيدة؟",
      a: "تُعد 25–100 Mbps سرعة جيدة لمعظم المنازل. ويستفيد المستخدمون الكثيفون وبث 4K والألعاب من 100–500 Mbps، بينما يكفي 5–10 Mbps للتصفح الخفيف.",
    },
    {
      q: "هل 50 Mbps سرعة تحميل جيدة؟",
      a: "نعم، لشخص واحد إلى ثلاثة أشخاص. تكفي 50 Mbps لتشغيل بث بدقة HD وآخر بدقة 4K ومكالمات الفيديو والتصفح في الوقت نفسه. أما المنازل الأكبر التي تشاهد المحتوى على عدة شاشات في آن واحد فستكون أكثر راحة مع 100 Mbps أو أكثر.",
    },
    {
      q: "كم يستغرق تنزيل 1 GB؟",
      a: "نحو 5.5 دقيقة بسرعة 25 Mbps، ونحو 1.5 دقيقة بسرعة 100 Mbps، ونحو 16 ثانية بسرعة 500 Mbps، بشرط أن يواكب الخادم هذه السرعة وألا يستخدم شيء آخر اتصالك.",
    },
  ],
};

const arUpload: ToolPageMessages = {
  meta: {
    title: "اختبار سرعة الرفع: قِس سرعة الرفع بـ Mbps مجانًا",
    description:
      "اختبار سرعة الرفع مجانًا. قِس مدى سرعة إرسال البيانات إلى الإنترنت بوحدة Mbps لمكالمات الفيديو والنسخ الاحتياطي والبث المباشر ومشاركة الملفات بدقة وفورًا.",
    keywords: [
      "اختبار سرعة الرفع",
      "سرعة الرفع",
      "قياس سرعة الرفع",
      "سرعة الأبلود",
      "سرعة رفع الإنترنت",
      "فحص سرعة الرفع",
      "اختبار الرفع Mbps",
    ],
  },
  badge: "اختبار مجاني لسرعة الرفع",
  titleLead: "اختبار",
  titleHighlight: "سرعة الرفع",
  intro:
    "قِس سرعة الرفع الفعلية لديك بالميغابت في الثانية (Mbps). ابدأ الاختبار لترى مدى سرعة إرسالك للبيانات إلى الإنترنت لمكالمات الفيديو والنسخ الاحتياطي السحابي والبث المباشر ومشاركة الملفات.",
  sectionsHeading: "عن سرعة الرفع",
  sectionsIntro: "لماذا تهم سرعة الرفع، وما السرعة الجيدة، ولماذا تكون غالبًا أقل من سرعة التحميل.",
  sections: [
    {
      title: "ما هي سرعة الرفع؟",
      text: "سرعة الرفع هي مدى سرعة إرسال اتصالك للبيانات إلى الإنترنت، وتُقاس بوحدة Mbps. وهي مهمة لمكالمات الفيديو ونشر المحتوى والنسخ الاحتياطي عبر الإنترنت والبث المباشر.",
    },
    {
      title: "ما هي سرعة الرفع الجيدة؟",
      text: "تكفي 3–5 Mbps لمكالمات الفيديو، و10 Mbps مريحة لمعظم عمليات الرفع، بينما تناسب 20 Mbps أو أكثر صنّاع المحتوى والبث المباشر والنسخ الاحتياطي السحابي الكبير.",
    },
    {
      title: "كيف نقيسها",
      text: "نرسل البيانات عبر عدة اتصالات متوازية إلى خادم قريب على شبكة عالمية لبضع ثوانٍ، ثم نحسب سرعة الرفع الفعلية لديك بوحدة Mbps.",
    },
    {
      title: "لماذا الرفع أبطأ من التحميل",
      text: "معظم باقات الكابل وDSL غير متماثلة، إذ تمنحك سرعة تحميل أعلى بكثير من سرعة الرفع لأن الناس ينزّلون أكثر مما يرسلون. أما اتصالات الألياف الضوئية فعادةً ما تكون أكثر توازنًا.",
    },
  ],
  table: {
    title: "سرعة الرفع التي تحتاجها حسب الاستخدام",
    intro: "سرعات الرفع المعتادة اللازمة للمهام الشائعة. ينبغي لمن يعملون عن بُعد وصنّاع المحتوى استهداف الحد الأعلى.",
    head: ["الاستخدام", "سرعة الرفع"],
    rows: [
      ["البريد الإلكتروني والمراسلة ومنشورات التواصل", "1 Mbps"],
      ["مكالمات الفيديو بدقة HD (Zoom وTeams وMeet)", "3–4 Mbps"],
      ["المكالمات الجماعية ومشاركة الشاشة", "5–10 Mbps"],
      ["البث المباشر بدقة 1080p", "6–10 Mbps"],
      ["البث المباشر بدقة 4K", "20–40 Mbps"],
      ["النسخ الاحتياطي السحابي الكبير ورفع الفيديوهات", "50+ Mbps"],
    ],
  },
  guide: {
    title: "فهم نتيجة سرعة الرفع",
    paragraphs: [
      "تحظى سرعة الرفع باهتمام أقل من سرعة التحميل، لكنها تحدد كيف تبدو صورتك وصوتك في مكالمات الفيديو، ومدى سرعة مزامنة صورك مع السحابة، وما إذا كان البث المباشر سيبقى واضحًا. وعندما يجري عدة أشخاص في المنزل نفسه مكالمات في آن واحد، غالبًا ما تكون سرعة الرفع أول ما ينفد.",
      "تقدم كثير من باقات الكابل وDSL سرعة تحميل أعلى بعشر مرات من سرعة الرفع، لذا فإن انخفاض سرعة الرفع لا يعني بالضرورة وجود عطل. تحقق من سرعة الرفع المذكورة في عقدك: فإذا كانت نتيجتك عبر الاتصال السلكي قريبة منها، فخطك يعمل كما هو متفق عليه. أما باقات الألياف الضوئية فعادةً ما تكون متماثلة، بسرعة رفع مساوية لسرعة التحميل.",
      "إذا كانت سرعة الرفع أقل بكثير من سرعة باقتك، فابحث عن أجهزة تنسخ الصور أو الفيديوهات احتياطيًا في الخلفية، أو شبكة واي فاي مثقلة، أو راوتر قديم. إن إجراء الاختبار بكابل ودون تشغيل أي شيء آخر هو أسرع طريقة لمعرفة السبب.",
    ],
  },
  tips: {
    title: "كيف تحسّن سرعة الرفع",
    items: [
      "استخدم اتصال إيثرنت سلكيًا للمكالمات والبث.",
      "أوقف النسخ الاحتياطي السحابي ومزامنة الصور مؤقتًا أثناء العمل.",
      "خفّض جودة الفيديو في المكالمات أو البث الأخرى داخل منزلك.",
      "أعد تشغيل الراوتر وحدّث برنامجه الثابت.",
      "اسأل مزود الخدمة عن باقات بسرعة رفع أعلى، أو انتقل إلى الألياف الضوئية.",
    ],
  },
  faqHeading: "أسئلة شائعة حول سرعة الرفع",
  faqs: [
    {
      q: "كيف أختبر سرعة الرفع لدي؟",
      a: "اضغط على زر «ابدأ» في الأعلى. يقيس الاختبار سرعة الرفع لديك بوحدة Mbps خلال ثوانٍ.",
    },
    {
      q: "ما هي سرعة الرفع الجيدة؟",
      a: "تكفي 5–10 Mbps لمعظم المستخدمين ولمكالمات الفيديو. ويستفيد أصحاب البث المباشر وصنّاع المحتوى ومن يجرون نسخًا احتياطية سحابية كبيرة من 20 Mbps أو أكثر.",
    },
    {
      q: "لماذا سرعة الرفع لدي منخفضة جدًا؟",
      a: "كثير من باقات الإنترنت غير متماثلة، وتمنح عمدًا سرعة رفع أقل بكثير من سرعة التحميل. وقد يخفضها الواي فاي والأجهزة القديمة والازدحام أكثر من ذلك. وعادةً ما توفر باقات الألياف الضوئية سرعات رفع أعلى.",
    },
    {
      q: "ما سرعة الرفع التي أحتاجها للعمل من المنزل؟",
      a: "للبريد الإلكتروني ومكالمات الفيديو العرضية، تكفي 5 Mbps. أما إذا كنت تقضي معظم اليوم في مكالمات الفيديو أو تشارك شاشتك أو ترسل ملفات كبيرة، فاستهدف 10–20 Mbps لكل شخص يعمل من المنزل.",
    },
    {
      q: "ما سرعة الرفع التي أحتاجها للبث على Twitch أو YouTube؟",
      a: "توصي منصات البث بنحو 3–6 Mbps لدقة 720p و6–10 Mbps لدقة 1080p بمعدل 60 إطارًا في الثانية. احتفظ بهامش يقارب 30% فوق معدل بت البث لديك ليبقى البث مستقرًا.",
    },
  ],
};

const arPing: ToolPageMessages = {
  meta: {
    title: "اختبار البينج: قِس زمن الاستجابة والتذبذب مجانًا",
    description:
      "اختبار البينج وزمن الاستجابة مجانًا. قِس زمن استجابة اتصالك (Ping) والتذبذب (Jitter) بالمللي ثانية، وهو أمر أساسي للألعاب الأونلاين ومكالمات الفيديو والبث.",
    keywords: [
      "اختبار البينج",
      "زمن الاستجابة",
      "قياس البنق",
      "اختبار ping",
      "اختبار زمن الاستجابة",
      "قياس التأخير في الإنترنت",
      "اختبار الجيتر",
    ],
  },
  badge: "اختبار مجاني للبينج وزمن الاستجابة",
  titleLead: "اختبار",
  titleHighlight: "البينج وزمن الاستجابة",
  intro:
    "قِس البينج والتذبذب (Jitter) في اتصالك بالمللي ثانية (ms). ابدأ الاختبار للتحقق من زمن الاستجابة، وهو العامل الأهم في الألعاب الأونلاين ومكالمات الفيديو والبث المباشر.",
  sectionsHeading: "عن البينج وزمن الاستجابة والتذبذب",
  sectionsIntro: "الرقمان اللذان يحددان مدى سرعة استجابة اتصالك.",
  sections: [
    {
      title: "ما هو البينج / زمن الاستجابة؟",
      text: "البينج (زمن الاستجابة) هو الوقت الذي تستغرقه البيانات للانتقال من جهازك إلى خادم والعودة، ويُقاس بالمللي ثانية. وكلما انخفض كان أفضل، إذ يجعل كل شيء يستجيب بسرعة أكبر.",
    },
    {
      title: "ما هو التذبذب (Jitter)؟",
      text: "التذبذب هو تفاوت قيمة البينج بمرور الوقت. ويسبب التذبذب المرتفع قفزات مفاجئة في التأخير (لاغ)، وتقطعًا في مكالمات الفيديو، وارتدادًا في حركة الألعاب، حتى عندما تبدو سرعتك جيدة.",
    },
    {
      title: "ما هو البينج الجيد؟",
      text: "أقل من 20 ms ممتاز، و20–50 ms جيد للألعاب، و50–100 ms مناسب للتصفح، أما ما يزيد على 150 ms فقد يسبب تأخيرًا ملحوظًا في التطبيقات الفورية.",
    },
    {
      title: "كيف تخفض البينج",
      text: "استخدم اتصال إيثرنت سلكيًا، وأغلق التطبيقات التي تستهلك نطاقًا تردديًا كبيرًا، واختر خوادم ألعاب قريبة، وتجنب تداخل الواي فاي. فالاتصال السلكي يخفض زمن الاستجابة والتذبذب في جميع الحالات تقريبًا.",
    },
  ],
  table: {
    title: "شرح نطاقات البينج",
    intro: "كيف تنعكس قيم البينج المختلفة على الاستخدام الفعلي. ويُفضل أن يبقى التذبذب أقل من 30 ms.",
    head: ["البينج", "ما الذي تتوقعه"],
    rows: [
      ["0–20 ms", "ممتاز: مثالي للألعاب التنافسية"],
      ["20–50 ms", "جيد جدًا: ألعاب ومكالمات سلسة"],
      ["50–100 ms", "جيد: مناسب للتصفح والبث والألعاب العادية"],
      ["100–150 ms", "مقبول: تأخير ملحوظ في الألعاب والمكالمات"],
      ["150+ ms", "ضعيف: تأخير (لاغ) في التطبيقات الفورية"],
    ],
  },
  guide: {
    title: "لماذا البينج أهم من السرعة في الألعاب",
    paragraphs: [
      "تتبادل الألعاب الأونلاين ومكالمات الفيديو كميات صغيرة من البيانات باستمرار. فهي تحتاج إلى نطاق ترددي ضئيل جدًا لكنها تحتاجه بسرعة، ولهذا غالبًا ما يبدو اتصال بسرعة 50 Mbps وبينج 15 ms أفضل من اتصال بسرعة 500 Mbps وبينج 120 ms.",
      "يعتمد البينج أساسًا على المسافة والمسار الذي تسلكه بياناتك. فالألياف الضوئية والكابل يقدمان عادةً أقل زمن استجابة، بينما يكون في شبكات 4G و5G أعلى وأكثر تقلبًا، وقد تضيف اتصالات الأقمار الصناعية تأخيرًا كبيرًا. أما الواي فاي فيضيف بضع مللي ثوانٍ، والأهم من ذلك أنه يضيف تذبذبًا.",
      "يرسل اختبارنا سلسلة من الطلبات الصغيرة إلى خادم قريب، ويعرض أسرع استجابة على أنها البينج ومتوسط التفاوت على أنه التذبذب. وسيُظهر خادم ألعاب بعيد عنك بينج أعلى من هذا الاختبار، لأن البيانات تقطع مسافة أطول.",
    ],
  },
  tips: {
    title: "كيف تقلل البينج والتذبذب",
    items: [
      "وصّل جهاز الألعاب أو الحاسوب بالراوتر بكابل إيثرنت.",
      "أوقف التنزيلات والرفع الكبيرين وبث 4K أثناء اللعب.",
      "اختر خوادم ألعاب في منطقتك.",
      "فعّل خاصية QoS أو وضع الألعاب في الراوتر إن وُجدت.",
      "أعد تشغيل الراوتر، واستبدله إذا كان عمره عدة سنوات.",
      "أوقف الـ VPN ما لم يوجّهك إلى خادم أقرب.",
    ],
  },
  faqHeading: "أسئلة شائعة حول البينج وزمن الاستجابة",
  faqs: [
    {
      q: "كيف أختبر البينج لدي؟",
      a: "اضغط على زر «ابدأ» في الأعلى. يقيس الاختبار البينج والتذبذب لديك بالمللي ثانية خلال ثوانٍ.",
    },
    {
      q: "ما هو البينج الجيد للألعاب؟",
      a: "أقل من 20 ms ممتاز، و20–50 ms جيد للألعاب الأونلاين. وفوق 100 ms قد تلاحظ تأخيرًا (لاغ)، وفوق 150 ms تصبح الألعاب السريعة بطيئة الاستجابة.",
    },
    {
      q: "ما أسباب ارتفاع البينج والتذبذب؟",
      a: "يرفع كلٌّ من تداخل الواي فاي، وبُعد المسافة عن الخادم، وازدحام الشبكة، والراوترات القديمة، والتنزيلات في الخلفية قيمَ البينج والتذبذب. ويُعد الاتصال السلكي الحل الأكثر فعالية.",
    },
    {
      q: "هل البينج هو نفسه زمن الاستجابة؟",
      a: "في الاستخدام اليومي، نعم. زمن الاستجابة هو التأخير الذي تستغرقه البيانات لعبور الشبكة، والبينج هو الأداة والقياس المستخدمان للتحقق منه، وعادةً ما يُقاس ذهابًا وإيابًا بالمللي ثانية.",
    },
    {
      q: "هل تخفض باقة إنترنت أسرع البينج لدي؟",
      a: "ليس بالضرورة. يساعد النطاق الترددي الأكبر عندما يكون خطك مزدحمًا، لكن البينج يتحدد أساسًا بنوع الاتصال والمسافة إلى الخادم وشبكتك المنزلية. وغالبًا ما يفيد الانتقال من الواي فاي إلى الكابل أكثر من ترقية الباقة.",
    },
  ],
};

const arWifi: ToolPageMessages = {
  meta: {
    title: "اختبار سرعة الواي فاي: قِس سرعة شبكتك اللاسلكية مجانًا",
    description:
      "اختبار سرعة الواي فاي مجانًا. افحص سرعة التحميل والرفع والبينج لشبكتك اللاسلكية على أي جهاز وفي أي غرفة، واكتشف المناطق الميتة وهل الواي فاي لديك سريع بما يكفي.",
    keywords: [
      "اختبار سرعة الواي فاي",
      "قياس سرعة الواي فاي",
      "سرعة الوايفاي",
      "فحص سرعة الواي فاي",
      "اختبار الشبكة اللاسلكية",
      "قياس سرعة النت واي فاي",
      "اختبار wifi",
    ],
  },
  badge: "اختبار مجاني لسرعة الواي فاي",
  titleLead: "اختبار",
  titleHighlight: "سرعة الواي فاي",
  intro:
    "اختبر سرعة الإنترنت اللاسلكي لديك خلال ثوانٍ. ابدأ الاختبار لقياس سرعة التحميل والرفع والبينج عبر الواي فاي، ثم أعد الاختبار في غرف أخرى لاكتشاف المناطق الميتة وأفضل مكان للراوتر.",
  sectionsHeading: "عن سرعة الواي فاي",
  sectionsIntro: "كيف تختبر شبكتك اللاسلكية بالشكل الصحيح وتحصل منها على سرعة أكبر.",
  sections: [
    {
      title: "كيف تختبر سرعة الواي فاي",
      text: "اتصل بشبكة الواي فاي، واضغط على «ابدأ»، ودوّن النتيجة. ثم كرر الاختبار في غرف مختلفة لمقارنة قوة الإشارة واكتشاف النقاط الضعيفة في منزلك.",
    },
    {
      title: "لماذا الواي فاي لدي أبطأ من سرعة باقتي؟",
      text: "تنخفض سرعة الواي فاي مع المسافة والجدران والتداخل من الأجهزة الأخرى والراوترات القديمة. وغالبًا ما تكون السرعة على جهازك أقل من السرعة التي تصل إلى المودم.",
    },
    {
      title: "الواي فاي مقابل الاتصال السلكي",
      text: "اتصال الإيثرنت السلكي أسرع وأكثر استقرارًا من الواي فاي. فإذا كانت نتيجتك عبر الواي فاي أقل بكثير من نتيجتك عبر الكابل، فإن عنق الزجاجة هو إعداد شبكتك اللاسلكية وليس مزود الخدمة.",
    },
    {
      title: "كيف تحسّن سرعة الواي فاي",
      text: "اقترب من الراوتر، واستخدم نطاق 5 GHz، وقلل التداخل، وحدّث البرنامج الثابت، أو أضف نظام Mesh أو مقوي إشارة للمنازل الكبيرة والمناطق الميتة.",
    },
  ],
  table: {
    title: "نطاقات ومعايير الواي فاي في لمحة",
    intro: "السرعات الفعلية أقل من الحدود القصوى النظرية المطبوعة على العلبة، وتنخفض مع المسافة والجدران.",
    head: ["النطاق أو المعيار", "الأنسب لـ"],
    rows: [
      ["نطاق 2.4 GHz", "مدى أطول واختراق أفضل للجدران، لكنه أبطأ وأكثر ازدحامًا"],
      ["نطاق 5 GHz", "أسرع بكثير على المسافات القصيرة والمتوسطة"],
      ["نطاق 6 GHz (WiFi 6E / 7)", "سريع جدًا وتداخل منخفض، لكنه الأقصر مدى"],
      ["WiFi 5 (802.11ac)", "جيد للباقات حتى بضع مئات من Mbps"],
      ["WiFi 6 / 6E (802.11ax)", "المنازل المزدحمة بالأجهزة وباقات الغيغابت"],
      ["WiFi 7 (802.11be)", "باقات متعددة الغيغابت وأحدث الأجهزة"],
    ],
  },
  guide: {
    title: "كيف تستفيد من الواي فاي إلى أقصى حد",
    paragraphs: [
      "تحدد باقة الإنترنت السرعة القصوى التي تصل إلى منزلك، لكن الواي فاي هو الذي يحدد مقدار ما يصل منها إلى كل جهاز. فالجدران والأرضيات والمرايا وأحواض الأسماك وحتى أفران الميكروويف تُضعف الإشارة، وكل متر إضافي بعيدًا عن الراوتر يكلّفك من السرعة.",
      "أجرِ هذا الاختبار أولًا بجوار الراوتر، ثم في الغرف التي تستخدم فيها الإنترنت أكثر من غيرها. وإذا انخفضت السرعة بشدة في بعض الغرف، فانقل الراوتر إلى مكان مركزي ومرتفع ومكشوف، أو أضف نظام Mesh لتحصل كل غرفة على إشارة قوية.",
      "قد لا تدعم الهواتف والحواسيب المحمولة القديمة إلا معايير واي فاي قديمة، فلا تستطيع بلوغ سرعات الراوتر الحديث. وإذا كان أحد الأجهزة أبطأ بكثير من غيره في المكان نفسه، فالجهاز هو ما يحد من السرعة وليس اتصالك.",
    ],
  },
  tips: {
    title: "حلول سريعة لبطء الواي فاي",
    items: [
      "ضع الراوتر في مكان مركزي ومكشوف ومرتفع.",
      "اتصل بشبكة 5 GHz أو 6 GHz عندما تكون قريبًا من الراوتر.",
      "غيّر قناة الواي فاي إذا كانت هناك شبكات كثيرة للجيران بالقرب منك.",
      "حدّث البرنامج الثابت للراوتر وأعد تشغيله من حين لآخر.",
      "استخدم نظام Mesh أو نقطة وصول سلكية في المنازل الكبيرة.",
      "وصّل أجهزة التلفاز وأجهزة الألعاب والحواسيب المكتبية بكابل كلما أمكن.",
    ],
  },
  faqHeading: "أسئلة شائعة حول سرعة الواي فاي",
  faqs: [
    {
      q: "كيف أختبر سرعة الواي فاي لدي؟",
      a: "وصّل جهازك بشبكة الواي فاي واضغط على زر «ابدأ» في الأعلى. يقيس الاختبار سرعة التحميل والرفع والبينج عبر الشبكة اللاسلكية. كرره في غرف مختلفة لرسم خريطة لتغطية الشبكة.",
    },
    {
      q: "ما هي سرعة الواي فاي الجيدة؟",
      a: "يعتمد ذلك على باقتك، لكن 25–100 Mbps عبر الواي فاي سرعة جيدة لمعظم المنازل. وإذا كانت نتيجتك عبر الواي فاي أقل بكثير من سرعة باقتك أو من سرعتك عبر الكابل، فإن إعداد شبكتك اللاسلكية هو عنق الزجاجة.",
    },
    {
      q: "كيف أجعل الواي فاي لدي أسرع؟",
      a: "اقترب من الراوتر، وانتقل إلى نطاق 5 GHz، وقلل التداخل من الأجهزة الأخرى، وحدّث البرنامج الثابت للراوتر، أو أضف شبكة Mesh أو مقوي إشارة لتغطية المناطق الميتة.",
    },
    {
      q: "لماذا يكون الواي فاي سريعًا على جهاز وبطيئًا على آخر؟",
      a: "تدعم الأجهزة معايير واي فاي وهوائيات مختلفة. وقد يقتصر هاتف أو حاسوب محمول قديم على سرعات أقل بكثير من جهاز حديث، حتى في المكان نفسه. كما قد تؤدي التطبيقات العاملة في الخلفية وأوضاع توفير البطارية إلى إبطاء جهاز بعينه.",
    },
    {
      q: "أيهما أفضل: 2.4 GHz أم 5 GHz؟",
      a: "نطاق 5 GHz أسرع وأقل ازدحامًا، ما يجعله الخيار الأفضل في الغرفة نفسها أو بالقرب من الراوتر. أما نطاق 2.4 GHz فيصل إلى مسافة أبعد ويخترق الجدران بسهولة أكبر، لذا قد يكون أكثر موثوقية بعيدًا عن الراوتر.",
    },
  ],
};

const ar: ToolsMessages = {
  ui: {
    highlights: ["نتائج دقيقة وفورية", "دون الحاجة إلى تطبيق", "يعمل على جميع الأجهزة"],
    learnKicker: "تعرّف",
    tipsKicker: "نصائح",
    faqKicker: "الأسئلة الشائعة",
    fullTest: "أجرِ اختبار سرعة الإنترنت الكامل",
    guideLink: "ما هي سرعة الإنترنت الجيدة؟",
    otherTitle: "المزيد من الأدوات المجانية",
    otherIntro: "اختبر جانبًا آخر من اتصالك أو تحقق من عنوان IP الخاص بك.",
    open: "افتح الأداة",
  },
  directory: {
    full: { title: "اختبار سرعة الإنترنت", text: "التحميل والرفع والبينج والتذبذب في اختبار واحد." },
    download: { title: "اختبار سرعة التحميل", text: "مدى سرعة استقبالك للبيانات، بوحدة Mbps." },
    upload: { title: "اختبار سرعة الرفع", text: "مدى سرعة إرسالك للبيانات للمكالمات والنسخ الاحتياطي." },
    ping: { title: "اختبار البينج وزمن الاستجابة", text: "زمن الاستجابة والتذبذب، بالمللي ثانية." },
    wifi: { title: "اختبار سرعة الواي فاي", text: "افحص السرعة اللاسلكية غرفةً تلو الأخرى." },
    myIp: { title: "ما هو عنوان IP الخاص بي", text: "عنوان IP العام ومزود الخدمة والموقع." },
    ipRisk: { title: "درجة خطورة IP", text: "تحقق مما إذا كان عنوان IP شبكة VPN أو بروكسي أو مُبلّغًا عنه." },
  },
  pages: { download: arDownload, upload: arUpload, ping: arPing, wifi: arWifi },
};

// ---------------------------------------------------------------------------
// Русский
// ---------------------------------------------------------------------------

const ruDownload: ToolPageMessages = {
  meta: {
    title: "Тест скорости загрузки: проверить скорость скачивания",
    description:
      "Бесплатный тест скорости загрузки. Узнайте, с какой скоростью вы скачиваете данные из интернета, в Мбит/с, на любом устройстве за секунды. Без приложений.",
    keywords: [
      "тест скорости загрузки",
      "скорость скачивания",
      "проверить скорость загрузки",
      "скорость загрузки интернета",
      "измерить скорость скачивания",
      "тест скорости интернета",
      "входящая скорость Мбит/с",
    ],
  },
  badge: "Бесплатный тест загрузки",
  titleLead: "Тест скорости",
  titleHighlight: "загрузки",
  intro:
    "Измерьте реальную скорость загрузки в мегабитах в секунду (Мбит/с). Запустите тест, чтобы узнать, как быстро вы получаете данные из интернета для видео, сёрфинга, онлайн-игр и скачивания файлов.",
  sectionsHeading: "О скорости загрузки",
  sectionsIntro: "Что такое скорость загрузки, какая скорость считается хорошей и как мы её измеряем.",
  sections: [
    {
      title: "Что такое скорость загрузки?",
      text: "Скорость загрузки — это то, насколько быстро ваше подключение получает данные из интернета, в Мбит/с. От неё зависят качество видео, открытие страниц, скачивание файлов и видеозвонки.",
    },
    {
      title: "Какая скорость загрузки считается хорошей?",
      text: "5–10 Мбит/с достаточно для сёрфинга, 25 Мбит/с — для видео в HD, а 100 Мбит/с и выше идеально подходят для 4K, игр и семей с большим количеством устройств.",
    },
    {
      title: "Как мы её измеряем",
      text: "Мы открываем несколько параллельных соединений с ближайшим сервером глобальной сети, передаём данные в течение нескольких секунд и рассчитываем вашу реальную скорость загрузки в Мбит/с.",
    },
    {
      title: "Советы для точного теста",
      text: "По возможности проверяйте скорость по кабелю, приостановите другие загрузки и видео и не закрывайте эту вкладку во время теста — так результат будет самым надёжным.",
    },
  ],
  table: {
    title: "Какая скорость загрузки нужна для разных задач",
    intro: "Типичная скорость загрузки, необходимая одному устройству. Сложите значения для всего, что работает у вас дома одновременно.",
    head: ["Задача", "Скорость загрузки"],
    rows: [
      ["Почта, веб-сёрфинг, соцсети", "1–5 Мбит/с"],
      ["Стриминг музыки", "1–2 Мбит/с"],
      ["Видеозвонки в HD", "2–4 Мбит/с"],
      ["Видео в HD (1080p)", "5–8 Мбит/с"],
      ["Видео в 4K (Ultra HD)", "15–25 Мбит/с"],
      ["Скачивание больших игр и файлов", "100+ Мбит/с"],
    ],
  },
  guide: {
    title: "Как понять результат теста загрузки",
    paragraphs: [
      "Скорость загрузки — это цифра, которую указывают в большинстве тарифов, и именно она определяет бо́льшую часть ваших впечатлений от интернета. Каждая веб-страница, видео, песня и обновление приложения приходят к вам во входящем направлении, поэтому чем выше скорость загрузки, тем меньше ожидания и лучше качество видео.",
      "Ваш результат — это скорость, измеренная на вашем устройстве в данный момент. Она может быть ниже тарифной из-за слабого сигнала Wi-Fi, других устройств в сети, устаревшего роутера или компьютера, VPN или перегрузки сети в вечерние часы пик. Если при подключении по кабелю результат постоянно ниже 80% от тарифа, стоит сообщить об этом провайдеру.",
      "Чтобы оценить время скачивания, помните: скорость указывается в мегабитах, а размер файлов — в мегабайтах. Разделите скорость на восемь: 200 Мбит/с — это около 25 МБ/с, поэтому игра объёмом 5 ГБ скачается примерно за три с половиной минуты в идеальных условиях.",
    ],
  },
  tips: {
    title: "Как увеличить скорость загрузки",
    items: [
      "Подключитесь по кабелю Ethernet или подойдите ближе к роутеру.",
      "Используйте диапазон Wi-Fi 5 ГГц или 6 ГГц вместо 2,4 ГГц.",
      "Приостановите облачную синхронизацию, обновления игр и видео на других устройствах.",
      "Перезагрузите роутер и модем и регулярно обновляйте их прошивку.",
      "Отключите VPN, чтобы увидеть реальную скорость провайдера.",
      "Перейдите на более быстрый тариф, если вашей семье регулярно не хватает скорости.",
    ],
  },
  faqHeading: "Частые вопросы о скорости загрузки",
  faqs: [
    {
      q: "Как проверить скорость загрузки?",
      a: "Просто нажмите кнопку «Старт» выше. Тест за несколько секунд измерит скорость загрузки в Мбит/с. Для максимально точного результата закройте другие приложения и подключитесь по кабелю.",
    },
    {
      q: "Почему скорость загрузки ниже, чем по тарифу?",
      a: "Измеренную скорость загрузки могут снижать помехи Wi-Fi, удалённость от роутера, старое оборудование, VPN, фоновые загрузки и перегрузка сети в часы пик. Для самого точного результата проверяйте скорость по кабелю.",
    },
    {
      q: "Какая скорость загрузки считается хорошей?",
      a: "Для большинства домов хорошая скорость — 25–100 Мбит/с. Активным пользователям, для видео в 4K и игр пригодятся 100–500 Мбит/с, а для простого сёрфинга хватит 5–10 Мбит/с.",
    },
    {
      q: "50 Мбит/с — это хорошая скорость загрузки?",
      a: "Да, для одного–трёх человек. 50 Мбит/с позволяют одновременно смотреть видео в HD и в 4K, общаться по видеосвязи и сидеть в интернете. Большим семьям, которые смотрят видео сразу на нескольких экранах, будет комфортнее со 100 Мбит/с и выше.",
    },
    {
      q: "Сколько времени скачивается 1 ГБ?",
      a: "При 25 Мбит/с — около 5,5 минуты, при 100 Мбит/с — около 1,5 минуты, а при 500 Мбит/с — около 16 секунд, если сервер успевает отдавать данные и подключение больше ничем не занято.",
    },
  ],
};

const ruUpload: ToolPageMessages = {
  meta: {
    title: "Тест скорости выгрузки: проверить скорость отдачи",
    description:
      "Бесплатный тест скорости отдачи. Узнайте, как быстро вы отправляете данные в интернет, в Мбит/с — для видеозвонков, бэкапов, стримов и обмена файлами.",
    keywords: [
      "тест скорости выгрузки",
      "скорость отдачи",
      "исходящая скорость",
      "проверить скорость отдачи",
      "скорость выгрузки интернета",
      "upload тест",
      "измерить скорость отдачи Мбит/с",
    ],
  },
  badge: "Бесплатный тест отдачи",
  titleLead: "Тест скорости",
  titleHighlight: "отдачи",
  intro:
    "Измерьте реальную скорость отдачи в мегабитах в секунду (Мбит/с). Запустите тест, чтобы узнать, как быстро вы отправляете данные в интернет для видеозвонков, облачных бэкапов, прямых трансляций и обмена файлами.",
  sectionsHeading: "О скорости отдачи",
  sectionsIntro: "Почему важна скорость отдачи, какая скорость считается хорошей и почему она обычно ниже скорости загрузки.",
  sections: [
    {
      title: "Что такое скорость отдачи?",
      text: "Скорость отдачи (выгрузки) — это то, насколько быстро ваше подключение отправляет данные в интернет, в Мбит/с. Она важна для видеозвонков, публикации контента, онлайн-бэкапов и прямых трансляций.",
    },
    {
      title: "Какая скорость отдачи считается хорошей?",
      text: "3–5 Мбит/с хватает для видеозвонков, 10 Мбит/с комфортно для большинства задач, а 20 Мбит/с и выше подойдут авторам контента, стримерам и для больших облачных бэкапов.",
    },
    {
      title: "Как мы её измеряем",
      text: "В течение нескольких секунд мы отправляем данные по нескольким параллельным соединениям на ближайший сервер глобальной сети и рассчитываем вашу реальную скорость отдачи в Мбит/с.",
    },
    {
      title: "Почему отдача медленнее загрузки",
      text: "Большинство кабельных и DSL-тарифов асимметричны: скорость загрузки в них намного выше скорости отдачи, ведь люди скачивают больше, чем отправляют. Оптоволоконные подключения обычно более сбалансированы.",
    },
  ],
  table: {
    title: "Какая скорость отдачи нужна для разных задач",
    intro: "Типичная скорость отдачи для распространённых задач. Тем, кто работает удалённо или создаёт контент, стоит ориентироваться на верхнюю границу.",
    head: ["Задача", "Скорость отдачи"],
    rows: [
      ["Почта, мессенджеры, публикации в соцсетях", "1 Мбит/с"],
      ["Видеозвонки в HD (Zoom, Teams, Meet)", "3–4 Мбит/с"],
      ["Групповые звонки и демонстрация экрана", "5–10 Мбит/с"],
      ["Прямые трансляции в 1080p", "6–10 Мбит/с"],
      ["Прямые трансляции в 4K", "20–40 Мбит/с"],
      ["Большие облачные бэкапы и загрузка видео", "50+ Мбит/с"],
    ],
  },
  guide: {
    title: "Как понять результат теста отдачи",
    paragraphs: [
      "Скорости отдачи уделяют меньше внимания, чем скорости загрузки, но именно она определяет, как вас видно и слышно в видеозвонках, как быстро фото синхронизируются с облаком и остаётся ли трансляция чёткой. Когда несколько человек в одном доме одновременно на созвонах, первой обычно заканчивается именно отдача.",
      "Многие кабельные и DSL-тарифы дают скорость загрузки в десять раз выше скорости отдачи, поэтому низкая отдача — не обязательно неисправность. Проверьте скорость отдачи, указанную в договоре: если результат по кабелю близок к ней, линия работает как заявлено. Оптоволоконные тарифы обычно симметричны — с одинаковой скоростью отдачи и загрузки.",
      "Если отдача намного ниже тарифной, поищите устройства, которые в фоне загружают фото или видео в облако, перегруженную сеть Wi-Fi или старый роутер. Быстрее всего найти причину помогает тест по кабелю, когда больше ничего не запущено.",
    ],
  },
  tips: {
    title: "Как увеличить скорость отдачи",
    items: [
      "Используйте проводное подключение Ethernet для звонков и трансляций.",
      "Приостанавливайте облачные бэкапы и синхронизацию фото во время работы.",
      "Снизьте качество видео в других звонках и трансляциях у вас дома.",
      "Перезагрузите роутер и обновите его прошивку.",
      "Спросите провайдера о тарифах с более высокой отдачей или перейдите на оптоволокно.",
    ],
  },
  faqHeading: "Частые вопросы о скорости отдачи",
  faqs: [
    {
      q: "Как проверить скорость отдачи?",
      a: "Нажмите кнопку «Старт» выше. Тест за несколько секунд измерит скорость отдачи в Мбит/с.",
    },
    {
      q: "Какая скорость отдачи считается хорошей?",
      a: "Большинству пользователей и для видеозвонков хватает 5–10 Мбит/с. Стримерам, авторам контента и тем, кто делает большие облачные бэкапы, пригодятся 20 Мбит/с и выше.",
    },
    {
      q: "Почему у меня такая низкая скорость отдачи?",
      a: "Многие интернет-тарифы асимметричны и намеренно дают гораздо меньшую скорость отдачи, чем загрузки. Wi-Fi, старое оборудование и перегрузка сети могут снижать её ещё сильнее. Оптоволоконные тарифы обычно предлагают более высокую отдачу.",
    },
    {
      q: "Какая скорость отдачи нужна для удалённой работы?",
      a: "Для почты и редких видеозвонков хватит 5 Мбит/с. Если вы почти весь день на видеосвязи, демонстрируете экран или отправляете большие файлы, ориентируйтесь на 10–20 Мбит/с на каждого, кто работает из дома.",
    },
    {
      q: "Какая скорость отдачи нужна для стримов на Twitch или YouTube?",
      a: "Стриминговые платформы рекомендуют примерно 3–6 Мбит/с для 720p и 6–10 Мбит/с для 1080p при 60 кадрах в секунду. Оставляйте запас около 30% сверх битрейта трансляции, чтобы она шла стабильно.",
    },
  ],
};

const ruPing: ToolPageMessages = {
  meta: {
    title: "Пинг тест: проверить пинг, задержку и джиттер онлайн",
    description:
      "Бесплатный пинг тест. Проверьте задержку (пинг) и джиттер вашего подключения в миллисекундах — это важно для онлайн-игр, видеозвонков и прямых трансляций.",
    keywords: [
      "пинг тест",
      "проверить пинг",
      "тест задержки",
      "задержка интернета",
      "проверка пинга онлайн",
      "тест джиттера",
      "пинг и задержка",
    ],
  },
  badge: "Бесплатный тест пинга и задержки",
  titleLead: "Тест",
  titleHighlight: "пинга и задержки",
  intro:
    "Измерьте пинг и джиттер вашего подключения в миллисекундах (мс). Запустите тест, чтобы проверить задержку — время отклика, которое важнее всего для онлайн-игр, видеозвонков и прямых трансляций.",
  sectionsHeading: "О пинге, задержке и джиттере",
  sectionsIntro: "Два показателя, от которых зависит, насколько отзывчивым ощущается ваше подключение.",
  sections: [
    {
      title: "Что такое пинг / задержка?",
      text: "Пинг (задержка) — это время, за которое данные доходят от вашего устройства до сервера и обратно, в миллисекундах. Чем он ниже, тем лучше: всё откликается быстрее.",
    },
    {
      title: "Что такое джиттер?",
      text: "Джиттер — это колебания пинга во времени. Высокий джиттер вызывает скачки лагов, подтормаживания в видеозвонках и «телепорты» в играх, даже если скорость выглядит нормальной.",
    },
    {
      title: "Какой пинг считается хорошим?",
      text: "Менее 20 мс — отлично, 20–50 мс — хорошо для игр, 50–100 мс — нормально для сёрфинга, а свыше 150 мс приложения реального времени могут заметно тормозить.",
    },
    {
      title: "Как снизить пинг",
      text: "Используйте проводное подключение Ethernet, закройте приложения, которые расходуют много трафика, выбирайте ближайшие игровые серверы и избегайте помех Wi-Fi. Кабель почти всегда снижает задержку и джиттер.",
    },
  ],
  table: {
    title: "Значения пинга: что они означают",
    intro: "Как разные значения пинга ощущаются на практике. В идеале джиттер должен оставаться ниже 30 мс.",
    head: ["Пинг", "Чего ожидать"],
    rows: [
      ["0–20 мс", "Отлично: идеально для соревновательных игр"],
      ["20–50 мс", "Очень хорошо: плавные игры и звонки"],
      ["50–100 мс", "Хорошо: подходит для сёрфинга, видео и казуальных игр"],
      ["100–150 мс", "Удовлетворительно: заметная задержка в играх и звонках"],
      ["150+ мс", "Плохо: лаги в приложениях реального времени"],
    ],
  },
  guide: {
    title: "Почему для игр пинг важнее скорости",
    paragraphs: [
      "Онлайн-игры и видеозвонки постоянно обмениваются небольшими порциями данных. Им нужно совсем немного трафика, но доставлять его нужно быстро, поэтому подключение на 50 Мбит/с с пингом 15 мс часто ощущается лучше, чем 500 Мбит/с с пингом 120 мс.",
      "Пинг зависит прежде всего от расстояния и маршрута, по которому идут данные. Оптоволокно и кабель обычно дают самую низкую задержку, у 4G и 5G она выше и менее стабильна, а спутниковый интернет может добавлять значительную задержку. Wi-Fi добавляет несколько миллисекунд и, что важнее, джиттер.",
      "Наш тест отправляет серию небольших запросов на ближайший сервер и показывает самый быстрый ответ как пинг, а среднее отклонение — как джиттер. Далёкий игровой сервер покажет пинг выше, чем этот тест, потому что данным приходится проходить больший путь.",
    ],
  },
  tips: {
    title: "Как снизить пинг и джиттер",
    items: [
      "Подключите консоль или ПК к роутеру кабелем Ethernet.",
      "Останавливайте большие загрузки, выгрузки и видео в 4K во время игры.",
      "Выбирайте игровые серверы в своём регионе.",
      "Включите QoS или игровой режим на роутере, если он есть.",
      "Перезагрузите роутер, а если ему уже несколько лет — замените его.",
      "Отключите VPN, если только он не направляет вас на более близкий сервер.",
    ],
  },
  faqHeading: "Частые вопросы о пинге и задержке",
  faqs: [
    {
      q: "Как проверить пинг?",
      a: "Нажмите кнопку «Старт» выше. Тест за несколько секунд измерит пинг и джиттер в миллисекундах.",
    },
    {
      q: "Какой пинг хороший для игр?",
      a: "Менее 20 мс — отлично, 20–50 мс — хорошо для онлайн-игр. При пинге выше 100 мс могут появиться лаги, а выше 150 мс динамичные игры начинают заметно запаздывать.",
    },
    {
      q: "Что вызывает высокий пинг и джиттер?",
      a: "Пинг и джиттер повышают помехи Wi-Fi, большое расстояние до сервера, перегрузка сети, старые роутеры и фоновые загрузки. Самое эффективное решение — проводное подключение.",
    },
    {
      q: "Пинг и задержка — это одно и то же?",
      a: "В повседневной речи — да. Задержка — это время, за которое данные проходят по сети, а пинг — инструмент и измерение, которыми её проверяют, обычно как время туда и обратно в миллисекундах.",
    },
    {
      q: "Снизит ли пинг более быстрый тариф?",
      a: "Не обязательно. Больше пропускной способности помогает, когда линия перегружена, но пинг в основном зависит от типа подключения, расстояния до сервера и вашей домашней сети. Переход с Wi-Fi на кабель часто помогает больше, чем смена тарифа.",
    },
  ],
};

const ruWifi: ToolPageMessages = {
  meta: {
    title: "Тест скорости Wi-Fi: проверить скорость вайфая",
    description:
      "Бесплатный тест скорости Wi-Fi. Проверьте скорость загрузки, отдачи и пинг беспроводной сети на любом устройстве в любой комнате. Найдите мёртвые зоны Wi-Fi.",
    keywords: [
      "тест скорости Wi-Fi",
      "проверить скорость Wi-Fi",
      "скорость вайфая",
      "тест скорости wifi",
      "проверка скорости беспроводного интернета",
      "измерить скорость Wi-Fi",
      "тест Wi-Fi роутера",
    ],
  },
  badge: "Бесплатный тест скорости Wi-Fi",
  titleLead: "Тест скорости",
  titleHighlight: "Wi-Fi",
  intro:
    "Проверьте скорость беспроводного интернета за несколько секунд. Запустите тест, чтобы измерить скорость загрузки, отдачи и пинг по Wi-Fi, а затем повторите тест в других комнатах, чтобы найти мёртвые зоны и лучшее место для роутера.",
  sectionsHeading: "О скорости Wi-Fi",
  sectionsIntro: "Как правильно проверить беспроводную сеть и выжать из неё больше скорости.",
  sections: [
    {
      title: "Как проверить скорость Wi-Fi",
      text: "Подключитесь к Wi-Fi, нажмите «Старт» и запомните результат. Затем повторите тест в разных комнатах, чтобы сравнить уровень сигнала и найти слабые места в доме.",
    },
    {
      title: "Почему Wi-Fi медленнее, чем по тарифу?",
      text: "Wi-Fi теряет скорость из-за расстояния, стен, помех от других устройств и устаревших роутеров. Скорость на вашем устройстве часто ниже той, что приходит на модем.",
    },
    {
      title: "Wi-Fi или кабель",
      text: "Проводное подключение Ethernet быстрее и стабильнее Wi-Fi. Если результат по Wi-Fi намного ниже, чем по кабелю, узкое место — ваша беспроводная сеть, а не провайдер.",
    },
    {
      title: "Как ускорить Wi-Fi",
      text: "Подойдите ближе к роутеру, используйте диапазон 5 ГГц, уменьшите помехи, обновите прошивку или установите mesh-систему либо репитер для больших квартир и мёртвых зон.",
    },
  ],
  table: {
    title: "Диапазоны и стандарты Wi-Fi вкратце",
    intro: "Реальная скорость ниже теоретического максимума, указанного на коробке, и падает с расстоянием и количеством стен.",
    head: ["Диапазон или стандарт", "Лучше всего подходит для"],
    rows: [
      ["Диапазон 2,4 ГГц", "Большая дальность и проходимость через стены, но ниже скорость и больше загруженность"],
      ["Диапазон 5 ГГц", "Намного быстрее на малых и средних расстояниях"],
      ["Диапазон 6 ГГц (WiFi 6E / 7)", "Очень быстрый, мало помех, самая короткая дальность"],
      ["WiFi 5 (802.11ac)", "Хорош для тарифов до нескольких сотен Мбит/с"],
      ["WiFi 6 / 6E (802.11ax)", "Дома с множеством устройств, гигабитные тарифы"],
      ["WiFi 7 (802.11be)", "Мультигигабитные тарифы и новейшие устройства"],
    ],
  },
  guide: {
    title: "Как получить максимум от Wi-Fi",
    paragraphs: [
      "Тариф определяет максимальную скорость, которая приходит в ваш дом, но именно Wi-Fi решает, сколько из неё достанется каждому устройству. Стены, перекрытия, зеркала, аквариумы и даже микроволновки ослабляют сигнал, а каждый лишний метр от роутера отнимает скорость.",
      "Сначала запустите тест рядом с роутером, а затем в комнатах, где вы чаще всего пользуетесь интернетом. Если в некоторых комнатах скорость резко падает, переставьте роутер в центральное, возвышенное и открытое место или добавьте mesh-систему, чтобы в каждой комнате был сильный сигнал.",
      "Старые смартфоны и ноутбуки могут поддерживать только устаревшие стандарты Wi-Fi и не способны достичь скоростей современного роутера. Если одно устройство заметно медленнее остальных в том же месте, ограничение — в устройстве, а не в подключении.",
    ],
  },
  tips: {
    title: "Быстрые решения для медленного Wi-Fi",
    items: [
      "Поставьте роутер в центральное, открытое и возвышенное место.",
      "Подключайтесь к сети 5 ГГц или 6 ГГц, когда находитесь рядом с роутером.",
      "Смените канал Wi-Fi, если рядом много соседских сетей.",
      "Обновляйте прошивку роутера и время от времени перезагружайте его.",
      "Используйте mesh-систему или проводную точку доступа в больших квартирах и домах.",
      "По возможности подключайте телевизоры, консоли и настольные ПК кабелем.",
    ],
  },
  faqHeading: "Частые вопросы о скорости Wi-Fi",
  faqs: [
    {
      q: "Как проверить скорость Wi-Fi?",
      a: "Подключите устройство к Wi-Fi и нажмите кнопку «Старт» выше. Тест измерит скорость загрузки, отдачи и пинг беспроводной сети. Повторите его в разных комнатах, чтобы составить карту покрытия.",
    },
    {
      q: "Какая скорость Wi-Fi считается хорошей?",
      a: "Это зависит от тарифа, но для большинства домов хорошая скорость по Wi-Fi — 25–100 Мбит/с. Если результат по Wi-Fi намного ниже тарифа или скорости по кабелю, узкое место — ваша беспроводная сеть.",
    },
    {
      q: "Как сделать Wi-Fi быстрее?",
      a: "Подойдите ближе к роутеру, переключитесь на диапазон 5 ГГц, уменьшите помехи от других устройств, обновите прошивку роутера или добавьте mesh-сеть либо репитер, чтобы покрыть мёртвые зоны.",
    },
    {
      q: "Почему Wi-Fi на одном устройстве быстрый, а на другом медленный?",
      a: "Устройства поддерживают разные стандарты Wi-Fi и имеют разные антенны. Старый смартфон или ноутбук может быть ограничен гораздо меньшей скоростью, чем новый, даже в том же месте. Фоновые приложения и режимы энергосбережения тоже могут замедлять отдельное устройство.",
    },
    {
      q: "Что лучше: 2,4 ГГц или 5 ГГц?",
      a: "5 ГГц быстрее и менее загружен, поэтому это лучший выбор в той же комнате или рядом с роутером. 2,4 ГГц бьёт дальше и легче проходит сквозь стены, поэтому вдали от роутера он может работать надёжнее.",
    },
  ],
};

const ru: ToolsMessages = {
  ui: {
    highlights: ["Точные результаты в реальном времени", "Без установки приложений", "Работает на любом устройстве"],
    learnKicker: "Полезно знать",
    tipsKicker: "Советы",
    faqKicker: "Вопросы и ответы",
    fullTest: "Запустить полный тест скорости интернета",
    guideLink: "Какая скорость интернета считается хорошей?",
    otherTitle: "Другие бесплатные инструменты",
    otherIntro: "Проверьте другие параметры подключения или узнайте свой IP-адрес.",
    open: "Открыть",
  },
  directory: {
    full: { title: "Тест скорости интернета", text: "Загрузка, отдача, пинг и джиттер в одном тесте." },
    download: { title: "Тест скорости загрузки", text: "Как быстро вы получаете данные, в Мбит/с." },
    upload: { title: "Тест скорости отдачи", text: "Как быстро вы отправляете данные для звонков и бэкапов." },
    ping: { title: "Тест пинга и задержки", text: "Время отклика и джиттер в миллисекундах." },
    wifi: { title: "Тест скорости Wi-Fi", text: "Проверьте скорость беспроводной сети в каждой комнате." },
    myIp: { title: "Мой IP-адрес", text: "Ваш публичный IP-адрес, провайдер и местоположение." },
    ipRisk: { title: "Оценка риска IP", text: "Проверьте, не является ли IP VPN, прокси или помеченным." },
  },
  pages: { download: ruDownload, upload: ruUpload, ping: ruPing, wifi: ruWifi },
};

export const toolsMessages: Record<Locale, ToolsMessages> = { en, fr, es, ar, ru };
