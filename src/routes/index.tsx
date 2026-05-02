import { createFileRoute } from "@tanstack/react-router";
import { FileSearch, Sparkles } from "lucide-react";
import { UploadPanel } from "@/components/UploadPanel";
import { OutputTabs } from "@/components/OutputTabs";
import { ChatAssistant } from "@/components/ChatAssistant";
import { DocProvider } from "@/lib/doc-context";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "DocIntel — AI Document Intelligence" },
      {
        name: "description",
        content:
          "Upload PDFs and instantly extract structured data, insights, risks, and AI-powered decisions. Chat with your documents.",
      },
      { property: "og:title", content: "DocIntel — AI Document Intelligence" },
      {
        property: "og:description",
        content: "Turn any PDF into structured data, insights, and decisions in seconds.",
      },
    ],
  }),
});

function Index() {
  return (
    <DocProvider>
      <div className="min-h-screen bg-gradient-subtle">
        <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <FileSearch className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight">DocIntel</h1>
                <p className="text-[11px] text-muted-foreground -mt-0.5">AI Document Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="hidden sm:inline">Powered by AI</span>
            </div>
          </div>
        </header>

        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-5 xl:col-span-4 flex flex-col min-h-[600px]">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Document
              </h2>
              <div className="flex-1">
                <UploadPanel />
              </div>
            </section>

            <section className="lg:col-span-7 xl:col-span-8 flex flex-col min-h-[600px]">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Analysis
              </h2>
              <div className="flex-1 rounded-xl border bg-card shadow-card p-4 sm:p-5">
                <OutputTabs />
              </div>
            </section>
          </div>

          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Chat with Document
            </h2>
            <ChatAssistant />
          </section>

          <footer className="text-center text-xs text-muted-foreground pt-4 pb-2">
            DocIntel · Built for fast, confident document review
          </footer>
        </main>
      </div>
    </DocProvider>
  );
}
