"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createTimeline, splitText, stagger } from "animejs";
import { MapPin, Sparkles } from "lucide-react";

/**
 * Card 3D de duas faces do hero, animado com anime.js em loop único:
 *
 * 1. FRENTE — folha de currículo fictícia: a IA detecta os erros
 *    (sublinhado ondulado vermelho) e troca cada frase errada pela versão
 *    corrigida em verde, palavra a palavra (splitText + stagger).
 * 2. FLIP — o card gira 180° e revela o verso escuro.
 * 3. VERSO — um feed de vagas (mini-cards no visual do JobCard real de
 *    /jobs) rola muito rápido e desacelera até parar (ease outExpo, com a
 *    distância medida em runtime); o melhor match acende anel azul +
 *    badge. Enquanto o verso está visível, a frente é resetada
 *    invisivelmente (backface oculto) para o estado "com erros".
 * 4. O card desvira (180→360°) já mostrando o currículo com erros e o
 *    ciclo recomeça — terminar em 360° torna o reinício do loop invisível.
 *
 * Substitui o vídeo "Análise de currículo.mp4" no hero — os spotlights
 * continuam com VideoMockup.
 *
 * Conteúdo híbrido na frente: texto real apenas nas frases corrigíveis; o
 * resto é barra cinza (greeking). Cada .cv-row empilha errado/correção na
 * mesma célula de grid — troca sem pulo de layout.
 *
 * Sem JS o card fica na frente, estado "com erros" (correções com opacity
 * 0 via CSS) — parece um CV normal; aceitável, é decorativo.
 */

/** Feed do verso: os 3 últimos ficam visíveis quando a rolagem para; o
 *  antepenúltimo (primeiro do trio final) é o top match destacado. */
const JOBS = [
  { title: "Analista de Social Media", company: "Nube Digital", location: "São Paulo, SP", salary: "R$ 4.800", tag: "CLT" },
  { title: "Gerente de Marketing", company: "Rota Comércio", location: "Campinas, SP", salary: "R$ 14.000", tag: "Presencial" },
  { title: "Analista de Performance", company: "Clique Mídia", location: "Remoto", salary: "R$ 6.000", tag: "Remoto" },
  { title: "Coordenadora de Conteúdo", company: "Editora Lumen", location: "São Paulo, SP", salary: "R$ 7.200", tag: "Híbrido" },
  { title: "Especialista em SEO", company: "Loja Norte", location: "Remoto", salary: "R$ 8.500", tag: "PJ" },
  { title: "Analista de Growth Jr", company: "AppFinança", location: "São Paulo, SP", salary: "R$ 4.200", tag: "Híbrido" },
  { title: "Brand Manager", company: "Casa Bela", location: "São Paulo, SP", salary: "R$ 12.000", tag: "CLT" },
  { title: "Analista de E-mail Mkt", company: "Vitrine Web", location: "Remoto", salary: "R$ 5.500", tag: "Remoto" },
  { title: "Media Buyer Pleno", company: "Studio Onda", location: "Florianópolis, SC", salary: "R$ 6.800", tag: "Remoto" },
  { title: "Analista de Marketing Pleno", company: "Agência Pulso", location: "São Paulo, SP", salary: "R$ 6.500–8.000", tag: "Híbrido", topMatch: true },
  { title: "Coordenadora de Growth", company: "Grupo Vetor", location: "São Paulo, SP", salary: "R$ 9.000–11.000", tag: "CLT" },
  { title: "Analista de CRM Sênior", company: "TechBrasil", location: "Remoto", salary: "R$ 7.500", tag: "Remoto" },
] as const;

export default function ResumeFixMockup() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Decisão de produto: roda mesmo com prefers-reduced-motion — é
    // decoração aria-hidden e a vitrine do produto no hero (no Windows,
    // "Efeitos de animação" desligado ativaria o reduce e esconderia a
    // animação de muita gente).

    const flipper = root.querySelector<HTMLElement>(".cv-flipper");
    const view = root.querySelector<HTMLElement>(".cv-jobs-view");
    const strip = root.querySelector<HTMLElement>(".cv-jobs-strip");
    const glow = root.querySelector<HTMLElement>(".cv-job-glow");
    const badge = root.querySelector<HTMLElement>(".cv-job-badge");
    const rows = Array.from(root.querySelectorAll<HTMLElement>(".cv-row"));
    const splits: ReturnType<typeof splitText>[] = [];

    // Momentos do ciclo (~13 s no total). A fase do currículo termina
    // ~4,2 s; os holds ficam entre as fases.
    const T_FLIP = 6600; // vira para o verso
    const T_SCROLL = 7150; // feed rola rápido e desacelera (2,4 s)
    const T_RESET = 8200; // reset invisível da frente (verso visível)
    const T_GLOW = 9650; // anel de top match, logo após a rolagem parar
    const T_BACK = 11900; // desvira para a frente

    const tl = createTimeline({
      autoplay: false,
      loop: true,
      loopDelay: 400,
      defaults: { ease: "inOutQuad" },
    });

    // ---- Fase 1: correção do currículo (frente) ----
    const rowRefs: Array<{
      wrongWords: HTMLElement[];
      fixWords: HTMLElement[];
      fixEl: HTMLElement;
    }> = [];

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
      rowRefs.push({
        wrongWords: wrongSplit.words,
        fixWords: fixSplit.words,
        fixEl,
      });

      const tIn = 600 + i * 250; // sublinhados surgem em cascata
      const tFix = 2200 + i * 250; // troca errado → corrigido em cascata

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
        // "escondida" pré-animação vem do opacity-0 no CSS do container).
        .add(fixEl, { opacity: { from: 0, to: 1 }, duration: 50 }, tFix)
        // Correção entra no lugar: palavras verdes sobem de baixo.
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

    // ---- Fase 2: flip para o verso ----
    if (flipper) {
      tl.add(
        flipper,
        { rotateY: { from: 0, to: 180 }, duration: 750 },
        T_FLIP
      );
    }

    // ---- Fase 3: feed rola muito rápido e desacelera até o trio final;
    //      distância medida em runtime (responsivo). outExpo = arrancada
    //      forte com parada suave. ----
    if (strip && view) {
      const dist = Math.max(0, strip.offsetHeight - view.clientHeight);
      tl.add(
        strip,
        {
          y: { from: "0px", to: `-${dist}px` },
          duration: 2400,
          ease: "outExpo",
        },
        T_SCROLL
      );
    }
    if (glow) {
      tl.add(glow, { opacity: { from: 0, to: 1 }, duration: 450 }, T_GLOW);
    }
    if (badge) {
      tl.add(
        badge,
        {
          opacity: { from: 0, to: 1 },
          scale: { from: 0.6, to: 1 },
          duration: 400,
          ease: "outBack",
        },
        T_GLOW + 50
      );
    }

    // Reset invisível da frente enquanto o verso está visível: o desvira
    // já encontra o currículo no estado "com erros" do próximo ciclo.
    rowRefs.forEach(({ wrongWords, fixWords, fixEl }) => {
      tl.add(
        wrongWords,
        {
          opacity: 1,
          y: "0rem",
          textDecorationColor: "rgba(239, 68, 68, 0)",
          duration: 1,
        },
        T_RESET
      )
        .add(fixWords, { opacity: 0, y: "0.5rem", duration: 1 }, T_RESET)
        .add(fixEl, { opacity: 0, duration: 1 }, T_RESET);
    });

    // ---- Fase 4: desvira (termina em 360° ≡ 0° → loop sem salto) ----
    if (flipper) {
      tl.add(
        flipper,
        { rotateY: { from: 180, to: 360 }, duration: 750 },
        T_BACK
      );
    }

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
      className="relative mx-auto w-full max-w-[26rem] aspect-[10/13] [perspective:1200px]"
    >
      <div className="cv-flipper relative h-full w-full [transform-style:preserve-3d]">
        {/* ============ FRENTE: folha de currículo ============ */}
        <div className="absolute inset-0 overflow-hidden rounded-xl bg-slate-50 px-6 py-6 shadow-2xl shadow-black/40 ring-1 ring-black/5 sm:px-8 sm:py-8 [backface-visibility:hidden]">
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
            <FixRow
              wrong="Fiz faculdade de administração."
              fixed="Bacharelado em Administração — concluído em 2019."
            />
            <div className="mt-2">
              <span className="block h-1.5 w-2/5 rounded-full bg-slate-200" />
            </div>
          </CvSection>
        </div>

        {/* ============ VERSO: feed de vagas no estilo de /jobs ============ */}
        <div className="absolute inset-0 flex flex-col overflow-hidden rounded-xl bg-dark-900 px-5 py-5 shadow-2xl shadow-black/40 ring-1 ring-white/10 sm:px-6 sm:py-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400 sm:text-[11px]">
                Vagas para você
              </p>
              <p className="mt-0.5 text-[11px] text-gray-500 sm:text-xs">
                Compatíveis com o seu perfil
              </p>
            </div>
            <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-gray-400">
              hoje
            </span>
          </div>

          {/* Janela do feed: a esteira rola por trás (overflow oculto) */}
          <div className="cv-jobs-view relative mt-4 flex-1 overflow-hidden">
            <div className="cv-jobs-strip flex flex-col gap-3">
              {JOBS.map((job) => (
                <MiniJobCard key={`${job.title}-${job.company}`} {...job} />
              ))}
            </div>
          </div>
        </div>
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

/**
 * Miniatura do JobCard real de /jobs (vidro escuro, salário esmeralda,
 * pin de localização, tag de modalidade). `topMatch` adiciona o anel azul
 * (.cv-job-glow) e o badge "94% match" (.cv-job-badge) que a timeline
 * acende quando a rolagem para.
 */
function MiniJobCard({
  title,
  company,
  location,
  salary,
  tag,
  topMatch = false,
}: {
  title: string;
  company: string;
  location: string;
  salary: string;
  tag: string;
  topMatch?: boolean;
}) {
  return (
    <div className="cv-job relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3.5">
      {topMatch && (
        <>
          <span
            className="cv-job-glow pointer-events-none absolute inset-0 rounded-2xl opacity-0"
            style={{
              boxShadow:
                "0 0 0 1px rgba(59, 130, 246, 0.45), 0 0 24px rgba(59, 130, 246, 0.25)",
            }}
          />
          <span className="cv-job-badge absolute -top-2 right-3 inline-flex items-center gap-1 rounded-full border border-primary-500/30 bg-dark-900 px-2 py-0.5 text-[9px] font-bold text-primary-300 opacity-0">
            <Sparkles className="h-2.5 w-2.5" /> 94% match
          </span>
        </>
      )}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-xs font-semibold leading-snug text-white">
          {title}
        </h3>
        <span className="flex-shrink-0 rounded-lg border border-emerald-500/30 bg-gradient-to-r from-emerald-500/15 to-emerald-500/5 px-2 py-0.5 text-[10px] font-bold leading-tight text-emerald-300">
          {salary}
        </span>
      </div>
      <p className="mt-0.5 text-[11px] font-medium text-gray-400">{company}</p>
      <div className="mt-1.5 flex items-center gap-2 text-[10px] text-gray-500">
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3 flex-shrink-0 text-gray-500" />
          {location}
        </span>
        <span className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-gray-300">
          {tag}
        </span>
      </div>
    </div>
  );
}
