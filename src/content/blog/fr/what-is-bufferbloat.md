---
title: "Qu'est-ce que le bufferbloat ? Pourquoi votre connexion lag en charge"
seoTitle: "Bufferbloat : causes, test et solutions"
description: "Qu'est-ce que le bufferbloat ? Pourquoi le ping s'envole quand la connexion est chargée, comment le tester et comment le SQM règle le lag pour de bon."
excerpt: "Si vos jeux laguent et vos appels saccadent dès que quelqu'un lance un téléchargement, le bufferbloat est le suspect numéro un. Voici ce que c'est, comment le mesurer et comment le corriger."
category: "Gaming & Latency"
tags: ["bufferbloat", "latence", "ping", "réglages routeur", "jeux vidéo"]
keywords: ["qu'est-ce que le bufferbloat", "test bufferbloat", "comment corriger le bufferbloat", "ping qui augmente pendant un téléchargement", "latence en charge", "réglage sqm routeur"]
date: "2026-11-06"
coverAlt: "Illustration d'une mémoire tampon de routeur saturée provoquant un pic de ping pendant un gros téléchargement, pour expliquer le bufferbloat"
faq:
  - q: "Qu'est-ce que le bufferbloat, en termes simples ?"
    a: "Le bufferbloat est un délai supplémentaire qui apparaît quand les routeurs et les modems retiennent trop de paquets en file d'attente pendant que votre connexion est chargée. Le débit semble correct, mais le ping grimpe fortement : jeux, appels vidéo et navigation deviennent lents dès que quelqu'un envoie ou télécharge des données."
  - q: "Comment savoir si j'ai du bufferbloat ?"
    a: "Comparez votre ping quand la connexion est au repos avec votre ping pendant un test de débit ou un gros téléchargement. Si la latence augmente de plus de 30 à 50 ms environ en charge, le bufferbloat est notable ; une hausse de 100 ms ou plus est sévère."
  - q: "Plus de bande passante règle-t-il le bufferbloat ?"
    a: "Pas de façon fiable. Une offre plus rapide sature moins souvent la ligne, mais dès qu'elle se remplit, les mémoires tampons surdimensionnées provoquent les mêmes pics de latence. La vraie solution est une gestion plus intelligente des files d'attente, comme le SQM."
  - q: "Qu'est-ce que le SQM sur un routeur ?"
    a: "Le SQM (Smart Queue Management) est une fonction de routeur qui limite le trafic légèrement sous le débit de votre ligne et utilise des algorithmes comme fq_codel ou CAKE pour garder des files d'attente courtes. La latence reste ainsi basse même quand la connexion est utilisée à fond."
  - q: "Le bufferbloat affecte-t-il les jeux vidéo ?"
    a: "Oui. Les jeux en ligne envoient de petits paquets sensibles au délai, et quand ils restent coincés derrière une file de téléchargements ou d'envois, vous subissez des effets d'élastique, des coups enregistrés en retard et des pics de ping, même avec une connexion rapide."
---

Le **bufferbloat** est le lag qui apparaît quand votre connexion internet est chargée : un routeur ou un modem met en file d'attente bien plus de données qu'il ne le devrait, si bien que chaque paquet, y compris vos actions en jeu et votre voix pendant un appel, fait la queue. Le débit de la connexion paraît normal, mais le ping peut passer de 20 ms à plusieurs centaines de millisecondes dès que quelqu'un lance un gros téléchargement ou un envoi. C'est l'une des raisons les plus courantes pour lesquelles une connexion « rapide » semble malgré tout lente et peu réactive.

**À retenir**

- Le bufferbloat est un problème de latence, pas de bande passante.
- Le signe révélateur : un ping correct au repos, qui s'envole pendant les téléchargements, les envois ou les tests de débit.
- Le trafic montant (sauvegardes cloud, appels vidéo, partage de fichiers) est un déclencheur fréquent, car la voie montante est plus étroite.
- La solution la plus efficace est le Smart Queue Management (SQM) sur votre routeur, avec des algorithmes comme fq_codel ou CAKE.
- Une offre plus rapide ne suffit généralement pas à le régler.

## Comment se produit le bufferbloat

Chaque routeur, modem et équipement réseau possède des mémoires tampons (*buffers*) : de petites zones de mémoire qui stockent temporairement les paquets quand ils arrivent plus vite qu'ils ne peuvent être envoyés. Ces tampons sont utiles. Ils absorbent les pics brefs et évitent des pertes de paquets inutiles.

Le problème, c'est leur taille. La mémoire est devenue bon marché, et beaucoup d'appareils sont livrés avec des tampons capables de contenir des centaines de millisecondes, parfois des secondes, de données. Quand votre connexion est saturée par un gros téléchargement ou un gros envoi, ce tampon se remplit et reste plein.

TCP, le protocole utilisé par la plupart des téléchargements, augmente son rythme d'envoi jusqu'à détecter une perte de paquets. Avec un tampon énorme, les paquets ne sont pas rejetés avant longtemps ; ils attendent simplement. TCP continue donc d'accélérer, la file s'allonge et chaque nouveau paquet se place en bout de queue. Un paquet de jeu qui devrait mettre 20 ms peut se retrouver derrière une grande quantité de données de téléchargement en attente et arriver 300 ms plus tard.

### Pourquoi cela se passe généralement au niveau du routeur ou du modem

Le bufferbloat s'accumule au niveau du **goulot d'étranglement**, le maillon le plus lent du trajet. Pour la plupart des foyers, c'est la liaison entre votre modem et votre FAI, surtout dans le sens montant. Votre réseau domestique peut fonctionner à 1 Gb/s en interne, mais si votre offre envoie à 20 Mb/s, c'est là que les paquets s'entassent. Le Wi-Fi peut aussi devenir un goulot d'étranglement quand le signal est faible.

## À quoi ressemble le bufferbloat

Comme les tests de débit n'affichent souvent que le débit descendant et montant, le bufferbloat passe inaperçu. Symptômes courants :

- **Jeux vidéo :** pics de ping, effets d'élastique et coups enregistrés en retard dès que quelqu'un d'autre utilise internet. Voir [quel est un bon ping pour jouer](/fr/blog/what-is-a-good-ping-for-gaming) pour les valeurs de latence à viser.
- **Appels vidéo :** votre voix devient robotique ou votre image se fige quand une sauvegarde cloud ou un envoi démarre.
- **Navigation :** les pages mettent quelques secondes à commencer à charger pendant un gros téléchargement, alors même que celui-ci est rapide.
- **Enceintes connectées et assistants vocaux :** réponses nettement plus lentes quand le réseau est chargé.

Si le problème disparaît dès la fin du téléchargement, le bufferbloat est probablement en cause, plutôt qu'un signal faible ou une offre lente.

## Comment tester le bufferbloat

L'objectif est de comparer la latence quand la connexion est au repos avec la latence quand elle est utilisée à fond. Les outils dont vous disposez déjà suffisent.

1. Branchez si possible votre ordinateur au routeur en Ethernet, pour que d'éventuels problèmes de Wi-Fi ne faussent pas les résultats.
2. Mettez en pause le trafic important des autres appareils (streaming, téléchargements, sauvegardes).
3. Mesurez la latence au repos avec notre [test de ping](/fr/tools/ping-test), ou depuis un terminal avec `ping 8.8.8.8` (sous macOS et Linux, appuyez sur Ctrl+C pour arrêter ; sous Windows, utilisez `ping -t 8.8.8.8`).
4. Laissez un ping tourner dans une fenêtre de terminal, puis lancez un [test de débit complet](/fr) dans votre navigateur.
5. Observez les temps de ping pendant la phase de téléchargement, puis pendant la phase d'envoi.
6. Notez la hausse. L'écart entre le ping au repos et le ping en charge correspond à votre bufferbloat.

### Comment interpréter les résultats

| Hausse du ping en charge | Ce que cela signifie | Ce que vous remarquerez |
|---|---|---|
| Moins de 5 ms | Excellent, pratiquement aucun bufferbloat | Rien ; jeux et appels restent fluides |
| 5–30 ms | Léger | Rarement perceptible pour la plupart des utilisateurs |
| 30–100 ms | Modéré | Lag occasionnel en jeu et appels hachés quand le réseau est chargé |
| 100–300 ms | Sévère | Jeux et appels peinent dès que quelqu'un télécharge |
| Plus de 300 ms | Très sévère | La navigation devient lente ; les applis temps réel sont inutilisables en charge |

Ces plages sont des repères courants, pas une norme officielle. Si la phase d'envoi provoque un pic bien plus important que la phase de téléchargement, concentrez vos corrections sur le sens montant. La gigue a tendance à augmenter avec le bufferbloat : lisez aussi [ce que sont la gigue et la perte de paquets](/fr/blog/what-is-jitter-and-packet-loss).

## Comment corriger le bufferbloat

### 1. Activez le SQM ou les réglages de file intelligente

Le **Smart Queue Management (SQM)** est la solution la plus efficace. Il fait deux choses : il limite votre trafic légèrement sous le débit réel de votre ligne, pour que la file d'attente se forme dans votre routeur (que vous contrôlez) plutôt que dans le modem ou chez le FAI ; et il utilise des algorithmes de file d'attente modernes comme **fq_codel** ou **CAKE**, qui gardent les files courtes et laissent passer équitablement les petits paquets sensibles au délai.

Les fabricants de routeurs utilisent des noms différents ; cherchez :

- « Smart Queue Management », « SQM » ou « Smart Queues »
- « Adaptive QoS » ou « Gestion de la bande passante » avec des options fq_codel ou CAKE
- Les réglages « anti-bufferbloat » ou « optimisation de la latence » des routeurs gaming

Les firmwares alternatifs comme OpenWrt intègrent le SQM sur de nombreux routeurs compatibles.

### 2. Réglez correctement le débit de limitation

Le SQM ne fonctionne que s'il limite le trafic sous votre débit réel.

1. Lancez plusieurs tests de débit en Ethernet à différents moments de la journée et notez vos débits descendant et montant habituels.
2. Réglez la limite de téléchargement du SQM à environ 85–95 % de votre débit descendant mesuré.
3. Réglez la limite d'envoi à environ 85–95 % de votre débit montant mesuré.
4. Mesurez à nouveau le ping en charge. Si les pics persistent, abaissez encore un peu les limites.

Vous sacrifiez une petite part du débit maximal en échange d'une latence constamment basse, un compromis que la plupart des joueurs et des télétravailleurs acceptent volontiers.

### 3. Utilisez la QoS pour prioriser les appareils clés

Si votre routeur n'a pas de SQM, une QoS (qualité de service) classique qui donne la priorité à une console de jeu ou à un ordinateur de travail peut aider. Elle est moins efficace que le SQM car elle ne réduit pas la file, mais elle peut faire passer le trafic important en tête.

### 4. Maîtrisez les applis gourmandes en envoi

La sauvegarde de photos dans le cloud, la synchronisation de fichiers, les caméras de sécurité qui envoient leurs vidéos et les envois des consoles de jeu peuvent saturer une petite voie montante. Programmez-les la nuit ou limitez leur débit d'envoi dans les réglages de l'appli.

### 5. Vérifiez votre modem et votre Wi-Fi

Certains anciens modems câble sont particulièrement sujets au bufferbloat dans le sens montant. Si vous louez votre équipement à votre FAI, demandez si un modèle plus récent est disponible. Les modems DOCSIS 3.1 plus récents prennent en charge l'Active Queue Management, qui peut réduire le bufferbloat en envoi. Une liaison Wi-Fi faible peut aussi créer sa propre file d'attente, donc améliorer le signal aide ; voir [Ethernet ou Wi-Fi](/fr/blog/ethernet-vs-wifi).

## Une offre internet plus rapide règle-t-elle le bufferbloat ?

En partie seulement. Avec une offre plus rapide, votre connexion se remplit moins souvent, et vous remarquerez peut-être moins le lag. Mais quand elle se remplit, que ce soit à cause d'une mise à jour de jeu, d'un streaming 4K ou d'une grosse synchronisation cloud, un tampon surdimensionné se comporte exactement de la même façon. Beaucoup de gens changent d'offre, constatent des téléchargements plus rapides et voient pourtant leurs jeux laguer dès que la console télécharge un patch.

La gestion des files d'attente traite la cause ; la bande passante réduit seulement la fréquence à laquelle vous la déclenchez. Si la latence est votre priorité, le SQM sur un bon routeur apporte souvent plus d'amélioration qu'une montée en gamme de votre offre.

## En résumé

Le bufferbloat explique pourquoi une connexion peut afficher un bon débit tout en paraissant lente : des files d'attente surdimensionnées dans votre modem ou votre routeur font patienter chaque paquet quand la ligne est chargée. La solution n'est pas plus de débit, mais une gestion plus intelligente des files, idéalement le SQM avec fq_codel ou CAKE, réglé juste sous le débit réel de votre ligne.

Commencez par mesurer. [Lancez un test de débit](/fr) en surveillant votre ping, comparez la latence au repos et en charge, et si l'écart dépasse environ 30 ms, activez les réglages de file intelligente puis refaites le test.
