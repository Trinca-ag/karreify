import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/utils/admin-verify";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { adminGuardError } from "@/lib/admin-referrals-server";
import { createWalletNotification } from "@/lib/notifications-server";
import { sendTransactionalEmail } from "@/lib/mailer";
import { commissionReversedEmail, commissionReversedEmailText } from "@/utils/email-templates";

export const dynamic = "force-dynamic";

/**
 * Cancelamento manual de uma comissão pelo admin (ajuste com registro em log).
 * Debita o valor da carteira do indicador (pendente se ainda retida, disponível
 * se já liberada — podendo ir negativo) e marca a comissão como 'cancelled'.
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  let admin;
  try {
    admin = await verifyAdminRequest(request);
  } catch (error) {
    return adminGuardError(error, "[admin/commissions/action]");
  }

  const id = params.id;
  let body: { action?: string; reason?: string };
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  if (!id || body.action !== "cancel") {
    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  }
  const reason = typeof body.reason === "string" ? body.reason.trim().slice(0, 500) : "";

  try {
    const commissionRef = adminDb.collection("commissions").doc(id);

    const result = await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(commissionRef);
      if (!snap.exists) return { code: "not-found" as const };
      const c = snap.data()!;
      const status = c.status as string;
      if (status !== "held" && status !== "released") {
        return { code: "conflict" as const, status };
      }
      const referrerUid = c.referrerUid as string;
      const amountCents = (c.amountCents as number | undefined) ?? 0;
      const wasHeld = status === "held";
      const walletRef = adminDb.collection("wallets").doc(referrerUid);
      const walletSnap = await tx.get(walletRef); // leitura antes das escritas

      if (walletSnap.exists) {
        tx.update(walletRef, {
          ...(wasHeld
            ? { pendingCents: FieldValue.increment(-amountCents) }
            : { balanceCents: FieldValue.increment(-amountCents) }),
          totalEarnedCents: FieldValue.increment(-amountCents),
          updatedAt: new Date(),
        });
        tx.set(walletRef.collection("walletTransactions").doc(), {
          amountCents: -amountCents,
          type: "commission-clawback",
          refType: "commission",
          refId: id,
          sourcePaymentId: (c.sourcePaymentId as string | undefined) ?? id,
          description: "Comissão cancelada pelo administrador",
          createdAt: FieldValue.serverTimestamp(),
        });
      }

      tx.update(commissionRef, {
        status: "cancelled",
        reversedAt: FieldValue.serverTimestamp(),
        reversalReason: reason || "admin-cancelled",
      });
      tx.set(adminDb.collection("auditLogs").doc(), {
        actorUid: admin.uid,
        actorType: "admin",
        action: "commission.cancelled",
        targetType: "commission",
        targetId: id,
        affectedUid: referrerUid,
        amountCents,
        metadata: { wasHeld },
        notes: reason || null,
        createdAt: FieldValue.serverTimestamp(),
      });

      return { code: "ok" as const, referrerUid, amountCents };
    });

    if (result.code === "not-found") {
      return NextResponse.json({ error: "Comissão não encontrada" }, { status: 404 });
    }
    if (result.code === "conflict") {
      return NextResponse.json(
        { error: `Operação não permitida: comissão está '${result.status}'` },
        { status: 409 }
      );
    }

    // Notificação + e-mail ao indicador (best-effort).
    try {
      const userSnap = await adminDb.collection("users").doc(result.referrerUid).get();
      const u = userSnap.data() ?? {};
      const email = (u.email as string | undefined) ?? null;
      const name = (u.displayName as string | undefined) || (email ? email.split("@")[0] : "Usuário");
      const reais = `R$ ${(result.amountCents / 100).toFixed(2).replace(".", ",")}`;
      await createWalletNotification({
        uid: result.referrerUid,
        type: "commission",
        title: "Comissão cancelada",
        message: `Uma comissão de ${reais} foi cancelada pela administração.`,
        amountCents: result.amountCents,
        walletEventStatus: "cancelled",
        relatedId: id,
      });
      if (email) {
        await sendTransactionalEmail({
          to: email,
          subject: "Comissão cancelada — Karreify",
          html: commissionReversedEmail(name, result.amountCents),
          text: commissionReversedEmailText(name, result.amountCents),
        });
      }
    } catch (e) {
      console.error("[admin/commissions] notify failed:", e);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return adminGuardError(error, "[admin/commissions/action]");
  }
}
