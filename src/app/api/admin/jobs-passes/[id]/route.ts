import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/utils/admin-verify";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

/**
 * DELETE /api/admin/jobs-passes/{id}?uid={userId}
 *
 * Remove o registro da transação de compra de passe. Não estorna moedas e
 * não cancela o passe em si — apenas remove a entrada do histórico que o
 * painel admin lista. Para devolver moedas usar add-credits manualmente,
 * para suspender o passe usar /api/admin/users.
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

    const uid = new URL(request.url).searchParams.get("uid");
    if (!uid) {
      return NextResponse.json(
        { error: "Parâmetro uid obrigatório" },
        { status: 400 }
      );
    }

    const ref = adminDb
      .collection("users")
      .doc(uid)
      .collection("transactions")
      .doc(params.id);
    const snap = await ref.get();
    if (!snap.exists) {
      return NextResponse.json(
        { error: "Registro não encontrado" },
        { status: 404 }
      );
    }

    const data = snap.data();
    if (data?.feature !== "jobs-pass") {
      return NextResponse.json(
        { error: "Transação não é de passe" },
        { status: 400 }
      );
    }

    await ref.delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro";
    if (msg === "Não autorizado" || msg === "Acesso negado") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    console.error("admin jobs-pass delete error:", error);
    return NextResponse.json(
      { error: "Erro ao excluir registro" },
      { status: 500 }
    );
  }
}
