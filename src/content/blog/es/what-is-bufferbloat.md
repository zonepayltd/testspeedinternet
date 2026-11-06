---
title: "¿Qué es el bufferbloat? Por qué tu internet va con lag cuando hay carga"
seoTitle: "¿Qué es el bufferbloat? Causas, test y cómo solucionarlo"
description: "¿Qué es el bufferbloat? Descubre por qué el ping se dispara con la conexión ocupada, cómo detectarlo y cómo SQM y las colas inteligentes acaban con el lag."
excerpt: "Si los juegos van con lag y las llamadas se entrecortan en cuanto alguien empieza una descarga, lo más probable es que sea bufferbloat. Te explicamos qué es, cómo medirlo y cómo solucionarlo."
category: "Gaming & Latency"
tags: ["bufferbloat", "latencia", "ping", "configuración del router", "gaming"]
keywords: ["qué es el bufferbloat", "test de bufferbloat", "cómo solucionar el bufferbloat", "el ping sube al descargar", "latencia con carga", "configurar sqm en el router"]
date: "2026-11-06"
coverAlt: "Ilustración de un búfer de router desbordado que provoca un pico en el gráfico de ping mientras se realiza una descarga grande, explicando el bufferbloat"
faq:
  - q: "¿Qué es el bufferbloat explicado de forma sencilla?"
    a: "El bufferbloat es un retraso extra que aparece cuando los routers y módems retienen demasiados paquetes en cola mientras tu conexión está ocupada. La velocidad parece buena, pero el ping se dispara, así que los juegos, las videollamadas y la navegación van con lag cada vez que alguien sube o descarga algo."
  - q: "¿Cómo sé si tengo bufferbloat?"
    a: "Compara tu ping con la conexión inactiva con tu ping durante un test de velocidad o una descarga grande. Si la latencia sube más de unos 30 a 50 ms con carga, tienes un bufferbloat apreciable; los aumentos de 100 ms o más son graves."
  - q: "¿Más ancho de banda soluciona el bufferbloat?"
    a: "No de forma fiable. Un plan más rápido puede hacer que la línea se sature con menos frecuencia, pero cada vez que se llena, los búferes sobredimensionados siguen provocando los mismos picos de latencia. La solución real es una gestión de colas más inteligente, como SQM."
  - q: "¿Qué es SQM en un router?"
    a: "SQM (Smart Queue Management, gestión inteligente de colas) es una función del router que limita el tráfico ligeramente por debajo de la velocidad de tu línea y usa algoritmos como fq_codel o CAKE para mantener las colas cortas. Así la latencia se mantiene baja incluso con la conexión a pleno rendimiento."
  - q: "¿El bufferbloat afecta a los juegos?"
    a: "Sí. Los juegos online envían paquetes pequeños y sensibles al tiempo, y cuando se quedan atascados detrás de una cola de tráfico de descarga o subida, aparecen el rubber-banding, los impactos con retraso y los picos de ping, incluso con una conexión rápida."
---

El **bufferbloat** es el lag que sufres cuando tu conexión a internet está ocupada: un router o un módem acumula en cola muchos más datos de los que debería, de modo que cada paquete, incluidas las acciones de tu juego y tu voz en una llamada, tiene que esperar su turno. La velocidad de la conexión parece normal, pero el ping puede saltar de 20 ms a varios cientos de milisegundos en cuanto alguien empieza una descarga o una subida grande. Es una de las razones más habituales por las que una conexión "rápida" sigue pareciendo lenta y poco ágil.

**Puntos clave**

- El bufferbloat es un problema de latencia, no de ancho de banda.
- La señal inequívoca es un ping que va bien en reposo pero se dispara durante descargas, subidas o tests de velocidad.
- El tráfico de subida (copias de seguridad en la nube, videollamadas, compartir archivos) es un desencadenante frecuente porque los enlaces de subida son más pequeños.
- La solución más eficaz es activar la gestión inteligente de colas (SQM) en tu router, con algoritmos como fq_codel o CAKE.
- Un plan más rápido, por sí solo, no suele resolverlo.

## Cómo se produce el bufferbloat

Todos los routers, módems y dispositivos de red tienen búferes: pequeñas áreas de memoria que retienen temporalmente los paquetes cuando llegan más rápido de lo que se pueden enviar. Los búferes son útiles. Absorben ráfagas cortas y evitan pérdidas de paquetes innecesarias.

El problema es el tamaño. La memoria se abarató, y muchos dispositivos vienen con búferes capaces de almacenar cientos de milisegundos de datos, a veces segundos. Cuando una descarga o subida grande satura tu conexión, ese búfer se llena y se queda lleno.

TCP, el protocolo que hay detrás de la mayoría de las descargas, aumenta su velocidad de envío hasta que detecta pérdida de paquetes. Con un búfer enorme, los paquetes tardan mucho en descartarse; simplemente esperan. Así que TCP sigue empujando, la cola sigue creciendo y cada paquete nuevo se pone al final. Un paquete del juego que debería tardar 20 ms puede quedarse detrás de un montón de datos de descarga en cola y llegar 300 ms después.

### Por qué suele producirse en tu router o módem

El bufferbloat se acumula en el **cuello de botella**, el enlace más lento del recorrido. En la mayoría de los hogares, es la conexión entre tu módem y tu proveedor, sobre todo en el sentido de subida. Tu red doméstica puede funcionar internamente a 1 Gbps, pero si tu plan sube a 20 Mbps, es ahí donde se amontonan los paquetes. El WiFi también puede ser un cuello de botella cuando la señal es débil.

## Cómo se nota el bufferbloat

Como los tests de velocidad a menudo solo muestran la descarga y la subida, el bufferbloat pasa desapercibido aunque esté a la vista. Síntomas habituales:

- **Juegos:** picos de ping, rubber-banding e impactos que se registran tarde cada vez que otra persona usa internet. Consulta [qué es un buen ping para jugar](/es/blog/what-is-a-good-ping-for-gaming) para ver los objetivos de latencia.
- **Videollamadas:** tu voz suena robótica o tu vídeo se congela cuando empieza una copia de seguridad en la nube o una subida.
- **Navegación:** las páginas tardan unos segundos en empezar a cargar durante una descarga grande, aunque la descarga vaya rápida.
- **Altavoces inteligentes y asistentes de voz:** respuestas notablemente lentas cuando la red está ocupada.

Si el problema desaparece en cuanto termina la descarga, lo más probable es que el culpable sea el bufferbloat y no una señal débil o un plan lento.

## Cómo detectar el bufferbloat

El objetivo es comparar la latencia con la conexión inactiva y con la conexión a plena carga. Puedes hacerlo con herramientas que ya tienes.

1. Conecta el ordenador al router por Ethernet si es posible, para que los problemas de WiFi no enturbien los resultados.
2. Pausa el tráfico pesado de otros dispositivos (streaming, descargas, copias de seguridad).
3. Mide la latencia en reposo con nuestro [test de ping](/es/tools/ping-test), o desde una terminal con `ping 8.8.8.8` (en macOS y Linux, pulsa Ctrl+C para detenerlo; en Windows usa `ping -t 8.8.8.8`).
4. Deja un ping funcionando en una ventana de terminal y, a continuación, inicia un [test de velocidad completo](/es) en el navegador.
5. Observa los tiempos de ping durante la fase de descarga y de nuevo durante la fase de subida.
6. Anota el aumento. La diferencia entre el ping en reposo y el ping con carga es tu bufferbloat.

### Cómo interpretar los resultados

| Aumento del ping con carga | Qué significa | Qué notarás |
|---|---|---|
| Menos de 5 ms | Excelente, prácticamente sin bufferbloat | Nada; los juegos y las llamadas siguen fluidos |
| 5–30 ms | Leve | Rara vez se nota para la mayoría de usuarios |
| 30–100 ms | Moderado | Lag ocasional en juegos y llamadas entrecortadas con la red ocupada |
| 100–300 ms | Grave | Los juegos y las llamadas sufren cada vez que alguien descarga |
| Más de 300 ms | Muy grave | La navegación va lenta; las apps en tiempo real son inutilizables con carga |

Estos rangos son reglas prácticas habituales, no un estándar formal. Si la fase de subida provoca un pico mucho mayor que la de descarga, céntrate en solucionar la subida. El jitter tiende a aumentar junto con el bufferbloat, así que también merece la pena leer [qué son el jitter y la pérdida de paquetes](/es/blog/what-is-jitter-and-packet-loss).

## Cómo solucionar el bufferbloat

### 1. Activa SQM o los ajustes de colas inteligentes

La **gestión inteligente de colas (SQM)** es la solución más eficaz. Hace dos cosas: limita tu tráfico a un valor ligeramente inferior a la velocidad real de tu línea, de modo que la cola se forma en tu router (que tú controlas) y no en el módem o en los equipos del proveedor; y usa algoritmos de colas modernos como **fq_codel** o **CAKE**, que mantienen las colas cortas y dan su turno de forma justa a los paquetes pequeños y sensibles al tiempo.

Cada fabricante de routers usa nombres distintos, así que busca:

- "Smart Queue Management", "SQM" o "Smart Queues"
- "Adaptive QoS" o "Gestión del ancho de banda" con opciones fq_codel o CAKE
- Los ajustes "anti-bufferbloat" u "optimización de latencia" de los routers gaming

Firmwares de terceros como OpenWrt incluyen SQM en muchos de los routers compatibles.

### 2. Configura bien la velocidad de limitación

SQM solo funciona si limita por debajo de tu velocidad real.

1. Haz varios tests de velocidad por Ethernet a distintas horas del día y anota tu descarga y subida habituales.
2. Configura el límite de descarga de SQM en torno al 85–95 % de tu descarga medida.
3. Configura el límite de subida en torno al 85–95 % de tu subida medida.
4. Vuelve a medir el ping con carga. Si siguen los picos, baja un poco más los límites.

Renuncias a una pequeña parte de la velocidad máxima a cambio de una latencia baja y constante, un trato que la mayoría de jugadores y teletrabajadores aceptan encantados.

### 3. Usa QoS para dar prioridad a los dispositivos clave

Si tu router no tiene SQM, la QoS (calidad de servicio) tradicional que da prioridad a una consola o al portátil del trabajo puede ayudar. Es menos eficaz que SQM porque no reduce la cola, pero puede pasar el tráfico importante al principio de la fila.

### 4. Controla las apps que más suben

La copia de seguridad de fotos en la nube, la sincronización de archivos, las cámaras de seguridad que suben grabaciones y las subidas de las consolas pueden saturar un enlace de subida pequeño. Prográmalas por la noche o limita su velocidad de subida en los ajustes de cada app.

### 5. Revisa tu módem y tu WiFi

Algunos módems de cable antiguos son especialmente propensos al bufferbloat en la subida. Si alquilas el equipo a tu proveedor, pregunta si hay un modelo más nuevo disponible. Los módems DOCSIS 3.1 más recientes admiten la gestión activa de colas (AQM), que puede reducir el bufferbloat de subida. Un enlace WiFi débil también puede crear su propia cola, así que mejorar la señal ayuda; consulta [Ethernet vs WiFi](/es/blog/ethernet-vs-wifi).

## ¿Un plan de internet más rápido soluciona el bufferbloat?

Solo en parte. Un plan más rápido hace que tu conexión se llene con menos frecuencia, así que quizá notes menos el lag. Pero cuando se llena, ya sea por una actualización de un juego, un streaming en 4K o una sincronización grande en la nube, un búfer sobredimensionado se comporta igual. Mucha gente mejora su plan, ve que las descargas van más rápido y aun así sigue teniendo lag en los juegos cada vez que la consola descarga un parche.

La gestión de colas soluciona la causa; el ancho de banda solo reduce la frecuencia con la que la provocas. Si tu prioridad es la latencia, SQM en un router decente suele aportar más mejora que subir de plan.

## En resumen

El bufferbloat es la razón por la que una conexión puede dar buenos resultados en el test y aun así ir lenta: las colas sobredimensionadas del módem o el router hacen esperar a cada paquete cuando la línea está ocupada. La solución no es más velocidad, sino colas más inteligentes, idealmente SQM con fq_codel o CAKE, configurado justo por debajo de la velocidad real de tu línea.

Empieza por medir. [Haz un test de velocidad](/es) mientras vigilas tu ping, compara la latencia en reposo y con carga y, si la diferencia supera unos 30 ms, merece la pena activar los ajustes de colas inteligentes y volver a medir.
