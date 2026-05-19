// ==================== User Types ====================
export type UserRole = "user" | "tester";

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  credits: number;
  role: UserRole;
  autoSaveDocuments?: boolean;
  createdAt: Date;
  updatedAt: Date;
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

// ==================== Device Types ====================
export interface Device {
  id: string;
  userId: string;
  deviceName: string;
  browser: string;
  os: string;
  lastVerifiedAt: Date;
  lastActiveAt: Date;
  createdAt: Date;
}

// ==================== Saved Items Types ====================
export type SavedItemType =
  | "resume"
  | "resume-analysis"
  | "company-analysis"
  | "cover-letter";

export interface SavedItemBase {
  id: string;
  type: SavedItemType;
  title: string;
  subtitle?: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface SavedResumeItem extends SavedItemBase {
  type: "resume";
  resumeData: unknown;
  template: string;
  candidateLevel?: string;
  adjustments?: {
    fontSizeOffset?: number;
    spacingOffset?: number;
    hiddenSections?: string[];
    sectionTitleFontPx?: number;
    entryTitleFontPx?: number;
    bodyFontPx?: number;
    metaFontPx?: number;
    sectionSpacingPx?: number;
  };
}

export interface SavedPdfItem extends SavedItemBase {
  type: "resume-analysis" | "company-analysis" | "cover-letter";
  storagePath: string;
  downloadUrl: string;
  fileName: string;
}

export type SavedItem = SavedResumeItem | SavedPdfItem;

export const SAVED_ITEM_MAX_PER_TYPE = 5;
export const SAVED_ITEM_TTL_MS = 10 * 60 * 60 * 1000; // 10 hours

export const SAVED_ITEM_LABELS: Record<SavedItemType, string> = {
  "resume": "Currículo",
  "resume-analysis": "Análise de Currículo",
  "company-analysis": "Análise de Empresa",
  "cover-letter": "Carta de Apresentação",
};

// ==================== Notifications ====================
/**
 * Window during which a manual-save user can still click "Salvar" on the
 * notification after generating a document. After this the notification
 * grays out as "Expirado" and the save endpoint refuses to persist.
 */
export const NOTIFICATION_SAVE_WINDOW_MS = 10 * 60 * 1000;

export type NotificationType =
  | "document-generated"
  | "role-change"
  | "welcome"
  | "email-changed"
  | "password-changed"
  | "ticket-created"
  | "ticket-reply"
  | "ticket-closed"
  | "feedback-thanks";

/**
 * Payload server stashes so the user can save the document later from a
 * notification (manual save flow). Resume documents carry the schema JSON
 * inline; PDF-backed documents (analysis, company-analysis, cover-letter)
 * carry the source JSON the PDF was rendered from so the server can
 * regenerate the PDF at save time.
 */
export type NotificationPendingPayload =
  | {
      kind: "resume";
      resumeData: unknown;
      template: string;
      candidateLevel?: string;
      title: string;
      subtitle?: string;
      adjustments?: Record<string, unknown>;
    }
  | {
      kind: "pdf";
      docType: "resume-analysis" | "company-analysis" | "cover-letter";
      sourceJson: unknown;
      title: string;
      subtitle?: string;
      fileName: string;
    };

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;

  // document-generated only
  documentType?: SavedItemType;
  documentTitle?: string;
  expiresAt?: Date;                    // +10h after createdAt
  savedItemId?: string | null;         // populated once the doc is saved
  savedItemRemoved?: boolean;          // set when the savedItem was deleted by user
  pendingPayload?: NotificationPendingPayload | null; // null once saved

  // role-change only
  newRole?: UserRole;
  creditsDelta?: number;

  // ticket-* only
  ticketId?: string;
}

// ==================== Feedback Types ====================
export interface Feedback {
  id: string;
  uid: string;
  userName: string | null;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export const FEEDBACK_MAX_COMMENT = 4000;

// ==================== Support Tickets ====================
export type TicketStatus = "open" | "closed";
export type TicketSenderRole = "user" | "admin";

export interface Ticket {
  id: string;           // 5-digit numeric string, also the Firestore doc id
  userId: string;
  userName: string;     // cached from user profile at creation time
  userEmail: string;
  title: string;
  description: string;
  images: string[];     // Firebase Storage download URLs (max 3)
  status: TicketStatus;
  messageCount: number; // total replies (not counting the initial description)
  lastMessageAt: Date;
  lastMessageBy: TicketSenderRole | null;
  createdAt: Date;
  updatedAt: Date;
  closedAt: Date | null;
  closedBy: string | null; // admin uid that closed the ticket
  imagesDeleted: boolean;  // true when the close routine wiped Storage attachments
}

export interface TicketMessage {
  id: string;
  senderId: string;
  senderRole: TicketSenderRole;
  senderName: string;
  content: string;
  createdAt: Date;
}

export const TICKET_MAX_TITLE = 120;
export const TICKET_MAX_DESCRIPTION = 4000;
export const TICKET_MAX_MESSAGE = 4000;
export const TICKET_MAX_IMAGES = 3;
export const TICKET_IMAGE_MAX_BYTES = 5 * 1024 * 1024; // 5 MB

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
  "resume-creation": 1,
  "resume-adaptation": 1,
  "resume-editor": 1,
  "career-roadmap": 20,
  "cover-letter": 1,
  "company-analysis": 1,
};

// ==================== Credit Packs ====================
export type CreditPackId = "starter" | "plus" | "pro";

export interface CreditPack {
  id: CreditPackId;
  name: string;
  price: number;
  baseCredits: number;
  bonusCredits: number;
  totalCredits: number;
  features: string[];
}

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: "starter",
    name: "Pacote Inicial",
    price: 10,
    baseCredits: 5,
    bonusCredits: 0,
    totalCredits: 5,
    features: [
      "5 moedas",
      "Acesso a todas as funcionalidades",
    ],
  },
  {
    id: "plus",
    name: "Pacote Plus",
    price: 30,
    baseCredits: 15,
    bonusCredits: 5,
    totalCredits: 20,
    features: [
      "15 moedas + 5 bônus",
      "Total de 20 moedas",
      "Acesso a todas as funcionalidades",
    ],
  },
  {
    id: "pro",
    name: "Pacote Pro",
    price: 50,
    baseCredits: 25,
    bonusCredits: 15,
    totalCredits: 40,
    features: [
      "25 moedas + 15 bônus",
      "Total de 40 moedas",
      "Acesso a todas as funcionalidades",
    ],
  },
];
