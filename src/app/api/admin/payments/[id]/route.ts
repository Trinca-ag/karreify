import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/utils/admin-verify";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

/**
 * DELETE /api/admin/payments/{id}
 *
 * Remove um registro de pagamento da coleção `pendingPayments`. Não toca em
 * moedas do usuário — se a moeda foi creditada por um `checkout.completed`,
 * ela continua no saldo (admin só está limpando o registro do painel).
 *
 * Para estornar moedas usar o fluxo `checkout.refunded` do Abacate Pay.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await verifyAdminRequest(request);

    if (!params.id) {
      return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
    }

    const ref = adminDb.collection("pendingPayments").doc(params.id);
    const snap = await ref.get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Pagamento não encontrado" }, { status: 404 });
    }

    await ref.delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro";
    if (msg === "Não autorizado" || msg === "Acesso negado") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    console.error("admin payment delete error:", error);
    return NextResponse.json({ error: "Erro ao excluir pagamento" }, { status: 500 });
  }
}
