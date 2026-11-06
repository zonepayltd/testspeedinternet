/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Lets a second local dev server run side by side (e.g. NEXT_DIST_DIR=.next-admin).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  poweredByHeader: false,
  // Don't fail the production build on ESLint warnings (types are still checked).
  eslint: { ignoreDuringBuilds: true },
  // Ship the Markdown blog articles with the server bundle (they're read at runtime).
  outputFileTracingIncludes: {
    "/[locale]": ["./src/content/blog/**/*"],
    "/[locale]/blog": ["./src/content/blog/**/*"],
    "/[locale]/blog/[slug]": ["./src/content/blog/**/*"],
    "/[locale]/blog/[slug]/opengraph-image": ["./src/content/blog/**/*"],
    "/sitemap.xml": ["./src/content/blog/**/*"],
    "/sitemaps/[file]": ["./src/content/blog/**/*"],
    "/feed.xml": ["./src/content/blog/**/*"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/blog/:file*.svg",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
