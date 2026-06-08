import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireUser, authErrorResponse } from "@/lib/auth-server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { ensureReferralCode, referralLinkFor } from "@/lib/referral-server";
import { REFERRAL_CREDITS } from "@/types";

export const dynamic = "force-dynamic";

/**
 * Retorna o link de indicação do usuário, gerando o código na primeira chamada.
 * Também devolve a contagem de indicações confirmadas para exibir no /profile.
 */
export async function GET(request: NextRequest) {
  let ctx;
  try {
    ctx = await requireUser(request);
  } catch (e) {
    return authErrorResponse(e);
  }

  const rl = rateLimit(ctx.uid, { scope: "referral-code", limit: 20, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const code = await ensureReferralCode(ctx.uid);

    const countSnap = await adminDb
      .collection("referrals")
      .where("referrerUid", "==", ctx.uid)
      .count()
      .get();
    const referralCount = countSnap.data().count;

    return NextResponse.json({
      code,
      link: referralLinkFor(code),
      referralCount,
      creditsPerReferral: REFERRAL_CREDITS,
    });
  } catch (error) {
    console.error("[referral/code]", error);
    return NextResponse.json({ error: "Erro ao obter link de indicação" }, { status: 500 });
  }
}
