import crypto from "node:crypto";

const ABACATE_BASE_URL = "https://api.abacatepay.com/v2";

/**
 * Chave pública estática usada pela Abacate Pay pra assinar os webhooks.
 * Vem do exemplo oficial da doc — não é segredo, é a counterpart pública do
 * par de chaves que assina os eventos.
 */
const ABACATEPAY_PUBLIC_KEY =
  "t9dXRhHHo3yDEj5pVDYz0frf7q6bMKyMRmxxCPIPp3RCplBfXRxqlC6ZpiWmOqj4L63qEaeUOtrCI8P0VMUgo6iIga2ri9ogaHFs0WIIywSMg0q7RmBfybe1E5XJcfC4IW3alNqym0tXoAKkzvfEjZxV6bE0oG2zJrNNYmUCKZyV0KZ3JS8Votf9EAWWYdiDkMkpbMdPggfh1EqHlVkMiTady6jOR3hyzGEHrIz2Ret0xHKMbiqkr9HS1JhNHDX9";

export class AbacatePayError extends Error {
  status: number;
  body: string;
  constructor(message: string, status: number, body: string) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

function apiKey(): string {
  const key = process.env.ABACATEPAY_API_KEY;
  if (!key) {
    throw new Error("ABACATEPAY_API_KEY não configurada no .env.local");
  }
  return key;
}

export interface CreateCheckoutInput {
  productId: string;
  externalId: string;
  returnUrl: string;
  completionUrl: string;
  methods?: Array<"PIX" | "CARD">;
  metadata?: Record<string, string>;
  customer?: {
    name?: string;
    email?: string;
  };
}

export interface AbacateCheckout {
  id: string;
  externalId: string;
  url: string;
  amount: number;
  status: "PENDING" | "EXPIRED" | "CANCELLED" | "PAID" | "REFUNDED";
}

/**
 * Cria um checkout (cobrança única) no Abacate Pay. Retorna o URL pra onde
 * o user deve ser redirecionado pra concluir o pagamento.
 *
 * O valor cobrado é o preço cadastrado no produto (productId) — não passamos
 * preço aqui, o Abacate Pay lê do produto.
 */
export async function createCheckout(
  input: CreateCheckoutInput
): Promise<AbacateCheckout> {
  const body: Record<string, unknown> = {
    items: [{ id: input.productId, quantity: 1 }],
    externalId: input.externalId,
    returnUrl: input.returnUrl,
    completionUrl: input.completionUrl,
    methods: input.methods ?? ["PIX", "CARD"],
  };
  if (input.metadata) body.metadata = input.metadata;

  const res = await fetch(`${ABACATE_BASE_URL}/checkouts/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new AbacatePayError(
      `AbacatePay checkout failed (${res.status})`,
      res.status,
      text
    );
  }

  let parsed: { success?: boolean; data?: AbacateCheckout; error?: string | null };
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new AbacatePayError("AbacatePay returned non-JSON response", res.status, text);
  }

  if (!parsed.success || !parsed.data?.id || !parsed.data?.url) {
    throw new AbacatePayError(
      parsed.error || "AbacatePay returned success=false",
      res.status,
      text
    );
  }

  return parsed.data;
}

/**
 * Valida a assinatura HMAC-SHA256 enviada pelo Abacate Pay no header
 * `X-Webhook-Signature`. Usa a chave pública da Abacate como segredo do HMAC
 * e compara em timing-safe.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signatureFromHeader: string | null
): boolean {
  if (!signatureFromHeader) return false;

  const expected = crypto
    .createHmac("sha256", ABACATEPAY_PUBLIC_KEY)
    .update(Buffer.from(rawBody, "utf8"))
    .digest("base64");

  const a = Buffer.from(expected);
  const b = Buffer.from(signatureFromHeader);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export type AbacateWebhookEventType =
  | "checkout.completed"
  | "checkout.refunded"
  | "checkout.disputed";

export interface AbacateWebhookCheckout {
  id: string;
  externalId?: string;
  amount: number;
  paidAmount?: number | null;
  status: string;
  items?: Array<{ id: string; quantity: number }>;
}

export interface AbacateWebhookEvent {
  event: AbacateWebhookEventType;
  apiVersion?: number;
  devMode?: boolean;
  data: {
    checkout: AbacateWebhookCheckout;
    customer?: {
      id?: string;
      name?: string;
      email?: string;
      taxId?: string;
    };
    reason?: string;
  };
}
