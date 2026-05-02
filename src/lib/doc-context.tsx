import { createContext, useContext, useState, type ReactNode } from "react";
import type { DocAnalysis } from "./doc-types";

type DocState = {
  filename: string | null;
  numPages: number;
  sizeLabel: string;
  text: string;
  previewDataUrl: string | null;
  analysis: DocAnalysis | null;
  status: "idle" | "extracting" | "analyzing" | "ready" | "error";
  error: string | null;
};

type DocCtx = DocState & {
  setDoc: (s: Partial<DocState>) => void;
  reset: () => void;
};

const initial: DocState = {
  filename: null,
  numPages: 0,
  sizeLabel: "",
  text: "",
  previewDataUrl: null,
  analysis: null,
  status: "idle",
  error: null,
};

const Ctx = createContext<DocCtx | null>(null);

export function DocProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DocState>(initial);
  return (
    <Ctx.Provider
      value={{
        ...state,
        setDoc: (s) => setState((prev) => ({ ...prev, ...s })),
        reset: () => setState(initial),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useDoc() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDoc must be used within DocProvider");
  return ctx;
}
