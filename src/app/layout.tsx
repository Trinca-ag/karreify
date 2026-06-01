import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { CookieConsentProvider } from "@/components/providers/CookieConsentProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://karreify.com";
const SITE_DESCRIPTION =
  "Crie, adapte e analise currículos com inteligência artificial. Gere cartas de apresentação, encontre vagas e impulsione sua carreira. Comece grátis.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Karreify — Criar Currículo com IA, Análise e Vagas",
    template: "%s | Karreify",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Karreify",
  keywords: [
    "currículo",
    "criar currículo",
    "currículo com IA",
    "currículo online",
    "modelo de currículo",
    "currículo profissional",
    "gerador de currículo",
    "análise de currículo",
    "currículo ATS",
    "carta de apresentação",
    "inteligência artificial",
    "carreira",
    "vagas de emprego",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "Karreify",
    title: "Karreify — Criar Currículo com IA, Análise e Vagas",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Karreify — Criar Currículo com IA",
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Karreify",
      url: SITE_URL,
      logo: `${SITE_URL}/images/logo-karreify.png`,
      description:
        "Plataforma de criação, adaptação e análise de currículos com inteligência artificial.",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Karreify",
      url: SITE_URL,
      inLanguage: "pt-BR",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <AuthProvider>
          <CookieConsentProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#0f1629",
                  color: "#f1f5f9",
                  boxShadow:
                    "0 4px 12px rgba(0,0,0,0.3), 0 0 20px rgba(59, 130, 246, 0.1)",
                  borderRadius: "0.75rem",
                  padding: "12px 16px",
                  border: "1px solid rgba(255,255,255,0.1)",
                },
              }}
            />
            {children}
          </CookieConsentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
