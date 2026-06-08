import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { CREDIT_PACKS, type CreditPackId } from "@/types";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { createCheckout, AbacatePayError } from "@/lib/abacatepay";

/**
 * Origem para onde o Abacate Pay redireciona o user após pagar/cancelar.
 * Em prod (ou se NEXT_PUBLIC_APP_URL estiver setada), preferimos o env explícito
 * para evitar URLs estranhas de preview deploys. Em dev, lemos o header `Host`
 * — `request.nextUrl.origin` retorna o listen address do server (ex: `0.0.0.0`
 * quando rodando com `next dev -H 0.0.0.0`), que não é navegável pelo browser.
 */
function appUrl(request: NextRequest): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.NODE_ENV === "production" && envUrl) return envUrl;

  const host = request.headers.get("host") || "localhost:3000";
  // 0.0.0.0 é endereço de bind, não de acesso. O browser usa localhost.
  const safeHost = host.replace(/^0\.0\.0\.0\b/, "localhost");
  const proto =
    request.headers.get("x-forwarded-proto") ||
    (safeHost.startsWith("localhost") || safeHost.startsWith("127.0.0.1")
      ? "http"
      : "https");
  return `${proto}://${safeHost}`;
}

export async function POST(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  const rl = rateLimit(ctx.uid, { scope: "payments-checkout", limit: 10, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const { packId } = await request.json();
    const pack = CREDIT_PACKS.find((p) => p.id === (packId as CreditPackId));
    if (!pack) {
      return NextResponse.json({ error: "Pacote inválido" }, { status: 400 });
    }

    const userRef = adminDb.collection("users").doc(ctx.uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }
    const userData = userSnap.data() ?? {};

    if (userData.role === "tester") {
      return NextResponse.json(
        { error: "Contas Tester não podem comprar pacotes" },
        { status: 403 }
      );
    }

    const pendingRef = adminDb.collection("pendingPayments").doc();
    await pendingRef.set({
      userId: ctx.uid,
      packId: pack.id,
      abacateProductId: pack.abacateProductId,
      amount: pack.price,
      creditsToAdd: pack.totalCredits,
      // Congela o indicador do comprador no instante da compra, para o webhook
      // gerar a comissão sem reler o doc do usuário. referredBy é imutável, então
      // isto coincide com users.referredBy — fica como fonte primária + auditoria.
      referredBy: (userData.referredBy as string | undefined) ?? null,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    try {
      const origin = appUrl(request);
      const checkout = await createCheckout({
        productId: pack.abacateProductId,
        externalId: pendingRef.id,
        returnUrl: `${origin}/plans`,
        completionUrl: `${origin}/dashboard?payment=success&pid=${pendingRef.id}`,
        methods: ["PIX", "CARD"],
        metadata: {
          userId: ctx.uid,
          packId: pack.id,
          paymentId: pendingRef.id,
        },
        customer: {
          name: (userData.displayName as string | undefined) ?? undefined,
          email: ctx.email ?? undefined,
        },
      });

      await pendingRef.update({
        abacateCheckoutId: checkout.id,
        updatedAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({
        success: true,
        url: checkout.url,
        paymentId: pendingRef.id,
        checkoutId: checkout.id,
      });
    } catch (e) {
      const errorEntry =
        e instanceof AbacatePayError
          ? {
              source: "checkout-create",
              code: "ABACATEPAY_ERROR",
              message: `AbacatePay retornou ${e.status}`,
              httpStatus: e.status,
              body: e.body.slice(0, 2000),
              timestamp: new Date().toISOString(),
            }
          : {
              source: "checkout-create",
              code: "UNEXPECTED_ERROR",
              message: e instanceof Error ? e.message : String(e),
              timestamp: new Date().toISOString(),
            };

      await pendingRef.update({
        status: "failed",
        updatedAt: FieldValue.serverTimestamp(),
        errors: FieldValue.arrayUnion(errorEntry),
        lastError: errorEntry,
      });

      if (e instanceof AbacatePayError) {
        console.error("[payments/checkout] AbacatePay error:", e.status, e.body);
        return NextResponse.json(
          { error: "Não foi possível abrir o checkout. Tente novamente em instantes." },
          { status: 502 }
        );
      }
      throw e;
    }
  } catch (error) {
    console.error("[payments/checkout] unexpected error:", error);
    return NextResponse.json({ error: "Erro ao iniciar pagamento" }, { status: 500 });
  }
}
