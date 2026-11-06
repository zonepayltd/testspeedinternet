---
title: "Quel débit internet faut-il pour télétravailler ?"
seoTitle: "Quel débit internet pour le télétravail ?"
description: "Quel débit internet pour télétravailler ? Débit descendant, montant et ping recommandés pour Zoom, Teams, VPN et gros fichiers, et comment vérifier le vôtre."
excerpt: "La plupart des télétravailleurs ont besoin de moins de débit descendant qu'ils ne le pensent, mais de plus de débit montant et de stabilité. Comment dimensionner votre connexion pour les visios, les VPN et les foyers partagés."
category: "Remote Work"
tags: ["télétravail", "visioconférence", "débit montant", "débit internet"]
keywords: ["débit internet télétravail", "quel débit pour télétravailler", "bon débit montant pour zoom", "débit pour visioconférence", "connexion internet requise télétravail"]
date: "2026-11-06"
rank: 15
coverAlt: "Illustration d'un bureau à domicile avec un ordinateur portable en visioconférence et une jauge indiquant les débits descendant et montant pour le télétravail"
faq:
  - q: "50 Mb/s suffisent-ils pour télétravailler ?"
    a: "Pour une personne, 50 Mb/s en débit descendant suffisent généralement largement pour les visioconférences, les e-mails et les applications cloud, à condition d'avoir au moins 10 Mb/s en débit montant et une latence stable. Si d'autres personnes du foyer regardent du streaming ou jouent en même temps, 100 Mb/s ou plus offrent davantage de marge."
  - q: "Quel débit montant faut-il pour Zoom ou Teams ?"
    a: "Zoom et Microsoft Teams indiquent environ 1,5 à 4 Mb/s de débit montant pour les appels vidéo en HD. Visez au moins 5 à 10 Mb/s de débit montant par personne en appel au même moment, pour que le partage d'écran et les envois en arrière-plan ne provoquent pas de gel de l'image."
  - q: "Un VPN ralentit-il le télétravail ?"
    a: "Un VPN ajoute généralement un peu de latence et peut réduire le débit, surtout si le serveur VPN est éloigné ou si la passerelle de l'entreprise est saturée. Pour la plupart des tâches de télétravail, l'impact est faible, mais il peut se faire sentir sur les gros transferts de fichiers."
  - q: "Quel ping est bon pour les visioconférences ?"
    a: "Un ping inférieur à 50 ms garantit des visioconférences fluides, et jusqu'à environ 100 ms, c'est généralement correct. Une gigue inférieure à 30 ms compte tout autant, car une latence irrégulière provoque un son haché et une image figée."
  - q: "Le Wi-Fi suffit-il pour télétravailler ?"
    a: "Le Wi-Fi moderne suffit à la plupart des télétravailleurs si le signal est fort dans votre bureau. Si vos appels décrochent ou se figent souvent, une connexion Ethernet filaire est la solution la plus fiable."
---

Pour la plupart des gens, **50 à 100 Mb/s en débit descendant et au moins 10 Mb/s en débit montant** suffisent pour télétravailler confortablement, avec un ping inférieur à environ 50 ms et une faible gigue. Un appel vidéo en HD ne demande que quelques mégabits dans chaque sens : le débit descendant brut est donc rarement le goulot d'étranglement. Ce qui gâche le télétravail, c'est généralement un débit montant faible, une connexion instable ou plusieurs personnes qui partagent la ligne en même temps.

**Réponse rapide**

- Télétravailleur seul, visioconférences et applications cloud : 25 à 50 Mb/s en descendant, 5 à 10 Mb/s en montant.
- Télétravailleur dans un foyer qui regarde du streaming et joue en ligne : 100 à 300 Mb/s en descendant, 20 Mb/s ou plus en montant.
- Gros envois fréquents (vidéo, fichiers de design, builds de code) : privilégiez le débit montant ; 50 Mb/s ou plus font une vraie différence.
- La latence et la gigue comptent autant que le débit : visez un ping inférieur à 50 ms et une gigue inférieure à 30 ms.

## Débits recommandés selon les tâches de télétravail

Les chiffres ci-dessous sont des valeurs typiques, basées sur les bandes passantes recommandées publiées par les applications courantes. Ce sont des estimations par personne et par activité ; additionnez-les pour toutes les personnes qui utilisent la connexion en même temps.

| Activité | Débit descendant (typique) | Débit montant (typique) | Remarques |
|---|---|---|---|
| E-mail, messagerie (Slack, chat Teams) | Moins de 1 Mb/s | Moins de 1 Mb/s | Presque n'importe quelle connexion convient |
| Documents cloud (Google Docs, Office 365) | 1–5 Mb/s | 1 Mb/s | La réactivité dépend surtout de la latence |
| Appel vidéo HD en tête-à-tête (Zoom, Teams, Meet) | 2–4 Mb/s | 2–4 Mb/s | C'est le débit montant qui fige votre image |
| Appel vidéo HD en groupe | 3–6 Mb/s | 2–4 Mb/s | La vue galerie consomme plus en descendant |
| Partage d'écran | 1–3 Mb/s | 1–3 Mb/s en plus | Augmente avec le mouvement et la résolution |
| Bureau à distance / VDI (Citrix, RDP) | 2–10 Mb/s | 1–2 Mb/s | Très sensible à la latence |
| Envoi de gros fichiers (1 Go) | — | Le plus élevé possible | Environ 14 min à 10 Mb/s, moins de 3 min à 50 Mb/s |
| Vidéo HD en streaming pendant une pause | 5–8 Mb/s | — | La 4K demande environ 15 à 25 Mb/s |

Le constat est clair : prises isolément, les applications de travail ne demandent pas grand-chose. Les ennuis commencent quand elles tournent en même temps que le streaming, les jeux, les sauvegardes cloud et les mises à jour de téléphone de tout le monde.

## Pourquoi le débit montant compte davantage en télétravail

La plupart des abonnements internet domestiques, en particulier sur câble et ADSL, sont **asymétriques** : le débit descendant est bien plus rapide que le débit montant. Une offre vendue à 300 Mb/s peut n'offrir que 10 à 20 Mb/s en montant. Cela suffit pour regarder Netflix, mais le télétravail fait de vous un émetteur de contenu.

Chaque fois que vous êtes à l'image, que vous partagez votre écran, que vous synchronisez un dossier avec OneDrive ou Dropbox ou que vous poussez du code, vous utilisez du débit montant. Si celui-ci est saturé, les autres participants voient votre image se figer ou se pixeliser et votre voix se couper, alors que tout semble normal de votre côté.

Une règle simple de dimensionnement : prévoyez environ 5 Mb/s de débit montant par personne susceptible d'être en appel vidéo au même moment, et davantage si vous envoyez régulièrement de gros fichiers. Les offres fibre proposent généralement des débits symétriques, l'une des raisons pour lesquelles elles conviennent si bien au télétravail. Pour une explication plus approfondie, consultez [pourquoi le débit montant compte](/fr/blog/why-upload-speed-matters).

## Latence, gigue et perte de paquets : les ennemis cachés du télétravail

Une offre à 500 Mb/s peut quand même donner des visioconférences catastrophiques. Les applications en temps réel se soucient en effet de la rapidité et de la régularité d'arrivée des paquets, pas seulement de leur nombre par seconde.

- **Le ping (latence)** est le temps d'aller-retour jusqu'à un serveur. En dessous de 50 ms, c'est instantané ; de 50 à 100 ms, c'est correct ; au-delà de 150 ms, vous remarquerez que les gens se coupent la parole.
- **La gigue** mesure la variation de la latence d'un instant à l'autre. Les applications de visio gardent un peu de mémoire tampon pour la masquer, mais au-delà d'environ 30 ms, la gigue provoque souvent une voix robotique et des images figées.
- **La perte de paquets** signifie que des données n'arrivent jamais. Même 1 à 2 % de perte peuvent hacher un appel, car il n'y a pas le temps de renvoyer l'audio.

Ces problèmes n'apparaissent souvent que lorsque la connexion est chargée, un phénomène appelé bufferbloat. Si vos appels se dégradent dès que quelqu'un lance un gros téléchargement, lisez [qu'est-ce que le bufferbloat](/fr/blog/what-is-bufferbloat). Vous pouvez mesurer la latence seule avec notre [test de ping](/fr/tools/ping-test).

## Comment vérifier si votre connexion convient au télétravail

Ne vous fiez pas au débit inscrit sur votre facture. Testez la connexion dont vous disposez réellement, depuis l'endroit où vous travaillez.

1. Installez-vous à votre bureau avec l'appareil que vous utilisez pour travailler, sur la connexion Wi-Fi ou Ethernet habituelle.
2. Fermez les applications de synchronisation cloud, les téléchargements et les onglets de streaming pour obtenir une mesure propre.
3. [Lancez un test de débit gratuit](/fr) et notez le débit descendant, le débit montant, le ping et la gigue.
4. Relancez-le à l'heure où vous avez habituellement vos réunions. La saturation en soirée et en fin d'après-midi peut être nettement plus forte.
5. Faites un troisième test pendant que quelqu'un d'autre dans le foyer regarde une vidéo en streaming. Cela montre comment votre connexion se comporte en conditions réelles.
6. Comparez les résultats avec le tableau ci-dessus, en surveillant particulièrement le débit montant et la gigue.

Si votre débit est bon en Ethernet mais mauvais en Wi-Fi, le problème vient de votre réseau domestique, pas de votre abonnement. Si les deux sont mauvais, contactez votre FAI ou envisagez une offre supérieure.

## Dimensionner un abonnement pour un foyer partagé

Le télétravail se fait rarement en vase clos. Pour estimer vos besoins de façon pratique, imaginez l'heure la plus chargée d'un jour de semaine type.

**Exemple : deux télétravailleurs, un étudiant, du streaming en soirée.**

- Deux appels vidéo simultanés : environ 8 Mb/s en descendant, 8 Mb/s en montant.
- Un étudiant en cours en ligne : environ 4 Mb/s en descendant, 3 Mb/s en montant.
- Quelqu'un qui regarde de la 4K pendant une pause : environ 25 Mb/s en descendant.
- Trafic d'arrière-plan (mises à jour de téléphones, sauvegarde de photos dans le cloud, objets connectés) : 10 à 20 Mb/s en descendant, 5 à 10 Mb/s en montant.

Cela fait environ 50 à 60 Mb/s en descendant et 15 à 20 Mb/s en montant. En doublant pour garder de la marge, on obtient un objectif confortable d'environ 100 à 150 Mb/s en descendant et 20 à 40 Mb/s en montant. La marge compte, car les débits fluctuent, le Wi-Fi atteint rarement le débit complet de l'abonnement et les gros envois peuvent surgir sans prévenir. Pour des repères généraux sur le choix d'un abonnement, consultez notre guide [qu'est-ce qu'un bon débit internet](/fr/guides/good-internet-speed).

## Comment fiabiliser la connexion de votre bureau à domicile

Une fois vos chiffres connus, ces changements apportent les plus grandes améliorations, spécifiquement pour le télétravail.

### Branchez votre ordinateur de travail en Ethernet

Une connexion filaire supprime les interférences Wi-Fi, les baisses de signal et une grande partie de la gigue. Si votre box est loin, un long câble Ethernet plat ou un adaptateur CPL peut être une solution peu coûteuse. Voir [Ethernet ou Wi-Fi](/fr/blog/ethernet-vs-wifi) pour peser le pour et le contre.

### Activez la QoS ou la priorisation du trafic

Beaucoup de box permettent de donner la priorité au trafic des appels vidéo ou à un appareil précis. Certains routeurs récents proposent des réglages « smart queue » ou SQM qui maintiennent une latence basse quand la connexion est chargée. C'est l'une des solutions les plus efficaces pour les appels qui se dégradent quand les autres sont en ligne.

### Programmez les gros envois

Les sauvegardes cloud et les synchronisations de gros fichiers peuvent grignoter discrètement votre débit montant. Mettez-les en pause pendant les réunions ou programmez-les pour la nuit.

### Vérifiez votre VPN

Les VPN d'entreprise font passer votre trafic par une passerelle distante, ce qui ajoute de la latence et peut plafonner le débit. Si le VPN propose plusieurs serveurs, choisissez le plus proche. Demandez au service informatique si les appels vidéo peuvent contourner le VPN (split tunneling), une pratique courante dans de nombreuses organisations.

### Prévoyez une solution de secours

Si vos revenus dépendent de votre connexion, une solution de secours s'impose. Le partage de connexion de votre téléphone peut assurer un appel vidéo en cas d'urgence. Sachez basculer dessus rapidement, et surveillez votre forfait de données mobiles.

## En résumé

Télétravailler ne nécessite pas un abonnement énorme. Pour une personne, 50 Mb/s en descendant et 10 Mb/s en montant, avec une latence basse et stable, suffisent largement pour les visioconférences et les applications cloud. Les foyers où plusieurs personnes sont connectées en même temps devraient viser 100 à 300 Mb/s et, idéalement, une offre avec un meilleur débit montant, terrain sur lequel la fibre excelle.

La meilleure chose à faire ensuite, c'est de mesurer ce dont vous disposez réellement depuis votre bureau. [Testez votre débit internet](/fr) pendant vos heures de réunion habituelles, vérifiez le débit montant et la gigue en plus du débit descendant, et corrigez votre réseau domestique avant de payer pour une offre plus rapide.
