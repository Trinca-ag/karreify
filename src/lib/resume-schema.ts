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
