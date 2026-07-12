# Design — Buscar vagas com o currículo (/jobs)

- **Data:** 2026-07-11
- **Status:** aprovado no brainstorm
- **Escopo:** botão + modal em `/jobs`, endpoint leve de extração, função de
  prompt e client. Zero dependência nova.

## Objetivo

Em `/jobs`, o usuário anexa o currículo (PDF/DOC/DOCX); extraímos via IA a
profissão (e cidade/UF, quando presentes) e disparamos a busca de vagas já
preenchida — busca regionalizada com um clique.

## Decisões travadas no brainstorm

1. **Extração gratuita** (sem créditos) — alinhada ao "busca de vagas sem
   custo"; protegida por `rateLimit` (scope `jobs-extract`, 10/min/usuário).
   A busca disparada conta na cota normal (3/24h grátis ou passe) — o
   `runSearch()` existente já abre o modal de passes em `FREE_LIMIT_REACHED`.
2. **Extrai profissão + cidade/UF** na mesma chamada de IA. Profissão curta
   e pesquisável, SEM senioridade ("Analista de Marketing", não "Pleno III");
   UF em 2 letras maiúsculas ou null; cidade ou null.
3. **Endpoint novo e leve** (não reusar analyze/create-resume: caros, cobram
   créditos, latência alta; heurística sem IA descartada por fragilidade).
4. Extração de texto do arquivo é **client-side** (`extractTextFromFile` de
   `@/utils/file-parser`, pdfjs/mammoth lazy) — servidor só recebe texto.

## Arquitetura atual (mapeada)

- Página `/jobs` (`src/app/(dashboard)/jobs/page.tsx`, 952 linhas): estados
  da busca vêm de `useJobsCache()` (keyword/uf/city/period/exactMatch/page/
  jobs/...); `runSearch(forcedPage?)` valida keyword (mín. 2 chars), consulta
  cache local, chama `searchJobs({keyword, uf, city, period, exactMatch,
  page})` de `@/services/jobs` e trata `JobsSearchError` com códigos
  `FREE_LIMIT_REACHED` (abre modal de passes) e `DAILY_LIMIT_REACHED`.
  Card "Filtros" tem o input de palavra-chave (~linha 307) + período + UF +
  cidade (`fetchCitiesByUF` carrega cidades quando UF muda).
- Rotas de IA irmãs (padrão a seguir — ver `analyze-resume/route.ts`):
  `requireUser` + `authErrorResponse`, `rateLimit` + `rateLimitResponse`,
  limites de texto `MIN 50` / `MAX 100_000` com mensagem amigável para PDF
  escaneado, parse tolerante do JSON da IA (direto → regex `{...}`).
- IA: `generateCompletion` de `@/lib/deepseek`; prompts centralizados em
  `src/services/ai-resume.ts`; `cleanJsonResponse` em `@/utils/helpers`.
- Upload: componente `FileUpload` (usado no create-resume) + Modal genérico
  `@/components/ui/Modal`.

## Componentes e fluxo

1. **`src/services/ai-resume.ts`** — nova `extractJobProfile(resumeText:
   string)` que monta o prompt e chama `generateCompletion`. Prompt: retornar
   SOMENTE JSON `{"profession": string, "city": string|null, "uf":
   string|null}`; profissão em pt-BR, curta, sem senioridade; UF sigla de 2
   letras; null quando ausente do currículo.
2. **`src/app/api/jobs/extract-profile/route.ts`** (novo) — POST
   `{ resumeText }`: requireUser → rateLimit(`jobs-extract`, 10/60s) →
   valida tamanho (50..100k, mensagens do analyze) → `extractJobProfile` →
   parse tolerante → sanitiza (profession string não vazia obrigatória;
   uf válida só se 2 letras A-Z; city string não vazia) → responde
   `{ success: true, profession, city, uf }`. Falha de IA → 503
   `AI_UNAVAILABLE`; parse → 502 `AI_PARSE_ERROR`. SEM créditos.
3. **`src/services/jobs.ts`** — client `extractJobProfile(resumeText):
   Promise<{ profession: string; city: string | null; uf: string | null }>`
   via `authedFetch`, lançando `Error` com a mensagem da API em falha.
4. **`src/app/(dashboard)/jobs/page.tsx`** — botão "Buscar com meu
   currículo" no card Filtros (ao lado/abaixo da palavra-chave); `Modal` com
   `FileUpload` (accept .pdf/.doc/.docx) + estado de progresso ("Lendo seu
   currículo…"); handler: `extractTextFromFile` → `extractJobProfile` →
   `setKeyword(profession)`, `setUf(uf ?? "")`, `setCity(city ?? "")` →
   fecha modal → toast "Buscando vagas de {profession}" → `runSearch()`.
   Nota: `runSearch` lê os estados do hook e `setState` é assíncrono —
   então `runSearch` ganha um parâmetro opcional de overrides
   (`{ keyword, uf, city }`) usado na validação, na chave de cache e na
   chamada `searchJobs`; o handler seta os estados (para a UI refletir) e
   chama `runSearch(1, overrides)` com os valores extraídos. Menor mudança
   possível preservando cache e tratamento de erros existentes.
   Erros ficam NO modal (texto curto/escaneado, IA fora, rate limit) com
   retry fácil; a página nunca quebra.

## Fora de escopo

- Usar currículos já salvos em Meus Arquivos como fonte (só upload).
- Guardar o texto do currículo (nada é persistido; o texto morre na request).
- Matching/score de vagas contra o CV (é só profissão → busca).

## Verificação

- `npm run type-check` e `npm run lint`.
- Dev server (logado): PDF real → keyword/UF/cidade preenchidos + busca
  regionalizada dispara; CV sem cidade → busca nacional por profissão; PDF
  escaneado → mensagem amigável no modal; DOCX funciona; estourar cota grátis
  → modal de passes (fluxo existente); rate limit da extração → toast.
