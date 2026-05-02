import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { callAIJson } from "./ai.server";

const completionSchema = {
  type: "object",
  properties: {
    detectedType: { type: "string", description: "The doc type the AI inferred (e.g. NDA, Invoice, Resume)." },
    missingSections: {
      type: "array",
      description: "Sections that were missing or incomplete in the original draft.",
      items: { type: "string" },
    },
    completedDocument: {
      type: "string",
      description:
        "The full completed document in Markdown. Preserve the user's original wording verbatim and add the missing sections in the same tone. Use clear Markdown headings.",
    },
    notes: {
      type: "array",
      description: "Short notes explaining what was added or assumed.",
      items: { type: "string" },
    },
  },
  required: ["detectedType", "missingSections", "completedDocument", "notes"],
} as const;

export type DocCompletion = {
  detectedType: string;
  missingSections: string[];
  completedDocument: string;
  notes: string[];
};

export const completeDocument = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      partialText: z.string().min(20).max(80_000),
      docType: z.string().min(1).max(120),
      filename: z.string().optional(),
    }).parse,
  )
  .handler(async ({ data }): Promise<DocCompletion> => {
    const system = `You are a document drafting assistant. The user gives you an INCOMPLETE document and tells you what KIND of document it is. Your job:
1. Identify which standard sections of that document type are present, partial, or missing.
2. Produce a COMPLETE version of the document by:
   - keeping the user's original wording verbatim where it exists,
   - filling in any missing or incomplete sections using common, professional language for that document type,
   - using sensible placeholders like [Party Name] only when truly unknowable from context.
3. Output clean Markdown with clear section headings.
Only invent content that is standard for the stated document type — never fabricate facts (names, prices, dates) the user didn't provide.`;

    const user = `Document type the user says this is: ${data.docType}
Filename: ${data.filename ?? "draft"}

INCOMPLETE DRAFT:
"""
${data.partialText}
"""

Return: detectedType, missingSections, completedDocument (Markdown), notes.`;

    return callAIJson<DocCompletion>({
      system,
      user,
      schemaName: "submit_completed_document",
      schema: completionSchema as unknown as Record<string, unknown>,
    });
  });
