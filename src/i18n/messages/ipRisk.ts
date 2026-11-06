import type { Locale } from "../config";

// "IP Risk Score" page + the <IpSecurity /> widget (also shown on What Is My IP).
const en = {
  meta: {
    title: "IP Risk Score: Check IP Reputation, VPN & Proxy",
    description:
      "Check your IP risk score for free. See if your IP address is flagged as a proxy, VPN, Tor or data center, with your connection type and a 0-100 fraud score.",
    keywords: [
      "ip risk score",
      "ip reputation check",
      "ip fraud score",
      "check ip risk",
      "is my ip blacklisted",
      "vpn detection",
      "proxy detection",
      "is my ip clean",
      "ip score checker",
      "ip address reputation",
    ],
  },
  breadcrumb: "IP Risk Score",
  hero: {
    eyebrow: "IP reputation checker",
    titleA: "Check your",
    titleB: "IP risk score",
    lead: "Instantly see whether your IP address is clean or flagged as a proxy, VPN or high-risk, with a 0-100 risk score and your connection type. Free and private.",
  },
  widget: {
    title: "IP security check",
    checking: "Checking…",
    checkingText: "Analysing your IP reputation",
    riskScore: "Risk score",
    scaleLow: "Clean",
    scaleHigh: "High risk",
    noScore: "Not rated",
    levels: {
      low: {
        label: "Low risk",
        blurb: "This IP looks like a normal connection with no notable risk signals. Most websites will trust it.",
      },
      medium: {
        label: "Medium risk",
        blurb: "Some risk signals were found. You may occasionally see CAPTCHAs or extra verification steps.",
      },
      high: {
        label: "High risk",
        blurb: "Strong risk signals were found. Some websites may block this IP or ask for extra verification.",
      },
    },
    flaggedBlurb: "A VPN, proxy or Tor connection was detected, so many websites will treat this IP as high risk.",
    errorTitle: "We couldn't analyse this IP",
    errorText: "The reputation service didn't respond. Please wait a moment and try again.",
    retry: "Try again",
    ipLabel: "Checked IP",
    signalsTitle: "Signals we checked",
    status: { pass: "Pass", warn: "Review", fail: "Flagged", info: "Info" },
    signals: {
      type: {
        label: "Connection type",
        residential: "Home broadband IPs assigned by a consumer ISP are the most trusted connection type.",
        business: "Business connections are generally trusted, although one IP may be shared by many employees.",
        mobile: "Mobile carrier IPs are shared by many users at once (CGNAT), so websites usually treat them leniently.",
        hosting: "Hosting and data-center IPs are often used by bots and proxies, so websites treat them with more suspicion.",
        vpn: "This address belongs to a VPN service. Many websites add extra checks for VPN traffic.",
        tor: "Tor exit nodes are public and anonymous, and are frequently blocked or challenged.",
        proxy: "This address is known to relay traffic for other users as a proxy.",
        unknown: "The connection type could not be classified for this address.",
      },
      vpn: {
        label: "VPN / proxy",
        yes: "Detected",
        no: "Not detected",
        yesText: "Your traffic appears to exit through a VPN or proxy server rather than directly from your ISP.",
        noText: "No VPN or proxy was detected. Your traffic appears to come directly from your provider.",
      },
      tor: {
        label: "Tor exit node",
        yes: "Yes",
        no: "No",
        yesText: "This IP is a Tor exit node, one of the strongest risk signals for websites.",
        noText: "This IP is not listed as a Tor exit node.",
      },
      provider: {
        label: "Network provider",
        text: "The organization that owns this IP range. Consumer ISPs score better than hosting companies.",
      },
      location: {
        label: "IP location",
        text: "Websites compare this with your account or billing country. A mismatch can trigger extra checks.",
      },
    },
    typeNames: {
      residential: "Residential",
      business: "Business",
      mobile: "Mobile",
      hosting: "Data center",
      vpn: "VPN",
      tor: "Tor",
      proxy: "Proxy",
      unknown: "Unknown",
    },
    fullReport: "Full risk report",
    disclaimer: "Results are based on third-party IP reputation data and are an estimate, not a judgement about you.",
  },
  links: {
    details: "See full IP details",
    speed: "Test your internet speed",
  },
  bands: {
    kicker: "Score guide",
    title: "How to read your IP risk score",
    lead: "The score runs from 0 (clean) to 100 (high risk). Here is what each range means.",
    items: [
      { range: "0 – 33", label: "Low risk", desc: "Normal residential or business connection with no notable abuse history. Trusted by most websites." },
      { range: "34 – 66", label: "Medium risk", desc: "Some risk signals, such as a shared or hosting IP, light proxy use or older abuse reports." },
      { range: "67 – 100", label: "High risk", desc: "Strong proxy, VPN, Tor or abuse signals. Often blocked or shown extra security checks." },
    ],
  },
  factors: {
    kicker: "Signals",
    title: "What affects your IP risk score?",
    lead: "Several signals decide whether an IP address looks trustworthy or risky.",
    items: [
      {
        title: "VPN & proxy use",
        text: "Traffic routed through a VPN, proxy or Tor exit node is the most common reason an IP gets a higher risk score.",
      },
      {
        title: "Data-center IPs",
        text: "Addresses owned by hosting and cloud providers score higher than residential ISP connections, because automated bots often run there.",
      },
      {
        title: "Blacklists & past abuse",
        text: "If an IP (or its range) was used for spam, attacks or fraud, it can be listed on blacklists and stay flagged for a while.",
      },
      {
        title: "Bot & automated activity",
        text: "Scraping, credential stuffing and other automated behaviour coming from an IP raises its reputation risk.",
      },
      {
        title: "Shared IPs",
        text: "Mobile networks and some ISPs put many customers behind one public IP (CGNAT), so one abusive user can affect everyone sharing it.",
      },
      {
        title: "Location consistency",
        text: "Fraud systems compare the IP's country with your account, card or time zone. A mismatch is not proof of fraud but adds risk.",
      },
    ],
  },
  tips: {
    kicker: "Fix it",
    title: "How to lower a high IP risk score",
    lead: "If websites keep blocking you or showing CAPTCHAs, these steps usually help.",
    steps: [
      { title: "Turn off your VPN or proxy", text: "Disconnect and check again. If the score drops, the VPN server's IP was the cause." },
      { title: "Get a new IP from your ISP", text: "Restart your router to get a fresh dynamic IP, or ask your provider for a new address." },
      { title: "Scan your devices", text: "Malware or a compromised device can send spam or attacks from your IP. Run a security scan on every device." },
      { title: "Secure your WiFi", text: "Use WPA2 or WPA3 with a strong password so neighbours or strangers cannot misuse your connection." },
      { title: "Ask for delisting", text: "If your IP is on a blacklist, most lists offer a removal request once the problem is fixed." },
    ],
  },
  faqTitle: "IP risk score FAQ",
  faqLead: "Answers to common questions about IP reputation and risk scores.",
  faq: [
    {
      q: "What is an IP risk score?",
      a: "An IP risk score is a number from 0 to 100 that estimates how likely an IP address is associated with fraud, bots, proxies, VPNs or past abuse. A lower score means a cleaner, more trusted connection; a higher score means more risk signals.",
    },
    {
      q: "What is a good IP risk score?",
      a: "A score of 0–33 is considered low risk and is typical for a normal home (residential) internet connection. 34–66 is medium risk, and 67–100 is high risk and more likely to be blocked or shown extra security checks by websites.",
    },
    {
      q: "Why is my IP flagged as a proxy or VPN?",
      a: "If you are connected through a VPN, proxy or Tor, your traffic exits from that service's IP, which is detected and flagged. Data-center and hosting IPs are also commonly labelled as proxies even when you are not actively using one.",
    },
    {
      q: "How can I lower my IP risk score?",
      a: "Turn off any VPN or proxy, use a normal residential connection from your ISP, and request a new IP (restart your router for a dynamic IP, or contact your provider). Keeping your devices free of malware and avoiding abusive activity also keeps your score low.",
    },
    {
      q: "Is a high IP risk score dangerous for me?",
      a: "Not directly. It mainly means some websites and services may block you, ask for extra verification (like CAPTCHAs), or limit access, because they treat the IP as higher risk. It does not reveal your identity.",
    },
    {
      q: "Why do websites check my IP reputation?",
      a: "Banks, online shops, streaming services and login pages use IP reputation to stop fraud, fake accounts and bots. A clean IP lets you through smoothly, while a risky one may trigger CAPTCHAs, extra verification or a block.",
    },
  ],
};

export type IpRiskMessages = typeof en;

const fr: IpRiskMessages = {
  meta: {
    title: "Score de risque IP : réputation IP, VPN et proxy",
    description:
      "Vérifiez gratuitement le score de risque de votre IP : détection de proxy, VPN, Tor ou datacenter, type de connexion et score de fraude de 0 à 100. Rapide et confidentiel.",
    keywords: [
      "score de risque ip",
      "réputation ip",
      "vérifier réputation ip",
      "ip blacklistée",
      "mon ip est-elle sur liste noire",
      "détection vpn",
      "détection proxy",
      "score de fraude ip",
      "vérifier mon ip",
    ],
  },
  breadcrumb: "Score de risque IP",
  hero: {
    eyebrow: "Vérification de réputation IP",
    titleA: "Vérifiez le",
    titleB: "score de risque de votre IP",
    lead: "Découvrez instantanément si votre adresse IP est saine ou signalée comme proxy, VPN ou à risque, avec un score de 0 à 100 et votre type de connexion. Gratuit et confidentiel.",
  },
  widget: {
    title: "Contrôle de sécurité IP",
    checking: "Vérification…",
    checkingText: "Analyse de la réputation de votre IP",
    riskScore: "Score de risque",
    scaleLow: "Saine",
    scaleHigh: "Risque élevé",
    noScore: "Non évaluée",
    levels: {
      low: {
        label: "Risque faible",
        blurb: "Cette IP ressemble à une connexion normale, sans signal de risque notable. La plupart des sites lui feront confiance.",
      },
      medium: {
        label: "Risque modéré",
        blurb: "Quelques signaux de risque ont été détectés. Vous verrez peut-être parfois des CAPTCHA ou des vérifications supplémentaires.",
      },
      high: {
        label: "Risque élevé",
        blurb: "De forts signaux de risque ont été détectés. Certains sites peuvent bloquer cette IP ou exiger une vérification supplémentaire.",
      },
    },
    flaggedBlurb: "Une connexion VPN, proxy ou Tor a été détectée : de nombreux sites considéreront cette IP comme à risque élevé.",
    errorTitle: "Impossible d'analyser cette IP",
    errorText: "Le service de réputation n'a pas répondu. Patientez quelques instants puis réessayez.",
    retry: "Réessayer",
    ipLabel: "IP analysée",
    signalsTitle: "Signaux analysés",
    status: { pass: "OK", warn: "À vérifier", fail: "Signalé", info: "Info" },
    signals: {
      type: {
        label: "Type de connexion",
        residential: "Les IP résidentielles attribuées par un FAI grand public sont le type de connexion le plus fiable.",
        business: "Les connexions professionnelles sont généralement fiables, même si une IP peut être partagée par de nombreux employés.",
        mobile: "Les IP d'opérateurs mobiles sont partagées par de nombreux utilisateurs à la fois (CGNAT) : les sites les traitent généralement avec indulgence.",
        hosting: "Les IP d'hébergeurs et de datacenters sont souvent utilisées par des bots et des proxys : les sites s'en méfient davantage.",
        vpn: "Cette adresse appartient à un service VPN. De nombreux sites ajoutent des contrôles pour le trafic VPN.",
        tor: "Les nœuds de sortie Tor sont publics et anonymes, et sont fréquemment bloqués ou soumis à des vérifications.",
        proxy: "Cette adresse est connue pour relayer le trafic d'autres utilisateurs en tant que proxy.",
        unknown: "Le type de connexion n'a pas pu être déterminé pour cette adresse.",
      },
      vpn: {
        label: "VPN / proxy",
        yes: "Détecté",
        no: "Non détecté",
        yesText: "Votre trafic semble sortir par un serveur VPN ou proxy plutôt que directement par votre FAI.",
        noText: "Aucun VPN ni proxy détecté. Votre trafic semble provenir directement de votre fournisseur.",
      },
      tor: {
        label: "Nœud de sortie Tor",
        yes: "Oui",
        no: "Non",
        yesText: "Cette IP est un nœud de sortie Tor, l'un des signaux de risque les plus forts pour les sites.",
        noText: "Cette IP n'est pas répertoriée comme nœud de sortie Tor.",
      },
      provider: {
        label: "Fournisseur réseau",
        text: "L'organisation propriétaire de cette plage d'IP. Les FAI grand public obtiennent de meilleurs scores que les hébergeurs.",
      },
      location: {
        label: "Localisation de l'IP",
        text: "Les sites la comparent au pays de votre compte ou de facturation. Une incohérence peut déclencher des contrôles.",
      },
    },
    typeNames: {
      residential: "Résidentielle",
      business: "Professionnelle",
      mobile: "Mobile",
      hosting: "Datacenter",
      vpn: "VPN",
      tor: "Tor",
      proxy: "Proxy",
      unknown: "Inconnu",
    },
    fullReport: "Rapport de risque complet",
    disclaimer: "Les résultats reposent sur des données de réputation IP tierces : il s'agit d'une estimation, pas d'un jugement vous concernant.",
  },
  links: {
    details: "Voir tous les détails de votre IP",
    speed: "Tester votre débit Internet",
  },
  bands: {
    kicker: "Barème",
    title: "Comment lire votre score de risque IP",
    lead: "Le score va de 0 (saine) à 100 (risque élevé). Voici ce que signifie chaque tranche.",
    items: [
      { range: "0 – 33", label: "Risque faible", desc: "Connexion résidentielle ou professionnelle normale, sans historique d'abus notable. Acceptée par la plupart des sites." },
      { range: "34 – 66", label: "Risque modéré", desc: "Quelques signaux de risque : IP partagée ou d'hébergeur, usage léger de proxy ou anciens signalements d'abus." },
      { range: "67 – 100", label: "Risque élevé", desc: "Forts signaux de proxy, VPN, Tor ou d'abus. Souvent bloquée ou soumise à des contrôles de sécurité." },
    ],
  },
  factors: {
    kicker: "Signaux",
    title: "Qu'est-ce qui influence votre score de risque IP ?",
    lead: "Plusieurs signaux déterminent si une adresse IP paraît fiable ou risquée.",
    items: [
      {
        title: "Utilisation de VPN et de proxy",
        text: "Le trafic qui passe par un VPN, un proxy ou un nœud de sortie Tor est la raison la plus fréquente d'un score de risque élevé.",
      },
      {
        title: "IP de datacenter",
        text: "Les adresses appartenant à des hébergeurs et fournisseurs cloud obtiennent un score plus élevé que les connexions résidentielles, car les bots y tournent souvent.",
      },
      {
        title: "Listes noires et abus passés",
        text: "Si une IP (ou sa plage) a servi au spam, à des attaques ou à la fraude, elle peut figurer sur des listes noires et rester signalée un certain temps.",
      },
      {
        title: "Activité de bots",
        text: "Le scraping, le credential stuffing et les autres comportements automatisés provenant d'une IP augmentent son risque de réputation.",
      },
      {
        title: "IP partagées",
        text: "Les réseaux mobiles et certains FAI placent de nombreux clients derrière une seule IP publique (CGNAT) : un seul utilisateur malveillant peut pénaliser tous les autres.",
      },
      {
        title: "Cohérence de la localisation",
        text: "Les systèmes antifraude comparent le pays de l'IP à celui de votre compte, de votre carte ou à votre fuseau horaire. Une incohérence n'est pas une preuve de fraude mais augmente le risque.",
      },
    ],
  },
  tips: {
    kicker: "Solutions",
    title: "Comment faire baisser un score de risque IP élevé",
    lead: "Si des sites vous bloquent ou vous imposent sans cesse des CAPTCHA, ces étapes aident généralement.",
    steps: [
      { title: "Désactivez votre VPN ou proxy", text: "Déconnectez-vous et refaites le test. Si le score baisse, l'IP du serveur VPN était en cause." },
      { title: "Obtenez une nouvelle IP", text: "Redémarrez votre box pour obtenir une nouvelle IP dynamique, ou demandez une nouvelle adresse à votre fournisseur." },
      { title: "Analysez vos appareils", text: "Un logiciel malveillant ou un appareil compromis peut envoyer du spam ou des attaques depuis votre IP. Lancez une analyse sur chaque appareil." },
      { title: "Sécurisez votre WiFi", text: "Utilisez le WPA2 ou le WPA3 avec un mot de passe robuste pour empêcher toute utilisation abusive de votre connexion." },
      { title: "Demandez un retrait de liste noire", text: "Si votre IP figure sur une liste noire, la plupart des listes proposent une demande de retrait une fois le problème résolu." },
    ],
  },
  faqTitle: "FAQ sur le score de risque IP",
  faqLead: "Les réponses aux questions fréquentes sur la réputation et le score de risque des adresses IP.",
  faq: [
    {
      q: "Qu'est-ce qu'un score de risque IP ?",
      a: "Un score de risque IP est un nombre de 0 à 100 qui estime la probabilité qu'une adresse IP soit associée à de la fraude, des bots, des proxys, des VPN ou des abus passés. Plus le score est bas, plus la connexion est saine et fiable ; plus il est élevé, plus les signaux de risque sont nombreux.",
    },
    {
      q: "Qu'est-ce qu'un bon score de risque IP ?",
      a: "Un score de 0 à 33 correspond à un risque faible, typique d'une connexion Internet domestique (résidentielle). De 34 à 66, le risque est modéré ; de 67 à 100, il est élevé et les sites sont plus susceptibles de bloquer l'IP ou d'imposer des contrôles de sécurité.",
    },
    {
      q: "Pourquoi mon IP est-elle signalée comme proxy ou VPN ?",
      a: "Si vous êtes connecté via un VPN, un proxy ou Tor, votre trafic sort par l'IP de ce service, qui est détectée et signalée. Les IP de datacenters et d'hébergeurs sont aussi souvent classées comme proxys, même si vous n'en utilisez pas.",
    },
    {
      q: "Comment faire baisser mon score de risque IP ?",
      a: "Désactivez tout VPN ou proxy, utilisez une connexion résidentielle classique de votre FAI et demandez une nouvelle IP (redémarrez votre box pour une IP dynamique ou contactez votre fournisseur). Garder vos appareils exempts de logiciels malveillants et éviter toute activité abusive aide aussi à maintenir un score bas.",
    },
    {
      q: "Un score de risque IP élevé est-il dangereux pour moi ?",
      a: "Pas directement. Cela signifie surtout que certains sites et services peuvent vous bloquer, demander une vérification supplémentaire (comme un CAPTCHA) ou limiter l'accès, car ils considèrent l'IP comme plus risquée. Cela ne révèle pas votre identité.",
    },
    {
      q: "Pourquoi les sites vérifient-ils la réputation de mon IP ?",
      a: "Les banques, boutiques en ligne, services de streaming et pages de connexion utilisent la réputation IP pour lutter contre la fraude, les faux comptes et les bots. Une IP saine vous laisse passer sans encombre, tandis qu'une IP à risque peut déclencher des CAPTCHA, une vérification supplémentaire ou un blocage.",
    },
  ],
};

const es: IpRiskMessages = {
  meta: {
    title: "Puntuación de riesgo IP: reputación, VPN y proxy",
    description:
      "Comprueba gratis la puntuación de riesgo de tu IP: detecta si está marcada como proxy, VPN, Tor o centro de datos, con tu tipo de conexión y un fraud score de 0 a 100.",
    keywords: [
      "puntuación de riesgo ip",
      "reputación ip",
      "comprobar reputación ip",
      "mi ip está en lista negra",
      "detectar vpn",
      "detectar proxy",
      "fraud score ip",
      "verificar mi ip",
      "ip limpia",
    ],
  },
  breadcrumb: "Riesgo de IP",
  hero: {
    eyebrow: "Comprobador de reputación IP",
    titleA: "Comprueba la",
    titleB: "puntuación de riesgo de tu IP",
    lead: "Descubre al instante si tu dirección IP está limpia o marcada como proxy, VPN o de alto riesgo, con una puntuación de 0 a 100 y tu tipo de conexión. Gratis y privado.",
  },
  widget: {
    title: "Control de seguridad de IP",
    checking: "Comprobando…",
    checkingText: "Analizando la reputación de tu IP",
    riskScore: "Puntuación de riesgo",
    scaleLow: "Limpia",
    scaleHigh: "Riesgo alto",
    noScore: "Sin puntuar",
    levels: {
      low: {
        label: "Riesgo bajo",
        blurb: "Esta IP parece una conexión normal sin señales de riesgo destacables. La mayoría de los sitios confiarán en ella.",
      },
      medium: {
        label: "Riesgo medio",
        blurb: "Se detectaron algunas señales de riesgo. Es posible que a veces veas CAPTCHAs o pasos de verificación adicionales.",
      },
      high: {
        label: "Riesgo alto",
        blurb: "Se detectaron señales de riesgo importantes. Algunos sitios pueden bloquear esta IP o pedir una verificación adicional.",
      },
    },
    flaggedBlurb: "Se detectó una conexión VPN, proxy o Tor, por lo que muchos sitios tratarán esta IP como de alto riesgo.",
    errorTitle: "No pudimos analizar esta IP",
    errorText: "El servicio de reputación no respondió. Espera un momento y vuelve a intentarlo.",
    retry: "Reintentar",
    ipLabel: "IP analizada",
    signalsTitle: "Señales analizadas",
    status: { pass: "Correcto", warn: "Revisar", fail: "Marcada", info: "Info" },
    signals: {
      type: {
        label: "Tipo de conexión",
        residential: "Las IP residenciales asignadas por un proveedor doméstico son el tipo de conexión más fiable.",
        business: "Las conexiones de empresa suelen ser fiables, aunque una misma IP puede compartirse entre muchos empleados.",
        mobile: "Las IP de operadores móviles las comparten muchos usuarios a la vez (CGNAT), por lo que los sitios suelen ser indulgentes con ellas.",
        hosting: "Las IP de hosting y centros de datos las usan a menudo bots y proxies, así que los sitios desconfían más de ellas.",
        vpn: "Esta dirección pertenece a un servicio VPN. Muchos sitios añaden comprobaciones para el tráfico VPN.",
        tor: "Los nodos de salida de Tor son públicos y anónimos, y suelen bloquearse o someterse a verificaciones.",
        proxy: "Se sabe que esta dirección reenvía tráfico de otros usuarios como proxy.",
        unknown: "No se pudo clasificar el tipo de conexión de esta dirección.",
      },
      vpn: {
        label: "VPN / proxy",
        yes: "Detectado",
        no: "No detectado",
        yesText: "Tu tráfico parece salir por un servidor VPN o proxy en lugar de hacerlo directamente desde tu proveedor.",
        noText: "No se detectó ninguna VPN ni proxy. Tu tráfico parece venir directamente de tu proveedor.",
      },
      tor: {
        label: "Nodo de salida Tor",
        yes: "Sí",
        no: "No",
        yesText: "Esta IP es un nodo de salida de Tor, una de las señales de riesgo más fuertes para los sitios web.",
        noText: "Esta IP no figura como nodo de salida de Tor.",
      },
      provider: {
        label: "Proveedor de red",
        text: "La organización propietaria de este rango de IP. Los proveedores domésticos puntúan mejor que las empresas de hosting.",
      },
      location: {
        label: "Ubicación de la IP",
        text: "Los sitios la comparan con el país de tu cuenta o de facturación. Una discrepancia puede activar controles adicionales.",
      },
    },
    typeNames: {
      residential: "Residencial",
      business: "Empresa",
      mobile: "Móvil",
      hosting: "Centro de datos",
      vpn: "VPN",
      tor: "Tor",
      proxy: "Proxy",
      unknown: "Desconocido",
    },
    fullReport: "Informe de riesgo completo",
    disclaimer: "Los resultados se basan en datos de reputación IP de terceros y son una estimación, no un juicio sobre ti.",
  },
  links: {
    details: "Ver todos los detalles de tu IP",
    speed: "Haz un test de velocidad",
  },
  bands: {
    kicker: "Guía de puntuación",
    title: "Cómo interpretar la puntuación de riesgo de tu IP",
    lead: "La puntuación va de 0 (limpia) a 100 (riesgo alto). Esto es lo que significa cada rango.",
    items: [
      { range: "0 – 33", label: "Riesgo bajo", desc: "Conexión residencial o de empresa normal, sin historial de abuso destacable. Aceptada por la mayoría de los sitios." },
      { range: "34 – 66", label: "Riesgo medio", desc: "Algunas señales de riesgo, como una IP compartida o de hosting, uso ocasional de proxy o reportes de abuso antiguos." },
      { range: "67 – 100", label: "Riesgo alto", desc: "Fuertes señales de proxy, VPN, Tor o abuso. A menudo se bloquea o se somete a controles de seguridad." },
    ],
  },
  factors: {
    kicker: "Señales",
    title: "¿Qué influye en la puntuación de riesgo de tu IP?",
    lead: "Varias señales determinan si una dirección IP parece fiable o arriesgada.",
    items: [
      {
        title: "Uso de VPN y proxy",
        text: "El tráfico que pasa por una VPN, un proxy o un nodo de salida de Tor es la causa más habitual de una puntuación de riesgo alta.",
      },
      {
        title: "IP de centros de datos",
        text: "Las direcciones de empresas de hosting y nube puntúan más alto que las conexiones residenciales, porque allí suelen ejecutarse bots.",
      },
      {
        title: "Listas negras y abusos previos",
        text: "Si una IP (o su rango) se usó para spam, ataques o fraude, puede aparecer en listas negras y seguir marcada durante un tiempo.",
      },
      {
        title: "Actividad de bots",
        text: "El scraping, el relleno de credenciales y otros comportamientos automatizados desde una IP aumentan su riesgo de reputación.",
      },
      {
        title: "IP compartidas",
        text: "Las redes móviles y algunos proveedores colocan a muchos clientes tras una sola IP pública (CGNAT), así que un solo usuario abusivo puede perjudicar a todos.",
      },
      {
        title: "Coherencia de la ubicación",
        text: "Los sistemas antifraude comparan el país de la IP con tu cuenta, tu tarjeta o tu zona horaria. Una discrepancia no prueba un fraude, pero suma riesgo.",
      },
    ],
  },
  tips: {
    kicker: "Soluciones",
    title: "Cómo bajar una puntuación de riesgo IP alta",
    lead: "Si los sitios te bloquean o te muestran CAPTCHAs constantemente, estos pasos suelen ayudar.",
    steps: [
      { title: "Desactiva tu VPN o proxy", text: "Desconéctate y vuelve a comprobarlo. Si la puntuación baja, la causa era la IP del servidor VPN." },
      { title: "Consigue una IP nueva", text: "Reinicia el router para obtener una nueva IP dinámica o pide una dirección nueva a tu proveedor." },
      { title: "Analiza tus dispositivos", text: "Un malware o un dispositivo comprometido puede enviar spam o ataques desde tu IP. Analiza todos tus dispositivos." },
      { title: "Protege tu WiFi", text: "Usa WPA2 o WPA3 con una contraseña robusta para que nadie pueda usar tu conexión de forma indebida." },
      { title: "Solicita la exclusión", text: "Si tu IP está en una lista negra, la mayoría de las listas permiten solicitar su eliminación una vez resuelto el problema." },
    ],
  },
  faqTitle: "Preguntas frecuentes sobre el riesgo de IP",
  faqLead: "Respuestas a las dudas habituales sobre la reputación y la puntuación de riesgo de una IP.",
  faq: [
    {
      q: "¿Qué es la puntuación de riesgo de una IP?",
      a: "Es un número de 0 a 100 que estima la probabilidad de que una dirección IP esté asociada a fraude, bots, proxies, VPN o abusos previos. Cuanto más baja, más limpia y fiable es la conexión; cuanto más alta, más señales de riesgo hay.",
    },
    {
      q: "¿Cuál es una buena puntuación de riesgo IP?",
      a: "Una puntuación de 0 a 33 se considera de riesgo bajo y es típica de una conexión doméstica (residencial). De 34 a 66 es riesgo medio, y de 67 a 100 es riesgo alto, con más probabilidades de que los sitios la bloqueen o muestren controles de seguridad.",
    },
    {
      q: "¿Por qué mi IP aparece como proxy o VPN?",
      a: "Si te conectas a través de una VPN, un proxy o Tor, tu tráfico sale por la IP de ese servicio, que se detecta y se marca. Las IP de centros de datos y hosting también suelen clasificarse como proxy aunque no estés usando uno.",
    },
    {
      q: "¿Cómo puedo bajar la puntuación de riesgo de mi IP?",
      a: "Desactiva cualquier VPN o proxy, usa una conexión residencial normal de tu proveedor y solicita una IP nueva (reinicia el router si es dinámica o contacta con tu proveedor). Mantener tus dispositivos libres de malware y evitar actividades abusivas también ayuda a mantener la puntuación baja.",
    },
    {
      q: "¿Es peligrosa para mí una puntuación de riesgo alta?",
      a: "No directamente. Sobre todo significa que algunos sitios y servicios pueden bloquearte, pedirte verificación adicional (como CAPTCHAs) o limitar el acceso, porque consideran la IP de mayor riesgo. No revela tu identidad.",
    },
    {
      q: "¿Por qué los sitios web comprueban la reputación de mi IP?",
      a: "Bancos, tiendas en línea, servicios de streaming y páginas de inicio de sesión usan la reputación IP para frenar el fraude, las cuentas falsas y los bots. Una IP limpia te deja pasar sin problemas, mientras que una de riesgo puede activar CAPTCHAs, verificaciones adicionales o un bloqueo.",
    },
  ],
};

const ar: IpRiskMessages = {
  meta: {
    title: "درجة مخاطر IP: فحص سمعة عنوان IP وكشف VPN والبروكسي",
    description:
      "افحص درجة مخاطر عنوان IP مجانًا: اعرف إن كان عنوانك مصنّفًا كبروكسي أو VPN أو Tor أو مركز بيانات، مع نوع الاتصال ودرجة احتيال من 0 إلى 100. سريع وخاص.",
    keywords: [
      "درجة مخاطر ip",
      "فحص سمعة ip",
      "فحص عنوان ip",
      "هل عنوان ip محظور",
      "كشف vpn",
      "كشف البروكسي",
      "درجة الاحتيال ip",
      "القائمة السوداء ip",
    ],
  },
  breadcrumb: "درجة مخاطر IP",
  hero: {
    eyebrow: "فحص سمعة عنوان IP",
    titleA: "افحص",
    titleB: "درجة مخاطر عنوان IP",
    lead: "اعرف فورًا ما إذا كان عنوان IP الخاص بك نظيفًا أو مصنّفًا كبروكسي أو VPN أو عالي المخاطر، مع درجة من 0 إلى 100 ونوع اتصالك. مجاني وخاص.",
  },
  widget: {
    title: "فحص أمان عنوان IP",
    checking: "جارٍ الفحص…",
    checkingText: "جارٍ تحليل سمعة عنوان IP الخاص بك",
    riskScore: "درجة المخاطر",
    scaleLow: "نظيف",
    scaleHigh: "مخاطر عالية",
    noScore: "غير مُقيَّم",
    levels: {
      low: {
        label: "مخاطر منخفضة",
        blurb: "يبدو هذا العنوان اتصالًا عاديًا بلا مؤشرات مخاطر تُذكر، وستثق به معظم المواقع.",
      },
      medium: {
        label: "مخاطر متوسطة",
        blurb: "رُصدت بعض مؤشرات المخاطر، وقد تظهر لك أحيانًا اختبارات CAPTCHA أو خطوات تحقق إضافية.",
      },
      high: {
        label: "مخاطر عالية",
        blurb: "رُصدت مؤشرات مخاطر قوية، وقد تحظر بعض المواقع هذا العنوان أو تطلب تحققًا إضافيًا.",
      },
    },
    flaggedBlurb: "رُصد اتصال عبر VPN أو بروكسي أو Tor، لذا ستتعامل مواقع كثيرة مع هذا العنوان على أنه عالي المخاطر.",
    errorTitle: "تعذّر تحليل هذا العنوان",
    errorText: "لم تستجب خدمة فحص السمعة. انتظر قليلًا ثم أعد المحاولة.",
    retry: "إعادة المحاولة",
    ipLabel: "العنوان المفحوص",
    signalsTitle: "المؤشرات التي فحصناها",
    status: { pass: "سليم", warn: "للمراجعة", fail: "مُبلَّغ عنه", info: "معلومة" },
    signals: {
      type: {
        label: "نوع الاتصال",
        residential: "عناوين الإنترنت المنزلي التي يخصّصها مزود خدمة للأفراد هي أكثر أنواع الاتصال موثوقية.",
        business: "اتصالات الشركات موثوقة عمومًا، وإن كان العنوان الواحد قد يُستخدم من قِبل موظفين كثيرين.",
        mobile: "يتشارك مستخدمون كثيرون عناوين شبكات الهاتف المحمول في الوقت نفسه (CGNAT)، لذا تتساهل معها المواقع عادةً.",
        hosting: "تُستخدم عناوين الاستضافة ومراكز البيانات كثيرًا من قِبل البرامج الآلية والبروكسي، لذا تتعامل معها المواقع بحذر أكبر.",
        vpn: "ينتمي هذا العنوان إلى خدمة VPN، وتضيف مواقع كثيرة عمليات تحقق إضافية لحركة VPN.",
        tor: "نقاط الخروج في شبكة Tor عامة ومجهولة الهوية، وكثيرًا ما تُحظر أو تخضع للتحقق.",
        proxy: "يُعرف هذا العنوان بأنه يمرّر حركة بيانات مستخدمين آخرين بصفته بروكسي.",
        unknown: "تعذّر تصنيف نوع الاتصال لهذا العنوان.",
      },
      vpn: {
        label: "VPN / بروكسي",
        yes: "مكتشَف",
        no: "غير مكتشَف",
        yesText: "يبدو أن حركة بياناتك تخرج عبر خادم VPN أو بروكسي بدلًا من الخروج مباشرةً من مزود الخدمة.",
        noText: "لم يُكتشف أي VPN أو بروكسي، ويبدو أن حركة بياناتك تأتي مباشرةً من مزود الخدمة.",
      },
      tor: {
        label: "نقطة خروج Tor",
        yes: "نعم",
        no: "لا",
        yesText: "هذا العنوان نقطة خروج في شبكة Tor، وهو من أقوى مؤشرات المخاطر لدى المواقع.",
        noText: "هذا العنوان غير مُدرج كنقطة خروج في شبكة Tor.",
      },
      provider: {
        label: "مزود الشبكة",
        text: "الجهة المالكة لنطاق العناوين هذا. تحصل شركات الإنترنت المنزلي على درجات أفضل من شركات الاستضافة.",
      },
      location: {
        label: "موقع عنوان IP",
        text: "تقارن المواقع هذا الموقع بدولة حسابك أو بطاقتك، وقد يؤدي عدم التطابق إلى عمليات تحقق إضافية.",
      },
    },
    typeNames: {
      residential: "منزلي",
      business: "شركات",
      mobile: "هاتف محمول",
      hosting: "مركز بيانات",
      vpn: "VPN",
      tor: "Tor",
      proxy: "بروكسي",
      unknown: "غير معروف",
    },
    fullReport: "التقرير الكامل للمخاطر",
    disclaimer: "تستند النتائج إلى بيانات سمعة عناوين IP من جهات خارجية، وهي تقدير وليست حكمًا عليك.",
  },
  links: {
    details: "عرض كل تفاصيل عنوان IP",
    speed: "اختبر سرعة الإنترنت لديك",
  },
  bands: {
    kicker: "دليل الدرجات",
    title: "كيف تقرأ درجة مخاطر عنوان IP",
    lead: "تتراوح الدرجة بين 0 (نظيف) و100 (مخاطر عالية). إليك معنى كل نطاق.",
    items: [
      { range: "0 – 33", label: "مخاطر منخفضة", desc: "اتصال منزلي أو تجاري عادي بلا سجل إساءة يُذكر، وتقبله معظم المواقع." },
      { range: "34 – 66", label: "مخاطر متوسطة", desc: "بعض مؤشرات المخاطر، مثل عنوان مشترك أو تابع لاستضافة، أو استخدام محدود للبروكسي، أو بلاغات إساءة قديمة." },
      { range: "67 – 100", label: "مخاطر عالية", desc: "مؤشرات قوية على بروكسي أو VPN أو Tor أو إساءة، وغالبًا ما يُحظر العنوان أو يخضع لفحوصات أمنية إضافية." },
    ],
  },
  factors: {
    kicker: "المؤشرات",
    title: "ما الذي يؤثّر في درجة مخاطر عنوان IP؟",
    lead: "تحدّد عدة مؤشرات ما إذا كان عنوان IP يبدو موثوقًا أو محفوفًا بالمخاطر.",
    items: [
      {
        title: "استخدام VPN والبروكسي",
        text: "مرور حركة البيانات عبر VPN أو بروكسي أو نقطة خروج Tor هو السبب الأكثر شيوعًا لارتفاع درجة المخاطر.",
      },
      {
        title: "عناوين مراكز البيانات",
        text: "تحصل العناوين التابعة لشركات الاستضافة والخدمات السحابية على درجات أعلى من الاتصالات المنزلية، لأن البرامج الآلية تعمل منها غالبًا.",
      },
      {
        title: "القوائم السوداء والإساءات السابقة",
        text: "إذا استُخدم العنوان (أو نطاقه) في إرسال رسائل مزعجة أو هجمات أو احتيال، فقد يُدرج في القوائم السوداء ويبقى مُبلَّغًا عنه لفترة.",
      },
      {
        title: "نشاط البرامج الآلية",
        text: "يرفع جمع البيانات الآلي ومحاولات تسجيل الدخول بكلمات مرور مسروقة وغيرها من الأنشطة الآلية مستوى مخاطر سمعة العنوان.",
      },
      {
        title: "العناوين المشتركة",
        text: "تضع شبكات الهاتف المحمول وبعض المزودين عملاء كثيرين خلف عنوان عام واحد (CGNAT)، فيمكن لمستخدم مسيء واحد أن يضر بالجميع.",
      },
      {
        title: "اتساق الموقع",
        text: "تقارن أنظمة مكافحة الاحتيال دولة عنوان IP بدولة حسابك أو بطاقتك أو منطقتك الزمنية. وعدم التطابق ليس دليلًا على الاحتيال لكنه يزيد المخاطر.",
      },
    ],
  },
  tips: {
    kicker: "الحلول",
    title: "كيف تخفض درجة مخاطر عنوان IP المرتفعة",
    lead: "إذا كانت المواقع تحظرك أو تعرض لك اختبارات CAPTCHA باستمرار، فهذه الخطوات تساعد عادةً.",
    steps: [
      { title: "أوقف VPN أو البروكسي", text: "افصل الاتصال ثم أعد الفحص. إذا انخفضت الدرجة، فإن عنوان خادم VPN هو السبب." },
      { title: "احصل على عنوان IP جديد", text: "أعد تشغيل الراوتر للحصول على عنوان ديناميكي جديد، أو اطلب عنوانًا جديدًا من مزود الخدمة." },
      { title: "افحص أجهزتك", text: "قد ترسل البرمجيات الخبيثة أو الأجهزة المخترقة رسائل مزعجة أو هجمات من عنوانك. افحص كل أجهزتك ببرنامج حماية." },
      { title: "أمّن شبكة WiFi", text: "استخدم تشفير WPA2 أو WPA3 مع كلمة مرور قوية حتى لا يتمكن أحد من إساءة استخدام اتصالك." },
      { title: "اطلب الإزالة من القوائم السوداء", text: "إذا كان عنوانك مدرجًا في قائمة سوداء، فإن معظم القوائم تتيح طلب الإزالة بعد حل المشكلة." },
    ],
  },
  faqTitle: "أسئلة شائعة حول درجة مخاطر IP",
  faqLead: "إجابات عن الأسئلة الشائعة حول سمعة عناوين IP ودرجات المخاطر.",
  faq: [
    {
      q: "ما هي درجة مخاطر عنوان IP؟",
      a: "درجة مخاطر IP رقم بين 0 و100 يقدّر احتمال ارتباط عنوان IP بالاحتيال أو البرامج الآلية أو البروكسي أو VPN أو إساءات سابقة. كلما انخفضت الدرجة كان الاتصال أنظف وأكثر موثوقية، وكلما ارتفعت زادت مؤشرات المخاطر.",
    },
    {
      q: "ما هي درجة المخاطر الجيدة لعنوان IP؟",
      a: "تُعدّ الدرجة من 0 إلى 33 منخفضة المخاطر، وهي معتادة في اتصالات الإنترنت المنزلية. والدرجة من 34 إلى 66 متوسطة المخاطر، أما من 67 إلى 100 فهي عالية المخاطر ويزداد معها احتمال الحظر أو ظهور فحوصات أمنية إضافية.",
    },
    {
      q: "لماذا يُصنَّف عنوان IP الخاص بي كبروكسي أو VPN؟",
      a: "إذا كنت متصلًا عبر VPN أو بروكسي أو Tor، فإن حركة بياناتك تخرج من عنوان تلك الخدمة، فيُكتشف ويُصنَّف. كما تُصنَّف عناوين مراكز البيانات والاستضافة غالبًا كبروكسي حتى إن لم تكن تستخدم واحدًا.",
    },
    {
      q: "كيف يمكنني خفض درجة مخاطر عنوان IP؟",
      a: "أوقف أي VPN أو بروكسي، واستخدم اتصالًا منزليًا عاديًا من مزود الخدمة، واطلب عنوانًا جديدًا (بإعادة تشغيل الراوتر إذا كان العنوان ديناميكيًا أو بالتواصل مع المزود). كما يساعد الحفاظ على أجهزتك خالية من البرمجيات الخبيثة وتجنّب الأنشطة المسيئة على إبقاء الدرجة منخفضة.",
    },
    {
      q: "هل تشكّل درجة المخاطر العالية خطرًا عليّ؟",
      a: "ليس بشكل مباشر. فهي تعني أساسًا أن بعض المواقع والخدمات قد تحظرك أو تطلب تحققًا إضافيًا (مثل CAPTCHA) أو تقيّد وصولك، لأنها تعدّ العنوان أعلى خطورة. ولا تكشف هذه الدرجة عن هويتك.",
    },
    {
      q: "لماذا تفحص المواقع سمعة عنوان IP الخاص بي؟",
      a: "تستخدم البنوك والمتاجر الإلكترونية وخدمات البث وصفحات تسجيل الدخول سمعة عناوين IP للحد من الاحتيال والحسابات الوهمية والبرامج الآلية. فالعنوان النظيف يتيح لك المرور بسلاسة، بينما قد يؤدي العنوان الخطر إلى اختبارات CAPTCHA أو تحقق إضافي أو حظر.",
    },
  ],
};

const ru: IpRiskMessages = {
  meta: {
    title: "Оценка риска IP: проверка репутации, VPN и прокси",
    description:
      "Бесплатно проверьте оценку риска своего IP: определяется ли адрес как прокси, VPN, Tor или дата-центр, тип подключения и fraud score от 0 до 100. Быстро и анонимно.",
    keywords: [
      "проверка ip на риск",
      "репутация ip",
      "проверить ip на чёрные списки",
      "fraud score ip",
      "определение vpn",
      "определение прокси",
      "чистый ли мой ip",
      "проверка ip адреса",
    ],
  },
  breadcrumb: "Оценка риска IP",
  hero: {
    eyebrow: "Проверка репутации IP",
    titleA: "Узнайте",
    titleB: "оценку риска вашего IP",
    lead: "Мгновенно проверьте, чист ли ваш IP-адрес или он помечен как прокси, VPN или адрес с высоким риском. Оценка от 0 до 100 и тип подключения — бесплатно и конфиденциально.",
  },
  widget: {
    title: "Проверка безопасности IP",
    checking: "Проверяем…",
    checkingText: "Анализируем репутацию вашего IP",
    riskScore: "Оценка риска",
    scaleLow: "Чистый",
    scaleHigh: "Высокий риск",
    noScore: "Нет оценки",
    levels: {
      low: {
        label: "Низкий риск",
        blurb: "Этот IP похож на обычное подключение без заметных признаков риска. Большинство сайтов будут ему доверять.",
      },
      medium: {
        label: "Средний риск",
        blurb: "Обнаружены некоторые признаки риска. Иногда вы можете видеть CAPTCHA или дополнительные проверки.",
      },
      high: {
        label: "Высокий риск",
        blurb: "Обнаружены серьёзные признаки риска. Некоторые сайты могут блокировать этот IP или требовать дополнительную проверку.",
      },
    },
    flaggedBlurb: "Обнаружено подключение через VPN, прокси или Tor, поэтому многие сайты будут считать этот IP высокорисковым.",
    errorTitle: "Не удалось проанализировать этот IP",
    errorText: "Сервис проверки репутации не ответил. Подождите немного и попробуйте снова.",
    retry: "Повторить",
    ipLabel: "Проверенный IP",
    signalsTitle: "Проверенные признаки",
    status: { pass: "В норме", warn: "Внимание", fail: "Риск", info: "Инфо" },
    signals: {
      type: {
        label: "Тип подключения",
        residential: "Домашние IP-адреса, выданные провайдером для частных клиентов, — самый надёжный тип подключения.",
        business: "Корпоративным подключениям обычно доверяют, хотя один IP может использоваться множеством сотрудников.",
        mobile: "IP мобильных операторов одновременно используют многие абоненты (CGNAT), поэтому сайты обычно относятся к ним лояльно.",
        hosting: "IP хостингов и дата-центров часто используют боты и прокси, поэтому сайты относятся к ним настороженно.",
        vpn: "Этот адрес принадлежит VPN-сервису. Многие сайты дополнительно проверяют VPN-трафик.",
        tor: "Выходные узлы Tor публичны и анонимны, поэтому их часто блокируют или проверяют.",
        proxy: "Известно, что этот адрес перенаправляет трафик других пользователей как прокси.",
        unknown: "Не удалось определить тип подключения для этого адреса.",
      },
      vpn: {
        label: "VPN / прокси",
        yes: "Обнаружен",
        no: "Не обнаружен",
        yesText: "Похоже, ваш трафик выходит в сеть через VPN или прокси-сервер, а не напрямую от провайдера.",
        noText: "VPN и прокси не обнаружены. Похоже, трафик идёт напрямую от вашего провайдера.",
      },
      tor: {
        label: "Выходной узел Tor",
        yes: "Да",
        no: "Нет",
        yesText: "Этот IP — выходной узел Tor, один из самых сильных признаков риска для сайтов.",
        noText: "Этот IP не значится в списке выходных узлов Tor.",
      },
      provider: {
        label: "Сетевой провайдер",
        text: "Организация, которой принадлежит диапазон IP. У домашних провайдеров оценка лучше, чем у хостинг-компаний.",
      },
      location: {
        label: "Местоположение IP",
        text: "Сайты сравнивают его со страной вашего аккаунта или карты. Несовпадение может вызвать дополнительные проверки.",
      },
    },
    typeNames: {
      residential: "Домашний",
      business: "Корпоративный",
      mobile: "Мобильный",
      hosting: "Дата-центр",
      vpn: "VPN",
      tor: "Tor",
      proxy: "Прокси",
      unknown: "Неизвестно",
    },
    fullReport: "Полный отчёт о риске",
    disclaimer: "Результаты основаны на сторонних данных о репутации IP и являются оценкой, а не суждением о вас.",
  },
  links: {
    details: "Все сведения о вашем IP",
    speed: "Проверить скорость интернета",
  },
  bands: {
    kicker: "Шкала",
    title: "Как понимать оценку риска IP",
    lead: "Оценка варьируется от 0 (чистый) до 100 (высокий риск). Вот что означает каждый диапазон.",
    items: [
      { range: "0 – 33", label: "Низкий риск", desc: "Обычное домашнее или корпоративное подключение без заметной истории злоупотреблений. Большинство сайтов ему доверяют." },
      { range: "34 – 66", label: "Средний риск", desc: "Есть признаки риска: общий или хостинговый IP, эпизодическое использование прокси или старые жалобы." },
      { range: "67 – 100", label: "Высокий риск", desc: "Явные признаки прокси, VPN, Tor или злоупотреблений. Такие IP часто блокируют или дополнительно проверяют." },
    ],
  },
  factors: {
    kicker: "Признаки",
    title: "Что влияет на оценку риска IP?",
    lead: "Несколько признаков определяют, выглядит ли IP-адрес надёжным или рискованным.",
    items: [
      {
        title: "VPN и прокси",
        text: "Трафик через VPN, прокси или выходной узел Tor — самая частая причина высокой оценки риска.",
      },
      {
        title: "IP дата-центров",
        text: "Адреса хостинг- и облачных провайдеров получают более высокую оценку, чем домашние подключения, ведь именно там часто работают боты.",
      },
      {
        title: "Чёрные списки и прошлые нарушения",
        text: "Если IP (или его диапазон) использовался для спама, атак или мошенничества, он может попасть в чёрные списки и оставаться помеченным какое-то время.",
      },
      {
        title: "Активность ботов",
        text: "Парсинг, подбор учётных данных и другие автоматизированные действия с IP повышают риск для его репутации.",
      },
      {
        title: "Общие IP-адреса",
        text: "Мобильные сети и некоторые провайдеры размещают множество клиентов за одним внешним IP (CGNAT), поэтому один нарушитель может навредить всем.",
      },
      {
        title: "Соответствие местоположения",
        text: "Антифрод-системы сравнивают страну IP со страной аккаунта, карты или вашим часовым поясом. Несовпадение не доказывает мошенничество, но повышает риск.",
      },
    ],
  },
  tips: {
    kicker: "Решение",
    title: "Как снизить высокую оценку риска IP",
    lead: "Если сайты постоянно блокируют вас или показывают CAPTCHA, обычно помогают эти шаги.",
    steps: [
      { title: "Отключите VPN или прокси", text: "Отключитесь и проверьте снова. Если оценка снизилась, причиной был IP VPN-сервера." },
      { title: "Получите новый IP", text: "Перезагрузите роутер, чтобы получить новый динамический IP, или попросите провайдера выдать другой адрес." },
      { title: "Проверьте устройства", text: "Вредоносная программа или взломанное устройство могут рассылать спам или атаки с вашего IP. Проверьте все устройства антивирусом." },
      { title: "Защитите WiFi", text: "Используйте WPA2 или WPA3 с надёжным паролем, чтобы посторонние не могли злоупотреблять вашим подключением." },
      { title: "Запросите исключение", text: "Если ваш IP попал в чёрный список, большинство списков позволяют подать запрос на удаление после устранения проблемы." },
    ],
  },
  faqTitle: "Вопросы и ответы об оценке риска IP",
  faqLead: "Ответы на частые вопросы о репутации IP-адресов и оценке риска.",
  faq: [
    {
      q: "Что такое оценка риска IP?",
      a: "Оценка риска IP — это число от 0 до 100, показывающее, насколько вероятно, что IP-адрес связан с мошенничеством, ботами, прокси, VPN или прошлыми нарушениями. Чем ниже оценка, тем чище и надёжнее подключение; чем выше — тем больше признаков риска.",
    },
    {
      q: "Какая оценка риска IP считается хорошей?",
      a: "Оценка от 0 до 33 означает низкий риск и типична для обычного домашнего подключения. От 34 до 66 — средний риск, а от 67 до 100 — высокий: такие адреса сайты чаще блокируют или дополнительно проверяют.",
    },
    {
      q: "Почему мой IP определяется как прокси или VPN?",
      a: "Если вы подключены через VPN, прокси или Tor, трафик выходит с IP этого сервиса, который распознаётся и помечается. IP дата-центров и хостингов тоже часто помечаются как прокси, даже если вы им не пользуетесь.",
    },
    {
      q: "Как снизить оценку риска своего IP?",
      a: "Отключите VPN или прокси, пользуйтесь обычным домашним подключением от провайдера и получите новый IP (перезагрузите роутер, если адрес динамический, или обратитесь к провайдеру). Отсутствие вредоносных программ на устройствах и отказ от злоупотреблений также помогают сохранять низкую оценку.",
    },
    {
      q: "Опасна ли для меня высокая оценка риска IP?",
      a: "Напрямую — нет. В основном это значит, что некоторые сайты и сервисы могут блокировать вас, требовать дополнительную проверку (например, CAPTCHA) или ограничивать доступ, считая IP более рискованным. Вашу личность оценка не раскрывает.",
    },
    {
      q: "Зачем сайты проверяют репутацию моего IP?",
      a: "Банки, интернет-магазины, стриминговые сервисы и страницы входа используют репутацию IP, чтобы бороться с мошенничеством, фейковыми аккаунтами и ботами. С чистым IP всё проходит гладко, а рискованный может вызвать CAPTCHA, дополнительную проверку или блокировку.",
    },
  ],
};

export const ipRiskMessages: Record<Locale, IpRiskMessages> = { en, fr, es, ar, ru };
