---
title: "Can Changing DNS Make Your Internet Faster? How to Do It"
seoTitle: "Does Changing DNS Make Internet Faster? How to Do It"
description: "Can changing DNS make your internet faster? Learn what DNS really affects, when switching helps, and how to change DNS on Windows, Mac, phones, and routers."
excerpt: "Switching DNS won't raise your download speed, but it can make websites start loading faster and add privacy features. Here's what to expect and how to switch safely."
category: "Troubleshooting"
tags: ["dns", "browsing speed", "router settings", "troubleshooting"]
keywords: ["change dns for faster internet", "does changing dns increase speed", "best dns server", "how to change dns on windows", "how to change dns on mac", "fastest dns server"]
date: "2026-11-06"
coverAlt: "Illustration of a computer sending a DNS lookup to a DNS server that returns a website's IP address, showing how DNS affects browsing speed"
faq:
  - q: "Does changing DNS increase internet speed?"
    a: "Changing DNS does not increase your download or upload speed. It can reduce the delay before a website starts loading if your current DNS server is slow or unreliable, which can make browsing feel snappier."
  - q: "What is the fastest DNS server?"
    a: "There's no single fastest DNS for everyone, because speed depends on how close the provider's servers are to you. Cloudflare (1.1.1.1), Google (8.8.8.8), and Quad9 (9.9.9.9) are popular, widely available options; test a few from your own location."
  - q: "Is it safe to change my DNS server?"
    a: "Yes, as long as you use a reputable provider. Your DNS provider can see which domains you look up, so choose one with a clear privacy policy. Changing DNS is easy to reverse by switching back to automatic settings."
  - q: "Can changing DNS reduce ping in games?"
    a: "No. Game ping depends on the network path to the game server, not on DNS. DNS is only used to look up the server's address, usually once when you connect."
  - q: "Should I change DNS on my router or on each device?"
    a: "Changing DNS on the router applies it to every device on your network at once, which is the simplest option for a household. Changing it per device is useful when you only want it on one computer or when you can't access the router settings."
---

Changing your DNS server **won't increase your download or upload speed**, but it can make websites start loading faster if your current DNS is slow, and it can add useful features like malware blocking. DNS only handles the lookup that turns a name like example.com into an IP address. Once that lookup is done, your speed depends on your connection, not your DNS provider.

**Quick answer**

- DNS affects how quickly a connection starts, not how fast data flows afterward.
- Switching helps most when your ISP's DNS is slow, unreliable, or occasionally fails to resolve sites.
- Popular public resolvers include Cloudflare (1.1.1.1), Google Public DNS (8.8.8.8), and Quad9 (9.9.9.9).
- Changing DNS on your router covers every device; changing it on one device takes about a minute.
- DNS won't lower game ping or fix buffering.

## What DNS actually does

The **Domain Name System (DNS)** is often described as the internet's phone book. Computers connect using IP addresses (such as 93.184.215.14), but people type names. When you visit a website, your device asks a DNS resolver, "What's the IP address for this name?" The resolver finds the answer and sends it back, and only then can your browser connect.

By default, your router hands your devices the DNS servers of your internet provider. Many people never change this, and for many it works perfectly well.

### Why lookups are usually fast already

DNS answers are **cached**. Your browser, your operating system, your router, and the resolver all remember recent answers for a period set by the website owner. So when you revisit a popular site, there's often no network lookup at all. A fresh lookup to a nearby resolver typically takes somewhere around 10–50 ms, while a slow or distant resolver might take 100 ms or more.

A single web page can involve lookups for many different domains (the site itself, image servers, fonts, analytics, ads), so a slow resolver can add up to a noticeable pause before pages appear.

## When changing DNS helps (and when it doesn't)

| Situation | Will changing DNS help? |
|---|---|
| Websites take a second or two to *start* loading, then load quickly | Likely yes |
| Some sites intermittently fail with "DNS server not responding" or "server not found" | Likely yes |
| You want malware or phishing domains blocked automatically | Yes, with a filtering resolver |
| You want encrypted DNS (DNS over HTTPS or TLS) for privacy | Yes, with a provider that supports it |
| Your speed test shows low download or upload | No |
| Videos buffer or downloads are slow | No |
| Game ping is high or spikes | No |
| WiFi drops out in certain rooms | No |

If your problem is in the bottom half of this table, start with your connection itself. [Run a free speed test](/) to check download, upload, and ping, then work through [why is my internet so slow](/blog/why-is-my-internet-so-slow) or [how to stop buffering](/blog/how-to-stop-buffering).

## Popular public DNS servers compared

These are well-known, free public resolvers. Each publishes primary and secondary addresses for redundancy.

| Provider | IPv4 addresses | Notable features |
|---|---|---|
| Cloudflare | 1.1.1.1 and 1.0.0.1 | Focus on speed and privacy; filtered variants available (1.1.1.2 blocks malware) |
| Google Public DNS | 8.8.8.8 and 8.8.4.4 | Large global network, very reliable |
| Quad9 | 9.9.9.9 and 149.112.112.112 | Blocks known malicious domains by default; nonprofit |
| OpenDNS (Cisco) | 208.67.222.222 and 208.67.220.220 | Optional content filtering, family-safe options |

Which is fastest varies by location and even by time of day, since it depends on how close each provider's nearest server is to you and how well your ISP connects to it. Your ISP's own DNS can sometimes be the fastest simply because it's on the same network. The only reliable way to know is to test.

### How to compare DNS response times

1. On Windows, open Command Prompt; on macOS, open Terminal.
2. Run `nslookup example.com 1.1.1.1`, then repeat with `8.8.8.8` and `9.9.9.9`. This confirms each resolver responds.
3. On macOS or Linux, run `dig example.com @1.1.1.1` and look at the "Query time" line. Repeat for each resolver, and use a domain you haven't visited recently to avoid cached results.
4. Run each test a few times and compare the typical times, not a single result.

Free benchmarking tools can automate this across many resolvers if you want a more thorough comparison.

## How to change DNS on Windows

On Windows 11:

1. Open **Settings** > **Network & internet**.
2. Select **Wi-Fi** (or **Ethernet**), then click your connection or **Hardware properties**.
3. Next to **DNS server assignment**, click **Edit** and choose **Manual**.
4. Turn on **IPv4** and enter a preferred and alternate DNS (for example, 1.1.1.1 and 1.0.0.1).
5. Optionally set **DNS over HTTPS** to On if the option appears for your chosen provider.
6. Click **Save**, then run `ipconfig /flushdns` in Command Prompt to clear old cached entries.

On Windows 10, go to **Control Panel** > **Network and Sharing Center** > **Change adapter settings**, right-click your connection, choose **Properties**, select **Internet Protocol Version 4 (TCP/IPv4)**, and enter the addresses under "Use the following DNS server addresses."

## How to change DNS on Mac, iPhone, and Android

### macOS

1. Open **System Settings** > **Network**.
2. Select your active connection (Wi-Fi or Ethernet) and click **Details**.
3. Choose **DNS**, click **+**, and add your preferred servers. Remove old ones with **–** if you like.
4. Click **OK**. To flush the cache, run `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder` in Terminal.

### iPhone and iPad

1. Go to **Settings** > **Wi-Fi** and tap the **(i)** next to your network.
2. Tap **Configure DNS**, choose **Manual**, and add your servers.
3. Tap **Save**. This applies only to that WiFi network.

### Android

1. Go to **Settings** > **Network & internet** (or **Connections**) > **Private DNS**.
2. Choose **Private DNS provider hostname** and enter the provider's hostname, such as `one.one.one.one` for Cloudflare or `dns.google` for Google.
3. Save. This uses encrypted DNS over TLS on both WiFi and mobile data. Menu names vary by manufacturer.

## How to change DNS on your router

Changing DNS on the router applies it to every device that uses automatic settings, including TVs and consoles.

1. Find your router's address (often 192.168.0.1 or 192.168.1.1; run `ipconfig` on Windows and look for "Default Gateway").
2. Open that address in a browser and log in, or use your router's app.
3. Look for **DNS**, usually under **Internet**, **WAN**, or **DHCP** settings.
4. Replace the automatic DNS with your chosen primary and secondary servers.
5. Save, then restart devices or reconnect them to WiFi so they pick up the change.

Some ISP-supplied routers lock DNS settings. In that case, change it on individual devices instead.

## Privacy and security considerations

Whoever runs your DNS resolver can see which domain names your devices look up. Switching from your ISP to a public provider moves that visibility rather than eliminating it, so read the provider's privacy policy. Encrypted DNS (DNS over HTTPS or DNS over TLS) stops others on the network path from reading or tampering with your lookups, which is especially useful on public WiFi.

Be aware that some workplaces, schools, and parental-control setups rely on specific DNS settings. Changing DNS on a managed device may break internal sites or violate policy. If you use a VPN, it typically supplies its own DNS; see [does a VPN slow down internet](/blog/does-a-vpn-slow-down-internet). You can check which public IP your traffic appears from with our [what is my IP](/what-is-my-ip) tool.

## Bottom line

Changing DNS is a quick, free, reversible tweak that can make browsing feel more responsive and add security filtering, but it won't raise your Mbps or lower your game ping. It's worth doing if pages hesitate before loading or your ISP's DNS is unreliable.

If your internet still feels slow after switching, the cause is elsewhere. [Test your internet speed](/) to check whether your download, upload, and latency match what you pay for.
