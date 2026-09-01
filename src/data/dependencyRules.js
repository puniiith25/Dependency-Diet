/**
 * Curated database of dependency rules for the MVP.
 * Provides thoughtful, non-hyperbolic suggestions and alternatives.
 */

export const dependencyRules = {
  axios: {
    category: "HTTP Client",
    type: "review",
    alternative: "fetch",
    message: "Native globalThis.fetch() is built into all modern browsers and Node.js 18+. Consider whether axios interceptors/features are truly needed."
  },
  uuid: {
    category: "UUID Generator",
    type: "review",
    alternative: "crypto.randomUUID()",
    message: "crypto.randomUUID() is natively available in Node.js 15.6+ and all modern Web/Worker environments."
  },
  moment: {
    category: "Date Utility",
    type: "review",
    alternative: "Intl API / date-fns / dayjs",
    message: "Moment.js is a legacy project in maintenance mode and is not tree-shakeable. Modern Intl API or date-fns offer lighter alternatives."
  },
  lodash: {
    category: "Utility",
    type: "optimize",
    alternative: "Native JS / lodash-es / specific imports",
    message: "Consider importing specific functions (e.g., 'lodash/debounce') or utilizing native ES6+ Array/Object methods to reduce bundle overhead."
  },
  underscore: {
    category: "Utility",
    type: "review",
    alternative: "Native ES6+ methods",
    message: "Most Underscore.js methods are now natively built into modern JavaScript engines (Array.prototype.map, filter, reduce, Object.entries)."
  },
  chalk: {
    category: "CLI Styling",
    type: "review",
    alternative: "node:util styleText / picocolors / colorette",
    message: "Node.js 20.12+ supports native util.styleText(). For smaller bundles, picocolors is also significantly lighter."
  },
  request: {
    category: "HTTP Client",
    type: "review",
    alternative: "fetch / undici",
    message: "The request library has been officially deprecated since 2020. Consider migrating to native fetch or undici."
  },
  querystring: {
    category: "URL Parsing",
    type: "review",
    alternative: "URLSearchParams",
    message: "The Node.js querystring module can usually be replaced with the standard URLSearchParams API."
  },
  rimraf: {
    category: "Filesystem",
    type: "review",
    alternative: "fs.rm(path, { recursive: true, force: true })",
    message: "Node.js 14.14+ natively supports recursive directory removal via fs.rm or fs.promises.rm."
  },
  mkdirp: {
    category: "Filesystem",
    type: "review",
    alternative: "fs.mkdir(path, { recursive: true })",
    message: "Node.js natively supports recursive directory creation via { recursive: true }."
  },
  "is-promise": {
    category: "Type Checking",
    type: "review",
    alternative: "typeof p?.then === 'function'",
    message: "Checking for thenable/Promise instances can be implemented with a simple one-line check without external dependencies."
  },
  "is-array": {
    category: "Type Checking",
    type: "review",
    alternative: "Array.isArray()",
    message: "Array.isArray() is standard in all ECMAScript 5+ environments."
  }
};

/**
 * Packages that should almost always live under `devDependencies` rather than `dependencies`.
 */
export const devOnlyPackages = new Set([
  "eslint",
  "prettier",
  "vitest",
  "jest",
  "mocha",
  "chai",
  "typescript",
  "vite",
  "webpack",
  "rollup",
  "esbuild",
  "ts-node",
  "nodemon",
  "concurrently",
  "husky",
  "lint-staged",
  "tailwindcss",
  "postcss",
  "autoprefixer",
  "@types/react",
  "@types/react-dom",
  "@types/node",
  "@babel/core",
  "@babel/preset-env",
  "@babel/preset-react",
  "@babel/preset-typescript",
  "@playwright/test",
  "cypress"
]);
