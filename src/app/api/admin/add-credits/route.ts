import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/utils/admin-verify";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  try {
    await verifyAdminRequest(request);
    const { uid, amount, description } = await request.json();

    if (!uid) return NextResponse.json({ error: "UID obrigatório" }, { status: 400 });
    if (!amount || typeof amount !== "number" || amount <= 0 || amount > 10000) {
      return NextResponse.json({ error: "Quantidade inválida (1–10000)" }, { status: 400 });
    }

    const userRef = adminDb.doc(`users/${uid}`);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    await userRef.update({ credits: FieldValue.increment(amount) });

    await adminDb.collection(`users/${uid}/transactions`).add({
      amount,
      type: "credit",
      feature: "admin-grant",
      description: description || "Créditos adicionados pelo administrador",
      createdAt: new Date(),
    });

    const updated = await userRef.get();
    return NextResponse.json({ success: true, newCredits: updated.data()?.credits ?? 0 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro";
    if (msg === "Não autorizado" || msg === "Acesso negado") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    console.error("add-credits error:", error);
    return NextResponse.json({ error: "Erro ao adicionar créditos" }, { status: 500 });
  }
}
