---
title: "Changer de DNS accélère-t-il votre connexion ? Mode d'emploi"
seoTitle: "Changer de DNS accélère-t-il Internet ? Mode d'emploi"
description: "Changer de DNS accélère-t-il Internet ? Ce que le DNS influence vraiment, quand en changer et comment le faire sur Windows, Mac, mobile et box."
excerpt: "Changer de DNS n'augmentera pas votre débit descendant, mais peut accélérer le démarrage du chargement des sites et ajouter des fonctions de confidentialité. Ce qu'il faut en attendre et comment changer sans risque."
category: "Troubleshooting"
tags: ["dns", "vitesse de navigation", "réglages box", "dépannage"]
keywords: ["changer dns pour accélérer internet", "changer de dns augmente le débit", "meilleur serveur dns", "changer dns windows", "changer dns mac", "dns le plus rapide"]
date: "2026-11-06"
coverAlt: "Illustration d'un ordinateur envoyant une requête DNS à un serveur DNS qui renvoie l'adresse IP d'un site web, montrant l'influence du DNS sur la vitesse de navigation"
faq:
  - q: "Changer de DNS augmente-t-il le débit internet ?"
    a: "Changer de DNS n'augmente ni votre débit descendant ni votre débit montant. Cela peut en revanche réduire le délai avant qu'un site commence à se charger si votre serveur DNS actuel est lent ou peu fiable, ce qui rend la navigation plus réactive."
  - q: "Quel est le serveur DNS le plus rapide ?"
    a: "Il n'y a pas de DNS le plus rapide pour tout le monde, car la vitesse dépend de la proximité des serveurs du fournisseur. Cloudflare (1.1.1.1), Google (8.8.8.8) et Quad9 (9.9.9.9) sont des options populaires et largement disponibles ; testez-en plusieurs depuis chez vous."
  - q: "Est-ce sans risque de changer de serveur DNS ?"
    a: "Oui, tant que vous choisissez un fournisseur réputé. Votre fournisseur DNS voit les noms de domaine que vous consultez : choisissez-en un avec une politique de confidentialité claire. Le changement est facile à annuler en revenant aux réglages automatiques."
  - q: "Changer de DNS peut-il réduire le ping en jeu ?"
    a: "Non. Le ping en jeu dépend du trajet réseau jusqu'au serveur de jeu, pas du DNS. Le DNS ne sert qu'à trouver l'adresse du serveur, généralement une seule fois au moment de la connexion."
  - q: "Faut-il changer le DNS sur la box ou sur chaque appareil ?"
    a: "Changer le DNS sur la box l'applique d'un coup à tous les appareils du réseau, ce qui est le plus simple pour un foyer. Le changer appareil par appareil est utile si vous ne le voulez que sur un ordinateur ou si vous n'avez pas accès aux réglages de la box."
---

Changer de serveur DNS **n'augmentera ni votre débit descendant ni votre débit montant**, mais cela peut accélérer le démarrage du chargement des sites si votre DNS actuel est lent, et ajouter des fonctions utiles comme le blocage des logiciels malveillants. Le DNS ne gère que la résolution qui transforme un nom comme example.com en adresse IP. Une fois cette résolution faite, votre vitesse dépend de votre connexion, pas de votre fournisseur DNS.

**Réponse rapide**

- Le DNS influence la rapidité avec laquelle une connexion démarre, pas la vitesse à laquelle les données circulent ensuite.
- Changer de DNS aide surtout quand le DNS de votre FAI est lent, peu fiable ou échoue parfois à résoudre certains sites.
- Parmi les résolveurs publics populaires : Cloudflare (1.1.1.1), Google Public DNS (8.8.8.8) et Quad9 (9.9.9.9).
- Changer le DNS sur la box couvre tous les appareils ; le changer sur un seul appareil prend environ une minute.
- Le DNS ne fera pas baisser votre ping en jeu et ne réglera pas les problèmes de mise en mémoire tampon.

## À quoi sert vraiment le DNS

Le **Domain Name System (DNS)** est souvent présenté comme l'annuaire d'Internet. Les ordinateurs se connectent grâce à des adresses IP (comme 93.184.215.14), mais les humains tapent des noms. Quand vous visitez un site, votre appareil demande à un résolveur DNS : « Quelle est l'adresse IP de ce nom ? » Le résolveur trouve la réponse et la renvoie, et ce n'est qu'à ce moment que votre navigateur peut se connecter.

Par défaut, votre box transmet à vos appareils les serveurs DNS de votre fournisseur d'accès. Beaucoup de gens ne les changent jamais, et pour beaucoup, cela fonctionne parfaitement.

### Pourquoi les résolutions sont déjà rapides en général

Les réponses DNS sont **mises en cache**. Votre navigateur, votre système d'exploitation, votre box et le résolveur mémorisent tous les réponses récentes pendant une durée fixée par le propriétaire du site. Quand vous revenez sur un site populaire, il n'y a donc souvent aucune requête réseau. Une nouvelle résolution auprès d'un résolveur proche prend généralement autour de 10 à 50 ms, alors qu'un résolveur lent ou éloigné peut prendre 100 ms ou plus.

Une seule page web peut nécessiter des résolutions pour de nombreux domaines différents (le site lui-même, les serveurs d'images, les polices, les outils de statistiques, les publicités) : un résolveur lent peut donc finir par provoquer une pause perceptible avant l'affichage des pages.

## Quand changer de DNS aide (et quand ça ne sert à rien)

| Situation | Changer de DNS va-t-il aider ? |
|---|---|
| Les sites mettent une ou deux secondes à *commencer* à charger, puis s'affichent vite | Probablement oui |
| Certains sites échouent par intermittence avec « Le serveur DNS ne répond pas » ou « Serveur introuvable » | Probablement oui |
| Vous voulez bloquer automatiquement les domaines malveillants ou de phishing | Oui, avec un résolveur filtrant |
| Vous voulez un DNS chiffré (DNS over HTTPS ou TLS) pour votre confidentialité | Oui, avec un fournisseur qui le propose |
| Votre test de débit affiche un débit descendant ou montant faible | Non |
| Les vidéos se mettent en mémoire tampon ou les téléchargements sont lents | Non |
| Le ping en jeu est élevé ou fait des pics | Non |
| Le Wi-Fi décroche dans certaines pièces | Non |

Si votre problème figure dans la moitié basse de ce tableau, commencez par examiner votre connexion elle-même. [Lancez un test de débit gratuit](/fr) pour vérifier le débit descendant, le débit montant et le ping, puis consultez [pourquoi ma connexion internet est-elle si lente](/fr/blog/why-is-my-internet-so-slow) ou [comment éviter la mise en mémoire tampon](/fr/blog/how-to-stop-buffering).

## Comparatif des serveurs DNS publics populaires

Voici des résolveurs publics gratuits et bien connus. Chacun publie une adresse principale et une adresse secondaire pour la redondance.

| Fournisseur | Adresses IPv4 | Particularités |
|---|---|---|
| Cloudflare | 1.1.1.1 et 1.0.0.1 | Axé sur la vitesse et la confidentialité ; variantes filtrées disponibles (1.1.1.2 bloque les logiciels malveillants) |
| Google Public DNS | 8.8.8.8 et 8.8.4.4 | Vaste réseau mondial, très fiable |
| Quad9 | 9.9.9.9 et 149.112.112.112 | Bloque par défaut les domaines malveillants connus ; organisation à but non lucratif |
| OpenDNS (Cisco) | 208.67.222.222 et 208.67.220.220 | Filtrage de contenu facultatif, options de contrôle parental |

Le plus rapide varie selon votre localisation, et même selon l'heure, car tout dépend de la proximité du serveur le plus proche de chaque fournisseur et de la qualité de l'interconnexion avec votre FAI. Le DNS de votre propre FAI peut parfois être le plus rapide, tout simplement parce qu'il se trouve sur le même réseau. Le seul moyen fiable de le savoir, c'est de tester.

### Comment comparer les temps de réponse DNS

1. Sous Windows, ouvrez l'Invite de commandes ; sous macOS, ouvrez le Terminal.
2. Lancez `nslookup example.com 1.1.1.1`, puis recommencez avec `8.8.8.8` et `9.9.9.9`. Cela confirme que chaque résolveur répond.
3. Sous macOS ou Linux, lancez `dig example.com @1.1.1.1` et regardez la ligne « Query time ». Recommencez pour chaque résolveur, en utilisant un domaine que vous n'avez pas visité récemment pour éviter les résultats en cache.
4. Lancez chaque test plusieurs fois et comparez les temps habituels, pas un résultat isolé.

Des outils de benchmark gratuits peuvent automatiser cette comparaison sur de nombreux résolveurs si vous voulez une analyse plus poussée.

## Comment changer de DNS sous Windows

Sous Windows 11 :

1. Ouvrez **Paramètres** > **Réseau et Internet**.
2. Sélectionnez **Wi-Fi** (ou **Ethernet**), puis cliquez sur votre connexion ou sur **Propriétés du matériel**.
3. À côté de **Attribution du serveur DNS**, cliquez sur **Modifier** et choisissez **Manuel**.
4. Activez **IPv4** et saisissez un DNS préféré et un DNS auxiliaire (par exemple 1.1.1.1 et 1.0.0.1).
5. Si l'option apparaît pour le fournisseur choisi, vous pouvez activer **DNS over HTTPS**.
6. Cliquez sur **Enregistrer**, puis lancez `ipconfig /flushdns` dans l'Invite de commandes pour vider les anciennes entrées en cache.

Sous Windows 10, allez dans **Panneau de configuration** > **Centre Réseau et partage** > **Modifier les paramètres de la carte**, faites un clic droit sur votre connexion, choisissez **Propriétés**, sélectionnez **Protocole Internet version 4 (TCP/IPv4)** et saisissez les adresses sous « Utiliser l'adresse de serveur DNS suivante ».

## Comment changer de DNS sur Mac, iPhone et Android

### macOS

1. Ouvrez **Réglages Système** > **Réseau**.
2. Sélectionnez votre connexion active (Wi-Fi ou Ethernet) et cliquez sur **Détails**.
3. Choisissez **DNS**, cliquez sur **+** et ajoutez vos serveurs préférés. Supprimez les anciens avec **–** si vous le souhaitez.
4. Cliquez sur **OK**. Pour vider le cache, lancez `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder` dans le Terminal.

### iPhone et iPad

1. Allez dans **Réglages** > **Wi-Fi** et touchez le **(i)** à côté de votre réseau.
2. Touchez **Configurer le DNS**, choisissez **Manuel** et ajoutez vos serveurs.
3. Touchez **Enregistrer**. Le réglage ne s'applique qu'à ce réseau Wi-Fi.

### Android

1. Allez dans **Paramètres** > **Réseau et Internet** (ou **Connexions**) > **DNS privé**.
2. Choisissez **Nom d'hôte du fournisseur DNS privé** et saisissez le nom d'hôte du fournisseur, par exemple `one.one.one.one` pour Cloudflare ou `dns.google` pour Google.
3. Enregistrez. Ce réglage utilise le DNS chiffré over TLS, en Wi-Fi comme en données mobiles. Les intitulés des menus varient selon le fabricant.

## Comment changer de DNS sur votre box

Changer le DNS sur la box l'applique à tous les appareils en réglage automatique, y compris les TV et les consoles.

1. Trouvez l'adresse de votre box (souvent 192.168.0.1 ou 192.168.1.1 ; sous Windows, lancez `ipconfig` et cherchez « Passerelle par défaut »).
2. Ouvrez cette adresse dans un navigateur et connectez-vous, ou utilisez l'application de votre box.
3. Cherchez **DNS**, généralement dans les réglages **Internet**, **WAN** ou **DHCP**.
4. Remplacez le DNS automatique par les serveurs principal et secondaire de votre choix.
5. Enregistrez, puis redémarrez vos appareils ou reconnectez-les au Wi-Fi pour qu'ils prennent en compte le changement.

Certaines box fournies par les FAI verrouillent les réglages DNS. Dans ce cas, modifiez-les plutôt sur chaque appareil.

## Confidentialité et sécurité

L'exploitant de votre résolveur DNS peut voir quels noms de domaine vos appareils consultent. Passer du DNS de votre FAI à un fournisseur public déplace cette visibilité sans la supprimer : lisez donc la politique de confidentialité du fournisseur. Le DNS chiffré (DNS over HTTPS ou DNS over TLS) empêche les tiers présents sur le trajet réseau de lire ou de modifier vos requêtes, ce qui est particulièrement utile sur un Wi-Fi public.

Sachez que certains employeurs, établissements scolaires et dispositifs de contrôle parental reposent sur des réglages DNS précis. Changer le DNS d'un appareil géré peut rendre des sites internes inaccessibles ou enfreindre une politique interne. Si vous utilisez un VPN, il fournit généralement son propre DNS ; voir [un VPN ralentit-il internet](/fr/blog/does-a-vpn-slow-down-internet). Vous pouvez vérifier l'IP publique depuis laquelle votre trafic semble provenir avec notre outil [quelle est mon IP](/fr/what-is-my-ip).

## En résumé

Changer de DNS est un réglage rapide, gratuit et réversible qui peut rendre la navigation plus réactive et ajouter un filtrage de sécurité, mais il n'augmentera pas vos Mb/s et ne fera pas baisser votre ping en jeu. Cela vaut le coup si les pages hésitent avant de se charger ou si le DNS de votre FAI est peu fiable.

Si votre connexion vous semble toujours lente après le changement, la cause est ailleurs. [Testez votre débit internet](/fr) pour vérifier si votre débit descendant, votre débit montant et votre latence correspondent à ce que vous payez.
