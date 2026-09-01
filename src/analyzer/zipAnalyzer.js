import JSZip from "jszip";
import { parsePackageJson } from "./packageParser.js";
import { isScannableSourceFile, scanSourceFilesForDependencies } from "./sourceScanner.js";
import { evaluateRules } from "./ruleEngine.js";
import { calculateScore } from "./scoring.js";

/**
 * Analyzes a ZIP archive in the browser.
 * 
 * Reports step-by-step progress via `onProgress(stepIndex, totalSteps, message)`.
 */
export async function analyzeZipProject(fileOrBlob, onProgress = () => {}) {
  try {
    onProgress(1, 5, "Reading ZIP archive...");
    const zip = new JSZip();
    const loadedZip = await zip.loadAsync(fileOrBlob);

    onProgress(2, 5, "Searching for package.json...");
    // Find all package.json files (favor top-level root package.json if present)
    const packageFiles = [];
    loadedZip.forEach((relativePath, zipEntry) => {
      if (!zipEntry.dir && (relativePath === "package.json" || relativePath.endsWith("/package.json"))) {
        if (!relativePath.includes("node_modules/")) {
          packageFiles.push({ relativePath, zipEntry });
        }
      }
    });

    if (packageFiles.length === 0) {
      return {
        success: false,
        error: "We couldn't find a package.json file inside the uploaded ZIP archive. Please ensure your project root or subfolder contains package.json."
      };
    }

    // Pick the shallowest package.json
    packageFiles.sort((a, b) => a.relativePath.split("/").length - b.relativePath.split("/").length);
    const chosenPkgEntry = packageFiles[0];

    const packageJsonContent = await chosenPkgEntry.zipEntry.async("string");
    const parsedPkg = parsePackageJson(packageJsonContent);

    if (parsedPkg.error) {
      return {
        success: false,
        error: `Could not parse ${chosenPkgEntry.relativePath}: ${parsedPkg.error}`
      };
    }

    onProgress(3, 5, "Extracting and reading source files...");
    const sourceFiles = [];
    const entriesToRead = [];

    loadedZip.forEach((relativePath, zipEntry) => {
      if (!zipEntry.dir && isScannableSourceFile(relativePath)) {
        entriesToRead.push({ relativePath, zipEntry });
      }
    });

    // Read all source file contents asynchronously
    for (const item of entriesToRead) {
      try {
        const text = await item.zipEntry.async("string");
        sourceFiles.push({
          path: item.relativePath,
          content: text
        });
      } catch (readErr) {
        console.warn(`Could not read file ${item.relativePath}`, readErr);
      }
    }

    onProgress(4, 5, `Detecting imports across ${sourceFiles.length} source file(s)...`);
    const scannedDependencies = scanSourceFilesForDependencies(sourceFiles, parsedPkg.items);

    onProgress(5, 5, "Evaluating rules and calculating Diet Score...");
    const evaluatedDependencies = evaluateRules(scannedDependencies, true);
    const scoreData = calculateScore(evaluatedDependencies);

    return {
      success: true,
      projectName: parsedPkg.projectName,
      projectVersion: parsedPkg.projectVersion,
      scannedFilesCount: sourceFiles.length,
      scannedFilePaths: sourceFiles.map((f) => f.path),
      packageJsonPath: chosenPkgEntry.relativePath,
      dependencies: evaluatedDependencies,
      scoreData,
      isZip: true
    };
  } catch (err) {
    return {
      success: false,
      error: `Failed to analyze ZIP archive: ${err.message || "Unknown error occurred"}`
    };
  }
}

/**
 * Analyzes standalone package.json content (when user uploads only package.json).
 */
export function analyzePackageJsonDirect(jsonString) {
  const parsed = parsePackageJson(jsonString);
  if (parsed.error) {
    return {
      success: false,
      error: parsed.error
    };
  }

  const evaluatedDependencies = evaluateRules(parsed.items, false);
  const scoreData = calculateScore(evaluatedDependencies);

  return {
    success: true,
    projectName: parsed.projectName,
    projectVersion: parsed.projectVersion,
    scannedFilesCount: 0,
    scannedFilePaths: [],
    packageJsonPath: "package.json",
    dependencies: evaluatedDependencies,
    scoreData,
    isZip: false,
    warning: parsed.warning || "Analyzed package.json without source code. Unused dependencies cannot be checked without source files."
  };
}
