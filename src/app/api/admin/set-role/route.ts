import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/utils/admin-verify";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

const TESTER_GRANT = 5;

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

    const updates: Record<string, unknown> = { role, updatedAt: new Date() };
    if (promotingToTester) {
      updates.credits = FieldValue.increment(TESTER_GRANT);
    } else if (demotingFromTester) {
      updates.credits = 0;
    }

    await userRef.update(updates);

    if (promotingToTester) {
      await adminDb.collection(`users/${uid}/transactions`).add({
        amount: TESTER_GRANT,
        type: "credit",
        feature: "tester-grant",
        description: `Moedas concedidas ao ativar modo Tester`,
        createdAt: new Date(),
      });
    } else if (demotingFromTester && previousCredits > 0) {
      await adminDb.collection(`users/${uid}/transactions`).add({
        amount: previousCredits,
        type: "debit",
        feature: "tester-revoke",
        description: `Moedas removidas ao desativar modo Tester`,
        createdAt: new Date(),
      });
    }

    const updated = await userRef.get();
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
