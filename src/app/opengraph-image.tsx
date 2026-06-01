import { ImageResponse } from "next/og";

// Runtime edge: usa o build edge do @vercel/og (sem o bug de fileURLToPath do
// build node, que quebra a geração da imagem — notadamente no Windows).
export const runtime = "edge";

export const alt = "Karreify — Crie seu currículo com Inteligência Artificial";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagem de preview (Open Graph / Twitter) gerada no build. Aparece ao
// compartilhar o link no WhatsApp, LinkedIn, etc.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0a0a14 0%, #131a2e 55%, #1a1340 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 110, fontWeight: 800, letterSpacing: "-3px" }}>
          Karreify
        </div>
        <div
          style={{
            fontSize: 42,
            color: "#93c5fd",
            marginTop: 28,
            maxWidth: 920,
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          Crie seu currículo com Inteligência Artificial
        </div>
      </div>
    ),
    { ...size }
  );
}
