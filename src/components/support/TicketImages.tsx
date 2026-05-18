"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "lucide-react";

export default function TicketImages({ urls }: { urls: string[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // Portals require the DOM to exist; flip the flag once on the client.
  useEffect(() => {
    setMounted(true);
  }, []);

  // ESC fecha o modal + body lock pra não rolar enquanto está aberto
  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [openIdx]);

  if (urls.length === 0) return null;

  // The modal is rendered through a portal at <body> because any ancestor with
  // `backdrop-filter` (e.g. the description card's backdrop-blur-xl) creates a
  // containing block for `position: fixed` — without the portal, the overlay
  // ends up scoped to that section instead of covering the viewport.
  const modal =
    openIdx !== null && mounted
      ? createPortal(
          <div
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md animate-fade-in-up"
            onClick={() => setOpenIdx(null)}
            role="dialog"
            aria-modal="true"
          >
            {urls.length > 1 && (
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-white text-sm font-medium select-none">
                {openIdx + 1} / {urls.length}
              </div>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIdx(null);
              }}
              className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors shadow-lg z-10"
              aria-label="Fechar imagem"
            >
              <X className="w-6 h-6" />
            </button>

            <div
              className="absolute inset-0 flex items-center justify-center p-4 sm:p-12"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full">
                <Image
                  src={urls[openIdx]}
                  alt={`Anexo ${openIdx + 1}`}
                  fill
                  sizes="100vw"
                  unoptimized
                  priority
                  className="object-contain"
                />
              </div>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-lg text-white/60 text-xs select-none">
              Clique fora ou pressione ESC para fechar
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {urls.map((url, idx) => (
          <button
            key={url}
            type="button"
            onClick={() => setOpenIdx(idx)}
            className="relative w-28 h-28 rounded-xl overflow-hidden border border-white/[0.08] hover:border-primary-500/40 transition-all group/img flex-shrink-0"
            title="Clique para ampliar"
          >
            <Image
              src={url}
              alt={`Anexo ${idx + 1}`}
              fill
              sizes="112px"
              unoptimized
              className="object-cover group-hover/img:scale-105 transition-transform duration-500"
            />
          </button>
        ))}
      </div>

      {modal}
    </>
  );
}
