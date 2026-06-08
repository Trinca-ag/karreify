import { adminDb } from "@/lib/firebase-admin";
import { FieldValue, Timestamp, type Transaction } from "firebase-admin/firestore";
import { AUDIT_SYSTEM_ACTOR } from "@/types";

/**
 * Soma os créditos GASTOS pelo usuário desde um instante (a data da compra).
 * Conta apenas débitos de consumo (type 'debit'), excluindo estornos
 * (feature 'refund'). É a medida de "% de créditos usados" do reembolso — a
 * interpretação escolhida: consumo no ledger após a compra. Janela ≤7 dias,
 * então o volume lido é pequeno. Range simples em createdAt usa o índice
 * automático (sem índice composto).
 */
export async function creditsUsedSince(uid: string, since: Timestamp): Promise<number> {
  const snap = await adminDb
    .collection("users")
    .doc(uid)
    .collection("transactions")
    .where("createdAt", ">=", since)
    .get();
  let used = 0;
  for (const d of snap.docs) {
    const t = d.data();
    // Pula os estornos de COMPRA (feature 'refund', escritos por applyPurchaseReversal).
    if (t.feature === "refund") continue;
    const amount = (t.amount as number | undefined) ?? 0;
    // Débitos somam consumo; já as devoluções por FALHA de feature
    // (refundCreditsServer grava type 'refund' mantendo o feature original)
    // restituem crédito → subtraem do consumo.
    if (t.type === "debit") used += amount;
    else if (t.type === "refund") used -= amount;
  }
  return Math.max(0, used);
}

export interface ReversalResult {
  creditsRemoved: number;
  clawback: { referrerUid: string; amountCents: number; wasHeld: boolean } | null;
}

/**
 * Reverte uma compra concluída DENTRO de uma transação já aberta:
 *  - remove os créditos do comprador (clamp em 0 — não cobramos o que ele já gastou);
 *  - se a compra gerou comissão ainda ativa, estorna-a do indicador: debita
 *    `pendingCents` se ainda retida, ou `balanceCents` se já liberada — neste caso
 *    PERMITINDO saldo negativo (por design do spec).
 * Escreve os ledgers (créditos + carteira) e a auditoria.
 *
 * NÃO altera o status do pendingPayment nem o doc de reembolso — isso é do
 * chamador (webhook de estorno do gateway OU processamento admin), que detém a
 * guarda de idempotência (`pendingPayments.status === 'refunded'`).
 *
 * Requisito Firestore: todas as leituras aqui ocorrem antes de qualquer escrita;
 * o chamador só pode ter LIDO (não escrito) antes de invocar esta função.
 */
export async function applyPurchaseReversal(
  tx: Transaction,
  paymentId: string,
  pending: Record<string, unknown>
): Promise<ReversalResult> {
  const userId = pending.userId as string;
  const creditsToRemove = (pending.creditsToAdd as number | undefined) ?? 0;

  const userRef = adminDb.collection("users").doc(userId);
  const commissionRef = adminDb.collection("commissions").doc(paymentId);

  // ---- leituras (todas antes de qualquer escrita) ----
  const [userSnap, commissionSnap] = await tx.getAll(userRef, commissionRef);
  const commission = commissionSnap.exists ? commissionSnap.data()! : null;
  const commissionActive =
    !!commission &&
    commission.status !== "reversed" &&
    commission.status !== "cancelled";
  const referrerUid = commissionActive ? (commission!.referrerUid as string) : null;

  let walletExists = false;
  if (referrerUid) {
    const walletSnap = await tx.get(adminDb.collection("wallets").doc(referrerUid));
    walletExists = walletSnap.exists;
  }

  // ---- escritas ----
  let creditsRemoved = 0;
  if (userSnap.exists) {
    const cur = (userSnap.data()?.credits as number | undefined) ?? 0;
    const next = Math.max(0, cur - creditsToRemove);
    creditsRemoved = cur - next;
    tx.update(userRef, { credits: next, updatedAt: new Date() });
    if (creditsRemoved > 0) {
      tx.set(userRef.collection("transactions").doc(), {
        amount: creditsRemoved,
        type: "refund",
        feature: "refund",
        description: "Estorno — compra reembolsada",
        paymentId,
        createdAt: FieldValue.serverTimestamp(),
      });
    }
  }

  let clawback: ReversalResult["clawback"] = null;
  if (referrerUid && commission) {
    const amountCents = (commission.amountCents as number | undefined) ?? 0;
    const wasHeld = commission.status === "held";
    const walletRef = adminDb.collection("wallets").doc(referrerUid);

    if (walletExists) {
      if (wasHeld) {
        // Ainda retida → tira da reserva pendente.
        tx.update(walletRef, {
          pendingCents: FieldValue.increment(-amountCents),
          totalEarnedCents: FieldValue.increment(-amountCents),
          updatedAt: new Date(),
        });
      } else {
        // Já liberada → debita o saldo disponível, PODENDO ir negativo.
        tx.update(walletRef, {
          balanceCents: FieldValue.increment(-amountCents),
          totalEarnedCents: FieldValue.increment(-amountCents),
          updatedAt: new Date(),
        });
      }
      tx.set(walletRef.collection("walletTransactions").doc(), {
        amountCents: -amountCents,
        type: "commission-clawback",
        refType: "refund",
        refId: paymentId,
        sourcePaymentId: paymentId,
        description: "Estorno de comissão — compra reembolsada",
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    tx.update(commissionRef, {
      status: "reversed",
      reversedAt: FieldValue.serverTimestamp(),
      reversalReason: "purchase-refunded",
    });

    tx.set(adminDb.collection("auditLogs").doc(), {
      actorUid: AUDIT_SYSTEM_ACTOR,
      actorType: "system",
      action: "commission.reversed",
      targetType: "commission",
      targetId: paymentId,
      affectedUid: referrerUid,
      amountCents,
      metadata: { wasHeld, sourcePaymentId: paymentId },
      notes: null,
      createdAt: FieldValue.serverTimestamp(),
    });

    clawback = { referrerUid, amountCents, wasHeld };
  }

  return { creditsRemoved, clawback };
}
