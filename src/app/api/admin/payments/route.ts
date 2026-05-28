import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/utils/admin-verify";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

interface UserSummary {
  uid: string;
  displayName: string | null;
  email: string | null;
}

/**
 * GET /api/admin/payments
 *
 * Lista os 100 pagamentos mais recentes (pendingPayments) com join no usuário
 * que abriu o checkout. Cada doc inclui:
 *   - status: pending|completed|refunded|disputed|failed
 *   - errors: array com os erros que aconteceram nesse pagamento
 *   - lastError: último erro registrado (atalho pro UI)
 *
 * Sem paginação por enquanto — quando passar de 100 pagamentos por dia trocamos
 * pra cursor (createdAt + doc id).
 */
export async function GET(request: NextRequest) {
  try {
    await verifyAdminRequest(request);

    const snap = await adminDb
      .collection("pendingPayments")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();

    if (snap.empty) {
      return NextResponse.json({ success: true, payments: [] });
    }

    const userIds = Array.from(
      new Set(snap.docs.map((d) => d.data().userId as string).filter(Boolean))
    );

    const userMap = new Map<string, UserSummary>();
    // Firestore in-query aceita até 30 itens. Como temos limit=100 pagamentos e
    // múltiplos podem ser do mesmo user, o set é quase sempre pequeno. Para
    // segurança quebro em chunks de 30.
    for (let i = 0; i < userIds.length; i += 30) {
      const chunk = userIds.slice(i, i + 30);
      if (chunk.length === 0) continue;
      const usersSnap = await adminDb
        .collection("users")
        .where("__name__", "in", chunk)
        .get();
      for (const u of usersSnap.docs) {
        const data = u.data();
        userMap.set(u.id, {
          uid: u.id,
          displayName: (data.displayName as string | undefined) ?? null,
          email: (data.email as string | undefined) ?? null,
        });
      }
    }

    const payments = snap.docs.map((d) => {
      const data = d.data();
      const toIso = (v: unknown): string | null => {
        if (!v) return null;
        if (typeof v === "object" && v !== null && "toDate" in v) {
          return (v as { toDate: () => Date }).toDate().toISOString();
        }
        return null;
      };
      return {
        id: d.id,
        userId: data.userId,
        user: userMap.get(data.userId as string) ?? null,
        packId: data.packId,
        amount: data.amount,
        creditsToAdd: data.creditsToAdd,
        status: data.status,
        abacateCheckoutId: data.abacateCheckoutId ?? null,
        abacateProductId: data.abacateProductId ?? null,
        createdAt: toIso(data.createdAt),
        updatedAt: toIso(data.updatedAt),
        completedAt: toIso(data.completedAt),
        refundedAt: toIso(data.refundedAt),
        errors: Array.isArray(data.errors) ? data.errors : [],
        lastError: data.lastError ?? null,
      };
    });

    return NextResponse.json({ success: true, payments });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro";
    if (msg === "Não autorizado" || msg === "Acesso negado") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    console.error("admin payments error:", error);
    return NextResponse.json({ error: "Erro ao buscar pagamentos" }, { status: 500 });
  }
}
