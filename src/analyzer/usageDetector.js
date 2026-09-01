/**
 * Scans JavaScript / TypeScript source text for references to a specific package name.
 * 
 * Supports:
 * - import ... from "pkg" / "pkg/subpath"
 * - import "pkg"
 * - const x = require("pkg")
 * - require("pkg/subpath")
 * - import("pkg") / import("pkg/subpath")
 * - Scoped packages: @tanstack/react-query, @radix-ui/react-dialog
 * 
 * Strict word-boundary / subpath matching prevents false matches 
 * (e.g. `react` won't match `react-query` or `react-dom`).
 */

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Checks whether the source code imports or requires the given package.
 * Returns the number of occurrences and snippet references.
 */
export function detectPackageUsage(sourceText, packageName) {
  if (!sourceText || !packageName) return { used: false, count: 0, matches: [] };

  const escapedPkg = escapeRegex(packageName);

  // Pattern matches:
  // (from|import|require)\s*\(?\s*['"](pkg)(\/.*)?['"]
  // e.g.
  // import x from 'packageName'
  // import 'packageName/styles.css'
  // require('packageName')
  // require('packageName/sub/module')
  // import('packageName')
  const importRegex = new RegExp(
    `(?:from|import|require)\\s*\\(?\\s*['"\`](${escapedPkg})(?:\\/[^'"\`]+)?['"\`]`,
    "g"
  );

  let match;
  let count = 0;
  const matches = [];

  while ((match = importRegex.exec(sourceText)) !== null) {
    count++;
    // Get line number of match
    const upToMatch = sourceText.slice(0, match.index);
    const lineNum = upToMatch.split("\n").length;
    matches.push({
      line: lineNum,
      raw: match[0].trim()
    });
  }

  return {
    used: count > 0,
    count,
    matches
  };
}
