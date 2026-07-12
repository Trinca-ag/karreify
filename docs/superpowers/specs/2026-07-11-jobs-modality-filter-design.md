# Design — Filtro de modalidade na busca de vagas (/jobs)

- **Data:** 2026-07-11
- **Status:** aprovado no brainstorm
- **Contexto:** Jooble e Adzuna NÃO têm parâmetro nativo de modalidade para o
  BR — a solução é aumentar a query + classificar/pós-filtrar no servidor.

## Objetivo

Filtrar vagas por modalidade — **Todas | Presencial | Híbrido | Home office**
— num controle segmentado do card Filtros, no mesmo estilo do "Publicado".

## Decisões travadas no brainstorm

1. **Param novo** `modality?: "presencial" | "hibrido" | "remoto"`
   (ausente/undefined = todas), fluindo página → `searchJobs` → rota →
   providers. Labels da UI: Presencial / Híbrido / Home office.
2. **Estratégia augment + classificador:**
   - `remoto` (Home office): query ganha "home office" (Jooble: apenso ao
     `keywords`; Adzuna: `what_and=home office`) + pós-filtro no servidor
     que confirma `remoto|home office|teletrabalho` no texto e descarta os
     que se declaram híbridos.
   - `hibrido`: query ganha "híbrido" + pós-filtro `hibrid` (texto
     normalizado sem acento).
   - `presencial`: query INALTERADA (igual a "todas" — reaproveita o cache
     do servidor, sem gastar cota Jooble); pós-filtro EXCLUI classificados
     remoto/híbrido.
3. **Classificador** `classifyModality(job)` na rota: normaliza
   título+snippet+localização (lowercase, sem acentos) e testa regex —
   híbrido se `hibrid`; remoto se `remot|home office|homeoffice|teletrabalho`;
   senão presencial. Híbrido tem precedência sobre remoto (anúncio "híbrido
   com home office" é híbrido).
4. **Trade-off aceito:** pós-filtro roda por página de 20 do provider —
   página pode exibir menos de 20 e o totalCount segue o do provider
   (aproximado). Paginação continua a do provider.
5. **Cache:** a chave de cache do SERVIDOR precisa refletir a query
   efetivamente enviada ao provider + a modalidade filtrada; presencial e
   todas compartilham a MESMA busca de provider (mesma chave de provider),
   diferindo só no pós-filtro aplicado ao servir. Chave de cache do CLIENT
   (makeCacheKey da página) ganha a modalidade.
6. A busca pelo currículo (feature anterior) respeita a modalidade
   selecionada no momento (lida do estado; não entra nos overrides).

## Arquitetura atual (mapeada)

- `src/lib/jooble.ts`: `callJooble({keyword, uf, city, period, exactMatch,
  page})` → body `{keywords, location, page, ResultOnPage, datecreatedfrom}`;
  aspas na keyword = operador de frase (usado pelo exactMatch).
- `src/lib/adzuna.ts`: `callAdzuna(...)` → querystring com
  `what`/`what_phrase` (exactMatch), `where`, `max_days_old`,
  `results_per_page`; suporta `what_and` (todas as palavras presentes).
- `src/app/api/search-jobs/route.ts`: valida body, monta `SearchParams`,
  cache servidor via `makeCacheKey`/`getCached`/`setCached` de
  `@/lib/adzuna-usage`, tenta Jooble → fallback Adzuna, registra métricas,
  responde `{jobs, totalCount, page, ...}`.
- Client: `JobSearchFilters` em `src/services/jobs.ts`; estados da busca em
  `src/components/providers/JobsCacheProvider.tsx` (useJobsCache); página
  monta o controle de período com `PERIOD_OPTIONS` (padrão do segmented).

## Componentes e fluxo

1. **`src/services/jobs.ts`** — `JobSearchFilters.modality?: JobModality`
   com `export type JobModality = "presencial" | "hibrido" | "remoto"`.
2. **`src/components/providers/JobsCacheProvider.tsx`** — estado
   `modality: JobModality | ""` (string vazia = todas) com setter, incluso
   no reset.
3. **`src/lib/jooble.ts` e `src/lib/adzuna.ts`** — params ganham
   `modality?`; augment da query: remoto → +"home office", hibrido →
   +"híbrido", presencial/undefined → query intacta. No Jooble o apenso
   entra FORA das aspas do exactMatch (`"analista" home office`).
4. **`src/app/api/search-jobs/route.ts`** — valida modality por whitelist;
   `classifyModality` + pós-filtro ao servir (cache e provider intactos);
   chave de cache do servidor: presencial/todas usam a mesma chave de
   provider; remoto/hibrido têm chave própria (a query muda).
5. **`src/app/(dashboard)/jobs/page.tsx`** — `MODALITY_OPTIONS` + segmented
   control (estilo do período) na linha dos filtros; `makeCacheKey` do
   client ganha `m: modality`; `runSearch` passa `modality || undefined`
   ao `searchJobs`.

## Fora de escopo

- Filtro nativo por modalidade nos providers (não existe para BR).
- Reclassificar o campo `type` exibido no card (contrato ≠ modalidade).
- Badge de modalidade nos resultados (pode vir depois).

## Verificação

- `npm run type-check` e `npm run lint`.
- Dev server (logado, com chaves de provider): Home office → só vagas com
  sinal remoto; Híbrido → só híbridas; Presencial → sem remotas/híbridas e
  compartilhando cache com "Todas" (conferir no log da rota); página
  parcialmente filtrada pagina normalmente; busca por currículo respeita a
  modalidade selecionada.
