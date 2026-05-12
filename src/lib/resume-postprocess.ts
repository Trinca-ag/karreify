import type { ResumeSchema } from "./resume-schema";

/**
 * Pipeline de pós-processamento que roda APÓS a IA retornar o JSON
 * e ANTES de gerar o PDF. Corrige problemas que a IA consistentemente ignora.
 *
 * Ordem: corrections → clichés → languages → experience time → verb person → links → quality flags
 */

export interface PostProcessResult {
  schema: ResumeSchema;
  corrections: string[];
  qualityFlags: string[];
}

export function postProcessResume(
  schema: ResumeSchema,
  originalText: string | null,
): PostProcessResult {
  const corrections: string[] = [];
  let result: ResumeSchema = JSON.parse(JSON.stringify(schema));

  // 1. Correções ortográficas forçadas (URL-safe)
  const beforeCorrections = JSON.stringify(result);
  result = applyForcedCorrections(result);
  if (JSON.stringify(result) !== beforeCorrections) {
    corrections.push("Correções ortográficas aplicadas (nomes de tecnologias/empresas)");
  }

  // 2. Remoção de clichês do resumo
  const beforeSummary = result.basics?.summary || "";
  result = removeClichesFromSummary(result);
  if (result.basics?.summary !== beforeSummary) {
    corrections.push("Frase clichê removida do resumo profissional");
  }

  // 3. Garantir nível de idiomas (pular no modo scratch)
  if (originalText) {
    const beforeLangs = JSON.stringify(result.languages);
    result = enforceLanguageLevels(result, originalText);
    if (JSON.stringify(result.languages) !== beforeLangs) {
      corrections.push("Nível de idioma corrigido para corresponder ao original");
    }
  }

  // 4. Validar tempo de experiência
  const beforeExp = result.basics?.summary || "";
  result = validateExperienceTime(result);
  if (result.basics?.summary !== beforeExp) {
    corrections.push("Tempo de experiência ajustado para valor factual");
  }

  // 4.25. Normalizar "X+" → "mais de X" em textos narrativos
  const beforePlus = JSON.stringify([
    result.basics.summary,
    ...result.work.flatMap(w => w.highlights),
    ...result.projects.flatMap(p => [p.description, ...p.highlights]),
  ]);
  result = normalizePlusToText(result);
  const afterPlus = JSON.stringify([
    result.basics.summary,
    ...result.work.flatMap(w => w.highlights),
    ...result.projects.flatMap(p => [p.description, ...p.highlights]),
  ]);
  if (afterPlus !== beforePlus) {
    corrections.push('"X+" substituído por "mais de X" nos textos');
  }

  // 4.5. Consistência de pessoa verbal (3ª → 1ª pessoa)
  const beforeVerbs = JSON.stringify([
    result.basics.summary,
    ...result.work.flatMap(w => w.highlights),
    ...result.projects.flatMap(p => [p.description, ...p.highlights]),
  ]);
  result = fixVerbPersonConsistency(result);
  const afterVerbs = JSON.stringify([
    result.basics.summary,
    ...result.work.flatMap(w => w.highlights),
    ...result.projects.flatMap(p => [p.description, ...p.highlights]),
  ]);
  if (afterVerbs !== beforeVerbs) {
    corrections.push("Verbos na 3ª pessoa corrigidos para 1ª pessoa");
  }

  // 5. Restaurar links perdidos (pular no modo scratch)
  if (originalText) {
    const beforeLinks = `${result.basics.linkedin}|${result.basics.github}`;
    result = restoreLinks(result, originalText);
    const afterLinks = `${result.basics.linkedin}|${result.basics.github}`;
    if (afterLinks !== beforeLinks) {
      corrections.push("LinkedIn/GitHub restaurados a partir do texto original");
    }
  }

  // 6. Quality flags
  const qualityFlags = generateQualityFlags(result);

  return { schema: result, corrections, qualityFlags };
}

// ── 1. Correções ortográficas forçadas (URL-safe) ─────────

const FORCED_CORRECTIONS: Record<string, string> = {
  "PROPROFISSÃO": "ProProfissão",
  "PROPROFISSAO": "ProProfissão",
  "proprofissão": "ProProfissão",
  "proprofissao": "ProProfissão",
  "Proprofissão": "ProProfissão",
  "Proprofissao": "ProProfissão",
  "javasript": "JavaScript",
  "Javascipt": "JavaScript",
  "javacript": "JavaScript",
  "Javacript": "JavaScript",
  "javascrip": "JavaScript",
  "Javascrip": "JavaScript",
  "react js": "React.js",
  "React js": "React.js",
  "node js": "Node.js",
  "Node js": "Node.js",
  "Wordpress": "WordPress",
  "wordpress": "WordPress",
  "WORDPRESS": "WordPress",
  "Github": "GitHub",
  "github": "GitHub",
  "GITHUB": "GitHub",
  "Linkedin": "LinkedIn",
  "linkedin": "LinkedIn",
  "LINKEDIN": "LinkedIn",
  "MYSQL": "MySQL",
  "Mysql": "MySQL",
  "mysql": "MySQL",
  "Postgresql": "PostgreSQL",
  "postgresql": "PostgreSQL",
  "POSTGRESQL": "PostgreSQL",
  "Mongodb": "MongoDB",
  "mongodb": "MongoDB",
  "MONGODB": "MongoDB",
  "Typescript": "TypeScript",
  "typescript": "TypeScript",
  "TYPESCRIPT": "TypeScript",
  "Javascript": "JavaScript",
  "javascript": "JavaScript",
  "JAVASCRIPT": "JavaScript",
  "Tailwindcss": "Tailwind CSS",
  "tailwindcss": "Tailwind CSS",
  "Nextjs": "Next.js",
  "nextjs": "Next.js",
  "Nodejs": "Node.js",
  "nodejs": "Node.js",
  "Reactjs": "React.js",
  "reactjs": "React.js",
  "Vuejs": "Vue.js",
  "vuejs": "Vue.js",
  "Nestjs": "NestJS",
  "nestjs": "NestJS",
  "Expressjs": "Express.js",
  "expressjs": "Express.js",
  "Angularjs": "AngularJS",
  "angularjs": "AngularJS",
  "Graphql": "GraphQL",
  "graphql": "GraphQL",
  "GRAPHQL": "GraphQL",
  "Dynamodb": "DynamoDB",
  "dynamodb": "DynamoDB",
  "Redis": "Redis",
  "Fastapi": "FastAPI",
  "fastapi": "FastAPI",
};

/** Apply corrections to a single string. */
function correctString(text: string): string {
  if (!text) return text;
  let result = text;
  for (const [wrong, right] of Object.entries(FORCED_CORRECTIONS)) {
    const escaped = wrong.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    result = result.replace(new RegExp(escaped, "g"), right);
  }
  return result;
}

/** Apply corrections to text fields only — skip URLs, emails, dates. */
function applyForcedCorrections(schema: ResumeSchema): ResumeSchema {
  const r: ResumeSchema = JSON.parse(JSON.stringify(schema));

  // basics: only text fields, skip email/phone/location/linkedin/github/website
  r.basics.name = correctString(r.basics.name);
  r.basics.label = correctString(r.basics.label);
  r.basics.summary = correctString(r.basics.summary);

  for (const w of r.work) {
    w.company = correctString(w.company);
    w.position = correctString(w.position);
    w.highlights = w.highlights.map(correctString);
  }

  for (const e of r.education) {
    e.institution = correctString(e.institution);
    e.area = correctString(e.area);
    e.studyType = correctString(e.studyType);
  }

  for (const s of r.skills) {
    s.name = correctString(s.name);
    s.category = correctString(s.category);
  }

  for (const p of r.projects) {
    p.name = correctString(p.name);
    p.description = correctString(p.description);
    p.highlights = p.highlights.map(correctString);
    p.technologies = p.technologies.map(correctString);
    // skip: url, repository
  }

  for (const c of r.certifications) {
    c.name = correctString(c.name);
    c.issuer = correctString(c.issuer);
    // skip: url, date
  }

  for (const v of r.volunteer) {
    v.organization = correctString(v.organization);
    v.role = correctString(v.role);
    v.summary = correctString(v.summary);
  }

  return r;
}

// ── 2. Remoção de clichês ─────────────────────────────────
//
// Sentence-level matching: summary is split into sentences, each tested
// against the patterns below. Matched sentences are removed entirely.
//
// MUST catch:
//   "Busco contribuir com processos em um novo desafio profissional"
//   "Profissional dedicado e proativo"
//   "Apaixonado por tecnologia e inovação"
//   "Busco consolidar minha carreira na área de TI"
//   "Em busca de novos desafios e oportunidades"
//   "Orientado a resultados com espírito de equipe"
//   "Sempre em busca de aprendizado contínuo"
//
// Must NOT catch (false positives):
//   "Busco a vaga de Desenvolvedor Full Stack"
//   "Contribuí para redução de custos em 30%"
//   "Atuei na busca e seleção de candidatos"

const CLICHE_PATTERNS: RegExp[] = [
  // "Busco" + ... + desafio/oportunidade/crescimento/contribuir
  /busco\s+.{0,50}(desafios?|oportunidades?|crescimento|contribuir)/i,
  // "Busco consolidar/desenvolver/expandir" + career terms
  /busco\s+(consolidar|desenvolver|expandir|alavancar)\s+(minha\s+)?(carreira|trajetória|jornada)/i,
  // "Em busca de" / "Em constante busca" / "Sempre em busca"
  /(em\s+constante\s+busca|sempre\s+em\s+busca|em\s+busca\s+de\s+(novos?\s+)?(desafios?|oportunidades?|aprendizado))/i,
  // "Profissional dedicado/proativo/comprometido/motivado/apaixonado/dinâmico"
  /profissional\s+(dedicad[oa]|proativ[oa]|comprometid[oa]|motivad[oa]|apaixonad[oa]|din[âa]mic[oa])/i,
  // "Apaixonado/Entusiasta/Fascinado por"
  /(apaixonad[oa]|entusiast[oa]|fascinad[oa])\s+por\s/i,
  // "Orientado a/para resultados"
  /orientad[oa]\s+(a|para)\s+resultados/i,
  // "Sede de aprender/conhecimento/crescimento"
  /sede\s+de\s+(aprender|conhecimento|crescimento)/i,
  // "Espírito de equipe/liderança/colaboração"
  /esp[ií]rito\s+de\s+(equipe|lideran[çc]a|colabora[çc][ãa]o)/i,
  // "Pensamento crítico/analítico/estratégico"
  /pensamento\s+(cr[ií]tico|anal[ií]tico|estrat[eé]gico)/i,
  // "Dinâmico e proativo" / "Proativo e dinâmico" (adjective chains)
  /(din[âa]mic[oa]|proativ[oa])\s+e\s+(din[âa]mic[oa]|proativ[oa]|criativ[oa]|determinad[oa]|dedicad[oa])/i,
  // "Comprometido com a excelência/qualidade"
  /comprometid[oa]\s+com\s+(a\s+)?(excel[êe]ncia|qualidade)/i,
  // "Movido por desafios/resultados/inovação"
  /movid[oa]\s+por\s+(desafios?|resultados|inova[çc][ãa]o)/i,
  // "Desejo contribuir/crescer/evoluir/me desenvolver"
  /desejo\s+(contribuir|crescer|evoluir|me\s+desenvolver)/i,
  // "Sou um(a) profissional" (self-referential filler)
  /sou\s+uma?\s+profissional/i,
  // "Aberto a novos desafios/oportunidades"
  /abert[oa]\s+a\s+novos?\s+(desafios?|oportunidades?)/i,
  // "Disposto a aprender/contribuir/crescer"
  /dispost[oa]\s+a\s+(aprender|contribuir|crescer)/i,
  // "Busca consolidar sua/minha carreira"
  /busca\s+consolidar\s+(sua|minha)\s+(carreira|trajetória)/i,
  // "Viso/Almejo contribuir/crescer"
  /(viso|almejo)\s+(contribuir|crescer|evoluir)/i,
  // "Tenho paixão por" / "Minha paixão é"
  /(tenho|minha)\s+paix[ãa]o\s+(por|[eé])/i,
  // "Focado em resultados/excelência/entregas"
  /focad[oa]\s+em\s+(resultados|excel[êe]ncia|entrega)/i,
];

function removeClichesFromSummary(schema: ResumeSchema): ResumeSchema {
  if (!schema.basics?.summary) return schema;

  const original = schema.basics.summary;

  // Split into sentences (split after ". ")
  const sentences = original.split(/(?<=\.)\s+/);

  const filtered = sentences.filter((sentence) => {
    const trimmed = sentence.trim();
    if (!trimmed) return false;
    return !CLICHE_PATTERNS.some((pattern) => {
      pattern.lastIndex = 0;
      return pattern.test(trimmed);
    });
  });

  let summary = filtered.join(" ").trim();

  // Clean up artifacts
  summary = summary
    .replace(/\.{2,}/g, ".")            // collapse double+ dots
    .replace(/,\s*\./g, ".")            // fix ", ." → "."
    .replace(/\.\s*,/g, ".")            // fix ". ," → "."
    .replace(/\s{2,}/g, " ")            // collapse double+ spaces
    .replace(/^\.\s*/, "")              // remove leading dot
    .trim();

  // Capitalize first letter if needed
  if (summary.length > 0 && /^[a-záàâãéèêíïóôõöúçñ]/.test(summary)) {
    summary = summary.charAt(0).toUpperCase() + summary.slice(1);
  }

  // Ensure ends with period
  if (summary.length > 0 && !summary.endsWith(".")) {
    summary += ".";
  }

  // Don't apply if summary became too short
  if (summary.length < 80) return schema;

  return { ...schema, basics: { ...schema.basics, summary } };
}

// ── 3. Enforce language levels ────────────────────────────

const FLUENCY_HIERARCHY: Record<string, number> = {
  "nativo": 5, "nativa": 5,
  "fluente": 4,
  "avançado": 3, "avancado": 3,
  "intermediário": 2, "intermediario": 2,
  "básico": 1, "basico": 1,
};

function normalizeFluency(fluency: string): string {
  return fluency
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function capitalizeLevel(level: string): string {
  const map: Record<string, string> = {
    "nativo": "Nativo", "nativa": "Nativo",
    "fluente": "Fluente",
    "avançado": "Avançado", "avancado": "Avançado",
    "intermediário": "Intermediário", "intermediario": "Intermediário",
    "básico": "Básico", "basico": "Básico",
  };
  return map[level.toLowerCase()] || level.charAt(0).toUpperCase() + level.slice(1);
}

interface ExtractedLang {
  language: string;
  level: string;
  raw: string;
}

function extractLanguagesFromInput(text: string): ExtractedLang[] {
  const langs: ExtractedLang[] = [];
  const patterns: { name: string; regex: RegExp }[] = [
    { name: "Inglês", regex: /ingl[eê]s\s*[\(\-–:\s]+([^)\n,]+)/gi },
    { name: "Espanhol", regex: /espanhol\s*[\(\-–:\s]+([^)\n,]+)/gi },
    { name: "Francês", regex: /franc[eê]s\s*[\(\-–:\s]+([^)\n,]+)/gi },
    { name: "Alemão", regex: /alem[aã]o\s*[\(\-–:\s]+([^)\n,]+)/gi },
    { name: "Italiano", regex: /italiano\s*[\(\-–:\s]+([^)\n,]+)/gi },
    { name: "Português", regex: /portugu[eê]s\s*[\(\-–:\s]+([^)\n,]+)/gi },
    { name: "Mandarim", regex: /mandarim\s*[\(\-–:\s]+([^)\n,]+)/gi },
    { name: "Japonês", regex: /japon[eê]s\s*[\(\-–:\s]+([^)\n,]+)/gi },
  ];

  for (const { name, regex } of patterns) {
    regex.lastIndex = 0;
    const match = regex.exec(text);
    if (match) {
      const rawLevel = match[1].replace(/\).*$/, "").trim();
      const levelMatch = rawLevel.match(
        /\b(nativ[oa]|fluente|avan[cç]ado|intermedi[aá]rio|b[aá]sico)\b/i
      );
      if (levelMatch) {
        langs.push({ language: name, level: levelMatch[1].toLowerCase(), raw: rawLevel });
      }
    }
  }

  return langs;
}

function enforceLanguageLevels(schema: ResumeSchema, originalText: string): ResumeSchema {
  if (!schema.languages?.length || !originalText) return schema;

  const inputLangs = extractLanguagesFromInput(originalText);
  if (inputLangs.length === 0) return schema;

  let changed = false;
  const correctedLanguages = [...schema.languages];

  for (const inputLang of inputLangs) {
    const idx = correctedLanguages.findIndex(
      (l) => l.language.toLowerCase().includes(inputLang.language.toLowerCase().slice(0, 4))
    );
    if (idx === -1) continue;

    const inputNorm = normalizeFluency(inputLang.level);
    const outputNorm = normalizeFluency(correctedLanguages[idx].fluency);

    const inputScore = FLUENCY_HIERARCHY[inputNorm] || 0;
    const outputScore = FLUENCY_HIERARCHY[outputNorm] || 0;

    if (inputScore > 0 && outputScore > 0 && outputScore < inputScore) {
      const qualifierMatch = inputLang.raw.match(
        /\b(leitura\s+t[eé]cnica|conversa[cç][aã]o|escrita|t[eé]cnico)\b/i
      );
      const qualifier = qualifierMatch ? qualifierMatch[1] : "";
      const level = capitalizeLevel(inputLang.level);
      correctedLanguages[idx] = {
        ...correctedLanguages[idx],
        fluency: qualifier ? `${level} (${qualifier})` : level,
      };
      changed = true;
    }
  }

  if (!changed) return schema;
  return { ...schema, languages: correctedLanguages };
}

// ── 4. Validate experience time ───────────────────────────

function parseResumeDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  if (["atual", "present", "current"].includes(dateStr.toLowerCase())) return new Date();

  const isoMatch = dateStr.match(/^(\d{4})-(\d{2})$/);
  if (isoMatch) return new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1);

  const monthMap: Record<string, number> = {
    "jan": 0, "fev": 1, "mar": 2, "abr": 3, "mai": 4, "jun": 5,
    "jul": 6, "ago": 7, "set": 8, "out": 9, "nov": 10, "dez": 11,
  };
  const parts = dateStr.toLowerCase().split(/[\s\/\-]+/);
  for (const [abbr, month] of Object.entries(monthMap)) {
    if (parts.some((p) => p.startsWith(abbr))) {
      const year = parts.find((p) => /^\d{4}$/.test(p));
      if (year) return new Date(parseInt(year), month);
    }
  }

  const numMatch = dateStr.match(/(\d{1,2})\s*[\/\-]\s*(\d{4})/);
  if (numMatch) return new Date(parseInt(numMatch[2]), parseInt(numMatch[1]) - 1);

  return null;
}

function validateExperienceTime(schema: ResumeSchema): ResumeSchema {
  if (!schema.basics?.summary || !schema.work?.length) return schema;

  const startDates = schema.work
    .map((w) => parseResumeDate(w.startDate))
    .filter((d): d is Date => d !== null);

  if (startDates.length === 0) return schema;

  const earliest = new Date(Math.min(...startDates.map((d) => d.getTime())));
  const now = new Date();
  const months =
    (now.getFullYear() - earliest.getFullYear()) * 12 +
    (now.getMonth() - earliest.getMonth());

  let correctLabel: string;
  if (months < 12) correctLabel = `${months} meses`;
  else if (months < 24) correctLabel = "mais de 1 ano";
  else if (months < 36) correctLabel = "mais de 2 anos";
  else correctLabel = `mais de ${Math.floor(months / 12)} anos`;

  let summary = schema.basics.summary;
  const timeClaimRegex = /(?:mais\s+de\s+)?(\d+)\+?\s*anos?\s+de\s+experi[eê]ncia/gi;
  const match = timeClaimRegex.exec(summary);

  if (match) {
    const claimedMonths = parseInt(match[1]) * 12;

    // If claimed exceeds actual by more than 6 months, correct
    if (claimedMonths > months + 6) {
      timeClaimRegex.lastIndex = 0;
      summary = summary.replace(timeClaimRegex, `${correctLabel} de experiência`);
      return { ...schema, basics: { ...schema.basics, summary } };
    }
  }

  return schema;
}

// ── 4.25. Normalize "X+" → "mais de X" ──────────────────
// Matches a number followed by "+" that acts as a quantity indicator (e.g., "50+ clientes",
// "10+ projetos", "5.000+ usuários"). Skips technical tokens like "C++", "ES6+", "A+" because
// they don't have a word boundary before the digits and aren't followed by whitespace/end.

const PLUS_QUANTITY_REGEX = /\b(\d+(?:[.,]\d+)*)\+(?=\s|$|[^\w+])/g;

function replacePlusInText(text: string): string {
  return text.replace(PLUS_QUANTITY_REGEX, "mais de $1");
}

function normalizePlusToText(schema: ResumeSchema): ResumeSchema {
  const result: ResumeSchema = JSON.parse(JSON.stringify(schema));
  if (result.basics?.summary) {
    result.basics.summary = replacePlusInText(result.basics.summary);
  }
  for (const w of result.work || []) {
    w.highlights = (w.highlights || []).map(replacePlusInText);
  }
  for (const p of result.projects || []) {
    if (p.description) p.description = replacePlusInText(p.description);
    p.highlights = (p.highlights || []).map(replacePlusInText);
  }
  return result;
}

// ── 4.5. Fix verb person consistency (3rd → 1st) ────────

const THIRD_TO_FIRST_PERSON: Record<string, string> = {
  // Pretérito perfeito (3ª → 1ª)
  "Liderou": "Liderei",
  "Desenvolveu": "Desenvolvi",
  "Implementou": "Implementei",
  "Gerenciou": "Gerenciei",
  "Coordenou": "Coordenei",
  "Criou": "Criei",
  "Reduziu": "Reduzi",
  "Aumentou": "Aumentei",
  "Otimizou": "Otimizei",
  "Entregou": "Entreguei",
  "Contribuiu": "Contribuí",
  "Participou": "Participei",
  "Atuou": "Atuei",
  "Realizou": "Realizei",
  "Colaborou": "Colaborei",
  "Configurou": "Configurei",
  "Migrou": "Migrei",
  "Refatorou": "Refatorei",
  "Estruturou": "Estruturei",
  "Automatizou": "Automatizei",
  "Processou": "Processei",
  // Presente do indicativo (3ª → 1ª)
  "Lidera": "Lidero",
  "Desenvolve": "Desenvolvo",
  "Implementa": "Implemento",
  "Gerencia": "Gerencio",
  "Coordena": "Coordeno",
  "Cria": "Crio",
  "Reduz": "Reduzo",
  "Aumenta": "Aumento",
  "Otimiza": "Otimizo",
  "Entrega": "Entrego",
  "Contribui": "Contribuo",
  "Participa": "Participo",
  "Atua": "Atuo",
  "Realiza": "Realizo",
  "Colabora": "Colaboro",
  "Configura": "Configuro",
  "Automatiza": "Automatizo",
  "Processa": "Processo",
  "Estrutura": "Estruturo",
};

/**
 * Fix verb at start of string or after sentence boundary (". ").
 * Only matches at these positions to avoid false positives mid-sentence.
 */
function fixVerbInText(text: string): string {
  if (!text) return text;
  let result = text;
  for (const [third, first] of Object.entries(THIRD_TO_FIRST_PERSON)) {
    // At start of string
    result = result.replace(new RegExp(`^${third}\\b`), first);
    // After sentence boundary (". ")
    result = result.replace(new RegExp(`(\\.\\s+)${third}\\b`, "g"), `$1${first}`);
  }
  return result;
}

function fixVerbPersonConsistency(schema: ResumeSchema): ResumeSchema {
  const r: ResumeSchema = JSON.parse(JSON.stringify(schema));

  // Summary
  r.basics.summary = fixVerbInText(r.basics.summary);

  // Work highlights
  for (const w of r.work) {
    w.highlights = w.highlights.map(fixVerbInText);
  }

  // Project descriptions and highlights
  for (const p of r.projects) {
    p.description = fixVerbInText(p.description);
    p.highlights = p.highlights.map(fixVerbInText);
  }

  return r;
}

// ── 5. Restore lost links ─────────────────────────────────

function restoreLinks(schema: ResumeSchema, originalText: string): ResumeSchema {
  const result = { ...schema, basics: { ...schema.basics } };

  if (!result.basics.linkedin) {
    const linkedinMatch = originalText.match(
      /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w\-%.]+\/?/i
    );
    if (linkedinMatch) {
      let url = linkedinMatch[0];
      if (!url.startsWith("http")) url = "https://" + url;
      result.basics.linkedin = url.replace(/\/+$/, "");
    }
  }

  if (!result.basics.github) {
    const githubMatch = originalText.match(
      /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w\-%.]+\/?/i
    );
    if (githubMatch) {
      let url = githubMatch[0];
      if (!url.startsWith("http")) url = "https://" + url;
      result.basics.github = url.replace(/\/+$/, "");
    }
  }

  return result;
}

// ── 6. Quality flags ──────────────────────────────────────

function generateQualityFlags(schema: ResumeSchema): string[] {
  const flags: string[] = [];

  // Summary without metrics
  if (schema.basics.summary && !/\d/.test(schema.basics.summary)) {
    flags.push("Resumo profissional sem métricas ou números");
  }

  // Work entries with <3 bullets
  for (const w of schema.work) {
    if (w.highlights.length < 3) {
      flags.push(`"${w.position || w.company}" com menos de 3 bullets`);
    }
  }

  // Short highlights (<40 chars)
  let shortCount = 0;
  for (const w of schema.work) {
    for (const h of w.highlights) {
      if (h.length < 40) shortCount++;
    }
  }
  if (shortCount > 0) {
    flags.push(`${shortCount} bullet(s) com menos de 40 caracteres`);
  }

  // No education
  if (schema.education.length === 0) {
    flags.push("Formação acadêmica ausente");
  }

  // No languages
  if (schema.languages.length === 0) {
    flags.push("Seção de idiomas ausente");
  }

  // Highlights without result indicators
  let totalHL = 0;
  let hlWithResult = 0;
  const resultPattern = /(\bresultando\b|\bgerando\b|\baumentando\b|\breduzindo\b|\bentregando\b|\bcontribuindo\b|\bmelhorando\b|\botimizando\b|\d)/i;
  for (const w of schema.work) {
    for (const h of w.highlights) {
      totalHL++;
      if (resultPattern.test(h)) hlWithResult++;
    }
  }
  if (totalHL > 0 && hlWithResult / totalHL < 0.3) {
    flags.push(`Apenas ${Math.round((hlWithResult / totalHL) * 100)}% dos bullets contêm indicadores de resultado`);
  }

  return flags;
}
