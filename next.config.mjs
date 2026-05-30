/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Don't fail the production build on ESLint warnings (types are still checked).
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
