import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import {
  verifyWebhookSignature,
  type AbacateWebhookEvent,
} from "@/lib/abacatepay";
import {
  CREDIT_PACKS,
  type CreditPackId,
  COMMISSION_BY_PACK_CENTS,
  COMMISSION_HOLD_MS,
  COMMISSION_HOLD_DAYS,
  AUDIT_SYSTEM_ACTOR,
} from "@/types";
import { sendTransactionalEmail } from "@/lib/mailer";
import { createWalletNotification } from "@/lib/notifications-server";
import { applyPurchaseReversal } from "@/lib/refund-server";
import {
  packPurchaseEmail,
  packPurchaseEmailText,
  commissionReceivedEmail,
  commissionReceivedEmailText,
  commissionReversedEmail,
  commissionReversedEmailText,
} from "@/utils/email-templates";

export const dynamic = "force-dynamic";

/**
 * Webhook do Abacate Pay.
 *
 * Eventos tratados:
 *  - `checkout.completed` → credita as moedas do pacote no usuário
 *  - `checkout.refunded`  → estorna as moedas (clamp em 0 se já gastou)
 *  - `checkout.disputed`  → apenas marca o pendingPayment, pra análise manual
 *
 * Segurança:
 *  1. `webhookSecret` na query precisa bater com `ABACATEPAY_WEBHOOK_SECRET`.
 *  2. Header `X-Webhook-Signature` precisa validar via HMAC-SHA256 contra a
 *     chave pública da Abacate Pay (timing-safe compare).
 *
 * Idempotência:
 *  - `pendingPayments.status` é a flag — só processamos se `status === 'pending'`
 *    para completed, e só estornamos se `status !== 'refunded'`.
 */
export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const querySecret = url.searchParams.get("webhookSecret");
  const expectedSecret = process.env.ABACATEPAY_WEBHOOK_SECRET;

  if (!expectedSecret) {
    console.error("[abacate-webhook] ABACATEPAY_WEBHOOK_SECRET não configurado");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  if (!querySecret || querySecret !== expectedSecret) {
    console.warn("[abacate-webhook] secret mismatch");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-webhook-signature");

  // Em dev mode, permite pular a assinatura pra facilitar testes manuais com
  // curl. Em produção, a assinatura sempre tem que bater.
  const skipSignature =
    process.env.NODE_ENV !== "production" &&
    process.env.ABACATEPAY_SKIP_SIGNATURE === "true";

  if (!skipSignature && !verifyWebhookSignature(rawBody, signature)) {
    console.warn("[abacate-webhook] invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: AbacateWebhookEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const checkout = event.data?.checkout;
  const paymentId = checkout?.externalId;
  if (!checkout || !paymentId) {
    console.warn("[abacate-webhook] payload sem checkout.externalId", event);
    return NextResponse.json({ received: true, ignored: "missing_externalId" });
  }

  try {
    switch (event.event) {
      case "checkout.completed":
        await handleCompleted(paymentId, checkout.id);
        break;
      case "checkout.refunded":
        await handleRefunded(paymentId);
        break;
      case "checkout.disputed":
        await handleDisputed(paymentId, event.data?.reason);
        break;
      default:
        console.log(
          `[abacate-webhook] evento ignorado: ${(event as { event?: string }).event}`
        );
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[abacate-webhook] handler error:", err);
    await recordWebhookError(paymentId, event.event, err).catch((e) =>
      console.error("[abacate-webhook] falha ao registrar erro:", e)
    );
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

async function recordWebhookError(
  paymentId: string,
  eventType: string,
  err: unknown
): Promise<void> {
  const errorEntry = {
    source: "webhook",
    event: eventType,
    code: "WEBHOOK_HANDLER_ERROR",
    message: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack?.slice(0, 2000) ?? null : null,
    timestamp: new Date().toISOString(),
  };
  await adminDb
    .collection("pendingPayments")
    .doc(paymentId)
    .update({
      errors: FieldValue.arrayUnion(errorEntry),
      lastError: errorEntry,
      updatedAt: FieldValue.serverTimestamp(),
    });
}

interface CommissionInfo {
  referrerUid: string;
  amountCents: number;
  packName: string;
  referrerEmail: string | null;
  referrerName: string;
}

async function handleCompleted(paymentId: string, abacateCheckoutId: string) {
  const pendingRef = adminDb.collection("pendingPayments").doc(paymentId);
  const userInfo = await adminDb.runTransaction(async (tx) => {
    const pendingSnap = await tx.get(pendingRef);
    if (!pendingSnap.exists) {
      console.warn(`[abacate-webhook] pendingPayment ${paymentId} não existe`);
      return null;
    }
    const pending = pendingSnap.data()!;
    if (pending.status === "completed") {
      return null; // já processado, idempotência
    }
    if (pending.status === "refunded") {
      console.warn(
        `[abacate-webhook] tentativa de completar um payment já estornado ${paymentId}`
      );
      return null;
    }

    const userId = pending.userId as string;
    const packId = pending.packId as CreditPackId;
    const creditsToAdd = pending.creditsToAdd as number;

    const userRef = adminDb.collection("users").doc(userId);
    const userSnap = await tx.get(userRef);
    if (!userSnap.exists) {
      console.error(`[abacate-webhook] user ${userId} não encontrado`);
      return null;
    }
    const user = userSnap.data()!;

    const pack = CREDIT_PACKS.find((p) => p.id === packId);
    const packName = pack?.name ?? packId;

    // ----- Comissão de indicação: TODAS as leituras antes de qualquer escrita -----
    // referredBy é imutável; usamos o carimbo do pending (congelado na compra),
    // com fallback no doc do comprador para compras anteriores à Fase 3.
    const referrerUid =
      (pending.referredBy as string | undefined) ||
      (user.referredBy as string | undefined) ||
      null;
    const commissionAmountCents =
      referrerUid && referrerUid !== userId
        ? COMMISSION_BY_PACK_CENTS[packId] ?? 0
        : 0;

    let commission: CommissionInfo | null = null;
    let referrerWalletExists = false;
    let referralExists = false;
    let referralNeedsConvert = false;

    if (referrerUid && commissionAmountCents > 0) {
      const referrerUserRef = adminDb.collection("users").doc(referrerUid);
      const referrerWalletRef = adminDb.collection("wallets").doc(referrerUid);
      const referralRef = adminDb.collection("referrals").doc(userId); // id == referredUid
      const [referrerUserSnap, walletSnap, referralSnap] = await tx.getAll(
        referrerUserRef,
        referrerWalletRef,
        referralRef
      );
      // Só gera comissão se o indicador ainda existe (evita carteira órfã).
      if (referrerUserSnap.exists) {
        referrerWalletExists = walletSnap.exists;
        referralExists = referralSnap.exists;
        referralNeedsConvert =
          referralSnap.exists && referralSnap.data()?.status !== "converted";
        const refData = referrerUserSnap.data() ?? {};
        commission = {
          referrerUid,
          amountCents: commissionAmountCents,
          packName,
          referrerEmail: (refData.email as string | undefined) ?? null,
          referrerName:
            (refData.displayName as string | undefined) ||
            (refData.email ? (refData.email as string).split("@")[0] : "Usuário"),
        };
      }
    }

    // ----- Escritas -----
    const description =
      pack && pack.bonusCredits > 0
        ? `Compra do ${packName} — ${pack.baseCredits} moedas + ${pack.bonusCredits} bônus`
        : `Compra do ${packName} — ${creditsToAdd} moedas`;

    tx.update(userRef, {
      credits: FieldValue.increment(creditsToAdd),
      updatedAt: new Date(),
    });

    const txRef = userRef.collection("transactions").doc();
    tx.set(txRef, {
      amount: creditsToAdd,
      type: "credit",
      feature: "purchase",
      description,
      packId,
      paymentId,
      createdAt: FieldValue.serverTimestamp(),
    });

    tx.update(pendingRef, {
      status: "completed",
      abacateCheckoutId,
      completedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Comissão: registro + crédito retido na carteira + ledger + auditoria, na
    // MESMA transação e sob a mesma guarda de status — idempotência exata
    // (um reenvio do webhook vê status 'completed' e retorna antes daqui).
    if (commission) {
      const amountCents = commission.amountCents;
      const holdUntil = Date.now() + COMMISSION_HOLD_MS;
      const referrerWalletRef = adminDb.collection("wallets").doc(commission.referrerUid);

      // Doc id == sourcePaymentId: chave de deduplicação da comissão.
      tx.set(adminDb.collection("commissions").doc(paymentId), {
        referralId: userId,
        referrerUid: commission.referrerUid,
        referredUid: userId,
        sourcePaymentId: paymentId,
        packId,
        amountCents,
        status: "held",
        holdUntil,
        createdAt: FieldValue.serverTimestamp(),
      });

      if (referrerWalletExists) {
        tx.update(referrerWalletRef, {
          pendingCents: FieldValue.increment(amountCents),
          totalEarnedCents: FieldValue.increment(amountCents),
          updatedAt: new Date(),
        });
      } else {
        tx.set(referrerWalletRef, {
          uid: commission.referrerUid,
          balanceCents: 0,
          pendingCents: amountCents,
          totalEarnedCents: amountCents,
          totalWithdrawnCents: 0,
          totalConvertedCents: 0,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: new Date(),
        });
      }

      tx.set(referrerWalletRef.collection("walletTransactions").doc(), {
        amountCents,
        type: "commission-pending",
        refType: "commission",
        refId: paymentId,
        sourcePaymentId: paymentId,
        description: `Comissão por indicação — compra do ${packName}`,
        createdAt: FieldValue.serverTimestamp(),
      });

      tx.set(adminDb.collection("auditLogs").doc(), {
        actorUid: AUDIT_SYSTEM_ACTOR,
        actorType: "system",
        action: "commission.created",
        targetType: "commission",
        targetId: paymentId,
        affectedUid: commission.referrerUid,
        amountCents,
        metadata: { packId, referredUid: userId, sourcePaymentId: paymentId, holdUntil },
        notes: null,
        createdAt: FieldValue.serverTimestamp(),
      });

      // Marca a indicação como convertida (primeira compra do indicado). Se o
      // vínculo veio pelo fallback users.referredBy SEM doc em referrals (ex.:
      // atribuição manual/backfill), recria-o já convertido — assim a comissão
      // não fica com referralId pendurado e o relatório de indicações bate.
      const referralDocRef = adminDb.collection("referrals").doc(userId);
      if (referralExists) {
        if (referralNeedsConvert) {
          tx.update(referralDocRef, {
            status: "converted",
            convertedAt: FieldValue.serverTimestamp(),
          });
        }
      } else {
        tx.set(referralDocRef, {
          referrerUid: commission.referrerUid,
          referredUid: userId,
          code: "",
          status: "converted",
          signupBonusGranted: false,
          convertedAt: FieldValue.serverTimestamp(),
          createdAt: FieldValue.serverTimestamp(),
        });
      }
    }

    return {
      userId,
      email: (user.email as string | undefined) ?? null,
      displayName:
        (user.displayName as string | undefined) ||
        (user.name as string | undefined) ||
        "Usuário",
      pack,
      commission,
    };
  });

  if (!userInfo) return;

  // Comissão: notificação + e-mail ao indicador (best-effort, fora da transação).
  if (userInfo.commission) {
    const c = userInfo.commission;
    const reais = `R$ ${(c.amountCents / 100).toFixed(2).replace(".", ",")}`;
    try {
      await createWalletNotification({
        uid: c.referrerUid,
        type: "commission",
        title: "Você recebeu uma comissão!",
        message: `Um indicado seu comprou o ${c.packName}. Você ganhou ${reais} — liberado em ${COMMISSION_HOLD_DAYS} dias para saque.`,
        amountCents: c.amountCents,
        walletEventStatus: "held",
        relatedId: paymentId,
      });
      if (c.referrerEmail) {
        await sendTransactionalEmail({
          to: c.referrerEmail,
          subject: "Você recebeu uma comissão — Karreify",
          html: commissionReceivedEmail(c.referrerName, c.amountCents, c.packName, COMMISSION_HOLD_DAYS),
          text: commissionReceivedEmailText(c.referrerName, c.amountCents, c.packName, COMMISSION_HOLD_DAYS),
        });
      }
    } catch (e) {
      console.error("[abacate-webhook] commission notify failed:", e);
    }
  }

  // E-mail de compra ao comprador.
  if (userInfo.email && userInfo.pack) {
    try {
      await sendTransactionalEmail({
        to: userInfo.email,
        subject: "Compra de moedas confirmada — Karreify",
        html: packPurchaseEmail(
          userInfo.displayName,
          userInfo.pack.name,
          userInfo.pack.baseCredits,
          userInfo.pack.bonusCredits,
          userInfo.pack.totalCredits,
          userInfo.pack.price
        ),
        text: packPurchaseEmailText(
          userInfo.displayName,
          userInfo.pack.name,
          userInfo.pack.baseCredits,
          userInfo.pack.bonusCredits,
          userInfo.pack.totalCredits,
          userInfo.pack.price
        ),
      });
    } catch (e) {
      console.error("[abacate-webhook] purchase email failed:", e);
    }
  }
}

async function handleRefunded(paymentId: string) {
  const pendingRef = adminDb.collection("pendingPayments").doc(paymentId);
  const result = await adminDb.runTransaction(async (tx) => {
    const pendingSnap = await tx.get(pendingRef);
    if (!pendingSnap.exists) return null;
    const pending = pendingSnap.data()!;
    if (pending.status === "refunded") return null; // idempotência

    // Só reverte se os créditos chegaram a ser concedidos (há completedAt). Um
    // refund sobre pagamento nunca concluído (pending/failed) apenas marca o
    // status — sem debitar créditos vindos de OUTRAS compras/bônus do usuário.
    if (!pending.completedAt) {
      tx.update(pendingRef, {
        status: "refunded",
        refundedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      return null;
    }

    // Remove créditos do comprador (clamp 0) + estorna a comissão do indicador
    // (debita pendente ou disponível, podendo ir negativo). Helper compartilhado
    // com o processamento de reembolso do admin.
    const reversal = await applyPurchaseReversal(tx, paymentId, pending);

    tx.update(pendingRef, {
      status: "refunded",
      refundedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return reversal;
  });

  if (result?.clawback) {
    await notifyCommissionReversed(paymentId, result.clawback).catch((e) =>
      console.error("[abacate-webhook] clawback notify failed:", e)
    );
  }
}

async function notifyCommissionReversed(
  paymentId: string,
  clawback: { referrerUid: string; amountCents: number }
) {
  const userSnap = await adminDb.collection("users").doc(clawback.referrerUid).get();
  const u = userSnap.data() ?? {};
  const email = (u.email as string | undefined) ?? null;
  const name =
    (u.displayName as string | undefined) || (email ? email.split("@")[0] : "Usuário");
  const reais = `R$ ${(clawback.amountCents / 100).toFixed(2).replace(".", ",")}`;

  await createWalletNotification({
    uid: clawback.referrerUid,
    type: "commission",
    title: "Comissão estornada",
    message: `Uma comissão de ${reais} foi estornada porque a compra do seu indicado foi reembolsada.`,
    amountCents: clawback.amountCents,
    walletEventStatus: "reversed",
    relatedId: paymentId,
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

async function handleDisputed(paymentId: string, reason?: string) {
  const pendingRef = adminDb.collection("pendingPayments").doc(paymentId);
  await pendingRef
    .update({
      status: "disputed",
      disputedAt: FieldValue.serverTimestamp(),
      disputeReason: reason ?? null,
      updatedAt: FieldValue.serverTimestamp(),
    })
    .catch((e) => console.error("[abacate-webhook] mark disputed failed:", e));
}
