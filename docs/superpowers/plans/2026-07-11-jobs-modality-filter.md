# Filtro de modalidade em /jobs — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Controle segmentado Todas | Presencial | Híbrido | Home office no card Filtros de /jobs, com augment de query + classificador/pós-filtro no servidor (providers não têm filtro nativo no BR).

**Architecture:** `modality` flui página → `searchJobs` → rota → providers. Jooble/Adzuna ganham o augment ("home office"/"híbrido") dentro das próprias libs (o apenso do Jooble fica fora das aspas do exactMatch); a rota valida por whitelist, classifica cada vaga por regex sobre texto normalizado e filtra AO SERVIR (cache-hit e fresh), guardando o cache sem filtro. Presencial/Todas compartilham a mesma chave de cache de provider; remoto/híbrido têm chave própria via sufixo na keyword usada só para a chave.

**Tech Stack:** Next.js 14.2, libs existentes (`jooble.ts`, `adzuna.ts`, `adzuna-usage`), JobsCacheProvider. Zero dependência nova.

**Spec:** `docs/superpowers/specs/2026-07-11-jobs-modality-filter-design.md`

## Global Constraints

- `JobModality = "presencial" | "hibrido" | "remoto"`; UI usa labels Presencial / Híbrido / Home office; valor `""` no client = Todas.
- Precedência do classificador: híbrido > remoto > presencial; texto normalizado sem acentos/caixa.
- setCached guarda resultados SEM filtro (refiltra ao servir — idempotente).
- Providers NUNCA recebem a keyword com sufixo de chave de cache.
- Sem infra de testes: gates = type-check + lint + verificação manual (T2). Build não é gate.
- Comentários pt-BR; commits pt-BR conventional com trailer `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`, sem aspas duplas internas.
- NESTA sessão: Edit bloqueado → scripts node com asserção; `jobs/page.tsx` é CRLF (normalizar LF↔CRLF no script); demais arquivos são LF.

---

### Task 1: Servidor — augment nas libs + classificador/filtro na rota

**Files:**
- Modify: `src/lib/jooble.ts` (params ~32-39; buildKeywords ~85-92; call site ~105)
- Modify: `src/lib/adzuna.ts` (params ~26-33; após bloco what/what_phrase ~134-135)
- Modify: `src/app/api/search-jobs/route.ts` (SearchParams ~115-122; helpers antes do POST; body/validação ~221-247; cacheKey ~321; serve paths ~338 e ~462)

**Interfaces:**
- Consumes: `CachedJob` de `@/lib/adzuna-usage` (já importado na rota).
- Produces: `JoobleSearchParams.modality?` / `AdzunaSearchParams.modality?` (`"presencial" | "hibrido" | "remoto"`); rota aceita `body.modality` e responde jobs já filtrados.

- [ ] **Step 1: jooble.ts**

Em `JoobleSearchParams`, após `exactMatch?: boolean;`:

```ts
  modality?: "presencial" | "hibrido" | "remoto";
```

Trocar `buildKeywords` inteiro por:

```ts
/** Jooble has no exactMatch flag — quotes act as a phrase operator. O
 *  augment de modalidade fica FORA das aspas para a frase continuar
 *  casando ("analista" home office). Presencial não altera a query. */
function buildKeywords(
  keyword: string,
  exactMatch?: boolean,
  modality?: "presencial" | "hibrido" | "remoto"
): string {
  const trimmed = keyword.trim();
  const base = !exactMatch
    ? trimmed
    : trimmed.startsWith('"') && trimmed.endsWith('"')
      ? trimmed
      : `"${trimmed}"`;
  if (modality === "remoto") return `${base} home office`;
  if (modality === "hibrido") return `${base} híbrido`;
  return base;
}
```

Call site: `keywords: buildKeywords(params.keyword, params.exactMatch),` → `keywords: buildKeywords(params.keyword, params.exactMatch, params.modality),`

- [ ] **Step 2: adzuna.ts**

Em `AdzunaSearchParams`, após `exactMatch?: boolean;`:

```ts
  modality?: "presencial" | "hibrido" | "remoto";
```

Após o bloco `if (params.exactMatch) ... else qs.set("what", ...);` inserir:

```ts
  // Augment de modalidade — a Adzuna não tem filtro nativo; what_and exige
  // que todas as palavras apareçam no anúncio. Presencial não altera a query.
  if (params.modality === "remoto") qs.set("what_and", "home office");
  else if (params.modality === "hibrido") qs.set("what_and", "híbrido");
```

- [ ] **Step 3: route.ts — tipo, helpers, validação, chave e filtro**

Em `SearchParams` (interface local), após `exactMatch: boolean;`:

```ts
  modality?: JobModality;
```

Antes de `interface SearchParams` inserir:

```ts
type JobModality = "presencial" | "hibrido" | "remoto";
const MODALITIES: JobModality[] = ["presencial", "hibrido", "remoto"];

/** Remove acentos e baixa a caixa para casar as regex de modalidade. */
function normalizeForMatch(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** Classifica a modalidade pelo texto do anúncio. Híbrido tem precedência
 *  sobre remoto ("híbrido com home office" é híbrido); sem sinal =
 *  presencial. */
function classifyModality(job: CachedJob): JobModality {
  const text = normalizeForMatch(
    `${job.title} ${job.snippet} ${job.location} ${job.type}`
  );
  if (/hibrid/.test(text)) return "hibrido";
  if (/remot|home ?office|teletrabalho|anywhere/.test(text)) return "remoto";
  return "presencial";
}

/** Pós-filtro aplicado AO SERVIR (cache-hit e fresh); o cache guarda a
 *  página sem filtro, então refiltar é idempotente. */
function filterByModality(jobs: CachedJob[], modality?: JobModality): CachedJob[] {
  if (!modality) return jobs;
  return jobs.filter((j) => classifyModality(j) === modality);
}
```

No destructure do body, adicionar `modality` (e ao tipo inline `modality?: string;`). Após a linha do `trimmedKeyword`:

```ts
    const safeModality = MODALITIES.includes(modality as JobModality)
      ? (modality as JobModality)
      : undefined;
```

`searchParams` ganha `modality: safeModality,`.

Chave de cache — trocar `const cacheKey = makeCacheKey(searchParams);` por:

```ts
    // Remoto/híbrido mudam a query enviada ao provider, então precisam de
    // chave própria; presencial/todas compartilham a MESMA busca de provider
    // (o filtro só roda ao servir) — sufixo aplicado apenas à chave, nunca
    // ao provider.
    const cacheKey = makeCacheKey(
      safeModality === "remoto" || safeModality === "hibrido"
        ? { ...searchParams, keyword: `${trimmedKeyword} §mod=${safeModality}` }
        : searchParams
    );
```

Serve paths — no cache-hit: `jobs: cached.jobs,` → `jobs: filterByModality(cached.jobs, safeModality),`; no fresh: `jobs: result.jobs,` (dentro do NextResponse.json final) → `jobs: filterByModality(result.jobs, safeModality),`. ATENÇÃO: `setCached(cacheKey, { jobs: result.jobs, ... })` fica INTACTO (guarda sem filtro).

- [ ] **Step 4: Verificar** — `npm run type-check` → PASS; `npm run lint` → PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/jooble.ts src/lib/adzuna.ts src/app/api/search-jobs/route.ts
git commit -m "feat: modalidade na busca de vagas (augment + classificador)

Jooble/Adzuna ganham augment de query para home office/hibrido; a rota
classifica por regex sem acento e filtra ao servir. Presencial reusa o
cache de todas (query intacta); remoto/hibrido tem chave propria.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Client — tipo, estado, segmented control

**Files:**
- Modify: `src/services/jobs.ts` (tipo antes de `JobSearchFilters` ~16)
- Modify: `src/components/providers/JobsCacheProvider.tsx` (import ~13; interfaces ~26 e ~41; default ~60; setter ~131; value/deps ~198/214)
- Modify: `src/app/(dashboard)/jobs/page.tsx` (CRLF! import ~34; MODALITY_OPTIONS após PERIOD_OPTIONS ~50; destructure ~68; makeCacheKey; searchJobs call; UI antes do grid Estado/Cidade)

**Interfaces:**
- Consumes: rota da Task 1; `JobModality` produzido aqui em `@/services/jobs`.
- Produces: nada além (última task).

- [ ] **Step 1: services/jobs.ts**

Antes de `export interface JobSearchFilters {`:

```ts
export type JobModality = "presencial" | "hibrido" | "remoto";

```

Em `JobSearchFilters`, após `exactMatch?: boolean;`:

```ts
  modality?: JobModality;
```

- [ ] **Step 2: JobsCacheProvider.tsx**

Import: `import type { Job, DatePeriod } from "@/services/jobs";` → `import type { Job, DatePeriod, JobModality } from "@/services/jobs";`

`JobsCacheState`: após `  exactMatch: boolean;` → `  modality: JobModality | "";`
`JobsCacheContextType`: após `  setExactMatch: (v: boolean) => void;` → `  setModality: (v: JobModality | "") => void;`
`defaultState`: após `  exactMatch: false,` → `  modality: "",`
Após o bloco do setter `setExactMatch` inserir:

```ts
  const setModality = useCallback(
    (v: JobModality | "") => setState((p) => ({ ...p, modality: v })),
    []
  );
```

No objeto do `value`: após `      setExactMatch,` → `      setModality,`; no array de deps: após `      setExactMatch,` → `      setModality,` (as DUAS ocorrências de `      setExactMatch,` recebem a linha — usar replaceExactly(2)).

- [ ] **Step 3: jobs/page.tsx (CRLF — normalizar no script)**

Import de services: após `  extractJobProfile,\n` não — a linha correta é no bloco de tipos: trocar `  type Job,\n  type DatePeriod,` por `  type Job,\n  type DatePeriod,\n  type JobModality,`.

Após o array `PERIOD_OPTIONS` (fecha com `];`) inserir:

```ts

const MODALITY_OPTIONS: { value: JobModality | ""; label: string }[] = [
  { value: "", label: "Todas" },
  { value: "presencial", label: "Presencial" },
  { value: "hibrido", label: "Híbrido" },
  { value: "remoto", label: "Home office" },
];
```

Destructure do hook: trocar `    exactMatch,\n    setExactMatch,` por `    exactMatch,\n    setExactMatch,\n    modality,\n    setModality,`.

`makeCacheKey`: após `      e: exactMatch ? 1 : 0,` inserir `      m: modality,`.

Chamada `searchJobs`: após `        exactMatch,` (dentro do objeto com `page: targetPage`) inserir `        modality: modality || undefined,`.

UI — antes do bloco único:

```tsx
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Estado
```

inserir:

```tsx
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Modalidade</label>
            <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 w-full sm:w-fit">
              {MODALITY_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setModality(opt.value)}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    modality === opt.value
                      ? "bg-primary-500/20 text-primary-300"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
```

- [ ] **Step 4: Verificar** — `npm run type-check` → PASS; `npm run lint` → PASS; `curl /jobs` no dev server → 200 e compile limpo.

- [ ] **Step 5: Verificação manual (checklist da spec)**

Dev server logado, com chaves de provider: (1) Home office → vagas com sinal remoto; (2) Híbrido → híbridas; (3) Presencial → sem remotas/híbridas, e no log da rota a MESMA chave de cache de "Todas" (cache_hit ao alternar); (4) página parcialmente filtrada pagina normal; (5) busca por currículo respeita a modalidade; (6) console limpo.

- [ ] **Step 6: Commit**

```bash
git add src/services/jobs.ts src/components/providers/JobsCacheProvider.tsx "src/app/(dashboard)/jobs/page.tsx"
git commit -m "feat: filtro de modalidade na UI de vagas

Segmented Todas/Presencial/Hibrido/Home office no card Filtros; entra
no cache do client e na busca por curriculo.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
