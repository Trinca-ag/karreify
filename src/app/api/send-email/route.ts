import { NextRequest, NextResponse } from "next/server";
import { sendTransactionalEmail } from "@/lib/mailer";
import {
  verificationEmail,
  verificationEmailText,
  packPurchaseEmail,
  packPurchaseEmailText,
  passwordResetEmail,
  passwordResetEmailText,
} from "@/utils/email-templates";

const SUBJECTS: Record<string, string> = {
  verification: "Código de verificação — NextCV",
  "pack-purchase": "Compra de moedas confirmada — NextCV",
  "password-reset": "Recuperação de senha — NextCV",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, email } = body;

    if (!type || !email) {
      return NextResponse.json({ error: "type e email são obrigatórios" }, { status: 400 });
    }

    let html = "";
    let text = "";
    let priority: "high" | "normal" = "normal";

    switch (type) {
      case "verification":
        if (!body.code) return NextResponse.json({ error: "code é obrigatório" }, { status: 400 });
        html = verificationEmail(body.code);
        text = verificationEmailText(body.code);
        priority = "high";
        break;
      case "pack-purchase":
        if (!body.userName || !body.packName || body.baseCredits == null || body.totalCredits == null || body.price == null) {
          return NextResponse.json({ error: "Dados do pacote são obrigatórios" }, { status: 400 });
        }
        html = packPurchaseEmail(
          body.userName,
          body.packName,
          body.baseCredits,
          body.bonusCredits ?? 0,
          body.totalCredits,
          body.price
        );
        text = packPurchaseEmailText(
          body.userName,
          body.packName,
          body.baseCredits,
          body.bonusCredits ?? 0,
          body.totalCredits,
          body.price
        );
        break;
      case "password-reset":
        if (!body.code) return NextResponse.json({ error: "code é obrigatório" }, { status: 400 });
        html = passwordResetEmail(body.code);
        text = passwordResetEmailText(body.code);
        priority = "high";
        break;
      default:
        return NextResponse.json({ error: "Tipo de email inválido" }, { status: 400 });
    }

    const result = await sendTransactionalEmail({
      to: email,
      subject: SUBJECTS[type] || "NextCV",
      html,
      text,
      priority,
    });

    if (result.fallback) {
      console.warn(`[Email] SMTP not configured. Type: ${type}, To: ${email}`);
      if (type === "verification" || type === "password-reset") {
        console.warn(`[Email] Code: ${body.code}`);
      }
      return NextResponse.json({ success: true, fallback: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Erro ao enviar email" },
      { status: 500 }
    );
  }
}
