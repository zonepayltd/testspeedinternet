---
title: "What Are Jitter and Packet Loss? How to Test and Fix Them"
seoTitle: "Jitter and Packet Loss Explained: How to Test and Fix"
description: "Learn what jitter and packet loss are, what numbers count as good or bad, how to test them on Windows and macOS, and the fixes that actually work."
excerpt: "Jitter and packet loss cause choppy calls and lag spikes even when your speed looks fine. Here's what they mean, how to measure them, and how to fix them."
category: "Gaming & Latency"
tags: ["jitter", "packet loss", "latency", "ping", "online gaming"]
keywords: ["what is jitter", "what is packet loss", "how to fix packet loss", "jitter test", "good jitter for gaming", "packet loss test"]
date: "2026-11-06"
coverAlt: "Illustration of data packets arriving unevenly and some going missing, showing jitter and packet loss on a network connection"
faq:
  - q: "What is a good jitter value?"
    a: "For most uses, jitter under about 30 ms is acceptable, and under 10 ms is very good. Competitive gamers and people on frequent video calls should aim for single-digit jitter."
  - q: "How much packet loss is acceptable?"
    a: "Ideally 0%. Occasional loss below 1% is usually unnoticeable, but anything consistently above 1–2% tends to cause audible glitches on calls and rubber-banding in games."
  - q: "Can WiFi cause packet loss?"
    a: "Yes. Interference, weak signal, and crowded channels cause WiFi frames to be retransmitted or dropped, which shows up as jitter and packet loss. Testing over an Ethernet cable is the quickest way to rule WiFi in or out."
  - q: "Is jitter the same as ping?"
    a: "No. Ping is how long a round trip takes; jitter is how much that time varies from one packet to the next. A connection can have a low average ping but high jitter, which still feels unstable."
  - q: "Can my ISP fix packet loss?"
    a: "If the loss appears even on a wired connection with your own equipment ruled out, the problem is likely on the line or in your ISP's network. Collect test results at different times of day and contact support with them."
---

**Jitter** is the variation in how long data packets take to travel across your connection, and **packet loss** is the share of packets that never arrive at all. Both are measures of connection *quality* rather than speed, which is why a line that tests at 500 Mbps can still produce robotic-sounding calls and sudden lag spikes in games. The good news is that both are measurable in a minute, and most causes are fixable at home.

**Key takeaways**

- Jitter under about 30 ms is fine for most people; under 10 ms is ideal for gaming and calls.
- Packet loss should be 0%. Anything regularly above 1% is a real problem worth fixing.
- WiFi interference and a congested connection (bufferbloat) are the two most common home causes.
- Testing over Ethernet separates WiFi problems from ISP problems in one step.
- Real-time apps (calls, games, cloud gaming) suffer far more than downloads or streaming.

## What is jitter, in plain terms?

Every time your device talks to a server, data is split into small packets. Ideally each packet takes the same amount of time to make the trip. In reality, the delay wobbles: one packet arrives in 20 ms, the next in 45 ms, the next in 22 ms. That wobble is jitter, usually reported in milliseconds as the average difference between consecutive latency measurements.

Jitter matters because real-time applications need packets at a steady rhythm. A video call app plays audio in tiny slices; if a slice arrives late, the app either waits (adding delay) or skips it (causing a glitch). Apps use a **jitter buffer** to smooth this out, but the bigger the jitter, the bigger that buffer has to be, and the more delay you hear in the conversation.

### Jitter vs ping vs latency

**Latency** is the time a packet takes to reach its destination, and **ping** is the common tool and name for measuring round-trip latency. Jitter is derived from a series of ping measurements: it describes how *consistent* they are. For a deeper look at latency targets, see our guide on [what a good ping for gaming is](/blog/what-is-a-good-ping-for-gaming).

## What is packet loss?

Packet loss is the percentage of packets sent that never reach their destination. Networks are designed to tolerate a little loss. For downloads and web pages, protocols like TCP simply resend missing packets, so you mostly notice a slowdown rather than an error.

Real-time traffic is different. Voice, video calls, and many online games use protocols where a resent packet would arrive too late to be useful. A lost packet in a call becomes a clipped word; in a game it becomes a character teleporting or a shot that doesn't register. Even small amounts of loss can be noticeable in these apps.

## What are good and bad jitter and packet loss numbers?

There is no single official threshold, but the ranges below reflect widely used guidance from VoIP and gaming providers. Treat them as practical rules of thumb.

| Metric | Excellent | Acceptable | Noticeable problems |
|---|---|---|---|
| Jitter | Under 10 ms | 10–30 ms | Over 30 ms |
| Packet loss | 0% | Under 1% | 1–2% or more |
| Ping (for context) | Under 30 ms | 30–80 ms | Over 100 ms |

A few nuances are worth knowing. A single test with a brief spike doesn't mean much; consistent results across several tests do. And jitter that only appears while someone else is uploading or downloading points to a very specific cause, covered below.

## How to test jitter and packet loss

You can measure jitter in your browser and packet loss with tools already built into your computer.

### Test jitter in your browser

1. Close downloads, cloud backups, and streaming on other devices if you want a clean baseline.
2. [Run a free speed test](/) and note the ping and jitter figures alongside download and upload.
3. Repeat the test two or three times, a few minutes apart, to see whether jitter is stable.
4. Run it once more while another device streams video or uploads a file. A big jump in jitter under load is a strong clue.

If you want to focus on latency alone, our dedicated [ping test](/tools/ping-test) runs repeated latency measurements and shows how consistent they are.

### Test packet loss on Windows

1. Press the Windows key, type `cmd`, and open Command Prompt.
2. Run `ping -n 100 8.8.8.8` to send 100 pings to a public DNS server.
3. When it finishes, look at the summary line: it shows packets sent, received, and the percentage lost.
4. For a hop-by-hop view, run `pathping 8.8.8.8`. It takes a few minutes but shows where along the route loss begins.

### Test packet loss on macOS or Linux

1. Open Terminal.
2. Run `ping -c 100 8.8.8.8`.
3. Read the "packet loss" percentage in the summary at the end.
4. Try `traceroute 8.8.8.8` to see the path your traffic takes.

One caution: some routers along the internet deliberately deprioritize ping replies. If you see loss at a middle hop in `pathping` or `traceroute` but *not* at the final destination, that hop is usually not the problem. Loss that starts at a hop and continues all the way to the end is what matters.

## What causes jitter and packet loss?

Most problems fall into a handful of categories, and they're listed here roughly in order of how often they turn out to be the culprit in a typical home.

### WiFi interference and weak signal

WiFi is a shared radio medium. Neighbors' networks, microwaves, Bluetooth devices, thick walls, and distance from the router all cause frames to fail and be retransmitted. Retransmissions show up as jitter; frames that fail repeatedly become packet loss. The 2.4 GHz band is especially crowded in apartment buildings.

### Congestion on your own connection (bufferbloat)

When your connection is saturated, by a cloud backup, a game download, or someone uploading video, your router's queue fills up. Packets wait in line, latency balloons, and jitter spikes. This effect is called bufferbloat, and it's one of the most common reasons games lag "only in the evening." We explain it fully in [what is bufferbloat](/blog/what-is-bufferbloat).

### Faulty cables, ports, or equipment

A damaged Ethernet cable, a loose coax connector, an overheating router, or an aging modem can all drop packets intermittently. Old powerline adapters are another frequent source of jitter.

### ISP and network problems

Line noise on DSL, signal issues on cable, congested neighborhood nodes at peak times, or a poor route between your ISP and a game server can all introduce loss and jitter that no home tweak will fix.

### Device-level issues

Outdated network drivers, aggressive power-saving on WiFi adapters, and background apps (sync clients, updates) can all add jitter on a single device while others on the network are fine.

## How to fix jitter and packet loss

Work through these in order. Each step either fixes the issue or narrows down where it lives.

1. **Restart the modem and router.** Power them off for 30 seconds, then on. It clears memory leaks and stuck states, and it's free.
2. **Test with an Ethernet cable.** Plug your computer directly into the router and retest. If jitter and loss disappear, the problem is WiFi. Our [Ethernet vs WiFi comparison](/blog/ethernet-vs-wifi) explains why wired is so much more consistent.
3. **Improve WiFi if that's the cause.** Move closer to the router, switch to the 5 GHz band, change to a less crowded channel, or add a mesh node for distant rooms.
4. **Stop competing traffic.** Pause cloud backups, large downloads, and game updates during calls and matches. Check other devices too.
5. **Enable QoS or Smart Queue Management.** Many routers offer QoS, and some offer SQM features (often labeled fq_codel or CAKE) that sharply reduce latency under load. This is the most effective fix for bufferbloat-driven jitter.
6. **Replace suspect hardware.** Swap the Ethernet cable, try a different router port, and check coax connectors are finger-tight. If your modem is several years old or ISP-supplied and outdated, ask about a replacement.
7. **Update drivers and firmware.** Update your router firmware and your computer's network adapter driver, and disable power-saving for the WiFi adapter on Windows laptops.
8. **Contact your ISP with evidence.** If loss persists on a wired connection with competing traffic stopped, record several `ping` results at different times of day and share them with support. Concrete numbers get faster escalations than "my internet is bad."

## Does jitter or packet loss affect speed test results?

Somewhat. Packet loss reduces measured download and upload speeds because TCP slows down when it detects loss. Jitter on its own doesn't necessarily lower speed scores, which is exactly why a fast result can coexist with a poor experience in calls and games. That's why it's worth reading the ping and jitter numbers, not just the headline Mbps. Our [how it works](/how-it-works) page explains how each metric is measured.

## Bottom line

Jitter and packet loss explain the frustrating cases where your internet is "fast" but calls break up and games stutter. Aim for jitter under 30 ms (ideally under 10) and packet loss at 0%, and test over both WiFi and Ethernet to find out where problems begin.

Most home issues come down to WiFi interference or a saturated connection, both of which you can fix yourself. [Check your ping and jitter now](/) with a quick test, then work through the fixes above, and take your measurements to your ISP if the problem survives a wired connection.
