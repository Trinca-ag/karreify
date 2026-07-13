"use client";

import Link from "next/link";
import Image from "next/image";
import { Cookie } from "lucide-react";
import { OPEN_COOKIE_PREFERENCES_EVENT } from "@/components/providers/CookieConsentProvider";

type SocialIconProps = { className?: string };

// lucide não traz TikTok/Threads — ícones de marca sólidos (Simple Icons) para
// manter o cluster social consistente. Herdam a cor via currentColor.
function InstagramIcon({ className }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TikTokIcon({ className }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

function ThreadsIcon({ className }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z" />
    </svg>
  );
}

const SOCIALS = [
  { href: "https://www.instagram.com/karreify", label: "Instagram", Icon: InstagramIcon },
  { href: "https://www.tiktok.com/@karreify", label: "TikTok", Icon: TikTokIcon },
  { href: "https://www.threads.com/@karreify", label: "Threads", Icon: ThreadsIcon },
];

function openCookiePreferences() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_COOKIE_PREFERENCES_EVENT));
}

export default function Footer() {
  return (
    <footer className="relative bg-dark-950 text-gray-400 overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-3">
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
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Currículo */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-heading font-semibold text-white mb-4 tracking-wide">
              Currículo
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/como-fazer-um-curriculo", label: "Como fazer um currículo" },
                { href: "/modelos-de-curriculo", label: "Modelos por profissão" },
                { href: "/guias", label: "Todos os guias" },
                { href: "/curriculo-sem-experiencia", label: "Currículo sem experiência" },
                { href: "/sobre", label: "Sobre o Karreify" },
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
                { href: "/cookies", label: "Política de Cookies" },
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
              <li>
                <button
                  type="button"
                  onClick={openCookiePreferences}
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-400 transition-colors duration-200"
                >
                  <Cookie className="w-3.5 h-3.5" />
                  Gerenciar Cookies
                </button>
              </li>
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
