import React, { useState, useMemo } from "react";
import { Search, Filter, ArrowUpDown, ChevronDown, PackageOpen, Layers } from "lucide-react";
import { DependencyRow } from "./DependencyRow";

export function DependencyTable({
  dependencies,
  onSelectDependency,
  activeFilter,
  onFilterChange
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name"); // 'name' | 'usage' | 'status' | 'type'
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' | 'desc'

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder(column === "usage" ? "desc" : "asc");
    }
  };

  const filteredAndSorted = useMemo(() => {
    return dependencies
      .filter((dep) => {
        // Status filter
        if (activeFilter !== "all" && dep.status !== activeFilter) {
          return false;
        }

        // Type filter (dependency, dev, peer, optional)
        if (typeFilter !== "all" && dep.type !== typeFilter) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = dep.name.toLowerCase().includes(q);
          const matchFinding = dep.findings.some(
            (f) =>
              f.title.toLowerCase().includes(q) ||
              f.description.toLowerCase().includes(q) ||
              (f.alternative && f.alternative.toLowerCase().includes(q))
          );
          if (!matchName && !matchFinding) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA, valB;
        if (sortBy === "name") {
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          return sortOrder === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        } else if (sortBy === "usage") {
          valA = a.usageCount || 0;
          valB = b.usageCount || 0;
          return sortOrder === "asc" ? valA - valB : valB - valA;
        } else if (sortBy === "status") {
          valA = a.status;
          valB = b.status;
          return sortOrder === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        } else if (sortBy === "type") {
          valA = a.type;
          valB = b.type;
          return sortOrder === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }
        return 0;
      });
  }, [dependencies, activeFilter, typeFilter, searchQuery, sortBy, sortOrder]);

  return (
    <div className="w-full my-6 bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-xl">
      {/* Table Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search package name or recommendation..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Status filter dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={activeFilter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">All Statuses</option>
              <option value="unused" className="bg-slate-900 text-rose-400">🔴 Possibly Unused</option>
              <option value="review" className="bg-slate-900 text-amber-400">🟡 Review Alternatives</option>
              <option value="move" className="bg-slate-900 text-purple-400">🟣 Move to Dev</option>
              <option value="optimize" className="bg-slate-900 text-blue-400">🔵 Optimize</option>
              <option value="keep" className="bg-slate-900 text-emerald-400">🟢 Healthy / Keep</option>
            </select>
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">All Types</option>
              <option value="dependency" className="bg-slate-900 text-white">Runtime (dependencies)</option>
              <option value="dev" className="bg-slate-900 text-white">Dev (devDependencies)</option>
              <option value="peer" className="bg-slate-900 text-white">Peer</option>
              <option value="optional" className="bg-slate-900 text-white">Optional</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop / Tablet Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/40 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <th
                onClick={() => handleSort("name")}
                className="py-3 px-4 cursor-pointer hover:text-emerald-400 transition"
              >
                <div className="flex items-center gap-1.5">
                  <span>Package</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th className="py-3 px-4">Version</th>
              <th
                onClick={() => handleSort("type")}
                className="py-3 px-4 cursor-pointer hover:text-emerald-400 transition"
              >
                <div className="flex items-center gap-1.5">
                  <span>Type</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th
                onClick={() => handleSort("usage")}
                className="py-3 px-4 cursor-pointer hover:text-emerald-400 transition"
              >
                <div className="flex items-center gap-1.5">
                  <span>Usage</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th
                onClick={() => handleSort("status")}
                className="py-3 px-4 cursor-pointer hover:text-emerald-400 transition"
              >
                <div className="flex items-center gap-1.5">
                  <span>Status</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th className="py-3 px-4">Recommendation</th>
              <th className="py-3 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.map((dep) => (
              <DependencyRow
                key={dep.name}
                dependency={dep}
                onSelect={onSelectDependency}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden divide-y divide-slate-800">
        {filteredAndSorted.map((dep) => (
          <div
            key={dep.name}
            onClick={() => onSelectDependency(dep)}
            className="p-4 hover:bg-slate-800/40 transition cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-sm font-bold text-white">
                {dep.name}
              </span>
              <span className="text-xs font-mono text-slate-400">{dep.version}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {dep.type}
              </span>
              <span className="text-[11px] text-slate-400">
                {dep.scanned ? `${dep.usageCount} refs` : "JSON"}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-slate-800 text-emerald-400">
                {dep.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-2">
              {dep.findings[0]?.description || "No issues flagged."}
            </p>
          </div>
        ))}
      </div>

      {/* Empty Filter Result */}
      {filteredAndSorted.length === 0 && (
        <div className="p-12 text-center flex flex-col items-center justify-center">
          <PackageOpen className="w-10 h-10 text-slate-600 mb-3" />
          <p className="text-sm font-semibold text-slate-300">No dependencies match your filters</p>
          <p className="text-xs text-slate-500 mt-1">Try resetting the search query or status filter.</p>
        </div>
      )}
    </div>
  );
}
