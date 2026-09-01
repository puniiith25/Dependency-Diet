/**
 * Generates and triggers the download of a clean plain-text Dependency Diet report.
 */
export function exportReportText(results) {
  if (!results) return;

  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const { projectName, projectVersion, scoreData, dependencies, scannedFilesCount } = results;

  const unused = dependencies.filter((d) => d.status === "unused");
  const review = dependencies.filter((d) => d.status === "review");
  const optimize = dependencies.filter((d) => d.status === "optimize");
  const move = dependencies.filter((d) => d.status === "move");
  const healthy = dependencies.filter((d) => d.status === "keep");

  const lines = [
    "==================================================",
    "          DEPENDENCY DIET REPORT 📦",
    "==================================================",
    `Generated: ${dateStr}`,
    `Project:   ${projectName} (v${projectVersion})`,
    `Files:     ${scannedFilesCount} source files scanned`,
    "",
    "--------------------------------------------------",
    " DIET SCORE & SUMMARY",
    "--------------------------------------------------",
    `Score:   ${scoreData.score} / 100 (${scoreData.rating})`,
    `Total Dependencies:    ${scoreData.breakdown.total}`,
    `  - Regular (runtime): ${scoreData.breakdown.dependencyCount}`,
    `  - DevDependencies:   ${scoreData.breakdown.devCount}`,
    `  - Peer/Optional:     ${scoreData.breakdown.peerCount + scoreData.breakdown.optionalCount}`,
    "",
    "Findings Breakdown:",
    `  - Possibly Unused:   ${unused.length}`,
    `  - Review Alternative: ${review.length}`,
    `  - Move to DevDeps:   ${move.length}`,
    `  - Optimize Imports:  ${optimize.length}`,
    `  - Healthy / Kept:    ${healthy.length}`,
    "",
    "==================================================",
    " DETAILED FINDINGS",
    "=================================================="
  ];

  const formatSection = (title, items) => {
    lines.push("");
    lines.push(`## ${title} (${items.length})`);
    lines.push("-".repeat(title.length + 5));

    if (items.length === 0) {
      lines.push("  None detected.");
      return;
    }

    for (const item of items) {
      lines.push(`• ${item.name} (${item.version || "latest"}) [${item.type}]`);
      if (item.scanned) {
        lines.push(`  Usage: ${item.usageCount} occurrences across ${item.usedInFiles.length} file(s)`);
      }
      for (const finding of item.findings) {
        lines.push(`  - ${finding.title}: ${finding.description}`);
        if (finding.alternative) {
          lines.push(`    Alternative suggestion: ${finding.alternative}`);
        }
      }
      lines.push("");
    }
  };

  formatSection("🔴 POSSIBLY UNUSED", unused);
  formatSection("🟡 REVIEW (Lighter / Native Alternatives Available)", review);
  formatSection("🟣 MOVE (Development Tools in Runtime Dependencies)", move);
  formatSection("🔵 OPTIMIZE (Subpath Imports or Modern APIs)", optimize);
  formatSection("🟢 HEALTHY / ACTIVE", healthy);

  lines.push("");
  lines.push("==================================================");
  lines.push(" NOTE: Static analysis is heuristic. Always test your");
  lines.push(" build and runtime before removing any dependency.");
  lines.push("==================================================");

  const reportContent = lines.join("\n");
  const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dependency-diet-${projectName || "project"}-report.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
