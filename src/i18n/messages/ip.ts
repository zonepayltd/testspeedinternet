import type { Locale } from "../config";

// "What Is My IP" page + the <IpDetails /> widget.
const en = {
  meta: {
    title: "What Is My IP Address? Public IP, Location & ISP",
    description:
      "Instantly see what your IP address is: your public IPv4 or IPv6, approximate location on a map, internet provider (ISP), ASN and time zone. Free and private.",
    keywords: [
      "what is my ip",
      "my ip address",
      "what is my ip address",
      "ip address lookup",
      "find my ip",
      "show my ip",
      "public ip address",
      "ipv4 ipv6",
      "my isp",
      "ip location",
    ],
  },
  breadcrumb: "What Is My IP",
  hero: {
    eyebrow: "IP address lookup",
    titleA: "What is my",
    titleB: "IP address?",
    lead: "Your public IP address, its approximate location on the map and details about your internet provider. Free, instant and private.",
  },
  details: {
    yourIp: "Your public IP address",
    detecting: "Detecting your IP address…",
    copy: "Copy IP address",
    copyShort: "Copy",
    copied: "Copied",
    copiedAnnounce: "IP address copied to clipboard",
    errorTitle: "We couldn't detect your IP address",
    errorText: "The lookup service didn't respond. Check your connection, disable any content blocker for this page and try again.",
    retry: "Try again",
    mapTitle: "Approximate location of your IP address",
    mapUnavailable: "Location unavailable for this IP",
    mapLoading: "Loading map…",
    mapNote: "Location is approximate (city level) and based on IP registration data, not GPS.",
    detailsTitle: "Connection details",
    labels: {
      isp: "Internet provider (ISP)",
      asn: "ASN / Network",
      org: "Organization",
      country: "Country",
      city: "City / Region",
      postal: "Postal code",
      timezone: "Time zone",
      localTime: "Local time",
      coords: "Coordinates",
      version: "IP version",
    },
    versionV4: "IPv4",
    versionV6: "IPv6",
  },
  links: {
    speed: "Test your internet speed",
    risk: "Check your IP risk score",
  },
  learn: {
    kicker: "Learn",
    title: "Understanding your IP address",
    lead: "Everything you need to know about IP addresses, in plain language.",
    cards: [
      {
        title: "What is an IP address?",
        text: "An IP (Internet Protocol) address is a unique number that identifies your connection on the internet. Websites use it to send data back to you, much like a postal address for your network.",
      },
      {
        title: "IPv4 vs IPv6",
        text: "IPv4 looks like 192.0.2.1 and is still the most common format. IPv6 is newer and longer (for example 2001:db8::1), created because the world ran out of IPv4 addresses.",
      },
      {
        title: "Public vs private IP",
        text: "Your public IP is what the internet sees and is assigned by your ISP. Private IPs (like 192.168.x.x or 10.x.x.x) are used only inside your home or office network, behind your router.",
      },
      {
        title: "Dynamic vs static IP",
        text: "Most home connections get a dynamic IP that can change when your router restarts or your lease expires. A static IP never changes and is usually offered to businesses, often for an extra fee.",
      },
      {
        title: "Who assigns IP addresses?",
        text: "IANA hands out large blocks to five Regional Internet Registries (ARIN, RIPE NCC, APNIC, LACNIC and AFRINIC). They allocate ranges to internet providers, which then assign an address to your connection.",
      },
      {
        title: "How to hide your IP",
        text: "A VPN or proxy routes your traffic through another server, so websites see that server's IP instead of yours. This adds privacy and can make you appear in a different location.",
      },
    ],
  },
  reveals: {
    title: "What your IP address reveals, and what it doesn't",
    lead: "Every website you visit can see your public IP. Here is what it can be used to learn about you.",
    canTitle: "Visible from your IP",
    can: [
      "Your approximate city or region and your country",
      "Your internet provider (ISP) or the organization that owns the address",
      "The network (ASN) your traffic comes from",
      "Your likely time zone",
      "Whether the address belongs to a VPN, proxy or data center",
    ],
    cannotTitle: "Not visible from your IP",
    cannot: [
      "Your name or identity",
      "Your exact street address or GPS position",
      "Your email address, phone number or passwords",
      "The content of encrypted (HTTPS) pages you visit",
      "Which device on your home network is being used",
    ],
    note: "Only your internet provider can link an IP address to a specific subscriber, and it normally shares that information only when legally required.",
  },
  faqTitle: "IP address FAQ",
  faqLead: "Quick answers to the most common questions about IP addresses.",
  faq: [
    {
      q: "What is my IP address?",
      a: "Your IP address is shown at the top of this page. It is the public IP assigned to your connection by your internet service provider, and it is how websites and online services identify your connection and send data back to you.",
    },
    {
      q: "Is showing my IP address dangerous?",
      a: "Your public IP is visible to every website you visit, so seeing it here is normal and safe. It does not reveal your name or exact home address, only your approximate city and your internet provider. Use a VPN if you want to keep it private.",
    },
    {
      q: "Why is my location on the map not exact?",
      a: "IP-based location is approximate. It is based on where your internet provider registers the IP address, which is often your city or a nearby one, not your precise street address. Mobile and VPN connections can appear even farther away.",
    },
    {
      q: "How can I change or hide my IP address?",
      a: "You can change your IP by restarting your router (for a dynamic IP), contacting your ISP, or using a VPN or proxy server. A VPN is the easiest way to hide your real IP and appear in another location.",
    },
    {
      q: "What is the difference between IPv4 and IPv6?",
      a: "IPv4 uses a 32-bit format (e.g. 192.0.2.1) with about 4.3 billion addresses. IPv6 uses a 128-bit format (e.g. 2001:db8::1) with a virtually unlimited supply, created to handle the growing number of internet-connected devices.",
    },
    {
      q: "Why does my IP address change?",
      a: "Most internet providers assign dynamic IP addresses. Your address can change when your router reconnects, after a power cut, or when the provider renews its address pool. If you need an address that never changes, ask your ISP for a static IP.",
    },
    {
      q: "Why is the IP shown here different from the one in my device settings?",
      a: "Your device settings usually show a private IP (such as 192.168.1.20) given by your router. This page shows your public IP, the single address your router uses to talk to the internet on behalf of every device in your home.",
    },
  ],
};

export type IpMessages = typeof en;

const fr: IpMessages = {
  meta: {
    title: "Quelle est mon adresse IP ? IP publique, localisation, FAI",
    description:
      "Découvrez instantanément votre adresse IP publique (IPv4 ou IPv6), sa localisation approximative sur une carte, votre fournisseur d'accès (FAI), l'ASN et le fuseau horaire.",
    keywords: [
      "quelle est mon adresse ip",
      "mon adresse ip",
      "quelle est mon ip",
      "connaître son adresse ip",
      "adresse ip publique",
      "trouver mon ip",
      "localisation ip",
      "mon fournisseur d'accès",
      "ipv4 ipv6",
    ],
  },
  breadcrumb: "Quelle est mon IP",
  hero: {
    eyebrow: "Recherche d'adresse IP",
    titleA: "Quelle est mon",
    titleB: "adresse\u00a0IP\u00a0?",
    lead: "Votre adresse IP publique, sa localisation approximative sur la carte et les informations sur votre fournisseur d'accès. Gratuit, instantané et confidentiel.",
  },
  details: {
    yourIp: "Votre adresse IP publique",
    detecting: "Détection de votre adresse IP…",
    copy: "Copier l'adresse IP",
    copyShort: "Copier",
    copied: "Copiée",
    copiedAnnounce: "Adresse IP copiée dans le presse-papiers",
    errorTitle: "Impossible de détecter votre adresse IP",
    errorText: "Le service de localisation n'a pas répondu. Vérifiez votre connexion, désactivez un éventuel bloqueur de contenu sur cette page, puis réessayez.",
    retry: "Réessayer",
    mapTitle: "Localisation approximative de votre adresse IP",
    mapUnavailable: "Localisation indisponible pour cette IP",
    mapLoading: "Chargement de la carte…",
    mapNote: "La localisation est approximative (à l'échelle de la ville) et repose sur les données d'enregistrement de l'IP, pas sur le GPS.",
    detailsTitle: "Détails de la connexion",
    labels: {
      isp: "Fournisseur d'accès (FAI)",
      asn: "ASN / Réseau",
      org: "Organisation",
      country: "Pays",
      city: "Ville / Région",
      postal: "Code postal",
      timezone: "Fuseau horaire",
      localTime: "Heure locale",
      coords: "Coordonnées",
      version: "Version IP",
    },
    versionV4: "IPv4",
    versionV6: "IPv6",
  },
  links: {
    speed: "Tester votre débit Internet",
    risk: "Vérifier le score de risque de votre IP",
  },
  learn: {
    kicker: "Comprendre",
    title: "Tout comprendre sur votre adresse IP",
    lead: "L'essentiel à savoir sur les adresses IP, expliqué simplement.",
    cards: [
      {
        title: "Qu'est-ce qu'une adresse IP ?",
        text: "Une adresse IP (Internet Protocol) est un numéro unique qui identifie votre connexion sur Internet. Les sites l'utilisent pour vous renvoyer des données, un peu comme l'adresse postale de votre réseau.",
      },
      {
        title: "IPv4 ou IPv6",
        text: "Une adresse IPv4 ressemble à 192.0.2.1 et reste le format le plus répandu. L'IPv6, plus récente et plus longue (par exemple 2001:db8::1), a été créée parce que le monde a épuisé les adresses IPv4.",
      },
      {
        title: "IP publique ou IP privée",
        text: "Votre IP publique est celle que voit Internet ; elle est attribuée par votre FAI. Les IP privées (comme 192.168.x.x ou 10.x.x.x) ne servent qu'à l'intérieur de votre réseau domestique ou professionnel, derrière votre box.",
      },
      {
        title: "IP dynamique ou IP fixe",
        text: "La plupart des connexions domestiques reçoivent une IP dynamique, qui peut changer au redémarrage de la box ou à l'expiration du bail. Une IP fixe ne change jamais et est surtout proposée aux entreprises, souvent en option payante.",
      },
      {
        title: "Qui attribue les adresses IP ?",
        text: "L'IANA distribue de grands blocs à cinq registres Internet régionaux (ARIN, RIPE NCC, APNIC, LACNIC et AFRINIC). Ceux-ci allouent des plages aux fournisseurs d'accès, qui attribuent ensuite une adresse à votre connexion.",
      },
      {
        title: "Comment masquer son IP",
        text: "Un VPN ou un proxy fait passer votre trafic par un autre serveur : les sites voient alors l'IP de ce serveur au lieu de la vôtre. Vous gagnez en confidentialité et pouvez apparaître dans un autre pays.",
      },
    ],
  },
  reveals: {
    title: "Ce que révèle votre adresse IP, et ce qu'elle ne révèle pas",
    lead: "Chaque site que vous visitez voit votre IP publique. Voici ce qu'elle permet de savoir sur vous.",
    canTitle: "Visible à partir de votre IP",
    can: [
      "Votre ville ou région approximative et votre pays",
      "Votre fournisseur d'accès (FAI) ou l'organisation propriétaire de l'adresse",
      "Le réseau (ASN) d'où provient votre trafic",
      "Votre fuseau horaire probable",
      "Si l'adresse appartient à un VPN, un proxy ou un datacenter",
    ],
    cannotTitle: "Invisible à partir de votre IP",
    cannot: [
      "Votre nom ou votre identité",
      "Votre adresse postale exacte ou votre position GPS",
      "Votre e-mail, votre numéro de téléphone ou vos mots de passe",
      "Le contenu des pages chiffrées (HTTPS) que vous consultez",
      "L'appareil de votre réseau domestique qui est utilisé",
    ],
    note: "Seul votre fournisseur d'accès peut relier une adresse IP à un abonné précis, et il ne communique normalement cette information que sur obligation légale.",
  },
  faqTitle: "FAQ sur l'adresse IP",
  faqLead: "Des réponses rapides aux questions les plus fréquentes sur les adresses IP.",
  faq: [
    {
      q: "Quelle est mon adresse IP ?",
      a: "Votre adresse IP s'affiche en haut de cette page. Il s'agit de l'IP publique attribuée à votre connexion par votre fournisseur d'accès à Internet : c'est grâce à elle que les sites et services en ligne identifient votre connexion et vous renvoient des données.",
    },
    {
      q: "Est-il dangereux d'afficher mon adresse IP ?",
      a: "Votre IP publique est visible par tous les sites que vous visitez : la voir ici est donc normal et sans risque. Elle ne révèle ni votre nom ni votre adresse exacte, seulement votre ville approximative et votre fournisseur d'accès. Utilisez un VPN si vous souhaitez la masquer.",
    },
    {
      q: "Pourquoi ma position sur la carte n'est-elle pas exacte ?",
      a: "La géolocalisation par IP est approximative. Elle se base sur l'endroit où votre fournisseur enregistre l'adresse IP, souvent votre ville ou une ville voisine, et non sur votre adresse précise. Les connexions mobiles et les VPN peuvent apparaître encore plus loin.",
    },
    {
      q: "Comment changer ou masquer mon adresse IP ?",
      a: "Vous pouvez changer d'IP en redémarrant votre box (pour une IP dynamique), en contactant votre FAI ou en utilisant un VPN ou un serveur proxy. Le VPN est le moyen le plus simple de masquer votre véritable IP et d'apparaître dans un autre pays.",
    },
    {
      q: "Quelle est la différence entre IPv4 et IPv6 ?",
      a: "L'IPv4 utilise un format sur 32 bits (ex. 192.0.2.1) offrant environ 4,3 milliards d'adresses. L'IPv6 utilise un format sur 128 bits (ex. 2001:db8::1) offrant un nombre pratiquement illimité d'adresses, pour accompagner la croissance des appareils connectés.",
    },
    {
      q: "Pourquoi mon adresse IP change-t-elle ?",
      a: "La plupart des fournisseurs attribuent des adresses IP dynamiques. Votre adresse peut changer lorsque votre box se reconnecte, après une coupure de courant ou quand le fournisseur renouvelle ses adresses. Si vous avez besoin d'une adresse qui ne change jamais, demandez une IP fixe à votre FAI.",
    },
    {
      q: "Pourquoi l'IP affichée ici est-elle différente de celle de mon appareil ?",
      a: "Les réglages de votre appareil affichent généralement une IP privée (comme 192.168.1.20) fournie par votre box. Cette page affiche votre IP publique, l'adresse unique que votre box utilise pour communiquer avec Internet au nom de tous les appareils du foyer.",
    },
  ],
};

const es: IpMessages = {
  meta: {
    title: "¿Cuál es mi IP? Dirección IP pública, ubicación y proveedor",
    description:
      "Descubre al instante cuál es tu dirección IP pública (IPv4 o IPv6), tu ubicación aproximada en el mapa, tu proveedor de internet (ISP), el ASN y la zona horaria. Gratis.",
    keywords: [
      "cuál es mi ip",
      "mi ip",
      "cual es mi direccion ip",
      "ver mi ip",
      "dirección ip pública",
      "saber mi ip",
      "ubicación ip",
      "mi proveedor de internet",
      "ipv4 ipv6",
    ],
  },
  breadcrumb: "¿Cuál es mi IP?",
  hero: {
    eyebrow: "Consulta de dirección IP",
    titleA: "¿Cuál es mi",
    titleB: "dirección IP?",
    lead: "Tu dirección IP pública, su ubicación aproximada en el mapa y los datos de tu proveedor de internet. Gratis, al instante y en privado.",
  },
  details: {
    yourIp: "Tu dirección IP pública",
    detecting: "Detectando tu dirección IP…",
    copy: "Copiar dirección IP",
    copyShort: "Copiar",
    copied: "Copiada",
    copiedAnnounce: "Dirección IP copiada al portapapeles",
    errorTitle: "No pudimos detectar tu dirección IP",
    errorText: "El servicio de consulta no respondió. Revisa tu conexión, desactiva cualquier bloqueador de contenido en esta página y vuelve a intentarlo.",
    retry: "Reintentar",
    mapTitle: "Ubicación aproximada de tu dirección IP",
    mapUnavailable: "Ubicación no disponible para esta IP",
    mapLoading: "Cargando mapa…",
    mapNote: "La ubicación es aproximada (a nivel de ciudad) y se basa en los datos de registro de la IP, no en el GPS.",
    detailsTitle: "Detalles de la conexión",
    labels: {
      isp: "Proveedor de internet (ISP)",
      asn: "ASN / Red",
      org: "Organización",
      country: "País",
      city: "Ciudad / Región",
      postal: "Código postal",
      timezone: "Zona horaria",
      localTime: "Hora local",
      coords: "Coordenadas",
      version: "Versión de IP",
    },
    versionV4: "IPv4",
    versionV6: "IPv6",
  },
  links: {
    speed: "Haz un test de velocidad",
    risk: "Consulta el nivel de riesgo de tu IP",
  },
  learn: {
    kicker: "Aprende",
    title: "Entiende tu dirección IP",
    lead: "Todo lo que necesitas saber sobre las direcciones IP, explicado de forma sencilla.",
    cards: [
      {
        title: "¿Qué es una dirección IP?",
        text: "Una dirección IP (Internet Protocol) es un número único que identifica tu conexión en internet. Los sitios web la usan para enviarte datos, como si fuera la dirección postal de tu red.",
      },
      {
        title: "IPv4 frente a IPv6",
        text: "Una IPv4 tiene el aspecto 192.0.2.1 y sigue siendo el formato más común. IPv6 es más reciente y más larga (por ejemplo 2001:db8::1) y se creó porque el mundo se quedó sin direcciones IPv4.",
      },
      {
        title: "IP pública frente a IP privada",
        text: "Tu IP pública es la que ve internet y la asigna tu proveedor. Las IP privadas (como 192.168.x.x o 10.x.x.x) solo se usan dentro de tu red doméstica o de oficina, detrás del router.",
      },
      {
        title: "IP dinámica frente a IP fija",
        text: "La mayoría de las conexiones domésticas reciben una IP dinámica que puede cambiar al reiniciar el router o al vencer la concesión. Una IP fija no cambia nunca y suele ofrecerse a empresas, a menudo con coste adicional.",
      },
      {
        title: "¿Quién asigna las direcciones IP?",
        text: "La IANA reparte grandes bloques entre cinco registros regionales de internet (ARIN, RIPE NCC, APNIC, LACNIC y AFRINIC). Estos asignan rangos a los proveedores, que a su vez asignan una dirección a tu conexión.",
      },
      {
        title: "Cómo ocultar tu IP",
        text: "Una VPN o un proxy envía tu tráfico a través de otro servidor, de modo que los sitios web ven la IP de ese servidor en lugar de la tuya. Ganas privacidad y puedes aparecer en otro país.",
      },
    ],
  },
  reveals: {
    title: "Qué revela tu dirección IP y qué no",
    lead: "Todos los sitios que visitas pueden ver tu IP pública. Esto es lo que se puede saber de ti a partir de ella.",
    canTitle: "Visible a partir de tu IP",
    can: [
      "Tu ciudad o región aproximada y tu país",
      "Tu proveedor de internet (ISP) o la organización propietaria de la dirección",
      "La red (ASN) de la que procede tu tráfico",
      "Tu zona horaria probable",
      "Si la dirección pertenece a una VPN, un proxy o un centro de datos",
    ],
    cannotTitle: "No visible a partir de tu IP",
    cannot: [
      "Tu nombre o tu identidad",
      "Tu domicilio exacto o tu posición GPS",
      "Tu correo electrónico, tu teléfono o tus contraseñas",
      "El contenido de las páginas cifradas (HTTPS) que visitas",
      "Qué dispositivo de tu red doméstica se está usando",
    ],
    note: "Solo tu proveedor de internet puede vincular una dirección IP con un cliente concreto, y normalmente solo comparte ese dato cuando la ley lo exige.",
  },
  faqTitle: "Preguntas frecuentes sobre la dirección IP",
  faqLead: "Respuestas rápidas a las dudas más habituales sobre las direcciones IP.",
  faq: [
    {
      q: "¿Cuál es mi dirección IP?",
      a: "Tu dirección IP aparece en la parte superior de esta página. Es la IP pública que tu proveedor de internet asigna a tu conexión, y es la forma en que los sitios web y servicios en línea identifican tu conexión y te envían datos.",
    },
    {
      q: "¿Es peligroso mostrar mi dirección IP?",
      a: "Tu IP pública es visible para todos los sitios que visitas, así que verla aquí es normal y seguro. No revela tu nombre ni tu domicilio exacto, solo tu ciudad aproximada y tu proveedor de internet. Usa una VPN si quieres mantenerla en privado.",
    },
    {
      q: "¿Por qué mi ubicación en el mapa no es exacta?",
      a: "La geolocalización por IP es aproximada. Se basa en el lugar donde tu proveedor registra la dirección IP, que suele ser tu ciudad o una cercana, no tu dirección exacta. Las conexiones móviles y las VPN pueden aparecer todavía más lejos.",
    },
    {
      q: "¿Cómo puedo cambiar u ocultar mi dirección IP?",
      a: "Puedes cambiar tu IP reiniciando el router (si es dinámica), contactando con tu proveedor o usando una VPN o un servidor proxy. Una VPN es la forma más sencilla de ocultar tu IP real y aparecer en otra ubicación.",
    },
    {
      q: "¿Qué diferencia hay entre IPv4 e IPv6?",
      a: "IPv4 usa un formato de 32 bits (p. ej. 192.0.2.1) con unos 4.300 millones de direcciones. IPv6 usa un formato de 128 bits (p. ej. 2001:db8::1) con una cantidad prácticamente ilimitada, creada para dar cabida al creciente número de dispositivos conectados.",
    },
    {
      q: "¿Por qué cambia mi dirección IP?",
      a: "La mayoría de los proveedores asignan direcciones IP dinámicas. Tu dirección puede cambiar cuando el router se reconecta, tras un corte de luz o cuando el proveedor renueva sus direcciones. Si necesitas una dirección que no cambie nunca, pide una IP fija a tu proveedor.",
    },
    {
      q: "¿Por qué la IP que aparece aquí es distinta a la de mi dispositivo?",
      a: "La configuración de tu dispositivo suele mostrar una IP privada (como 192.168.1.20) que le da el router. Esta página muestra tu IP pública, la única dirección que usa el router para comunicarse con internet en nombre de todos los dispositivos de tu casa.",
    },
  ],
};

const ar: IpMessages = {
  meta: {
    title: "ما هو عنوان IP الخاص بي؟ عنوان IP العام والموقع ومزود الخدمة",
    description:
      "اعرف فورًا عنوان IP العام الخاص بك (IPv4 أو IPv6) وموقعك التقريبي على الخريطة ومزود خدمة الإنترنت ورقم ASN والمنطقة الزمنية. أداة مجانية وخاصة.",
    keywords: [
      "ما هو عنوان ip الخاص بي",
      "عنوان ip الخاص بي",
      "معرفة عنوان ip",
      "اظهار ip",
      "عنوان ip العام",
      "موقع ip",
      "مزود خدمة الإنترنت",
      "ipv4 ipv6",
    ],
  },
  breadcrumb: "ما هو عنوان IP الخاص بي",
  hero: {
    eyebrow: "البحث عن عنوان IP",
    titleA: "ما هو",
    titleB: "عنوان IP الخاص بي؟",
    lead: "عنوان IP العام الخاص بك، وموقعه التقريبي على الخريطة، وتفاصيل مزود خدمة الإنترنت. مجاني وفوري وخاص.",
  },
  details: {
    yourIp: "عنوان IP العام الخاص بك",
    detecting: "جارٍ اكتشاف عنوان IP…",
    copy: "نسخ عنوان IP",
    copyShort: "نسخ",
    copied: "تم النسخ",
    copiedAnnounce: "تم نسخ عنوان IP إلى الحافظة",
    errorTitle: "تعذّر اكتشاف عنوان IP الخاص بك",
    errorText: "لم تستجب خدمة البحث. تحقّق من اتصالك، وعطّل أي أداة لحظر المحتوى على هذه الصفحة، ثم أعد المحاولة.",
    retry: "إعادة المحاولة",
    mapTitle: "الموقع التقريبي لعنوان IP الخاص بك",
    mapUnavailable: "الموقع غير متاح لهذا العنوان",
    mapLoading: "جارٍ تحميل الخريطة…",
    mapNote: "الموقع تقريبي (على مستوى المدينة) ويعتمد على بيانات تسجيل عنوان IP وليس على نظام GPS.",
    detailsTitle: "تفاصيل الاتصال",
    labels: {
      isp: "مزود خدمة الإنترنت (ISP)",
      asn: "ASN / الشبكة",
      org: "الجهة المالكة",
      country: "الدولة",
      city: "المدينة / المنطقة",
      postal: "الرمز البريدي",
      timezone: "المنطقة الزمنية",
      localTime: "التوقيت المحلي",
      coords: "الإحداثيات",
      version: "إصدار IP",
    },
    versionV4: "IPv4",
    versionV6: "IPv6",
  },
  links: {
    speed: "اختبر سرعة الإنترنت لديك",
    risk: "تحقّق من درجة مخاطر عنوان IP",
  },
  learn: {
    kicker: "تعرّف أكثر",
    title: "فهم عنوان IP الخاص بك",
    lead: "كل ما تحتاج إلى معرفته عن عناوين IP بلغة بسيطة وواضحة.",
    cards: [
      {
        title: "ما هو عنوان IP؟",
        text: "عنوان IP (بروتوكول الإنترنت) رقم فريد يعرّف اتصالك على الإنترنت. تستخدمه المواقع لإرسال البيانات إليك، تمامًا كما يعمل العنوان البريدي لشبكتك.",
      },
      {
        title: "IPv4 مقابل IPv6",
        text: "يبدو عنوان IPv4 مثل 192.0.2.1 وما زال الصيغة الأكثر انتشارًا. أما IPv6 فهو أحدث وأطول (مثل 2001:db8::1)، وقد أُنشئ بعد نفاد عناوين IPv4 حول العالم.",
      },
      {
        title: "عنوان IP العام مقابل الخاص",
        text: "عنوان IP العام هو ما يراه الإنترنت ويخصّصه لك مزود الخدمة. أما العناوين الخاصة (مثل 192.168.x.x أو 10.x.x.x) فتُستخدم فقط داخل شبكة المنزل أو المكتب خلف جهاز الراوتر.",
      },
      {
        title: "عنوان IP ديناميكي مقابل ثابت",
        text: "تحصل معظم الاتصالات المنزلية على عنوان ديناميكي قد يتغيّر عند إعادة تشغيل الراوتر أو انتهاء مدة التخصيص. أما العنوان الثابت فلا يتغيّر أبدًا ويُقدَّم عادةً للشركات، وغالبًا مقابل رسوم إضافية.",
      },
      {
        title: "من يخصّص عناوين IP؟",
        text: "توزّع هيئة IANA كتلًا كبيرة من العناوين على خمسة سجلات إنترنت إقليمية (ARIN وRIPE NCC وAPNIC وLACNIC وAFRINIC)، وهذه تخصّص نطاقات لمزودي الخدمة الذين يمنحون بدورهم عنوانًا لاتصالك.",
      },
      {
        title: "كيف تُخفي عنوان IP",
        text: "توجّه شبكة VPN أو خادم البروكسي حركة بياناتك عبر خادم آخر، فترى المواقع عنوان ذلك الخادم بدلًا من عنوانك. يمنحك ذلك خصوصية أكبر وقد يُظهرك في موقع مختلف.",
      },
    ],
  },
  reveals: {
    title: "ما الذي يكشفه عنوان IP وما الذي لا يكشفه",
    lead: "يستطيع كل موقع تزوره رؤية عنوان IP العام الخاص بك. إليك ما يمكن معرفته عنك من خلاله.",
    canTitle: "ما يظهر من عنوان IP",
    can: [
      "مدينتك أو منطقتك التقريبية ودولتك",
      "مزود خدمة الإنترنت أو الجهة المالكة للعنوان",
      "الشبكة (ASN) التي تصدر منها حركة بياناتك",
      "منطقتك الزمنية المرجّحة",
      "ما إذا كان العنوان تابعًا لشبكة VPN أو بروكسي أو مركز بيانات",
    ],
    cannotTitle: "ما لا يظهر من عنوان IP",
    cannot: [
      "اسمك أو هويتك",
      "عنوان منزلك بالتحديد أو موقعك عبر GPS",
      "بريدك الإلكتروني أو رقم هاتفك أو كلمات المرور",
      "محتوى الصفحات المشفّرة (HTTPS) التي تزورها",
      "الجهاز المستخدم داخل شبكتك المنزلية",
    ],
    note: "وحده مزود خدمة الإنترنت يستطيع ربط عنوان IP بمشترك محدد، ولا يُفصح عن هذه المعلومة عادةً إلا عند وجود إلزام قانوني.",
  },
  faqTitle: "أسئلة شائعة حول عنوان IP",
  faqLead: "إجابات سريعة عن أكثر الأسئلة شيوعًا حول عناوين IP.",
  faq: [
    {
      q: "ما هو عنوان IP الخاص بي؟",
      a: "يظهر عنوان IP الخاص بك أعلى هذه الصفحة. وهو عنوان IP العام الذي يخصّصه مزود خدمة الإنترنت لاتصالك، ومن خلاله تتعرّف المواقع والخدمات الإلكترونية على اتصالك وترسل إليك البيانات.",
    },
    {
      q: "هل إظهار عنوان IP الخاص بي أمر خطير؟",
      a: "عنوان IP العام مرئي لكل موقع تزوره، لذا فإن رؤيته هنا أمر طبيعي وآمن. فهو لا يكشف اسمك ولا عنوان منزلك بالتحديد، بل مدينتك التقريبية ومزود خدمة الإنترنت فقط. استخدم VPN إن أردت إخفاءه.",
    },
    {
      q: "لماذا لا يكون موقعي على الخريطة دقيقًا؟",
      a: "تحديد الموقع عبر عنوان IP تقريبي، إذ يعتمد على المكان الذي يسجّل فيه مزود الخدمة العنوان، وهو غالبًا مدينتك أو مدينة قريبة منها، وليس عنوانك الدقيق. وقد تظهر اتصالات الهاتف المحمول وشبكات VPN في مواقع أبعد من ذلك.",
    },
    {
      q: "كيف يمكنني تغيير عنوان IP أو إخفاؤه؟",
      a: "يمكنك تغيير عنوان IP بإعادة تشغيل الراوتر (إذا كان العنوان ديناميكيًا)، أو بالتواصل مع مزود الخدمة، أو باستخدام VPN أو خادم بروكسي. وتُعدّ شبكة VPN أسهل طريقة لإخفاء عنوانك الحقيقي والظهور في موقع آخر.",
    },
    {
      q: "ما الفرق بين IPv4 وIPv6؟",
      a: "يستخدم IPv4 صيغة من 32 بت (مثل 192.0.2.1) توفّر نحو 4.3 مليار عنوان. أما IPv6 فيستخدم صيغة من 128 بت (مثل 2001:db8::1) توفّر عددًا شبه لا محدود من العناوين، وقد صُمّم لاستيعاب العدد المتزايد من الأجهزة المتصلة بالإنترنت.",
    },
    {
      q: "لماذا يتغيّر عنوان IP الخاص بي؟",
      a: "يخصّص معظم مزودي الخدمة عناوين IP ديناميكية، لذا قد يتغيّر عنوانك عند إعادة اتصال الراوتر أو بعد انقطاع الكهرباء أو عندما يجدّد المزود عناوينه. وإذا كنت تحتاج إلى عنوان لا يتغيّر، فاطلب عنوان IP ثابتًا من مزود الخدمة.",
    },
    {
      q: "لماذا يختلف عنوان IP المعروض هنا عن العنوان في إعدادات جهازي؟",
      a: "تعرض إعدادات جهازك عادةً عنوان IP خاصًا (مثل 192.168.1.20) يمنحه الراوتر. أما هذه الصفحة فتعرض عنوان IP العام، وهو العنوان الوحيد الذي يستخدمه الراوتر للتواصل مع الإنترنت نيابةً عن جميع الأجهزة في منزلك.",
    },
  ],
};

const ru: IpMessages = {
  meta: {
    title: "Мой IP-адрес: узнать IP, местоположение и провайдера",
    description:
      "Узнайте свой внешний IP-адрес (IPv4 или IPv6), примерное местоположение на карте, интернет-провайдера, номер ASN и часовой пояс. Бесплатно, мгновенно и без регистрации.",
    keywords: [
      "мой ip",
      "мой ip адрес",
      "узнать ip адрес",
      "какой у меня ip",
      "внешний ip адрес",
      "определить ip",
      "местоположение по ip",
      "мой провайдер",
      "ipv4 ipv6",
    ],
  },
  breadcrumb: "Мой IP-адрес",
  hero: {
    eyebrow: "Проверка IP-адреса",
    titleA: "Какой у меня",
    titleB: "IP-адрес?",
    lead: "Ваш внешний IP-адрес, его примерное местоположение на карте и данные о вашем интернет-провайдере. Бесплатно, мгновенно и конфиденциально.",
  },
  details: {
    yourIp: "Ваш внешний IP-адрес",
    detecting: "Определяем ваш IP-адрес…",
    copy: "Скопировать IP-адрес",
    copyShort: "Копировать",
    copied: "Скопировано",
    copiedAnnounce: "IP-адрес скопирован в буфер обмена",
    errorTitle: "Не удалось определить ваш IP-адрес",
    errorText: "Сервис определения не ответил. Проверьте подключение, отключите блокировщик контента для этой страницы и попробуйте снова.",
    retry: "Повторить",
    mapTitle: "Примерное местоположение вашего IP-адреса",
    mapUnavailable: "Местоположение для этого IP недоступно",
    mapLoading: "Загрузка карты…",
    mapNote: "Местоположение примерное (с точностью до города) и основано на регистрационных данных IP, а не на GPS.",
    detailsTitle: "Сведения о подключении",
    labels: {
      isp: "Интернет-провайдер",
      asn: "ASN / Сеть",
      org: "Организация",
      country: "Страна",
      city: "Город / Регион",
      postal: "Почтовый индекс",
      timezone: "Часовой пояс",
      localTime: "Местное время",
      coords: "Координаты",
      version: "Версия IP",
    },
    versionV4: "IPv4",
    versionV6: "IPv6",
  },
  links: {
    speed: "Проверить скорость интернета",
    risk: "Узнать оценку риска вашего IP",
  },
  learn: {
    kicker: "Справка",
    title: "Что нужно знать о вашем IP-адресе",
    lead: "Всё самое важное об IP-адресах простыми словами.",
    cards: [
      {
        title: "Что такое IP-адрес?",
        text: "IP-адрес (Internet Protocol) — это уникальный номер, который идентифицирует ваше подключение в интернете. Сайты используют его, чтобы отправлять вам данные, — это своего рода почтовый адрес вашей сети.",
      },
      {
        title: "IPv4 и IPv6",
        text: "Адрес IPv4 выглядит как 192.0.2.1 и по-прежнему встречается чаще всего. IPv6 — более новый и длинный формат (например, 2001:db8::1), созданный из-за того, что адреса IPv4 в мире закончились.",
      },
      {
        title: "Внешний и локальный IP",
        text: "Внешний (публичный) IP видит весь интернет, его выдаёт провайдер. Локальные (частные) адреса, например 192.168.x.x или 10.x.x.x, используются только внутри домашней или офисной сети за роутером.",
      },
      {
        title: "Динамический и статический IP",
        text: "Большинство домашних подключений получают динамический IP, который может меняться после перезагрузки роутера или окончания аренды адреса. Статический IP не меняется никогда; его обычно предлагают компаниям, часто за доплату.",
      },
      {
        title: "Кто распределяет IP-адреса?",
        text: "Организация IANA передаёт крупные блоки адресов пяти региональным интернет-регистраторам (ARIN, RIPE NCC, APNIC, LACNIC и AFRINIC). Они выделяют диапазоны провайдерам, а те назначают адрес вашему подключению.",
      },
      {
        title: "Как скрыть свой IP",
        text: "VPN или прокси пропускают ваш трафик через другой сервер, и сайты видят IP этого сервера вместо вашего. Это повышает конфиденциальность и позволяет выглядеть так, будто вы находитесь в другой стране.",
      },
    ],
  },
  reveals: {
    title: "Что раскрывает ваш IP-адрес, а что — нет",
    lead: "Каждый сайт, который вы посещаете, видит ваш внешний IP. Вот что по нему можно узнать о вас.",
    canTitle: "Видно по IP-адресу",
    can: [
      "Примерный город или регион и страна",
      "Ваш интернет-провайдер или организация, владеющая адресом",
      "Сеть (ASN), из которой идёт ваш трафик",
      "Вероятный часовой пояс",
      "Принадлежит ли адрес VPN, прокси или дата-центру",
    ],
    cannotTitle: "Не видно по IP-адресу",
    cannot: [
      "Ваше имя и личность",
      "Точный домашний адрес или координаты GPS",
      "Электронная почта, номер телефона или пароли",
      "Содержимое зашифрованных (HTTPS) страниц, которые вы открываете",
      "Какое именно устройство в домашней сети используется",
    ],
    note: "Связать IP-адрес с конкретным абонентом может только ваш провайдер, и обычно он раскрывает эти данные лишь по требованию закона.",
  },
  faqTitle: "Вопросы и ответы об IP-адресе",
  faqLead: "Короткие ответы на самые частые вопросы об IP-адресах.",
  faq: [
    {
      q: "Какой у меня IP-адрес?",
      a: "Ваш IP-адрес показан в верхней части этой страницы. Это внешний IP, который ваш интернет-провайдер назначил вашему подключению; по нему сайты и онлайн-сервисы распознают ваше подключение и отправляют вам данные.",
    },
    {
      q: "Опасно ли показывать свой IP-адрес?",
      a: "Ваш внешний IP видят все сайты, которые вы посещаете, поэтому его отображение здесь — это нормально и безопасно. Он не раскрывает ваше имя или точный адрес, а только примерный город и провайдера. Если хотите скрыть IP, используйте VPN.",
    },
    {
      q: "Почему местоположение на карте неточное?",
      a: "Геолокация по IP всегда приблизительна. Она основана на том, где провайдер зарегистрировал IP-адрес, — обычно это ваш город или соседний, а не точный адрес. Мобильные подключения и VPN могут отображаться ещё дальше.",
    },
    {
      q: "Как изменить или скрыть свой IP-адрес?",
      a: "Сменить IP можно, перезагрузив роутер (если адрес динамический), обратившись к провайдеру или подключившись через VPN или прокси-сервер. VPN — самый простой способ скрыть реальный IP и выглядеть так, будто вы находитесь в другом месте.",
    },
    {
      q: "Чем IPv4 отличается от IPv6?",
      a: "IPv4 использует 32-битный формат (например, 192.0.2.1) — около 4,3 млрд адресов. IPv6 использует 128-битный формат (например, 2001:db8::1) с практически неограниченным количеством адресов; он создан для постоянно растущего числа подключённых устройств.",
    },
    {
      q: "Почему мой IP-адрес меняется?",
      a: "Большинство провайдеров выдают динамические IP-адреса. Адрес может смениться при переподключении роутера, после отключения электричества или когда провайдер обновляет пул адресов. Если нужен адрес, который не меняется, закажите у провайдера статический IP.",
    },
    {
      q: "Почему IP на этой странице отличается от IP в настройках устройства?",
      a: "В настройках устройства обычно указан локальный IP (например, 192.168.1.20), выданный роутером. Эта страница показывает внешний IP — единственный адрес, через который роутер выходит в интернет от имени всех устройств в доме.",
    },
  ],
};

export const ipMessages: Record<Locale, IpMessages> = { en, fr, es, ar, ru };
