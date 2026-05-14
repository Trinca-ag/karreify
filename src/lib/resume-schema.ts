// ── Resume Schema (JSON Resume inspired) ────────────────
// Version is used in cache keys to invalidate when schema changes.

export const SCHEMA_VERSION = "v3";

export interface ResumeSchema {
  basics: {
    name: string;
    label: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    linkedin: string;
    github: string;
    website: string;
  };
  work: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    location: string;
    highlights: string[];
  }[];
  education: {
    institution: string;
    area: string;
    studyType: string;
    startDate: string;
    endDate: string;
    status: string;
  }[];
  skills: {
    category: string;
    name: string;
    level: string;
  }[];
  projects: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    highlights: string[];
    technologies: string[];
    url: string;
    repository: string;
  }[];
  languages: {
    language: string;
    fluency: string;
  }[];
  certifications: {
    name: string;
    issuer: string;
    date: string;
    url: string;
  }[];
  volunteer: {
    organization: string;
    role: string;
    startDate: string;
    endDate: string;
    summary: string;
  }[];
}

export interface GenerationNotes {
  inferredData: string[];
  missingImpactData: string[];
  warnings: string[];
  candidateLevel: string;
  targetJobDetected: string;
}

// ── Validation ──────────────────────────────────────────

interface ValidationResult {
  valid: boolean;
  errors: string[];
  normalized: ResumeSchema | null;
}

export function validateResumeSchema(data: unknown): ValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Resultado não é um objeto válido"], normalized: null };
  }

  const d = data as Record<string, unknown>;

  // basics
  if (!d.basics || typeof d.basics !== "object") {
    errors.push("Campo 'basics' ausente ou inválido");
  } else {
    const b = d.basics as Record<string, unknown>;
    for (const f of ["name", "label", "email", "phone", "location", "summary", "linkedin", "github", "website"]) {
      if (typeof b[f] !== "string") {
        b[f] = b[f] != null ? String(b[f]) : "";
      }
    }
  }

  // arrays
  const arrayFields = ["work", "education", "skills", "projects", "languages", "certifications", "volunteer"] as const;
  for (const field of arrayFields) {
    if (!Array.isArray(d[field])) {
      d[field] = [];
      if (["work", "education", "skills", "languages"].includes(field)) {
        errors.push(`Campo '${field}' normalizado para array vazio`);
      }
    }
  }

  // work: highlights + location
  if (Array.isArray(d.work)) {
    for (const w of d.work as Record<string, unknown>[]) {
      if (!Array.isArray(w.highlights)) w.highlights = [];
      for (const f of ["company", "position", "startDate", "endDate", "location"]) {
        if (typeof w[f] !== "string") w[f] = w[f] != null ? String(w[f]) : "";
      }
    }
  }

  // education: + status
  if (Array.isArray(d.education)) {
    for (const e of d.education as Record<string, unknown>[]) {
      for (const f of ["institution", "area", "studyType", "startDate", "endDate", "status"]) {
        if (typeof e[f] !== "string") e[f] = e[f] != null ? String(e[f]) : "";
      }
    }
  }

  // skills: + category
  if (Array.isArray(d.skills)) {
    for (const s of d.skills as Record<string, unknown>[]) {
      if (typeof s.name !== "string") s.name = s.name != null ? String(s.name) : "";
      if (typeof s.level !== "string") s.level = s.level != null ? String(s.level) : "";
      if (typeof s.category !== "string") s.category = s.category != null ? String(s.category) : "";
    }
  }

  // projects: + highlights
  if (Array.isArray(d.projects)) {
    for (const p of d.projects as Record<string, unknown>[]) {
      if (typeof p.name !== "string") p.name = "";
      if (typeof p.description !== "string") p.description = "";
      if (typeof p.startDate !== "string") p.startDate = p.startDate != null ? String(p.startDate) : "";
      if (typeof p.endDate !== "string") p.endDate = p.endDate != null ? String(p.endDate) : "";
      if (!Array.isArray(p.highlights)) p.highlights = [];
      if (!Array.isArray(p.technologies)) p.technologies = [];
      if (typeof p.url !== "string") p.url = p.url != null ? String(p.url) : "";
      if (typeof p.repository !== "string") p.repository = p.repository != null ? String(p.repository) : "";
    }
  }

  // languages
  if (Array.isArray(d.languages)) {
    for (const l of d.languages as Record<string, unknown>[]) {
      if (typeof l.language !== "string") l.language = l.language != null ? String(l.language) : "";
      if (typeof l.fluency !== "string") l.fluency = l.fluency != null ? String(l.fluency) : "";
    }
  }

  // certifications
  if (Array.isArray(d.certifications)) {
    for (const c of d.certifications as Record<string, unknown>[]) {
      for (const f of ["name", "issuer", "date", "url"]) {
        if (typeof c[f] !== "string") c[f] = c[f] != null ? String(c[f]) : "";
      }
    }
  }

  // volunteer
  if (Array.isArray(d.volunteer)) {
    for (const v of d.volunteer as Record<string, unknown>[]) {
      for (const f of ["organization", "role", "startDate", "endDate", "summary"]) {
        if (typeof v[f] !== "string") v[f] = v[f] != null ? String(v[f]) : "";
      }
    }
  }

  const hasBasics = d.basics && typeof d.basics === "object";
  const hasName = hasBasics && typeof (d.basics as Record<string, unknown>).name === "string" &&
    ((d.basics as Record<string, unknown>).name as string).length > 0;

  if (!hasName) {
    return { valid: false, errors: [...errors, "Campo 'basics.name' é obrigatório"], normalized: null };
  }

  return {
    valid: true,
    errors,
    normalized: d as unknown as ResumeSchema,
  };
}

// ── Schema as string for prompts ────────────────────────

// ── Quality Validation ──────────────────────────────────

export interface QualityIssue {
  severity: "critical" | "warning" | "info";
  field: string;
  message: string;
  autoFixable: boolean;
}

export interface QualityReport {
  score: number;
  passed: boolean;
  issues: QualityIssue[];
  suggestions: string[];
}

const TECH_CATEGORY_MAP: Record<string, string[]> = {
  "Front-end": ["html", "css", "javascript", "typescript", "react", "vue", "angular", "next", "nuxt", "svelte", "tailwind", "sass", "scss", "bootstrap", "jquery", "gatsby", "remix"],
  "Back-end": ["node", "express", "django", "flask", "fastapi", "spring", "php", "laravel", "python", "java", "ruby", "go", "golang", "rust", "c#", "csharp", ".net", "nest", "nestjs", "koa", "wordpress"],
  "Banco de Dados": ["sql", "mysql", "postgresql", "postgres", "mongodb", "redis", "firebase", "firestore", "supabase", "prisma", "dynamodb", "sqlite", "oracle"],
  "DevOps / Cloud": ["docker", "kubernetes", "aws", "azure", "gcp", "jenkins", "terraform", "ansible", "linux", "nginx"],
  "Ferramentas": ["git", "github", "gitlab", "bitbucket", "jira", "confluence", "figma", "postman", "insomnia", "vscode", "vercel", "heroku", "netlify", "notion", "trello"],
  "Mobile": ["react native", "flutter", "swift", "kotlin", "android", "ios", "expo", "dart"],
  "Testes": ["jest", "cypress", "selenium", "playwright", "vitest", "mocha", "testing library"],
};

function autoCategorizeSkills(skills: ResumeSchema["skills"]): ResumeSchema["skills"] {
  return skills.map((skill) => {
    if (skill.category && skill.category.trim()) return skill;
    const items = skill.name.toLowerCase().split(",").map((s) => s.trim());
    for (const [category, keywords] of Object.entries(TECH_CATEGORY_MAP)) {
      if (items.some((item) => keywords.some((kw) => item.includes(kw)))) {
        return { ...skill, category };
      }
    }
    return { ...skill, category: "Outros" };
  });
}

function parseYearMonth(dateStr: string): Date | null {
  const match = dateStr.match(/^(\d{4})-(\d{2})$/);
  if (!match) return null;
  return new Date(parseInt(match[1]), parseInt(match[2]) - 1);
}

function calculateExperienceDuration(work: ResumeSchema["work"]): string | null {
  let earliestDate: Date | null = null;
  const now = new Date();
  for (const w of work) {
    const start = parseYearMonth(w.startDate);
    if (start && (!earliestDate || start < earliestDate)) earliestDate = start;
  }
  if (!earliestDate) return null;
  let latestDate = now;
  for (const w of work) {
    if (w.endDate && !["atual", "present", "current"].includes(w.endDate.toLowerCase())) {
      const end = parseYearMonth(w.endDate);
      if (end && end > latestDate) latestDate = end;
    }
  }
  const totalMonths = Math.max(1, Math.floor((latestDate.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)));
  if (totalMonths < 12) return `${totalMonths} ${totalMonths === 1 ? "mês" : "meses"}`;
  const years = Math.floor(totalMonths / 12);
  return `${years}+ ${years === 1 ? "ano" : "anos"}`;
}

export function validateResumeQuality(
  resume: ResumeSchema,
  generationNotes?: GenerationNotes | null
): QualityReport {
  const issues: QualityIssue[] = [];
  const suggestions: string[] = [];

  // ── CRITICAL ──

  if (!resume.basics.summary || resume.basics.summary.length < 100) {
    issues.push({ severity: "critical", field: "basics.summary", message: "Resumo ausente ou muito curto (mínimo 100 caracteres)", autoFixable: false });
  }

  if (resume.basics.summary) {
    const hasDigit = /\d/.test(resume.basics.summary);
    const hasQuantitative = /(\bdiversos\b|\bmúltiplos\b|\bmúltiplas\b|\bvários\b|\bvárias\b)/i.test(resume.basics.summary);
    if (!hasDigit && !hasQuantitative) {
      issues.push({ severity: "critical", field: "basics.summary", message: "Resumo sem nenhum número ou palavra quantitativa", autoFixable: true });
    }
  }

  for (let i = 0; i < resume.work.length; i++) {
    const w = resume.work[i];
    if (w.highlights.length < 3) {
      issues.push({ severity: "critical", field: `work[${i}].highlights`, message: `"${w.company || w.position}" tem ${w.highlights.length} bullet(s) — mínimo: 3`, autoFixable: false });
    }
    for (let j = 0; j < w.highlights.length; j++) {
      if (w.highlights[j].length < 30) {
        issues.push({ severity: "critical", field: `work[${i}].highlights[${j}]`, message: `Bullet muito curto (${w.highlights[j].length} chars, mínimo: 30)`, autoFixable: false });
      }
    }
  }

  if (resume.skills.length === 0) {
    issues.push({ severity: "critical", field: "skills", message: "Nenhuma habilidade listada", autoFixable: false });
  }

  // Total quantitative data across the resume (Regra 5: mínimo 3)
  const allResumeText = [
    resume.basics.summary || "",
    ...resume.work.flatMap(w => w.highlights),
    ...resume.projects.map(p => p.description),
    ...resume.projects.flatMap(p => p.highlights),
  ].join(" ");
  const quantCount = (allResumeText.match(/\d+/g) || []).length;
  if (quantCount < 3) {
    issues.push({ severity: "critical", field: "metrics.total", message: `Apenas ${quantCount} dado(s) quantitativo(s) no currículo — mínimo: 3 (Regra 5)`, autoFixable: false });
  }

  // ── WARNING ──

  const distinctCats = new Set(resume.skills.map((s) => s.category).filter(Boolean));
  if (distinctCats.size < 2 && resume.skills.length >= 5) {
    issues.push({ severity: "warning", field: "skills", message: "Habilidades com menos de 2 categorias distintas", autoFixable: true });
  }

  const resultPattern = /(\bresultando\b|\bgerando\b|\baumentando\b|\breduzindo\b|\bentregando\b|\bcontribuindo\b|\bmelhorando\b|\botimizando\b|\balcançando\b|\batingindo\b|\bsuperando\b|\belevando\b|\d)/i;
  let totalHL = 0;
  let hlWithResult = 0;
  for (const w of resume.work) {
    for (const h of w.highlights) {
      totalHL++;
      if (resultPattern.test(h)) hlWithResult++;
    }
  }
  const hlWithoutResult = totalHL - hlWithResult;
  if (totalHL > 0 && hlWithResult / totalHL < 0.3) {
    issues.push({ severity: "critical", field: "work.highlights.impact", message: `${hlWithoutResult} de ${totalHL} bullets NÃO contêm resultado ou impacto (apenas ${Math.round((hlWithResult / totalHL) * 100)}% têm indicadores)`, autoFixable: false });
    suggestions.push("Reescreva CADA bullet adicionando contexto numérico ou resultado mensurável");
  }

  const level = generationNotes?.candidateLevel?.toLowerCase() || "";
  if (["estagiário", "júnior", "junior"].includes(level) && resume.projects.length === 0) {
    issues.push({ severity: "warning", field: "projects", message: "Candidato júnior sem projetos pessoais listados", autoFixable: false });
  }

  if (resume.languages.length === 0) {
    issues.push({ severity: "warning", field: "languages", message: "Seção de idiomas vazia", autoFixable: false });
  }

  if (!generationNotes?.candidateLevel) {
    issues.push({ severity: "warning", field: "generationNotes", message: "Nível do candidato não identificado", autoFixable: false });
  }

  // ── Cliché detection (critical) ──
  const CLICHES: RegExp[] = [
    /busco\s+.{0,50}(desafios?|oportunidades?|crescimento|contribuir)/i,
    /busco\s+(consolidar|desenvolver|expandir|alavancar)\s+(minha\s+)?(carreira|trajetória|jornada)/i,
    /(em\s+constante\s+busca|sempre\s+em\s+busca|em\s+busca\s+de\s+(novos?\s+)?(desafios?|oportunidades?|aprendizado))/i,
    /profissional\s+(dedicad[oa]|proativ[oa]|comprometid[oa]|motivad[oa]|apaixonad[oa]|din[âa]mic[oa])/i,
    /(apaixonad[oa]|entusiast[oa]|fascinad[oa])\s+por\s/i,
    /orientad[oa]\s+(a|para)\s+resultados/i,
    /sede\s+de\s+(aprender|conhecimento|crescimento)/i,
    /esp[ií]rito\s+de\s+(equipe|lideran[çc]a|colabora[çc][ãa]o)/i,
    /pensamento\s+(cr[ií]tico|anal[ií]tico|estrat[eé]gico)/i,
    /(din[âa]mic[oa]|proativ[oa])\s+e\s+(din[âa]mic[oa]|proativ[oa]|criativ[oa]|determinad[oa]|dedicad[oa])/i,
    /comprometid[oa]\s+com\s+(a\s+)?(excel[êe]ncia|qualidade)/i,
    /movid[oa]\s+por\s+(desafios?|resultados|inova[çc][ãa]o)/i,
    /desejo\s+(contribuir|crescer|evoluir|me\s+desenvolver)/i,
    /sou\s+uma?\s+profissional/i,
    /abert[oa]\s+a\s+novos?\s+(desafios?|oportunidades?)/i,
    /dispost[oa]\s+a\s+(aprender|contribuir|crescer)/i,
    /(viso|almejo)\s+(contribuir|crescer|evoluir)/i,
    /(tenho|minha)\s+paix[ãa]o\s+(por|[eé])/i,
    /focad[oa]\s+em\s+(resultados|excel[êe]ncia|entrega)/i,
    /excelente\s+comunicador[a]?/i,
    /trabalh[oa]\s+bem\s+em\s+equipe/i,
    /solucionador[a]?\s+de\s+problemas/i,
    /habilidades\s+interpessoais/i,
    /vasta\s+experi[eê]ncia/i,
  ];

  const allText = [
    resume.basics.summary || "",
    ...resume.work.flatMap(w => w.highlights),
  ].join(" ");

  const foundCliches = CLICHES.filter(c => c.test(allText));
  if (foundCliches.length > 0) {
    issues.push({
      severity: "critical",
      field: "cliché",
      message: `${foundCliches.length} clichê(s) detectado(s) no currículo`,
      autoFixable: false,
    });
  }

  // ── INFO ──

  if (!resume.basics.linkedin) {
    suggestions.push("LinkedIn não preenchido — recomendado para credibilidade");
  }

  const techPattern = /\b(javascript|python|java|react|node|angular|vue|typescript|c\+\+|c#|go|rust|php|ruby|swift|kotlin|docker|aws|sql|html|css)\b/i;
  const isTech = resume.skills.some((s) => techPattern.test(s.name));
  if (isTech && !resume.basics.github) {
    issues.push({ severity: "info", field: "basics.github", message: "Perfil de tecnologia sem GitHub", autoFixable: false });
  }

  if (resume.projects.length > 0 && !resume.projects.some((p) => p.url)) {
    issues.push({ severity: "info", field: "projects.url", message: "Nenhum projeto tem URL de deploy", autoFixable: false });
  }

  // ── Score ──
  const criticalCount = issues.filter((i) => i.severity === "critical").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;
  const infoCount = issues.filter((i) => i.severity === "info").length;
  const score = Math.max(0, Math.min(100, 100 - criticalCount * 20 - warningCount * 8 - infoCount * 2));

  return { score, passed: score >= 70, issues, suggestions };
}

export function applyAutoFixes(
  resume: ResumeSchema,
): { fixed: ResumeSchema; applied: string[] } {
  const applied: string[] = [];
  const fixed: ResumeSchema = JSON.parse(JSON.stringify(resume));

  // Fix 1: Categorize uncategorized skills
  const cats = new Set(fixed.skills.map((s) => s.category).filter(Boolean));
  if (cats.size < 2 && fixed.skills.length >= 3) {
    const categorized = autoCategorizeSkills(fixed.skills);
    const newCats = new Set(categorized.map((s) => s.category).filter(Boolean));
    if (newCats.size >= 2) {
      fixed.skills = categorized;
      applied.push("Habilidades categorizadas automaticamente");
    }
  }

  // Fix 2: Add experience duration to summary if no numbers
  if (fixed.basics.summary && !/\d/.test(fixed.basics.summary) && fixed.work.length > 0) {
    const duration = calculateExperienceDuration(fixed.work);
    if (duration) {
      fixed.basics.summary = `${fixed.basics.summary.replace(/\.\s*$/, "")}, com ${duration} de experiência profissional.`;
      applied.push(`Adicionado "${duration} de experiência" ao resumo`);
    }
  }

  return { fixed, applied };
}

// ── Preservation validation (input vs output) ────────────

/** Known tech terms for matching (lowercased). */
const COMMON_TECHS = [
  "javascript", "typescript", "python", "java", "c#", "c++", "go", "rust", "ruby", "php", "swift", "kotlin", "dart",
  "react", "vue", "angular", "svelte", "next", "nuxt", "gatsby", "remix",
  "node", "express", "django", "flask", "fastapi", "spring", "laravel", "nest", "nestjs",
  "html", "css", "sass", "scss", "tailwind", "bootstrap",
  "sql", "mysql", "postgresql", "postgres", "mongodb", "redis", "firebase", "supabase", "prisma", "dynamodb", "sqlite",
  "docker", "kubernetes", "aws", "azure", "gcp", "jenkins", "terraform", "git", "github", "gitlab",
  "jest", "cypress", "selenium", "playwright", "vitest",
  "react native", "flutter", "expo",
  "figma", "postman", "jira", "confluence", "vercel", "heroku", "netlify",
  "linux", "nginx", "graphql", "rest", "api",
];

/** Language fluency levels ranked (higher index = higher level). */
const FLUENCY_RANK: Record<string, number> = {
  "básico": 1, "basico": 1,
  "intermediário": 2, "intermediario": 2,
  "avançado": 3, "avancado": 3,
  "fluente": 4,
  "nativo": 5, "nativa": 5,
};

function extractTechsFromText(text: string): string[] {
  const lower = text.toLowerCase();
  return COMMON_TECHS.filter(t => {
    const re = new RegExp(`\\b${t.replace(/[+#]/g, "\\$&")}\\b`, "i");
    return re.test(lower);
  });
}

function extractLanguagesFromText(text: string): { language: string; level: string }[] {
  const langs: { language: string; level: string }[] = [];
  const patterns = [
    /(?:inglês|english)\s*[-–:]\s*(\w+)/gi,
    /(?:espanhol|spanish|español)\s*[-–:]\s*(\w+)/gi,
    /(?:francês|french|français)\s*[-–:]\s*(\w+)/gi,
    /(?:alemão|german|deutsch)\s*[-–:]\s*(\w+)/gi,
    /(?:italiano|italian)\s*[-–:]\s*(\w+)/gi,
    /(?:português|portuguese)\s*[-–:]\s*(\w+)/gi,
  ];
  const langNames = ["Inglês", "Espanhol", "Francês", "Alemão", "Italiano", "Português"];
  patterns.forEach((pat, i) => {
    const match = pat.exec(text);
    if (match) {
      langs.push({ language: langNames[i], level: match[1].toLowerCase() });
    }
  });
  return langs;
}

export interface PreservationIssue {
  type: "tech_missing" | "language_downgrade" | "work_removed" | "responsibility_removed";
  detail: string;
}

export function validatePreservation(
  inputText: string,
  output: ResumeSchema,
): PreservationIssue[] {
  const issues: PreservationIssue[] = [];

  // 1. Check tech preservation
  const inputTechs = extractTechsFromText(inputText);
  const outputText = [
    ...output.skills.map(s => s.name),
    ...output.work.flatMap(w => w.highlights),
    ...output.projects.flatMap(p => [...p.technologies, p.description]),
  ].join(" ").toLowerCase();

  for (const tech of inputTechs) {
    const re = new RegExp(`\\b${tech.replace(/[+#]/g, "\\$&")}\\b`, "i");
    if (!re.test(outputText)) {
      issues.push({ type: "tech_missing", detail: tech });
    }
  }

  // 2. Check language level preservation
  const inputLangs = extractLanguagesFromText(inputText);
  for (const inputLang of inputLangs) {
    const outputLang = output.languages.find(l =>
      l.language.toLowerCase().includes(inputLang.language.toLowerCase())
    );
    if (outputLang) {
      const inputRank = FLUENCY_RANK[inputLang.level] || 0;
      const outputRank = FLUENCY_RANK[outputLang.fluency.toLowerCase()] || 0;
      if (inputRank > 0 && outputRank > 0 && outputRank < inputRank) {
        issues.push({
          type: "language_downgrade",
          detail: `${inputLang.language}: input="${inputLang.level}" → output="${outputLang.fluency}"`,
        });
      }
    }
  }

  // 3. Check work entry count (rough: count company-like patterns in input)
  const companyPatterns = inputText.match(/(?:empresa|company|emprego|trabalho|cargo|position)[\s:]+\S+/gi);
  if (companyPatterns && companyPatterns.length > output.work.length + 1) {
    issues.push({
      type: "work_removed",
      detail: `Input sugere ~${companyPatterns.length} experiências, output tem ${output.work.length}`,
    });
  }

  // 4. Check leadership preservation
  const leadershipTerms = ["líder", "lider", "coordenador", "supervisor", "tech lead", "gestor", "gerente", "head"];
  const inputLower = inputText.toLowerCase();
  for (const term of leadershipTerms) {
    if (inputLower.includes(term)) {
      const outputWorkText = output.work.map(w => `${w.position} ${w.highlights.join(" ")}`).join(" ").toLowerCase();
      if (!outputWorkText.includes(term) && !outputWorkText.includes("liderei") && !outputWorkText.includes("coordenei") && !outputWorkText.includes("gerenciei")) {
        issues.push({
          type: "responsibility_removed",
          detail: `Termo de liderança "${term}" presente no input mas ausente no output`,
        });
        break;
      }
    }
  }

  return issues;
}

// ── Schema as string for prompts ────────────────────────

export const RESUME_SCHEMA_JSON = `{
  "resume": {
    "basics": {
      "name": "string — nome completo, capitalizado corretamente",
      "label": "string — título profissional (máx 5 palavras, regra 1)",
      "email": "string — email fornecido ou vazio",
      "phone": "string — telefone formatado ou vazio",
      "location": "string — apenas Cidade - Estado/País",
      "summary": "string — resumo profissional (regra 2, 3-5 linhas)",
      "linkedin": "string — URL completa ou vazio",
      "github": "string — URL completa ou vazio",
      "website": "string — URL de portfólio ou vazio"
    },
    "work": [
      {
        "company": "string — nome da empresa",
        "position": "string — cargo exato",
        "startDate": "string — formato: YYYY-MM (ex: 2024-07)",
        "endDate": "string — formato: YYYY-MM ou 'atual'",
        "location": "string — cidade ou 'Remoto' ou vazio",
        "highlights": [
          "string — bullet completo seguindo regra 3 (mínimo 2, máximo 5)"
        ]
      }
    ],
    "education": [
      {
        "institution": "string — nome da instituição",
        "area": "string — área/curso",
        "studyType": "string — Tecnólogo / Bacharelado / MBA / Técnico / Bootcamp / etc.",
        "startDate": "string — formato: YYYY-MM",
        "endDate": "string — formato: YYYY-MM, 'atual' ou 'Conclusão prevista: MM/YYYY'",
        "status": "string — 'Concluído' | 'Em andamento' | 'Interrompido'"
      }
    ],
    "skills": [
      {
        "category": "string — categoria (ex: Front-end, Back-end, Ferramentas, Idiomas)",
        "name": "string — tecnologia ou habilidade",
        "level": "string — Avançado | Intermediário | Básico | (vazio se não aplicável)"
      }
    ],
    "projects": [
      {
        "name": "string — nome do projeto",
        "description": "string — 1-2 linhas: o que é + qual problema resolve",
        "startDate": "string — formato: YYYY-MM (ex: 2024-03) ou vazio",
        "endDate": "string — formato: YYYY-MM, 'atual' ou vazio",
        "highlights": [
          "string — diferencial técnico, decisão relevante ou resultado (opcional)"
        ],
        "technologies": ["string — lista de tecnologias usadas"],
        "url": "string — URL de deploy ou vazio",
        "repository": "string — URL do repositório ou vazio"
      }
    ],
    "languages": [
      {
        "language": "string — nome do idioma",
        "fluency": "string — Nativo | Fluente | Avançado | Intermediário | Básico"
      }
    ],
    "certifications": [
      {
        "name": "string — nome da certificação",
        "issuer": "string — emissor",
        "date": "string — YYYY-MM ou YYYY",
        "url": "string — link de verificação ou vazio"
      }
    ],
    "volunteer": [
      {
        "organization": "string — nome da organização",
        "role": "string — papel/função",
        "startDate": "string — YYYY-MM",
        "endDate": "string — YYYY-MM ou 'atual'",
        "summary": "string — 1-2 linhas descrevendo a atuação"
      }
    ]
  },
  "formattedText": "string — texto plano formatado para leitura, com seções separadas por quebras de linha",
  "generationNotes": {
    "inferredData": [
      "string — liste CADA dado que foi inferido (não fornecido diretamente pelo candidato)"
    ],
    "missingImpactData": [
      "string — liste dados que, se fornecidos pelo candidato, melhorariam o currículo"
    ],
    "warnings": [
      "string — inconsistências ou problemas encontrados nos dados originais"
    ],
    "candidateLevel": "string — nível inferido: estagiário | júnior | pleno | sênior | especialista",
    "targetJobDetected": "string — cargo/área alvo inferido dos dados"
  }
}`;
