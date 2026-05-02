import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  Wand2,
  FileUp,
  Loader2,
  Sparkles,
  Download,
  AlertCircle,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { extractPdf } from "@/lib/pdf-extract";
import { completeDocument, type DocCompletion } from "@/utils/complete.functions";

export const Route = createFileRoute("/complete")({
  component: CompletePage,
  head: () => ({
    meta: [
      { title: "Complete My Document — DocIntel" },
      {
        name: "description",
        content:
          "Upload or paste an incomplete document, tell DocIntel what kind of document it is, and AI will fill in the missing sections.",
      },
      { property: "og:title", content: "Complete My Document — DocIntel" },
      {
        property: "og:description",
        content: "AI completes your half-written drafts in seconds.",
      },
    ],
  }),
});

const presetTypes = [
  "Non-Disclosure Agreement (NDA)",
  "Service Agreement",
  "Invoice",
  "Resume / CV",
  "Cover Letter",
  "Residential Lease",
  "Project Proposal",
  "Meeting Minutes",
  "Privacy Policy",
];

function downloadText(filename: string, text: string, mime = "text/markdown") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function downloadPdf(filename: string, text: string) {
  // Lightweight printable HTML → user prints to PDF. Avoids extra deps.
  const win = window.open("", "_blank");
  if (!win) return;
  const html = `<!doctype html><html><head><meta charset="utf-8"/><title>${filename}</title>
  <style>
    body { font-family: ui-sans-serif, system-ui, sans-serif; max-width: 780px; margin: 40px auto; padding: 0 24px; color: #111; line-height: 1.55; }
    h1, h2, h3 { color: #1f2937; margin-top: 1.6em; }
    pre { white-space: pre-wrap; word-wrap: break-word; font-family: inherit; font-size: 14px; }
    @media print { body { margin: 0; } }
  </style></head><body><pre>${text.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]!)}</pre>
  <script>window.onload = () => window.print();</script>
  </body></html>`;
  win.document.write(html);
  win.document.close();
}

function CompletePage() {
  const [text, setText] = useState("");
  const [docType, setDocType] = useState("");
  const [filename, setFilename] = useState("");
  const [status, setStatus] = useState<"idle" | "extracting" | "completing" | "ready" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DocCompletion | null>(null);
  const [editable, setEditable] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setStatus("extracting");
    setFilename(file.name);
    try {
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        const { text: extracted } = await extractPdf(file);
        setText(extracted);
      } else {
        const t = await file.text();
        setText(t);
      }
      setStatus("idle");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to read file.");
      setStatus("error");
    }
  };

  const onComplete = async () => {
    if (!text.trim() || !docType.trim()) {
      setError("Please paste/upload a draft and specify the document type.");
      setStatus("error");
      return;
    }
    setError(null);
    setStatus("completing");
    setResult(null);
    try {
      const res = await completeDocument({ data: { partialText: text, docType, filename } });
      setResult(res);
      setEditable(res.completedDocument);
      setStatus("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to complete document.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-gradient-subtle border-b">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 md:py-16 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary mb-4">
              <Wand2 className="h-3.5 w-3.5" /> Complete Doc
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight max-w-3xl mx-auto">
              Finish your half-written documents with AI
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Paste or upload your incomplete draft, tell us what kind of document it is, and DocIntel
              fills in the missing sections in the same style.
            </p>
          </div>
        </section>

        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="rounded-xl border bg-card shadow-card p-5 flex flex-col gap-4">
            <div>
              <Label className="text-sm font-semibold">1. What type of document is this?</Label>
              <Input
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                placeholder="e.g. Non-Disclosure Agreement"
                className="mt-2"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {presetTypes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setDocType(t)}
                    className={`text-[11px] px-2 py-1 rounded-md border transition-colors ${
                      docType === t ? "bg-primary text-primary-foreground border-primary" : "bg-secondary hover:bg-accent"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <Label className="text-sm font-semibold">2. Paste your incomplete draft</Label>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your partial document here, or upload a PDF / .txt file below…"
                className="mt-2 flex-1 min-h-[260px] font-mono text-xs"
              />
              <div className="mt-3 flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.txt,.md,application/pdf,text/plain"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleFile(f);
                    e.target.value = "";
                  }}
                />
                <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={status === "extracting"}>
                  {status === "extracting" ? (
                    <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> Reading…</>
                  ) : (
                    <><FileUp className="h-3.5 w-3.5 mr-1.5" /> Upload PDF / TXT</>
                  )}
                </Button>
                {filename && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <FileText className="h-3 w-3" /> {filename}
                  </span>
                )}
              </div>
            </div>

            <Button onClick={onComplete} disabled={status === "completing" || status === "extracting"} size="lg" className="shadow-glow">
              {status === "completing" ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> AI is completing your document…</>
              ) : (
                <><Sparkles className="h-4 w-4 mr-2" /> Complete document</>
              )}
            </Button>

            {status === "error" && error && (
              <div className="flex items-start gap-2 text-xs text-destructive bg-destructive/5 border border-destructive/20 rounded-md p-3">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" /> {error}
              </div>
            )}
          </div>

          {/* Output */}
          <div className="rounded-xl border bg-card shadow-card p-5 flex flex-col">
            {!result && status !== "completing" && (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground py-16">
                <Wand2 className="h-10 w-10 text-primary/40 mb-3" />
                <p className="text-sm font-medium text-foreground">Your completed draft will appear here</p>
                <p className="text-xs mt-1 max-w-xs">Provide the doc type and the partial text, then click Complete document.</p>
              </div>
            )}

            {status === "completing" && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-3" />
                <p className="text-sm font-medium">Drafting the missing sections…</p>
                <p className="text-xs text-muted-foreground mt-1">Usually takes a few seconds.</p>
              </div>
            )}

            {result && (
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-success">
                      <CheckCircle2 className="h-4 w-4" /> Completed as {result.detectedType}
                    </div>
                    {result.missingSections.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Filled in: {result.missingSections.join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => downloadText((filename || "completed").replace(/\.[^.]+$/, "") + ".md", editable)}>
                      <Download className="h-3.5 w-3.5 mr-1.5" /> .md
                    </Button>
                    <Button size="sm" onClick={() => downloadPdf((filename || "completed") + ".pdf", editable)}>
                      <Download className="h-3.5 w-3.5 mr-1.5" /> PDF
                    </Button>
                  </div>
                </div>

                <Textarea
                  value={editable}
                  onChange={(e) => setEditable(e.target.value)}
                  className="flex-1 min-h-[420px] font-mono text-xs leading-relaxed"
                />

                {result.notes.length > 0 && (
                  <div className="rounded-lg bg-secondary/50 border p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">AI notes</p>
                    <ul className="text-xs space-y-1 text-muted-foreground list-disc pl-4">
                      {result.notes.map((n, i) => <li key={i}>{n}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
