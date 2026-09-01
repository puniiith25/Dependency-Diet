import React, { useState } from "react";
import { Package, Download, RotateCcw, ShieldCheck, Sparkles, Terminal, Info } from "lucide-react";
import { UploadZone } from "./components/UploadZone";
import { LoadingState } from "./components/LoadingState";
import { ScoreCard } from "./components/ScoreCard";
import { StatsCards } from "./components/StatsCards";
import { FindingCard } from "./components/FindingCard";
import { DependencyTable } from "./components/DependencyTable";
import { DependencyDetails } from "./components/DependencyDetails";
import { EmptyState } from "./components/EmptyState";
import { analyzeZipProject, analyzePackageJsonDirect } from "./analyzer/zipAnalyzer";
import { exportReportText } from "./utils/reportGenerator";

export default function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState({ step: 1, message: "" });
  const [selectedDependency, setSelectedDependency] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleAnalyzeZip = async (fileOrBlob) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSelectedDependency(null);

    const result = await analyzeZipProject(fileOrBlob, (step, total, msg) => {
      setLoadingStep({ step, message: msg });
    });

    setIsLoading(false);
    if (result.success) {
      setAnalysisResult(result);
      setStatusFilter("all");
    } else {
      setErrorMessage(result.error);
    }
  };

  const handleAnalyzeJson = (jsonString) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSelectedDependency(null);

    const result = analyzePackageJsonDirect(jsonString);
    setIsLoading(false);

    if (result.success) {
      setAnalysisResult(result);
      setStatusFilter("all");
    } else {
      setErrorMessage(result.error);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setErrorMessage(null);
    setSelectedDependency(null);
    setStatusFilter("all");
  };

  const handleExport = () => {
    if (analysisResult) {
      exportReportText(analysisResult);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleReset}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-emerald-400">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                Dependency Diet <span className="text-emerald-400">📦</span>
              </span>
              <span className="hidden sm:block text-[11px] text-slate-400">
                Trim the fat from your JavaScript project
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {analysisResult && (
              <>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Analyze Another Project</span>
                  <span className="sm:hidden">Reset</span>
                </button>

                <button
                  type="button"
                  onClick={handleExport}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition shadow-md shadow-emerald-400/20 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Report</span>
                </button>
              </>
            )}

            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Client-Side</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col">
        {!analysisResult && !isLoading && (
          <div className="flex flex-col items-center justify-center my-auto space-y-8 animate-fadeIn">
            {/* Landing Hero */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Modern Client-Side Static Analysis</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
                Dependency Diet
              </h1>
              <p className="text-lg sm:text-xl font-medium text-emerald-400">
                Trim the fat from your JavaScript project.
              </p>
              <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
                Find potentially unused, redundant, misplaced, or unnecessarily heavy dependencies without sending your source code to any server.
              </p>
            </div>

            {/* Upload Area */}
            <UploadZone
              onAnalyzeZip={handleAnalyzeZip}
              onAnalyzeJson={handleAnalyzeJson}
              isLoading={isLoading}
            />

            {/* Error banner if any */}
            {errorMessage && (
              <div className="w-full max-w-2xl p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
                <Info className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Analysis Failed</p>
                  <p className="text-rose-200/90 text-xs mt-1">{errorMessage}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading Progress State */}
        {isLoading && (
          <LoadingState
            stepIndex={loadingStep.step}
            message={loadingStep.message}
          />
        )}

        {/* Results Dashboard */}
        {analysisResult && !isLoading && (
          <div className="space-y-6 animate-fadeIn">
            {/* Scorecard Hero */}
            <ScoreCard
              scoreData={analysisResult.scoreData}
              projectName={analysisResult.projectName}
              projectVersion={analysisResult.projectVersion}
            />

            {/* Source info pill if JSON-only or ZIP */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>
                  {analysisResult.isZip
                    ? `Scanned ${analysisResult.scannedFilesCount} source files via ${analysisResult.packageJsonPath}`
                    : `Evaluated ${analysisResult.packageJsonPath} (JSON-only rule check)`}
                </span>
              </div>
              <span className="text-slate-500">
                {analysisResult.isZip
                  ? "Full import detection active"
                  : "Upload project ZIP to scan for unused imports"}
              </span>
            </div>

            {/* Interactive Stats Cards */}
            <StatsCards
              scoreData={analysisResult.scoreData}
              activeFilter={statusFilter}
              onSelectFilter={setStatusFilter}
            />

            {/* Actionable Findings Highlights */}
            <FindingCard
              dependencies={analysisResult.dependencies}
              onSelectDependency={setSelectedDependency}
            />

            {/* Full Dependency Table */}
            <DependencyTable
              dependencies={analysisResult.dependencies}
              onSelectDependency={setSelectedDependency}
              activeFilter={statusFilter}
              onFilterChange={setStatusFilter}
            />
          </div>
        )}
      </main>

      {/* Dependency Details Drawer/Modal */}
      {selectedDependency && (
        <DependencyDetails
          dependency={selectedDependency}
          onClose={() => setSelectedDependency(null)}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/60 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Dependency Diet 📦 — Zero-backend client-side analysis.</span>
          <span>🔒 Source code is processed strictly in-memory within your browser.</span>
        </div>
      </footer>
    </div>
  );
}
