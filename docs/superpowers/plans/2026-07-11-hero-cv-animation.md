# Animação "IA corrige o currículo" no hero — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o vídeo "Análise de currículo.mp4" do hero da home por uma folha de currículo animada onde a IA sobrepõe correções aos textos errados (visual fiel ao demo "accessible" do SplitText do anime.js).

**Architecture:** Um único client component novo (`ResumeFixMockup`) renderiza uma folha de papel clara com 3 pares errado/correção empilhados por CSS grid; um `useEffect` cria uma timeline anime.js (loop + alternate) que alterna errado ↔ corrigido para sempre. O `page.tsx` (server component) apenas troca `<VideoMockup …/>` por `<ResumeFixMockup />` nas duas instâncias do hero.

**Tech Stack:** Next.js 14.2 (App Router), React 18, TypeScript, Tailwind 3.4, anime.js 4.5 (`splitText`, `createTimeline`, `stagger`).

**Spec:** `docs/superpowers/specs/2026-07-11-hero-cv-animation-design.md`

## Global Constraints

- Única dependência nova: `animejs` (^4.5.0). Nada de framer-motion, gsap etc.
- O repo **não tem infra de testes** (sem jest/vitest). O ciclo de verificação de cada task é: `npm run type-check` + `npm run lint` + verificação visual no dev server quando houver mudança visível. **Não usar `npm run build` como gate** — falha local por chave Firebase redigida no `.env` (esperado).
- Textos do CV são verbatim da spec (não parafrasear):
  - Resumo: "Busco uma oportunidade na área para crescer profissionalmente." → "Analista de marketing com 5 anos de experiência em growth e CRM."
  - Experiência: "Responsável pelas vendas da empresa." → "Aumentei as vendas em 32% em 12 meses liderando time de 6."
  - Habilidades: "Organisação e trabalho em equipe" → "Organização, liderança e trabalho em equipe."
- Em `src/app/page.tsx` mudar SOMENTE: 1 import novo + as duas trocas de `VideoMockup` no hero. `TiltCard`, badges flutuantes, spotlights e o arquivo `Análise de currículo.mp4` ficam intocados.
- `page.tsx` é server component — não adicionar `"use client"` nele. O componente novo é client.
- Comentários de código em pt-BR (padrão do repo). Commits em pt-BR estilo conventional (`feat:`, `chore:`) com trailer `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Existem DUAS instâncias do componente montadas ao mesmo tempo (mobile `lg:hidden` + desktop `hidden lg:block`). Todo targeting de animação parte de `rootRef` — **nunca** seletores globais de documento.

---

### Task 1: Instalar anime.js

**Files:**
- Modify: `package.json` (+ `package-lock.json`, gerado)

**Interfaces:**
- Produces: módulo `animejs` importável com exports nomeados `createTimeline`, `splitText`, `stagger` (tipos TS embutidos no pacote — não existe `@types/animejs` para v4, não instalar).

- [ ] **Step 1: Instalar a dependência**

Run: `npm install animejs`
Expected: `added 1 package` (ou similar), sem erros.

- [ ] **Step 2: Verificar versão e tipos**

Run: `node -e "const p=require('./node_modules/animejs/package.json'); console.log(p.version, p.types || p.typings || 'types-in-exports')"`
Expected: versão `4.x.x` (>= 4.5.0) e um caminho de types (ou `types-in-exports` — nesse caso conferir que `exports` do package.json aponta `.d.ts`).

- [ ] **Step 3: Smoke de type-check com os imports que o projeto vai usar**

Criar arquivo temporário `src/anime-smoke.ts`:

```ts
import { createTimeline, splitText, stagger } from "animejs";

// Smoke: só confere que os exports existem e tipam.
export const smoke = { createTimeline, splitText, stagger };
```

Run: `npm run type-check`
Expected: PASS (exit 0, sem erros de módulo/exports).

- [ ] **Step 4: Remover o arquivo de smoke**

Deletar `src/anime-smoke.ts` e rodar `npm run type-check` de novo.
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: adiciona animejs v4 para animacao do hero

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Folha de currículo estática (`ResumeFixMockup` sem animação)

**Files:**
- Create: `src/components/ui/ResumeFixMockup.tsx`
- Modify: `src/app/globals.css` (append no final do arquivo)

**Interfaces:**
- Consumes: nada de tasks anteriores (anime.js só entra na Task 3).
- Produces:
  - `ResumeFixMockup` — default export, componente React **sem props**.
  - Contrato de classes CSS que a Task 3 consome via `rootRef`:
    `.cv-plane` (plano 3D interno da folha), `.cv-row` (um par errado/correção),
    `.cv-wrong` (texto errado, camada base), `.cv-fix` (correção, camada
    sobreposta, começa `opacity-0` e com `outline` dotted transparente).
  - Classes globais em `globals.css`: `.cv-squiggle` (sublinhado ondulado com
    `text-decoration-color: transparent`) e `.cv-static` (estado final
    estático para prefers-reduced-motion).

- [ ] **Step 1: Criar o componente com a folha estática**

Criar `src/components/ui/ResumeFixMockup.tsx`:

```tsx
"use client";

import { useRef, type ReactNode } from "react";

/**
 * Folha de currículo fictícia do hero: a IA "sobrepõe" correções aos textos
 * errados (visual do demo accessible do SplitText/anime.js). Substitui o
 * vídeo "Análise de currículo.mp4" no hero — os spotlights continuam com
 * VideoMockup.
 *
 * Conteúdo híbrido: texto real apenas nas frases que recebem correção; o
 * resto é barra cinza (greeking) para manter a folha legível em tamanho
 * pequeno. Cada .cv-row empilha as duas camadas na mesma célula de grid
 * (col-start-1 row-start-1), então a linha tem a altura da camada mais alta
 * e a correção cobre exatamente o texto errado.
 *
 * A animação (Task 3) roda num useEffect via anime.js; sem JS a folha fica
 * no estado "com erros", que parece um CV normal — aceitável, é decorativa.
 */
export default function ResumeFixMockup() {
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="relative mx-auto w-full max-w-[26rem] aspect-[10/13] overflow-hidden rounded-xl bg-slate-50 px-6 py-6 shadow-2xl shadow-black/40 ring-1 ring-black/5 sm:px-8 sm:py-8 [perspective:1000px]"
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

/** Par errado/correção empilhado na mesma célula de grid. */
function FixRow({ wrong, fixed }: { wrong: string; fixed: string }) {
  return (
    <div className="cv-row grid [transform-style:preserve-3d]">
      <p className="cv-wrong col-start-1 row-start-1 text-[11px] leading-snug text-slate-700 sm:text-xs">
        {wrong}
      </p>
      <p className="cv-fix col-start-1 row-start-1 rounded-sm text-[11px] font-medium leading-snug text-emerald-700 opacity-0 outline-offset-2 sm:text-xs [outline:1px_dotted_transparent]">
        {fixed}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Adicionar as classes globais no `globals.css`**

Append no **final** de `src/app/globals.css`:

```css
/* === ResumeFixMockup (hero) =========================================== */
/* Sublinhado ondulado estilo corretor ortográfico, aplicado por palavra
   (o splitText põe essa classe em cada palavra errada — text-decoration
   não propaga para inline-block, por isso é por palavra e não no <p>).
   Começa transparente; o anime.js anima textDecorationColor. */
.cv-squiggle {
  text-decoration-line: underline;
  text-decoration-style: wavy;
  text-decoration-color: transparent;
  text-decoration-thickness: 1.5px;
  text-underline-offset: 3px;
}

/* prefers-reduced-motion: sem timeline — estado final "corrigido" fixo. */
.cv-static .cv-fix {
  opacity: 1;
  outline-color: rgba(4, 120, 87, 0.6);
}
.cv-static .cv-wrong {
  opacity: 0.25;
}
```

- [ ] **Step 3: Verificar type-check e lint**

Run: `npm run type-check` e depois `npm run lint`
Expected: ambos PASS (o componente ainda não é usado em página nenhuma — sem erro de unused: é export default de módulo próprio).

- [ ] **Step 4: Commit**

(A verificação visual da folha acontece na Task 4, quando o componente é
integrado ao hero — não integrar nada antes disso.)

```bash
git add src/components/ui/ResumeFixMockup.tsx src/app/globals.css
git commit -m "feat: folha de curriculo estatica do hero (ResumeFixMockup)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Timeline de animação (errado ↔ corrigido em loop)

**Files:**
- Modify: `src/components/ui/ResumeFixMockup.tsx`

**Interfaces:**
- Consumes: exports `createTimeline`, `splitText`, `stagger` de `animejs` (Task 1); classes `.cv-plane`, `.cv-row`, `.cv-wrong`, `.cv-fix`, `.cv-squiggle`, `.cv-static` (Task 2).
- Produces: comportamento final do componente (nenhuma API nova — Task 4 só monta `<ResumeFixMockup />`).

- [ ] **Step 1: Adicionar o efeito de animação ao componente**

Em `src/components/ui/ResumeFixMockup.tsx`, trocar a linha de import do React e adicionar o import do anime.js:

```tsx
import { useEffect, useRef, type ReactNode } from "react";
import { createTimeline, splitText, stagger } from "animejs";
```

Dentro de `ResumeFixMockup`, logo após `const rootRef = …`, adicionar:

```tsx
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Quem prefere menos movimento vê o estado final estático (via CSS),
    // sem timeline nenhuma.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("cv-static");
      return;
    }

    const plane = root.querySelector<HTMLElement>(".cv-plane");
    const rows = Array.from(root.querySelectorAll<HTMLElement>(".cv-row"));
    const splits: ReturnType<typeof splitText>[] = [];

    // loop + alternate: erra ↔ corrige para sempre; loopDelay segura cada
    // extremo (~2,6 s) fazendo as vezes dos "holds" da spec.
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

      // splitText por palavra; nas erradas cada palavra ganha .cv-squiggle
      // (sublinhado ondulado começa transparente). accessible fica no
      // default (true) — sem custo, e o container já é aria-hidden.
      const wrongSplit = splitText(wrongEl, {
        words: { class: "cv-squiggle" },
      });
      const fixSplit = splitText(fixEl, { words: true });
      splits.push(wrongSplit, fixSplit);

      const tIn = 600 + i * 250; // sublinhados surgem em cascata (estado A)
      const tFix = 2200 + i * 250; // correções entram em cascata

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
        .add(
          wrongSplit.words,
          {
            z: "-0.9rem",
            opacity: 0.25,
            duration: 650,
            delay: stagger(20, { from: "random" }),
          },
          tFix
        )
        .add(
          fixEl,
          {
            opacity: { from: 0, to: 1 },
            outlineColor: {
              from: "rgba(4, 120, 87, 0)",
              to: "rgba(4, 120, 87, 0.6)",
            },
            duration: 500,
          },
          tFix
        )
        .add(
          fixSplit.words,
          {
            opacity: { from: 0, to: 1 },
            z: { from: "2.2rem", to: "0rem" },
            duration: 750,
            delay: stagger(30, { from: "random" }),
          },
          tFix + 100
        );
    });

    // Leve rotação 3D da folha durante a troca, como no demo.
    if (plane) {
      tl.add(
        plane,
        {
          rotateY: { from: 0, to: -6 },
          rotateX: { from: 0, to: 2 },
          duration: 1200,
        },
        2200
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
```

- [ ] **Step 2: Verificar type-check e lint**

Run: `npm run type-check` e depois `npm run lint`
Expected: ambos PASS. Se o TS reclamar de `words: { class: … }` ou dos tipos de `{ from, to }`, conferir a assinatura real em `node_modules/animejs/types/index.d.ts` e ajustar a chamada (a API é a do demo oficial "accessible"); NÃO usar `any`.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/ResumeFixMockup.tsx
git commit -m "feat: timeline anime.js que sobrepoe correcoes no curriculo do hero

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Integrar no hero e verificar visualmente

**Files:**
- Modify: `src/app/page.tsx` (import + 2 trocas, linhas ~737 e ~780)

**Interfaces:**
- Consumes: `ResumeFixMockup` (default export, sem props) de `@/components/ui/ResumeFixMockup`.
- Produces: hero final — nada consome esta task.

- [ ] **Step 1: Adicionar o import**

Em `src/app/page.tsx`, logo após `import VideoMockup from "@/components/ui/VideoMockup";` adicionar:

```tsx
import ResumeFixMockup from "@/components/ui/ResumeFixMockup";
```

(`VideoMockup` continua importado — os spotlights usam.)

- [ ] **Step 2: Trocar a instância mobile (~linha 737)**

Localizar no bloco `lg:hidden` do hero:

```tsx
                  <TiltCard intensity={8}>
                    <VideoMockup
                      src={`/videos/${encodeURIComponent("Análise de currículo.mp4")}`}
                      url="karreify.com/resume-analysis"
                    />
                  </TiltCard>
```

e trocar por:

```tsx
                  <TiltCard intensity={8}>
                    <ResumeFixMockup />
                  </TiltCard>
```

- [ ] **Step 3: Trocar a instância desktop (~linha 780)**

Localizar no bloco `hidden lg:block` do hero:

```tsx
                <TiltCard intensity={8}>
                  <VideoMockup
                    src={`/videos/${encodeURIComponent("Análise de currículo.mp4")}`}
                    url="karreify.com/resume-analysis"
                  />
                </TiltCard>
```

e trocar por:

```tsx
                <TiltCard intensity={8}>
                  <ResumeFixMockup />
                </TiltCard>
```

Badges flutuantes ("Score A+", "IA Analisou") e wrappers ficam exatamente como estão nos dois blocos.

- [ ] **Step 4: Type-check e lint**

Run: `npm run type-check` e depois `npm run lint`
Expected: ambos PASS.

- [ ] **Step 5: Verificação visual no dev server**

Run: `npm run dev` e abrir `http://localhost:3000`.

Checklist (desktop e viewport mobile ~390px):
1. Folha clara aparece no lugar do vídeo, com badges flutuando nos cantos.
2. Estado inicial: 3 frases erradas legíveis; sublinhados ondulados vermelhos surgem de cima para baixo.
3. ~2,2 s depois: correções verdes com contorno pontilhado entram palavra a palavra por cima; erradas recuam apagadas; folha dá leve giro 3D.
4. Segura ~2,6 s corrigido e volta (alternate) — loop contínuo.
5. Hover do TiltCard (desktop) continua funcionando junto.
6. Scroll para fora do hero e de volta: animação pausa/retoma (checar no aba Performance/CPU se quiser).
7. DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce" → recarregar: folha estática já corrigida, sem animação.
8. Console sem erros.

Expected: todos os 8 itens OK. Itens de timing/intensidade (durações, graus de rotação, cores) podem ser ajustados a olho aqui — são os valores "~" da spec.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: substitui video do hero pela animacao de correcao de curriculo

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
