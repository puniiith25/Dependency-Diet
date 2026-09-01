import React from "react";
import { Package, ShieldAlert, Sparkles, ArrowRightLeft, Layers, CheckCircle } from "lucide-react";

export function StatsCards({ scoreData, activeFilter, onSelectFilter }) {
  const { breakdown } = scoreData;

  const cards = [
    {
      id: "all",
      label: "Total Dependencies",
      count: breakdown.total,
      sub: `${breakdown.dependencyCount} runtime · ${breakdown.devCount} dev`,
      icon: Package,
      color: "text-slate-200",
      activeBorder: "border-slate-400 bg-slate-800/80"
    },
    {
      id: "unused",
      label: "Possibly Unused",
      count: breakdown.unusedCount,
      sub: "No detected imports",
      icon: ShieldAlert,
      color: "text-rose-400",
      activeBorder: "border-rose-500 bg-rose-500/10"
    },
    {
      id: "review",
      label: "Review Alternatives",
      count: breakdown.reviewCount,
      sub: "Native / modern options",
      icon: Sparkles,
      color: "text-amber-400",
      activeBorder: "border-amber-500 bg-amber-500/10"
    },
    {
      id: "move",
      label: "Move to DevDeps",
      count: breakdown.moveCount,
      sub: "Classification anomaly",
      icon: ArrowRightLeft,
      color: "text-purple-400",
      activeBorder: "border-purple-500 bg-purple-500/10"
    },
    {
      id: "optimize",
      label: "Optimize Imports",
      count: breakdown.optimizeCount,
      sub: "Subpath / tree-shaking",
      icon: Layers,
      color: "text-blue-400",
      activeBorder: "border-blue-500 bg-blue-500/10"
    },
    {
      id: "keep",
      label: "Healthy & Active",
      count: breakdown.healthyCount,
      sub: "Referenced properly",
      icon: CheckCircle,
      color: "text-emerald-400",
      activeBorder: "border-emerald-500 bg-emerald-500/10"
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 my-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeFilter === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectFilter(card.id)}
            className={`p-4 rounded-xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
              isSelected
                ? `${card.activeBorder} shadow-lg scale-[1.02]`
                : "border-slate-800 bg-slate-900/60 hover:bg-slate-800/60 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400 truncate pr-1">
                {card.label}
              </span>
              <Icon className={`w-4 h-4 ${card.color} shrink-0`} />
            </div>

            <div>
              <div className={`text-2xl font-extrabold tracking-tight ${card.color}`}>
                {card.count}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 truncate">
                {card.sub}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
