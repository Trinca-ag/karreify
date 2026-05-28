"use client";

import { useEffect, useRef, useState } from "react";

interface VideoMockupProps {
  src: string;
  /** Texto que aparece na "URL bar" do mockup tipo browser. */
  url: string;
  className?: string;
  /** Aspect ratio do vídeo. Default 16/9. */
  aspect?: string;
}

/**
 * Mockup de janela de browser com vídeo dentro. Substitui os SVG mockups
 * estáticos da home.
 *
 * Otimizações:
 *  - `preload="none"` no SSR: o vídeo não baixa byte nenhum até entrar no
 *    viewport. Como a home tem 7 spotlights (~60 MB total) isso é crítico,
 *    especialmente em mobile.
 *  - IntersectionObserver dispara `play()` quando o card entra na tela e
 *    `pause()` quando sai → economiza CPU/bateria nos vídeos que estão fora
 *    do viewport.
 *  - `playbackRate = 1.5` aplicado em `loadedmetadata` (alguns browsers
 *    resetam o playbackRate em re-load, daí o listener).
 *  - `muted` + `playsInline` são obrigatórios para autoplay funcionar em
 *    Safari iOS.
 */
export default function VideoMockup({
  src,
  url,
  className = "",
  aspect = "16/9",
}: VideoMockupProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasEntered, setHasEntered] = useState(false);

  // IntersectionObserver: marca o vídeo como "carregável" assim que ele se
  // aproxima do viewport, e controla play/pause conforme visibilidade.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setHasEntered(true);
            const v = videoRef.current;
            if (v) v.play().catch(() => {});
          } else {
            const v = videoRef.current;
            if (v) v.pause();
          }
        }
      },
      { rootMargin: "200px 0px", threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // playbackRate aplicado quando o vídeo está pronto. Em alguns browsers
  // setar antes de `loadedmetadata` é descartado.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const apply = () => {
      v.playbackRate = 1.5;
    };
    v.addEventListener("loadedmetadata", apply);
    if (v.readyState >= 1) apply();
    return () => v.removeEventListener("loadedmetadata", apply);
  }, [hasEntered]);

  return (
    <div
      ref={containerRef}
      className={`glass-card mockup-shadow overflow-hidden ${className}`}
    >
      <div className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/70" />
        </div>
        <div className="flex-1 flex justify-center min-w-0">
          <div className="px-3 sm:px-4 py-0.5 sm:py-1 rounded-lg bg-white/5 text-[10px] sm:text-[11px] text-gray-500 font-mono truncate max-w-full">
            {url}
          </div>
        </div>
      </div>
      <div
        className="relative w-full bg-dark-950"
        style={{ aspectRatio: aspect }}
      >
        {hasEntered && (
          <video
            ref={videoRef}
            src={src}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            controlsList="nodownload noplaybackrate nofullscreen"
            className="absolute inset-0 w-full h-full object-cover"
            // Sem onClick — vídeo é decorativo, não-interativo.
            aria-hidden
          />
        )}
      </div>
    </div>
  );
}
