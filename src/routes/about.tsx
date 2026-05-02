import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Zap, Lock } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About DocIntel" },
      { name: "description", content: "DocIntel makes document review fast, accurate, and confidence-building for everyone." },
      { property: "og:title", content: "About DocIntel" },
      { property: "og:description", content: "Document intelligence that anyone can use, in seconds." },
    ],
  }),
});

const values = [
  { icon: Zap, title: "Fast", body: "Most documents are fully analyzed in under 10 seconds." },
  { icon: Lock, title: "Private", body: "Text is extracted in your browser. We only send what's needed for analysis." },
  { icon: Heart, title: "Friendly", body: "Designed so anyone — not just lawyers or analysts — can use it confidently." },
];

function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-gradient-subtle border-b">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-16 md:py-20 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Document review, made human</h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              DocIntel exists because reviewing PDFs shouldn't take an hour. We combine modern
              AI with a focused, opinionated workspace so anyone can get to the answer fast.
            </p>
          </div>
        </section>

        <section className="max-w-[1100px] mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-3 gap-6">
          {values.map((v) => (
            <div key={v.title} className="rounded-xl border bg-card p-6 shadow-soft">
              <div className="h-10 w-10 rounded-lg bg-primary-soft flex items-center justify-center mb-3">
                <v.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">{v.title}</h3>
              <p className="text-sm text-muted-foreground mt-1.5">{v.body}</p>
            </div>
          ))}
        </section>

        <section className="max-w-[900px] mx-auto px-4 sm:px-6 pb-20 text-center">
          <h2 className="text-2xl font-bold">Built with Lovable Cloud + AI</h2>
          <p className="mt-3 text-muted-foreground">
            DocIntel runs on Lovable Cloud and Lovable AI Gateway — no API keys to wrangle, no infrastructure to babysit.
          </p>
          <Button asChild size="lg" className="mt-6 shadow-glow">
            <Link to="/app">Try DocIntel</Link>
          </Button>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
