"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createTimeline, splitText, stagger } from "animejs";

/**
 * Folha de currículo fictícia do hero: a IA detecta os erros (sublinhado
 * ondulado vermelho estilo corretor ortográfico) e troca cada frase errada
 * pela versão corrigida em verde — as palavras erradas saem flutuando para
 * cima enquanto as corrigidas entram por baixo, palavra a palavra
 * (splitText + stagger do anime.js). Alterna errado ↔ corrigido em loop.
 * Substitui o vídeo "Análise de currículo.mp4" no hero — os spotlights
 * continuam com VideoMockup.
 *
 * Conteúdo híbrido: texto real apenas nas frases que recebem correção; o
 * resto é barra cinza (greeking). Cada .cv-row empilha as duas camadas na
 * mesma célula de grid, então a linha tem a altura da camada mais alta e a
 * troca acontece sem pulo de layout.
 *
 * A animação roda num useEffect via anime.js; sem JS a folha fica no estado
 * "com erros" (a correção começa com opacity 0 via CSS), que parece um CV
 * normal — aceitável, é decorativa.
 */
export default function ResumeFixMockup() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Decisão de produto: roda mesmo com prefers-reduced-motion — é
    // decoração aria-hidden e a vitrine do produto no hero (no Windows,
    // "Efeitos de animação" desligado ativaria o reduce e esconderia a
    // animação de muita gente).

    const rows = Array.from(root.querySelectorAll<HTMLElement>(".cv-row"));
    const splits: ReturnType<typeof splitText>[] = [];

    // loop + alternate: errado ↔ corrigido para sempre; loopDelay segura
    // cada extremo (~2,6 s).
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
      // (sublinhado ondulado transparente até a timeline animar a cor).
      // accessible fica no default (true) — sem custo, e o container já é
      // aria-hidden.
      const wrongSplit = splitText(wrongEl, {
        words: { class: "cv-squiggle" },
      });
      const fixSplit = splitText(fixEl, { words: true });
      splits.push(wrongSplit, fixSplit);

      const tIn = 600 + i * 250; // sublinhados surgem em cascata (estado A)
      const tFix = 2200 + i * 250; // troca errado → corrigido em cascata

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
        // Texto errado sai: palavras sobem e somem, em ordem aleatória.
        .add(
          wrongSplit.words,
          {
            y: { from: "0rem", to: "-0.45rem" },
            opacity: { from: 1, to: 0 },
            duration: 500,
            delay: stagger(24, { from: "random" }),
          },
          tFix
        )
        // A camada da correção fica visível no início da troca (o estado
        // "escondida" pré-animação vem do opacity-0 no CSS do container;
        // as palavras carregam a entrada visual individualmente).
        .add(
          fixEl,
          {
            opacity: { from: 0, to: 1 },
            duration: 50,
          },
          tFix
        )
        // Correção entra no lugar: palavras verdes sobem de baixo, em
        // ordem aleatória, cruzando com a saída das erradas.
        .add(
          fixSplit.words,
          {
            y: { from: "0.5rem", to: "0rem" },
            opacity: { from: 0, to: 1 },
            duration: 600,
            delay: stagger(26, { from: "random" }),
          },
          tFix + 200
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
      className="relative mx-auto w-full max-w-[26rem] aspect-[10/13] overflow-hidden rounded-xl bg-slate-50 px-6 py-6 shadow-2xl shadow-black/40 ring-1 ring-black/5 sm:px-8 sm:py-8"
    >
      <div className="cv-plane h-full">
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
    <div className="mt-4 border-t border-slate-200/80 pt-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:text-[10px]">
        {title}
      </p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

/**
 * Par errado/correção empilhado na mesma célula de grid: o errado sai
 * flutuando para cima e a correção verde entra por baixo no mesmo lugar.
 */
function FixRow({ wrong, fixed }: { wrong: string; fixed: string }) {
  return (
    <div className="cv-row grid">
      <p className="cv-wrong col-start-1 row-start-1 text-[11px] leading-snug text-slate-700 sm:text-xs">
        {wrong}
      </p>
      <p className="cv-fix col-start-1 row-start-1 text-[11px] font-medium leading-snug text-emerald-700 opacity-0 sm:text-xs">
        {fixed}
      </p>
    </div>
  );
}
