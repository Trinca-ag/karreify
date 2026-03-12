function baseLayout(content: string): string {
  const year = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NextCV</title>
</head>
<body style="margin: 0; padding: 0; background-color: #030712; font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <!-- Outer wrapper with dark space background -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #030712;">
    <tr>
      <td align="center" style="padding: 40px 16px;">

        <!-- Main card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px;">

          <!-- Glow border wrapper -->
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4); border-radius: 24px; padding: 1px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a1a; border-radius: 24px;">

                <!-- Top gradient accent bar -->
                <tr>
                  <td style="height: 4px; background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4, #8b5cf6, #3b82f6); border-radius: 24px 24px 0 0;"></td>
                </tr>

                <!-- Logo section -->
                <tr>
                  <td align="center" style="padding: 36px 40px 8px;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background: linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.08)); border: 1px solid rgba(59,130,246,0.2); border-radius: 16px; padding: 12px 20px;">
                          <table role="presentation" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width: 32px; height: 32px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 10px; text-align: center; vertical-align: middle;">
                                <span style="color: #ffffff; font-size: 16px; line-height: 32px;">&#9998;</span>
                              </td>
                              <td style="padding-left: 10px;">
                                <span style="font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Next</span><span style="font-size: 22px; font-weight: 800; color: #3b82f6; letter-spacing: -0.5px;">CV</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Content area -->
                <tr>
                  <td style="padding: 16px 40px 36px;">
                    ${content}
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding: 0 40px;">
                    <div style="height: 1px; background: linear-gradient(90deg, transparent, rgba(59,130,246,0.15), rgba(139,92,246,0.15), transparent);"></div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td align="center" style="padding: 24px 40px 28px;">
                    <p style="margin: 0 0 6px; font-size: 12px; color: #4b5563; line-height: 1.5;">
                      &copy; ${year} NextCV &middot; Impulsione sua carreira com IA
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #374151;">
                      Este email foi enviado automaticamente. N&atilde;o responda.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── Shared helpers ──────────────────────────────────────

function codeBlock(code: string, accentColor: string, bgFrom: string, bgTo: string, borderColor: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 24px;">
      <tr>
        <td style="background: linear-gradient(135deg, ${bgFrom}, ${bgTo}); border: 1px solid ${borderColor}; border-radius: 16px; padding: 28px 20px; text-align: center;">
          <!-- Individual digit boxes -->
          <table role="presentation" cellpadding="0" cellspacing="0" align="center">
            <tr>
              ${code.split("").map(d => `
                <td style="padding: 0 4px;">
                  <div style="width: 44px; height: 56px; background: rgba(0,0,0,0.3); border: 1px solid ${borderColor}; border-radius: 12px; text-align: center; line-height: 56px;">
                    <span style="font-size: 28px; font-weight: 800; color: ${accentColor}; font-family: 'Courier New', 'Lucida Console', monospace;">${d}</span>
                  </div>
                </td>
              `).join("")}
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
}

function infoPill(icon: string, text: string, highlight: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin: 0 0 8px;">
      <tr>
        <td style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 10px 20px;">
          <span style="font-size: 13px; color: #6b7280;">${icon} ${text} <span style="color: #d1d5db; font-weight: 600;">${highlight}</span></span>
        </td>
      </tr>
    </table>`;
}

function iconCircle(emoji: string, bgFrom: string, bgTo: string, borderColor: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin: 0 0 24px;">
      <tr>
        <td style="width: 64px; height: 64px; background: linear-gradient(135deg, ${bgFrom}, ${bgTo}); border: 1px solid ${borderColor}; border-radius: 20px; text-align: center; vertical-align: middle;">
          <span style="font-size: 28px; line-height: 64px;">${emoji}</span>
        </td>
      </tr>
    </table>`;
}

function heading(title: string): string {
  return `<h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0 0 8px; letter-spacing: -0.5px; text-align: center;">${title}</h1>`;
}

function subtext(text: string): string {
  return `<p style="color: #9ca3af; font-size: 14px; margin: 0 0 28px; line-height: 1.6; text-align: center;">${text}</p>`;
}

function footnote(text: string): string {
  return `<p style="color: #4b5563; font-size: 12px; margin: 16px 0 0; line-height: 1.5; text-align: center;">${text}</p>`;
}

// ── Email Templates ─────────────────────────────────────

export function verificationEmail(code: string): string {
  return baseLayout(`
    <div style="text-align: center;">
      ${iconCircle("&#128737;", "rgba(59,130,246,0.15)", "rgba(139,92,246,0.1)", "rgba(59,130,246,0.25)")}

      ${heading("Verifica&ccedil;&atilde;o de seguran&ccedil;a")}
      ${subtext("Use o c&oacute;digo abaixo para verificar seu dispositivo")}

      ${codeBlock(code, "#60a5fa", "rgba(59,130,246,0.08)", "rgba(139,92,246,0.05)", "rgba(59,130,246,0.15)")}

      ${infoPill("&#9200;", "Expira em", "10 minutos")}

      ${footnote("Se voc&ecirc; n&atilde;o solicitou este c&oacute;digo, ignore este email.")}
    </div>
  `);
}

export function passwordResetEmail(code: string): string {
  return baseLayout(`
    <div style="text-align: center;">
      ${iconCircle("&#128273;", "rgba(251,146,60,0.15)", "rgba(245,158,11,0.1)", "rgba(251,146,60,0.25)")}

      ${heading("Recupera&ccedil;&atilde;o de senha")}
      ${subtext("Use o c&oacute;digo abaixo para redefinir sua senha")}

      ${codeBlock(code, "#fb923c", "rgba(251,146,60,0.08)", "rgba(245,158,11,0.05)", "rgba(251,146,60,0.15)")}

      ${infoPill("&#9200;", "Expira em", "10 minutos")}

      ${footnote("Se voc&ecirc; n&atilde;o solicitou a recupera&ccedil;&atilde;o de senha, ignore este email.")}
    </div>
  `);
}

export function planUpgradeEmail(
  userName: string,
  planName: string,
  credits: number,
  price: number
): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return baseLayout(`
    <div style="text-align: center;">
      ${iconCircle("&#127881;", "rgba(34,197,94,0.15)", "rgba(16,185,129,0.1)", "rgba(34,197,94,0.25)")}

      ${heading("Upgrade realizado!")}
      ${subtext(`Ol&aacute; <span style="color: #e5e7eb; font-weight: 700;">${userName}</span>, seu plano foi atualizado com sucesso.`)}

      <!-- Plan details card -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 28px;">
        <tr>
          <td style="background: linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.05)); border: 1px solid rgba(59,130,246,0.15); border-radius: 16px; padding: 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <!-- Plan name -->
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04);">
                  <span style="font-size: 13px; color: #6b7280;">Plano</span>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04); text-align: right;">
                  <span style="font-size: 14px; color: #ffffff; font-weight: 700; background: linear-gradient(135deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${planName}</span>
                </td>
              </tr>
              <!-- Price -->
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04);">
                  <span style="font-size: 13px; color: #6b7280;">Valor</span>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04); text-align: right;">
                  <span style="font-size: 14px; color: #e5e7eb; font-weight: 600;">R$${price}<span style="font-size: 12px; color: #6b7280; font-weight: 400;">/m&ecirc;s</span></span>
                </td>
              </tr>
              <!-- Credits -->
              <tr>
                <td style="padding: 10px 0;">
                  <span style="font-size: 13px; color: #6b7280;">Cr&eacute;ditos</span>
                </td>
                <td style="padding: 10px 0; text-align: right;">
                  <span style="display: inline-block; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); border-radius: 8px; padding: 4px 12px; font-size: 14px; color: #4ade80; font-weight: 700;">+${credits}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- CTA Button -->
      <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin: 0 0 8px;">
        <tr>
          <td style="border-radius: 14px; background: linear-gradient(135deg, #3b82f6, #8b5cf6);">
            <a href="${appUrl}/dashboard" target="_blank" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; letter-spacing: 0.3px;">
              Ir para o Dashboard &#8594;
            </a>
          </td>
        </tr>
      </table>

      ${footnote("Seus cr&eacute;ditos j&aacute; est&atilde;o dispon&iacute;veis. Aproveite todos os recursos!")}
    </div>
  `);
}
