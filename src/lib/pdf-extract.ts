// Client-side PDF text extraction + first-page preview render using pdfjs-dist.
import * as pdfjsLib from "pdfjs-dist";
// Vite-friendly worker import
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export type ExtractedPdf = {
  text: string;
  numPages: number;
  previewDataUrl: string | null;
};

export async function extractPdf(file: File): Promise<ExtractedPdf> {
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  let text = "";
  const maxPages = Math.min(pdf.numPages, 20);
  for (let i = 1; i <= maxPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((it) => ("str" in it ? (it as { str: string }).str : ""))
      .join(" ");
    text += `\n\n--- Page ${i} ---\n${pageText}`;
  }

  // Render first page to canvas for preview
  let previewDataUrl: string | null = null;
  try {
    const firstPage = await pdf.getPage(1);
    const viewport = firstPage.getViewport({ scale: 1.2 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      await firstPage.render({ canvas, canvasContext: ctx, viewport }).promise;
      previewDataUrl = canvas.toDataURL("image/png");
    }
  } catch {
    /* preview optional */
  }

  return { text: text.trim(), numPages: pdf.numPages, previewDataUrl };
}
