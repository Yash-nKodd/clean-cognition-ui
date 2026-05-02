import { createFileRoute, Link } from "@tanstack/react-router";
import { Database, Lightbulb, ShieldAlert, Gavel, MessageSquare, Wand2, FileSearch, Sparkles, ArrowRight } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/features")({
  component: FeaturesPage,
  head: () => ({
    meta: [
      { title: "Features — DocIntel" },
      { name: "description", content: "Every capability DocIntel offers: structured extraction, insights, risk analysis, AI decisions, document chat, and document completion." },
      { property: "og:title", content: "Features — DocIntel" },
      { property: "og:description", content: "Structured data, insights, risk analysis, decisions, chat, and AI doc completion." },
    ],
  }),
});

const features = [
  {
    icon: Database,
    title: "Structured Data Extraction",
    body: "DocIntel reads any PDF and returns the key fields as labelled values — names, dates, monetary amounts, IDs, jurisdictions, signatories — without templates or training. Important entities are highlighted automatically.",
    bullets: ["No template setup", "Auto-highlights important fields", "Works on contracts, invoices, reports, resumes"],
  },
  {
    icon: Lightbulb,
    title: "AI Insights",
    body: "Surface what matters. The AI flags auto-renewal clauses, unusual values, comparisons against typical documents, and other context you'd otherwise miss on a quick read.",
    bullets: ["3–6 insights per document", "Tagged warning / info / success", "Plain-English explanations"],
  },
  {
    icon: ShieldAlert,
    title: "Risk Analysis",
    body: "Every document gets a structured risk report. Each risk includes a severity level (high / medium / low) and a one-paragraph explanation so you know exactly what to push back on.",
    bullets: ["High / medium / low severity", "Cites specific clauses where possible", "Designed for legal & ops review"],
  },
  {
    icon: Gavel,
    title: "AI Decisions",
    body: "Stop second-guessing. DocIntel produces a clear recommendation (e.g. \"Negotiate before signing\"), a confidence score, a summary of why, and a numbered list of recommended next actions.",
    bullets: ["Confidence score 0–100", "Plain summary of reasoning", "Concrete action items"],
  },
  {
    icon: MessageSquare,
    title: "Chat with Your Document",
    body: "Ask anything in natural language. The assistant answers strictly from the document, citing specific values, clauses, and dates. Perfect for spot-checks and stakeholder Q&A.",
    bullets: ["Grounded in your document only", "Cites specific values & clauses", "Multi-turn conversation memory"],
  },
  {
    icon: Wand2,
    title: "Complete Partial Documents",
    body: "Upload or paste a half-finished draft, tell DocIntel what kind of document it is (NDA, invoice, resume, lease, proposal…) and the AI infers the standard structure and fills in the missing sections — preserving everything you've already written.",
    bullets: ["Keeps your original wording intact", "Adds missing sections in your style", "Edit inline and download as PDF or Markdown"],
    href: "/complete" as const,
  },
];

function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-gradient-subtle border-b">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground shadow-soft mb-5">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Features
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Everything DocIntel can do</h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              A single workspace that reads, analyzes, answers questions about, and even completes your documents.
            </p>
          </div>
        </section>

        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 space-y-10">
          {features.map((f, i) => (
            <div key={f.title} className={`grid md:grid-cols-12 gap-8 items-center ${i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""}`}>
              <div className="md:col-span-7">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                  <f.icon className="h-4 w-4" /> Feature {String(i + 1).padStart(2, "0")}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{f.title}</h2>
                <p className="mt-3 text-muted-foreground">{f.body}</p>
                <ul className="mt-4 space-y-1.5 text-sm">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
                {f.href && (
                  <Button asChild variant="outline" className="mt-5">
                    <Link to={f.href}>Open this feature <ArrowRight className="ml-1 h-4 w-4" /></Link>
                  </Button>
                )}
              </div>
              <div className="md:col-span-5">
                <div className="rounded-2xl border bg-gradient-subtle p-8 shadow-card aspect-square flex items-center justify-center">
                  <div className="h-24 w-24 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
                    <f.icon className="h-12 w-12 text-primary-foreground" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pb-20 text-center">
          <div className="rounded-2xl border bg-card shadow-card p-10">
            <FileSearch className="h-10 w-10 text-primary mx-auto mb-3" />
            <h2 className="text-2xl font-bold">See it on your own document</h2>
            <p className="mt-2 text-muted-foreground">It takes a few seconds and there's no signup.</p>
            <Button asChild size="lg" className="mt-6 shadow-glow">
              <Link to="/app">Open the app</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
