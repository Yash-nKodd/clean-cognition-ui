import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: "Pricing — DocIntel" },
      { name: "description", content: "Simple, transparent pricing for DocIntel — try free, upgrade for higher volume and team features." },
      { property: "og:title", content: "Pricing — DocIntel" },
      { property: "og:description", content: "Try free. Upgrade for higher volume and team features." },
    ],
  }),
});

const plans = [
  {
    name: "Free",
    price: "$0",
    desc: "Perfect for trying DocIntel on a few documents.",
    features: ["10 documents / month", "All analysis features", "Document chat", "PDFs up to 20 MB"],
    cta: "Open the app",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    desc: "For professionals reviewing documents weekly.",
    features: ["500 documents / month", "Complete-Doc feature", "Export PDF & Markdown", "Priority AI processing"],
    cta: "Start Pro",
    highlight: true,
  },
  {
    name: "Team",
    price: "Custom",
    desc: "For teams that need volume, SSO, and audit trails.",
    features: ["Unlimited documents", "Shared workspace", "SSO & role-based access", "Audit logs & SLA"],
    cta: "Contact sales",
    highlight: false,
  },
];

function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-gradient-subtle border-b">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Simple pricing</h1>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Start free. Upgrade when you need more volume or team features.
            </p>
          </div>
        </section>

        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl border p-7 flex flex-col ${
                p.highlight ? "border-primary shadow-glow bg-card relative" : "bg-card shadow-soft"
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold px-3 py-1 uppercase tracking-wider">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{p.price}</span>
                {p.price !== "Custom" && <span className="text-muted-foreground text-sm">/ month</span>}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              <ul className="mt-5 space-y-2 text-sm flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-success mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-6" variant={p.highlight ? "default" : "outline"}>
                <Link to="/app">{p.cta}</Link>
              </Button>
            </div>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
