# Design — Reordenar seções do currículo por drag & drop (Ajustes)

- **Data:** 2026-07-11
- **Status:** aprovado no brainstorm
- **Escopo:** UI apenas em `/create-resume`; encanamento compartilhado
  (templates/PDF/persistência) fica pronto para o adapt-resume herdar depois.

## Objetivo

No painel "Ajustes" → "Seções" do editor de currículos, permitir arrastar e
soltar as seções para trocar a ordem em que aparecem no currículo (preview e
PDF), com persistência junto dos demais ajustes.

## Arquitetura atual (mapeada)

- A ordem hoje é fixa por nível: `getSectionOrder(candidateLevel)` em
  `src/lib/resume-templates.ts:210` — júnior põe `projects` antes de `work`,
  sênior põe `work` antes de `skills`; default pleno. Os DOIS templates
  (`profissional` e `moderno`) montam `sections: Record<SectionName, string>`
  e renderizam `order.map(name => sections[name]).filter(Boolean)`
  (linhas ~397 e ~724). `header` é renderizado fora do map (sempre primeiro).
- `SectionName = "header" | "summary" | "skills" | "work" | "projects" |
  "education" | "certifications" | "languages"` (resume-templates.ts:30).
- Ajustes existentes (`hiddenSections` + 5 valores px) fluem por:
  `TemplateOptions` (resume-templates.ts:7) → preview ao vivo do editor;
  `PdfAdjustments` + body do POST (`src/utils/resume-pdf.ts`);
  leitura/validação em `src/app/api/generate-pdf/route.ts:360`;
  tipo do item salvo em `src/types/index.ts:188`;
  estado/save/load/reset em `src/app/(dashboard)/create-resume/page.tsx`
  (estado ~151, load ~471, save ~509, reset ~659 e botão "Restaurar" ~939);
  re-download com ajustes salvos em `src/app/(dashboard)/my-files/page.tsx:484`.
- A lista "Seções" do painel (create-resume/page.tsx:956-1005) exibe
  `availableSections` (= seções COM conteúdo, via `getPopulatedSections`,
  ordem canônica — que hoje nem sempre é a ordem real do PDF), com toggle de
  olho (ocultar) e lápis (editar). "Cabeçalho" não tem toggle.

## Decisões travadas

1. **Lib:** `@dnd-kit/core` + `@dnd-kit/sortable` (+ `@dnd-kit/utilities`) —
   sortable com mouse, toque e teclado, animação de abrir espaço. ~14 KB só
   na página do editor. (Aprovado contra HTML5 nativo — sem touch — e
   pointer-events na mão.)
2. **Dado novo:** `adjustments.sectionOrder?: SectionName[]` — ordem das 7
   seções não-header. `header` fica fixo no topo, fora da ordenação.
3. **Ordem manual vence o nível:** com `sectionOrder` definido, trocar o
   `candidateLevel` não altera a ordem. `sectionOrder = null/ausente` →
   ordem automática por nível (comportamento atual; saves antigos intactos).
4. **"Restaurar" também zera a ordem** (volta ao automático por nível).
5. **Seções ocultas continuam na lista** (riscadas) e são arrastáveis — a
   posição delas persiste para quando forem reexibidas.
6. **Sanitização robusta** no template: `resolveSectionOrder(custom, level)`
   filtra nomes inválidos/duplicados/`header` e **anexa no fim** qualquer
   seção canônica faltante — à prova de saves antigos e futuros campos.

## Componentes e fluxo

1. **`src/lib/resume-templates.ts`**
   - `TemplateOptions.sectionOrder?: SectionName[]`.
   - Novo `resolveSectionOrder(custom: SectionName[] | undefined, level?:
     string): SectionName[]` — se `custom` vazio/ausente, retorna
     `getSectionOrder(level)`; senão sanitiza (whitelist das 7 não-header,
     dedupe, apende faltantes na ordem canônica).
   - Ambos os templates trocam `getSectionOrder(options?.candidateLevel)`
     por `resolveSectionOrder(options?.sectionOrder, options?.candidateLevel)`.
2. **`src/utils/resume-pdf.ts`** — `PdfAdjustments.sectionOrder?:
   SectionName[]` + campo no body do POST.
3. **`src/app/api/generate-pdf/route.ts`** — lê `body.sectionOrder`, valida
   (array de strings dentro da whitelist de `SectionName`, senão ignora) e
   repassa nas options do template.
4. **`src/types/index.ts`** — `adjustments.sectionOrder?: string[]` no tipo
   do item salvo.
5. **`src/app/(dashboard)/create-resume/page.tsx`**
   - Estado `sectionOrder: SectionName[] | null` (null = automático).
   - Entra em `currentAdjustments()`/`templateOptions` (preview ao vivo),
     no save (~509), no load (~471), no reset de novo currículo (~659) e no
     botão "Restaurar" (~939).
   - Lista "Seções": renderizada na **ordem efetiva**
     (`sectionOrder ?? getSectionOrder(candidateLevel)`, filtrada para
     `availableSections`), header primeiro e fixo. Linhas não-header viram
     itens sortable do dnd-kit com alça `GripVertical` à esquerda; ao soltar,
     `setSectionOrder(novaOrdemCompleta)` (as 7 não-header, incluindo as sem
     conteúdo, que mantêm posição relativa no fim).
   - Feedback visual de arrasto: item elevado com ring primary; demais abrem
     espaço (animação padrão do sortable).
6. **`src/app/(dashboard)/my-files/page.tsx`** — repassa
   `adjustments.sectionOrder` no re-download do PDF.

## Fora de escopo

- UI de reordenação no adapt-resume (herda o encanamento; fica para depois).
- Reordenar itens DENTRO de uma seção (ex.: experiências individuais).
- Arrastar o `header`.

## Verificação

- `npm run type-check` e `npm run lint`.
- Dev server: arrastar seção → preview reflete na hora; baixar PDF → ordem
  igual à do preview; salvar, reabrir em "Meus arquivos" → ordem persistida
  no editor e no re-download; "Restaurar" volta ao automático; trocar nível
  com ordem manual não a desfaz; toggle de ocultar continua funcionando;
  arrasto por toque no viewport mobile (~390 px).
