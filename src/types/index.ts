// ==================== User Types ====================
export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  credits: number;
  plan: Plan;
  createdAt: Date;
  updatedAt: Date;
}

export type Plan = "free" | "basic" | "intermediate" | "advanced";

export interface PlanInfo {
  id: Plan;
  name: string;
  price: number;
  credits: number;
  features: string[];
}

// ==================== Resume Types ====================
export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileType: "pdf" | "doc" | "docx";
  extractedData: ResumeData | null;
  analysis: ResumeAnalysis | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    portfolio?: string;
  };
  objective: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: Language[];
  courses: Course[];
  projects: Project[];
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface Language {
  name: string;
  level: "basic" | "intermediate" | "advanced" | "fluent" | "native";
}

export interface Course {
  name: string;
  institution: string;
  completionDate: string;
  certificate?: boolean;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

// ==================== Analysis Types ====================
export interface ResumeAnalysis {
  overallScore: number;
  structure: {
    score: number;
    organization: string;
    clarity: string;
    hierarchy: string;
    size: string;
    scanability: string;
  };
  content: {
    score: number;
    missingInfo: string[];
    vagueDescriptions: string[];
    missingMetrics: string[];
    poorExplanations: string[];
    repeatedSkills: string[];
  };
  language: {
    score: number;
    spellingErrors: string[];
    grammarErrors: string[];
    poorStructure: string[];
    unprofessionalLanguage: string[];
  };
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  rewriteSuggestions: RewriteSuggestion[];
}

export interface RewriteSuggestion {
  original: string;
  suggested: string;
  reason: string;
}

// ==================== LinkedIn Types ====================
export interface LinkedInAnalysis {
  profileUrl: string;
  overallScore: number;
  profileStructure: {
    clarity: string;
    organization: string;
    professionalConsistency: string;
  };
  seo: {
    score: number;
    relevantKeywords: string[];
    headlineOptimization: string;
    aboutOptimization: string;
  };
  suggestedHeadline: string;
  suggestedAbout: string;
  recommendedKeywords: string[];
  improvements: string[];
  strengths: string[];
}

// ==================== Career Roadmap Types ====================
export interface CareerRoadmap {
  id: string;
  userId: string;
  currentRole: string;
  currentArea: string;
  experienceLevel: string;
  targetRole: string;
  timeline: string;
  roadmap: RoadmapPhase[];
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoadmapPhase {
  level: number;
  title: string;
  description: string;
  duration: string;
  tasks: RoadmapTask[];
  courses: string[];
  certifications: string[];
  skills: string[];
  projects: string[];
  networking: string[];
}

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  points: number;
}

// ==================== Adapted Resume Types ====================
export interface AdaptedResume {
  id: string;
  userId: string;
  baseResumeId: string;
  jobDescription: string;
  compatibilityScore: number;
  adaptedContent: ResumeData;
  keywords: string[];
  suggestions: string[];
  createdAt: Date;
}

// ==================== Credits Types ====================
export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: "debit" | "credit";
  feature: string;
  description: string;
  createdAt: Date;
}

export const FEATURE_COSTS: Record<string, number> = {
  "resume-analysis": 1,
  "linkedin-analysis": 1,
  "resume-creation": 1,
  "resume-adaptation": 1,
  "resume-editor": 1,
  "career-roadmap": 20,
  "chat": 1,
};

export const PLANS: PlanInfo[] = [
  {
    id: "basic",
    name: "Básico",
    price: 30,
    credits: 50,
    features: [
      "50 créditos/mês",
      "Análise de currículo",
      "Análise LinkedIn",
      "Criação de currículo",
      "Adaptação para vagas",
    ],
  },
  {
    id: "intermediate",
    name: "Intermediário",
    price: 50,
    credits: 120,
    features: [
      "120 créditos/mês",
      "Tudo do plano Básico",
      "Roadmap de carreira",
      "Chat com IA",
      "Prioridade no suporte",
    ],
  },
  {
    id: "advanced",
    name: "Avançado",
    price: 100,
    credits: 230,
    features: [
      "230 créditos/mês",
      "Tudo do plano Intermediário",
      "Área para recrutadores",
      "Relatórios avançados",
      "Suporte prioritário",
    ],
  },
];
