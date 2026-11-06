---
title: "Gigue et perte de paquets : définition, test et solutions"
seoTitle: "Gigue et perte de paquets : tester et corriger"
description: "Gigue (jitter) et perte de paquets : définitions, valeurs bonnes ou mauvaises, comment les tester sous Windows et macOS, et les solutions qui marchent vraiment."
excerpt: "La gigue et la perte de paquets provoquent des appels hachés et des pics de lag même quand votre débit semble bon. Voici ce qu'elles signifient, comment les mesurer et comment les corriger."
category: "Gaming & Latency"
tags: ["gigue", "perte de paquets", "latence", "ping", "jeu en ligne"]
keywords: ["c'est quoi la gigue", "c'est quoi la perte de paquets", "comment corriger la perte de paquets", "test jitter", "bonne gigue pour jouer", "test perte de paquets"]
date: "2026-11-06"
coverAlt: "Illustration de paquets de données arrivant de façon irrégulière et de certains qui se perdent, montrant la gigue et la perte de paquets sur une connexion"
faq:
  - q: "Quelle est une bonne valeur de gigue ?"
    a: "Pour la plupart des usages, une gigue inférieure à environ 30 ms est acceptable, et sous 10 ms elle est très bonne. Les joueurs compétitifs et les personnes qui enchaînent les appels vidéo devraient viser une gigue à un seul chiffre."
  - q: "Quel taux de perte de paquets est acceptable ?"
    a: "Idéalement 0 %. Une perte occasionnelle inférieure à 1 % passe généralement inaperçue, mais au-delà de 1 à 2 % de façon régulière, elle provoque des coupures audibles pendant les appels et des effets d'élastique en jeu."
  - q: "Le Wi-Fi peut-il provoquer une perte de paquets ?"
    a: "Oui. Les interférences, un signal faible et des canaux encombrés entraînent la retransmission ou l'abandon de trames Wi-Fi, ce qui se traduit par de la gigue et de la perte de paquets. Un test avec un câble Ethernet est le moyen le plus rapide de savoir si le Wi-Fi est en cause."
  - q: "La gigue, c'est la même chose que le ping ?"
    a: "Non. Le ping est la durée d'un aller-retour ; la gigue est la variation de cette durée d'un paquet à l'autre. Une connexion peut avoir un ping moyen faible mais une gigue élevée, et paraître tout de même instable."
  - q: "Mon FAI peut-il régler la perte de paquets ?"
    a: "Si la perte apparaît même en filaire, une fois votre propre matériel mis hors de cause, le problème vient probablement de la ligne ou du réseau de votre FAI. Rassemblez des résultats de tests à différents moments de la journée et contactez le support avec ces données."
---

La **gigue** (ou *jitter*) est la variation du temps que mettent les paquets de données à traverser votre connexion, et la **perte de paquets** est la part de paquets qui n'arrivent jamais. Ces deux mesures portent sur la *qualité* de la connexion plutôt que sur son débit : c'est pourquoi une ligne qui affiche 500 Mb/s au test peut quand même produire des appels à la voix robotique et des pics de lag soudains en jeu. Bonne nouvelle : les deux se mesurent en une minute, et la plupart des causes se corrigent chez soi.

**À retenir**

- Une gigue inférieure à environ 30 ms convient à la plupart des gens ; sous 10 ms, c'est idéal pour le jeu et les appels.
- La perte de paquets devrait être de 0 %. Au-delà de 1 % de façon régulière, c'est un vrai problème à corriger.
- Les interférences Wi-Fi et une connexion saturée (bufferbloat) sont les deux causes les plus fréquentes à domicile.
- Un test en Ethernet permet de distinguer en une étape les problèmes de Wi-Fi des problèmes du FAI.
- Les applis temps réel (appels, jeux, cloud gaming) en souffrent bien plus que les téléchargements ou le streaming.

## La gigue, c'est quoi concrètement ?

Chaque fois que votre appareil communique avec un serveur, les données sont découpées en petits paquets. Idéalement, chaque paquet met le même temps à faire le trajet. En réalité, le délai fluctue : un paquet arrive en 20 ms, le suivant en 45 ms, le suivant en 22 ms. Cette fluctuation, c'est la gigue, généralement exprimée en millisecondes comme l'écart moyen entre deux mesures de latence consécutives.

La gigue compte parce que les applications temps réel ont besoin de recevoir les paquets à un rythme régulier. Une appli d'appel vidéo diffuse le son par toutes petites tranches ; si une tranche arrive en retard, l'appli doit soit attendre (ce qui ajoute du délai), soit la sauter (ce qui crée une coupure). Les applis utilisent une **mémoire tampon de gigue** (*jitter buffer*) pour lisser tout cela, mais plus la gigue est forte, plus ce tampon doit être grand, et plus vous entendez de décalage dans la conversation.

### Gigue, ping et latence

La **latence** est le temps que met un paquet à atteindre sa destination, et le **ping** est l'outil courant (et le nom usuel) pour mesurer la latence aller-retour. La gigue se calcule à partir d'une série de mesures de ping : elle décrit leur *régularité*. Pour en savoir plus sur les valeurs de latence à viser, consultez notre guide [quel est un bon ping pour jouer](/fr/blog/what-is-a-good-ping-for-gaming).

## Qu'est-ce que la perte de paquets ?

La perte de paquets est le pourcentage de paquets envoyés qui n'atteignent jamais leur destination. Les réseaux sont conçus pour tolérer un peu de perte. Pour les téléchargements et les pages web, des protocoles comme TCP renvoient simplement les paquets manquants : vous constatez surtout un ralentissement plutôt qu'une erreur.

Le trafic temps réel, c'est une autre histoire. La voix, les appels vidéo et de nombreux jeux en ligne utilisent des protocoles où un paquet renvoyé arriverait trop tard pour servir. Un paquet perdu pendant un appel devient un mot tronqué ; en jeu, il devient un personnage qui se téléporte ou un tir qui n'est pas comptabilisé. Même de faibles pertes peuvent se remarquer dans ces applis.

## Quelles valeurs de gigue et de perte de paquets sont bonnes ou mauvaises ?

Il n'existe pas de seuil officiel unique, mais les plages ci-dessous reprennent les recommandations courantes des fournisseurs de VoIP et de jeux. Considérez-les comme des repères pratiques.

| Mesure | Excellent | Acceptable | Problèmes perceptibles |
|---|---|---|---|
| Gigue | Moins de 10 ms | 10–30 ms | Plus de 30 ms |
| Perte de paquets | 0 % | Moins de 1 % | 1–2 % ou plus |
| Ping (pour comparaison) | Moins de 30 ms | 30–80 ms | Plus de 100 ms |

Quelques nuances sont bonnes à connaître. Un test isolé avec un bref pic ne veut pas dire grand-chose ; des résultats constants sur plusieurs tests, si. Et une gigue qui n'apparaît que lorsque quelqu'un d'autre envoie ou télécharge des données pointe vers une cause bien précise, détaillée plus bas.

## Comment tester la gigue et la perte de paquets

Vous pouvez mesurer la gigue dans votre navigateur et la perte de paquets avec des outils déjà intégrés à votre ordinateur.

### Tester la gigue dans votre navigateur

1. Arrêtez les téléchargements, les sauvegardes cloud et le streaming sur les autres appareils si vous voulez une référence propre.
2. [Lancez un test de débit gratuit](/fr) et notez le ping et la gigue en plus du débit descendant et montant.
3. Répétez le test deux ou trois fois, à quelques minutes d'intervalle, pour voir si la gigue est stable.
4. Relancez-le une dernière fois pendant qu'un autre appareil diffuse une vidéo ou envoie un fichier. Une forte hausse de la gigue en charge est un indice sérieux.

Si vous voulez vous concentrer uniquement sur la latence, notre [test de ping](/fr/tools/ping-test) dédié effectue des mesures répétées et montre leur régularité.

### Tester la perte de paquets sous Windows

1. Appuyez sur la touche Windows, tapez `cmd` et ouvrez l'Invite de commandes.
2. Lancez `ping -n 100 8.8.8.8` pour envoyer 100 pings vers un serveur DNS public.
3. À la fin, regardez la ligne de résumé : elle indique les paquets envoyés, reçus et le pourcentage perdu.
4. Pour une vue saut par saut, lancez `pathping 8.8.8.8`. Cela prend quelques minutes, mais montre à quel endroit du trajet la perte commence.

### Tester la perte de paquets sous macOS ou Linux

1. Ouvrez le Terminal.
2. Lancez `ping -c 100 8.8.8.8`.
3. Lisez le pourcentage « packet loss » dans le résumé final.
4. Essayez `traceroute 8.8.8.8` pour voir le chemin emprunté par votre trafic.

Une mise en garde : certains routeurs sur internet traitent volontairement les réponses au ping en basse priorité. Si vous voyez de la perte sur un saut intermédiaire dans `pathping` ou `traceroute` mais *pas* sur la destination finale, ce saut n'est généralement pas en cause. Ce qui compte, c'est une perte qui commence à un saut et se poursuit jusqu'au bout.

## Qu'est-ce qui provoque la gigue et la perte de paquets ?

La plupart des problèmes entrent dans quelques catégories, présentées ici à peu près par ordre de fréquence dans un foyer typique.

### Interférences Wi-Fi et signal faible

Le Wi-Fi est un support radio partagé. Les réseaux des voisins, les micro-ondes, les appareils Bluetooth, les murs épais et la distance au routeur font échouer des trames qui doivent être retransmises. Les retransmissions se traduisent par de la gigue ; les trames qui échouent à répétition deviennent de la perte de paquets. La bande 2,4 GHz est particulièrement encombrée dans les immeubles.

### Congestion de votre propre connexion (bufferbloat)

Quand votre connexion est saturée, par une sauvegarde cloud, le téléchargement d'un jeu ou quelqu'un qui envoie une vidéo, la file d'attente de votre routeur se remplit. Les paquets font la queue, la latence explose et la gigue s'envole. Ce phénomène s'appelle le bufferbloat, et c'est l'une des raisons les plus fréquentes pour lesquelles les jeux laguent « seulement le soir ». Nous l'expliquons en détail dans [qu'est-ce que le bufferbloat](/fr/blog/what-is-bufferbloat).

### Câbles, ports ou équipements défectueux

Un câble Ethernet abîmé, un connecteur coaxial desserré, un routeur qui surchauffe ou un modem vieillissant peuvent tous perdre des paquets par intermittence. Les anciens adaptateurs CPL sont une autre source fréquente de gigue.

### Problèmes du FAI et du réseau

Le bruit sur une ligne ADSL, les problèmes de signal sur le câble, les nœuds de quartier saturés aux heures de pointe ou un mauvais routage entre votre FAI et un serveur de jeu peuvent tous provoquer de la perte et de la gigue qu'aucun réglage à domicile ne corrigera.

### Problèmes liés à l'appareil

Des pilotes réseau obsolètes, une économie d'énergie trop agressive sur les cartes Wi-Fi et des applis en arrière-plan (clients de synchronisation, mises à jour) peuvent ajouter de la gigue sur un seul appareil alors que les autres du réseau fonctionnent bien.

## Comment corriger la gigue et la perte de paquets

Suivez ces étapes dans l'ordre. Chacune règle le problème ou aide à le localiser.

1. **Redémarrez le modem et le routeur.** Éteignez-les 30 secondes, puis rallumez-les. Cela élimine les fuites de mémoire et les états bloqués, et c'est gratuit.
2. **Testez avec un câble Ethernet.** Branchez votre ordinateur directement au routeur et refaites le test. Si la gigue et la perte disparaissent, le problème vient du Wi-Fi. Notre [comparatif Ethernet ou Wi-Fi](/fr/blog/ethernet-vs-wifi) explique pourquoi le filaire est tellement plus régulier.
3. **Améliorez le Wi-Fi s'il est en cause.** Rapprochez-vous du routeur, passez sur la bande 5 GHz, choisissez un canal moins encombré ou ajoutez un module mesh pour les pièces éloignées.
4. **Coupez le trafic concurrent.** Mettez en pause les sauvegardes cloud, les gros téléchargements et les mises à jour de jeux pendant les appels et les parties. Vérifiez aussi les autres appareils.
5. **Activez la QoS ou le Smart Queue Management.** De nombreux routeurs proposent la QoS, et certains offrent des fonctions SQM (souvent appelées fq_codel ou CAKE) qui réduisent fortement la latence en charge. C'est la solution la plus efficace contre la gigue causée par le bufferbloat.
6. **Remplacez le matériel suspect.** Changez de câble Ethernet, essayez un autre port du routeur et vérifiez que les connecteurs coaxiaux sont bien serrés à la main. Si votre modem a plusieurs années ou s'il s'agit d'un modèle dépassé fourni par le FAI, demandez un remplacement.
7. **Mettez à jour pilotes et firmware.** Mettez à jour le firmware de votre routeur et le pilote de la carte réseau de votre ordinateur, et désactivez l'économie d'énergie de la carte Wi-Fi sur les portables Windows.
8. **Contactez votre FAI avec des preuves.** Si la perte persiste en filaire une fois le trafic concurrent arrêté, enregistrez plusieurs résultats de `ping` à différents moments de la journée et transmettez-les au support. Des chiffres concrets font remonter un dossier bien plus vite que « mon internet marche mal ».

## La gigue ou la perte de paquets affectent-elles les résultats d'un test de débit ?

En partie. La perte de paquets réduit les débits descendant et montant mesurés, car TCP ralentit quand il détecte une perte. La gigue, à elle seule, ne fait pas forcément baisser le score de débit, et c'est justement pourquoi un résultat rapide peut aller de pair avec une mauvaise expérience en appel et en jeu. Il vaut donc la peine de lire le ping et la gigue, pas seulement le chiffre en Mb/s mis en avant. Notre page [comment ça marche](/fr/how-it-works) explique comment chaque mesure est réalisée.

## En résumé

La gigue et la perte de paquets expliquent ces situations frustrantes où votre internet est « rapide » mais où les appels coupent et les jeux saccadent. Visez une gigue inférieure à 30 ms (idéalement moins de 10) et une perte de paquets de 0 %, et testez en Wi-Fi comme en Ethernet pour savoir où les problèmes commencent.

La plupart des problèmes à domicile se résument à des interférences Wi-Fi ou à une connexion saturée, deux choses que vous pouvez corriger vous-même. [Vérifiez votre ping et votre gigue maintenant](/fr) avec un test rapide, appliquez les solutions ci-dessus, et apportez vos mesures à votre FAI si le problème persiste en filaire.
