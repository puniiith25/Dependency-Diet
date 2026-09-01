import { dependencyRules, devOnlyPackages } from "../data/dependencyRules.js";

/**
 * Runs rule evaluations on a list of parsed dependencies.
 * 
 * Status categories:
 * - 🟢 keep: actively referenced or standard dev dependency in devDependencies
 * - 🔴 unused: 0 detected usages in scanned source files (only if project was scanned)
 * - 🟡 review: package has lighter/native alternatives or maintenance notes
 * - 🟣 move: build/tooling package placed in dependencies instead of devDependencies
 * - 🔵 optimize: package has specific subpath / modular import recommendations (e.g. lodash)
 */
export function evaluateRules(dependencies, wasProjectScanned = false) {
  return dependencies.map((dep) => {
    const findings = [];
    let primaryStatus = "keep";

    const rule = dependencyRules[dep.name];
    const isDevOnlyCandidate = devOnlyPackages.has(dep.name);

    // 1. Check classification (Move)
    if (dep.type === "dependency" && isDevOnlyCandidate) {
      findings.push({
        type: "move",
        category: "Classification",
        title: "Possible classification issue",
        description: `${dep.name} is commonly a development-only tool. Consider moving it to devDependencies.`
      });
      primaryStatus = "move";
    }

    // 2. Check rule engine for Review or Optimize
    if (rule) {
      if (rule.type === "optimize") {
        findings.push({
          type: "optimize",
          category: rule.category,
          title: "Optimization Opportunity",
          alternative: rule.alternative,
          description: rule.message
        });
        if (primaryStatus === "keep") {
          primaryStatus = "optimize";
        }
      } else {
        findings.push({
          type: "review",
          category: rule.category,
          title: "Alternative available",
          alternative: rule.alternative,
          description: rule.message
        });
        if (primaryStatus === "keep") {
          primaryStatus = "review";
        }
      }
    }

    // 3. Check usage detection if project ZIP / source files were scanned
    if (wasProjectScanned) {
      if (dep.usageCount === 0) {
        // Types packages or dev configs might not be directly imported, phrase carefully
        const isTypesPackage = dep.name.startsWith("@types/");
        findings.push({
          type: "unused",
          category: "Usage",
          title: "Possibly Unused",
          description: isTypesPackage
            ? "No explicit import detected. TypeScript type definitions may be auto-loaded via tsconfig.json."
            : "No matching import or require statements were detected in scanned source files. Verify manually before removing (static scanning cannot detect dynamic runtime references)."
        });
        // Unused is higher priority to highlight unless it's a dev tool in devDependencies
        if (dep.type !== "dev" || !isDevOnlyCandidate) {
          primaryStatus = "unused";
        }
      } else {
        findings.push({
          type: "keep",
          category: "Usage",
          title: "Active Usage Detected",
          description: `Referenced in ${dep.usedInFiles.length} file${dep.usedInFiles.length === 1 ? "" : "s"} (${dep.usageCount} total occurrences).`
        });
      }
    }

    // Default keep finding if empty
    if (findings.length === 0) {
      findings.push({
        type: "keep",
        category: "General",
        title: "No Issues Detected",
        description: "No known alternatives or placement anomalies flagged."
      });
    }

    return {
      ...dep,
      status: primaryStatus,
      findings
    };
  });
}
