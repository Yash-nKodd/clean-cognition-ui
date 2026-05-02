import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Database,
  Lightbulb,
  ShieldAlert,
  Gavel,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Sparkles,
  Loader2,
  FileQuestion,
} from "lucide-react";
import { useDoc } from "@/lib/doc-context";

const toneStyles = {
  warning: { icon: AlertTriangle, cls: "text-warning bg-warning/10" },
  info: { icon: Info, cls: "text-primary bg-primary/10" },
  success: { icon: CheckCircle2, cls: "text-success bg-success/10" },
};

const severityStyles = {
  high: { label: "High", cls: "bg-destructive/10 text-destructive border-destructive/20", icon: AlertCircle },
  medium: { label: "Medium", cls: "bg-warning/15 text-warning-foreground border-warning/30", icon: AlertTriangle },
  low: { label: "Low", cls: "bg-muted text-muted-foreground border-border", icon: Info },
};

function EmptyState({ status, error }: { status: string; error: string | null }) {
  if (status === "extracting" || status === "analyzing") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
        <p className="text-sm font-medium">
          {status === "extracting" ? "Reading your document…" : "AI is analyzing the document…"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">This usually takes a few seconds.</p>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="h-8 w-8 text-destructive mb-3" />
        <p className="text-sm font-medium">Couldn't analyze document</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">{error}</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <FileQuestion className="h-8 w-8 text-muted-foreground mb-3" />
      <p className="text-sm font-medium">No document yet</p>
      <p className="text-xs text-muted-foreground mt-1">Upload a PDF to see AI analysis here.</p>
    </div>
  );
}

export function OutputTabs() {
  const doc = useDoc();
  const analysis = doc.analysis;

  if (!analysis) {
    return <EmptyState status={doc.status} error={doc.error} />;
  }

  const { structuredFields, insights, risks, decision } = analysis;

  return (
    <Tabs defaultValue="structured" className="h-full flex flex-col">
      <TabsList className="grid grid-cols-4 w-full bg-secondary/60 p-1 h-auto">
        <TabsTrigger value="structured" className="gap-1.5 py-2 text-xs sm:text-sm">
          <Database className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Structured Data</span><span className="sm:hidden">Data</span>
        </TabsTrigger>
        <TabsTrigger value="insights" className="gap-1.5 py-2 text-xs sm:text-sm">
          <Lightbulb className="h-3.5 w-3.5" /> Insights
        </TabsTrigger>
        <TabsTrigger value="risk" className="gap-1.5 py-2 text-xs sm:text-sm">
          <ShieldAlert className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Risk Analysis</span><span className="sm:hidden">Risk</span>
        </TabsTrigger>
        <TabsTrigger value="decision" className="gap-1.5 py-2 text-xs sm:text-sm">
          <Gavel className="h-3.5 w-3.5" /> Decision
        </TabsTrigger>
      </TabsList>

      <div className="mt-4 flex-1 overflow-auto pr-1">
        <TabsContent value="structured" className="mt-0 space-y-2">
          {structuredFields.map((f, i) => (
            <div
              key={`${f.label}-${i}`}
              className="flex items-center justify-between gap-4 rounded-lg border bg-card px-4 py-3 shadow-soft"
            >
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {f.label}
              </span>
              <span
                className={`text-sm font-semibold text-right ${
                  f.highlight ? "field-highlight" : "text-foreground"
                }`}
              >
                {f.value}
              </span>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="insights" className="mt-0 space-y-3">
          {insights.map((it, i) => {
            const { icon: Icon, cls } = toneStyles[it.tone] ?? toneStyles.info;
            return (
              <div key={`${it.title}-${i}`} className="rounded-xl border bg-card p-4 shadow-soft">
                <div className="flex items-start gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${cls}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{it.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{it.body}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="risk" className="mt-0 space-y-3">
          {risks.map((r, i) => {
            const sev = severityStyles[r.severity] ?? severityStyles.low;
            const Icon = sev.icon;
            return (
              <div key={`${r.title}-${i}`} className="rounded-xl border bg-card p-4 shadow-soft">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-foreground/70" />
                    <p className="text-sm font-semibold">{r.title}</p>
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border ${sev.cls}`}>
                    {sev.label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground pl-6">{r.body}</p>
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="decision" className="mt-0 space-y-4">
          <div className="rounded-xl bg-gradient-primary text-primary-foreground p-5 shadow-glow">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-80">
              <Sparkles className="h-3.5 w-3.5" /> AI Recommendation
            </div>
            <p className="text-2xl font-bold mt-2">{decision.recommendation}</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 h-1.5 rounded-full bg-primary-foreground/20 overflow-hidden">
                <div
                  className="h-full bg-primary-foreground rounded-full"
                  style={{ width: `${Math.max(0, Math.min(100, decision.confidence))}%` }}
                />
              </div>
              <span className="text-xs font-semibold tabular-nums">
                {Math.round(decision.confidence)}% confidence
              </span>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-4 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Summary
            </p>
            <p className="text-sm text-foreground leading-relaxed">{decision.summary}</p>
          </div>

          <div className="rounded-xl border bg-card p-4 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Recommended Actions
            </p>
            <ul className="space-y-2">
              {decision.actions.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 h-5 w-5 rounded-full bg-primary-soft text-primary text-[11px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
