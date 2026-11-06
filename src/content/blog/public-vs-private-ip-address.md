---
title: "Public vs Private IP Address: What's the Difference?"
seoTitle: "Public vs Private IP Address: Key Differences Explained"
description: "Public vs private IP address explained: what each one is, the private IP ranges, how NAT links them, and how to find both on Windows, Mac, and phones."
excerpt: "Your router has one public IP address that the internet sees, while every device at home gets its own private IP. Here's how the two work together and how to find each."
category: "Privacy & Security"
tags: ["ip address", "networking", "privacy", "nat"]
keywords: ["public vs private ip address", "what is a private ip address", "what is my public ip", "private ip address range", "how to find my ip address"]
date: "2026-11-06"
coverAlt: "Diagram of a home router with one public IP address facing the internet and several devices with private IP addresses on the local network"
faq:
  - q: "What is the difference between a public and private IP address?"
    a: "A public IP address is assigned by your internet provider and identifies your connection on the internet. A private IP address is assigned by your router to each device on your home network and only works inside that network."
  - q: "Can someone find my location from my public IP?"
    a: "A public IP usually reveals your approximate location, such as your city or region and your internet provider, but not your street address. Only your ISP can link the IP to a specific customer, and it generally does so only under legal process."
  - q: "Is 192.168.1.1 a public or private IP?"
    a: "192.168.1.1 is a private IP address. It's commonly used as the default address of home routers, and it can't be reached directly from the internet."
  - q: "Why does my public IP address change?"
    a: "Most home connections use dynamic IP addresses, which your ISP can reassign when your router restarts, a lease expires, or the network is reconfigured. Static public IPs are usually available only on business plans or for an extra fee."
  - q: "Do all my devices share the same public IP?"
    a: "Yes, typically. Your router uses NAT to let every device on your home network share one public IPv4 address, while each device keeps its own private IP internally."
---

A **public IP address** is the address the rest of the internet sees for your connection; your internet provider assigns it to your router. A **private IP address** is an internal address your router gives each device at home, such as 192.168.1.23, which only works on your local network. Your router translates between the two, letting every phone, laptop, and TV share a single public address.

**Key takeaways**

- Public IPs are globally unique and reachable on the internet; private IPs are reused in millions of homes and aren't routable online.
- Private IPv4 ranges are 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16.
- NAT (Network Address Translation) on your router connects private devices to the internet through one public IP.
- Websites see your public IP, which reveals your ISP and approximate location, not your exact address.
- You can find your public IP with an IP lookup tool and your private IP in your device's network settings.

## What is a public IP address?

Every device that communicates directly on the internet needs a unique address so data can find its way back. That's the public IP. For home internet, your ISP assigns one public IPv4 address to your router (or modem), and that address represents your entire household online.

When you load a website, the site's server sees your public IP. It uses that address to send the page back, and it may also use it to estimate your region, show localized content, or apply security checks.

### Dynamic vs static public IPs

Most residential plans use **dynamic** public IPs, which can change when your router restarts or the ISP rotates addresses. This is normal and doesn't affect everyday use. **Static** IPs stay the same and are mostly used by businesses that host servers, run VPN gateways, or need allowlisting. ISPs usually charge extra for them.

## What is a private IP address?

Inside your home, your router acts as a small network manager. Using **DHCP**, it automatically gives each connected device a private IP address, along with the router's own address (the default gateway) and DNS settings.

These private addresses come from ranges reserved by the internet standards (RFC 1918) specifically for local networks. Because they're never routed on the public internet, the same addresses can be reused in every home, office, and coffee shop in the world without conflict.

### Private IPv4 address ranges

| Range | CIDR notation | Number of addresses | Where you'll typically see it |
|---|---|---|---|
| 10.0.0.0 – 10.255.255.255 | 10.0.0.0/8 | About 16.8 million | Corporate networks, some ISP routers and mesh systems |
| 172.16.0.0 – 172.31.255.255 | 172.16.0.0/12 | About 1 million | Business networks, Docker and virtual machines |
| 192.168.0.0 – 192.168.255.255 | 192.168.0.0/16 | About 65,000 | Most home routers (192.168.0.x or 192.168.1.x) |

A few other special ranges are worth knowing. **169.254.x.x** is a link-local address your device gives itself when it can't reach a DHCP server, which usually means it's connected to WiFi but not actually getting an address. **127.0.0.1** is "localhost," which always refers to the device itself.

## Public vs private IP: side-by-side comparison

| Feature | Public IP | Private IP |
|---|---|---|
| Assigned by | Your internet service provider | Your router (via DHCP) |
| Scope | Global, reachable on the internet | Local network only |
| Uniqueness | Unique worldwide at any moment | Reused across countless networks |
| Who sees it | Websites, apps, game servers, email servers | Devices on the same network |
| Example | 203.0.113.45 | 192.168.1.23 |
| Changes when | ISP reassigns it (dynamic) | Router reassigns it, or you set a reservation |
| Cost | Included with your plan; static may cost extra | Free |

## How NAT connects private and public addresses

**Network Address Translation (NAT)** is the reason a dozen devices can share one public IP. When your laptop requests a web page, the router replaces the laptop's private address with the public IP, notes which device made the request, and sends it out. When the reply comes back, the router checks its table and forwards the response to the right device.

NAT was introduced largely because the world ran short of IPv4 addresses, which have a theoretical limit of about 4.3 billion. A side benefit is that unsolicited inbound connections can't reach your devices directly, because the router doesn't know where to send them. This isn't a substitute for a firewall, but it does reduce exposure.

### When NAT causes problems

NAT can get in the way of anything that needs incoming connections: hosting a game server, some peer-to-peer games, remote access to a home camera, or running a personal website. Gamers often see this as "Strict" or "Moderate" NAT type. Solutions include enabling UPnP, setting up port forwarding, or using your router's gaming or DMZ settings. If online matchmaking is also suffering from lag, [run a speed test](/) to check your ping, and see [what is a good ping for gaming](/blog/what-is-a-good-ping-for-gaming) for target numbers.

### What about CGNAT?

Some ISPs, especially mobile, 5G home internet, and some satellite providers, use **carrier-grade NAT (CGNAT)**. Your router receives an address from yet another shared range (100.64.0.0/10), and many customers share one public IP. If the WAN address shown in your router's settings doesn't match the address shown by a public IP lookup, you're probably behind CGNAT. It works fine for browsing and streaming, but makes port forwarding impossible without help from the ISP.

## How to find your public and private IP

### Find your public IP

The fastest way is to visit our [what is my IP](/what-is-my-ip) page, which shows the public address websites see, along with your ISP and approximate location. Your router's admin page also usually lists it as the WAN or Internet IP.

### Find your private IP on Windows

1. Press **Windows + R**, type `cmd`, and press Enter.
2. Run `ipconfig`.
3. Look for **IPv4 Address** under your active adapter (Wi-Fi or Ethernet). The **Default Gateway** is your router's private IP.

### Find your private IP on macOS

1. Open **System Settings** > **Network** and select your connection; the IP address is shown under **Details**.
2. Or open Terminal and run `ipconfig getifaddr en0` (on most Macs, en0 is WiFi).

### Find your private IP on iPhone and Android

1. **iPhone:** Settings > Wi-Fi > tap **(i)** next to your network and look for **IP Address**.
2. **Android:** Settings > Network & internet > Wi-Fi > tap your network and look under **Advanced** or **Network details**. Menu names vary by manufacturer.

## Privacy: what your public IP reveals

Your public IP isn't a home address, but it isn't anonymous either. From an IP alone, anyone can usually tell:

- Your internet provider.
- Your approximate location, often the city or region, sometimes less precise.
- Whether the address belongs to a residential network, a data center, a VPN, or a mobile carrier.

Only your ISP can map the IP to your account, and it typically does that only under legal process. Still, IPs are used for fraud scoring, rate limiting, and geo-restrictions. Our [IP risk score](/ip-risk-score) tool shows how an address might be rated by such systems. A VPN replaces your public IP with the VPN server's address; for the speed trade-offs, see [does a VPN slow down internet](/blog/does-a-vpn-slow-down-internet).

Private IPs, on the other hand, aren't visible to websites at all, and sharing one (for example, "my laptop is 192.168.1.15") reveals almost nothing to someone outside your network.

## IPv6 changes the picture

With **IPv6**, there are so many addresses that every device can have its own globally routable address, reducing the need for NAT. Most IPv6 home setups still use a router firewall to block unsolicited incoming traffic. IPv6 also has its own local-only ranges (such as fe80::/10 link-local and fd00::/8 unique local addresses), which play a role similar to IPv4 private addresses. Many homes now run both IPv4 and IPv6 side by side.

## Bottom line

Your public IP is your household's single identity on the internet, assigned by your ISP. Your private IPs are internal labels your router gives each device, and NAT ties the two together so everything at home can share one connection.

To see the address the internet sees right now, check [what is my IP](/what-is-my-ip). And if your connection feels slow while you're there, [run a free speed test](/) to check download, upload, and ping in under a minute.
