import { createFileRoute } from "@tanstack/react-router";
import { FileSearch, Sparkles } from "lucide-react";
import { UploadPanel } from "@/components/UploadPanel";
import { OutputTabs } from "@/components/OutputTabs";
import { ChatAssistant } from "@/components/ChatAssistant";
import { DocProvider } from "@/lib/doc-context";
import { SiteHeader } from "@/components/SiteChrome";

export const Route = createFileRoute("/app")({
  component: AppPage,
  head: () => ({
    meta: [
      { title: "DocIntel App — Analyze your PDF" },
      {
        name: "description",
        content:
          "Upload PDFs and instantly extract structured data, insights, risks, and AI-powered decisions. Chat with your documents.",
      },
    ],
  }),
});

function AppPage() {
  return (
    <DocProvider>
      <div className="min-h-screen bg-gradient-subtle flex flex-col">
        <SiteHeader />
        <header className="border-b bg-card/60">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <FileSearch className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Analyze a Document</h1>
              <p className="text-xs text-muted-foreground -mt-0.5 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" /> Drop a PDF to extract data, insights and risks
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
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
        </main>
      </div>
    </DocProvider>
  );
}
