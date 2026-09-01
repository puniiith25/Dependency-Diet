import React from "react";
import { ShieldAlert, Sparkles, ArrowRightLeft, Layers, CheckCircle, ChevronRight } from "lucide-react";

export function DependencyRow({ dependency, onSelect }) {
  const statusBadges = {
    unused: {
      label: "Possibly Unused",
      badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      dot: "bg-rose-500",
      icon: ShieldAlert
    },
    review: {
      label: "Review",
      badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      dot: "bg-amber-500",
      icon: Sparkles
    },
    move: {
      label: "Move",
      badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      dot: "bg-purple-500",
      icon: ArrowRightLeft
    },
    optimize: {
      label: "Optimize",
      badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      dot: "bg-blue-500",
      icon: Layers
    },
    keep: {
      label: "Keep",
      badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      dot: "bg-emerald-500",
      icon: CheckCircle
    }
  };

  const statusInfo = statusBadges[dependency.status] || statusBadges.keep;
  const primaryFinding = dependency.findings[0];

  return (
    <tr
      onClick={() => onSelect(dependency)}
      className="group border-b border-slate-800/80 hover:bg-slate-800/40 transition cursor-pointer"
    >
      {/* Package Name */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-2.5">
          <span className={`w-2 h-2 rounded-full ${statusInfo.dot} shrink-0`} />
          <span className="font-mono text-sm font-semibold text-slate-100 group-hover:text-emerald-400 transition">
            {dependency.name}
          </span>
        </div>
      </td>

      {/* Version */}
      <td className="py-3.5 px-4 font-mono text-xs text-slate-400">
        {dependency.version || "—"}
      </td>

      {/* Type */}
      <td className="py-3.5 px-4">
        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60 font-mono">
          {dependency.type}
        </span>
      </td>

      {/* Usage */}
      <td className="py-3.5 px-4">
        {dependency.scanned ? (
          <span
            className={`text-xs font-mono font-medium ${
              dependency.usageCount === 0 ? "text-rose-400" : "text-slate-300"
            }`}
          >
            {dependency.usageCount === 0
              ? "0 refs"
              : `${dependency.usageCount} refs (${dependency.usedInFiles.length} files)`}
          </span>
        ) : (
          <span className="text-xs text-slate-500 font-mono">JSON only</span>
        )}
      </td>

      {/* Status Badge */}
      <td className="py-3.5 px-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusInfo.badge}`}
        >
          <statusInfo.icon className="w-3.5 h-3.5 shrink-0" />
          {statusInfo.label}
        </span>
      </td>

      {/* Recommendation Summary */}
      <td className="py-3.5 px-4 text-xs text-slate-400 max-w-xs truncate">
        {primaryFinding ? primaryFinding.description : "No action needed."}
      </td>

      {/* Action / Arrow */}
      <td className="py-3.5 px-4 text-right">
        <span className="inline-flex p-1.5 rounded-lg text-slate-500 group-hover:text-emerald-400 group-hover:bg-slate-800 transition">
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </td>
    </tr>
  );
}
