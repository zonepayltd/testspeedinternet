---
title: "IP pública vs IP privada: ¿cuál es la diferencia?"
seoTitle: "IP pública vs IP privada: diferencias clave explicadas"
description: "IP pública vs IP privada: qué es cada una, los rangos de IP privada, cómo las conecta NAT y cómo encontrar ambas en Windows, Mac y en tu móvil."
excerpt: "Tu router tiene una dirección IP pública que ve internet, mientras que cada dispositivo de tu casa recibe su propia IP privada. Así funcionan juntas y así puedes encontrar cada una."
category: "Privacy & Security"
tags: ["dirección ip", "redes", "privacidad", "nat"]
keywords: ["ip pública vs ip privada", "qué es una dirección ip privada", "cuál es mi ip pública", "rango de ip privadas", "cómo saber mi dirección ip"]
date: "2026-11-06"
coverAlt: "Diagrama de un router doméstico con una dirección IP pública orientada a internet y varios dispositivos con direcciones IP privadas en la red local"
faq:
  - q: "¿Cuál es la diferencia entre una dirección IP pública y una privada?"
    a: "Una dirección IP pública la asigna tu proveedor de internet e identifica tu conexión en internet. Una dirección IP privada la asigna tu router a cada dispositivo de tu red doméstica y solo funciona dentro de esa red."
  - q: "¿Alguien puede saber mi ubicación a partir de mi IP pública?"
    a: "Una IP pública suele revelar tu ubicación aproximada, como tu ciudad o región y tu proveedor de internet, pero no tu dirección postal. Solo tu proveedor puede vincular la IP con un cliente concreto, y normalmente solo lo hace mediante un procedimiento judicial."
  - q: "¿192.168.1.1 es una IP pública o privada?"
    a: "192.168.1.1 es una dirección IP privada. Se usa habitualmente como dirección predeterminada de los routers domésticos y no se puede acceder a ella directamente desde internet."
  - q: "¿Por qué cambia mi dirección IP pública?"
    a: "La mayoría de las conexiones domésticas usan direcciones IP dinámicas, que tu proveedor puede reasignar cuando se reinicia el router, caduca una concesión o se reconfigura la red. Las IP públicas fijas suelen estar disponibles solo en planes para empresas o pagando un extra."
  - q: "¿Todos mis dispositivos comparten la misma IP pública?"
    a: "Sí, normalmente. Tu router usa NAT para que todos los dispositivos de tu red doméstica compartan una sola dirección IPv4 pública, mientras que cada uno conserva su propia IP privada internamente."
---

Una **dirección IP pública** es la dirección con la que el resto de internet ve tu conexión; te la asigna tu proveedor de internet y la recibe tu router. Una **dirección IP privada** es una dirección interna que tu router da a cada dispositivo de tu casa, como 192.168.1.23, y que solo funciona en tu red local. El router traduce entre ambas, lo que permite que todos los móviles, portátiles y televisores compartan una única dirección pública.

**Puntos clave**

- Las IP públicas son únicas en todo el mundo y accesibles desde internet; las IP privadas se reutilizan en millones de hogares y no se pueden enrutar en internet.
- Los rangos IPv4 privados son 10.0.0.0/8, 172.16.0.0/12 y 192.168.0.0/16.
- El NAT (traducción de direcciones de red) de tu router conecta los dispositivos privados a internet a través de una sola IP pública.
- Los sitios web ven tu IP pública, que revela tu proveedor y tu ubicación aproximada, no tu dirección exacta.
- Puedes encontrar tu IP pública con una herramienta de consulta de IP y tu IP privada en los ajustes de red de tu dispositivo.

## ¿Qué es una dirección IP pública?

Todo dispositivo que se comunica directamente en internet necesita una dirección única para que los datos sepan volver a él. Esa es la IP pública. En el internet doméstico, tu proveedor asigna una dirección IPv4 pública a tu router (o módem), y esa dirección representa a todo tu hogar en internet.

Cuando cargas un sitio web, el servidor del sitio ve tu IP pública. La usa para enviarte la página de vuelta y también puede usarla para estimar tu región, mostrarte contenido localizado o aplicar comprobaciones de seguridad.

### IP públicas dinámicas vs fijas

La mayoría de los planes residenciales usan IP públicas **dinámicas**, que pueden cambiar cuando se reinicia el router o cuando el proveedor rota las direcciones. Es normal y no afecta al uso diario. Las IP **fijas** (o estáticas) no cambian y las usan sobre todo empresas que alojan servidores, gestionan pasarelas VPN o necesitan estar en listas de direcciones permitidas. Los proveedores suelen cobrarlas aparte.

## ¿Qué es una dirección IP privada?

Dentro de tu casa, el router hace de pequeño gestor de red. Mediante **DHCP**, asigna automáticamente a cada dispositivo conectado una dirección IP privada, junto con la dirección del propio router (la puerta de enlace predeterminada) y la configuración DNS.

Estas direcciones privadas proceden de rangos que los estándares de internet (RFC 1918) reservan específicamente para redes locales. Como nunca se enrutan en internet, las mismas direcciones pueden reutilizarse en cualquier casa, oficina y cafetería del mundo sin conflictos.

### Rangos de direcciones IPv4 privadas

| Rango | Notación CIDR | Número de direcciones | Dónde lo verás normalmente |
|---|---|---|---|
| 10.0.0.0 – 10.255.255.255 | 10.0.0.0/8 | Unos 16.8 millones | Redes corporativas, algunos routers de proveedores y sistemas mesh |
| 172.16.0.0 – 172.31.255.255 | 172.16.0.0/12 | Aproximadamente 1 millón | Redes de empresa, Docker y máquinas virtuales |
| 192.168.0.0 – 192.168.255.255 | 192.168.0.0/16 | Unas 65 000 | La mayoría de los routers domésticos (192.168.0.x o 192.168.1.x) |

Conviene conocer otros rangos especiales. **169.254.x.x** es una dirección de enlace local que tu dispositivo se asigna a sí mismo cuando no puede contactar con un servidor DHCP, lo que suele significar que está conectado al WiFi pero no está obteniendo realmente una dirección. **127.0.0.1** es "localhost", que siempre se refiere al propio dispositivo.

## IP pública vs IP privada: comparativa

| Característica | IP pública | IP privada |
|---|---|---|
| La asigna | Tu proveedor de internet | Tu router (mediante DHCP) |
| Alcance | Global, accesible desde internet | Solo la red local |
| Unicidad | Única en todo el mundo en cada momento | Reutilizada en innumerables redes |
| Quién la ve | Sitios web, apps, servidores de juegos, servidores de correo | Dispositivos de la misma red |
| Ejemplo | 203.0.113.45 | 192.168.1.23 |
| Cambia cuando | El proveedor la reasigna (dinámica) | El router la reasigna, o configuras una reserva |
| Coste | Incluida en tu plan; la fija puede costar más | Gratis |

## Cómo conecta NAT las direcciones privadas y públicas

La **traducción de direcciones de red (NAT)** es la razón por la que una docena de dispositivos pueden compartir una sola IP pública. Cuando tu portátil solicita una página web, el router sustituye la dirección privada del portátil por la IP pública, anota qué dispositivo hizo la petición y la envía. Cuando llega la respuesta, el router consulta su tabla y la reenvía al dispositivo correcto.

NAT se introdujo en gran parte porque el mundo se estaba quedando sin direcciones IPv4, que tienen un límite teórico de unos 4300 millones. Una ventaja añadida es que las conexiones entrantes no solicitadas no pueden llegar directamente a tus dispositivos, porque el router no sabe adónde enviarlas. No sustituye a un firewall, pero sí reduce la exposición.

### Cuándo da problemas el NAT

El NAT puede estorbar en cualquier cosa que necesite conexiones entrantes: alojar un servidor de juegos, algunos juegos peer-to-peer, el acceso remoto a una cámara doméstica o tener una web personal. Los jugadores suelen verlo como un tipo de NAT "Estricto" o "Moderado". Las soluciones pasan por activar UPnP, configurar la redirección de puertos o usar los ajustes de gaming o DMZ del router. Si el emparejamiento online también sufre lag, [haz un test de velocidad](/es) para comprobar tu ping y consulta [qué es un buen ping para jugar](/es/blog/what-is-a-good-ping-for-gaming) para conocer las cifras objetivo.

### ¿Y el CGNAT?

Algunos proveedores, sobre todo los móviles, los de internet 5G en casa y algunos por satélite, usan **NAT de nivel de operador (CGNAT)**. Tu router recibe una dirección de otro rango compartido más (100.64.0.0/10), y muchos clientes comparten una misma IP pública. Si la dirección WAN que aparece en los ajustes de tu router no coincide con la que muestra una consulta de IP pública, probablemente estés detrás de CGNAT. Funciona bien para navegar y ver streaming, pero hace imposible la redirección de puertos sin ayuda del proveedor.

## Cómo encontrar tu IP pública y tu IP privada

### Encuentra tu IP pública

La forma más rápida es visitar nuestra página [cuál es mi IP](/es/what-is-my-ip), que muestra la dirección pública que ven los sitios web, junto con tu proveedor y tu ubicación aproximada. La página de administración del router también suele indicarla como IP WAN o IP de Internet.

### Encuentra tu IP privada en Windows

1. Pulsa **Windows + R**, escribe `cmd` y pulsa Intro.
2. Ejecuta `ipconfig`.
3. Busca **Dirección IPv4** en tu adaptador activo (Wi-Fi o Ethernet). La **Puerta de enlace predeterminada** es la IP privada de tu router.

### Encuentra tu IP privada en macOS

1. Abre **Ajustes del Sistema** > **Red** y selecciona tu conexión; la dirección IP aparece en **Detalles**.
2. O abre Terminal y ejecuta `ipconfig getifaddr en0` (en la mayoría de los Mac, en0 es el WiFi).

### Encuentra tu IP privada en iPhone y Android

1. **iPhone:** Ajustes > Wi-Fi > toca **(i)** junto a tu red y busca **Dirección IP**.
2. **Android:** Ajustes > Redes e Internet > Wi-Fi > toca tu red y mira en **Avanzado** o **Detalles de la red**. Los nombres de los menús varían según el fabricante.

## Privacidad: qué revela tu IP pública

Tu IP pública no es tu dirección postal, pero tampoco es anónima. Solo con una IP, cualquiera puede saber normalmente:

- Tu proveedor de internet.
- Tu ubicación aproximada, a menudo la ciudad o la región, a veces con menos precisión.
- Si la dirección pertenece a una red residencial, un centro de datos, una VPN o un operador móvil.

Solo tu proveedor puede relacionar la IP con tu cuenta, y normalmente solo lo hace mediante un procedimiento judicial. Aun así, las IP se usan para la puntuación de fraude, la limitación de peticiones y las restricciones geográficas. Nuestra herramienta de [puntuación de riesgo de IP](/es/ip-risk-score) muestra cómo podrían valorar estos sistemas una dirección. Una VPN sustituye tu IP pública por la dirección del servidor VPN; para conocer el impacto en la velocidad, consulta [si una VPN ralentiza internet](/es/blog/does-a-vpn-slow-down-internet).

Las IP privadas, en cambio, no son visibles en absoluto para los sitios web, y compartir una (por ejemplo, "mi portátil es la 192.168.1.15") no revela casi nada a alguien de fuera de tu red.

## IPv6 cambia el panorama

Con **IPv6** hay tantas direcciones que cada dispositivo puede tener su propia dirección enrutable globalmente, lo que reduce la necesidad de NAT. La mayoría de las instalaciones domésticas con IPv6 siguen usando un firewall en el router para bloquear el tráfico entrante no solicitado. IPv6 también tiene sus propios rangos solo locales (como fe80::/10 de enlace local y fd00::/8 de direcciones locales únicas), que cumplen un papel parecido al de las direcciones privadas IPv4. Hoy muchos hogares usan IPv4 e IPv6 a la vez.

## En resumen

Tu IP pública es la identidad única de tu hogar en internet, asignada por tu proveedor. Tus IP privadas son etiquetas internas que el router da a cada dispositivo, y NAT une ambas para que todo lo que hay en tu casa pueda compartir una sola conexión.

Para ver la dirección que ve internet ahora mismo, consulta [cuál es mi IP](/es/what-is-my-ip). Y si de paso notas tu conexión lenta, [haz un test de velocidad gratis](/es) para comprobar la descarga, la subida y el ping en menos de un minuto.
