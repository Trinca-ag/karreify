/**
 * Injeta um bloco JSON-LD (dados estruturados) com a mitigação de XSS oficial
 * do Next.js (`.replace(/</g, "\\u003c")`). Use <script>, nunca next/script.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
