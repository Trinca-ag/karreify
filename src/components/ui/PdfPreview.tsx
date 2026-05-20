"use client";

import { useEffect, useState } from "react";

interface PdfPreviewProps {
  pdfUrl: string;
  className?: string;
  title?: string;
}

// Renders a PDF preview. On desktop (lg+) uses an <iframe> so users get the
// browser's native PDF UI (zoom, search, print). On mobile/tablet, Chrome on
// Android refuses to render PDF blobs in iframes — it shows a generic "Abrir"
// fallback — so we rasterize each page with pdfjs and display them as images.
export default function PdfPreview({
  pdfUrl,
  className = "",
  title = "Preview do PDF",
}: PdfPreviewProps) {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [rendering, setRendering] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (isDesktop !== false || !pdfUrl) return;
    let cancelled = false;
    setRendering(true);
    setError(false);
    setPages([]);

    (async () => {
      try {
        const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const rendered: string[] = [];
        const dpr = Math.min(2, window.devicePixelRatio || 1);

        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) return;
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: dpr * 1.5 });
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: ctx, viewport }).promise;
          rendered.push(canvas.toDataURL("image/png"));
        }

        if (!cancelled) setPages(rendered);
      } catch (err) {
        console.error("PdfPreview render error:", err);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setRendering(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isDesktop, pdfUrl]);

  if (isDesktop === null) {
    return (
      <div
        className={`${className} flex items-center justify-center`}
        style={{ minHeight: "300px" }}
      >
        <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isDesktop) {
    return (
      <iframe
        src={`${pdfUrl}#pagemode=none&navpanes=0&toolbar=1`}
        className={className}
        style={{ minHeight: "500px" }}
        title={title}
      />
    );
  }

  // Mobile / tablet: size to content. The parent card has no fixed height
  // below lg, so the wrapper shrinks around the rasterized pages instead of
  // leaving a black void below them. We intentionally drop height utilities
  // (e.g. `h-[75vh]`) from `className` — they'd reintroduce the gap.
  return (
    <div className="w-full rounded-xl bg-white/[0.02]">
      {rendering && pages.length === 0 && (
        <div className="flex items-center justify-center w-full min-h-[300px]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-400 mt-3">Carregando preview...</p>
          </div>
        </div>
      )}
      {error && !rendering && (
        <div className="flex items-center justify-center w-full min-h-[300px]">
          <p className="text-sm text-gray-500">
            Não foi possível exibir o preview.
          </p>
        </div>
      )}
      {!rendering && pages.length > 0 && (
        <div className="space-y-3 p-3">
          {pages.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt={`Página ${i + 1}`}
              className="w-full rounded-lg shadow-md bg-white"
              loading="lazy"
            />
          ))}
        </div>
      )}
    </div>
  );
}
