export const mockDocument = {
  name: "Vendor_Agreement_2026.pdf",
  pages: 4,
  size: "284 KB",
  uploadedAt: "Just now",
};

export const structuredFields = [
  { label: "Document Type", value: "Vendor Service Agreement", highlight: false },
  { label: "Contract ID", value: "VSA-2026-00471", highlight: false },
  { label: "Counterparty", value: "Northwind Logistics Inc.", highlight: true },
  { label: "Effective Date", value: "April 15, 2026", highlight: true },
  { label: "Expiration Date", value: "April 14, 2028", highlight: true },
  { label: "Total Contract Value", value: "$284,500.00", highlight: true },
  { label: "Payment Terms", value: "Net 30", highlight: false },
  { label: "Signed By", value: "Elena Marsh, COO", highlight: true },
  { label: "Jurisdiction", value: "Delaware, USA", highlight: false },
];

export const insights = [
  {
    title: "Auto-renewal clause detected",
    body: "The contract auto-renews for 12 months unless cancelled 60 days before expiration.",
    tone: "warning" as const,
  },
  {
    title: "Above-average contract value",
    body: "Total value is 38% higher than your typical vendor agreements this quarter.",
    tone: "info" as const,
  },
  {
    title: "Standard liability cap",
    body: "Liability is capped at fees paid in the prior 12 months — consistent with your playbook.",
    tone: "success" as const,
  },
  {
    title: "Data processing addendum referenced",
    body: "DPA in Schedule B should be reviewed by privacy counsel before signing.",
    tone: "info" as const,
  },
];

export const risks = [
  {
    severity: "high" as const,
    title: "Unilateral price increase clause",
    body: "Section 7.2 allows the vendor to raise fees by up to 15% annually with only 30 days notice.",
  },
  {
    severity: "medium" as const,
    title: "Limited termination rights",
    body: "Customer may only terminate for cause; no convenience termination during the initial term.",
  },
  {
    severity: "low" as const,
    title: "Governing law: Delaware",
    body: "Disputes must be resolved in Delaware courts — consider travel and counsel implications.",
  },
];

export const decision = {
  recommendation: "Negotiate before signing",
  confidence: 86,
  summary:
    "The agreement is broadly acceptable but contains two terms that warrant negotiation: the unilateral price-increase right and the absence of termination-for-convenience. Address those, confirm the DPA in Schedule B, and the contract is ready for signature.",
  actions: [
    "Cap annual price increases at CPI or 5%, whichever is lower",
    "Add a termination-for-convenience clause with 90 days notice",
    "Route Schedule B (DPA) to privacy counsel for sign-off",
  ],
};

export const initialChat = [
  {
    role: "assistant" as const,
    content:
      "I've finished analyzing **Vendor_Agreement_2026.pdf**. Ask me anything about the parties, dates, financials, or specific clauses.",
  },
];

export const suggestedQuestions = [
  "What are the key dates?",
  "Summarize the payment terms",
  "What are the biggest risks?",
];
