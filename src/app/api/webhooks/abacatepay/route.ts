import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import {
  verifyWebhookSignature,
  type AbacateWebhookEvent,
} from "@/lib/abacatepay";
import { CREDIT_PACKS, type CreditPackId } from "@/types";
import { sendTransactionalEmail } from "@/lib/mailer";
import {
  packPurchaseEmail,
  packPurchaseEmailText,
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

    return {
      userId,
      email: (user.email as string | undefined) ?? null,
      displayName:
        (user.displayName as string | undefined) ||
        (user.name as string | undefined) ||
        "Usuário",
      pack,
    };
  });

  if (!userInfo || !userInfo.email || !userInfo.pack) return;

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

async function handleRefunded(paymentId: string) {
  const pendingRef = adminDb.collection("pendingPayments").doc(paymentId);
  await adminDb.runTransaction(async (tx) => {
    const pendingSnap = await tx.get(pendingRef);
    if (!pendingSnap.exists) return;
    const pending = pendingSnap.data()!;
    if (pending.status === "refunded") return;

    const userId = pending.userId as string;
    const creditsToRemove = pending.creditsToAdd as number;
    const userRef = adminDb.collection("users").doc(userId);
    const userSnap = await tx.get(userRef);
    if (!userSnap.exists) return;

    const currentCredits = (userSnap.data()?.credits as number | undefined) ?? 0;
    // Clamp em 0 caso o user já tenha gasto as moedas — não cobramos
    // do bolso dele, apenas devolvemos o que ainda tem.
    const next = Math.max(0, currentCredits - creditsToRemove);

    tx.update(userRef, { credits: next, updatedAt: new Date() });

    const txRef = userRef.collection("transactions").doc();
    tx.set(txRef, {
      amount: currentCredits - next,
      type: "debit",
      feature: "refund",
      description: "Estorno — compra reembolsada pelo gateway",
      paymentId,
      createdAt: FieldValue.serverTimestamp(),
    });

    tx.update(pendingRef, {
      status: "refunded",
      refundedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  });
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
