import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDoc } from "@/lib/doc-context";
import { askDocument } from "@/server/doc.functions";
import type { ChatMessage } from "@/lib/doc-types";

const suggestedQuestions = [
  "Summarize this document",
  "What are the key dates?",
  "What are the biggest risks?",
];

export function ChatAssistant() {
  const doc = useDoc();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset chat when a new doc is loaded
  useEffect(() => {
    if (doc.status === "ready" && doc.filename) {
      setMessages([
        {
          role: "assistant",
          content: `I've finished analyzing **${doc.filename}**. Ask me anything about its contents.`,
        },
      ]);
    } else if (doc.status === "idle") {
      setMessages([]);
    }
  }, [doc.status, doc.filename]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;
    if (!doc.text) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: q }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { answer } = await askDocument({
        data: { text: doc.text, question: q, history: messages.slice(-10) },
      });
      setMessages([...next, { role: "assistant", content: answer || "(no response)" }]);
    } catch (e) {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: `Sorry, I couldn't get an answer: ${e instanceof Error ? e.message : "unknown error"}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const disabled = !doc.text || doc.status !== "ready";

  return (
    <div className="rounded-xl border bg-card shadow-card flex flex-col overflow-hidden h-[420px]">
      <div className="flex items-center justify-between border-b px-4 py-3 bg-gradient-subtle">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold">AI Document Assistant</p>
            <p className="text-[11px] text-muted-foreground">
              {disabled ? "Upload a document to start chatting" : "Ask anything about this document"}
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span
            className={`h-1.5 w-1.5 rounded-full ${disabled ? "bg-muted-foreground" : "bg-success animate-pulse"}`}
          />
          {disabled ? "Idle" : "Online"}
        </span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-xs text-muted-foreground py-12">
            {disabled
              ? "Your conversation will appear here once a document is analyzed."
              : "Start by asking a question below."}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <div className="h-7 w-7 shrink-0 rounded-lg bg-primary-soft flex items-center justify-center">
                <Bot className="h-3.5 w-3.5 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-secondary text-secondary-foreground rounded-bl-sm"
              }`}
              dangerouslySetInnerHTML={{
                __html: m.content.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>'),
              }}
            />
            {m.role === "user" && (
              <div className="h-7 w-7 shrink-0 rounded-lg bg-accent flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-accent-foreground" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="h-7 w-7 shrink-0 rounded-lg bg-primary-soft flex items-center justify-center">
              <Bot className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="bg-secondary text-secondary-foreground rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Thinking…
            </div>
          </div>
        )}
      </div>

      <div className="border-t bg-card p-3 space-y-2">
        {!disabled && (
          <div className="flex flex-wrap gap-1.5">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => void send(q)}
                disabled={loading}
                className="text-[11px] px-2.5 py-1 rounded-full border bg-secondary/60 hover:bg-primary-soft hover:border-primary/30 hover:text-primary transition-colors disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="flex items-center gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={disabled ? "Upload a PDF to enable chat…" : "Ask about clauses, dates, parties…"}
            className="flex-1"
            disabled={disabled || loading}
          />
          <Button type="submit" size="icon" disabled={disabled || loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
