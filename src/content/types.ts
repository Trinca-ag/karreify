// Tipos do conteúdo de SEO (guias e páginas de profissão).

export interface FAQ {
  question: string;
  answer: string;
}

export interface GuideSection {
  heading: string;
  body: string[];
  bullets?: string[];
}

export interface Guide {
  slug: string;
  metaTitle: string;
  h1: string;
  metaDescription: string;
  intro: string;
  sections: GuideSection[];
  keyTakeaways: string[];
  faqs: FAQ[];
  /** Marca o artigo-âncora (pillar). */
  pillar?: boolean;
  /** Slugs de guias relacionados para interligar (internal linking). */
  relatedSlugs?: string[];
}

export interface ResumeExperience {
  role: string;
  company: string;
  period: string;
  bullets: string[];
}

export interface ResumeEducation {
  degree: string;
  institution: string;
  period: string;
}

export interface SampleResume {
  name: string;
  headline: string;
  summary: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: string[];
}

export interface Profession {
  slug: string;
  /** Nome de exibição, ex.: "Enfermagem". */
  profession: string;
  metaTitle: string;
  h1: string;
  metaDescription: string;
  intro: string;
  sampleResume: SampleResume;
  keySkills: string[];
  atsKeywords: string[];
  salaryNote: string;
  dos: string[];
  donts: string[];
  faqs: FAQ[];
}

export interface Author {
  name: string;
  role: string;
  bio: string;
}
