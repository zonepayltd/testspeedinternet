---
title: "Adresse IP publique ou privée : quelle différence ?"
seoTitle: "Adresse IP publique ou privée : les différences clés"
description: "Adresse IP publique ou privée : définition, plages d'IP privées, rôle du NAT et comment trouver chacune sur Windows, Mac et smartphone."
excerpt: "Votre routeur a une seule adresse IP publique visible sur internet, tandis que chaque appareil du foyer reçoit sa propre IP privée. Voici comment les deux fonctionnent ensemble et comment les trouver."
category: "Privacy & Security"
tags: ["adresse ip", "réseau", "vie privée", "nat"]
keywords: ["adresse ip publique ou privée", "c'est quoi une adresse ip privée", "quelle est mon ip publique", "plage d'adresses ip privées", "comment trouver mon adresse ip"]
date: "2026-11-06"
coverAlt: "Schéma d'un routeur domestique avec une adresse IP publique tournée vers internet et plusieurs appareils dotés d'adresses IP privées sur le réseau local"
faq:
  - q: "Quelle est la différence entre une adresse IP publique et une adresse IP privée ?"
    a: "Une adresse IP publique est attribuée par votre fournisseur d'accès et identifie votre connexion sur internet. Une adresse IP privée est attribuée par votre routeur à chaque appareil de votre réseau domestique et ne fonctionne qu'à l'intérieur de ce réseau."
  - q: "Peut-on me localiser grâce à mon IP publique ?"
    a: "Une IP publique révèle généralement votre localisation approximative, comme votre ville ou votre région, ainsi que votre fournisseur d'accès, mais pas votre adresse postale. Seul votre FAI peut relier l'IP à un client précis, et il ne le fait en général que dans le cadre d'une procédure judiciaire."
  - q: "192.168.1.1 est-elle une IP publique ou privée ?"
    a: "192.168.1.1 est une adresse IP privée. Elle est souvent utilisée comme adresse par défaut des routeurs et box internet, et elle n'est pas accessible directement depuis internet."
  - q: "Pourquoi mon adresse IP publique change-t-elle ?"
    a: "La plupart des connexions domestiques utilisent des adresses IP dynamiques, que votre FAI peut réattribuer quand votre routeur redémarre, qu'un bail expire ou que le réseau est reconfiguré. Les IP publiques fixes sont généralement réservées aux offres professionnelles ou proposées en option payante."
  - q: "Tous mes appareils partagent-ils la même IP publique ?"
    a: "Oui, en général. Votre routeur utilise le NAT pour permettre à tous les appareils de votre réseau domestique de partager une seule adresse IPv4 publique, tandis que chaque appareil conserve sa propre IP privée en interne."
---

Une **adresse IP publique** est l'adresse sous laquelle le reste d'internet voit votre connexion ; votre fournisseur d'accès l'attribue à votre routeur. Une **adresse IP privée** est une adresse interne que votre routeur donne à chaque appareil du foyer, comme 192.168.1.23, et qui ne fonctionne que sur votre réseau local. Votre routeur fait la traduction entre les deux, ce qui permet à tous vos téléphones, ordinateurs et téléviseurs de partager une seule adresse publique.

**À retenir**

- Les IP publiques sont uniques dans le monde et joignables sur internet ; les IP privées sont réutilisées dans des millions de foyers et ne sont pas routables en ligne.
- Les plages IPv4 privées sont 10.0.0.0/8, 172.16.0.0/12 et 192.168.0.0/16.
- Le NAT (Network Address Translation, ou traduction d'adresses réseau) de votre routeur relie les appareils privés à internet via une seule IP publique.
- Les sites web voient votre IP publique, qui révèle votre FAI et votre localisation approximative, pas votre adresse exacte.
- Vous pouvez trouver votre IP publique avec un outil de recherche d'IP et votre IP privée dans les paramètres réseau de votre appareil.

## Qu'est-ce qu'une adresse IP publique ?

Tout appareil qui communique directement sur internet a besoin d'une adresse unique pour que les données puissent revenir jusqu'à lui. C'est l'IP publique. Pour un accès internet domestique, votre FAI attribue une adresse IPv4 publique à votre routeur (ou à votre modem), et cette adresse représente l'ensemble de votre foyer en ligne.

Quand vous chargez un site web, le serveur du site voit votre IP publique. Il s'en sert pour vous renvoyer la page, et peut aussi l'utiliser pour estimer votre région, afficher un contenu localisé ou appliquer des contrôles de sécurité.

### IP publique dynamique ou fixe

La plupart des offres grand public utilisent des IP publiques **dynamiques**, qui peuvent changer quand votre routeur redémarre ou quand le FAI fait tourner ses adresses. C'est normal et cela n'a aucun impact au quotidien. Les IP **fixes** (ou statiques) restent identiques et servent surtout aux entreprises qui hébergent des serveurs, gèrent des passerelles VPN ou ont besoin de figurer sur des listes d'autorisation. Les FAI les facturent généralement en supplément.

## Qu'est-ce qu'une adresse IP privée ?

Chez vous, votre routeur joue le rôle d'un petit gestionnaire de réseau. Grâce au **DHCP**, il attribue automatiquement à chaque appareil connecté une adresse IP privée, ainsi que l'adresse du routeur lui-même (la passerelle par défaut) et les réglages DNS.

Ces adresses privées proviennent de plages réservées par les standards d'internet (RFC 1918) spécifiquement aux réseaux locaux. Comme elles ne sont jamais routées sur l'internet public, les mêmes adresses peuvent être réutilisées dans chaque maison, bureau et café du monde sans conflit.

### Plages d'adresses IPv4 privées

| Plage | Notation CIDR | Nombre d'adresses | Où on la rencontre généralement |
|---|---|---|---|
| 10.0.0.0 – 10.255.255.255 | 10.0.0.0/8 | Environ 16,8 millions | Réseaux d'entreprise, certaines box de FAI et systèmes mesh |
| 172.16.0.0 – 172.31.255.255 | 172.16.0.0/12 | Environ 1 million | Réseaux professionnels, Docker et machines virtuelles |
| 192.168.0.0 – 192.168.255.255 | 192.168.0.0/16 | Environ 65 000 | La plupart des routeurs domestiques (192.168.0.x ou 192.168.1.x) |

Quelques autres plages spéciales sont bonnes à connaître. **169.254.x.x** est une adresse de lien local que votre appareil s'attribue lui-même quand il ne parvient pas à joindre un serveur DHCP, ce qui signifie généralement qu'il est connecté au Wi-Fi mais n'obtient pas réellement d'adresse. **127.0.0.1** est le « localhost », qui désigne toujours l'appareil lui-même.

## IP publique vs IP privée : comparatif

| Caractéristique | IP publique | IP privée |
|---|---|---|
| Attribuée par | Votre fournisseur d'accès à internet | Votre routeur (via DHCP) |
| Portée | Mondiale, joignable sur internet | Réseau local uniquement |
| Unicité | Unique dans le monde à un instant donné | Réutilisée dans d'innombrables réseaux |
| Qui la voit | Sites web, applis, serveurs de jeu, serveurs de messagerie | Les appareils du même réseau |
| Exemple | 203.0.113.45 | 192.168.1.23 |
| Change quand | Le FAI la réattribue (dynamique) | Le routeur la réattribue, ou vous définissez une réservation |
| Coût | Incluse dans votre offre ; une IP fixe peut être payante | Gratuite |

## Comment le NAT relie adresses privées et publiques

La **traduction d'adresses réseau (NAT)** explique pourquoi une dizaine d'appareils peuvent partager une seule IP publique. Quand votre ordinateur demande une page web, le routeur remplace l'adresse privée de l'ordinateur par l'IP publique, note quel appareil a fait la demande, puis l'envoie. Quand la réponse revient, le routeur consulte sa table et transmet la réponse au bon appareil.

Le NAT a été introduit en grande partie parce que le monde manquait d'adresses IPv4, dont la limite théorique est d'environ 4,3 milliards. Avantage secondaire : les connexions entrantes non sollicitées ne peuvent pas atteindre directement vos appareils, car le routeur ne sait pas où les envoyer. Cela ne remplace pas un pare-feu, mais réduit l'exposition.

### Quand le NAT pose problème

Le NAT peut gêner tout ce qui a besoin de connexions entrantes : héberger un serveur de jeu, certains jeux en pair-à-pair, l'accès à distance à une caméra domestique ou l'hébergement d'un site personnel. Les joueurs le voient souvent sous la forme d'un type de NAT « Strict » ou « Modéré ». Les solutions : activer l'UPnP, configurer une redirection de ports ou utiliser les réglages jeu ou DMZ de votre routeur. Si le matchmaking en ligne souffre aussi de lag, [lancez un test de débit](/fr) pour vérifier votre ping, et consultez [quel est un bon ping pour jouer](/fr/blog/what-is-a-good-ping-for-gaming) pour connaître les valeurs à viser.

### Et le CGNAT ?

Certains FAI, notamment les opérateurs mobiles, les box 5G et certains fournisseurs satellite, utilisent le **NAT à grande échelle (CGNAT, carrier-grade NAT)**. Votre routeur reçoit alors une adresse issue d'une autre plage partagée (100.64.0.0/10), et de nombreux clients partagent une même IP publique. Si l'adresse WAN affichée dans les réglages de votre routeur ne correspond pas à celle qu'indique un outil de recherche d'IP publique, vous êtes probablement derrière un CGNAT. Cela fonctionne très bien pour la navigation et le streaming, mais rend la redirection de ports impossible sans l'aide du FAI.

## Comment trouver votre IP publique et votre IP privée

### Trouver votre IP publique

Le plus rapide est de consulter notre page [quelle est mon IP](/fr/what-is-my-ip), qui affiche l'adresse publique vue par les sites web, ainsi que votre FAI et votre localisation approximative. L'interface d'administration de votre routeur l'indique aussi généralement comme IP WAN ou IP Internet.

### Trouver votre IP privée sous Windows

1. Appuyez sur **Windows + R**, tapez `cmd` et appuyez sur Entrée.
2. Lancez `ipconfig`.
3. Repérez la ligne **Adresse IPv4** sous votre carte réseau active (Wi-Fi ou Ethernet). La **Passerelle par défaut** correspond à l'IP privée de votre routeur.

### Trouver votre IP privée sous macOS

1. Ouvrez **Réglages Système** > **Réseau** et sélectionnez votre connexion ; l'adresse IP s'affiche sous **Détails**.
2. Ou ouvrez le Terminal et lancez `ipconfig getifaddr en0` (sur la plupart des Mac, en0 correspond au Wi-Fi).

### Trouver votre IP privée sur iPhone et Android

1. **iPhone :** Réglages > Wi-Fi > touchez **(i)** à côté de votre réseau et cherchez **Adresse IP**.
2. **Android :** Paramètres > Réseau et Internet > Wi-Fi > touchez votre réseau et regardez sous **Paramètres avancés** ou **Détails du réseau**. Les noms des menus varient selon le fabricant.

## Vie privée : ce que révèle votre IP publique

Votre IP publique n'est pas une adresse postale, mais elle n'est pas anonyme pour autant. À partir d'une simple IP, n'importe qui peut généralement savoir :

- Quel est votre fournisseur d'accès.
- Votre localisation approximative, souvent la ville ou la région, parfois de façon moins précise.
- Si l'adresse appartient à un réseau résidentiel, un data center, un VPN ou un opérateur mobile.

Seul votre FAI peut associer l'IP à votre compte, et il ne le fait généralement que dans le cadre d'une procédure judiciaire. Les IP servent néanmoins à évaluer le risque de fraude, à limiter le nombre de requêtes et à appliquer des restrictions géographiques. Notre outil de [score de risque IP](/fr/ip-risk-score) montre comment une adresse peut être notée par ces systèmes. Un VPN remplace votre IP publique par l'adresse du serveur VPN ; pour l'impact sur le débit, voir [un VPN ralentit-il internet](/fr/blog/does-a-vpn-slow-down-internet).

Les IP privées, en revanche, ne sont pas du tout visibles par les sites web, et en communiquer une (par exemple « mon ordinateur est en 192.168.1.15 ») ne révèle presque rien à une personne extérieure à votre réseau.

## L'IPv6 change la donne

Avec l'**IPv6**, les adresses sont si nombreuses que chaque appareil peut disposer de sa propre adresse routable dans le monde entier, ce qui réduit le besoin de NAT. La plupart des installations domestiques en IPv6 utilisent tout de même le pare-feu du routeur pour bloquer le trafic entrant non sollicité. L'IPv6 possède aussi ses propres plages locales (comme fe80::/10 pour le lien local et fd00::/8 pour les adresses locales uniques), qui jouent un rôle comparable aux adresses privées IPv4. Aujourd'hui, de nombreux foyers utilisent IPv4 et IPv6 en parallèle.

## En résumé

Votre IP publique est l'identité unique de votre foyer sur internet, attribuée par votre FAI. Vos IP privées sont des étiquettes internes que votre routeur donne à chaque appareil, et le NAT relie les deux pour que tout le foyer puisse partager une seule connexion.

Pour voir l'adresse que voit internet en ce moment, consultez [quelle est mon IP](/fr/what-is-my-ip). Et si votre connexion vous semble lente au passage, [lancez un test de débit gratuit](/fr) pour vérifier le débit descendant, le débit montant et le ping en moins d'une minute.
