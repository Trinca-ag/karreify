# Buscar vagas com o currículo — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Em `/jobs`, anexar o currículo (PDF/DOC/DOCX), extrair via IA a profissão + cidade/UF e disparar a busca de vagas pré-preenchida.

**Architecture:** Extração de texto client-side (`extractTextFromFile`); endpoint novo e leve `POST /api/jobs/extract-profile` (requireUser + rateLimit, SEM créditos) que chama uma função de prompt nova em `services/ai-resume.ts` via `generateCompletion`; client `extractJobProfile` em `services/jobs.ts`; na página, botão + `Modal` com `FileUpload`, e `runSearch` ganha overrides opcionais para buscar com os valores extraídos sem esperar o setState.

**Tech Stack:** Next.js 14.2 App Router, DeepSeek via `@/lib/deepseek`, componentes existentes (`Modal`, `FileUpload`, `Button`), react-hot-toast. Zero dependência nova.

**Spec:** `docs/superpowers/specs/2026-07-11-jobs-by-resume-design.md`

## Global Constraints

- Zero dependência nova; extração SEM créditos (só `rateLimit` scope `jobs-extract`, 10/60s por usuário).
- Profissão extraída: pt-BR, curta, SEM senioridade; UF = 2 letras maiúsculas válidas ou null; city string não vazia ou null.
- Limites de texto: MIN 50 / MAX 100_000 chars, com a mensagem amigável de PDF escaneado do analyze-resume (copiada verbatim na Task 1).
- Sem infra de testes: gates = `npm run type-check` + `npm run lint` + verificação manual no dev server (Task 2). `npm run build` NÃO é gate.
- Comentários pt-BR; commits pt-BR conventional com trailer `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`; mensagens de commit SEM aspas duplas internas (PowerShell 5.1 quebra).
- NESTA sessão o tool Edit está bloqueado por hook zumbi: modificar arquivos existentes via script node (substituição literal + asserção de ocorrência única, validando com `git diff`); arquivos novos via Write. Em sessão nova, Edit normal.

---

### Task 1: Extração server-side (prompt + rota)

**Files:**
- Modify: `src/services/ai-resume.ts` (append no fim do arquivo)
- Create: `src/app/api/jobs/extract-profile/route.ts`

**Interfaces:**
- Consumes: `generateCompletion(prompt: string, options?: { maxTokens?: number; temperature?: number }): Promise<string>` de `@/lib/deepseek` (já importado no ai-resume.ts); `requireUser`/`authErrorResponse` de `@/lib/auth-server`; `rateLimit`/`rateLimitResponse` de `@/lib/rate-limit`; `cleanJsonResponse` de `@/utils/helpers`.
- Produces: `extractJobProfile(resumeText: string): Promise<string>` (export de `@/services/ai-resume` — retorna o JSON cru da IA); rota `POST /api/jobs/extract-profile` recebendo `{ resumeText: string }` e respondendo `{ success: true, profession: string, city: string | null, uf: string | null }` ou `{ success: false, error, code }`.

- [ ] **Step 1: Função de prompt em `src/services/ai-resume.ts`** (append no fim)

```ts

/**
 * Extrai do texto do currículo a profissão (curta, pesquisável, sem nível
 * de senioridade) e a cidade/UF do candidato, para pré-preencher a busca de
 * vagas em /jobs. Retorna a resposta crua da IA (JSON em texto) — o parse
 * tolerante e a sanitização ficam na rota.
 */
export async function extractJobProfile(resumeText: string): Promise<string> {
  const prompt = `Leia o currículo abaixo e extraia APENAS estas informações, respondendo SOMENTE com JSON válido, sem markdown e sem texto extra:

{"profession": "cargo/profissão principal do candidato, em português, curto e pesquisável (ex.: Analista de Marketing, Desenvolvedor Backend, Enfermeira), SEM nível de senioridade (não inclua júnior/pleno/sênior/estagiário)", "city": "cidade onde o candidato mora, ou null se não constar", "uf": "sigla de 2 letras do estado brasileiro do candidato (ex.: SP), ou null se não constar"}

Currículo:
${resumeText}`;
  return generateCompletion(prompt, { maxTokens: 200, temperature: 0.1 });
}
```

- [ ] **Step 2: Rota `src/app/api/jobs/extract-profile/route.ts`** (arquivo novo, completo)

```ts
import { NextRequest, NextResponse } from "next/server";
import { extractJobProfile } from "@/services/ai-resume";
import { cleanJsonResponse } from "@/utils/helpers";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

const MAX_RESUME_LENGTH = 100_000;
const MIN_RESUME_LENGTH = 50;

/**
 * Parse tolerante do JSON da IA (mesmo padrão do analyze-resume): tenta o
 * parse direto após limpar markdown; se falhar, extrai o primeiro bloco
 * {...} via regex.
 */
function safeParseAIJson(raw: string): unknown {
  const cleaned = cleanJsonResponse(raw);
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("IA retornou resposta em formato inválido");
    }
    return JSON.parse(match[0]);
  }
}

/**
 * Extrai profissão + cidade/UF do texto de um currículo para pré-preencher
 * a busca de vagas. GRATUITO (sem créditos) — chamada de IA muito leve,
 * protegida por rate-limit. O texto não é persistido em lugar nenhum.
 */
export async function POST(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  const rl = rateLimit(ctx.uid, { scope: "jobs-extract", limit: 10, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  const { resumeText } = await request.json().catch(() => ({ resumeText: null }));

  if (!resumeText || typeof resumeText !== "string") {
    return NextResponse.json(
      { success: false, error: "Texto do currículo é obrigatório", code: "INVALID_INPUT" },
      { status: 400 }
    );
  }

  if (resumeText.trim().length < MIN_RESUME_LENGTH) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Não conseguimos extrair texto suficiente do seu arquivo. Se enviou um PDF, ele pode estar escaneado ou conter apenas imagens. Tente exportar novamente como PDF de texto, use um arquivo .docx ou envie outro currículo.",
        code: "RESUME_TEXT_TOO_SHORT",
      },
      { status: 400 }
    );
  }

  if (resumeText.length > MAX_RESUME_LENGTH) {
    return NextResponse.json(
      {
        success: false,
        error: `Currículo muito longo (máx ${MAX_RESUME_LENGTH} caracteres)`,
        code: "RESUME_TEXT_TOO_LONG",
      },
      { status: 413 }
    );
  }

  let raw: string;
  try {
    raw = await extractJobProfile(resumeText);
  } catch (aiError) {
    const aiMsg = aiError instanceof Error ? aiError.message : String(aiError);
    console.error("[jobs-extract] AI call failed:", aiMsg);
    return NextResponse.json(
      {
        success: false,
        error:
          "Nossa IA está temporariamente indisponível. Tente novamente em alguns segundos.",
        code: "AI_UNAVAILABLE",
      },
      { status: 503 }
    );
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = safeParseAIJson(raw) as Record<string, unknown>;
  } catch (parseError) {
    const parseMsg = parseError instanceof Error ? parseError.message : String(parseError);
    console.error("[jobs-extract] JSON parse failed:", parseMsg, "raw:", raw?.slice(0, 300));
    return NextResponse.json(
      {
        success: false,
        error: "Recebemos uma resposta inesperada da IA. Tente novamente.",
        code: "AI_PARSE_ERROR",
      },
      { status: 502 }
    );
  }

  const profession = typeof parsed.profession === "string" ? parsed.profession.trim() : "";
  if (!profession) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Não conseguimos identificar sua profissão no currículo. Tente outro arquivo ou busque manualmente.",
        code: "PROFESSION_NOT_FOUND",
      },
      { status: 422 }
    );
  }

  const rawUf = typeof parsed.uf === "string" ? parsed.uf.trim().toUpperCase() : "";
  const uf = /^[A-Z]{2}$/.test(rawUf) ? rawUf : null;
  const city =
    typeof parsed.city === "string" && parsed.city.trim() ? parsed.city.trim() : null;

  return NextResponse.json({ success: true, profession, city, uf });
}
```

- [ ] **Step 3: Verificar**

Run: `npm run type-check` → PASS. Run: `npm run lint` → PASS.

- [ ] **Step 4: Commit**

```bash
git add src/services/ai-resume.ts src/app/api/jobs/extract-profile/route.ts
git commit -m "feat: endpoint gratuito que extrai profissao e local do curriculo

POST /api/jobs/extract-profile: requireUser + rate-limit (10/min), sem
creditos; DeepSeek retorna profissao curta sem senioridade + cidade/UF
sanitizados. Nada e persistido.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Client + UI em /jobs

**Files:**
- Modify: `src/services/jobs.ts` (append após `searchJobs`)
- Modify: `src/app/(dashboard)/jobs/page.tsx` (imports ~3-37; estados ~115; makeCacheKey/runSearch ~158-200; botão após a action row ~430; modal antes do modal de dailyLimit ~605)

**Interfaces:**
- Consumes: rota da Task 1; `extractTextFromFile(file: File): Promise<string>` de `@/utils/file-parser`; `FileUpload` (props: `onFileSelect(file)`, `selectedFile`, `onClear()`, `disabled`); `Modal` (`isOpen`, `onClose`, `size`); `Button` (`onClick`, `disabled`, `loading`, `className`). Ícones `FileText`, `Sparkles`, `AlertTriangle` JÁ importados na página.
- Produces: `extractJobProfile(resumeText: string): Promise<JobProfileResult>` e `interface JobProfileResult { profession: string; city: string | null; uf: string | null }` em `@/services/jobs`.

- [ ] **Step 1: Client em `src/services/jobs.ts`** (append no fim)

```ts

export interface JobProfileResult {
  profession: string;
  city: string | null;
  uf: string | null;
}

/**
 * Extrai profissão/cidade/UF do texto do currículo para pré-preencher a
 * busca (gratuito; rate-limited no servidor).
 */
export async function extractJobProfile(resumeText: string): Promise<JobProfileResult> {
  const response = await authedFetch("/api/jobs/extract-profile", {
    method: "POST",
    body: JSON.stringify({ resumeText }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.success) {
    throw new Error(data?.error || "Não foi possível ler seu currículo. Tente novamente.");
  }
  return { profession: data.profession, city: data.city ?? null, uf: data.uf ?? null };
}
```

- [ ] **Step 2: Imports da página**

Adicionar aos imports existentes de `src/app/(dashboard)/jobs/page.tsx`:
- `extractJobProfile` na lista do import de `@/services/jobs` (após `JobsSearchError,`):

```ts
  extractJobProfile,
```

- Duas linhas novas após `import Modal from "@/components/ui/Modal";`:

```ts
import FileUpload from "@/components/ui/FileUpload";
import { extractTextFromFile } from "@/utils/file-parser";
```

- [ ] **Step 3: Estados + handler**

Após `  const [buyingPass, setBuyingPass] = useState<JobsPassId | null>(null);` inserir:

```ts
  // Buscar com o currículo: modal de upload + extração de profissão via IA.
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvLoading, setCvLoading] = useState(false);
  const [cvError, setCvError] = useState<string | null>(null);
```

Após o fechamento da função `handleBuyPass` (linha `  }` seguida de linha em branco antes de `  const totalPages`), inserir:

```ts
  async function handleSearchByResume() {
    if (!cvFile) return;
    setCvLoading(true);
    setCvError(null);
    try {
      const text = await extractTextFromFile(cvFile);
      const profile = await extractJobProfile(text);
      // Estados refletem na UI; a busca usa overrides para não depender do
      // setState assíncrono.
      setKeyword(profile.profession);
      setUf(profile.uf ?? "");
      setCity(profile.city ?? "");
      setCvModalOpen(false);
      setCvFile(null);
      toast.success(`Buscando vagas de ${profile.profession}`);
      await runSearch(1, {
        keyword: profile.profession,
        uf: profile.uf ?? "",
        city: profile.city ?? "",
      });
    } catch (err) {
      setCvError(
        err instanceof Error ? err.message : "Não foi possível ler seu currículo."
      );
    } finally {
      setCvLoading(false);
    }
  }
```

- [ ] **Step 4: Overrides no makeCacheKey/runSearch**

Trocar:

```ts
  function makeCacheKey(targetPage: number): string {
    return JSON.stringify({
      k: keyword.trim().toLowerCase(),
      uf,
      c: city,
      p: period,
      e: exactMatch ? 1 : 0,
      pg: targetPage,
    });
  }
```

por:

```ts
  type SearchOverrides = { keyword?: string; uf?: string; city?: string };

  function makeCacheKey(targetPage: number, kw: string, searchUf: string, searchCity: string): string {
    return JSON.stringify({
      k: kw.trim().toLowerCase(),
      uf: searchUf,
      c: searchCity,
      p: period,
      e: exactMatch ? 1 : 0,
      pg: targetPage,
    });
  }
```

Trocar:

```ts
  async function runSearch(forcedPage?: number) {
    if (!keyword.trim() || keyword.trim().length < 2) {
      toast.error("Digite ao menos 2 caracteres para buscar.");
      return;
    }
    const targetPage = forcedPage ?? 1;
    const cacheKey = makeCacheKey(targetPage);
```

por:

```ts
  async function runSearch(forcedPage?: number, overrides?: SearchOverrides) {
    // Overrides permitem buscar com valores recém-extraídos do currículo
    // sem esperar o setState assíncrono refletir nos estados do hook.
    const kw = (overrides?.keyword ?? keyword).trim();
    const searchUf = overrides?.uf ?? uf;
    const searchCity = overrides?.city ?? city;
    if (!kw || kw.length < 2) {
      toast.error("Digite ao menos 2 caracteres para buscar.");
      return;
    }
    const targetPage = forcedPage ?? 1;
    const cacheKey = makeCacheKey(targetPage, kw, searchUf, searchCity);
```

Trocar:

```ts
      const result = await searchJobs({
        keyword: keyword.trim(),
        uf: uf || undefined,
        city: city || undefined,
        period,
        exactMatch,
        page: targetPage,
      });
```

por:

```ts
      const result = await searchJobs({
        keyword: kw,
        uf: searchUf || undefined,
        city: searchCity || undefined,
        period,
        exactMatch,
        page: targetPage,
      });
```

(A paginação continua chamando `runSearch(p)` sem overrides — usa os estados, comportamento idêntico ao atual.)

- [ ] **Step 5: Botão no card Filtros**

Logo após o fechamento da action row (âncora única):

```tsx
                <Search className="w-4 h-4 mr-1.5" /> Buscar vagas
              </Button>
            </div>
          </div>
```

inserir:

```tsx
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-[11px] text-gray-500 uppercase tracking-wider">ou</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>
          <button
            onClick={() => setCvModalOpen(true)}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-primary-500/30 bg-primary-500/10 hover:bg-primary-500/15 text-primary-300 text-sm font-medium transition-all disabled:opacity-40"
          >
            <FileText className="w-4 h-4" /> Buscar com meu currículo
            <Sparkles className="w-3.5 h-3.5" />
          </button>
```

- [ ] **Step 6: Modal de upload**

Antes do modal de daily limit (âncora única `      <Modal\n        isOpen={dailyLimitOpen}`), inserir:

```tsx
      <Modal
        isOpen={cvModalOpen}
        onClose={() => !cvLoading && setCvModalOpen(false)}
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center shadow-lg shadow-black/20">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <h3 className="mt-3 text-lg font-semibold text-white font-heading">
              Buscar com meu currículo
            </h3>
            <p className="mt-1 text-sm text-gray-400 leading-relaxed">
              Anexe seu currículo (PDF ou Word): a IA identifica sua profissão
              e localização e busca as vagas para você. Grátis — a busca conta
              na sua cota normal.
            </p>
          </div>
          <FileUpload
            onFileSelect={(f) => {
              setCvFile(f);
              setCvError(null);
            }}
            selectedFile={cvFile}
            onClear={() => {
              setCvFile(null);
              setCvError(null);
            }}
            disabled={cvLoading}
          />
          {cvError && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{cvError}</span>
            </div>
          )}
          <Button
            onClick={handleSearchByResume}
            disabled={!cvFile || cvLoading}
            loading={cvLoading}
            className="w-full glow-blue"
          >
            {cvLoading ? "Lendo seu currículo..." : "Identificar profissão e buscar"}
          </Button>
        </div>
      </Modal>

```

- [ ] **Step 7: Verificar**

Run: `npm run type-check` → PASS. Run: `npm run lint` → PASS.

- [ ] **Step 8: Verificação manual no dev server (checklist da spec)**

Run: `npm run dev`, abrir `/jobs` logado:
1. Botão "Buscar com meu currículo" abaixo do "Buscar vagas", com divisor "ou".
2. Modal abre; anexar um PDF real de currículo → "Lendo seu currículo..." → modal fecha, keyword/UF/cidade preenchidos, busca dispara, toast com a profissão.
3. Resultados coerentes com a profissão; cidade aparece selecionada no filtro (o select já lida com valor fora da lista carregada do IBGE).
4. CV sem cidade → busca nacional só por profissão.
5. PDF escaneado (só imagem) → mensagem amigável NO modal, retry possível.
6. DOCX funciona; arquivo .txt → "Formato de arquivo não suportado" no modal.
7. Estourar a cota grátis → modal de passes abre (fluxo existente do runSearch).
8. 11 uploads em 1 min → erro de rate limit exibido no modal.
9. Console sem erros.

Expected: 9/9 (textos/estilos finos ajustáveis a olho).

- [ ] **Step 9: Commit**

```bash
git add src/services/jobs.ts "src/app/(dashboard)/jobs/page.tsx"
git commit -m "feat: buscar vagas anexando o curriculo em /jobs

Botao + modal com upload: extrai texto no browser, IA identifica
profissao e cidade/UF (gratis, rate-limited) e a busca dispara
pre-preenchida; runSearch ganha overrides para nao depender do setState.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
