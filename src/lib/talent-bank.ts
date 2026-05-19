// Server-only. Recebe os dados extraídos pela IA (em qualquer uma das 3 formas
// que as rotas usam — analyze, create, adapt) e faz upsert na coleção
// `talents` deduplicando por email (lower) ou telefone.

import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";

export type TalentSource = "analyze" | "create" | "adapt" | "cover-letter";

export interface TalentInput {
  fullName: string;
  email: string;
  phone: string;
  profession: string;
  links: string[];
  uploadedBy: string;
  source: TalentSource;
}

type AnalysisShape = {
  extractedData?: {
    personalInfo?: {
      name?: string;
      email?: string;
      phone?: string;
      linkedin?: string;
      portfolio?: string;
    };
    experience?: { position?: string }[];
    projects?: { url?: string }[];
  };
};

type ResumeSchemaShape = {
  basics?: {
    name?: string;
    label?: string;
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  work?: { position?: string }[];
  projects?: { url?: string; repository?: string }[];
};

// /api/create-resume retorna { resume: ResumeSchema, resumeData: ..., ... }
// (e também é chamado pela página de adapt-resume com mode:"improve")
type CreateResumeShape = {
  resume?: ResumeSchemaShape;
} & ResumeSchemaShape;

type AdaptedShape = {
  adaptedResume?: {
    personalInfo?: {
      name?: string;
      email?: string;
      phone?: string;
      linkedin?: string;
      portfolio?: string;
    };
    experience?: { position?: string }[];
    projects?: { url?: string }[];
  };
};

type CoverLetterShape = {
  candidateName?: string;
  candidateEmail?: string;
  candidatePhone?: string;
};

function clean(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

function normalizeUrl(raw: unknown): string {
  const s = clean(raw);
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  if (/^www\./i.test(s) || /\.[a-z]{2,}/i.test(s)) return `https://${s}`;
  return "";
}

function uniqueLinks(values: unknown[]): string[] {
  const set = new Set<string>();
  for (const v of values) {
    const u = normalizeUrl(v);
    if (u) set.add(u);
  }
  return Array.from(set);
}

// Regex para extrair URLs / domínios do texto bruto do currículo.
// Usado quando o retorno da IA não traz os links estruturados (carta de
// apresentação). Cobre http(s)://, www. e domínios soltos tipo "github.com/foo".
const URL_REGEX =
  /\b(?:https?:\/\/|www\.)[^\s<>"')]+|\b(?:linkedin\.com|github\.com|gitlab\.com|bitbucket\.org|behance\.net|dribbble\.com|medium\.com|dev\.to|portfolio\.[a-z]+|[a-z0-9-]+\.(?:com|net|org|io|dev|me|app|tech|design)(?:\.br)?)\/[^\s<>"')]+/gi;

export function extractLinksFromText(text: string): string[] {
  if (!text || typeof text !== "string") return [];
  const matches = text.match(URL_REGEX) ?? [];
  // Tira pontuação final (".", ",", ";", ":") que cola na URL no texto
  const cleaned = matches.map((m) => m.replace(/[.,;:)\]]+$/, ""));
  return uniqueLinks(cleaned);
}

export function extractTalentFromAnalysis(
  data: AnalysisShape,
  uid: string,
): TalentInput {
  const pi = data.extractedData?.personalInfo ?? {};
  const exp = data.extractedData?.experience ?? [];
  const projects = data.extractedData?.projects ?? [];
  return {
    fullName: clean(pi.name),
    email: clean(pi.email),
    phone: clean(pi.phone),
    profession: clean(exp[0]?.position),
    links: uniqueLinks([pi.linkedin, pi.portfolio, ...projects.map((p) => p?.url)]),
    uploadedBy: uid,
    source: "analyze",
  };
}

export function extractTalentFromSchema(
  data: CreateResumeShape,
  uid: string,
): TalentInput {
  // A rota /api/create-resume embrulha o schema em `resume`. Aceita os dois
  // formatos para robustez (alguns paths legacy retornam o schema solto).
  const schema = data.resume ?? data;
  const b = schema.basics ?? {};
  const work = schema.work ?? [];
  const projects = schema.projects ?? [];
  return {
    fullName: clean(b.name),
    email: clean(b.email),
    phone: clean(b.phone),
    profession: clean(b.label) || clean(work[0]?.position),
    links: uniqueLinks([
      b.linkedin,
      b.github,
      b.website,
      ...projects.flatMap((p) => [p?.url, p?.repository]),
    ]),
    uploadedBy: uid,
    source: "create",
  };
}

// Carta de apresentação não traz links/profissão estruturados — extraímos
// os URLs do texto original do currículo via regex.
export function extractTalentFromCoverLetter(
  data: CoverLetterShape,
  resumeText: string,
  uid: string,
): TalentInput {
  return {
    fullName: clean(data.candidateName),
    email: clean(data.candidateEmail),
    phone: clean(data.candidatePhone),
    profession: "",
    links: extractLinksFromText(resumeText),
    uploadedBy: uid,
    source: "cover-letter",
  };
}

export function extractTalentFromAdapted(
  data: AdaptedShape,
  uid: string,
): TalentInput {
  const ar = data.adaptedResume ?? {};
  const pi = ar.personalInfo ?? {};
  const exp = ar.experience ?? [];
  const projects = ar.projects ?? [];
  return {
    fullName: clean(pi.name),
    email: clean(pi.email),
    phone: clean(pi.phone),
    profession: clean(exp[0]?.position),
    links: uniqueLinks([pi.linkedin, pi.portfolio, ...projects.map((p) => p?.url)]),
    uploadedBy: uid,
    source: "adapt",
  };
}

export async function saveTalent(input: TalentInput): Promise<void> {
  const fullName = clean(input.fullName);
  const emailLower = clean(input.email).toLowerCase();
  const phone = clean(input.phone);
  const profession = clean(input.profession);
  const links = input.links;

  // Precisa de nome + (email OU telefone) para conseguir deduplicar
  if (!fullName) return;
  if (!emailLower && !phone) return;

  const col = adminDb.collection("talents");

  // Busca por email primeiro, depois telefone
  let existing: FirebaseFirestore.QueryDocumentSnapshot | null = null;
  if (emailLower) {
    const snap = await col.where("email", "==", emailLower).limit(1).get();
    if (!snap.empty) existing = snap.docs[0];
  }
  if (!existing && phone) {
    const snap = await col.where("phone", "==", phone).limit(1).get();
    if (!snap.empty) existing = snap.docs[0];
  }

  const now = FieldValue.serverTimestamp();

  if (existing) {
    const data = existing.data();
    const currentLinks: string[] = Array.isArray(data.links) ? data.links : [];
    const mergedLinks = Array.from(new Set(currentLinks.concat(links)));

    const update: Record<string, unknown> = {};
    if (fullName && fullName !== data.fullName) update.fullName = fullName;
    if (emailLower && emailLower !== data.email) update.email = emailLower;
    if (phone && phone !== data.phone) update.phone = phone;
    if (profession && profession !== data.profession) update.profession = profession;
    if (mergedLinks.length !== currentLinks.length) update.links = mergedLinks;

    if (Object.keys(update).length === 0) return;
    update.updatedAt = now;
    await existing.ref.update(update);
    return;
  }

  await col.add({
    fullName,
    email: emailLower,
    phone,
    profession,
    links,
    uploadedBy: clean(input.uploadedBy),
    source: input.source,
    createdAt: now,
    updatedAt: now,
  });
}
