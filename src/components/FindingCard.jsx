import React from "react";
import { AlertTriangle, Sparkles, ArrowRightLeft, Layers, ChevronRight } from "lucide-react";

export function FindingCard({ dependencies, onSelectDependency }) {
  const unused = dependencies.filter((d) => d.status === "unused");
  const review = dependencies.filter((d) => d.status === "review");
  const move = dependencies.filter((d) => d.status === "move");
  const optimize = dependencies.filter((d) => d.status === "optimize");

  if (unused.length === 0 && review.length === 0 && move.length === 0 && optimize.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
      {/* High-priority Cleanups: Unused & Move */}
      {(unused.length > 0 || move.length > 0) && (
        <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-3 text-rose-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-rose-300">
              Potential Cleanups ({unused.length + move.length})
            </h4>
          </div>

          <div className="space-y-2">
            {unused.slice(0, 3).map((dep) => (
              <button
                key={dep.name}
                type="button"
                onClick={() => onSelectDependency(dep)}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-left transition group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="font-mono text-sm text-slate-200 group-hover:text-white font-medium">
                    {dep.name}
                  </span>
                  <span className="text-xs text-rose-400/80">Possibly unused</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition" />
              </button>
            ))}

            {move.slice(0, 2).map((dep) => (
              <button
                key={dep.name}
                type="button"
                onClick={() => onSelectDependency(dep)}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-left transition group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="font-mono text-sm text-slate-200 group-hover:text-white font-medium">
                    {dep.name}
                  </span>
                  <span className="text-xs text-purple-400/80">Move to devDependencies</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modernization & Optimizations: Review & Optimize */}
      {(review.length > 0 || optimize.length > 0) && (
        <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-3 text-amber-400">
            <Sparkles className="w-5 h-5 shrink-0" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-300">
              Modernization & Alternatives ({review.length + optimize.length})
            </h4>
          </div>

          <div className="space-y-2">
            {review.slice(0, 3).map((dep) => (
              <button
                key={dep.name}
                type="button"
                onClick={() => onSelectDependency(dep)}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-left transition group cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span className="font-mono text-sm text-slate-200 group-hover:text-white font-medium shrink-0">
                    {dep.name}
                  </span>
                  <span className="text-xs text-amber-400/80 truncate">
                    → {dep.findings[0]?.alternative || "Native alternative"}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition shrink-0" />
              </button>
            ))}

            {optimize.slice(0, 2).map((dep) => (
              <button
                key={dep.name}
                type="button"
                onClick={() => onSelectDependency(dep)}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-left transition group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="font-mono text-sm text-slate-200 group-hover:text-white font-medium">
                    {dep.name}
                  </span>
                  <span className="text-xs text-blue-400/80">Optimize imports</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
