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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://karreify.com"),
  title: "Karreify - Impulsione sua carreira com IA",
  description:
    "Plataforma inteligente para criar, adaptar e analisar currículos, gerar cartas de apresentação e analisar empresas com inteligência artificial.",
  keywords: ["currículo", "IA", "carreira", "ATS", "resume builder", "carta de apresentação"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "Karreify",
    title: "Karreify - Impulsione sua carreira com IA",
    description:
      "Plataforma inteligente para criar, adaptar e analisar currículos, gerar cartas de apresentação e analisar empresas com inteligência artificial.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased">
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
