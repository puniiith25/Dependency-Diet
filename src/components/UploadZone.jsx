import React, { useRef, useState } from "react";
import { UploadCloud, FileCode, Archive, ShieldCheck, Zap, AlertCircle, FileSpreadsheet } from "lucide-react";
import { createSampleZipBlob, SAMPLE_PACKAGE_JSON } from "../data/sampleProject";

export function UploadZone({ onAnalyzeZip, onAnalyzeJson, isLoading }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const jsonInputRef = useRef(null);
  const zipInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const processFile = (file) => {
    setErrorMsg(null);
    if (!file) return;

    // Check size limit: 50MB max for safety in browser
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMsg("File is too large (max 50MB). Please exclude large assets or node_modules.");
      return;
    }

    const name = file.name.toLowerCase();
    if (name.endsWith(".zip")) {
      onAnalyzeZip(file);
    } else if (name.endsWith(".json") || name === "package.json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        onAnalyzeJson(e.target.result);
      };
      reader.onerror = () => {
        setErrorMsg("Failed to read the uploaded package.json file.");
      };
      reader.readAsText(file);
    } else {
      setErrorMsg("Unsupported file format. Please upload a package.json or a project .zip archive.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleJsonUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleZipUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleLoadSampleZip = async () => {
    try {
      const blob = await createSampleZipBlob();
      onAnalyzeZip(blob);
    } catch (err) {
      setErrorMsg("Could not load sample project: " + err.message);
    }
  };

  const handleLoadSampleJson = () => {
    onAnalyzeJson(SAMPLE_PACKAGE_JSON);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={jsonInputRef}
        onChange={handleJsonUpload}
        accept=".json,application/json"
        className="hidden"
        id="package-json-upload"
        aria-label="Upload package.json file"
      />
      <input
        type="file"
        ref={zipInputRef}
        onChange={handleZipUpload}
        accept=".zip,application/zip"
        className="hidden"
        id="zip-project-upload"
        aria-label="Upload project ZIP file"
      />

      {/* Main Upload Drop Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full rounded-2xl border-2 border-dashed transition-all duration-200 p-8 sm:p-12 text-center flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-xl ${
          isDragOver
            ? "border-emerald-500 bg-emerald-500/10 scale-[1.01] shadow-2xl shadow-emerald-500/20"
            : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/80 shadow-xl"
        }`}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center mb-6 shadow-inner text-emerald-400">
          <UploadCloud className="w-10 h-10 animate-bounce transition-transform" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
          Drop your project here
        </h3>
        <p className="text-slate-400 text-sm sm:text-base max-w-md mb-8">
          Upload your <span className="text-emerald-400 font-mono">package.json</span> for quick rule checks, or your entire <span className="text-emerald-400 font-mono">.zip</span> codebase for deep import scanning.
        </p>

        {/* Upload Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto z-10">
          <button
            type="button"
            onClick={() => jsonInputRef.current?.click()}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 hover:border-slate-600 transition shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <FileCode className="w-4 h-4 text-emerald-400" />
            Upload package.json
          </button>

          <button
            type="button"
            onClick={() => zipInputRef.current?.click()}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow-lg shadow-emerald-500/25 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <Archive className="w-4 h-4 text-slate-950" />
            Upload Project ZIP
          </button>
        </div>

        {/* Browser Privacy Notice */}
        <div className="mt-8 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-slate-800/80 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Your source code never leaves your browser. 100% Client-Side.</span>
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="w-full mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Couldn't analyze project</p>
            <p className="text-rose-300/90">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Quick Sample Project Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
        <span className="text-slate-500">Need a quick test?</span>
        <button
          type="button"
          onClick={handleLoadSampleZip}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-emerald-400 transition cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Try Sample Codebase (.zip with imports)
        </button>
        <button
          type="button"
          onClick={handleLoadSampleJson}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-emerald-400 transition cursor-pointer"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
          Try Sample package.json
        </button>
      </div>
    </div>
  );
}
