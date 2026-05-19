"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Compass, Home, Sparkles } from "lucide-react";

const STAR_COUNT = 80;

export default function NotFound() {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMouse({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // Generate star field once — deterministic via index seeding so re-renders
  // (e.g. on mouse move) don't reshuffle the sky and make it look noisy.
  const stars = useMemo(
    () =>
      Array.from({ length: STAR_COUNT }, (_, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const r = seed / 233280;
        const r2 = ((i * 1399) % 233280) / 233280;
        return {
          left: `${(r * 100).toFixed(2)}%`,
          top: `${(r2 * 100).toFixed(2)}%`,
          size: 1 + (r * 2.5),
          delay: `${(r * 5).toFixed(2)}s`,
          duration: `${(2 + r2 * 4).toFixed(2)}s`,
          opacity: 0.3 + r2 * 0.6,
        };
      }),
    []
  );

  const offset = (factor: number) => ({
    transform: `translate3d(${((mouse.x - 0.5) * factor).toFixed(1)}px, ${(
      (mouse.y - 0.5) *
      factor
    ).toFixed(1)}px, 0)`,
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-dark-950 flex items-center justify-center px-4 py-12 text-white">
      <style>{`
        @keyframes nf-glitch-top {
          0%, 100% { transform: translate(0, 0); opacity: 0.85; }
          20% { transform: translate(-3px, -2px); opacity: 1; }
          40% { transform: translate(2px, 1px); opacity: 0.6; }
          60% { transform: translate(-1px, 2px); opacity: 0.9; }
          80% { transform: translate(3px, -1px); opacity: 0.7; }
        }
        @keyframes nf-glitch-bottom {
          0%, 100% { transform: translate(0, 0); opacity: 0.75; }
          25% { transform: translate(2px, 2px); opacity: 0.9; }
          50% { transform: translate(-3px, -1px); opacity: 0.55; }
          75% { transform: translate(1px, -2px); opacity: 0.85; }
        }
        @keyframes nf-float {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-22px) rotate(3deg); }
        }
        @keyframes nf-twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes nf-orbit {
          from { transform: rotate(0deg) translateX(220px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(220px) rotate(-360deg); }
        }
        @keyframes nf-orbit-reverse {
          from { transform: rotate(0deg) translateX(160px) rotate(0deg); }
          to { transform: rotate(-360deg) translateX(160px) rotate(360deg); }
        }
        @keyframes nf-shooting {
          0% {
            transform: translate(0, 0) rotate(-30deg) scaleX(0.2);
            opacity: 0;
          }
          15% {
            opacity: 1;
            transform: translate(50px, 30px) rotate(-30deg) scaleX(1);
          }
          80% {
            opacity: 0.6;
          }
          100% {
            transform: translate(600px, 340px) rotate(-30deg) scaleX(1);
            opacity: 0;
          }
        }
        @keyframes nf-pulse-ring {
          0% { transform: scale(0.6); opacity: 0.6; }
          80%, 100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes nf-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .nf-404 {
          position: relative;
          display: inline-block;
          font-weight: 900;
          letter-spacing: -0.05em;
          line-height: 0.9;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 45%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% 200%;
          animation: gradientShift 6s ease infinite, nf-bob 5s ease-in-out infinite;
          text-shadow: 0 0 60px rgba(59, 130, 246, 0.35);
        }
        .nf-404::before,
        .nf-404::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          -webkit-background-clip: text;
          background-clip: text;
          pointer-events: none;
          mix-blend-mode: screen;
        }
        .nf-404::before {
          color: rgba(6, 182, 212, 0.75);
          -webkit-text-fill-color: rgba(6, 182, 212, 0.75);
          clip-path: polygon(0 0, 100% 0, 100% 38%, 0 38%);
          animation: nf-glitch-top 2.6s infinite steps(1, end);
        }
        .nf-404::after {
          color: rgba(236, 72, 153, 0.7);
          -webkit-text-fill-color: rgba(236, 72, 153, 0.7);
          clip-path: polygon(0 62%, 100% 62%, 100% 100%, 0 100%);
          animation: nf-glitch-bottom 3.1s infinite steps(1, end);
        }
        .nf-star { animation: nf-twinkle var(--dur, 3s) ease-in-out infinite; animation-delay: var(--delay, 0s); }
        .nf-astronaut { animation: nf-float 6s ease-in-out infinite; }
        .nf-orbit-dot { animation: nf-orbit 14s linear infinite; transform-origin: center; }
        .nf-orbit-dot-rev { animation: nf-orbit-reverse 18s linear infinite; transform-origin: center; }
        .nf-shooting-star {
          position: absolute;
          width: 120px;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent);
          filter: blur(0.5px);
          opacity: 0;
          animation: nf-shooting 7s ease-in infinite;
        }
        .nf-pulse-ring {
          position: absolute;
          border-radius: 9999px;
          border: 2px solid rgba(139, 92, 246, 0.5);
          animation: nf-pulse-ring 3s ease-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .nf-404, .nf-404::before, .nf-404::after,
          .nf-star, .nf-astronaut, .nf-orbit-dot, .nf-orbit-dot-rev,
          .nf-shooting-star, .nf-pulse-ring {
            animation: none !important;
          }
        }
      `}</style>

      {/* Layer: orbs (mouse-parallaxed) */}
      <div
        className="orb w-[600px] h-[600px] bg-primary-600/40 top-[-150px] left-[-150px] animate-pulse-glow"
        style={offset(-40)}
      />
      <div
        className="orb w-[500px] h-[500px] bg-accent-violet/40 bottom-[-150px] right-[-150px] animate-pulse-glow"
        style={{ ...offset(-30), animationDelay: "1s" }}
      />
      <div
        className="orb w-[420px] h-[420px] bg-accent-cyan/30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow"
        style={{ ...offset(20), animationDelay: "2s" }}
      />

      {/* Layer: grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      {/* Layer: noise + radial fade */}
      <div className="absolute inset-0 bg-radial-blue opacity-60 pointer-events-none" />

      {/* Layer: twinkling stars */}
      <div className="absolute inset-0 pointer-events-none" style={offset(8)}>
        {stars.map((s, i) => (
          <span
            key={i}
            className="nf-star absolute rounded-full bg-white"
            style={{
              left: s.left,
              top: s.top,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
              ["--dur" as never]: s.duration,
              ["--delay" as never]: s.delay,
            }}
          />
        ))}
      </div>

      {/* Layer: shooting stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="nf-shooting-star" style={{ top: "12%", left: "-10%", animationDelay: "0s" }} />
        <span className="nf-shooting-star" style={{ top: "55%", left: "-10%", animationDelay: "3.5s" }} />
        <span className="nf-shooting-star" style={{ top: "78%", left: "-10%", animationDelay: "5.2s" }} />
      </div>

      {/* Layer: orbiting dots around the 404 */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          width: 0,
          height: 0,
          ...offset(15),
        }}
      >
        <span className="nf-orbit-dot absolute w-3 h-3 rounded-full bg-gradient-to-br from-accent-cyan to-primary-500 shadow-[0_0_20px_rgba(6,182,212,0.6)]" />
        <span
          className="nf-orbit-dot absolute w-2 h-2 rounded-full bg-gradient-to-br from-accent-violet to-accent-pink shadow-[0_0_15px_rgba(236,72,153,0.5)]"
          style={{ animationDelay: "-7s" }}
        />
        <span className="nf-orbit-dot-rev absolute w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)]" />
        <span
          className="nf-orbit-dot-rev absolute w-2.5 h-2.5 rounded-full bg-primary-400 shadow-[0_0_18px_rgba(59,130,246,0.6)]"
          style={{ animationDelay: "-9s" }}
        />

        {/* Pulse rings */}
        <span
          className="nf-pulse-ring"
          style={{ width: "260px", height: "260px", top: "-130px", left: "-130px" }}
        />
        <span
          className="nf-pulse-ring"
          style={{ width: "260px", height: "260px", top: "-130px", left: "-130px", animationDelay: "1.5s" }}
        />
      </div>

      {/* Floating astronaut (top-right area) */}
      <div
        className="absolute top-[14%] right-[8%] hidden sm:block pointer-events-none"
        style={offset(-25)}
      >
        <div className="nf-astronaut">
          <svg width="120" height="140" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="nfSuit" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e5e7eb" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
              <linearGradient id="nfVisor" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <radialGradient id="nfGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(59,130,246,0.5)" />
                <stop offset="100%" stopColor="rgba(59,130,246,0)" />
              </radialGradient>
            </defs>
            <circle cx="60" cy="55" r="50" fill="url(#nfGlow)" />
            {/* Backpack */}
            <rect x="35" y="60" width="50" height="50" rx="8" fill="url(#nfSuit)" />
            {/* Body */}
            <ellipse cx="60" cy="70" rx="28" ry="32" fill="url(#nfSuit)" />
            {/* Arms */}
            <rect x="20" y="60" width="16" height="32" rx="8" fill="url(#nfSuit)" transform="rotate(-25 28 76)" />
            <rect x="84" y="60" width="16" height="32" rx="8" fill="url(#nfSuit)" transform="rotate(25 92 76)" />
            {/* Legs */}
            <rect x="42" y="95" width="14" height="34" rx="6" fill="url(#nfSuit)" />
            <rect x="64" y="95" width="14" height="34" rx="6" fill="url(#nfSuit)" />
            {/* Helmet */}
            <circle cx="60" cy="38" r="24" fill="url(#nfSuit)" />
            <circle cx="60" cy="38" r="19" fill="url(#nfVisor)" />
            {/* Visor highlight */}
            <ellipse cx="53" cy="32" rx="6" ry="4" fill="rgba(255,255,255,0.5)" />
            <ellipse cx="65" cy="42" rx="3" ry="2" fill="rgba(255,255,255,0.25)" />
            {/* Antenna */}
            <line x1="60" y1="14" x2="60" y2="4" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            <circle cx="60" cy="3" r="2.5" fill="#ef4444">
              <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
            </circle>
            {/* Chest panel */}
            <rect x="50" y="65" width="20" height="10" rx="2" fill="#1e293b" />
            <circle cx="55" cy="70" r="1.5" fill="#22c55e" />
            <circle cx="62" cy="70" r="1.5" fill="#3b82f6" />
            <circle cx="68" cy="70" r="1.5" fill="#f59e0b" />
          </svg>
        </div>
      </div>

      {/* Floating planet (bottom-left) */}
      <div
        className="absolute bottom-[10%] left-[6%] hidden sm:block pointer-events-none animate-float-slow"
        style={offset(-18)}
      >
        <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="nfPlanet" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#7c2d12" />
            </radialGradient>
            <linearGradient id="nfRing" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="rgba(251,191,36,0)" />
              <stop offset="50%" stopColor="rgba(251,191,36,0.8)" />
              <stop offset="100%" stopColor="rgba(251,191,36,0)" />
            </linearGradient>
          </defs>
          <ellipse cx="50" cy="55" rx="48" ry="10" fill="url(#nfRing)" opacity="0.7" />
          <circle cx="50" cy="50" r="28" fill="url(#nfPlanet)" />
          <ellipse cx="42" cy="42" rx="6" ry="3" fill="rgba(255,255,255,0.15)" />
          <ellipse cx="58" cy="58" rx="4" ry="2" fill="rgba(0,0,0,0.2)" />
        </svg>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 max-w-3xl text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest bg-red-500/10 border border-red-500/25 text-red-300 mb-8 animate-fade-in-up">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          Erro 404 · Página não encontrada
        </div>

        {/* 404 with glitch + gradient + float */}
        <h1
          className="nf-404 text-[clamp(8rem,28vw,18rem)] mb-2 animate-fade-in-up animation-delay-100"
          data-text="404"
        >
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl sm:text-4xl font-heading font-bold mb-4 animate-fade-in-up animation-delay-200">
          Você se perdeu no{" "}
          <span className="gradient-text">espaço</span>
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed mb-10 animate-fade-in-up animation-delay-300">
          A página que você procurou não existe ou foi movida. Pode ser um link
          quebrado, um endereço digitado errado ou, quem sabe, um buraco negro.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up animation-delay-400">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary-600 to-accent-violet text-white hover:opacity-90 transition-all glow-blue btn-glow"
          >
            <Home className="w-4 h-4" />
            Voltar para o início
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            <Compass className="w-4 h-4" />
            Ir para o Dashboard
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>

        {/* Footer hint */}
        <div className="mt-12 inline-flex items-center gap-2 text-xs text-gray-600 animate-fade-in-up animation-delay-500">
          <Sparkles className="w-3 h-3 text-primary-400" />
          <span>Karreify · impulsionando sua carreira</span>
        </div>
      </div>
    </div>
  );
}
