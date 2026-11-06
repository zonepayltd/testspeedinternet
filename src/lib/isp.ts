// Turns the raw ISP/organisation names returned by IP-geolocation services
// ("Office National des Postes et Telecommunications ONPT (Maroc Telecom) / IAM",
// "Telefonica De Espana S.a.u.", "Emirates Integrated Telecommunications…")
// into the brand people know ("Maroc Telecom", "Movistar", "du"), plus the
// brand's website, which /api/isp-logo uses to fetch its current logo.

export type IspBrand = { name: string; domain: string | null };

// `wiki` = English Wikipedia page title, used to find the official logo when it differs from `name`.
type Rule = { name: string; domain: string; re?: RegExp; asn?: number[]; wiki?: string };

// Order matters: the first matching rule wins (put specific ones first).
const RULES: Rule[] = [
  // ---- Morocco
  { name: "Maroc Telecom", domain: "iam.ma", re: /maroc ?telecom|\bonpt\b|\biam\b|itissalat al.?maghrib|menara/i, asn: [6713, 36903] },
  { name: "inwi", domain: "inwi.ma", re: /\binwi\b|\bwana\b/i, asn: [36884] },
  { name: "Orange Maroc", domain: "orange.ma", wiki: "Orange Maroc", re: /orange maroc|medi ?telecom|meditel/i, asn: [36925] },
  // ---- Algeria / Tunisia / Egypt
  { name: "Algérie Télécom", domain: "algerietelecom.dz", re: /alg[eé]rie t[eé]l[eé]com/i, asn: [36947] },
  { name: "Djezzy", domain: "djezzy.dz", re: /djezzy|optimum telecom alg/i },
  { name: "Mobilis", domain: "mobilis.dz", re: /mobilis/i },
  { name: "Ooredoo", domain: "ooredoo.com", re: /ooredoo|qtel|wataniya|nedjma/i },
  { name: "Tunisie Telecom", domain: "tunisietelecom.tn", re: /tunisie telecom/i },
  { name: "Orange Tunisie", domain: "orange.tn", re: /orange tunisie/i },
  { name: "Telecom Egypt (WE)", domain: "te.eg", re: /telecom egypt|\bte data\b/i },
  { name: "Vodafone Egypt", domain: "vodafone.com.eg", re: /vodafone (data )?egypt/i },
  { name: "Orange Egypt", domain: "orange.eg", re: /orange egypt|mobinil/i },
  { name: "Etisalat Egypt (e&)", domain: "etisalat.eg", re: /etisalat misr|etisalat egypt/i },
  // ---- Gulf
  { name: "stc", domain: "stc.com.sa", wiki: "Saudi Telecom Company", re: /saudi telecom|\bstc\b/i, asn: [25019, 39891] },
  { name: "Mobily", domain: "mobily.com.sa", re: /mobily|etihad etisalat/i, asn: [35819] },
  { name: "Zain", domain: "zain.com", re: /\bzain\b|mobile telecommunications company/i },
  { name: "du", domain: "du.ae", wiki: "Du (company)", re: /emirates integrated/i, asn: [15802] },
  { name: "e& (Etisalat)", domain: "etisalat.ae", wiki: "E& (company)", re: /emirates telecommunications|etisalat/i, asn: [5384, 8966] },
  { name: "Batelco", domain: "batelco.com", re: /batelco|bahrain telecom/i },
  { name: "Omantel", domain: "omantel.om", re: /omantel|oman telecom/i },
  { name: "Orange Jordan", domain: "orange.jo", re: /orange jordan|jordan telecom/i, asn: [8697] },
  { name: "Umniah", domain: "umniah.com", re: /umniah|al bahrainia al urdunia/i, asn: [9038] },
  // ---- France / Belgium / Switzerland
  { name: "Orange", domain: "orange.fr", wiki: "Orange S.A.", re: /^orange\b|orange s\.?a|france telecom/i, asn: [3215] },
  { name: "Free", domain: "free.fr", wiki: "Free (ISP)", re: /^free\b|free sas|proxad|free mobile/i, asn: [12322, 51207] },
  { name: "SFR", domain: "sfr.fr", re: /\bsfr\b|societe francaise du radiotelephone|numericable/i, asn: [15557, 21502] },
  { name: "Bouygues Telecom", domain: "bouyguestelecom.fr", re: /bouygues/i, asn: [5410] },
  { name: "Proximus", domain: "proximus.be", re: /proximus|belgacom/i },
  { name: "Telenet", domain: "telenet.be", re: /telenet/i },
  { name: "Swisscom", domain: "swisscom.ch", re: /swisscom/i },
  // ---- Spain / Portugal / Italy
  { name: "Movistar", domain: "movistar.es", wiki: "Movistar", re: /telef[oó]nica de espa|movistar/i, asn: [3352] },
  { name: "Vodafone", domain: "vodafone.com", re: /vodafone/i },
  { name: "Orange España", domain: "orange.es", re: /orange espa|france telecom espa|jazztel/i, asn: [12479] },
  { name: "MasOrange", domain: "masorange.es", re: /masorange|masmovil|xfera|yoigo/i },
  { name: "Digi", domain: "digimobil.es", re: /\bdigi\b|digi spain|rcs ?& ?rds/i },
  { name: "MEO", domain: "meo.pt", re: /\bmeo\b|portugal telecom|altice portugal/i },
  { name: "NOS", domain: "nos.pt", re: /\bnos\b comunica/i },
  { name: "TIM", domain: "tim.it", re: /telecom italia|\btim\b/i, asn: [3269] },
  { name: "WindTre", domain: "windtre.it", re: /wind ?tre|wind telecom/i },
  { name: "Fastweb", domain: "fastweb.it", re: /fastweb/i },
  { name: "Iliad", domain: "iliad.it", re: /iliad/i },
  // ---- UK / Ireland / Germany / Netherlands
  { name: "BT", domain: "bt.com", wiki: "BT Group", re: /british telecom|\bbt\b|plusnet|\bee limited\b|^ee\b/i, asn: [2856] },
  { name: "Virgin Media", domain: "virginmedia.com", re: /virgin media|\bntl\b/i, asn: [5089] },
  { name: "Sky", domain: "sky.com", wiki: "Sky Group", re: /\bsky\b|bskyb/i, asn: [5607] },
  { name: "TalkTalk", domain: "talktalk.co.uk", re: /talktalk/i },
  { name: "Three", domain: "three.co.uk", wiki: "Three UK", re: /hutchison 3g|\bthree\b/i },
  { name: "eir", domain: "eir.ie", re: /\beir\b|eircom/i },
  { name: "Telekom", domain: "telekom.de", wiki: "Deutsche Telekom", re: /deutsche telekom|\btelekom\b/i, asn: [3320] },
  { name: "1&1", domain: "1und1.de", re: /1&1|1und1|united internet/i },
  { name: "O2", domain: "o2.co.uk", re: /telefonica germany|telefonica uk|\bo2\b/i },
  { name: "KPN", domain: "kpn.com", re: /\bkpn\b/i },
  { name: "Ziggo", domain: "ziggo.nl", re: /ziggo/i },
  // ---- Russia / CIS
  { name: "Rostelecom", domain: "rt.ru", re: /rostelecom|ростелеком/i, asn: [12389, 12332, 42610] },
  { name: "MTS", domain: "mts.ru", wiki: "MTS (network provider)", re: /mobile telesystems|\bmts\b/i, asn: [8359] },
  { name: "Beeline", domain: "beeline.ru", wiki: "Beeline (brand)", re: /vimpelcom|beeline|\bpjsc vimpel/i, asn: [3216] },
  { name: "MegaFon", domain: "megafon.ru", re: /megafon/i, asn: [31133] },
  { name: "Tele2", domain: "tele2.ru", re: /tele2|t2 mobile/i },
  { name: "Dom.ru", domain: "dom.ru", re: /er-telecom|dom\.ru/i },
  { name: "Kyivstar", domain: "kyivstar.ua", re: /kyivstar/i },
  { name: "Kazakhtelecom", domain: "telecom.kz", re: /kazakhtelecom/i },
  // ---- Americas
  { name: "Xfinity", domain: "xfinity.com", wiki: "Comcast", re: /comcast|xfinity/i, asn: [7922] },
  { name: "Spectrum", domain: "spectrum.com", re: /charter communications|spectrum|time warner cable/i, asn: [20115, 11427] },
  { name: "AT&T", domain: "att.com", re: /\bat&t\b|at ?& ?t|att services/i, asn: [7018] },
  { name: "Verizon", domain: "verizon.com", re: /verizon|cellco/i, asn: [701, 22394] },
  { name: "T-Mobile", domain: "t-mobile.com", re: /t-mobile/i, asn: [21928] },
  { name: "Cox", domain: "cox.com", re: /\bcox\b/i, asn: [22773] },
  { name: "Optimum", domain: "optimum.com", re: /optimum online|cablevision|altice usa/i },
  { name: "CenturyLink (Lumen)", domain: "centurylink.com", re: /centurylink|lumen|qwest/i },
  { name: "Frontier", domain: "frontier.com", re: /frontier comm/i },
  { name: "Google Fiber", domain: "fiber.google.com", re: /google fiber/i },
  { name: "Starlink", domain: "starlink.com", re: /starlink|space exploration tech|spacex/i, asn: [14593] },
  { name: "Bell", domain: "bell.ca", re: /bell canada|\bbell\b/i },
  { name: "Rogers", domain: "rogers.com", re: /rogers/i },
  { name: "Telus", domain: "telus.com", re: /telus/i },
  { name: "Vidéotron", domain: "videotron.com", re: /videotron/i },
  { name: "Telmex", domain: "telmex.com", re: /telmex|uninet/i },
  { name: "Claro", domain: "claro.com.br", re: /\bclaro\b|america movil/i },
  { name: "Vivo", domain: "vivo.com.br", re: /telef[oô]nica brasil|\bvivo\b/i },
  { name: "Totalplay", domain: "totalplay.com.mx", re: /totalplay|total play/i },
  { name: "Izzi", domain: "izzi.mx", re: /\bizzi\b|cablemas/i },
  { name: "Movistar", domain: "movistar.com", re: /telef[oó]nica/i },
  // ---- Turkey / Asia / Africa
  { name: "Türk Telekom", domain: "turktelekom.com.tr", re: /t[uü]rk telekom|ttnet/i },
  { name: "Turkcell", domain: "turkcell.com.tr", re: /turkcell|superonline/i },
  { name: "Jio", domain: "jio.com", re: /reliance jio|\bjio\b/i },
  { name: "Airtel", domain: "airtel.in", re: /bharti|airtel/i },
  { name: "PTCL", domain: "ptcl.com.pk", re: /pakistan telecommunication|\bptcl\b/i },
  { name: "MTN", domain: "mtn.com", re: /\bmtn\b/i },
  { name: "Safaricom", domain: "safaricom.co.ke", re: /safaricom/i },
  { name: "Orange", domain: "orange.com", re: /\borange\b/i },
  // ---- Clouds / VPN exits (useful when someone tests through a VPN)
  { name: "Cloudflare", domain: "cloudflare.com", re: /cloudflare/i, asn: [13335] },
  { name: "Google", domain: "google.com", re: /^google\b/i, asn: [15169, 396982] },
  { name: "Amazon AWS", domain: "aws.amazon.com", re: /amazon|aws/i, asn: [16509, 14618] },
  { name: "Microsoft Azure", domain: "azure.microsoft.com", re: /microsoft/i, asn: [8075] },
  { name: "DigitalOcean", domain: "digitalocean.com", re: /digitalocean/i },
  { name: "OVHcloud", domain: "ovhcloud.com", re: /\bovh\b/i },
  { name: "Hetzner", domain: "hetzner.com", re: /hetzner/i },
  { name: "M247", domain: "m247.com", re: /\bm247\b/i },
];

/** Websites the logo endpoint is allowed to fetch icons from, with their Wikipedia page. */
export const KNOWN_ISP_DOMAINS = new Map(RULES.map((r) => [r.domain, r.wiki || r.name] as const));

const SUFFIXES =
  /\b(s\.?a\.?u?|s\.?a\.?s|s\.?r\.?l|s\.?p\.?a|s\.?l|b\.?v|n\.?v|a\.?g|gmbh|ltd|limited|llc|l\.?l\.?c|inc|corp|corporation|co|company|plc|pjsc|jsc|ojsc|pty|pvt|oy|ab|as)\b\.?/gi;

/** Fallback clean-up for providers that aren't in the list. */
function tidy(raw: string): string {
  let s = raw.trim();
  // "Big Legal Name (Brand) / Short" -> prefer the brand in brackets
  const paren = s.match(/\(([^)]{2,40})\)/);
  if (paren) s = paren[1];
  s = s.split(/\s+\/\s+/)[0];
  s = s.replace(/^AS\d+\s+/i, "").replace(SUFFIXES, "").replace(/[,.\s-]+$/g, "").replace(/\s{2,}/g, " ").trim();
  // Title-case names that arrive in ALL CAPS
  if (s.length > 4 && s === s.toUpperCase())
    s = s.split(" ").map((w) => (w.length <= 3 ? w : w[0] + w.slice(1).toLowerCase())).join(" ");
  return s || raw.trim();
}

/** Brand name + website for an ISP, from the raw name(s) and ASN ("AS36903" or 36903). */
export function ispBrand(isp?: string, org?: string, as?: string | number): IspBrand {
  const names = [isp, org].filter(Boolean).join(" | ");
  const asn = Number(String(as ?? "").match(/\d+/)?.[0] ?? NaN);
  if (Number.isFinite(asn)) {
    const byAsn = RULES.find((r) => r.asn?.includes(asn));
    if (byAsn) return { name: byAsn.name, domain: byAsn.domain };
  }
  if (names) {
    const byName = RULES.find((r) => r.re?.test(names));
    if (byName) return { name: byName.name, domain: byName.domain };
  }
  return { name: tidy(isp || org || ""), domain: null };
}
