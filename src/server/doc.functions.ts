import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { callAIJson, callAIText } from "./ai.server";
import type { DocAnalysis } from "@/lib/doc-types";

const analysisSchema = {
  type: "object",
  properties: {
    structuredFields: {
      type: "array",
      description: "Key structured fields extracted from the document.",
      items: {
        type: "object",
        properties: {
          label: { type: "string" },
          value: { type: "string" },
          highlight: {
            type: "boolean",
            description: "True for important fields like names, dates, amounts.",
          },
        },
        required: ["label", "value", "highlight"],
      },
    },
    insights: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          body: { type: "string" },
          tone: { type: "string", enum: ["warning", "info", "success"] },
        },
        required: ["title", "body", "tone"],
      },
    },
    risks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          severity: { type: "string", enum: ["high", "medium", "low"] },
          title: { type: "string" },
          body: { type: "string" },
        },
        required: ["severity", "title", "body"],
      },
    },
    decision: {
      type: "object",
      properties: {
        recommendation: { type: "string" },
        confidence: { type: "number", description: "0-100" },
        summary: { type: "string" },
        actions: { type: "array", items: { type: "string" } },
      },
      required: ["recommendation", "confidence", "summary", "actions"],
    },
  },
  required: ["structuredFields", "insights", "risks", "decision"],
} as const;

export const analyzeDocument = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      text: z.string().min(1).max(200_000),
      filename: z.string().optional(),
    }).parse,
  )
  .handler(async ({ data }): Promise<DocAnalysis> => {
    const system = `You are an expert document analyst. Extract structured information from the document the user provides. Return concise, factual analysis. Highlight key entities (people, organizations, dates, monetary amounts) by setting highlight=true. Provide 3-6 insights, 2-5 risks (with severity), and a final decision/recommendation with a confidence score 0-100. Only use information actually present in the document.`;
    const user = `Filename: ${data.filename ?? "uploaded.pdf"}\n\nDOCUMENT TEXT:\n${data.text.slice(0, 180_000)}`;
    return callAIJson<DocAnalysis>({
      system,
      user,
      schemaName: "submit_document_analysis",
      schema: analysisSchema as unknown as Record<string, unknown>,
    });
  });

export const askDocument = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      text: z.string().min(1).max(200_000),
      question: z.string().min(1).max(2000),
      history: z
        .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
        .max(20)
        .optional(),
    }).parse,
  )
  .handler(async ({ data }): Promise<{ answer: string }> => {
    const system = `You are an AI assistant answering questions strictly about the provided document. Cite specific values, dates, and clauses from the document. If the answer is not in the document, say so. Use **bold** for key terms. Keep responses concise and well-structured.`;
    const history = (data.history ?? [])
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");
    const user = `DOCUMENT TEXT:\n${data.text.slice(0, 180_000)}\n\n${history ? `CONVERSATION SO FAR:\n${history}\n\n` : ""}USER QUESTION: ${data.question}`;
    const answer = await callAIText({ system, user });
    return { answer };
  });
