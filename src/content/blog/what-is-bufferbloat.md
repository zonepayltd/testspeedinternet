---
title: "What Is Bufferbloat? Why Your Internet Lags Under Load"
seoTitle: "What Is Bufferbloat? Causes, Tests, and How to Fix It"
description: "What is bufferbloat? Learn why ping spikes when your connection is busy, how to test for it, and how SQM and smart queue settings can fix lag for good."
excerpt: "If games lag and calls stutter the moment someone starts a download, bufferbloat is the likely cause. Here's what it is, how to measure it, and how to fix it."
category: "Gaming & Latency"
tags: ["bufferbloat", "latency", "ping", "router settings", "gaming"]
keywords: ["what is bufferbloat", "bufferbloat test", "how to fix bufferbloat", "ping spikes when downloading", "latency under load", "sqm router setting"]
date: "2026-11-06"
coverAlt: "Illustration of an overfilled router buffer causing a ping spike graph while a large download runs, explaining bufferbloat"
faq:
  - q: "What is bufferbloat in simple terms?"
    a: "Bufferbloat is extra delay caused when routers and modems hold too many packets in a queue while your connection is busy. Your speed looks fine, but ping jumps sharply, so games, video calls, and browsing feel laggy whenever someone uploads or downloads."
  - q: "How do I know if I have bufferbloat?"
    a: "Compare your ping when the connection is idle with your ping during a speed test or large download. If latency rises by more than about 30 to 50 ms under load, you have noticeable bufferbloat; increases of 100 ms or more are severe."
  - q: "Does more bandwidth fix bufferbloat?"
    a: "Not reliably. A faster plan can make the line saturate less often, but whenever it does fill up, oversized buffers still cause the same latency spikes. The real fix is smarter queue management such as SQM."
  - q: "What is SQM on a router?"
    a: "SQM (Smart Queue Management) is a router feature that shapes traffic slightly below your line speed and uses algorithms like fq_codel or CAKE to keep queues short. This keeps latency low even when the connection is fully used."
  - q: "Does bufferbloat affect gaming?"
    a: "Yes. Online games send small, time-sensitive packets, and when they get stuck behind a queue of download or upload traffic, you see rubber-banding, delayed hits, and ping spikes, even on a fast connection."
---

**Bufferbloat** is the lag you get when your internet connection is busy: a router or modem queues up far more data than it should, so every packet, including your game inputs and voice on a call, waits in line. The connection's speed looks normal, but ping can jump from 20 ms to several hundred milliseconds the moment someone starts a large download or upload. It's one of the most common reasons a "fast" connection still feels slow and unresponsive.

**Key takeaways**

- Bufferbloat is a latency problem, not a bandwidth problem.
- The tell-tale sign is ping that's fine when idle but spikes during downloads, uploads, or speed tests.
- Upload traffic (cloud backups, video calls, file sharing) is a frequent trigger because upload links are smaller.
- The most effective fix is Smart Queue Management (SQM) on your router, using algorithms like fq_codel or CAKE.
- A faster plan alone usually doesn't solve it.

## How bufferbloat happens

Every router, modem, and network device has buffers: small areas of memory that temporarily hold packets when they arrive faster than they can be sent. Buffers are useful. They absorb short bursts and prevent unnecessary packet loss.

The problem is size. Memory became cheap, and many devices ship with buffers that can hold hundreds of milliseconds, sometimes seconds, of data. When your connection is saturated by a big download or upload, that buffer fills up and stays full.

TCP, the protocol behind most downloads, increases its sending rate until it detects packet loss. With a huge buffer, packets aren't dropped for a long time; they just wait. So TCP keeps pushing, the queue keeps growing, and every new packet joins the back of the line. A game packet that should take 20 ms might sit behind a large amount of queued download data and arrive 300 ms later.

### Why it usually happens at your router or modem

Bufferbloat builds up at the **bottleneck**, the slowest link in the path. For most homes that's the connection between your modem and your ISP, especially on the upload side. Your home network may run at 1 Gbps internally, but if your plan uploads at 20 Mbps, that's where packets pile up. WiFi can also be a bottleneck when the signal is weak.

## What bufferbloat feels like

Because speed tests often report only download and upload, bufferbloat hides in plain sight. Common symptoms:

- **Gaming:** ping spikes, rubber-banding, and delayed hit registration whenever someone else uses the internet. See [what is a good ping for gaming](/blog/what-is-a-good-ping-for-gaming) for latency targets.
- **Video calls:** your audio turns robotic or your video freezes when a cloud backup or upload starts.
- **Browsing:** pages take a few seconds to start loading during a big download, even though the download is fast.
- **Smart speakers and voice assistants:** noticeably slow responses when the network is busy.

If the problem disappears as soon as the download finishes, bufferbloat is the likely culprit rather than a weak signal or a slow plan.

## How to test for bufferbloat

The goal is to compare latency when the connection is idle with latency when it's fully loaded. You can do this with tools you already have.

1. Connect your computer to the router with Ethernet if possible, so WiFi problems don't muddy the results.
2. Pause other devices' heavy traffic (streaming, downloads, backups).
3. Measure idle latency with our [ping test](/tools/ping-test), or from a terminal with `ping 8.8.8.8` (on macOS and Linux, press Ctrl+C to stop; on Windows use `ping -t 8.8.8.8`).
4. Keep a ping running in a terminal window, then start a [full speed test](/) in your browser.
5. Watch the ping times during the download phase and again during the upload phase.
6. Note the increase. The difference between idle and loaded ping is your bufferbloat.

### How to read the results

| Increase in ping under load | What it means | What you'll notice |
|---|---|---|
| Under 5 ms | Excellent, effectively no bufferbloat | Nothing; gaming and calls stay smooth |
| 5–30 ms | Mild | Rarely noticeable for most users |
| 30–100 ms | Moderate | Occasional lag in games and choppy calls when busy |
| 100–300 ms | Severe | Games and calls struggle whenever anyone downloads |
| Over 300 ms | Very severe | Browsing feels sluggish; real-time apps are unusable under load |

These ranges are common rules of thumb rather than a formal standard. If the upload phase causes a much bigger spike than the download phase, focus your fixes on upload. Jitter tends to rise along with bufferbloat, so it's worth reading [what are jitter and packet loss](/blog/what-is-jitter-and-packet-loss) as well.

## How to fix bufferbloat

### 1. Enable SQM or smart queue settings

**Smart Queue Management (SQM)** is the most effective fix. It does two things: it limits your traffic to slightly below your real line speed, so the queue builds up in your router (which you control) rather than in the modem or ISP equipment; and it uses modern queuing algorithms such as **fq_codel** or **CAKE** that keep queues short and give small, time-sensitive packets a fair turn.

Router makers use different names, so look for:

- "Smart Queue Management," "SQM," or "Smart Queues"
- "Adaptive QoS" or "Bandwidth Management" with fq_codel or CAKE options
- Gaming routers' "anti-bufferbloat" or "latency optimization" settings

Third-party firmware such as OpenWrt includes SQM on many supported routers.

### 2. Set the shaping rate correctly

SQM only works if it shapes below your actual speed.

1. Run several speed tests with Ethernet at different times of day and note your typical download and upload.
2. Set SQM's download limit to about 85–95% of your measured download.
3. Set the upload limit to about 85–95% of your measured upload.
4. Retest loaded ping. If spikes remain, lower the limits a little more.

You give up a small slice of peak speed in exchange for consistently low latency, a trade most gamers and remote workers are happy to make.

### 3. Use QoS to prioritize key devices

If your router lacks SQM, traditional QoS (Quality of Service) that prioritizes a gaming console or work laptop can help. It's less effective than SQM because it doesn't shrink the queue, but it can move important traffic to the front.

### 4. Control upload-heavy apps

Cloud photo backup, file sync, security cameras uploading footage, and game console uploads can saturate a small upload link. Schedule them overnight or cap their upload rate in the app's settings.

### 5. Check your modem and WiFi

Some older cable modems are particularly prone to bufferbloat on upload. If you rent equipment from your ISP, ask whether a newer model is available. Newer DOCSIS 3.1 modems support Active Queue Management, which can reduce upload bufferbloat. A weak WiFi link can also create its own queue, so improving the signal helps; see [Ethernet vs WiFi](/blog/ethernet-vs-wifi).

## Does a faster internet plan fix bufferbloat?

Only partly. A faster plan means your connection fills up less often, so you may notice lag less. But when it does fill, whether from a game update, a 4K stream, or a large cloud sync, an oversized buffer behaves the same way. Many people upgrade, see faster downloads, and still find their games lag whenever the console downloads a patch.

Queue management fixes the cause; bandwidth only reduces how often you trigger it. If latency is your priority, SQM on a decent router often delivers more improvement than a plan upgrade.

## Bottom line

Bufferbloat is why a connection can test fast yet feel sluggish: oversized queues in your modem or router make every packet wait when the line is busy. The fix isn't more speed but smarter queuing, ideally SQM with fq_codel or CAKE, set just below your real line rate.

Start by measuring. [Run a speed test](/) while watching your ping, compare idle and loaded latency, and if the gap is more than about 30 ms, it's worth turning on smart queue settings and retesting.
