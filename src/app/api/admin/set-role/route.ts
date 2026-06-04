import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/utils/admin-verify";
import { adminDb } from "@/lib/firebase-admin";
import { createRoleChangeNotification } from "@/lib/notifications-server";

const TESTER_GRANT = 45;

export async function POST(request: NextRequest) {
  try {
    await verifyAdminRequest(request);
    const { uid, role } = await request.json();

    if (!uid) return NextResponse.json({ error: "UID obrigatório" }, { status: 400 });
    if (role !== "user" && role !== "tester") {
      return NextResponse.json({ error: "Role inválida" }, { status: 400 });
    }

    const userRef = adminDb.doc(`users/${uid}`);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const previousData = userSnap.data() ?? {};
    const previousRole = previousData.role === "tester" ? "tester" : "user";
    const previousCredits = typeof previousData.credits === "number" ? previousData.credits : 0;
    const promotingToTester = role === "tester" && previousRole !== "tester";
    const demotingFromTester = role === "user" && previousRole === "tester";

    // Modo Tester tem saldo FIXO de 45 moedas: ao ATIVAR, o saldo é DEFINIDO em
    // 45 (não soma aos créditos de cadastro); ao DESATIVAR, zera. Por isso é SET,
    // não increment. creditsDelta guarda a variação REAL de saldo para auditoria
    // (transações) e para a notificação.
    const updates: Record<string, unknown> = { role, updatedAt: new Date() };
    let creditsDelta = 0;
    if (promotingToTester) {
      updates.credits = TESTER_GRANT;
      // Trava o bônus de boas-vindas: garante que o welcome (idempotente) nunca
      // some +15 por cima dos 45, mesmo que a promoção ocorra antes de o grant
      // de boas-vindas ter disparado para a conta.
      updates.welcomeCreditsGranted = true;
      creditsDelta = TESTER_GRANT - previousCredits;
    } else if (demotingFromTester) {
      updates.credits = 0;
      creditsDelta = -previousCredits;
    }

    await userRef.update(updates);

    // Transação de auditoria com a variação REAL de saldo (set, não soma).
    if ((promotingToTester || demotingFromTester) && creditsDelta !== 0) {
      await adminDb.collection(`users/${uid}/transactions`).add({
        amount: Math.abs(creditsDelta),
        type: creditsDelta > 0 ? "credit" : "debit",
        feature: promotingToTester ? "tester-grant" : "tester-revoke",
        description: promotingToTester
          ? `Saldo definido em ${TESTER_GRANT} moedas ao ativar modo Tester`
          : "Saldo zerado ao desativar modo Tester",
        createdAt: new Date(),
      });
    }

    const updated = await userRef.get();

    if (promotingToTester || demotingFromTester) {
      const title = promotingToTester
        ? "Você virou Tester!"
        : "Seu modo Tester foi desativado";
      const message = promotingToTester
        ? `Sua conta foi atualizada para Tester com ${TESTER_GRANT} moedas.`
        : "Sua conta voltou para User e o saldo foi zerado.";
      await createRoleChangeNotification({
        uid,
        title,
        message,
        newRole: role,
        creditsDelta,
      }).catch((e) => console.error("role-change notification failed:", e));
    }

    return NextResponse.json({
      success: true,
      role,
      credits: updated.data()?.credits ?? 0,
      granted: promotingToTester ? TESTER_GRANT : 0,
      revoked: demotingFromTester ? previousCredits : 0,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro";
    if (msg === "Não autorizado" || msg === "Acesso negado") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    console.error("set-role error:", error);
    return NextResponse.json({ error: "Erro ao atualizar role" }, { status: 500 });
  }
}
