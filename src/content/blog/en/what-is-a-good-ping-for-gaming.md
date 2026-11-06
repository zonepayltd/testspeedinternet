---
title: "What Is a Good Ping for Gaming? Latency Explained"
seoTitle: "What Is a Good Ping for Gaming? Latency Explained"
description: "What is a good ping for gaming? Under 50 ms is great for most games and under 20 ms is ideal for competitive shooters. Learn how to test and lower yours."
excerpt: "Ping matters more than raw speed for online games. Here is what counts as good latency for each game type, why it spikes, and practical ways to bring it down."
category: "Gaming & Latency"
tags: ["ping", "latency", "gaming", "jitter"]
keywords: ["what is a good ping for gaming", "good ping", "how to lower ping", "ping vs latency", "high ping fix"]
date: "2026-11-06"
rank: 18
coverAlt: "Gaming setup with a headset and monitor displaying an in-game ping counter in milliseconds, illustrating good ping for gaming"
faq:
  - q: "Is 100 ms ping good for gaming?"
    a: "100 ms is playable for casual and turn-based games but noticeable in fast shooters and fighting games, where you may see delayed hits and rubber-banding. For competitive play, aim for under 50 ms."
  - q: "Is 20 ms ping good?"
    a: "Yes. A ping around 20 ms or lower is excellent for any online game, including competitive first-person shooters."
  - q: "Does faster internet lower ping?"
    a: "Not directly. Ping depends mostly on distance to the server, routing, and network congestion. A faster plan helps only if other traffic in your home was saturating your connection."
  - q: "What is the difference between ping and latency?"
    a: "Latency is the delay for data to travel across the network. Ping is the tool and number most people use to measure it, usually the round-trip time in milliseconds."
  - q: "Why is my ping high when my speed is good?"
    a: "Common causes include a distant game server, WiFi interference, other devices uploading or downloading, bufferbloat in the router, or a VPN. Testing on Ethernet with nothing else running helps isolate the cause."
---

A good ping for gaming is generally **under 50 milliseconds (ms)**. Under 20 ms is excellent and ideal for competitive shooters and fighting games, 50 to 100 ms is playable for most titles but noticeable in fast action, and anything consistently above 100 to 150 ms tends to cause visible lag. Just as important as the number itself is **stability**: a steady 40 ms often feels better than a ping that jumps between 15 and 120.

**Quick answer**

- **0–20 ms:** excellent, competitive-grade.
- **20–50 ms:** very good for all game types.
- **50–100 ms:** fine for casual play; slight delay in fast games.
- **100–150 ms:** noticeable lag in shooters and fighters.
- **150 ms+:** frustrating for real-time games; fine for turn-based.

## What is ping, exactly?

**Ping** is the time it takes for a small packet of data to travel from your device to a server and back, measured in milliseconds. In gaming, it's the delay between pressing a button and the server registering it, plus the time for the result to come back to your screen.

The word comes from a network tool called `ping`, which sends test packets and reports the round-trip time. **Latency** is the broader term for network delay; in everyday use, people treat the two as the same thing.

Ping is different from bandwidth. Download speed tells you how much data your connection can move per second; ping tells you how quickly each piece arrives. Online games send small, frequent updates, so they need very little bandwidth, often well under 1 Mbps during play, but they are very sensitive to delay.

## Good ping by game type

Different genres tolerate latency differently. The ranges below are typical guidance, not hard rules.

| Game type | Examples | Great | Acceptable | Starts to hurt |
|---|---|---|---|---|
| Competitive FPS | Valorant, Counter-Strike 2, Call of Duty | under 20 ms | 20–60 ms | 80 ms+ |
| Fighting games | Street Fighter 6, Tekken 8 | under 30 ms | 30–70 ms | 90 ms+ |
| Battle royale | Fortnite, Apex Legends, Warzone | under 30 ms | 30–80 ms | 100 ms+ |
| MOBAs | League of Legends, Dota 2 | under 40 ms | 40–90 ms | 120 ms+ |
| MMOs | World of Warcraft, Final Fantasy XIV | under 60 ms | 60–120 ms | 150 ms+ |
| Sports and racing | EA Sports FC, Rocket League | under 30 ms | 30–80 ms | 100 ms+ |
| Turn-based and strategy | Hearthstone, Civilization | under 100 ms | 100–200 ms | 250 ms+ |
| Cloud gaming | GeForce NOW, Xbox Cloud Gaming | under 20 ms | 20–40 ms | 60 ms+ |

Cloud gaming is a special case: because the game itself runs on a remote server and streams video back, latency affects every input, not just online interactions. It also needs solid bandwidth, commonly 15 Mbps or more for 1080p and higher for 4K.

## Jitter and packet loss matter too

Ping is only one part of the picture. Two other measurements explain a lot of "my ping is fine but the game feels bad" complaints.

### Jitter

**Jitter** is how much your ping varies from one packet to the next. If ping swings between 20 and 90 ms, the game has to constantly correct, causing stutter and rubber-banding. For gaming, jitter under about 10 ms is good and under 30 ms is usually tolerable.

### Packet loss

**Packet loss** happens when data never arrives. Even 1 to 2 percent loss can cause missed shots, teleporting players, and voice chat dropouts. Ideally it should be zero. Our guide to [jitter and packet loss](/blog/what-is-jitter-and-packet-loss) explains how to test and fix both.

## How to test your ping

You can check latency in a few ways, and each tells you something slightly different.

1. **Use a browser ping test.** Run our [ping test](/tools/ping-test) to see latency and jitter to a nearby server. It's a quick read on your connection's baseline quality.
2. **Check the in-game display.** Most competitive games can show ping or "network stats" on screen. This shows latency to that game's actual server, which is what matters during play.
3. **Use the command line.** On Windows, open Command Prompt and type `ping -n 20 8.8.8.8`. On macOS, open Terminal and type `ping -c 20 8.8.8.8`. Look at the average and at how much individual times vary.
4. **Test under load.** Run a ping test while someone streams or downloads. If ping jumps sharply, you're likely dealing with bufferbloat.

For the most reliable numbers, test on Ethernet with other devices idle, then compare with WiFi.

## What causes high ping?

High or unstable ping usually comes from one of these sources:

- **Distance to the server.** Data travels fast but not instantly. Playing on a server on another continent adds a large, unavoidable delay; transatlantic routes alone commonly add 70 ms or more.
- **WiFi.** Wireless connections add a few milliseconds at best and much more when the signal is weak or the channel is crowded. They also add jitter.
- **Household traffic.** A large download, cloud backup, or 4K stream can saturate your connection and make game packets wait in line.
- **Bufferbloat.** Oversized buffers in routers and modems hold packets too long when the link is busy, inflating ping under load. See [what bufferbloat is](/blog/what-is-bufferbloat) for a deeper look.
- **Connection type.** Fiber usually has the lowest latency, followed by cable, then DSL and 5G home internet. Geostationary satellite has very high latency (often 500 ms or more), while low-orbit satellite services are much lower but more variable.
- **Routing and congestion.** Sometimes your provider's path to the game server is indirect or congested at peak times.
- **VPNs.** A VPN adds an extra hop. It occasionally helps if your provider routes poorly, but usually increases ping.

## How to lower your ping: practical fixes

Work through these roughly in order; the early ones are free and often make the biggest difference.

1. **Switch to Ethernet.** A wired connection is the single most reliable way to reduce ping and jitter. If running a cable isn't practical, powerline adapters or a wired mesh backhaul are alternatives. Our [Ethernet vs WiFi](/blog/ethernet-vs-wifi) comparison covers the options.
2. **Pick the nearest server or region.** In matchmaking settings, select your local region rather than "auto" if auto keeps placing you far away.
3. **Stop background traffic.** Pause downloads, updates, and cloud sync on your gaming device and others in the house while playing.
4. **Use 5 GHz or 6 GHz WiFi if you must be wireless.** These bands are less crowded and usually lower latency than 2.4 GHz at short range.
5. **Enable QoS or SQM on your router.** Quality of Service settings can prioritize gaming traffic; Smart Queue Management, where available, is particularly effective against bufferbloat.
6. **Restart your router and update firmware.** This clears glitches and can improve stability.
7. **Close bandwidth-heavy apps.** Streaming apps, browser tabs with video, and launchers updating in the background all add up.
8. **Contact your provider about persistent spikes.** If wired ping to nearby servers is consistently high or spikes at certain times, your provider may have a routing or line issue to fix.

Want to see where you stand before changing anything? [Test your connection now](/) for download, upload, ping, and jitter in one run.

## Does internet speed affect ping?

Only indirectly. Upgrading from 300 Mbps to 1 Gbps won't lower your ping to a game server; distance and routing set that floor. But if your household regularly maxes out the connection, a faster plan gives more headroom so game traffic isn't stuck behind downloads.

Upload speed matters more than many gamers realize. Your inputs travel upstream, and if someone is uploading large files or streaming on a slow-upload plan, your ping can rise sharply. Checking your [upload speed](/tools/upload-speed-test) can reveal this kind of bottleneck.

## Bottom line

For most players, a stable ping under 50 ms is a good target, and under 20 ms is ideal for competitive games. Consistency matters as much as the average, so watch jitter and packet loss too.

The most effective fixes are simple: play wired, pick a nearby server, and keep other traffic quiet while gaming. To get a baseline before and after changes, [run a free speed and ping test](/) and keep track of how your numbers improve.
