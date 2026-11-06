---
title: "¿Qué son el jitter y la pérdida de paquetes? Cómo medirlos y solucionarlos"
seoTitle: "Jitter y pérdida de paquetes: cómo medirlos y solucionarlos"
description: "Descubre qué son el jitter y la pérdida de paquetes, qué valores son buenos o malos, cómo medirlos en Windows y macOS y las soluciones que funcionan de verdad."
excerpt: "El jitter y la pérdida de paquetes provocan llamadas entrecortadas y picos de lag aunque tu velocidad parezca buena. Te explicamos qué significan, cómo medirlos y cómo solucionarlos."
category: "Gaming & Latency"
tags: ["jitter", "pérdida de paquetes", "latencia", "ping", "juegos online"]
keywords: ["qué es el jitter", "qué es la pérdida de paquetes", "cómo solucionar la pérdida de paquetes", "test de jitter", "jitter bueno para jugar", "test de pérdida de paquetes"]
date: "2026-11-06"
coverAlt: "Ilustración de paquetes de datos que llegan de forma irregular y algunos que se pierden, mostrando el jitter y la pérdida de paquetes en una conexión de red"
faq:
  - q: "¿Qué valor de jitter es bueno?"
    a: "Para la mayoría de usos, un jitter por debajo de unos 30 ms es aceptable, y por debajo de 10 ms es muy bueno. Los jugadores competitivos y quienes hacen videollamadas con frecuencia deberían aspirar a un jitter de un solo dígito."
  - q: "¿Cuánta pérdida de paquetes es aceptable?"
    a: "Lo ideal es un 0 %. Una pérdida ocasional por debajo del 1 % no suele notarse, pero cualquier valor que se mantenga por encima del 1–2 % tiende a provocar cortes audibles en las llamadas y rubber-banding en los juegos."
  - q: "¿El WiFi puede provocar pérdida de paquetes?"
    a: "Sí. Las interferencias, la señal débil y los canales saturados hacen que las tramas WiFi se retransmitan o se descarten, lo que se traduce en jitter y pérdida de paquetes. Hacer la prueba con un cable Ethernet es la forma más rápida de confirmar o descartar el WiFi."
  - q: "¿El jitter es lo mismo que el ping?"
    a: "No. El ping es lo que tarda un viaje de ida y vuelta; el jitter es cuánto varía ese tiempo de un paquete a otro. Una conexión puede tener un ping medio bajo pero un jitter alto, y aun así sentirse inestable."
  - q: "¿Mi proveedor puede solucionar la pérdida de paquetes?"
    a: "Si la pérdida aparece incluso en una conexión por cable y has descartado tus propios equipos, lo más probable es que el problema esté en la línea o en la red de tu proveedor. Reúne resultados de pruebas a distintas horas del día y contacta con el soporte técnico con ellos."
---

El **jitter** es la variación del tiempo que tardan los paquetes de datos en recorrer tu conexión, y la **pérdida de paquetes** es la proporción de paquetes que nunca llegan. Ambos miden la *calidad* de la conexión, no su velocidad, y por eso una línea que da 500 Mbps en el test puede seguir provocando llamadas con voz robótica y picos repentinos de lag en los juegos. La buena noticia es que ambos se pueden medir en un minuto y que la mayoría de las causas se pueden solucionar en casa.

**Puntos clave**

- Un jitter por debajo de unos 30 ms está bien para la mayoría; por debajo de 10 ms es ideal para jugar y hacer llamadas.
- La pérdida de paquetes debería ser del 0 %. Cualquier valor que supere el 1 % con regularidad es un problema real que conviene solucionar.
- Las interferencias del WiFi y una conexión saturada (bufferbloat) son las dos causas domésticas más comunes.
- Hacer la prueba por Ethernet separa los problemas del WiFi de los del proveedor en un solo paso.
- Las apps en tiempo real (llamadas, juegos, juego en la nube) sufren mucho más que las descargas o el streaming.

## ¿Qué es el jitter, explicado de forma sencilla?

Cada vez que tu dispositivo se comunica con un servidor, los datos se dividen en pequeños paquetes. Lo ideal sería que cada paquete tardara lo mismo en hacer el viaje. En la realidad, el retraso fluctúa: un paquete llega en 20 ms, el siguiente en 45 ms y el siguiente en 22 ms. Esa fluctuación es el jitter, que normalmente se expresa en milisegundos como la diferencia media entre mediciones de latencia consecutivas.

El jitter importa porque las aplicaciones en tiempo real necesitan recibir los paquetes a un ritmo constante. Una app de videollamadas reproduce el audio en fragmentos diminutos; si un fragmento llega tarde, la app o bien espera (lo que añade retraso) o bien se lo salta (lo que provoca un corte). Las apps usan un **búfer de jitter** para suavizarlo, pero cuanto mayor es el jitter, mayor tiene que ser ese búfer y más retraso notas en la conversación.

### Jitter vs ping vs latencia

La **latencia** es el tiempo que tarda un paquete en llegar a su destino, y el **ping** es la herramienta y el nombre habitual para medir la latencia de ida y vuelta. El jitter se obtiene a partir de una serie de mediciones de ping: describe lo *constantes* que son. Para profundizar en los objetivos de latencia, consulta nuestra guía sobre [qué es un buen ping para jugar](/es/blog/what-is-a-good-ping-for-gaming).

## ¿Qué es la pérdida de paquetes?

La pérdida de paquetes es el porcentaje de paquetes enviados que nunca llegan a su destino. Las redes están diseñadas para tolerar una pequeña pérdida. En las descargas y las páginas web, protocolos como TCP simplemente reenvían los paquetes que faltan, así que lo que notas es sobre todo una ralentización, no un error.

El tráfico en tiempo real es distinto. La voz, las videollamadas y muchos juegos online usan protocolos en los que un paquete reenviado llegaría demasiado tarde para servir de algo. Un paquete perdido en una llamada se convierte en una palabra cortada; en un juego, en un personaje que se teletransporta o en un disparo que no se registra. Incluso pequeñas pérdidas pueden notarse en estas apps.

## ¿Qué valores de jitter y pérdida de paquetes son buenos y malos?

No existe un umbral oficial único, pero los rangos siguientes reflejan las recomendaciones más extendidas de los proveedores de VoIP y de juegos. Tómalos como reglas prácticas.

| Métrica | Excelente | Aceptable | Problemas apreciables |
|---|---|---|---|
| Jitter | Menos de 10 ms | 10–30 ms | Más de 30 ms |
| Pérdida de paquetes | 0 % | Menos del 1 % | 1–2 % o más |
| Ping (como referencia) | Menos de 30 ms | 30–80 ms | Más de 100 ms |

Conviene tener en cuenta algunos matices. Una sola prueba con un pico breve no significa mucho; lo que importa son los resultados constantes en varias pruebas. Y un jitter que solo aparece cuando otra persona está subiendo o descargando algo apunta a una causa muy concreta, que explicamos más abajo.

## Cómo medir el jitter y la pérdida de paquetes

Puedes medir el jitter en el navegador y la pérdida de paquetes con herramientas que ya vienen incluidas en tu ordenador.

### Mide el jitter en el navegador

1. Cierra las descargas, las copias de seguridad en la nube y el streaming en otros dispositivos si quieres una referencia limpia.
2. [Haz un test de velocidad gratis](/es) y anota las cifras de ping y jitter junto con la descarga y la subida.
3. Repite el test dos o tres veces, con unos minutos de diferencia, para ver si el jitter es estable.
4. Hazlo una vez más mientras otro dispositivo reproduce vídeo o sube un archivo. Un gran salto del jitter con carga es una pista clara.

Si quieres centrarte solo en la latencia, nuestro [test de ping](/es/tools/ping-test) realiza mediciones de latencia repetidas y muestra lo constantes que son.

### Mide la pérdida de paquetes en Windows

1. Pulsa la tecla Windows, escribe `cmd` y abre el Símbolo del sistema.
2. Ejecuta `ping -n 100 8.8.8.8` para enviar 100 pings a un servidor DNS público.
3. Cuando termine, mira la línea de resumen: muestra los paquetes enviados, los recibidos y el porcentaje perdido.
4. Para ver el recorrido salto a salto, ejecuta `pathping 8.8.8.8`. Tarda unos minutos, pero muestra en qué punto de la ruta empieza la pérdida.

### Mide la pérdida de paquetes en macOS o Linux

1. Abre Terminal.
2. Ejecuta `ping -c 100 8.8.8.8`.
3. Lee el porcentaje de "packet loss" en el resumen final.
4. Prueba `traceroute 8.8.8.8` para ver la ruta que sigue tu tráfico.

Una advertencia: algunos routers de internet dan menos prioridad a las respuestas de ping a propósito. Si ves pérdida en un salto intermedio en `pathping` o `traceroute`, pero *no* en el destino final, ese salto normalmente no es el problema. Lo que importa es la pérdida que empieza en un salto y continúa hasta el final.

## ¿Qué provoca el jitter y la pérdida de paquetes?

La mayoría de los problemas encajan en unas pocas categorías, que aparecen aquí más o menos en el orden en que suelen resultar ser la causa en un hogar típico.

### Interferencias y señal débil en el WiFi

El WiFi es un medio de radio compartido. Las redes de los vecinos, los microondas, los dispositivos Bluetooth, las paredes gruesas y la distancia al router hacen que las tramas fallen y se retransmitan. Las retransmisiones se manifiestan como jitter; las tramas que fallan una y otra vez se convierten en pérdida de paquetes. La banda de 2.4 GHz está especialmente saturada en los edificios de pisos.

### Congestión en tu propia conexión (bufferbloat)

Cuando tu conexión está saturada, por una copia de seguridad en la nube, la descarga de un juego o alguien que sube un vídeo, la cola de tu router se llena. Los paquetes esperan su turno, la latencia se dispara y aparecen picos de jitter. Este efecto se llama bufferbloat y es una de las razones más habituales por las que los juegos van con lag "solo por la noche". Lo explicamos a fondo en [qué es el bufferbloat](/es/blog/what-is-bufferbloat).

### Cables, puertos o equipos defectuosos

Un cable Ethernet dañado, un conector coaxial suelto, un router que se sobrecalienta o un módem viejo pueden perder paquetes de forma intermitente. Los adaptadores PLC antiguos son otra fuente frecuente de jitter.

### Problemas del proveedor y de la red

El ruido en la línea DSL, los problemas de señal en el cable, los nodos del barrio congestionados en horas punta o una mala ruta entre tu proveedor y un servidor de juegos pueden introducir pérdida y jitter que ningún ajuste casero solucionará.

### Problemas del propio dispositivo

Los controladores de red desactualizados, el ahorro de energía agresivo de los adaptadores WiFi y las apps en segundo plano (clientes de sincronización, actualizaciones) pueden añadir jitter en un único dispositivo mientras los demás de la red funcionan bien.

## Cómo solucionar el jitter y la pérdida de paquetes

Sigue estos pasos en orden. Cada uno o soluciona el problema o te ayuda a acotar dónde está.

1. **Reinicia el módem y el router.** Apágalos durante 30 segundos y vuelve a encenderlos. Se eliminan fugas de memoria y estados bloqueados, y es gratis.
2. **Haz la prueba con un cable Ethernet.** Conecta el ordenador directamente al router y vuelve a medir. Si el jitter y la pérdida desaparecen, el problema es el WiFi. Nuestra [comparativa Ethernet vs WiFi](/es/blog/ethernet-vs-wifi) explica por qué la conexión por cable es mucho más constante.
3. **Mejora el WiFi si esa es la causa.** Acércate al router, cambia a la banda de 5 GHz, pasa a un canal menos saturado o añade un nodo mesh para las habitaciones alejadas.
4. **Detén el tráfico que compite.** Pausa las copias de seguridad en la nube, las descargas grandes y las actualizaciones de juegos durante las llamadas y las partidas. Revisa también los demás dispositivos.
5. **Activa QoS o la gestión inteligente de colas.** Muchos routers ofrecen QoS, y algunos incluyen funciones SQM (a menudo etiquetadas como fq_codel o CAKE) que reducen drásticamente la latencia con carga. Es la solución más eficaz para el jitter causado por el bufferbloat.
6. **Sustituye el hardware sospechoso.** Cambia el cable Ethernet, prueba otro puerto del router y comprueba que los conectores coaxiales estén bien apretados a mano. Si tu módem tiene varios años o es un equipo antiguo del proveedor, pregunta por un recambio.
7. **Actualiza controladores y firmware.** Actualiza el firmware del router y el controlador del adaptador de red de tu ordenador, y desactiva el ahorro de energía del adaptador WiFi en los portátiles con Windows.
8. **Contacta con tu proveedor con pruebas.** Si la pérdida persiste en una conexión por cable sin tráfico que compita, registra varios resultados de `ping` a distintas horas del día y compártelos con el soporte técnico. Las cifras concretas consiguen que escalen el caso más rápido que un "mi internet va mal".

## ¿El jitter o la pérdida de paquetes afectan a los resultados del test de velocidad?

En cierta medida. La pérdida de paquetes reduce la velocidad de descarga y subida medida, porque TCP se ralentiza cuando detecta pérdidas. El jitter por sí solo no tiene por qué bajar las cifras de velocidad, y precisamente por eso un resultado rápido puede convivir con una mala experiencia en llamadas y juegos. Por eso merece la pena fijarse en las cifras de ping y jitter, y no solo en los Mbps principales. Nuestra página [cómo funciona](/es/how-it-works) explica cómo se mide cada métrica.

## En resumen

El jitter y la pérdida de paquetes explican esos casos frustrantes en los que tu internet es "rápido", pero las llamadas se cortan y los juegos dan tirones. Aspira a un jitter por debajo de 30 ms (idealmente por debajo de 10) y a una pérdida de paquetes del 0 %, y haz pruebas tanto por WiFi como por Ethernet para averiguar dónde empiezan los problemas.

La mayoría de los problemas domésticos se reducen a interferencias del WiFi o a una conexión saturada, y ambos los puedes solucionar tú mismo. [Comprueba ahora tu ping y tu jitter](/es) con un test rápido, aplica las soluciones anteriores y lleva tus mediciones a tu proveedor si el problema persiste con una conexión por cable.
