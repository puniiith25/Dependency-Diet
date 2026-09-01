import React from "react";
import { PackageSearch, ArrowUpRight } from "lucide-react";

export function EmptyState() {
  return (
    <div className="w-full max-w-2xl mx-auto my-12 p-8 text-center flex flex-col items-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
        <PackageSearch className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1">No project analyzed yet</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6">
        Upload a <code className="text-emerald-400 font-mono text-xs">package.json</code> or a project <code className="text-emerald-400 font-mono text-xs">.zip</code> archive to start your Dependency Diet.
      </p>
    </div>
  );
}
