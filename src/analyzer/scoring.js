/**
 * Calculates a 0-100 Dependency Diet Score and health category.
 * 
 * Heuristic:
 * Base: 100
 * - Possibly Unused: -10 each
 * - Review (Alternative/Legacy): -5 each
 * - Move (Classification mismatch): -3 each
 * - Optimize (Subpath/modular): -3 each
 * 
 * Clamped between 0 and 100.
 */

export function calculateScore(dependencies) {
  if (!dependencies || dependencies.length === 0) {
    return {
      score: 100,
      rating: "Very Healthy",
      color: "emerald",
      breakdown: {
        total: 0,
        dependencyCount: 0,
        devCount: 0,
        peerCount: 0,
        optionalCount: 0,
        unusedCount: 0,
        reviewCount: 0,
        moveCount: 0,
        optimizeCount: 0,
        healthyCount: 0
      }
    };
  }

  let unusedCount = 0;
  let reviewCount = 0;
  let moveCount = 0;
  let optimizeCount = 0;
  let healthyCount = 0;
  let dependencyCount = 0;
  let devCount = 0;
  let peerCount = 0;
  let optionalCount = 0;

  for (const dep of dependencies) {
    if (dep.type === "dev") devCount++;
    else if (dep.type === "peer") peerCount++;
    else if (dep.type === "optional") optionalCount++;
    else dependencyCount++;

    if (dep.status === "unused") unusedCount++;
    else if (dep.status === "review") reviewCount++;
    else if (dep.status === "move") moveCount++;
    else if (dep.status === "optimize") optimizeCount++;
    else healthyCount++;
  }

  const deductions =
    unusedCount * 10 +
    reviewCount * 5 +
    moveCount * 3 +
    optimizeCount * 3;

  const rawScore = 100 - deductions;
  const score = Math.max(0, Math.min(100, rawScore));

  let rating = "Very Healthy";
  let color = "emerald"; // emerald | teal | amber | rose

  if (score >= 90) {
    rating = "Very Healthy";
    color = "emerald";
  } else if (score >= 75) {
    rating = "Pretty Healthy";
    color = "teal";
  } else if (score >= 50) {
    rating = "Needs Attention";
    color = "amber";
  } else {
    rating = "Needs a Diet";
    color = "rose";
  }

  return {
    score,
    rating,
    color,
    deductions,
    breakdown: {
      total: dependencies.length,
      dependencyCount,
      devCount,
      peerCount,
      optionalCount,
      unusedCount,
      reviewCount,
      moveCount,
      optimizeCount,
      healthyCount
    }
  };
}
