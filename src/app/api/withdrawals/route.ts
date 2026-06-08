import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { createWalletNotification } from "@/lib/notifications-server";
import { sendTransactionalEmail } from "@/lib/mailer";
import {
  withdrawalStatusEmail,
  withdrawalStatusEmailText,
} from "@/utils/email-templates";
import {
  WITHDRAW_MIN_CENTS,
  WITHDRAW_MAX_CENTS,
  WITHDRAW_COOLDOWN_MS,
  type PixKeyType,
} from "@/types";

export const dynamic = "force-dynamic";

const PIX_KEY_TYPES: PixKeyType[] = ["cpf", "cnpj", "email", "phone", "random"];

function toIso(v: unknown): string | null {
  return v instanceof Timestamp ? v.toDate().toISOString() : null;
}

/** Histórico de saques do usuário. */
export async function GET(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  try {
    const snap = await adminDb
      .collection("withdrawals")
      .where("uid", "==", ctx.uid)
      .orderBy("requestedAt", "desc")
      .limit(30)
      .get();

    const withdrawals = snap.docs.map((d) => {
      const w = d.data();
      return {
        id: d.id,
        amountCents: (w.amountCents as number | undefined) ?? 0,
        pixKey: (w.pixKey as string | undefined) ?? "",
        pixKeyType: (w.pixKeyType as string | undefined) ?? "",
        status: (w.status as string | undefined) ?? "requested",
        requestedAt: toIso(w.requestedAt),
        decidedAt: toIso(w.decidedAt),
        paidAt: toIso(w.paidAt),
        rejectReason: (w.rejectReason as string | undefined) ?? null,
      };
    });

    return NextResponse.json({ withdrawals });
  } catch (error) {
    console.error("[withdrawals:GET]", error);
    return NextResponse.json({ error: "Erro ao carregar saques" }, { status: 500 });
  }
}

/** Solicita um saque: reserva o valor do saldo disponível na mesma transação. */
export async function POST(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  const rl = rateLimit(ctx.uid, { scope: "withdrawal-request", limit: 5, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  let body: { amountCents?: unknown; pixKey?: unknown; pixKeyType?: unknown };
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const amountCents =
    typeof body.amountCents === "number" ? Math.floor(body.amountCents) : NaN;
  const pixKey = typeof body.pixKey === "string" ? body.pixKey.trim() : "";
  const pixKeyType = body.pixKeyType as PixKeyType;

  if (!Number.isFinite(amountCents) || amountCents < WITHDRAW_MIN_CENTS) {
    return NextResponse.json(
      { error: `O saque mínimo é de R$ ${(WITHDRAW_MIN_CENTS / 100).toFixed(2).replace(".", ",")}` },
      { status: 400 }
    );
  }
  if (amountCents > WITHDRAW_MAX_CENTS) {
    return NextResponse.json(
      { error: `O saque máximo é de R$ ${(WITHDRAW_MAX_CENTS / 100).toFixed(2).replace(".", ",")}` },
      { status: 400 }
    );
  }
  if (!pixKey || pixKey.length > 140) {
    return NextResponse.json({ error: "Informe uma chave PIX válida" }, { status: 400 });
  }
  if (!PIX_KEY_TYPES.includes(pixKeyType)) {
    return NextResponse.json({ error: "Tipo de chave PIX inválido" }, { status: 400 });
  }

  try {
    const walletRef = adminDb.collection("wallets").doc(ctx.uid);
    const withdrawalRef = adminDb.collection("withdrawals").doc();

    const result = await adminDb.runTransaction(async (tx) => {
      const walletSnap = await tx.get(walletRef);
      const balanceCents = (walletSnap.data()?.balanceCents as number | undefined) ?? 0;
      const lastWithdrawalAt =
        (walletSnap.data()?.lastWithdrawalAt as number | undefined) ?? 0;

      if (balanceCents < amountCents) {
        return { ok: false as const, reason: "insufficient" };
      }
      const now = Date.now();
      if (now - lastWithdrawalAt < WITHDRAW_COOLDOWN_MS) {
        return { ok: false as const, reason: "daily-limit" };
      }

      // Reserva: debita o valor do saldo disponível já na solicitação.
      tx.update(walletRef, {
        balanceCents: FieldValue.increment(-amountCents),
        lastWithdrawalAt: now,
        updatedAt: new Date(),
      });

      tx.set(withdrawalRef, {
        uid: ctx.uid,
        amountCents,
        pixKey,
        pixKeyType,
        status: "requested",
        requestedAt: FieldValue.serverTimestamp(),
        decidedBy: null,
        decidedAt: null,
        rejectReason: null,
        paidAt: null,
        payoutRef: null,
      });

      tx.set(walletRef.collection("walletTransactions").doc(), {
        amountCents: -amountCents,
        type: "withdrawal-reserve",
        refType: "withdrawal",
        refId: withdrawalRef.id,
        description: "Reserva para solicitação de saque",
        createdAt: FieldValue.serverTimestamp(),
      });

      tx.set(adminDb.collection("auditLogs").doc(), {
        actorUid: ctx.uid,
        actorType: "user",
        action: "withdrawal.requested",
        targetType: "withdrawal",
        targetId: withdrawalRef.id,
        affectedUid: ctx.uid,
        amountCents,
        metadata: { pixKeyType },
        notes: null,
        createdAt: FieldValue.serverTimestamp(),
      });

      return { ok: true as const, withdrawalId: withdrawalRef.id };
    });

    if (!result.ok) {
      if (result.reason === "insufficient") {
        return NextResponse.json(
          { error: "Saldo disponível insuficiente para esse saque" },
          { status: 402 }
        );
      }
      return NextResponse.json(
        { error: "Você já solicitou um saque nas últimas 24 horas. Tente novamente mais tarde." },
        { status: 409 }
      );
    }

    // Notificação + e-mail de confirmação (best-effort, fora da transação).
    try {
      await createWalletNotification({
        uid: ctx.uid,
        type: "withdrawal-status",
        title: "Solicitação de saque enviada",
        message: `Seu saque de R$ ${(amountCents / 100).toFixed(2).replace(".", ",")} foi solicitado e está em análise.`,
        amountCents,
        walletEventStatus: "requested",
        relatedId: result.withdrawalId,
      });
      if (ctx.email) {
        const userSnap = await adminDb.collection("users").doc(ctx.uid).get();
        const name =
          (userSnap.data()?.displayName as string | undefined) ||
          ctx.email.split("@")[0];
        await sendTransactionalEmail({
          to: ctx.email,
          subject: "Solicitação de saque recebida — Karreify",
          html: withdrawalStatusEmail(name, "requested", amountCents),
          text: withdrawalStatusEmailText(name, "requested", amountCents),
        });
      }
    } catch (e) {
      console.error("[withdrawals] notify failed:", e);
    }

    return NextResponse.json({ ok: true, withdrawalId: result.withdrawalId });
  } catch (error) {
    console.error("[withdrawals:POST]", error);
    return NextResponse.json({ error: "Erro ao solicitar saque" }, { status: 500 });
  }
}
