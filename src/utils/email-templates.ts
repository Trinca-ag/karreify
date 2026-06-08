// ── Shared layout ───────────────────────────────────────

function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

function baseLayout(content: string, previewText?: string): string {
  const year = new Date().getFullYear();
  const url = appUrl();
  // Hidden preview text shown in the inbox preview pane below the subject.
  // Email clients pick the first visible text — we shove a 1px hidden span
  // so the preview is intentional, not a stray fragment from the heading.
  const preview = previewText
    ? `<span style="display:none !important;font-size:1px;color:#fafafa;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${previewText}</span>`
    : "";

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Karreify</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#111827;-webkit-font-smoothing:antialiased;">
  ${preview}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 1px 2px rgba(0,0,0,0.04),0 6px 16px rgba(15,23,42,0.05);">

          <tr>
            <td align="center" style="padding:36px 40px 28px;background-color:#ffffff;border-bottom:1px solid #f3f4f6;">
              <img src="${url}/images/logo-karreify.png" alt="Karreify" width="150" style="display:block;margin:0 auto;max-width:150px;height:auto;border:0;outline:none;text-decoration:none;" />
            </td>
          </tr>

          <tr>
            <td style="padding:36px 40px 28px;">
              ${content}
            </td>
          </tr>

          <tr>
            <td style="padding:22px 40px;background-color:#f9fafb;border-top:1px solid #f3f4f6;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;color:#6b7280;line-height:1.5;">
                &copy; ${year} Karreify &middot; Impuls&atilde;o de carreira com intelig&ecirc;ncia artificial.
              </p>
              <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.5;">
                Este &eacute; um email autom&aacute;tico, por favor n&atilde;o responda.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── Atomic helpers ──────────────────────────────────────

function heading(title: string): string {
  return `<h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#0f172a;line-height:1.3;letter-spacing:-0.01em;">${title}</h1>`;
}

function paragraph(text: string, marginBottom = 22): string {
  return `<p style="margin:0 0 ${marginBottom}px;font-size:15px;line-height:1.6;color:#374151;">${text}</p>`;
}

function smallText(text: string): string {
  return `<p style="margin:20px 0 0;font-size:13px;line-height:1.55;color:#6b7280;">${text}</p>`;
}

function codeBlock(code: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 24px;">
      <tr>
        <td align="center" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:24px 16px;">
          <span style="display:inline-block;font-size:30px;font-weight:700;letter-spacing:10px;color:#0f172a;font-family:'SF Mono',Menlo,Consolas,'Courier New',monospace;">
            ${code}
          </span>
        </td>
      </tr>
    </table>`;
}

function expiryNote(text: string): string {
  return `<p style="margin:0 0 22px;font-size:12px;color:#6b7280;text-align:center;letter-spacing:0.02em;">${text}</p>`;
}

function ctaButton(href: string, label: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:8px auto 0;">
      <tr>
        <td style="border-radius:8px;background-color:#2563eb;">
          <a href="${href}" target="_blank" style="display:inline-block;padding:12px 28px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:0.01em;">
            ${label}
          </a>
        </td>
      </tr>
    </table>`;
}

function infoCard(rows: Array<{ label: string; value: string; accent?: boolean }>): string {
  const body = rows
    .map(
      (r, i) => `
      <tr>
        <td style="padding:${i === 0 ? "0" : "10px"} 0 10px;${i < rows.length - 1 ? "border-bottom:1px solid #f1f5f9;" : ""}">
          <span style="font-size:13px;color:#6b7280;">${r.label}</span>
        </td>
        <td style="padding:${i === 0 ? "0" : "10px"} 0 10px;${i < rows.length - 1 ? "border-bottom:1px solid #f1f5f9;" : ""}text-align:right;">
          <span style="font-size:14px;color:${r.accent ? "#2563eb" : "#0f172a"};font-weight:${r.accent ? "700" : "600"};">${r.value}</span>
        </td>
      </tr>`
    )
    .join("");
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 24px;background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;">
      <tr>
        <td style="padding:18px 22px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${body}
          </table>
        </td>
      </tr>
    </table>`;
}

function ticketCard(ticketId: string, title: string, extra?: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 24px;">
      <tr>
        <td style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:18px 20px;">
          <div style="font-size:11px;color:#6b7280;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px;font-weight:600;">Chamado #${ticketId}</div>
          <div style="font-size:15px;color:#0f172a;font-weight:600;line-height:1.4;">${title}</div>
          ${extra ? `<div style="font-size:13px;color:#4b5563;margin-top:14px;line-height:1.6;padding-top:14px;border-top:1px solid #e5e7eb;">${extra}</div>` : ""}
        </td>
      </tr>
    </table>`;
}

// ── Plain-text helpers ──────────────────────────────────

function textFooter(): string {
  const year = new Date().getFullYear();
  return `\n\n--\nKarreify · © ${year}\nImpulso de carreira com inteligência artificial.\nEste é um email automático, por favor não responda.`;
}

// ── Verification codes ──────────────────────────────────

export function verificationEmail(code: string): string {
  return baseLayout(
    `
    ${heading("Verifique seu dispositivo")}
    ${paragraph(
      "Para confirmar que este dispositivo &eacute; seu, utilize o c&oacute;digo abaixo. Ele &eacute; v&aacute;lido por <strong style=\"color:#0f172a;\">10 minutos</strong>."
    )}
    ${codeBlock(code)}
    ${expiryNote("V&aacute;lido por 10 minutos")}
    ${smallText(
      "Se voc&ecirc; n&atilde;o reconhece esta tentativa de acesso, ignore este email e considere alterar sua senha."
    )}
  `,
    "Use o código de verificação para confirmar seu dispositivo."
  );
}

export function verificationEmailText(code: string): string {
  return `Karreify — Verificação de dispositivo

Use o código abaixo para confirmar que este dispositivo é seu:

    ${code}

Válido por 10 minutos.

Se você não reconhece esta tentativa de acesso, ignore este email e considere alterar sua senha.${textFooter()}`;
}

export function passwordResetEmail(code: string): string {
  return baseLayout(
    `
    ${heading("Redefini&ccedil;&atilde;o de senha")}
    ${paragraph(
      "Recebemos um pedido para redefinir a senha da sua conta. Utilize o c&oacute;digo abaixo na pr&oacute;xima tela para concluir."
    )}
    ${codeBlock(code)}
    ${expiryNote("V&aacute;lido por 10 minutos")}
    ${smallText(
      "Se voc&ecirc; n&atilde;o solicitou esta redefini&ccedil;&atilde;o, ignore este email. Sua senha atual continua v&aacute;lida."
    )}
  `,
    "Código para redefinir sua senha."
  );
}

export function passwordResetEmailText(code: string): string {
  return `Karreify — Redefinição de senha

Use o código abaixo para concluir a redefinição da sua senha:

    ${code}

Válido por 10 minutos.

Se você não solicitou esta redefinição, ignore este email. Sua senha atual continua válida.${textFooter()}`;
}

export function emailChangeEmail(code: string): string {
  return baseLayout(
    `
    ${heading("Confirma&ccedil;&atilde;o de novo email")}
    ${paragraph(
      "Voc&ecirc; solicitou a altera&ccedil;&atilde;o do email da sua conta. Utilize o c&oacute;digo abaixo para confirmar a opera&ccedil;&atilde;o."
    )}
    ${codeBlock(code)}
    ${expiryNote("V&aacute;lido por 10 minutos")}
    ${smallText(
      "Se voc&ecirc; n&atilde;o solicitou esta altera&ccedil;&atilde;o, ignore este email e considere alterar sua senha imediatamente."
    )}
  `,
    "Confirme a alteração do email da sua conta."
  );
}

export function emailChangeEmailText(code: string): string {
  return `Karreify — Confirmação de novo email

Use o código abaixo para confirmar a alteração do email da sua conta:

    ${code}

Válido por 10 minutos.

Se você não solicitou esta alteração, ignore este email e considere alterar sua senha.${textFooter()}`;
}

export function adminVerificationEmail(code: string): string {
  return baseLayout(
    `
    ${heading("Acesso administrativo")}
    ${paragraph(
      "Utilize o c&oacute;digo abaixo para concluir a opera&ccedil;&atilde;o no painel administrativo do Karreify."
    )}
    ${codeBlock(code)}
    ${expiryNote("V&aacute;lido por 15 minutos")}
    ${smallText(
      "Se voc&ecirc; n&atilde;o reconhece esta a&ccedil;&atilde;o, n&atilde;o utilize o c&oacute;digo e revise os acessos ao painel."
    )}
  `,
    "Código de acesso ao painel administrativo."
  );
}

export function adminVerificationEmailText(code: string): string {
  return `Karreify — Acesso administrativo

Use o código abaixo para concluir a operação no painel administrativo:

    ${code}

Válido por 15 minutos.

Se você não reconhece esta ação, não utilize o código e revise os acessos ao painel.${textFooter()}`;
}

// ── Pack purchase ───────────────────────────────────────

export function packPurchaseEmail(
  userName: string,
  packName: string,
  baseCredits: number,
  bonusCredits: number,
  totalCredits: number,
  price: number
): string {
  const url = appUrl();
  const rows = [
    { label: "Pacote", value: packName, accent: true },
    { label: "Valor", value: `R$ ${price} · compra única` },
    { label: "Moedas base", value: String(baseCredits) },
  ];
  if (bonusCredits > 0) {
    rows.push({ label: "Moedas bônus", value: `+${bonusCredits}` });
  }
  rows.push({ label: "Total adicionado", value: `${totalCredits} moedas`, accent: true });

  return baseLayout(
    `
    ${heading("Compra confirmada")}
    ${paragraph(
      `Ol&aacute;, <strong style="color:#0f172a;">${userName}</strong>. Sua compra foi processada com sucesso e suas moedas j&aacute; est&atilde;o dispon&iacute;veis para uso.`
    )}
    ${infoCard(rows)}
    ${ctaButton(`${url}/dashboard`, "Acessar dashboard")}
    ${smallText("Caso identifique alguma divergência, abra um chamado pelo suporte.")}
  `,
    `Compra confirmada · ${totalCredits} moedas adicionadas.`
  );
}

export function packPurchaseEmailText(
  userName: string,
  packName: string,
  baseCredits: number,
  bonusCredits: number,
  totalCredits: number,
  price: number
): string {
  const bonusLine = bonusCredits > 0 ? `\nMoedas bônus: +${bonusCredits}` : "";
  const url = appUrl();
  return `Karreify — Compra confirmada

Olá ${userName},

Sua compra foi processada com sucesso. Suas moedas já estão disponíveis.

Pacote: ${packName}
Valor: R$ ${price} (compra única)
Moedas base: ${baseCredits}${bonusLine}
Total adicionado: ${totalCredits} moedas

Acesse o dashboard: ${url}/dashboard

Caso identifique alguma divergência, abra um chamado pelo suporte.${textFooter()}`;
}

// ── Welcome ─────────────────────────────────────────────

export function welcomeEmail(userName: string): string {
  const url = appUrl();
  return baseLayout(
    `
    ${heading("Bem-vindo(a) ao Karreify")}
    ${paragraph(
      `Ol&aacute;, <strong style="color:#0f172a;">${userName}</strong>. Sua conta foi criada com sucesso.`
    )}
    ${paragraph(
      "A partir de agora voc&ecirc; tem acesso a todas as ferramentas de intelig&ecirc;ncia artificial da plataforma: an&aacute;lise de curr&iacute;culo, cria&ccedil;&atilde;o e adapta&ccedil;&atilde;o de curr&iacute;culos, carta de apresenta&ccedil;&atilde;o e an&aacute;lise de empresas."
    )}
    ${ctaButton(`${url}/dashboard`, "Acessar dashboard")}
    ${smallText("Qualquer dúvida ou sugestão, abra um chamado pelo suporte direto no dashboard.")}
  `,
    "Sua conta Karreify está pronta para uso."
  );
}

export function welcomeEmailText(userName: string): string {
  const url = appUrl();
  return `Karreify — Bem-vindo(a)

Olá ${userName},

Sua conta foi criada com sucesso. A partir de agora você tem acesso a todas as ferramentas de inteligência artificial da plataforma: análise de currículo, criação e adaptação de currículos, carta de apresentação e análise de empresas.

Acesse o dashboard: ${url}/dashboard

Qualquer dúvida ou sugestão, abra um chamado pelo suporte direto no dashboard.${textFooter()}`;
}

// ── Indicação / Carteira ────────────────────────────────

export function referralBonusEmail(userName: string, credits: number): string {
  const url = appUrl();
  return baseLayout(
    `
    ${heading("Você ganhou créditos por indicação")}
    ${paragraph(
      `Ol&aacute;, <strong style="color:#0f172a;">${escapeHtml(userName)}</strong>. Um novo usu&aacute;rio se cadastrou usando o seu link de indica&ccedil;&atilde;o.`
    )}
    ${infoCard([
      { label: "B&ocirc;nus recebido", value: `+${credits} cr&eacute;ditos`, accent: true },
      { label: "Motivo", value: "Cadastro por indica&ccedil;&atilde;o" },
    ])}
    ${ctaButton(`${url}/profile`, "Ver minhas indicações")}
    ${smallText(
      "Continue compartilhando seu link: voc&ecirc; ganha cr&eacute;ditos a cada cadastro e ainda recebe comiss&atilde;o em dinheiro quando seu indicado compra um pacote."
    )}
  `,
    `Você ganhou ${credits} créditos por indicação.`
  );
}

export function referralBonusEmailText(userName: string, credits: number): string {
  const url = appUrl();
  return `Karreify — Você ganhou créditos por indicação

Olá ${userName},

Um novo usuário se cadastrou usando o seu link de indicação. Você recebeu +${credits} créditos como bônus.

Continue compartilhando seu link: você ganha créditos a cada cadastro e ainda recebe comissão em dinheiro quando seu indicado compra um pacote.

Acesse: ${url}/profile${textFooter()}`;
}

export function commissionReceivedEmail(
  userName: string,
  amountCents: number,
  packName: string,
  holdDays: number
): string {
  const url = appUrl();
  const reais = `R$ ${(amountCents / 100).toFixed(2).replace(".", ",")}`;
  return baseLayout(
    `
    ${heading("Você recebeu uma comissão")}
    ${paragraph(
      `Ol&aacute;, <strong style="color:#0f172a;">${escapeHtml(userName)}</strong>. Um usu&aacute;rio que voc&ecirc; indicou realizou uma compra — e voc&ecirc; ganhou comiss&atilde;o em dinheiro.`
    )}
    ${infoCard([
      { label: "Comiss&atilde;o", value: reais, accent: true },
      { label: "Origem", value: `Compra do ${escapeHtml(packName)}` },
      { label: "Libera&ccedil;&atilde;o", value: `Em ${holdDays} dias para saque` },
    ])}
    ${ctaButton(`${url}/carteira`, "Ver minha carteira")}
    ${smallText(
      `O valor fica retido por ${holdDays} dias e depois &eacute; liberado automaticamente para saque via PIX.`
    )}
  `,
    `Você recebeu ${reais} de comissão.`
  );
}

export function commissionReceivedEmailText(
  userName: string,
  amountCents: number,
  packName: string,
  holdDays: number
): string {
  const url = appUrl();
  const reais = `R$ ${(amountCents / 100).toFixed(2).replace(".", ",")}`;
  return `Karreify — Você recebeu uma comissão

Olá ${userName},

Um usuário que você indicou realizou uma compra — e você ganhou comissão em dinheiro.

Comissão: ${reais}
Origem: Compra do ${packName}
Liberação: em ${holdDays} dias para saque

O valor fica retido por ${holdDays} dias e depois é liberado automaticamente para saque via PIX.

Acesse: ${url}/carteira${textFooter()}`;
}

export function commissionReleasedEmail(userName: string, amountCents: number): string {
  const url = appUrl();
  const reais = `R$ ${(amountCents / 100).toFixed(2).replace(".", ",")}`;
  return baseLayout(
    `
    ${heading("Comissão liberada para saque")}
    ${paragraph(
      `Ol&aacute;, <strong style="color:#0f172a;">${escapeHtml(userName)}</strong>. Uma comiss&atilde;o sua cumpriu o per&iacute;odo de reten&ccedil;&atilde;o e j&aacute; est&aacute; dispon&iacute;vel para saque.`
    )}
    ${infoCard([
      { label: "Valor liberado", value: reais, accent: true },
      { label: "Status", value: "Dispon&iacute;vel para saque" },
    ])}
    ${ctaButton(`${url}/carteira`, "Acessar minha carteira")}
    ${smallText(
      "Voc&ecirc; pode converter o saldo em cr&eacute;ditos ou solicitar saque via PIX (m&iacute;nimo R$ 30,00)."
    )}
  `,
    `${reais} liberado para saque.`
  );
}

export function commissionReleasedEmailText(userName: string, amountCents: number): string {
  const url = appUrl();
  const reais = `R$ ${(amountCents / 100).toFixed(2).replace(".", ",")}`;
  return `Karreify — Comissão liberada para saque

Olá ${userName},

Uma comissão sua cumpriu o período de retenção e já está disponível para saque.

Valor liberado: ${reais}
Status: disponível para saque

Você pode converter o saldo em créditos ou solicitar saque via PIX (mínimo R$ 30,00).

Acesse: ${url}/carteira${textFooter()}`;
}

type WithdrawalEmailStatus = "requested" | "approved" | "paid" | "rejected";

const withdrawalCopy: Record<WithdrawalEmailStatus, { h: string; p: string; s: string }> = {
  requested: {
    h: "Solicitação de saque recebida",
    p: "Recebemos sua solicita&ccedil;&atilde;o de saque. Ela est&aacute; em an&aacute;lise e voc&ecirc; ser&aacute; avisado quando for aprovada e paga.",
    s: "Em an&aacute;lise",
  },
  approved: {
    h: "Saque aprovado",
    p: "Seu saque foi aprovado. O pagamento via PIX ser&aacute; efetuado em breve.",
    s: "Aprovado",
  },
  paid: {
    h: "Saque pago",
    p: "Seu saque foi pago via PIX. O valor deve cair na conta vinculada &agrave; sua chave em instantes.",
    s: "Pago",
  },
  rejected: {
    h: "Saque recusado",
    p: "Sua solicita&ccedil;&atilde;o de saque foi recusada e o valor foi devolvido ao seu saldo dispon&iacute;vel.",
    s: "Recusado",
  },
};

export function withdrawalStatusEmail(
  userName: string,
  status: WithdrawalEmailStatus,
  amountCents: number,
  opts?: { reason?: string; payoutRef?: string }
): string {
  const url = appUrl();
  const reais = `R$ ${(amountCents / 100).toFixed(2).replace(".", ",")}`;
  const copy = withdrawalCopy[status];
  const rows: Array<{ label: string; value: string; accent?: boolean }> = [
    { label: "Valor", value: reais, accent: true },
    { label: "Status", value: copy.s },
  ];
  if (status === "rejected" && opts?.reason) {
    rows.push({ label: "Motivo", value: escapeHtml(opts.reason) });
  }
  if (status === "paid" && opts?.payoutRef) {
    rows.push({ label: "Comprovante", value: escapeHtml(opts.payoutRef) });
  }
  return baseLayout(
    `
    ${heading(copy.h)}
    ${paragraph(`Ol&aacute;, <strong style="color:#0f172a;">${escapeHtml(userName)}</strong>. ${copy.p}`)}
    ${infoCard(rows)}
    ${ctaButton(`${url}/carteira`, "Ver minha carteira")}
  `,
    `${copy.h} · ${reais}`
  );
}

export function withdrawalStatusEmailText(
  userName: string,
  status: WithdrawalEmailStatus,
  amountCents: number,
  opts?: { reason?: string; payoutRef?: string }
): string {
  const url = appUrl();
  const reais = `R$ ${(amountCents / 100).toFixed(2).replace(".", ",")}`;
  const plain: Record<WithdrawalEmailStatus, string> = {
    requested:
      "Recebemos sua solicitação de saque. Ela está em análise e você será avisado quando for aprovada e paga.",
    approved: "Seu saque foi aprovado. O pagamento via PIX será efetuado em breve.",
    paid: "Seu saque foi pago via PIX. O valor deve cair na conta vinculada à sua chave em instantes.",
    rejected:
      "Sua solicitação de saque foi recusada e o valor foi devolvido ao seu saldo disponível.",
  };
  const extra =
    status === "rejected" && opts?.reason
      ? `\nMotivo: ${opts.reason}`
      : status === "paid" && opts?.payoutRef
        ? `\nComprovante: ${opts.payoutRef}`
        : "";
  return `Karreify — ${withdrawalCopy[status].h}

Olá ${userName},

${plain[status]}

Valor: ${reais}${extra}

Acesse: ${url}/carteira${textFooter()}`;
}

export function commissionReversedEmail(userName: string, amountCents: number): string {
  const url = appUrl();
  const reais = `R$ ${(amountCents / 100).toFixed(2).replace(".", ",")}`;
  return baseLayout(
    `
    ${heading("Comissão estornada")}
    ${paragraph(
      `Ol&aacute;, <strong style="color:#0f172a;">${escapeHtml(userName)}</strong>. Uma comiss&atilde;o de indica&ccedil;&atilde;o foi estornada porque a compra do seu indicado foi reembolsada.`
    )}
    ${infoCard([
      { label: "Valor estornado", value: reais, accent: true },
      { label: "Motivo", value: "Compra reembolsada" },
    ])}
    ${ctaButton(`${url}/carteira`, "Ver minha carteira")}
    ${smallText(
      "Se o valor j&aacute; havia sido liberado, ele foi debitado do seu saldo. Saldos negativos bloqueiam novos saques at&eacute; serem regularizados."
    )}
  `,
    `Comissão de ${reais} estornada.`
  );
}

export function commissionReversedEmailText(userName: string, amountCents: number): string {
  const url = appUrl();
  const reais = `R$ ${(amountCents / 100).toFixed(2).replace(".", ",")}`;
  return `Karreify — Comissão estornada

Olá ${userName},

Uma comissão de indicação de ${reais} foi estornada porque a compra do seu indicado foi reembolsada.

Se o valor já havia sido liberado, ele foi debitado do seu saldo. Saldos negativos bloqueiam novos saques até serem regularizados.

Acesse: ${url}/carteira${textFooter()}`;
}

type RefundEmailStatus = "requested" | "approved" | "rejected";

const refundCopy: Record<RefundEmailStatus, { h: string; p: string; s: string }> = {
  requested: {
    h: "Solicitação de reembolso recebida",
    p: "Recebemos sua solicita&ccedil;&atilde;o de reembolso. Ela est&aacute; em an&aacute;lise e voc&ecirc; ser&aacute; avisado da decis&atilde;o.",
    s: "Em an&aacute;lise",
  },
  approved: {
    h: "Reembolso aprovado",
    p: "Seu reembolso foi aprovado. Os cr&eacute;ditos restantes da compra foram removidos e o valor ser&aacute; devolvido pelo mesmo meio de pagamento.",
    s: "Aprovado",
  },
  rejected: {
    h: "Reembolso recusado",
    p: "Sua solicita&ccedil;&atilde;o de reembolso foi analisada e n&atilde;o p&ocirc;de ser aprovada.",
    s: "Recusado",
  },
};

export function refundStatusEmail(
  userName: string,
  status: RefundEmailStatus,
  packName: string,
  amountCents: number,
  reason?: string
): string {
  const url = appUrl();
  const reais = `R$ ${(amountCents / 100).toFixed(2).replace(".", ",")}`;
  const copy = refundCopy[status];
  const rows: Array<{ label: string; value: string; accent?: boolean }> = [
    { label: "Compra", value: escapeHtml(packName), accent: true },
    { label: "Valor", value: reais },
    { label: "Status", value: copy.s },
  ];
  if (status === "rejected" && reason) {
    rows.push({ label: "Motivo", value: escapeHtml(reason) });
  }
  return baseLayout(
    `
    ${heading(copy.h)}
    ${paragraph(`Ol&aacute;, <strong style="color:#0f172a;">${escapeHtml(userName)}</strong>. ${copy.p}`)}
    ${infoCard(rows)}
    ${ctaButton(`${url}/compras`, "Ver minhas compras")}
  `,
    `${copy.h} · ${packName}`
  );
}

export function refundStatusEmailText(
  userName: string,
  status: RefundEmailStatus,
  packName: string,
  amountCents: number,
  reason?: string
): string {
  const url = appUrl();
  const reais = `R$ ${(amountCents / 100).toFixed(2).replace(".", ",")}`;
  const plain: Record<RefundEmailStatus, string> = {
    requested:
      "Recebemos sua solicitação de reembolso. Ela está em análise e você será avisado da decisão.",
    approved:
      "Seu reembolso foi aprovado. Os créditos restantes da compra foram removidos e o valor será devolvido pelo mesmo meio de pagamento.",
    rejected: "Sua solicitação de reembolso foi analisada e não pôde ser aprovada.",
  };
  const extra = status === "rejected" && reason ? `\nMotivo: ${reason}` : "";
  return `Karreify — ${refundCopy[status].h}

Olá ${userName},

${plain[status]}

Compra: ${packName}
Valor: ${reais}${extra}

Acesse: ${url}/compras${textFooter()}`;
}

// ── Security alerts ─────────────────────────────────────

function securityAlert(title: string, intro: string, when: string): string {
  return baseLayout(
    `
    ${heading(title)}
    ${paragraph(intro)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 22px;">
      <tr>
        <td style="background-color:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:14px 18px;">
          <span style="font-size:13px;color:#9a3412;font-weight:600;">${when}</span>
        </td>
      </tr>
    </table>
    ${smallText(
      "Se voc&ecirc; <strong style='color:#0f172a;'>n&atilde;o reconhece</strong> esta a&ccedil;&atilde;o, redefina sua senha imediatamente e entre em contato com o suporte."
    )}
  `,
    title
  );
}

export function passwordChangedEmail(): string {
  const when = new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  return securityAlert(
    "Senha atualizada",
    "A senha da sua conta Karreify foi atualizada com sucesso.",
    `Atualizada em ${when}`
  );
}

export function passwordChangedEmailText(): string {
  const when = new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  return `Karreify — Senha atualizada

A senha da sua conta foi atualizada com sucesso em ${when}.

Se você não reconhece esta ação, redefina sua senha imediatamente e entre em contato com o suporte.${textFooter()}`;
}

export function emailChangedEmail(oldEmail: string, newEmail: string): string {
  const when = new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  return securityAlert(
    "Email da conta atualizado",
    `O email da sua conta foi alterado de <strong style="color:#0f172a;">${oldEmail}</strong> para <strong style="color:#0f172a;">${newEmail}</strong>.`,
    `Atualizado em ${when}`
  );
}

export function emailChangedEmailText(oldEmail: string, newEmail: string): string {
  const when = new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  return `Karreify — Email da conta atualizado

O email da sua conta foi alterado de ${oldEmail} para ${newEmail} em ${when}.

Se você não reconhece esta ação, redefina sua senha imediatamente e entre em contato com o suporte.${textFooter()}`;
}

// ── Tickets ─────────────────────────────────────────────

export function ticketCreatedEmail(ticketId: string, title: string): string {
  const url = appUrl();
  return baseLayout(
    `
    ${heading("Chamado aberto com sucesso")}
    ${paragraph(
      "Recebemos seu chamado e nossa equipe j&aacute; foi notificada. Voc&ecirc; ser&aacute; avisado por email assim que houver uma resposta."
    )}
    ${ticketCard(ticketId, title)}
    ${ctaButton(`${url}/support/${ticketId}`, "Acompanhar chamado")}
    ${smallText("Voc&ecirc; pode acompanhar e responder ao chamado a qualquer momento pelo dashboard.")}
  `,
    `Chamado #${ticketId} aberto.`
  );
}

export function ticketCreatedEmailText(ticketId: string, title: string): string {
  const url = appUrl();
  return `Karreify — Chamado aberto

Recebemos seu chamado e a equipe foi notificada. Você receberá um email quando houver uma resposta.

Chamado #${ticketId}: ${title}

Acompanhe em: ${url}/support/${ticketId}${textFooter()}`;
}

export function ticketReplyEmail(
  ticketId: string,
  title: string,
  preview: string
): string {
  const url = appUrl();
  const sanitized = preview.replace(/[<>]/g, "");
  const safePreview = sanitized.length > 240 ? sanitized.slice(0, 240) + "…" : sanitized;
  const previewHtml = `<span style="color:#6b7280;">Pr&eacute;via:</span> &ldquo;${safePreview}&rdquo;`;
  return baseLayout(
    `
    ${heading("Nova resposta no seu chamado")}
    ${paragraph("Nossa equipe respondeu sua solicita&ccedil;&atilde;o. Confira abaixo:")}
    ${ticketCard(ticketId, title, previewHtml)}
    ${ctaButton(`${url}/support/${ticketId}`, "Abrir chamado")}
  `,
    `Resposta no chamado #${ticketId}.`
  );
}

export function ticketReplyEmailText(
  ticketId: string,
  title: string,
  preview: string
): string {
  const url = appUrl();
  const safePreview = preview.length > 240 ? preview.slice(0, 240) + "…" : preview;
  return `Karreify — Nova resposta no seu chamado

A equipe respondeu o chamado #${ticketId} (${title}).

Prévia da resposta:
"${safePreview}"

Acesse: ${url}/support/${ticketId}${textFooter()}`;
}

export function ticketClosedEmail(ticketId: string, title: string): string {
  const url = appUrl();
  return baseLayout(
    `
    ${heading("Chamado finalizado")}
    ${paragraph(
      "Seu chamado foi marcado como conclu&iacute;do pela equipe. Caso a quest&atilde;o n&atilde;o tenha sido resolvida, voc&ecirc; pode abrir um novo chamado a qualquer momento."
    )}
    ${ticketCard(ticketId, title)}
    ${ctaButton(`${url}/support/${ticketId}`, "Ver detalhes")}
  `,
    `Chamado #${ticketId} finalizado.`
  );
}

export function ticketClosedEmailText(ticketId: string, title: string): string {
  const url = appUrl();
  return `Karreify — Chamado finalizado

Seu chamado #${ticketId} (${title}) foi marcado como concluído pela equipe.

Caso a questão não tenha sido resolvida, abra um novo chamado a qualquer momento.

Acesse: ${url}/support/${ticketId}${textFooter()}`;
}

// ── Contact form ────────────────────────────────────────

type ContactTopic = "help" | "terms" | "privacy";

interface ContactCopy {
  subject: string;
  preview: string;
  heading: string;
  intro: (name: string) => string;
  team: string;
  sla: string;
}

const contactCopy: Record<ContactTopic, ContactCopy> = {
  help: {
    subject: "Recebemos seu contato — Karreify",
    preview: "Recebemos sua mensagem e respondemos em breve.",
    heading: "Recebemos seu contato",
    intro: (name) =>
      `Ol&aacute;, <strong style="color:#0f172a;">${name}</strong>. Recebemos sua mensagem e nosso time de suporte j&aacute; foi notificado. Em breve entramos em contato pelo seu e-mail.`,
    team: "Suporte Karreify",
    sla: "Respondemos em at&eacute; 24h em dias &uacute;teis.",
  },
  terms: {
    subject: "Recebemos sua mensagem — Karreify",
    preview: "Recebemos sua mensagem sobre os Termos de Uso.",
    heading: "Recebemos sua mensagem",
    intro: (name) =>
      `Ol&aacute;, <strong style="color:#0f172a;">${name}</strong>. Recebemos sua mensagem relacionada aos nossos Termos de Uso. Nosso time jur&iacute;dico j&aacute; foi notificado e em breve entramos em contato pelo seu e-mail.`,
    team: "Time jur&iacute;dico Karreify",
    sla: "Respondemos em breve por e-mail.",
  },
  privacy: {
    subject: "Solicitação LGPD recebida — Karreify",
    preview: "Sua solicitação de privacidade foi registrada.",
    heading: "Solicita&ccedil;&atilde;o registrada",
    intro: (name) =>
      `Ol&aacute;, <strong style="color:#0f172a;">${name}</strong>. Recebemos sua solicita&ccedil;&atilde;o relacionada &agrave; prote&ccedil;&atilde;o dos seus dados. Nosso Encarregado de Prote&ccedil;&atilde;o de Dados (DPO) j&aacute; foi notificado e em breve entramos em contato pelo seu e-mail.`,
    team: "DPO Karreify",
    sla: "Conforme a LGPD, respondemos em at&eacute; 15 dias.",
  },
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function contactReceivedEmail(
  name: string,
  topic: ContactTopic,
  messageSubject: string
): string {
  const copy = contactCopy[topic];
  const safeName = escapeHtml(name);
  const safeSubject = escapeHtml(messageSubject);
  return baseLayout(
    `
    ${heading(copy.heading)}
    ${paragraph(copy.intro(safeName))}
    ${infoCard([
      { label: "Assunto", value: safeSubject, accent: true },
      { label: "Respons&aacute;vel", value: copy.team },
    ])}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 22px;">
      <tr>
        <td style="background-color:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:14px 18px;">
          <span style="font-size:13px;color:#1e3a8a;font-weight:600;">${copy.sla}</span>
        </td>
      </tr>
    </table>
    ${smallText(
      "Voc&ecirc; n&atilde;o precisa fazer mais nada agora — basta aguardar nosso retorno por e-mail. Se precisar complementar sua mensagem, envie um novo contato pelo mesmo canal."
    )}
  `,
    copy.preview
  );
}

export function contactReceivedEmailText(
  name: string,
  topic: ContactTopic,
  messageSubject: string
): string {
  const titles: Record<ContactTopic, string> = {
    help: "Recebemos seu contato",
    terms: "Recebemos sua mensagem",
    privacy: "Solicitação registrada",
  };
  const intros: Record<ContactTopic, string> = {
    help: `Olá ${name},\n\nRecebemos sua mensagem e nosso time de suporte já foi notificado. Em breve entramos em contato pelo seu e-mail.`,
    terms: `Olá ${name},\n\nRecebemos sua mensagem relacionada aos nossos Termos de Uso. Nosso time jurídico já foi notificado e em breve entramos em contato pelo seu e-mail.`,
    privacy: `Olá ${name},\n\nRecebemos sua solicitação relacionada à proteção dos seus dados. Nosso Encarregado de Proteção de Dados (DPO) já foi notificado e em breve entramos em contato pelo seu e-mail.`,
  };
  const slas: Record<ContactTopic, string> = {
    help: "Respondemos em até 24h em dias úteis.",
    terms: "Respondemos em breve por e-mail.",
    privacy: "Conforme a LGPD, respondemos em até 15 dias.",
  };
  return `Karreify — ${titles[topic]}

${intros[topic]}

Assunto: ${messageSubject}

${slas[topic]}

Você não precisa fazer mais nada agora — basta aguardar nosso retorno por e-mail. Se precisar complementar sua mensagem, envie um novo contato pelo mesmo canal.${textFooter()}`;
}

// ── Feedback ────────────────────────────────────────────

export function feedbackThanksEmail(userName: string, rating: number): string {
  // Visual rating using filled/empty stars — character-based, no emoji.
  const filled = "★".repeat(rating);
  const empty = "☆".repeat(5 - rating);
  return baseLayout(
    `
    ${heading("Obrigado pela sua avalia&ccedil;&atilde;o")}
    ${paragraph(
      `Ol&aacute;, <strong style="color:#0f172a;">${userName}</strong>. Sua opini&atilde;o nos ajuda diretamente a priorizar melhorias e evoluir o Karreify.`
    )}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 22px;">
      <tr>
        <td align="center" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px;">
          <span style="font-size:11px;color:#6b7280;letter-spacing:0.1em;text-transform:uppercase;font-weight:600;display:block;margin-bottom:8px;">Sua avalia&ccedil;&atilde;o</span>
          <span style="font-size:28px;letter-spacing:6px;color:#f59e0b;">${filled}<span style="color:#e5e7eb;">${empty}</span></span>
        </td>
      </tr>
    </table>
    ${smallText("Continuaremos lendo cada coment&aacute;rio com aten&ccedil;&atilde;o.")}
  `,
    "Obrigado pelo seu feedback."
  );
}

export function feedbackThanksEmailText(userName: string, rating: number): string {
  return `Karreify — Obrigado pela sua avaliação

Olá ${userName},

Sua avaliação de ${rating}/5 foi registrada. Sua opinião nos ajuda diretamente a priorizar melhorias e evoluir o Karreify.

Continuaremos lendo cada comentário com atenção.${textFooter()}`;
}
