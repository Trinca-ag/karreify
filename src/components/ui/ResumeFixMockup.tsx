"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createTimeline, splitText, stagger } from "animejs";

/**
 * Folha de currículo fictícia do hero, animada no visual do demo
 * "accessible" do SplitText/anime.js: cada linha corrigível gira em 3D e
 * "explode" em duas camadas — as palavras erradas saltam para a FRENTE como
 * caixinhas de contorno vermelho tracejado (o look do debug do demo) e a
 * correção completa é revelada ATRÁS em verde com contorno pontilhado
 * (o papel do clone acessível no demo). O alternate colapsa tudo de volta.
 * Substitui o vídeo "Análise de currículo.mp4" no hero — os spotlights
 * continuam com VideoMockup.
 *
 * Conteúdo híbrido: texto real apenas nas frases que recebem correção; o
 * resto é barra cinza (greeking). Cada .cv-row empilha as duas camadas na
 * mesma célula de grid; em 3D quem manda é o z (preserve-3d), não a ordem
 * do DOM.
 *
 * A animação roda num useEffect via anime.js; sem JS a folha fica no estado
 * "com erros", que parece um CV normal — aceitável, é decorativa.
 */
export default function ResumeFixMockup() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Quem prefere menos movimento vê o estado final estático (via CSS),
    // sem timeline nenhuma.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("cv-static");
      return;
    }

    const rows = Array.from(root.querySelectorAll<HTMLElement>(".cv-row"));
    const splits: ReturnType<typeof splitText>[] = [];

    // loop + alternate: plano ↔ explodido para sempre; loopDelay segura cada
    // extremo (~2,6 s) — o estado "corrigido" É o raio-X explodido, nunca
    // assenta por cima do erro.
    const tl = createTimeline({
      autoplay: false,
      loop: true,
      alternate: true,
      loopDelay: 2600,
      defaults: { ease: "inOutQuad" },
    });

    rows.forEach((row, i) => {
      const wrongEl = row.querySelector<HTMLElement>(".cv-wrong");
      const fixEl = row.querySelector<HTMLElement>(".cv-fix");
      if (!wrongEl || !fixEl) return;

      // splitText por palavra; cada palavra errada ganha .cv-squiggle
      // (sublinhado ondulado + caixinha tracejada, ambos transparentes até
      // a timeline animar as cores). accessible fica no default (true) —
      // sem custo, e o container já é aria-hidden.
      const wrongSplit = splitText(wrongEl, {
        words: { class: "cv-squiggle" },
      });
      const fixSplit = splitText(fixEl, { words: true });
      splits.push(wrongSplit, fixSplit);

      const tIn = 600 + i * 250; // sublinhados surgem em cascata (estado A)
      const tFix = 2200 + i * 250; // explosão 3D em cascata

      // Estado A: sublinhado "corretor ortográfico" desenha nos erros.
      tl.add(
        wrongSplit.words,
        {
          textDecorationColor: {
            from: "rgba(239, 68, 68, 0)",
            to: "rgba(239, 68, 68, 0.9)",
          },
          duration: 400,
          delay: stagger(18),
        },
        tIn
      )
        // A linha inteira gira em 3D (o rotateY forte do demo é o que
        // transforma profundidade em "leque" visível).
        .add(
          row,
          {
            rotateY: { from: 0, to: 45 },
            duration: 900,
          },
          tFix
        )
        // Palavras erradas saltam para a frente como caixinhas vermelhas
        // tracejadas semi-transparentes (equivalente ao debug do demo:
        // z 6rem, opacity .75, outlineColor from transparente).
        .add(
          wrongSplit.words,
          {
            z: { from: "0rem", to: "3.5rem" },
            opacity: 0.75,
            outlineColor: {
              from: "rgba(239, 68, 68, 0)",
              to: "rgba(239, 68, 68, 0.8)",
            },
            duration: 750,
            delay: stagger(40, { from: "random" }),
          },
          tFix
        )
        // Correção completa revelada ATRÁS, verde com contorno pontilhado
        // (equivalente ao clone acessível do demo: opacity 1, z -2rem).
        .add(
          fixEl,
          {
            opacity: { from: 0, to: 1 },
            z: { from: "0rem", to: "-1.5rem" },
            outlineColor: {
              from: "rgba(4, 120, 87, 0)",
              to: "rgba(4, 120, 87, 0.7)",
            },
            duration: 750,
          },
          tFix
        );
    });

    tl.init();

    // Mesmo padrão do VideoMockup: só roda com o card visível (a instância
    // escondida pelo breakpoint nunca intersecta, então nunca roda).
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            tl.resume();
          } else {
            tl.pause();
          }
        }
      },
      { rootMargin: "200px 0px", threshold: 0.15 }
    );
    obs.observe(root);

    return () => {
      obs.disconnect();
      tl.revert();
      for (const s of splits) s.revert();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="relative mx-auto w-full max-w-[26rem] aspect-[10/13] rounded-xl bg-slate-50 px-6 py-6 shadow-2xl shadow-black/40 ring-1 ring-black/5 sm:px-8 sm:py-8 [perspective:1000px]"
    >
      <div className="cv-plane h-full [transform-style:preserve-3d]">
        {/* Cabeçalho */}
        <p className="font-heading text-base font-bold tracking-tight text-slate-900 sm:text-lg">
          Mariana Souza
        </p>
        <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
          Analista de Marketing · São Paulo, SP
        </p>
        <div className="mt-2.5 flex gap-2">
          <span className="h-1.5 w-16 rounded-full bg-slate-200" />
          <span className="h-1.5 w-20 rounded-full bg-slate-200" />
          <span className="h-1.5 w-12 rounded-full bg-slate-200" />
        </div>

        <CvSection title="Resumo">
          <FixRow
            wrong="Busco uma oportunidade na área para crescer profissionalmente."
            fixed="Analista de marketing com 5 anos de experiência em growth e CRM."
          />
        </CvSection>

        <CvSection title="Experiência">
          <div className="flex items-center gap-2">
            <span className="h-2 w-24 rounded-full bg-slate-300" />
            <span className="h-1.5 w-14 rounded-full bg-slate-200" />
          </div>
          <div className="mt-1.5">
            <FixRow
              wrong="Responsável pelas vendas da empresa."
              fixed="Aumentei as vendas em 32% em 12 meses liderando time de 6."
            />
          </div>
          <div className="mt-2 space-y-1.5">
            <span className="block h-1.5 w-full rounded-full bg-slate-200" />
            <span className="block h-1.5 w-4/5 rounded-full bg-slate-200" />
          </div>
        </CvSection>

        <CvSection title="Habilidades">
          <FixRow
            wrong="Organisação e trabalho em equipe"
            fixed="Organização, liderança e trabalho em equipe."
          />
        </CvSection>

        <CvSection title="Formação">
          <div className="space-y-1.5">
            <span className="block h-1.5 w-3/5 rounded-full bg-slate-200" />
            <span className="block h-1.5 w-2/5 rounded-full bg-slate-200" />
          </div>
        </CvSection>
      </div>
    </div>
  );
}

function CvSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-4 border-t border-slate-200/80 pt-3 [transform-style:preserve-3d]">
      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:text-[10px]">
        {title}
      </p>
      <div className="mt-1.5 [transform-style:preserve-3d]">{children}</div>
    </div>
  );
}

/**
 * Par errado/correção empilhado na mesma célula de grid. A correção fica
 * atrás (z negativo na timeline); as palavras erradas saltam para a frente.
 */
function FixRow({ wrong, fixed }: { wrong: string; fixed: string }) {
  return (
    <div className="cv-row grid [transform-style:preserve-3d]">
      <p className="cv-wrong col-start-1 row-start-1 text-[11px] leading-snug text-slate-700 sm:text-xs [transform-style:preserve-3d]">
        {wrong}
      </p>
      <p className="cv-fix col-start-1 row-start-1 rounded-sm text-[11px] font-medium leading-snug text-emerald-700 opacity-0 outline-offset-2 sm:text-xs [outline:1px_dotted_transparent]">
        {fixed}
      </p>
    </div>
  );
}
