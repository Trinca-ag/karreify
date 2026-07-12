# Reordenar seções por drag & drop — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** No painel "Ajustes" → "Seções" do editor `/create-resume`, arrastar e soltar seções para trocar a ordem do currículo (preview/PDF), persistindo junto dos demais ajustes.

**Architecture:** Novo campo `adjustments.sectionOrder` flui pelos canos existentes dos ajustes (TemplateOptions → templates; PdfAdjustments → POST → rota → templates; tipo do item salvo; estado/save/load/reset do editor; re-download no my-files). Um `resolveSectionOrder` sanitizador nos templates é a única lógica nova de domínio; a UI usa @dnd-kit/sortable na lista de seções já existente. O "preview" do editor é o próprio PDF regenerado com debounce — nenhum caminho novo de renderização.

**Tech Stack:** Next.js 14.2, React 18, TypeScript, Tailwind 3.4, @dnd-kit (core 6.3.1 / sortable 10.0.0 / utilities 3.2.2), lucide-react.

**Spec:** `docs/superpowers/specs/2026-07-11-section-reorder-design.md`

## Global Constraints

- Dependências novas: SÓ `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`.
- Sem infra de testes no repo: o ciclo de cada task é `npm run type-check` + `npm run lint` + verificação manual no dev server (Task 3). `npm run build` NÃO é gate.
- `header` nunca entra na ordenação (fixo no topo, renderizado fora do map nos templates).
- `sectionOrder` ausente/vazio ⇒ comportamento atual (`getSectionOrder(level)`); saves antigos intactos.
- Ordem manual vence o nível; "Resetar" do painel também zera a ordem.
- Comentários em pt-BR; commits pt-BR conventional com trailer `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`. Mensagens de commit SEM aspas duplas internas (PowerShell 5.1 quebra o argumento).
- NESTA sessão o tool Edit está bloqueado por hook zumbi (Semgrep desabilitado, efeito só na próxima sessão): aplicar modificações em arquivos existentes via script node (substituição literal com asserção de ocorrência única, padrão já usado) ou Write de arquivo inteiro quando o arquivo for de autoria da sessão; validar com `git diff` após cada aplicação. Em sessão nova, usar Edit normalmente.
- UI só em `/create-resume` — NÃO mexer em `adapt-resume`.

---

### Task 1: Instalar @dnd-kit

**Files:**
- Modify: `package.json` (+ lockfile)

**Interfaces:**
- Produces: módulos `@dnd-kit/core` (DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, DragEndEvent), `@dnd-kit/sortable` (SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates, useSortable, arrayMove), `@dnd-kit/utilities` (CSS).

- [ ] **Step 1: Instalar**

Run: `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
Expected: `added 3 packages` (ou similar), sem erros.

- [ ] **Step 2: Smoke de type-check**

Criar `src/dnd-smoke.ts`:

```ts
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Smoke: só confere que os exports existem e tipam.
export const smoke = { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates, useSortable, arrayMove, CSS };
export type Smoke = DragEndEvent;
```

Run: `npm run type-check`
Expected: PASS.

- [ ] **Step 3: Remover smoke e re-checar**

Deletar `src/dnd-smoke.ts`. Run: `npm run type-check` → PASS.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: adiciona dnd-kit para reordenacao de secoes

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Encanamento do sectionOrder (templates → PDF → tipos → my-files)

**Files:**
- Modify: `src/lib/resume-templates.ts` (TemplateOptions ~linha 11; após getSectionOrder ~linha 220; call sites ~linhas 396 e 723)
- Modify: `src/utils/resume-pdf.ts` (PdfAdjustments ~linha 8; body do POST ~linha 51)
- Modify: `src/app/api/generate-pdf/route.ts` (~linhas 360-387)
- Modify: `src/types/index.ts` (~linha 188)
- Modify: `src/app/(dashboard)/my-files/page.tsx` (~linha 137)

**Interfaces:**
- Consumes: nada da Task 1 (encanamento é independente da lib de UI).
- Produces: `resolveSectionOrder(custom: SectionName[] | undefined, level?: string): SectionName[]` (export de `@/lib/resume-templates`); `TemplateOptions.sectionOrder?: SectionName[]`; `PdfAdjustments.sectionOrder?: SectionName[]`; `SavedResumeItem.adjustments.sectionOrder?: string[]`; rota aceita `body.sectionOrder`.

- [ ] **Step 1: resume-templates.ts — opção + resolver**

Em `TemplateOptions`, logo após `hiddenSections?: SectionName[];` (linha 11), adicionar:

```ts
  sectionOrder?: SectionName[];   // ordem custom (Ajustes → Seções); vazio/ausente = automática por nível
```

Logo APÓS a função `getSectionOrder` (que termina na linha 220), adicionar:

```ts
// Seções que participam da ordenação custom ("header" é sempre primeiro,
// renderizado fora do map dos templates).
const ORDERABLE_SECTIONS: SectionName[] = ["summary", "skills", "work", "projects", "education", "certifications", "languages"];

// Ordem custom do usuário com sanitização à prova de saves antigos/futuros:
// filtra nomes desconhecidos e duplicados, ignora "header" e apende no fim
// (em ordem canônica) qualquer seção ausente. Vazio/ausente → automática.
export function resolveSectionOrder(custom: SectionName[] | undefined, level?: string): SectionName[] {
  if (!custom || custom.length === 0) return getSectionOrder(level);
  const seen = new Set<SectionName>();
  const order: SectionName[] = [];
  for (const name of custom) {
    if (ORDERABLE_SECTIONS.includes(name) && !seen.has(name)) {
      seen.add(name);
      order.push(name);
    }
  }
  for (const name of ORDERABLE_SECTIONS) {
    if (!seen.has(name)) order.push(name);
  }
  return order;
}
```

Trocar as DUAS ocorrências (template profissional ~396 e moderno ~723) de:

```ts
  const order = getSectionOrder(options?.candidateLevel);
```

por:

```ts
  const order = resolveSectionOrder(options?.sectionOrder, options?.candidateLevel);
```

- [ ] **Step 2: resume-pdf.ts — tipo + body**

Em `PdfAdjustments`, após `hiddenSections?: SectionName[];`:

```ts
  sectionOrder?: SectionName[];
```

No body do POST em `generateResumePDFBlob`, após `hiddenSections: adjustments?.hiddenSections,`:

```ts
      sectionOrder: adjustments?.sectionOrder,
```

- [ ] **Step 3: generate-pdf/route.ts — ler, validar, repassar**

Após a linha `const hiddenSections: string[] | undefined = body.hiddenSections;` (~360), adicionar:

```ts
    // Ordem custom das seções — whitelist estrita (ignora silenciosamente
    // valores fora do contrato; ausente/vazio deixa a ordem automática).
    const ORDERABLE = ["summary", "skills", "work", "projects", "education", "certifications", "languages"];
    const rawSectionOrder: unknown = body.sectionOrder;
    const sectionOrder = Array.isArray(rawSectionOrder)
      ? rawSectionOrder.filter((s): s is string => typeof s === "string" && ORDERABLE.includes(s))
      : undefined;
```

No objeto `templateOptions` (~377), após a linha do `hiddenSections`:

```ts
      sectionOrder: sectionOrder && sectionOrder.length > 0
        ? (sectionOrder as import("@/lib/resume-templates").SectionName[])
        : undefined,
```

- [ ] **Step 4: types/index.ts — tipo do item salvo**

Em `SavedResumeItem.adjustments` (~188), após `hiddenSections?: string[];`:

```ts
    sectionOrder?: string[];
```

- [ ] **Step 5: my-files/page.tsx — re-download com a ordem salva**

No objeto de adjustments do re-download (~135-138), após a linha do `hiddenSections`:

```ts
            sectionOrder: item.adjustments?.sectionOrder as SectionName[] | undefined,
```

(O import `type { SectionName }` já existe no arquivo — conferir; se não existir, adicionar ao import de `@/lib/resume-templates`.)

- [ ] **Step 6: Verificar**

Run: `npm run type-check` → PASS. Run: `npm run lint` → PASS.
Conferir com `git diff` que só os 5 arquivos esperados mudaram.

- [ ] **Step 7: Commit**

```bash
git add src/lib/resume-templates.ts src/utils/resume-pdf.ts src/app/api/generate-pdf/route.ts src/types/index.ts "src/app/(dashboard)/my-files/page.tsx"
git commit -m "feat: sectionOrder flui de ajustes ate os templates de PDF

resolveSectionOrder sanitiza (whitelist, dedupe, apende faltantes) e cai
na ordem automatica por nivel quando ausente; rota valida por whitelist.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: UI de drag & drop no editor

**Files:**
- Modify: `src/app/(dashboard)/create-resume/page.tsx`
  (imports ~3-33; estado ~152; currentAdjustments ~340-347; debounce deps ~366; load ~471-490; autosave ~509-521; reset ~659; Restaurar ~932-941; lista Seções ~961-1005; novo componente no fim do arquivo)

**Interfaces:**
- Consumes: `resolveSectionOrder` e `SectionName` de `@/lib/resume-templates` (Task 2); exports do @dnd-kit (Task 1); `SECTION_LABELS`, `availableSections`, `hiddenSections`, `editingSection`, `pdfLoading`, `SectionEditor` já existentes no arquivo.
- Produces: nada consumido por outras tasks (última task).

- [ ] **Step 1: Imports**

Na linha 13, adicionar `GripVertical` ao import do lucide-react (lista já existente).
Na linha 16/17, garantir: `import { getDefaultSizesPx, resolveSectionOrder } from "@/lib/resume-templates";`
Na linha 3, adicionar `type ReactNode` ao import do react: `import { useState, useEffect, useRef, useCallback, useMemo, type ReactNode } from "react";`
Após os imports do lucide (nova linha):

```ts
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
```

- [ ] **Step 2: Estado + wiring de persistência**

Após a linha 152 (`const [hiddenSections, ...]`):

```ts
  // Ordem custom das seções (drag & drop). null = automática por nível.
  const [sectionOrder, setSectionOrder] = useState<SectionName[] | null>(null);
```

Em `currentAdjustments` (~340-347): adicionar `sectionOrder: sectionOrder ?? undefined,` após a linha do `hiddenSections`, e `sectionOrder` no array de deps do `useCallback`.

No effect de debounce dos ajustes (~366): adicionar `sectionOrder` ao array de deps.

No load do item salvo (~477), após a linha do `sectionSpacingPx`:

```ts
          if (Array.isArray(adj.sectionOrder)) setSectionOrder(adj.sectionOrder as SectionName[]);
```

No `generatePdf` do load (~484-490), após a linha do `hiddenSections`:

```ts
            sectionOrder: (item.adjustments as Record<string, unknown> | undefined)?.sectionOrder as SectionName[] | undefined,
```

No autosave (~509-515), após a linha do `hiddenSections`:

```ts
          sectionOrder: sectionOrder ?? undefined,
```

e `sectionOrder` no array de deps do effect (~521).

No reset de novo currículo (~660, junto de `setHiddenSections([])`):

```ts
    setSectionOrder(null);
```

No botão "Resetar" do painel: condição (~932) ganha `|| sectionOrder != null`; onClick (~934-941) ganha `setSectionOrder(null);`.

- [ ] **Step 3: Ordem efetiva + sensores + handler (antes do return do componente)**

```ts
  // Lista do painel na ordem REAL de renderização (header primeiro, fixo).
  const orderedSections = useMemo<SectionName[]>(() => {
    const effective = resolveSectionOrder(sectionOrder ?? undefined, candidateLevel);
    return ["header", ...effective.filter(s => availableSections.includes(s))];
  }, [sectionOrder, candidateLevel, availableSections]);

  const dndSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleSectionDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const visible = orderedSections.filter(s => s !== "header");
    const from = visible.indexOf(active.id as SectionName);
    const to = visible.indexOf(over.id as SectionName);
    if (from < 0 || to < 0) return;
    // resolveSectionOrder completa com as seções sem conteúdo no fim.
    setSectionOrder(resolveSectionOrder(arrayMove(visible, from, to), candidateLevel));
  }
```

- [ ] **Step 4: JSX da lista Seções**

Substituir o bloco `{availableSections.map(key => { ... })}` (~962-1005 + fechamento do SectionEditor) por:

```tsx
                <DndContext sensors={dndSensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
                  <SortableContext items={orderedSections.filter(s => s !== "header")} strategy={verticalListSortingStrategy}>
                    {orderedSections.map(key => {
                      const label = SECTION_LABELS[key];
                      const isHeader = key === "header";
                      const isHidden = !isHeader && hiddenSections.includes(key);
                      const isEditing = editingSection === key && !isHidden;

                      const rowContent = (
                        <>
                          {isHeader ? (
                            <span className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-white/[0.02] text-gray-300 border border-white/[0.06]">
                              <PenLine className="w-3.5 h-3.5 flex-shrink-0" />
                              {label}
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                setHiddenSections(prev =>
                                  isHidden ? prev.filter(s => s !== key) : [...prev, key]
                                );
                                if (!isHidden) setEditingSection(prev => prev === key ? null : prev);
                              }}
                              disabled={pdfLoading}
                              className={`flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                                isHidden
                                  ? "bg-red-500/10 text-red-400/70 border border-red-500/20"
                                  : "bg-white/[0.02] text-gray-300 border border-white/[0.06] hover:bg-white/[0.05]"
                              }`}
                            >
                              {isHidden ? <EyeOff className="w-3.5 h-3.5 flex-shrink-0" /> : <Eye className="w-3.5 h-3.5 flex-shrink-0" />}
                              <span className={isHidden ? "line-through" : ""}>{label}</span>
                            </button>
                          )}
                          <button
                            onClick={() => setEditingSection(prev => prev === key ? null : key)}
                            disabled={isHidden || pdfLoading}
                            className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-all ${
                              isEditing
                                ? "bg-primary-500/20 border-primary-500/40 text-primary-400"
                                : "bg-white/[0.02] border-white/[0.06] text-gray-500 hover:text-gray-300 hover:bg-white/[0.05]"
                            } disabled:opacity-30 disabled:cursor-not-allowed`}
                          >
                            <PenLine className="w-3 h-3" />
                          </button>
                        </>
                      );

                      const editorContent = isEditing && resumeData ? (
                        <SectionEditor
                          section={key}
                          data={resumeData}
                          onChange={(updated) => {
                            pendingTextEdit.current = true;
                            setResumeData(updated);
                          }}
                          disabled={pdfLoading}
                        />
                      ) : null;

                      if (isHeader) {
                        return (
                          <div key={key}>
                            <div className="flex items-center gap-1">
                              {/* espaçador alinhando com a alça das linhas arrastáveis */}
                              <span className="w-7 h-7 flex-shrink-0" />
                              {rowContent}
                            </div>
                            {editorContent}
                          </div>
                        );
                      }

                      return (
                        <SortableSectionRow key={key} id={key} disabled={pdfLoading} row={rowContent} editor={editorContent} />
                      );
                    })}
                  </SortableContext>
                </DndContext>
```

ATENÇÃO: o `SectionEditor` atual (~1006-1015) tem props reais no arquivo — copiar as props EXATAS do bloco existente ao montar `editorContent` (o snippet acima reproduz o padrão visto; conferir no arquivo antes de substituir e preservar quaisquer props extras).

- [ ] **Step 5: Componente SortableSectionRow (fim do arquivo, junto dos outros helpers)**

```tsx
/**
 * Linha arrastável da lista de seções (Ajustes). A alça (GripVertical) é o
 * único ativador do drag — toggles e lápis continuam clicáveis normalmente.
 * `touch-none` na alça evita que o scroll da página "roube" o gesto no
 * celular.
 */
function SortableSectionRow({
  id,
  disabled,
  row,
  editor,
}: {
  id: SectionName;
  disabled?: boolean;
  row: ReactNode;
  editor?: ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "relative z-10 rounded-lg ring-1 ring-primary-500/40" : undefined}
    >
      <div className="flex items-center gap-1">
        <button
          type="button"
          {...attributes}
          {...listeners}
          disabled={disabled}
          aria-label={`Arrastar para reordenar a seção`}
          className={`w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg border transition-all touch-none ${
            isDragging
              ? "cursor-grabbing bg-primary-500/20 border-primary-500/40 text-primary-400"
              : "cursor-grab bg-white/[0.02] border-white/[0.06] text-gray-500 hover:text-gray-300 hover:bg-white/[0.05]"
          } disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>
        {row}
      </div>
      {editor}
    </div>
  );
}
```

Nota: o wrapper `space-y-1.5` externo (linha ~961) permanece; cada item (header e sortables) é filho direto dele.

- [ ] **Step 6: Verificar**

Run: `npm run type-check` → PASS. Run: `npm run lint` → PASS.

- [ ] **Step 7: Verificação manual no dev server (checklist da spec)**

Run: `npm run dev` e abrir `/create-resume` logado, com um currículo gerado/carregado:
1. Painel Ajustes → Seções: linhas com alça; header sem alça, fixo no topo; lista na ordem real do PDF.
2. Arrastar uma seção → linhas abrem espaço; ao soltar, preview (PDF) regenera com a nova ordem (~1-3 s, igual aos outros ajustes).
3. Baixar o PDF → ordem confere com o preview.
4. Editar currículo salvo: reabrir pelo "Meus arquivos" → ordem persistida no editor; re-download no my-files usa a ordem.
5. "Resetar" → volta à ordem automática do nível.
6. Trocar nível do candidato com ordem manual → ordem NÃO muda.
7. Ocultar seção → continua na lista riscada e arrastável; reexibir mantém a posição.
8. Viewport mobile (~390 px): abrir o drawer de Ajustes e arrastar por toque.
9. Console sem erros.

Expected: 9/9 OK (itens visuais finos podem ser calibrados a olho).

- [ ] **Step 8: Commit**

```bash
git add "src/app/(dashboard)/create-resume/page.tsx"
git commit -m "feat: drag and drop para reordenar secoes no editor de curriculo

Lista de secoes do painel Ajustes vira sortable (dnd-kit) com alca por
linha; ordem persiste em adjustments.sectionOrder e vale para preview,
PDF, saves e re-download.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
