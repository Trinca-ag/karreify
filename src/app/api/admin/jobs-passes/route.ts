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
 * GET /api/admin/jobs-passes
 *
 * Lista as 200 compras mais recentes de passes do /jobs (transações de débito
 * com feature="jobs-pass") via collectionGroup query nas subcoleções
 * users/{uid}/transactions, fazendo join leve no usuário.
 *
 * O `uid` é extraído do parent path do doc para que o admin possa apagar o
 * registro mesmo sem o cliente precisar conhecer a subcoleção exata.
 */
export async function GET(request: NextRequest) {
  try {
    await verifyAdminRequest(request);

    const snap = await adminDb
      .collectionGroup("transactions")
      .where("feature", "==", "jobs-pass")
      .orderBy("createdAt", "desc")
      .limit(200)
      .get();

    if (snap.empty) {
      return NextResponse.json({ success: true, passes: [] });
    }

    const userIds = Array.from(
      new Set(
        snap.docs
          .map((d) => d.ref.parent.parent?.id)
          .filter((v): v is string => Boolean(v))
      )
    );

    const userMap = new Map<string, UserSummary>();
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

    const passes = snap.docs.map((d) => {
      const data = d.data();
      const uid = d.ref.parent.parent?.id ?? "";
      const toIso = (v: unknown): string | null => {
        if (!v) return null;
        if (typeof v === "object" && v !== null && "toDate" in v) {
          return (v as { toDate: () => Date }).toDate().toISOString();
        }
        return null;
      };
      return {
        id: d.id,
        userId: uid,
        user: userMap.get(uid) ?? null,
        passId: (data.passId as string | undefined) ?? null,
        amount: (data.amount as number | undefined) ?? 0,
        description: (data.description as string | undefined) ?? "",
        createdAt: toIso(data.createdAt),
      };
    });

    return NextResponse.json({ success: true, passes });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro";
    if (msg === "Não autorizado" || msg === "Acesso negado") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    console.error("admin jobs-passes error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar passes" },
      { status: 500 }
    );
  }
}
