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
  /** Set true once the 15-credit welcome bonus has been granted. Guards the
   *  idempotent top-up so it never double-grants (new signups + backfill). */
  welcomeCreditsGranted?: boolean;
  /** Epoch ms; while greater than Date.now(), the user can search jobs freely. */
  jobsPassExpiresAt?: number | null;
  jobsPassType?: JobsPassId | null;
  /** Buscas gratuitas usadas na janela atual (sem passe). */
  freeSearchCount?: number;
  /** Epoch ms da última busca gratuita; a janela de 24h é contada a partir daqui. */
  freeSearchLastAt?: number;
  /** Código de indicação próprio do usuário (gerado no servidor; base do link
   *  compartilhável em /profile). Imutável depois de gerado. */
  referralCode?: string;
  /** uid do indicador. Definido UMA única vez no cadastro (server-only) e nunca
   *  alterado depois. null quando o usuário não veio por indicação. */
  referredBy?: string | null;
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
  | "feedback-thanks"
  // Sistema de indicação / carteira
  | "referral-signup"      // alguém se cadastrou pelo seu link
  | "referral-bonus"       // você recebeu +5 créditos de indicação
  | "commission"           // comissão recebida / liberada / cancelada / estornada
  | "withdrawal-status"    // saque solicitado / aprovado / pago / recusado
  | "refund-status";       // reembolso solicitado / aprovado / recusado

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

  // referral / wallet events only
  /** Valor financeiro envolvido, em centavos (comissão, saque, reembolso). */
  amountCents?: number;
  /** Sub-status do evento financeiro, para a UI escolher copy/ícone/cor. */
  walletEventStatus?:
    | "held"
    | "released"
    | "reversed"
    | "cancelled"
    | "requested"
    | "approved"
    | "paid"
    | "rejected"
    | "processed";
  /** id do registro relacionado (comissão / saque / reembolso / indicação),
   *  usado para deep-link ao abrir a notificação. */
  relatedId?: string;
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
  // 'refund' já é gravado pelo credits-server e pelo webhook AbacatePay; a
  // união declara os três para refletir o que o código realmente escreve.
  type: "debit" | "credit" | "refund";
  feature: string;
  description: string;
  createdAt: Date;
}

export const FEATURE_COSTS: Record<string, number> = {
  "resume-analysis": 5,
  "resume-creation": 10,
  "resume-adaptation": 15,
  "cover-letter": 10,
  "company-analysis": 5,
};

/** Bônus de boas-vindas concedido uma única vez por conta (novos cadastros e
 *  backfill das contas já existentes, via top-up idempotente no login).
 *  Fonte única da verdade — usar também na copy de marketing. */
export const WELCOME_CREDITS = 15;

/** Formatado para UI: "5 créditos" / "1 crédito". Use sempre em vez de
 *  hardcoded — qualquer mudança de preço passa a refletir automaticamente. */
export function featureCostLabel(feature: string): string {
  const cost = FEATURE_COSTS[feature] ?? 1;
  return `${cost} crédito${cost === 1 ? "" : "s"}`;
}

// ==================== Credit Packs ====================
export type CreditPackId = "test" | "basic" | "intermediary" | "plus";

export interface CreditPack {
  id: CreditPackId;
  name: string;
  /** R$ value */
  price: number;
  baseCredits: number;
  bonusCredits: number;
  totalCredits: number;
  /** AbacatePay product id (prod_*). Source of truth for the actual price charged. */
  abacateProductId: string;
  /** Pacote de teste (R$1) — exibido com badge "TESTE", fora do grid principal. */
  isTest?: boolean;
  features: string[];
}

export const CREDIT_PACKS: CreditPack[] = [
  // Pacote de teste de R$1 — OCULTO. Descomente o objeto abaixo para reexibir o
  // card "TESTE" na /plans e validar o fluxo de ponta a ponta (indicação →
  // comissão de R$ 0,25, já configurada em COMMISSION_BY_PACK_CENTS.test).
  // Antes de reativar, garanta que `abacateProductId` aponta para um produto de
  // R$1 existente na conta/chave atual do AbacatePay.
  // {
  //   id: "test",
  //   name: "Karreify Teste",
  //   price: 1,
  //   baseCredits: 1,
  //   bonusCredits: 0,
  //   totalCredits: 1,
  //   abacateProductId: "prod_YNBckch4wYfDQRmH3mrRDAQp",
  //   isTest: true,
  //   features: [
  //     "1 moeda",
  //     "Apenas para validar fluxo de pagamento",
  //   ],
  // },
  {
    id: "basic",
    name: "Básico",
    price: 14.9,
    baseCredits: 50,
    bonusCredits: 0,
    totalCredits: 50,
    abacateProductId: "prod_BXejKjLYMM13ppK5LQC02UbP",
    features: [
      "50 moedas",
      "Acesso a todas as funcionalidades",
    ],
  },
  {
    id: "intermediary",
    name: "Intermediário",
    price: 29.9,
    baseCredits: 100,
    bonusCredits: 20,
    totalCredits: 120,
    abacateProductId: "prod_ef5KjBbRZr1Kq1WdNk0WHqLj",
    features: [
      "100 moedas + 20 bônus",
      "Total de 120 moedas",
      "Acesso a todas as funcionalidades",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    price: 59.9,
    baseCredits: 200,
    bonusCredits: 50,
    totalCredits: 250,
    abacateProductId: "prod_c6SruhB2k4qd0AgKM24uwJpp",
    features: [
      "200 moedas + 50 bônus",
      "Total de 250 moedas",
      "Acesso a todas as funcionalidades",
    ],
  },
];

// ==================== Jobs Free Tier ====================
/** Buscas gratuitas (sem passe) por janela. Paginar entre páginas de uma busca
 *  NÃO consome busca — só conta a busca inicial (page 1). */
export const FREE_SEARCH_LIMIT = 3;
/** Janela de 24h contada a partir da última busca gratuita. Esgotadas as 3,
 *  a próxima só libera 24h após a última; passado esse prazo, volta para 3. */
export const FREE_SEARCH_WINDOW_MS = 24 * 60 * 60 * 1000;
/** Teto de segurança (invisível) por dia para quem tem passe ativo. A UI
 *  promete "buscas ilimitadas"; este teto só existe para proteger a cota das
 *  APIs de vagas (Jooble/Adzuna) contra abuso. Nenhum usuário real se aproxima. */
export const PASS_DAILY_SAFETY_CAP = 100;

// ==================== Jobs Passes ====================
/**
 * Passe pago em moedas que libera buscas de vagas ILIMITADAS na /jobs por um
 * período (sem o limite gratuito de 3/dia). Sem cobrança recorrente — o
 * usuário compra de novo quando expirar.
 */
export type JobsPassId = "weekly" | "monthly";

export interface JobsPass {
  id: JobsPassId;
  name: string;
  /** Cost in Karreify credits (moedas). */
  cost: number;
  /** Duration in milliseconds added to expiry when the pass is purchased. */
  durationMs: number;
  description: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export const JOBS_PASSES: JobsPass[] = [
  {
    id: "weekly",
    name: "Passe semanal",
    cost: 60,
    durationMs: 7 * DAY_MS,
    description: "7 dias de acesso · buscas ilimitadas",
  },
  {
    id: "monthly",
    name: "Passe mensal",
    cost: 150,
    durationMs: 30 * DAY_MS,
    description: "30 dias de acesso · buscas ilimitadas",
  },
];

// ==================== Pending Payments ====================
export type PendingPaymentStatus = "pending" | "completed" | "refunded" | "disputed" | "failed";

export interface PaymentErrorEntry {
  source: string;
  code: string;
  message: string;
  /** Timestamp em ISO string (gravado pelo servidor). */
  timestamp: string;
  /** Identificador do evento do AbacatePay (quando vier do webhook). */
  event?: string;
  httpStatus?: number;
  /** Corpo da resposta do AbacatePay, truncado. */
  body?: string;
  /** Stack trace truncado, quando aplicável. */
  stack?: string | null;
}

export interface PendingPayment {
  id: string;
  userId: string;
  packId: CreditPackId;
  abacateCheckoutId: string;
  abacateProductId: string;
  amount: number;
  creditsToAdd: number;
  /** uid do indicador do comprador no momento do checkout (copiado de
   *  users.referredBy). Permite ao webhook gerar a comissão sem reler o doc do
   *  usuário, e congela a atribuição no instante da compra. */
  referredBy?: string | null;
  status: PendingPaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date | null;
  refundedAt?: Date | null;
  errors?: PaymentErrorEntry[];
  lastError?: PaymentErrorEntry | null;
}

// ==================== Sistema de Indicação / Carteira ====================
// Regras de dinheiro deste módulo:
//  • Toda mutação financeira é server-only (Admin SDK), dentro de runTransaction,
//    com guarda de idempotência por status + escrita de um ledger imutável.
//  • Valores em dinheiro são SEMPRE armazenados em centavos inteiros (…Cents)
//    para evitar erro de ponto flutuante; reais só na exibição.

/** Converte centavos (int) → reais (number). Use apenas para exibição/cálculo de
 *  display; nunca persista reais decimais em campos da carteira. */
export const centsToReais = (cents: number): number => cents / 100;

/** Créditos concedidos ao indicador quando um novo usuário se cadastra pelo seu
 *  link de indicação. Concedido uma única vez por indicado. */
export const REFERRAL_CREDITS = 5;

/** Janela após o cadastro em que a indicação ainda pode ser atribuída. Cadastros
 *  legítimos atribuem em segundos; isto garante fidelidade ao "nova pessoa se
 *  cadastrar" — contas antigas não podem ser atribuídas a um indicador depois. */
export const REFERRAL_ATTRIBUTION_WINDOW_MS = 24 * 60 * 60 * 1000; // 24h

/** Comissão em dinheiro (centavos) paga ao indicador quando o indicado compra um
 *  pacote. Valor FIXO por pacote (não percentual). Pacotes sem comissão = 0. */
export const COMMISSION_BY_PACK_CENTS: Record<CreditPackId, number> = {
  test: 25, // R$ 1,00 → R$ 0,25
  basic: 440, // R$ 14,90 → R$ 4,40
  intermediary: 890, // R$ 29,90 → R$ 8,90
  plus: 1790, // R$ 59,90 → R$ 17,90
};

/** Dias que a comissão fica retida (held) antes de liberar automaticamente para
 *  saque. A liberação é feita por um cron diário (Fase 4). */
export const COMMISSION_HOLD_DAYS = 8;
export const COMMISSION_HOLD_MS = COMMISSION_HOLD_DAYS * 24 * 60 * 60 * 1000;

/** Conversão carteira → créditos: cada crédito custa R$ 3,00 (300 centavos).
 *  creditsToAdd = floor(balanceCents / WALLET_CENTS_PER_CREDIT); o resto fica na
 *  carteira (deduz-se exatamente creditsToAdd * 300). Conversão é irreversível. */
export const WALLET_CENTS_PER_CREDIT = 300;

/** Limites de saque (centavos). */
export const WITHDRAW_MIN_CENTS = 3000; // R$ 30,00
export const WITHDRAW_MAX_CENTS = 100000; // R$ 1.000,00
/** Quantos saques o usuário pode SOLICITAR por dia. */
export const WITHDRAW_MAX_PER_DAY = 1;
/** Intervalo mínimo entre solicitações de saque — implementa o "1 saque por dia"
 *  como janela de 24h a partir da última solicitação (checado server-side). */
export const WITHDRAW_COOLDOWN_MS = 24 * 60 * 60 * 1000;

/** Reembolso: janela de elegibilidade em dias a partir da compra. */
export const REFUND_WINDOW_DAYS = 7;
export const REFUND_WINDOW_MS = REFUND_WINDOW_DAYS * 24 * 60 * 60 * 1000;
/** Reembolso bloqueado quando ≥ 30% dos créditos do pacote já foram consumidos.
 *  O consumo é medido pela soma dos débitos no ledger após a data da compra. */
export const REFUND_MAX_CREDITS_USED_PCT = 0.3;

/** Tipos de chave PIX aceitos numa solicitação de saque. */
export type PixKeyType = "cpf" | "cnpj" | "email" | "phone" | "random";

// ---- Indicação (vínculo indicador ↔ indicado) ----
export type ReferralStatus =
  | "attributed" // vínculo criado no cadastro
  | "converted"; // indicado fez a primeira compra paga

export interface Referral {
  id: string;
  referrerUid: string;
  referredUid: string;
  /** Código usado no cadastro (== referralCode do indicador). */
  code: string;
  status: ReferralStatus;
  /** Guarda de idempotência do bônus +5 (concedido uma única vez). */
  signupBonusGranted: boolean;
  convertedAt?: Date | null;
  createdAt: Date;
}

// ---- Carteira (saldo em dinheiro, separado dos créditos) ----
export interface Wallet {
  uid: string;
  /** Disponível para saque agora (pós-liberação). Centavos. PODE ficar negativo
   *  após estorno de reembolso (bloqueia novos saques até regularizar). */
  balanceCents: number;
  /** Comissões ainda retidas na janela de 8 dias (não sacáveis). Centavos. */
  pendingCents: number;
  /** Acumulado vitalício de comissões recebidas. Centavos (analytics). */
  totalEarnedCents: number;
  /** Total já sacado (somatório de saques pagos). Centavos. */
  totalWithdrawnCents: number;
  /** Total convertido em créditos. Centavos. */
  totalConvertedCents: number;
  /** Epoch ms da última solicitação de saque (impõe o limite de 1/24h). */
  lastWithdrawalAt?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type WalletTxType =
  | "commission-pending" // comissão criada → entra em pendingCents
  | "commission-released" // liberada após 8 dias → pendingCents vira balanceCents
  | "commission-clawback" // estorno por reembolso → debita (pode ir negativo)
  | "withdrawal-reserve" // reserva ao solicitar saque → debita balanceCents
  | "withdrawal-refund" // devolução por saque recusado → credita de volta
  | "credit-conversion"; // conversão carteira → créditos → debita balanceCents

/** Ledger imutável da carteira (append-only), espelhando users/{uid}/transactions.
 *  O status do registro financeiro mora na comissão/saque/reembolso; o ledger só
 *  guarda o movimento assinado. */
export interface WalletTransaction {
  id: string;
  /** Assinado: + entradas, − saídas. Centavos. */
  amountCents: number;
  type: WalletTxType;
  refType: "commission" | "withdrawal" | "refund" | "conversion";
  /** id do doc relacionado (commission / withdrawal / refund / conversion). */
  refId: string;
  /** id do pendingPayments que originou (join de idempotência), quando aplicável. */
  sourcePaymentId?: string;
  description: string;
  createdAt: Date;
}

// ---- Comissões ----
export type CommissionStatus =
  | "held" // retida na janela de 8 dias
  | "released" // liberada para saque
  | "reversed" // estornada por reembolso da compra
  | "cancelled"; // cancelada manualmente pelo admin

export interface Commission {
  /** Doc id == sourcePaymentId (chave de deduplicação). */
  id: string;
  referralId: string;
  referrerUid: string;
  referredUid: string;
  /** id do pendingPayments que originou a comissão. */
  sourcePaymentId: string;
  packId: CreditPackId;
  /** Valor da comissão em centavos (fixo por pacote — COMMISSION_BY_PACK_CENTS). */
  amountCents: number;
  status: CommissionStatus;
  /** Epoch ms em que a comissão libera para saque (completedAt + 8 dias). */
  holdUntil: number;
  releasedAt?: Date | null;
  reversedAt?: Date | null;
  reversalReason?: string | null;
  createdAt: Date;
}

// ---- Saques (PIX) ----
export type WithdrawalStatus =
  | "requested" // aguardando análise do admin (saldo já reservado)
  | "approved" // aprovado, aguardando pagamento manual
  | "paid" // PIX efetuado pelo admin
  | "rejected"; // recusado (saldo devolvido)

export interface Withdrawal {
  id: string;
  uid: string;
  /** Valor solicitado em centavos (reservado do balanceCents ao solicitar). */
  amountCents: number;
  pixKey: string;
  pixKeyType: PixKeyType;
  status: WithdrawalStatus;
  requestedAt: Date;
  decidedBy?: string | null; // admin uid que aprovou/recusou
  decidedAt?: Date | null;
  rejectReason?: string | null;
  paidAt?: Date | null;
  /** Comprovante/identificador do PIX, preenchido manualmente pelo admin ao pagar. */
  payoutRef?: string | null;
}

// ---- Reembolsos ----
export type RefundStatus =
  | "requested" // aguardando análise do admin
  | "approved" // aprovado (será processado)
  | "rejected" // recusado
  | "processed"; // créditos removidos + comissão estornada

export interface Refund {
  id: string;
  /** id do pendingPayments da compra a reembolsar. */
  paymentId: string;
  uid: string;
  packId: CreditPackId;
  /** Valor pago na compra, em centavos. */
  amountCents: number;
  /** Créditos concedidos pela compra (pack.totalCredits). */
  creditsGranted: number;
  /** Créditos consumidos desde a compra, calculados no momento da solicitação. */
  creditsUsedAtRequest: number;
  status: RefundStatus;
  reason?: string | null;
  decidedBy?: string | null;
  decidedAt?: Date | null;
  /** true quando a comissão correspondente foi estornada no processamento. */
  commissionClawedBack?: boolean;
  createdAt: Date;
}

// ---- Auditoria financeira ----
export type AuditActorType = "system" | "admin" | "cron" | "user";

/** Identificadores fixos de ator para operações não-humanas. */
export const AUDIT_SYSTEM_ACTOR = "system";
export const AUDIT_CRON_ACTOR = "cron";

export interface AuditLog {
  id: string;
  /** Quem disparou a operação (uid do admin/usuário, ou um id fixo de sistema/cron). */
  actorUid: string;
  actorType: AuditActorType;
  /** Ação canônica, ex.: 'commission.created', 'withdrawal.paid', 'refund.approved'. */
  action: string;
  targetType: "commission" | "withdrawal" | "refund" | "wallet" | "referral";
  targetId: string;
  /** Usuário afetado pela operação (dono da carteira/comissão), quando aplicável. */
  affectedUid?: string | null;
  /** Valor envolvido em centavos, quando aplicável. */
  amountCents?: number | null;
  metadata?: Record<string, unknown>;
  /** Observações administrativas livres. */
  notes?: string | null;
  createdAt: Date;
}
