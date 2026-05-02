import { createFileRoute, Link } from "@tanstack/react-router";
import { Upload, Brain, Eye, MessageSquare, ArrowRight } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/how-it-works")({
  component: HowPage,
  head: () => ({
    meta: [
      { title: "How DocIntel Works" },
      { name: "description", content: "Four steps from PDF to insights: upload, AI analysis, review structured results, and chat with your document." },
      { property: "og:title", content: "How DocIntel Works" },
      { property: "og:description", content: "Upload, analyze, review, and chat — in seconds." },
    ],
  }),
});

const steps = [
  { icon: Upload, title: "1. Upload your PDF", body: "Drop a PDF (up to 20 MB) into the workspace. Text is extracted in your browser — your document never sits on a server longer than the AI call." },
  { icon: Brain, title: "2. AI analyzes the content", body: "DocIntel sends the extracted text to a structured-output AI model that returns labelled fields, insights, severity-ranked risks, and a recommendation." },
  { icon: Eye, title: "3. Review the results", body: "Switch between Structured Data, Insights, Risk Analysis, and Decision tabs. Important entities are highlighted automatically." },
  { icon: MessageSquare, title: "4. Chat to dig deeper", body: "Ask follow-up questions in plain English. Answers are grounded strictly in your document and cite specific values." },
];

function HowPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-gradient-subtle border-b">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">How DocIntel works</h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              From a raw PDF to structured intelligence in four steps — usually under 10 seconds.
            </p>
          </div>
        </section>

        <section className="max-w-[1100px] mx-auto px-4 sm:px-6 py-16">
          <ol className="relative border-l-2 border-border ml-3 space-y-10">
            {steps.map((s) => (
              <li key={s.title} className="pl-8 relative">
                <span className="absolute -left-[18px] top-0 h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                  <s.icon className="h-4 w-4 text-primary-foreground" />
                </span>
                <h3 className="text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>

          <div className="text-center mt-14">
            <Button asChild size="lg" className="shadow-glow">
              <Link to="/app">Try it on your own PDF <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
