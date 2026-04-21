import { addCredits } from "@/services/credits";
import { invalidateUser } from "@/lib/cache";
import { CREDIT_PACKS, type CreditPackId } from "@/types";

export async function purchasePack(
  userId: string,
  packId: CreditPackId
): Promise<void> {
  const pack = CREDIT_PACKS.find((p) => p.id === packId);
  if (!pack) throw new Error("Pacote não encontrado");

  const description = pack.bonusCredits > 0
    ? `Compra do ${pack.name} — ${pack.baseCredits} moedas + ${pack.bonusCredits} bônus`
    : `Compra do ${pack.name} — ${pack.baseCredits} moedas`;

  await addCredits(userId, pack.totalCredits, description);

  invalidateUser(userId);
}
