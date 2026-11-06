import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileCode2, Globe2, Map as MapIcon, Newspaper, Scale } from "lucide-react";
import { localeFromParams, pageMetadata } from "@/i18n/server";
import { LOCALES, LOCALE_META, lp, pick, type Locale } from "@/i18n/config";
import { navMessages } from "@/i18n/messages/nav";
import { commonMessages } from "@/i18n/messages/common";
import { categoryLabel } from "@/i18n/messages/blog";
import { MENUS } from "@/components/nav/menu";
import { getPublishedPosts, type Post } from "@/lib/posts";

export const dynamic = "force-dynamic";

const T: Record<Locale, { title: string; meta: string; intro: string; pages: string; blog: string; legal: string; languages: string; xml: string; xmlText: string; articles: string }> = {
  en: { title: "Sitemap", meta: "All pages, tools and guides on TestSpeedInternet in one place: speed tests, IP tools, blog articles and company pages in every language.", intro: "Every page of TestSpeedInternet in one place.", pages: "Pages", blog: "Blog articles", legal: "Legal", languages: "Other languages", xml: "For search engines", xmlText: "XML sitemap used by Google, Bing and other search engines.", articles: "articles" },
  fr: { title: "Plan du site", meta: "Toutes les pages, outils et guides de TestSpeedInternet au même endroit : tests de débit, outils IP, articles et pages de la société, dans toutes les langues.", intro: "Toutes les pages de TestSpeedInternet au même endroit.", pages: "Pages", blog: "Articles du blog", legal: "Mentions légales", languages: "Autres langues", xml: "Pour les moteurs de recherche", xmlText: "Plan du site XML utilisé par Google, Bing et les autres moteurs de recherche.", articles: "articles" },
  es: { title: "Mapa del sitio", meta: "Todas las páginas, herramientas y guías de TestSpeedInternet en un solo lugar: tests de velocidad, herramientas IP, artículos y páginas de la empresa en todos los idiomas.", intro: "Todas las páginas de TestSpeedInternet en un solo lugar.", pages: "Páginas", blog: "Artículos del blog", legal: "Legal", languages: "Otros idiomas", xml: "Para buscadores", xmlText: "Sitemap XML que usan Google, Bing y otros buscadores.", articles: "artículos" },
  ar: { title: "خريطة الموقع", meta: "جميع صفحات وأدوات وأدلة TestSpeedInternet في مكان واحد: اختبارات السرعة وأدوات IP والمقالات وصفحات الشركة بكل اللغات.", intro: "جميع صفحات TestSpeedInternet في مكان واحد.", pages: "الصفحات", blog: "مقالات المدونة", legal: "قانوني", languages: "لغات أخرى", xml: "لمحركات البحث", xmlText: "خريطة موقع XML تستخدمها Google وBing ومحركات البحث الأخرى.", articles: "مقالات" },
  ru: { title: "Карта сайта", meta: "Все страницы, инструменты и статьи TestSpeedInternet в одном месте: тесты скорости, IP-инструменты, блог и страницы компании на всех языках.", intro: "Все страницы TestSpeedInternet в одном месте.", pages: "Страницы", blog: "Статьи блога", legal: "Правовая информация", languages: "Другие языки", xml: "Для поисковых систем", xmlText: "XML-карта сайта для Google, Bing и других поисковиков.", articles: "статей" },
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = T[locale];
  return pageMetadata({ locale, path: "/sitemap", title: t.title, description: t.meta });
}

export default async function SitemapPage({ params }: Props) {
  const locale = await localeFromParams(params);
  const t = T[locale];
  const nav = pick(navMessages, locale);
  const links = pick(commonMessages, locale).footer.links;
  const posts = await getPublishedPosts(locale).catch(() => [] as Post[]);

  // group articles by category
  const groups = new Map<string, Post[]>();
  for (const p of posts) groups.set(p.category, [...(groups.get(p.category) || []), p]);
  const legal = [
    { href: "/privacy", label: links.privacy },
    { href: "/cookies", label: links.cookies },
    { href: "/terms", label: links.terms },
    { href: "/dmca", label: links.dmca },
  ];

  const linkCls = "group inline-flex items-center gap-1.5 text-[15px] text-slate-600 transition-colors hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-300";
  const Arrow = () => <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100 rtl:rotate-180" aria-hidden="true" />;

  return (
    <div className="hero-bg">
      <div aria-hidden="true" className="hero-glow" />
      <div className="container max-w-6xl py-14 md:py-20">
        <header className="mb-12 max-w-2xl">
          <span className="eyebrow">
            <MapIcon className="h-3.5 w-3.5" aria-hidden="true" /> {t.title}
          </span>
          <h1 className="h-display mt-5">{t.title}</h1>
          <p className="lead mt-4">{t.intro}</p>
        </header>

        {/* Pages */}
        <section aria-labelledby="sm-pages">
          <h2 id="sm-pages" className="h-card mb-5 flex items-center gap-2">
            <Globe2 className="h-5 w-5 text-brand-600 dark:text-brand-400" aria-hidden="true" /> {t.pages}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {MENUS.map((m) => (
              <div key={m.key} className="card p-5">
                <p className="kicker">{nav.menus[m.key]}</p>
                <ul className="mt-3 space-y-2.5">
                  {m.items.map((it) => (
                    <li key={it.key}>
                      <Link href={lp(locale, it.href)} className={linkCls}>
                        {nav.items[it.key].title} <Arrow />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="card p-5">
              <p className="kicker flex items-center gap-1.5">
                <Scale className="h-3.5 w-3.5" aria-hidden="true" /> {t.legal}
              </p>
              <ul className="mt-3 space-y-2.5">
                {legal.map((l) => (
                  <li key={l.href}>
                    <Link href={lp(locale, l.href)} className={linkCls}>
                      {l.label} <Arrow />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Blog */}
        {posts.length > 0 && (
          <section aria-labelledby="sm-blog" className="mt-14">
            <h2 id="sm-blog" className="h-card mb-5 flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-brand-600 dark:text-brand-400" aria-hidden="true" /> {t.blog}
              <span className="text-sm font-medium text-slate-400">· {posts.length} {t.articles}</span>
            </h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[...groups.entries()].map(([cat, list]) => (
                <div key={cat} className="card p-5">
                  <p className="kicker">{categoryLabel(cat, locale)}</p>
                  <ul className="mt-3 space-y-2.5">
                    {list.map((p) => (
                      <li key={p.slug}>
                        <Link href={lp(locale, `/blog/${p.slug}`)} className="text-[15px] leading-snug text-slate-600 transition-colors hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-300">
                          {p.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages + XML */}
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <section className="card p-5" aria-labelledby="sm-lang">
            <h2 id="sm-lang" className="kicker">{t.languages}</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {LOCALES.map((l) => (
                <li key={l}>
                  <a
                    href={lp(l, "/sitemap")}
                    hrefLang={LOCALE_META[l].htmlLang}
                    lang={LOCALE_META[l].htmlLang}
                    aria-current={l === locale ? "page" : undefined}
                    className={`pill ${l === locale ? "pill-active" : "hover:border-brand-300"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://flagcdn.com/${LOCALE_META[l].flag}.svg`} alt="" width={16} height={12} className="h-3 w-4 rounded-[2px] object-cover" />
                    {LOCALE_META[l].name}
                  </a>
                </li>
              ))}
            </ul>
          </section>
          <section className="card flex items-start gap-3 p-5" aria-labelledby="sm-xml">
            <span className="icon-tile">
              <FileCode2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 id="sm-xml" className="kicker">{t.xml}</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t.xmlText}</p>
              <a href="/sitemap.xml" className="link mt-2 inline-block text-sm" dir="ltr">
                /sitemap.xml
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
