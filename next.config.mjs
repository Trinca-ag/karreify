/** @type {import('next').NextConfig} */
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

// Rotas sem valor de busca: painel admin, páginas de app atrás de login e fluxo
// de auth. Mantemos elas FORA do robots.txt de propósito e usamos noindex por
// header, por dois motivos:
//  1. `Disallow` no robots.txt é público — listar /admin ali entrega o caminho
//     do painel para qualquer scanner.
//  2. `Disallow` bloqueia o rastreamento, não o índice. Com o crawl bloqueado o
//     Google nunca vê o noindex, e a URL pode permanecer indexada se alguém
//     linkar de fora. Permitir o crawl é o que faz a desindexação funcionar.
// /api/ continua no robots.txt: lá o objetivo é crawl budget, não desindexação.
const NOINDEX_PATHS = [
  "/admin",
  "/auth",
  "/dashboard",
  "/create-resume",
  "/resume-analysis",
  "/adapt-resume",
  "/cover-letter",
  "/company-analysis",
  "/jobs",
  "/plans",
  "/market",
  "/my-files",
  "/profile",
  "/support",
  "/feedback",
  "/carteira",
  "/compras",
];

const NOINDEX_HEADER = [
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
];

// Duas entradas por rota: a raiz exata e as subrotas. Evita depender do
// comportamento de `:path*` com segmento vazio.
const noindexHeaderRules = NOINDEX_PATHS.flatMap((path) => [
  { source: path, headers: NOINDEX_HEADER },
  { source: `${path}/:path*`, headers: NOINDEX_HEADER },
]);

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: ["@sparticuz/chromium"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  async headers() {
    return [
      {
        source: "/:path*.(ico|png|jpg|jpeg|svg|webp|woff|woff2|ttf|eot)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
          ...SECURITY_HEADERS,
        ],
      },
      ...noindexHeaderRules,
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          ...SECURITY_HEADERS,
        ],
      },
    ];
  },
};

export default nextConfig;
