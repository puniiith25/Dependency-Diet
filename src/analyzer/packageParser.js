/**
 * Safely parses package.json string and extracts dependency groups.
 */
export function parsePackageJson(jsonString) {
  if (!jsonString || typeof jsonString !== "string") {
    return { error: "No content provided in package.json." };
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    return {
      error: `Invalid package.json format: ${err.message}. Please verify standard JSON syntax.`
    };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return {
      error: "Invalid package.json structure. Expected a JSON object at root."
    };
  }

  const projectName = parsed.name || "unnamed-project";
  const projectVersion = parsed.version || "0.0.0";

  const dependencies = parsed.dependencies || {};
  const devDependencies = parsed.devDependencies || {};
  const peerDependencies = parsed.peerDependencies || {};
  const optionalDependencies = parsed.optionalDependencies || {};

  const allItems = [];

  const addGroup = (obj, type) => {
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
      for (const [name, version] of Object.entries(obj)) {
        if (typeof name === "string" && name.trim()) {
          allItems.push({
            name: name.trim(),
            version: String(version || "").trim(),
            type, // 'dependency' | 'dev' | 'peer' | 'optional'
            usageCount: 0,
            usedInFiles: [],
            status: "keep",
            findings: [],
            scanned: false
          });
        }
      }
    }
  };

  addGroup(dependencies, "dependency");
  addGroup(devDependencies, "dev");
  addGroup(peerDependencies, "peer");
  addGroup(optionalDependencies, "optional");

  if (allItems.length === 0) {
    return {
      projectName,
      projectVersion,
      items: [],
      warning: "No dependencies, devDependencies, peerDependencies, or optionalDependencies found in package.json."
    };
  }

  return {
    projectName,
    projectVersion,
    items: allItems,
    error: null
  };
}
