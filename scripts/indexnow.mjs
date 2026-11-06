// Tells Bing, Yandex, Seznam, Naver etc. (via IndexNow) that pages changed, so they
// crawl them within hours instead of weeks. Run AFTER a deploy is live:
//   node scripts/indexnow.mjs                 -> submits every URL in the live sitemap
//   node scripts/indexnow.mjs /blog/some-slug  -> submits only the given paths
const SITE = "https://www.testspeedinternet.com";
const KEY = "a4f0efae24bd5a6e24f8ff8839cff4a3"; // must match public/<KEY>.txt

const args = process.argv.slice(2);
let urls;
if (args.length) {
  urls = args.map((p) => (p.startsWith("http") ? p : `${SITE}${p.startsWith("/") ? "" : "/"}${p}`));
} else {
  // /sitemap.xml is an index: read every child sitemap it lists.
  const locs = async (u) => [...(await (await fetch(u)).text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const index = await locs(`${SITE}/sitemap.xml`);
  const children = index.filter((u) => u.endsWith(".xml"));
  urls = [];
  for (const child of children.length ? children : [`${SITE}/sitemap.xml`]) urls.push(...(await locs(child)));
  urls = [...new Set(urls)].filter((u) => u.startsWith(SITE) && !u.endsWith(".xml"));
}

if (!urls.length) {
  console.error("No URLs found.");
  process.exit(1);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(SITE).host,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList: urls.slice(0, 10000),
  }),
});
console.log(`IndexNow: submitted ${urls.length} URL(s) -> HTTP ${res.status} ${res.statusText}`);
if (res.status >= 400) console.log(await res.text());
