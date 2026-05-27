import { type CreditPackId } from "@/types";
import { authedFetch } from "@/lib/api-client";

export interface CheckoutResult {
  /** URL hospedada do Abacate Pay para onde o user deve ser redirecionado. */
  url: string;
  /** ID interno do pendingPayment (também usado como externalId). */
  paymentId: string;
}

/**
 * Cria um checkout no Abacate Pay e retorna a URL para redirecionar o user.
 * As moedas só são creditadas quando o webhook confirmar o pagamento.
 */
export async function startCheckout(packId: CreditPackId): Promise<CheckoutResult> {
  const res = await authedFetch("/api/payments/checkout", {
    method: "POST",
    body: JSON.stringify({ packId }),
  });
  const data = await res.json();
  if (!res.ok || !data.success || !data.url) {
    throw new Error(data?.error || "Erro ao iniciar pagamento");
  }
  return { url: data.url, paymentId: data.paymentId };
}
