import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-dark-950 text-gray-400 overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-6">
            <div className="flex items-center gap-2.5 mb-5">
              <Image
                src="/images/logo-karreify.png"
                alt="Karreify"
                width={200}
                height={100}
                className="object-contain h-12 sm:h-14 lg:h-[4.5rem] w-auto"
              />
            </div>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              Plataforma inteligente para impulsionar sua carreira. Use IA para
              criar e adaptar currículos, gerar cartas de apresentação e
              analisar empresas.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all duration-200"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-heading font-semibold text-white mb-4 tracking-wide">
              Plataforma
            </h3>
            <ul className="space-y-3">
              {[
                { href: "#features", label: "Funcionalidades" },
                { href: "#pricing", label: "Pacotes" },
                { href: "#how-it-works", label: "Como funciona" },
                { href: "/auth/register", label: "Criar conta" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-sm font-heading font-semibold text-white mb-4 tracking-wide">
              Suporte
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/help", label: "Central de Ajuda" },
                { href: "/terms", label: "Termos de Uso" },
                { href: "/privacy", label: "Privacidade" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Karreify. Todos os direitos
            reservados.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-600">Powered by DeepSeek AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
