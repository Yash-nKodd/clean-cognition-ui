import { Link } from "@tanstack/react-router";
import { FileSearch, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Home" },
  { to: "/features", label: "Features" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <FileSearch className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">DocIntel</h1>
            <p className="text-[11px] text-muted-foreground -mt-0.5">AI Document Intelligence</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-3 py-2 text-sm text-muted-foreground rounded-md hover:text-foreground hover:bg-secondary transition-colors"
              activeProps={{ className: "px-3 py-2 text-sm rounded-md text-foreground bg-secondary font-medium" }}
              activeOptions={{ exact: true }}
            >
              {n.label}
            </Link>
          ))}
          <Link to="/complete" className="px-3 py-2 text-sm text-muted-foreground rounded-md hover:text-foreground hover:bg-secondary transition-colors">
            Complete Doc
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/app">Open app</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/app">Try it free</Link>
          </Button>
        </div>

        <button
          className="md:hidden p-2 -mr-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-card">
          <div className="max-w-[1200px] mx-auto px-4 py-3 flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-sm rounded-md hover:bg-secondary"
              >
                {n.label}
              </Link>
            ))}
            <Link to="/complete" onClick={() => setOpen(false)} className="px-3 py-2 text-sm rounded-md hover:bg-secondary">
              Complete Doc
            </Link>
            <Link to="/app" onClick={() => setOpen(false)} className="mt-2 px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground text-center font-medium">
              Open app
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t bg-card mt-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <FileSearch className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold">DocIntel</span>
          </div>
          <p className="text-muted-foreground mt-3 max-w-sm">
            Turn any PDF into structured data, insights, and confident decisions —
            in seconds.
          </p>
        </div>
        <div>
          <p className="font-semibold mb-3">Product</p>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/features" className="hover:text-foreground">Features</Link></li>
            <li><Link to="/how-it-works" className="hover:text-foreground">How it works</Link></li>
            <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
            <li><Link to="/complete" className="hover:text-foreground">Complete Doc</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-3">Company</p>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/app" className="hover:text-foreground">Launch app</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 text-xs text-muted-foreground text-center">
          DocIntel · Built for fast, confident document review
        </div>
      </div>
    </footer>
  );
}
