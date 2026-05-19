import { type CreditPackId } from "@/types";
import { authedFetch } from "@/lib/api-client";
import { invalidateUser } from "@/lib/cache";

export async function purchasePack(userId: string, packId: CreditPackId): Promise<void> {
  const res = await authedFetch("/api/credits/purchase", {
    method: "POST",
    body: JSON.stringify({ packId }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data?.error || "Erro ao processar compra");
  }
  invalidateUser(userId);
}
