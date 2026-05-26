import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { verifyAdminRequest } from "@/utils/admin-verify";
import { adminDb } from "@/lib/firebase-admin";
import { type JobProvider } from "@/lib/adzuna-usage";

export const dynamic = "force-dynamic";

interface ErrorDoc {
  ts?: Timestamp;
  status: string;
  provider?: JobProvider;
  keyword?: string;
  uf?: string;
  city?: string;
  period?: string;
  page?: number;
  httpStatus?: number;
  durationMs?: number;
  userId?: string;
}

/** Console de erros em tempo real. Endpoint pensado para ser chamado a cada
 *  poucos segundos pelo admin — retorna até `limit` erros do provider
 *  pedido, opcionalmente filtrando os anteriores a um timestamp (`since`)
 *  para a UI só baixar o delta.
 *
 *  Implementação propositalmente sem combinar where(provider) + where(status)
 *  + orderBy(ts): essa combinação exigiria índice composto em Firestore.
 *  Em vez disso, filtramos só por ts (mesmo campo do orderBy, sem índice
 *  extra) e descartamos status/provider em memória. No fluxo de delta isso
 *  é barato — cada poll traz poucos docs novos. */
export async function GET(request: NextRequest) {
  try {
    await verifyAdminRequest(request);

    const url = new URL(request.url);
    const provider = url.searchParams.get("provider") as JobProvider | null;
    const sinceParam = url.searchParams.get("since");
    const limitParam = url.searchParams.get("limit");

    if (provider !== "adzuna" && provider !== "jooble") {
      return NextResponse.json(
        { error: "provider deve ser 'adzuna' ou 'jooble'" },
        { status: 400 }
      );
    }

    const limit = Math.min(100, Math.max(1, parseInt(limitParam || "30", 10)));

    const sinceMs = (() => {
      if (!sinceParam) return 0;
      const n = parseInt(sinceParam, 10);
      return Number.isNaN(n) || n <= 0 ? 0 : n;
    })();

    let snap;
    if (sinceMs > 0) {
      // Delta: só docs criados depois do último poll.
      snap = await adminDb
        .collection("adzuna_calls")
        .where("ts", ">", Timestamp.fromMillis(sinceMs))
        .orderBy("ts", "desc")
        .limit(200)
        .get();
    } else {
      // Carga inicial: últimos docs (mistura tudo, filtra em memória).
      snap = await adminDb
        .collection("adzuna_calls")
        .orderBy("ts", "desc")
        .limit(500)
        .get();
    }

    const errors = snap.docs
      .map((d) => ({ id: d.id, data: d.data() as ErrorDoc }))
      .filter(({ data }) => {
        const p = data.provider ?? "adzuna";
        return p === provider && data.status === "api_error";
      })
      .slice(0, limit)
      .map(({ id, data }) => {
        const tsMs = data.ts?.toMillis() ?? 0;
        return {
          id,
          tsMs,
          ts: tsMs ? new Date(tsMs).toISOString() : null,
          provider: data.provider ?? provider,
          keyword: data.keyword || "",
          uf: data.uf || "",
          city: data.city || "",
          period: data.period || "",
          page: data.page || 1,
          httpStatus:
            typeof data.httpStatus === "number" ? data.httpStatus : null,
          durationMs:
            typeof data.durationMs === "number" ? data.durationMs : null,
          userId: data.userId || "",
        };
      });

    return NextResponse.json({
      success: true,
      provider,
      errors,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro";
    if (msg === "Não autorizado" || msg === "Acesso negado") {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    console.error("admin jobs-errors error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar erros" },
      { status: 500 }
    );
  }
}
