export type StructuredField = { label: string; value: string; highlight: boolean };
export type Insight = { title: string; body: string; tone: "warning" | "info" | "success" };
export type Risk = { severity: "high" | "medium" | "low"; title: string; body: string };
export type Decision = {
  recommendation: string;
  confidence: number;
  summary: string;
  actions: string[];
};

export type DocAnalysis = {
  structuredFields: StructuredField[];
  insights: Insight[];
  risks: Risk[];
  decision: Decision;
};

export type ChatMessage = { role: "user" | "assistant"; content: string };
