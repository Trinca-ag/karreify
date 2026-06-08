import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/utils/admin-verify";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { adminGuardError } from "@/lib/admin-referrals-server";
import { applyPurchaseReversal } from "@/lib/refund-server";
import { createWalletNotification } from "@/lib/notifications-server";
import { sendTransactionalEmail } from "@/lib/mailer";
import {
  refundStatusEmail,
  refundStatusEmailText,
  commissionReversedEmail,
  commissionReversedEmailText,
} from "@/utils/email-templates";
import { CREDIT_PACKS, type CreditPackId } from "@/types";

export const dynamic = "force-dynamic";

/**
 * Ações administrativas sobre um reembolso:
 *  - approve → PROCESSA: remove os créditos restantes do comprador e estorna a
 *    comissão do indicador (via applyPurchaseReversal), marca pendingPayment como
 *    'refunded' (idempotência compartilhada com o webhook) e o refund como
 *    'processed'.
 *  - reject → marca 'rejected' (sem efeito financeiro).
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  let admin;
  try {
    admin = await verifyAdminRequest(request);
  } catch (error) {
    return adminGuardError(error, "[admin/refunds/action]");
  }

  const id = params.id;
  let body: { action?: string; reason?: string };
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const action = body.action ?? "";
  if (!id || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  }
  const reason = typeof body.reason === "string" ? body.reason.trim().slice(0, 500) : "";

  try {
    const refundRef = adminDb.collection("refunds").doc(id);

    const result = await adminDb.runTransaction(async (tx) => {
      const refundSnap = await tx.get(refundRef);
      if (!refundSnap.exists) return { code: "not-found" as const };
      const refund = refundSnap.data()!;
      if (refund.status !== "requested") {
        return { code: "conflict" as const, status: refund.status as string };
      }

      const uid = refund.uid as string;
      const packId = refund.packId as CreditPackId;
      const amountCents = (refund.amountCents as number | undefined) ?? 0;

      if (action === "reject") {
        tx.update(refundRef, {
          status: "rejected",
          rejectReason: reason || null,
          decidedBy: admin.uid,
          decidedAt: FieldValue.serverTimestamp(),
        });
        tx.set(adminDb.collection("auditLogs").doc(), {
          actorUid: admin.uid,
          actorType: "admin",
          action: "refund.rejected",
          targetType: "refund",
          targetId: id,
          affectedUid: uid,
          amountCents,
          metadata: { packId },
          notes: reason || null,
          createdAt: FieldValue.serverTimestamp(),
        });
        return { code: "ok" as const, decision: "rejected" as const, uid, packId, amountCents, clawback: null };
      }

      // approve → processa
      const paymentId = (refund.paymentId as string | undefined) ?? id;
      const pendingRef = adminDb.collection("pendingPayments").doc(paymentId);
      const pendingSnap = await tx.get(pendingRef);
      if (!pendingSnap.exists) return { code: "no-pending" as const };
      const pending = pendingSnap.data()!;

      let clawback: { referrerUid: string; amountCents: number } | null = null;
      let clawedBack = false;
      // Se a compra ainda não foi revertida, reverte agora (créditos + comissão).
      if (pending.status !== "refunded") {
        const reversal = await applyPurchaseReversal(tx, paymentId, pending);
        clawback = reversal.clawback;
        clawedBack = !!reversal.clawback;
        tx.update(pendingRef, {
          status: "refunded",
          refundedAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
      } else {
        // Já revertida (provavelmente pelo webhook do gateway): reflete no flag se
        // a comissão correspondente foi de fato estornada — sem re-debitar.
        const commSnap = await tx.get(adminDb.collection("commissions").doc(paymentId));
        clawedBack = commSnap.exists && commSnap.data()?.status === "reversed";
      }

      tx.update(refundRef, {
        status: "processed",
        decidedBy: admin.uid,
        decidedAt: FieldValue.serverTimestamp(),
        commissionClawedBack: clawedBack,
      });
      tx.set(adminDb.collection("auditLogs").doc(), {
        actorUid: admin.uid,
        actorType: "admin",
        action: "refund.approved",
        targetType: "refund",
        targetId: id,
        affectedUid: uid,
        amountCents,
        metadata: { packId, paymentId, clawback: !!clawback },
        notes: reason || null,
        createdAt: FieldValue.serverTimestamp(),
      });

      return { code: "ok" as const, decision: "processed" as const, uid, packId, amountCents, clawback };
    });

    if (result.code === "not-found") {
      return NextResponse.json({ error: "Reembolso não encontrado" }, { status: 404 });
    }
    if (result.code === "no-pending") {
      return NextResponse.json({ error: "Compra relacionada não encontrada" }, { status: 404 });
    }
    if (result.code === "conflict") {
      return NextResponse.json(
        { error: `Operação não permitida: reembolso está '${result.status}'` },
        { status: 409 }
      );
    }

    // Notificações + e-mails (best-effort).
    await notifyRefund(result.decision, result.uid, result.packId, result.amountCents, reason)
      .catch((e) => console.error("[admin/refunds] buyer notify failed:", e));
    if (result.clawback) {
      await notifyClawback(result.packId, result.clawback)
        .catch((e) => console.error("[admin/refunds] clawback notify failed:", e));
    }

    return NextResponse.json({ ok: true, status: result.decision });
  } catch (error) {
    return adminGuardError(error, "[admin/refunds/action]");
  }
}

async function notifyRefund(
  decision: "processed" | "rejected",
  uid: string,
  packId: CreditPackId,
  amountCents: number,
  reason: string
) {
  const userSnap = await adminDb.collection("users").doc(uid).get();
  const u = userSnap.data() ?? {};
  const email = (u.email as string | undefined) ?? null;
  const name = (u.displayName as string | undefined) || (email ? email.split("@")[0] : "Usuário");
  const packName = CREDIT_PACKS.find((p) => p.id === packId)?.name ?? packId;
  const emailStatus = decision === "processed" ? "approved" : "rejected";

  await createWalletNotification({
    uid,
    type: "refund-status",
    title: decision === "processed" ? "Reembolso aprovado" : "Reembolso recusado",
    message:
      decision === "processed"
        ? `Seu reembolso da compra do ${packName} foi aprovado. Os créditos restantes foram removidos.`
        : `Seu pedido de reembolso da compra do ${packName} foi recusado.`,
    amountCents,
    walletEventStatus: decision,
    relatedId: packId,
  });

  if (email) {
    await sendTransactionalEmail({
      to: email,
      subject:
        decision === "processed"
          ? "Reembolso aprovado — Karreify"
          : "Reembolso recusado — Karreify",
      html: refundStatusEmail(name, emailStatus, packName, amountCents, reason || undefined),
      text: refundStatusEmailText(name, emailStatus, packName, amountCents, reason || undefined),
    });
  }
}

async function notifyClawback(
  packId: CreditPackId,
  clawback: { referrerUid: string; amountCents: number }
) {
  const userSnap = await adminDb.collection("users").doc(clawback.referrerUid).get();
  const u = userSnap.data() ?? {};
  const email = (u.email as string | undefined) ?? null;
  const name = (u.displayName as string | undefined) || (email ? email.split("@")[0] : "Usuário");
  const reais = `R$ ${(clawback.amountCents / 100).toFixed(2).replace(".", ",")}`;

  await createWalletNotification({
    uid: clawback.referrerUid,
    type: "commission",
    title: "Comissão estornada",
    message: `Uma comissão de ${reais} foi estornada porque a compra do seu indicado foi reembolsada.`,
    amountCents: clawback.amountCents,
    walletEventStatus: "reversed",
    relatedId: packId,
  });

  if (email) {
    await sendTransactionalEmail({
      to: email,
      subject: "Comissão estornada — Karreify",
      html: commissionReversedEmail(name, clawback.amountCents),
      text: commissionReversedEmailText(name, clawback.amountCents),
    });
  }
}
