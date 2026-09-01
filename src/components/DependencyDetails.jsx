import React from "react";
import { X, ShieldAlert, Sparkles, ArrowRightLeft, Layers, CheckCircle, ExternalLink, Code2, AlertTriangle } from "lucide-react";

export function DependencyDetails({ dependency, onClose }) {
  if (!dependency) return null;

  const statusConfig = {
    unused: {
      label: "POSSIBLY UNUSED",
      badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      icon: ShieldAlert,
      bar: "bg-rose-500"
    },
    review: {
      label: "REVIEW ALTERNATIVE",
      badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      icon: Sparkles,
      bar: "bg-amber-500"
    },
    move: {
      label: "MOVE TO DEVDEPENDENCIES",
      badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      icon: ArrowRightLeft,
      bar: "bg-purple-500"
    },
    optimize: {
      label: "OPTIMIZE IMPORTS",
      badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      icon: Layers,
      bar: "bg-blue-500"
    },
    keep: {
      label: "KEEP / HEALTHY",
      badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      icon: CheckCircle,
      bar: "bg-emerald-500"
    }
  }[dependency.status] || {
    label: "ACTIVE",
    badge: "bg-slate-800 text-slate-300",
    icon: CheckCircle,
    bar: "bg-slate-600"
  };

  const StatusIcon = statusConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Top accent bar */}
        <div className={`h-1.5 w-full ${statusConfig.bar}`} />

        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusConfig.badge}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {statusConfig.label}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                {dependency.type}
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-white font-mono tracking-tight flex items-center gap-3">
              {dependency.name}
              {dependency.version && (
                <span className="text-sm font-normal text-slate-400">
                  {dependency.version}
                </span>
              )}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Usage Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-xs text-slate-400 block mb-1">Scanned Usage</span>
              <span className="text-xl font-bold text-white">
                {dependency.scanned
                  ? `${dependency.usageCount} reference${dependency.usageCount === 1 ? "" : "s"}`
                  : "Not scanned (JSON only)"}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-xs text-slate-400 block mb-1">Source Files</span>
              <span className="text-xl font-bold text-white">
                {dependency.scanned
                  ? `${dependency.usedInFiles.length} file${dependency.usedInFiles.length === 1 ? "" : "s"}`
                  : "N/A"}
              </span>
            </div>
          </div>

          {/* Analysis Findings & Recommendations */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Diet Findings & Advice
            </h4>

            {dependency.findings.map((f, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">
                    {f.title}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    {f.category}
                  </span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {f.description}
                </p>

                {f.alternative && (
                  <div className="mt-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">Suggested alternative / modern path:</span>
                      <span className="font-mono">{f.alternative}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Detected Usages List (if any) */}
          {dependency.usedInFiles && dependency.usedInFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                Detected Import Locations ({dependency.usedInFiles.length} files)
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {dependency.usedInFiles.map((file, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs font-mono"
                  >
                    <div className="text-emerald-400 font-semibold mb-1 flex items-center justify-between">
                      <span>{file.path}</span>
                      <span className="text-slate-500 text-[10px]">{file.count} occurrence(s)</span>
                    </div>
                    {file.matches && file.matches.length > 0 && (
                      <div className="space-y-1 text-slate-400 pl-2 border-l border-slate-800">
                        {file.matches.slice(0, 3).map((m, mIdx) => (
                          <div key={mIdx} className="truncate">
                            <span className="text-slate-600 mr-2">L{m.line}:</span>
                            <code className="text-slate-300">{m.raw}</code>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Heuristic Disclaimer */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              Static scanning inspects text import patterns. Build tools, plugins, or runtime dynamic loaders may consume packages without explicit top-level imports. Always verify before uninstalling.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <a
            href={`https://www.npmjs.com/package/${dependency.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition"
          >
            <span>View on npm</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
