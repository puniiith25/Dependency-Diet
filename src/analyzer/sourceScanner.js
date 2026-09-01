import { detectPackageUsage } from "./usageDetector.js";

const VALID_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".mjs",
  ".cjs",
  ".vue",
  ".svelte"
]);

const IGNORED_DIRECTORIES = [
  "node_modules/",
  ".git/",
  "dist/",
  "build/",
  "coverage/",
  ".cache/",
  ".next/",
  ".nuxt/",
  "out/",
  ".idea/",
  ".vscode/"
];

/**
 * Checks if a file path is a supported source file and not in ignored directories.
 */
export function isScannableSourceFile(filePath) {
  if (!filePath) return false;
  const normalized = filePath.replace(/\\/g, "/");

  // Check if inside ignored directories
  for (const ignored of IGNORED_DIRECTORIES) {
    if (normalized.includes(ignored) || normalized.startsWith(ignored)) {
      return false;
    }
  }

  // Check extension
  const extMatch = normalized.match(/\.[0-9a-z]+$/i);
  if (!extMatch) return false;
  const ext = extMatch[0].toLowerCase();
  return VALID_EXTENSIONS.has(ext);
}

/**
 * Scans an array of source files `{ path, content }` against all dependencies.
 * Accumulates usage counts and file lists.
 */
export function scanSourceFilesForDependencies(files, dependencies) {
  const depUsageMap = new Map();

  // Initialize map
  for (const dep of dependencies) {
    depUsageMap.set(dep.name, {
      totalOccurrences: 0,
      files: []
    });
  }

  // Scan each file
  for (const file of files) {
    for (const dep of dependencies) {
      const result = detectPackageUsage(file.content, dep.name);
      if (result.used) {
        const entry = depUsageMap.get(dep.name);
        entry.totalOccurrences += result.count;
        entry.files.push({
          path: file.path,
          count: result.count,
          matches: result.matches
        });
      }
    }
  }

  // Apply back to dependencies
  return dependencies.map((dep) => {
    const stats = depUsageMap.get(dep.name);
    return {
      ...dep,
      usageCount: stats ? stats.totalOccurrences : 0,
      usedInFiles: stats ? stats.files : [],
      scanned: true
    };
  });
}
