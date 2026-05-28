/**
 * Sistema de consentimento de cookies — LGPD (Lei nº 13.709/2018)
 * e Guia de Cookies da ANPD (Autoridade Nacional de Proteção de Dados).
 *
 * Princípios aplicados:
 *  - Opt-in explícito por categoria (nenhuma categoria não essencial vem marcada).
 *  - "Rejeitar tudo" tão acessível quanto "Aceitar tudo".
 *  - Categoria essencial não pode ser desativada.
 *  - Revogação de consentimento a qualquer momento.
 *  - Registro auditável da decisão (versão + timestamp + ação).
 *  - Reapresentação periódica (a cada 6 meses).
 */

export const COOKIE_CONSENT_VERSION = 1;

/** Após esse período, o usuário é convidado a revisar sua decisão. */
export const COOKIE_CONSENT_TTL_DAYS = 180;

/** Chave usada no localStorage para o objeto completo de consentimento. */
export const CONSENT_STORAGE_KEY = "karreify_cookie_consent";

/**
 * Cookie compacto (legível pelo servidor) que resume a decisão.
 * Formato: `v{version}|{n}{f}{a}{m}|{timestamp}`
 * Ex.: `v1|1101|1717000000000` => versão 1, funcional+marketing on, analytics off.
 */
export const CONSENT_COOKIE_NAME = "karreify_consent";

export type CookieCategory =
  | "necessary"
  | "functional"
  | "analytics"
  | "marketing";

export type ConsentSource =
  | "accept-all"
  | "reject-all"
  | "custom"
  | "revoke"
  | "auto-expired";

export interface ConsentCategories {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface ConsentAuditEntry {
  at: number;
  source: ConsentSource;
  categories: ConsentCategories;
  version: number;
}

export interface CookieConsentState {
  version: number;
  decided: boolean;
  timestamp: number;
  categories: ConsentCategories;
  auditLog: ConsentAuditEntry[];
}

export const DEFAULT_CATEGORIES: ConsentCategories = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

export const ALL_ENABLED_CATEGORIES: ConsentCategories = {
  necessary: true,
  functional: true,
  analytics: true,
  marketing: true,
};

export function makeInitialState(): CookieConsentState {
  return {
    version: COOKIE_CONSENT_VERSION,
    decided: false,
    timestamp: 0,
    categories: { ...DEFAULT_CATEGORIES },
    auditLog: [],
  };
}

/* -------------------------------------------------------------------------- */
/*                                  Storage                                   */
/* -------------------------------------------------------------------------- */

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

export function loadConsent(): CookieConsentState {
  if (!isBrowser()) return makeInitialState();
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return makeInitialState();
    const parsed = JSON.parse(raw) as Partial<CookieConsentState>;

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof parsed.version !== "number"
    ) {
      return makeInitialState();
    }

    if (parsed.version !== COOKIE_CONSENT_VERSION) {
      // Política evoluiu: pedimos o consentimento de novo.
      return makeInitialState();
    }

    const expiresAt =
      (parsed.timestamp || 0) + COOKIE_CONSENT_TTL_DAYS * 24 * 60 * 60 * 1000;
    if (parsed.decided && Date.now() > expiresAt) {
      // Consentimento expirado: usuário precisa renovar.
      const expired = makeInitialState();
      const expiryEntry: ConsentAuditEntry = {
        at: Date.now(),
        source: "auto-expired",
        categories: { ...DEFAULT_CATEGORIES },
        version: COOKIE_CONSENT_VERSION,
      };
      expired.auditLog = [
        ...(parsed.auditLog ?? []),
        expiryEntry,
      ].slice(-20);
      return expired;
    }

    return {
      version: COOKIE_CONSENT_VERSION,
      decided: Boolean(parsed.decided),
      timestamp: parsed.timestamp ?? 0,
      categories: {
        necessary: true,
        functional: Boolean(parsed.categories?.functional),
        analytics: Boolean(parsed.categories?.analytics),
        marketing: Boolean(parsed.categories?.marketing),
      },
      auditLog: Array.isArray(parsed.auditLog) ? parsed.auditLog.slice(-20) : [],
    };
  } catch {
    return makeInitialState();
  }
}

export function saveConsent(state: CookieConsentState): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* armazenamento bloqueado (modo anônimo, cota cheia) — segue em memória */
  }
  writeServerCookie(state);
}

function writeServerCookie(state: CookieConsentState): void {
  if (!isBrowser()) return;
  const { categories, timestamp, version } = state;
  const flags = `${+categories.necessary}${+categories.functional}${+categories.analytics}${+categories.marketing}`;
  const value = `v${version}|${flags}|${timestamp}`;
  const maxAge = COOKIE_CONSENT_TTL_DAYS * 24 * 60 * 60;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
}

export function clearConsent(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    /* ignora */
  }
  document.cookie = `${CONSENT_COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;
}

/* -------------------------------------------------------------------------- */
/*                                  Mutations                                 */
/* -------------------------------------------------------------------------- */

function appendAudit(
  state: CookieConsentState,
  entry: ConsentAuditEntry
): ConsentAuditEntry[] {
  const next = [...state.auditLog, entry];
  return next.slice(-20);
}

export function acceptAll(prev: CookieConsentState): CookieConsentState {
  const now = Date.now();
  const next: CookieConsentState = {
    version: COOKIE_CONSENT_VERSION,
    decided: true,
    timestamp: now,
    categories: { ...ALL_ENABLED_CATEGORIES },
    auditLog: appendAudit(prev, {
      at: now,
      source: "accept-all",
      categories: { ...ALL_ENABLED_CATEGORIES },
      version: COOKIE_CONSENT_VERSION,
    }),
  };
  return next;
}

export function rejectAll(prev: CookieConsentState): CookieConsentState {
  const now = Date.now();
  const next: CookieConsentState = {
    version: COOKIE_CONSENT_VERSION,
    decided: true,
    timestamp: now,
    categories: { ...DEFAULT_CATEGORIES },
    auditLog: appendAudit(prev, {
      at: now,
      source: "reject-all",
      categories: { ...DEFAULT_CATEGORIES },
      version: COOKIE_CONSENT_VERSION,
    }),
  };
  return next;
}

export function customizeConsent(
  prev: CookieConsentState,
  picks: Partial<Omit<ConsentCategories, "necessary">>
): CookieConsentState {
  const now = Date.now();
  const merged: ConsentCategories = {
    necessary: true,
    functional: picks.functional ?? prev.categories.functional,
    analytics: picks.analytics ?? prev.categories.analytics,
    marketing: picks.marketing ?? prev.categories.marketing,
  };
  return {
    version: COOKIE_CONSENT_VERSION,
    decided: true,
    timestamp: now,
    categories: merged,
    auditLog: appendAudit(prev, {
      at: now,
      source: "custom",
      categories: merged,
      version: COOKIE_CONSENT_VERSION,
    }),
  };
}

export function revokeConsent(prev: CookieConsentState): CookieConsentState {
  const now = Date.now();
  return {
    version: COOKIE_CONSENT_VERSION,
    decided: false,
    timestamp: now,
    categories: { ...DEFAULT_CATEGORIES },
    auditLog: appendAudit(prev, {
      at: now,
      source: "revoke",
      categories: { ...DEFAULT_CATEGORIES },
      version: COOKIE_CONSENT_VERSION,
    }),
  };
}

/* -------------------------------------------------------------------------- */
/*                                Notificação                                 */
/* -------------------------------------------------------------------------- */

export const CONSENT_CHANGE_EVENT = "karreify:cookie-consent-changed";

export function dispatchConsentChange(state: CookieConsentState): void {
  if (!isBrowser()) return;
  window.dispatchEvent(
    new CustomEvent<CookieConsentState>(CONSENT_CHANGE_EVENT, { detail: state })
  );
}

/**
 * Helper síncrono para uso fora de React (ex.: gating de scripts).
 * Retorna `true` para "necessary" sempre.
 */
export function hasConsent(category: CookieCategory): boolean {
  if (category === "necessary") return true;
  if (!isBrowser()) return false;
  const state = loadConsent();
  if (!state.decided) return false;
  return Boolean(state.categories[category]);
}

/* -------------------------------------------------------------------------- */
/*                              Inventário visual                             */
/* -------------------------------------------------------------------------- */

export interface CategoryInfo {
  id: CookieCategory;
  title: string;
  shortTitle: string;
  summary: string;
  description: string;
  required: boolean;
  examples: string[];
}

export const CATEGORY_INFO: readonly CategoryInfo[] = [
  {
    id: "necessary",
    title: "Cookies estritamente necessários",
    shortTitle: "Necessários",
    summary:
      "Indispensáveis para o funcionamento básico do Karreify e para sua segurança.",
    description:
      "Garantem login, manutenção da sessão, prevenção de fraude e proteção contra abuso. Sem eles, recursos essenciais como autenticação, salvar conteúdo e finalização de compras param de funcionar. Não há base legal de consentimento — sustentam-se em execução de contrato (art. 7º, V, LGPD) e legítimo interesse para segurança (art. 7º, IX).",
    required: true,
    examples: [
      "Token de sessão Firebase Authentication",
      "Identificador anti-fraude por dispositivo",
      "Token CSRF de formulários sensíveis",
      "Decisão de consentimento de cookies",
    ],
  },
  {
    id: "functional",
    title: "Cookies funcionais",
    shortTitle: "Funcionais",
    summary:
      "Memorizam preferências para personalizar sua experiência.",
    description:
      "Lembram escolhas como tema visual, idioma, último filtro aplicado em /jobs, área de interesse e estado de banners dispensados. Não são essenciais — sua ausência apenas faz o produto reiniciar essas preferências a cada visita.",
    required: false,
    examples: [
      "Preferência de tema (dark/light)",
      "Cidade e área padrão na busca de vagas",
      "Banner de novidades já visto",
      "Última aba aberta no painel",
    ],
  },
  {
    id: "analytics",
    title: "Cookies analíticos e de desempenho",
    shortTitle: "Analíticos",
    summary:
      "Nos ajudam a entender (de forma anônima) como você usa o Karreify.",
    description:
      "Coletam métricas agregadas de navegação — páginas vistas, tempo médio, erros de UI — para identificar gargalos e priorizar melhorias. Não cruzamos esses dados com seu perfil pessoal nem os vendemos. Você pode desativar a qualquer momento.",
    required: false,
    examples: [
      "Eventos de uso de ferramentas com IA",
      "Mapas de clique e rolagem agregados",
      "Métricas de performance (Core Web Vitals)",
      "Funil de conversão de pacotes",
    ],
  },
  {
    id: "marketing",
    title: "Cookies de marketing e publicidade",
    shortTitle: "Marketing",
    summary:
      "Permitem mensurar campanhas e exibir conteúdo mais relevante.",
    description:
      "Identificam, sem revelar quem você é, como você chegou até nós (ex.: vindo de um anúncio) e ajudam a medir a eficiência das campanhas. Podem incluir cookies de terceiros — exclusivamente quando você consentir explicitamente nesta categoria.",
    required: false,
    examples: [
      "Atribuição de campanha (UTM persistente)",
      "Pixel de remarketing em redes sociais",
      "Eventos de conversão para meta-ads",
      "Identificador anônimo de afiliados",
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*                             Catálogo de cookies                            */
/* -------------------------------------------------------------------------- */

export interface CookieEntry {
  name: string;
  provider: string;
  category: CookieCategory;
  duration: string;
  purpose: string;
}

/** Catálogo exibido na página /cookies (transparência ANPD). */
export const COOKIE_INVENTORY: readonly CookieEntry[] = [
  {
    name: "karreify_consent",
    provider: "Karreify (próprio)",
    category: "necessary",
    duration: "6 meses",
    purpose:
      "Armazena sua decisão sobre o uso de cookies e a versão do consentimento.",
  },
  {
    name: "karreify_cookie_consent",
    provider: "Karreify (próprio, localStorage)",
    category: "necessary",
    duration: "6 meses",
    purpose:
      "Mantém o registro completo do consentimento, incluindo log de auditoria das suas escolhas.",
  },
  {
    name: "__session",
    provider: "Firebase Authentication",
    category: "necessary",
    duration: "Sessão / até logout",
    purpose:
      "Mantém você autenticado e protege contra sequestro de sessão.",
  },
  {
    name: "firebase:authUser:*",
    provider: "Firebase Authentication (localStorage)",
    category: "necessary",
    duration: "Até logout",
    purpose:
      "Persiste o usuário autenticado no navegador entre recargas da página.",
  },
  {
    name: "karreify_device_id",
    provider: "Karreify (próprio)",
    category: "necessary",
    duration: "12 meses",
    purpose:
      "Identificador anti-fraude que vincula a sessão ao dispositivo autorizado.",
  },
  {
    name: "karreify_theme",
    provider: "Karreify (próprio)",
    category: "functional",
    duration: "12 meses",
    purpose: "Lembra sua preferência de tema visual.",
  },
  {
    name: "karreify_jobs_filters",
    provider: "Karreify (próprio)",
    category: "functional",
    duration: "30 dias",
    purpose:
      "Memoriza filtros usados na busca de vagas (cidade, área, modalidade).",
  },
  {
    name: "karreify_dismissed_banners",
    provider: "Karreify (próprio)",
    category: "functional",
    duration: "90 dias",
    purpose: "Evita reapresentar banners e tutoriais já dispensados por você.",
  },
  {
    name: "karreify_analytics_id",
    provider: "Karreify (próprio)",
    category: "analytics",
    duration: "12 meses",
    purpose:
      "Identificador anônimo usado para mensurar uso agregado da plataforma.",
  },
  {
    name: "karreify_utm",
    provider: "Karreify (próprio)",
    category: "marketing",
    duration: "30 dias",
    purpose:
      "Atribui sua chegada ao canal de origem (campanhas UTM) para medir resultados.",
  },
];
