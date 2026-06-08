import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { createWalletNotification } from "@/lib/notifications-server";
import { sendTransactionalEmail } from "@/lib/mailer";
import {
  commissionReleasedEmail,
  commissionReleasedEmailText,
} from "@/utils/email-templates";
import { AUDIT_CRON_ACTOR } from "@/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Comparação timing-safe (mesma postura do webhook AbacatePay). */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/**
 * Cron diário (vercel.json: `0 3 * * *`) que libera comissões cujo período de
 * retenção (holdUntil) já passou: move o valor de `pendingCents` para
 * `balanceCents` (sacável), marca a comissão como `released` e registra o
 * movimento + auditoria.
 *
 * Autenticação: a Vercel injeta `Authorization: Bearer ${CRON_SECRET}` quando a
 * env CRON_SECRET está definida. Sem token válido → 401 (sem token Firebase aqui).
 *
 * Idempotência: cada liberação roda numa transação que só age se a comissão
 * ainda estiver `held`; reexecuções/sobreposições não liberam duas vezes.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("[cron/release-commissions] CRON_SECRET não configurado");
    return NextResponse.json({ error: "Cron not configured" }, { status: 500 });
  }
  const auth = request.headers.get("authorization");
  if (!auth || !safeEqual(auth, `Bearer ${secret}`)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = Date.now();
  const BATCH = 100;
  const MAX_ITER = 10; // teto de segurança: até 1000 comissões por execução
  let totalReleased = 0;
  let hitCap = false;
  const released: ReleasedCommission[] = [];

  try {
    for (let iter = 0; iter < MAX_ITER; iter++) {
      const snap = await adminDb
        .collection("commissions")
        .where("status", "==", "held")
        .where("holdUntil", "<=", now)
        .orderBy("holdUntil", "asc")
        .limit(BATCH)
        .get();
      if (snap.empty) break;

      let releasedThisIter = 0;
      for (const doc of snap.docs) {
        const r = await releaseOne(doc.id);
        if (r) {
          releasedThisIter++;
          released.push(r);
        }
      }
      totalReleased += releasedThisIter;

      // Nada progrediu nesta rodada (ex.: comissões mudaram de status entre a
      // query e a transação) → para para não reprocessar o mesmo lote.
      if (releasedThisIter === 0) break;
      if (snap.size < BATCH) break;
      // Última iteração ainda com lote cheio → provavelmente sobraram comissões.
      if (iter === MAX_ITER - 1) hitCap = true;
    }

    // Sucesso silencioso é perigoso: se batemos no teto, ficou backlog para a
    // próxima execução — registra para ser observável.
    if (hitCap) {
      console.error(
        `[cron/release-commissions] teto de ${MAX_ITER * BATCH} comissões/execução atingido; o restante será liberado na próxima rodada`
      );
    }

    // Notificações + e-mails (best-effort, fora das transações).
    for (const r of released) {
      await notifyReleased(r).catch((e) =>
        console.error("[cron/release-commissions] notify failed:", e)
      );
    }

    return NextResponse.json({ ok: true, released: totalReleased, capped: hitCap });
  } catch (error) {
    console.error("[cron/release-commissions]", error);
    return NextResponse.json(
      { error: "Erro ao liberar comissões", released: totalReleased },
      { status: 500 }
    );
  }
}

interface ReleasedCommission {
  commissionId: string;
  referrerUid: string;
  amountCents: number;
}

/** Libera uma comissão numa transação. Retorna os dados quando de fato liberou,
 *  ou null se já não estava `held` (idempotência). */
async function releaseOne(commissionId: string): Promise<ReleasedCommission | null> {
  const commissionRef = adminDb.collection("commissions").doc(commissionId);
  return adminDb.runTransaction(async (tx) => {
    const cSnap = await tx.get(commissionRef);
    if (!cSnap.exists) return null;
    const c = cSnap.data()!;
    if (c.status !== "held") return null; // já liberada/estornada/cancelada

    const referrerUid = c.referrerUid as string;
    const amountCents = c.amountCents as number;
    const sourcePaymentId = (c.sourcePaymentId as string | undefined) ?? commissionId;
    const walletRef = adminDb.collection("wallets").doc(referrerUid);
    const wSnap = await tx.get(walletRef);

    if (wSnap.exists) {
      // pending → disponível (o total da carteira não muda; só reclassifica).
      tx.update(walletRef, {
        pendingCents: FieldValue.increment(-amountCents),
        balanceCents: FieldValue.increment(amountCents),
        updatedAt: new Date(),
      });
    } else {
      // Anômalo: comissão held sem carteira. Cria já com o valor disponível.
      tx.set(walletRef, {
        uid: referrerUid,
        balanceCents: amountCents,
        pendingCents: 0,
        totalEarnedCents: amountCents,
        totalWithdrawnCents: 0,
        totalConvertedCents: 0,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: new Date(),
      });
    }

    tx.update(commissionRef, {
      status: "released",
      releasedAt: FieldValue.serverTimestamp(),
    });

    tx.set(walletRef.collection("walletTransactions").doc(), {
      amountCents,
      type: "commission-released",
      refType: "commission",
      refId: commissionId,
      sourcePaymentId,
      description: "Comissão liberada para saque",
      createdAt: FieldValue.serverTimestamp(),
    });

    tx.set(adminDb.collection("auditLogs").doc(), {
      actorUid: AUDIT_CRON_ACTOR,
      actorType: "cron",
      action: "commission.released",
      targetType: "commission",
      targetId: commissionId,
      affectedUid: referrerUid,
      amountCents,
      metadata: { sourcePaymentId },
      notes: null,
      createdAt: FieldValue.serverTimestamp(),
    });

    return { commissionId, referrerUid, amountCents };
  });
}

async function notifyReleased(r: ReleasedCommission): Promise<void> {
  const userSnap = await adminDb.collection("users").doc(r.referrerUid).get();
  const u = userSnap.data() ?? {};
  const email = (u.email as string | undefined) ?? null;
  const name =
    (u.displayName as string | undefined) ||
    (email ? email.split("@")[0] : "Usuário");
  const reais = `R$ ${(r.amountCents / 100).toFixed(2).replace(".", ",")}`;

  await createWalletNotification({
    uid: r.referrerUid,
    type: "commission",
    title: "Comissão liberada para saque",
    message: `Sua comissão de ${reais} cumpriu o período de retenção e já está disponível para saque.`,
    amountCents: r.amountCents,
    walletEventStatus: "released",
    relatedId: r.commissionId,
  });

  if (email) {
    await sendTransactionalEmail({
      to: email,
      subject: "Comissão liberada para saque — Karreify",
      html: commissionReleasedEmail(name, r.amountCents),
      text: commissionReleasedEmailText(name, r.amountCents),
    });
  }
}
