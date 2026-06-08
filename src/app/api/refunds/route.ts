import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { creditsUsedSince } from "@/lib/refund-server";
import { createWalletNotification } from "@/lib/notifications-server";
import { sendTransactionalEmail } from "@/lib/mailer";
import { refundStatusEmail, refundStatusEmailText } from "@/utils/email-templates";
import {
  CREDIT_PACKS,
  REFUND_WINDOW_MS,
  REFUND_MAX_CREDITS_USED_PCT,
  type CreditPackId,
} from "@/types";

export const dynamic = "force-dynamic";

function toIso(v: unknown): string | null {
  return v instanceof Timestamp ? v.toDate().toISOString() : null;
}

/** Histórico de reembolsos solicitados pelo usuário. */
export async function GET(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  try {
    const snap = await adminDb
      .collection("refunds")
      .where("uid", "==", ctx.uid)
      .orderBy("createdAt", "desc")
      .limit(30)
      .get();

    const refunds = snap.docs.map((d) => {
      const r = d.data();
      return {
        id: d.id,
        paymentId: (r.paymentId as string | undefined) ?? d.id,
        packId: (r.packId as string | undefined) ?? "",
        amountCents: (r.amountCents as number | undefined) ?? 0,
        status: (r.status as string | undefined) ?? "requested",
        reason: (r.reason as string | undefined) ?? null,
        createdAt: toIso(r.createdAt),
        decidedAt: toIso(r.decidedAt),
      };
    });

    return NextResponse.json({ refunds });
  } catch (error) {
    console.error("[refunds:GET]", error);
    return NextResponse.json({ error: "Erro ao carregar reembolsos" }, { status: 500 });
  }
}

/** Solicita reembolso de uma compra. Reavalia a elegibilidade no servidor. */
export async function POST(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  const rl = rateLimit(ctx.uid, { scope: "refund-request", limit: 5, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  let body: { paymentId?: unknown; reason?: unknown };
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const paymentId = typeof body.paymentId === "string" ? body.paymentId : "";
  const reason = typeof body.reason === "string" ? body.reason.trim().slice(0, 500) : "";
  if (!paymentId) {
    return NextResponse.json({ error: "Compra inválida" }, { status: 400 });
  }

  try {
    const pendingRef = adminDb.collection("pendingPayments").doc(paymentId);
    const pendingSnap = await pendingRef.get();
    if (!pendingSnap.exists || pendingSnap.data()?.userId !== ctx.uid) {
      return NextResponse.json({ error: "Compra não encontrada" }, { status: 404 });
    }
    const pending = pendingSnap.data()!;
    if (pending.status !== "completed") {
      return NextResponse.json(
        { error: "Apenas compras concluídas podem ser reembolsadas" },
        { status: 400 }
      );
    }

    const completedAt =
      pending.completedAt instanceof Timestamp
        ? pending.completedAt
        : pending.createdAt instanceof Timestamp
          ? pending.createdAt
          : null;
    if (!completedAt || Date.now() - completedAt.toMillis() > REFUND_WINDOW_MS) {
      return NextResponse.json(
        { error: "O prazo de reembolso (7 dias) já expirou" },
        { status: 400 }
      );
    }

    const creditsGranted = (pending.creditsToAdd as number | undefined) ?? 0;
    const used = await creditsUsedSince(ctx.uid, completedAt);
    if (creditsGranted > 0 && used >= REFUND_MAX_CREDITS_USED_PCT * creditsGranted) {
      return NextResponse.json(
        {
          error:
            "Reembolso indisponível: 30% ou mais dos créditos desta compra já foram utilizados",
        },
        { status: 400 }
      );
    }

    const packId = pending.packId as CreditPackId;
    const amountCents = Math.round(((pending.amount as number | undefined) ?? 0) * 100);
    const refundRef = adminDb.collection("refunds").doc(paymentId); // 1 reembolso por compra

    const created = await adminDb.runTransaction(async (tx) => {
      const refundSnap = await tx.get(refundRef);
      if (refundSnap.exists) return false; // já solicitado

      tx.set(refundRef, {
        paymentId,
        uid: ctx.uid,
        packId,
        amountCents,
        creditsGranted,
        creditsUsedAtRequest: used,
        status: "requested",
        reason: reason || null,
        decidedBy: null,
        decidedAt: null,
        commissionClawedBack: false,
        createdAt: FieldValue.serverTimestamp(),
      });

      tx.set(adminDb.collection("auditLogs").doc(), {
        actorUid: ctx.uid,
        actorType: "user",
        action: "refund.requested",
        targetType: "refund",
        targetId: paymentId,
        affectedUid: ctx.uid,
        amountCents,
        metadata: { packId, creditsGranted, creditsUsedAtRequest: used },
        notes: null,
        createdAt: FieldValue.serverTimestamp(),
      });

      return true;
    });

    if (!created) {
      return NextResponse.json(
        { error: "Você já solicitou reembolso para esta compra" },
        { status: 409 }
      );
    }

    // Notificação + e-mail de confirmação (best-effort).
    try {
      const packName = CREDIT_PACKS.find((p) => p.id === packId)?.name ?? packId;
      await createWalletNotification({
        uid: ctx.uid,
        type: "refund-status",
        title: "Solicitação de reembolso enviada",
        message: `Seu pedido de reembolso da compra do ${packName} foi enviado e está em análise.`,
        amountCents,
        walletEventStatus: "requested",
        relatedId: paymentId,
      });
      if (ctx.email) {
        const userSnap = await adminDb.collection("users").doc(ctx.uid).get();
        const name =
          (userSnap.data()?.displayName as string | undefined) || ctx.email.split("@")[0];
        await sendTransactionalEmail({
          to: ctx.email,
          subject: "Solicitação de reembolso recebida — Karreify",
          html: refundStatusEmail(name, "requested", packName, amountCents),
          text: refundStatusEmailText(name, "requested", packName, amountCents),
        });
      }
    } catch (e) {
      console.error("[refunds] notify failed:", e);
    }

    return NextResponse.json({ ok: true, refundId: paymentId });
  } catch (error) {
    console.error("[refunds:POST]", error);
    return NextResponse.json({ error: "Erro ao solicitar reembolso" }, { status: 500 });
  }
}
