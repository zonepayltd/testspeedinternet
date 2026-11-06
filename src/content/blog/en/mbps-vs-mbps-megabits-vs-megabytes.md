---
title: "Mbps vs MBps: Megabits vs Megabytes Explained"
seoTitle: "Mbps vs MBps: Megabits vs Megabytes Explained"
description: "Mbps vs MBps: learn the difference between megabits and megabytes, how to convert them, and why a 100 Mbps plan downloads at about 12 MB/s. Read on."
excerpt: "Internet speeds are sold in megabits, while files and download managers use megabytes. One letter makes an eightfold difference. Here is how to convert between them."
category: "Speed Testing"
tags: ["mbps", "download speed", "speed test", "bandwidth"]
keywords: ["mbps vs MBps", "megabits vs megabytes", "convert mbps to MB/s", "how many MB per second is 100 mbps", "what does mbps mean"]
date: "2026-11-06"
coverAlt: "Side-by-side comparison of a lowercase b for megabits and an uppercase B for megabytes, with a download progress bar showing MB/s"
faq:
  - q: "Is Mbps the same as MBps?"
    a: "No. Mbps means megabits per second and MBps (or MB/s) means megabytes per second. One byte is eight bits, so 8 Mbps equals 1 MBps."
  - q: "How many MB per second is 100 Mbps?"
    a: "100 Mbps divided by 8 is 12.5 MB per second in theory. In practice, protocol overhead usually brings real-world downloads to roughly 11 to 12 MB/s."
  - q: "Why do internet providers use megabits instead of megabytes?"
    a: "Networks transmit data one bit at a time, so the telecom industry has always measured line rates in bits per second. It is a long-standing technical convention, and it also produces larger-looking numbers."
  - q: "Is 1 Gbps the same as 1 GB per second?"
    a: "No. 1 Gbps is one gigabit per second, which is about 125 megabytes per second in theory. Real downloads on a gigabit plan typically land somewhere around 100 to 115 MB/s at best."
  - q: "How do I convert MB/s to Mbps?"
    a: "Multiply by 8. A download running at 5 MB/s is using about 40 Mbps of your connection."
---

**Mbps** stands for megabits per second and **MBps** (usually written MB/s) stands for megabytes per second. A byte is eight bits, so megabytes per second is eight times larger than megabits per second. That's why a 100 Mbps internet plan downloads files at about 12 MB/s, not 100 MB/s, and why the lowercase "b" in your provider's ads matters so much.

**Key takeaways**

- **Lowercase b = bits, uppercase B = bytes.** 1 byte = 8 bits.
- Divide Mbps by 8 to get MB/s. Multiply MB/s by 8 to get Mbps.
- Internet plans and speed tests use **Mbps**; file sizes and most download managers use **MB** or **MB/s**.
- Real downloads land slightly below the math because of network overhead.

## What is the difference between a bit and a byte?

A **bit** is the smallest unit of digital data: a single 1 or 0. A **byte** is a group of eight bits, which is enough to represent one character of plain text, such as the letter "A". Everything from photos to games is ultimately stored as bytes.

The prefixes work the same way for both. "Mega" means million, so a megabit is a million bits and a megabyte is a million bytes (eight million bits). "Giga" means billion, so a gigabit is a thousand megabits.

The confusion comes from abbreviations that differ by a single capital letter:

| Abbreviation | Stands for | Equals | Typically used for |
|---|---|---|---|
| Mbps or Mb/s | Megabits per second | 1,000,000 bits per second | Internet plans, speed tests, WiFi ratings |
| MBps or MB/s | Megabytes per second | 8 megabits per second | Download progress, disk speeds |
| Gbps or Gb/s | Gigabits per second | 1,000 Mbps | Fiber plans, Ethernet ports |
| GB/s | Gigabytes per second | 8 Gbps | SSD and memory speeds |
| MB | Megabyte | 8 megabits | File sizes, data caps (with GB) |

## Why internet speeds are measured in megabits

Networks send data serially, one bit after another, down a cable or over the air. Engineers have measured transmission rates in bits per second since the early days of modems and telephone lines, and the convention stuck. Ethernet ports, WiFi standards, fiber connections, and cellular networks are all rated in bits per second.

Storage, on the other hand, is organized in bytes. Your operating system, browser, and game launchers report file sizes in megabytes and gigabytes, and many show download progress in MB/s. So when you move from the network world to the storage world, you switch units.

It's fair to note a side effect: megabit numbers are eight times bigger than megabyte numbers, which makes plans look faster on a billboard. But the unit itself is a genuine technical standard, not a trick, and speed tests, including [ours](/), use it so results line up with your plan.

## How to convert Mbps to MB/s (and back)

The conversion is simple division or multiplication by 8.

1. **Mbps to MB/s:** divide by 8. Example: 200 Mbps ÷ 8 = 25 MB/s.
2. **MB/s to Mbps:** multiply by 8. Example: 3 MB/s × 8 = 24 Mbps.
3. **Gbps to MB/s:** multiply by 1,000, then divide by 8. Example: 1 Gbps = 1,000 Mbps ÷ 8 = 125 MB/s.

### Quick conversion table

| Plan speed | Theoretical max (MB/s) | Typical real-world download (MB/s) |
|---|---|---|
| 25 Mbps | 3.1 | about 2.8–3 |
| 50 Mbps | 6.25 | about 5.5–6 |
| 100 Mbps | 12.5 | about 11–12 |
| 300 Mbps | 37.5 | about 34–36 |
| 500 Mbps | 62.5 | about 56–60 |
| 1 Gbps | 125 | about 100–115 |

The "typical" column is a rough guide. Every packet carries headers and error-checking data that count toward line speed but not toward your file, so real downloads usually land a few percent below the theoretical number. The server you download from, your WiFi, and your storage drive can all reduce it further.

## How long will a download take?

Once you know the conversion, estimating download time is straightforward:

1. Find the file size in gigabytes (GB) or megabytes (MB).
2. Convert it to megabits: multiply megabytes by 8 (and gigabytes by 8,000).
3. Divide by your measured download speed in Mbps.

For example, a 50 GB game is 400,000 megabits. On a 100 Mbps connection, that's about 4,000 seconds, or a little over an hour in ideal conditions. On a 500 Mbps connection it's closer to 13 to 15 minutes, assuming the game server can keep up.

| File | Size | At 50 Mbps | At 100 Mbps | At 500 Mbps |
|---|---|---|---|---|
| Song (MP3) | 5 MB | under 1 sec | under 1 sec | under 1 sec |
| HD movie | 4 GB | about 11 min | about 5–6 min | about 1 min |
| Large game | 50 GB | about 2.2 hrs | about 1.1 hrs | about 13–15 min |
| Phone backup | 100 GB | about 4.5 hrs | about 2.2 hrs | about 27 min |

These are best-case estimates. If your times are much longer, [run a download speed test](/tools/download-speed-test) to see what you are actually getting.

## Mbps and data usage: a different question

Speed and data usage are easy to mix up. **Mbps** is a rate, like miles per hour. **GB** of data used is a total, like miles driven. A fast connection doesn't use more data by itself; it just lets you use it more quickly.

Streaming is a good example. A 4K stream that averages around 15 to 25 Mbps works out to very roughly 7 to 10 GB per hour, since every second at 20 Mbps transfers 2.5 MB. If you have a data cap on a mobile or satellite plan, that conversion helps you budget. Our guide to [internet speed for streaming](/blog/internet-speed-for-streaming-netflix-youtube) lists typical bitrates for popular services.

## Common places the confusion shows up

Knowing the difference clears up a lot of "my internet is slower than advertised" worries.

### Game launchers and app stores

Steam, console stores, and many launchers show download speed in MB/s by default. Seeing "35 MB/s" on a 300 Mbps plan is actually right on target, because 35 × 8 = 280 Mbps. Some launchers let you switch the display to Mbps.

### Browser downloads

Chrome, Edge, Firefox, and Safari report download rates in MB/s or KB/s. A browser download at 1.2 MB/s is only about 10 Mbps, which may point to a slow server rather than a slow connection. Testing with a speed test shows the real capacity of your line.

### Network hardware specs

Router boxes advertise totals like "AX3000" or "BE9300". These are combined theoretical maximums across all bands, in megabits, and no single device will ever reach them. Ethernet ports labeled "Gigabit" mean 1 Gbps, or about 125 MB/s at most.

### Storage and USB speeds

SSDs and USB drives are usually rated in MB/s, but USB standards (like 5 Gbps or 10 Gbps) are rated in bits. A "5 Gbps" USB port works out to roughly 500 MB/s of real-world throughput at best, after encoding overhead.

## Do the binary units (MiB) matter?

You may also see **MiB** (mebibytes) and **GiB** (gibibytes). These are binary units: 1 MiB = 1,048,576 bytes, while 1 MB = 1,000,000 bytes. Windows historically labels binary values as "MB" and "GB," while macOS uses decimal units. The difference is about 5 percent at the mega level and about 7 percent at the giga level.

For internet speeds, this rarely matters. Network rates are almost always decimal (1 Mbps = 1,000,000 bits per second). The bits-versus-bytes factor of 8 is far more important than the decimal-versus-binary difference.

## Bottom line

Mbps and MB/s describe the same thing in different units, and the key number is 8. Divide your plan speed by 8 to estimate download rates in MB/s, and multiply a launcher's MB/s figure by 8 to compare it with your plan.

If your downloads still seem slow after doing the math, measure your actual connection. [Run a free speed test](/) and compare the result with your plan, or see our guide to [testing internet speed accurately](/blog/how-to-test-internet-speed-accurately) for the best setup. For context on what numbers you need, see [what counts as a good internet speed](/guides/good-internet-speed).
