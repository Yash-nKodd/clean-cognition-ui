import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  FileSearch,
  Database,
  Lightbulb,
  ShieldAlert,
  Gavel,
  MessageSquare,
  Wand2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "DocIntel — AI Document Intelligence for PDFs" },
      {
        name: "description",
        content:
          "Upload any PDF and instantly get structured data, insights, risk analysis, AI decisions, and a chat assistant. Auto-complete partial documents in seconds.",
      },
      { property: "og:title", content: "DocIntel — AI Document Intelligence" },
      {
        property: "og:description",
        content: "Turn any PDF into structured data, insights, and decisions in seconds.",
      },
    ],
  }),
});

const featureCards = [
  { icon: Database, title: "Structured Data Extraction", desc: "Pulls names, dates, amounts, and key fields from any PDF — no templates required." },
  { icon: Lightbulb, title: "AI Insights", desc: "Surfaces auto-renewal clauses, anomalies, and patterns hidden in dense documents." },
  { icon: ShieldAlert, title: "Risk Analysis", desc: "Flags high, medium, and low severity risks with explanations you can act on." },
  { icon: Gavel, title: "AI Decisions", desc: "Get a clear recommendation with a confidence score and next-step actions." },
  { icon: MessageSquare, title: "Chat with Your Doc", desc: "Ask questions in plain English. Answers cite specific clauses, dates, and values." },
  { icon: Wand2, title: "Complete Partial Docs", desc: "Upload an incomplete draft, tell us what kind of doc it is, and AI fills the gaps." },
];

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-subtle">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-20 md:py-28 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground shadow-soft mb-6">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Powered by Lovable AI · No setup required
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.1]">
              Read, analyze, and complete any PDF in seconds
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              DocIntel turns dense PDFs into structured data, insights, risk reports,
              and confident decisions — and can even finish your half-written documents.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="shadow-glow">
                <Link to="/app">
                  Try it free <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/how-it-works">See how it works</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs font-bold text-foreground">
              No signup needed · PDFs up to 20 MB
            </p>
          </div>
        </section>

        {/* Features grid */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything you need to work with documents</h2>
            <p className="mt-4 text-muted-foreground">Six AI-powered capabilities, one elegant workspace.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featureCards.map((f) => (
              <div key={f.title} className="rounded-xl border bg-card p-6 shadow-soft hover:shadow-card transition-shadow">
                <div className="h-10 w-10 rounded-lg bg-primary-soft flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline">
              <Link to="/features">Explore all features <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </section>

        {/* Complete Doc CTA */}
        <section className="bg-gradient-subtle border-y">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary mb-4">
                <Wand2 className="h-3.5 w-3.5" /> NEW
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Half a document? AI finishes it for you.</h2>
              <p className="mt-4 text-muted-foreground">
                Paste or upload an incomplete draft, tell DocIntel what kind of document it is —
                NDA, invoice, resume, lease, proposal — and the AI infers the standard structure
                and fills in the missing sections so you can edit and download a finished draft.
              </p>
              <ul className="mt-5 space-y-2 text-sm">
                {["Detects what's missing vs what's present", "Preserves your original wording", "Edit inline and download as PDF or Markdown"].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-6">
                <Link to="/complete">Try Complete Doc <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="rounded-xl border bg-card shadow-card p-6">
              <div className="text-xs font-mono text-muted-foreground mb-3">draft_nda.txt — 38% complete</div>
              <pre className="text-xs whitespace-pre-wrap leading-relaxed">
{`Mutual Non-Disclosure Agreement

This Agreement is entered into by Acme Inc. and ____________
on April 12, 2026.

1. Confidential Information
"Confidential Information" means any non-public...

2. Obligations
[MISSING]

3. Term
[MISSING]

4. Governing Law
[MISSING]`}
              </pre>
              <div className="mt-4 flex items-center gap-2 text-xs text-primary">
                <Sparkles className="h-3.5 w-3.5" /> AI fills sections 2, 3 and 4 with standard NDA language
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to read smarter?</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Open the app and drop in your first PDF — analysis takes a few seconds.
          </p>
          <Button asChild size="lg" className="mt-8 shadow-glow">
            <Link to="/app">Launch DocIntel <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
