// Server-only helpers for calling Google Gemini API directly with the user's API key.
const MODEL = "gemini-2.0-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

function getApiKey(): string {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) throw new Error("GOOGLE_API_KEY not configured");
  return key;
}

async function callGemini(body: Record<string, unknown>): Promise<any> {
  const res = await fetch(`${GEMINI_URL}?key=${getApiKey()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${txt.slice(0, 300)}`);
  }
  return res.json();
}

export async function callAIJson<T>(args: {
  system: string;
  user: string;
  schemaName: string;
  schema: Record<string, unknown>;
}): Promise<T> {
  const data = await callGemini({
    systemInstruction: { parts: [{ text: args.system }] },
    contents: [{ role: "user", parts: [{ text: args.user }] }],
    tools: [
      {
        functionDeclarations: [
          {
            name: args.schemaName,
            description: "Return analysis in this exact schema",
            parameters: args.schema,
          },
        ],
      },
    ],
    toolConfig: {
      functionCallingConfig: { mode: "ANY", allowedFunctionNames: [args.schemaName] },
    },
  });
  const call = data?.candidates?.[0]?.content?.parts?.find((p: any) => p.functionCall)?.functionCall;
  if (!call?.args) throw new Error("AI did not return structured output");
  return call.args as T;
}

export async function callAIText(args: { system: string; user: string }): Promise<string> {
  const data = await callGemini({
    systemInstruction: { parts: [{ text: args.system }] },
    contents: [{ role: "user", parts: [{ text: args.user }] }],
  });
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  return parts.map((p: any) => p.text ?? "").join("");
}
