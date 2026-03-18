/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@sparticuz/chromium"],
  },
  images: {
    domains: ["firebasestorage.googleapis.com", "lh3.googleusercontent.com"],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  async headers() {
    return [
      {
        // Static assets — long cache
        source: "/:path*.(ico|png|jpg|jpeg|svg|webp|woff|woff2|ttf|eot)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Next.js static chunks — immutable (hashed filenames)
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // API routes — no cache (dynamic data)
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
      {
        // Pages — short revalidation
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
};

export default nextConfig;
