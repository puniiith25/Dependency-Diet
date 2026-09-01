import React from "react";
import { Loader2, CheckCircle2, CircleDashed } from "lucide-react";

export function LoadingState({ stepIndex = 1, message = "Analyzing project..." }) {
  const steps = [
    "Reading project files & package.json",
    "Extracting source files (.js, .jsx, .ts, .tsx)",
    "Scanning code for import & require references",
    "Evaluating dependency rules & alternatives",
    "Computing Dependency Diet Score"
  ];

  return (
    <div className="w-full max-w-xl mx-auto my-12 p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 text-emerald-400">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">Analyzing project...</h3>
      <p className="text-sm text-slate-400 mb-8 text-center">{message}</p>

      {/* Progress Checklist */}
      <div className="w-full space-y-3">
        {steps.map((label, idx) => {
          const stepNum = idx + 1;
          const isDone = stepIndex > stepNum;
          const isCurrent = stepIndex === stepNum;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                isDone
                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  : isCurrent
                  ? "bg-slate-800 text-white border border-slate-700 shadow"
                  : "text-slate-500 opacity-60"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
              ) : (
                <CircleDashed className="w-4 h-4 text-slate-600 shrink-0" />
              )}
              <span>{label}</span>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-xs text-slate-500 font-mono">
        All processing runs client-side inside WebAssembly / JS thread.
      </p>
    </div>
  );
}
