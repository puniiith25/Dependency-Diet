import React from "react";
import { Activity, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";

export function ScoreCard({ scoreData, projectName, projectVersion }) {
  const { score, rating, color, breakdown } = scoreData;

  const colorStyles = {
    emerald: {
      bg: "from-emerald-500/20 to-teal-500/10",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
      badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
      ring: "stroke-emerald-400"
    },
    teal: {
      bg: "from-teal-500/20 to-cyan-500/10",
      border: "border-teal-500/30",
      text: "text-teal-400",
      badge: "bg-teal-500/10 text-teal-300 border-teal-500/20",
      ring: "stroke-teal-400"
    },
    amber: {
      bg: "from-amber-500/20 to-orange-500/10",
      border: "border-amber-500/30",
      text: "text-amber-400",
      badge: "bg-amber-500/10 text-amber-300 border-amber-500/20",
      ring: "stroke-amber-400"
    },
    rose: {
      bg: "from-rose-500/20 to-red-500/10",
      border: "border-rose-500/30",
      text: "text-rose-400",
      badge: "bg-rose-500/10 text-rose-300 border-rose-500/20",
      ring: "stroke-rose-400"
    }
  }[color] || {
    bg: "from-slate-800 to-slate-900",
    border: "border-slate-700",
    text: "text-white",
    badge: "bg-slate-800 text-slate-300",
    ring: "stroke-slate-400"
  };

  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div
      className={`w-full rounded-2xl p-6 sm:p-8 bg-gradient-to-br ${colorStyles.bg} border ${colorStyles.border} backdrop-blur-xl relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8`}
    >
      {/* Left side details */}
      <div className="flex-1 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 border bg-slate-950/60 text-slate-300 border-slate-800">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Dependency Diet Score</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
          <span>{projectName}</span>
          {projectVersion && projectVersion !== "0.0.0" && (
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
              v{projectVersion}
            </span>
          )}
        </h2>

        <p className="text-slate-400 text-sm mt-1 max-w-lg">
          Heuristic analysis of your project's dependencies, redundancy patterns, and placement health.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-2">
          <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${colorStyles.badge}`}>
            {rating}
          </span>
          <span className="text-xs text-slate-500 font-mono">
            {breakdown.total} total dependencies analyzed
          </span>
        </div>
      </div>

      {/* Circular Gauge */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="42"
            className="stroke-slate-800/80"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Animated score circle */}
          <circle
            cx="50"
            cy="50"
            r="42"
            className={`${colorStyles.ring} transition-all duration-1000 ease-out`}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tighter">
            {score}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            / 100
          </span>
        </div>
      </div>
    </div>
  );
}
