import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
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
  title: "NextCV - Impulsione sua carreira com IA",
  description:
    "Plataforma inteligente para criar currículos, otimizar perfis do LinkedIn e planejar sua carreira com inteligência artificial.",
  keywords: ["currículo", "IA", "carreira", "LinkedIn", "ATS", "resume builder"],
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
        </AuthProvider>
      </body>
    </html>
  );
}
