import Image from "next/image";
import { Globe } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Indisponível na sua região — Karreify",
  robots: { index: false, follow: false },
};

export default function RegionBlockedPage() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-10 w-80 h-80 bg-accent-violet/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md text-center">
        <div className="flex justify-center mb-8">
          <Image
            src="/images/logo-karreify.png"
            alt="Karreify"
            width={200}
            height={100}
            className="h-12 w-auto object-contain"
          />
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center shadow-lg shadow-black/20">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="mt-6 text-2xl font-heading font-bold text-white">
            Indisponível na sua região
          </h1>
          <p className="mt-3 text-gray-400 text-sm leading-relaxed">
            O Karreify não está disponível na sua região no momento. Se você
            acredita que isso é um engano, desative qualquer VPN ou proxy e
            recarregue a página.
          </p>
        </div>

        <p className="mt-6 text-xs text-gray-600">
          &copy; {new Date().getFullYear()} Karreify
        </p>
      </div>
    </div>
  );
}
