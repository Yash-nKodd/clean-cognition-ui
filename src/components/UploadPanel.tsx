import { useRef, useState, type DragEvent } from "react";
import { FileUp, FileText, X, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { extractPdf } from "@/lib/pdf-extract";
import { useDoc } from "@/lib/doc-context";
import { analyzeDocument } from "@/utils/doc.functions";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function UploadPanel() {
  const doc = useDoc();
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      doc.setDoc({ status: "error", error: "Please upload a PDF file." });
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      doc.setDoc({ status: "error", error: "File exceeds 20 MB limit." });
      return;
    }
    doc.reset();
    doc.setDoc({
      filename: file.name,
      sizeLabel: formatSize(file.size),
      status: "extracting",
      error: null,
    });
    try {
      const { text, numPages, previewDataUrl } = await extractPdf(file);
      if (!text || text.length < 20) {
        doc.setDoc({
          status: "error",
          error: "Could not read text from this PDF (it may be a scanned image).",
          numPages,
          previewDataUrl,
        });
        return;
      }
      doc.setDoc({ text, numPages, previewDataUrl, status: "analyzing" });
      const analysis = await analyzeDocument({ data: { text, filename: file.name } });
      doc.setDoc({ analysis, status: "ready" });
    } catch (e) {
      doc.setDoc({
        status: "error",
        error: e instanceof Error ? e.message : "Failed to process document.",
      });
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  const hasDoc = doc.filename !== null;

  return (
    <div className="flex flex-col gap-4 h-full">
      {!hasDoc && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`rounded-xl border-2 border-dashed transition-all p-8 text-center bg-card ${
            dragOver ? "border-primary bg-primary-soft" : "border-border"
          }`}
        >
          <div className="mx-auto w-12 h-12 rounded-full bg-primary-soft flex items-center justify-center mb-3">
            <FileUp className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground">Drop your PDF here</p>
          <p className="text-xs text-muted-foreground mt-1">or click to browse files</p>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
              e.target.value = "";
            }}
          />
          <Button size="sm" className="mt-4" onClick={() => inputRef.current?.click()}>
            Choose file
          </Button>
          <p className="text-[10px] text-muted-foreground mt-3">PDF up to 20 MB</p>
        </div>
      )}

      {hasDoc && (
        <div className="rounded-xl border bg-card shadow-soft overflow-hidden flex-1 flex flex-col">
          <div className="flex items-center justify-between p-3 border-b bg-secondary/40">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate">{doc.filename}</p>
                <p className="text-[10px] text-muted-foreground">
                  {doc.numPages > 0 ? `${doc.numPages} pages · ` : ""}
                  {doc.sizeLabel}
                </p>
              </div>
            </div>
            <button
              onClick={() => doc.reset()}
              className="text-muted-foreground hover:text-foreground p-1"
              aria-label="Remove document"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4 flex-1 overflow-auto bg-gradient-subtle flex items-start justify-center">
            {doc.previewDataUrl ? (
              <img
                src={doc.previewDataUrl}
                alt="First page preview"
                className="max-w-full rounded-md shadow-card border bg-card"
              />
            ) : (
              <div className="text-xs text-muted-foreground py-12">
                {doc.status === "extracting" ? "Rendering preview…" : "No preview available"}
              </div>
            )}
          </div>

          <div className="px-3 py-2 border-t bg-card flex items-center gap-2 text-xs">
            {doc.status === "extracting" && (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                <span className="text-muted-foreground">Extracting text from PDF…</span>
              </>
            )}
            {doc.status === "analyzing" && (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                <span className="text-muted-foreground">Analyzing with AI…</span>
              </>
            )}
            {doc.status === "ready" && doc.analysis && (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                <span className="text-success">
                  Analyzed · {doc.analysis.structuredFields.length} fields extracted
                </span>
              </>
            )}
            {doc.status === "error" && (
              <>
                <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                <span className="text-destructive">{doc.error}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
