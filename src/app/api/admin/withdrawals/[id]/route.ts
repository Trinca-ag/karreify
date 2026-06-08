import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/utils/admin-verify";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue, type Transaction } from "firebase-admin/firestore";
import { adminGuardError } from "@/lib/admin-referrals-server";
import { createWalletNotification } from "@/lib/notifications-server";
import { sendTransactionalEmail } from "@/lib/mailer";
import {
  withdrawalStatusEmail,
  withdrawalStatusEmailText,
} from "@/utils/email-templates";

export const dynamic = "force-dynamic";

type Decision = "approved" | "paid" | "rejected";

function writeAudit(
  tx: Transaction,
  actorUid: string,
  action: string,
  targetId: string,
  affectedUid: string,
  amountCents: number,
  notes?: string
) {
  tx.set(adminDb.collection("auditLogs").doc(), {
    actorUid,
    actorType: "admin",
    action,
    targetType: "withdrawal",
    targetId,
    affectedUid,
    amountCents,
    metadata: {},
    notes: notes || null,
    createdAt: FieldValue.serverTimestamp(),
  });
}

/**
 * Ações administrativas sobre um saque: approve (aprovar), pay (marcar como
 * pago — pagamento PIX é manual), reject (recusar — devolve o valor reservado).
 * Cada ação é guardada por status (idempotência) e roda em transação.
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  let admin;
  try {
    admin = await verifyAdminRequest(request);
  } catch (error) {
    return adminGuardError(error, "[admin/withdrawals/action]");
  }

  const id = params.id;
  let body: { action?: string; payoutRef?: string; reason?: string };
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const action = body.action ?? "";
  if (!id || !["approve", "pay", "reject"].includes(action)) {
    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  }
  const payoutRef = typeof body.payoutRef === "string" ? body.payoutRef.trim().slice(0, 200) : "";
  const reason = typeof body.reason === "string" ? body.reason.trim().slice(0, 500) : "";

  try {
    const withdrawalRef = adminDb.collection("withdrawals").doc(id);

    const result = await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(withdrawalRef);
      if (!snap.exists) return { code: "not-found" as const };
      const w = snap.data()!;
      const status = w.status as string;
      const uid = w.uid as string;
      const amountCents = (w.amountCents as number | undefined) ?? 0;
      const walletRef = adminDb.collection("wallets").doc(uid);

      if (action === "approve") {
        if (status !== "requested") return { code: "conflict" as const, status };
        tx.update(withdrawalRef, {
          status: "approved",
          decidedBy: admin.uid,
          decidedAt: FieldValue.serverTimestamp(),
        });
        writeAudit(tx, admin.uid, "withdrawal.approved", id, uid, amountCents);
        return { code: "ok" as const, decision: "approved" as Decision, uid, amountCents };
      }

      if (action === "pay") {
        if (status !== "requested" && status !== "approved") {
          return { code: "conflict" as const, status };
        }
        const walletSnap = await tx.get(walletRef); // leitura antes das escritas
        tx.update(withdrawalRef, {
          status: "paid",
          payoutRef: payoutRef || null,
          paidAt: FieldValue.serverTimestamp(),
          decidedBy: admin.uid,
          decidedAt: FieldValue.serverTimestamp(),
        });
        // O valor já foi reservado (debitado) no pedido; aqui só confirmamos a
        // saída no acumulado de sacado.
        if (walletSnap.exists) {
          tx.update(walletRef, {
            totalWithdrawnCents: FieldValue.increment(amountCents),
            updatedAt: new Date(),
          });
        }
        writeAudit(tx, admin.uid, "withdrawal.paid", id, uid, amountCents, payoutRef || undefined);
        return { code: "ok" as const, decision: "paid" as Decision, uid, amountCents };
      }

      // reject — devolve o valor reservado ao saldo.
      if (status !== "requested" && status !== "approved") {
        return { code: "conflict" as const, status };
      }
      const walletSnap = await tx.get(walletRef);
      tx.update(withdrawalRef, {
        status: "rejected",
        rejectReason: reason || null,
        decidedBy: admin.uid,
        decidedAt: FieldValue.serverTimestamp(),
      });
      if (walletSnap.exists) {
        tx.update(walletRef, {
          balanceCents: FieldValue.increment(amountCents),
          updatedAt: new Date(),
        });
        tx.set(walletRef.collection("walletTransactions").doc(), {
          amountCents,
          type: "withdrawal-refund",
          refType: "withdrawal",
          refId: id,
          description: "Devolução de saque recusado",
          createdAt: FieldValue.serverTimestamp(),
        });
      }
      writeAudit(tx, admin.uid, "withdrawal.rejected", id, uid, amountCents, reason || undefined);
      return { code: "ok" as const, decision: "rejected" as Decision, uid, amountCents };
    });

    if (result.code === "not-found") {
      return NextResponse.json({ error: "Saque não encontrado" }, { status: 404 });
    }
    if (result.code === "conflict") {
      return NextResponse.json(
        { error: `Operação não permitida: saque está '${result.status}'` },
        { status: 409 }
      );
    }

    await notifyWithdrawal(id, result.decision, result.uid, result.amountCents, {
      reason,
      payoutRef,
    }).catch((e) => console.error("[admin/withdrawals] notify failed:", e));

    return NextResponse.json({ ok: true, status: result.decision });
  } catch (error) {
    return adminGuardError(error, "[admin/withdrawals/action]");
  }
}

async function notifyWithdrawal(
  id: string,
  decision: Decision,
  uid: string,
  amountCents: number,
  opts: { reason?: string; payoutRef?: string }
) {
  const userSnap = await adminDb.collection("users").doc(uid).get();
  const u = userSnap.data() ?? {};
  const email = (u.email as string | undefined) ?? null;
  const name = (u.displayName as string | undefined) || (email ? email.split("@")[0] : "Usuário");
  const reais = `R$ ${(amountCents / 100).toFixed(2).replace(".", ",")}`;

  const title: Record<Decision, string> = {
    approved: "Saque aprovado",
    paid: "Saque pago",
    rejected: "Saque recusado",
  };
  const message: Record<Decision, string> = {
    approved: `Seu saque de ${reais} foi aprovado e será pago em breve.`,
    paid: `Seu saque de ${reais} foi pago via PIX.`,
    rejected: `Seu saque de ${reais} foi recusado e o valor voltou ao seu saldo disponível.`,
  };

  await createWalletNotification({
    uid,
    type: "withdrawal-status",
    title: title[decision],
    message: message[decision],
    amountCents,
    walletEventStatus: decision,
    relatedId: id,
  });

  if (email) {
    await sendTransactionalEmail({
      to: email,
      subject: `${title[decision]} — Karreify`,
      html: withdrawalStatusEmail(name, decision, amountCents, opts),
      text: withdrawalStatusEmailText(name, decision, amountCents, opts),
    });
  }
}
