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
