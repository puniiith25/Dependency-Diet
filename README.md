# Dependency Diet 📦

> **Trim the fat from your JavaScript & TypeScript projects.**  
> A fast, 100% client-side developer utility to identify unused, redundant, misplaced, or optimizable dependencies in your `package.json` or project codebase.

---

## ✨ Features

- ⚡ **100% Client-Side & Private**: All scanning, JSON parsing, and ZIP extraction happens purely in your browser memory. Your source code is never sent to any server.
- 📦 **Dual Upload Modes**:
  - **`package.json` Upload**: Instant check for package classification (e.g. dev tools placed in regular dependencies) and known lighter/native alternatives.
  - **`.zip` Project Archive**: Full source code scanning across `.js`, `.jsx`, `.ts`, `.tsx`, `.mjs`, and `.cjs` files to detect exact import & `require()` statements.
- 🎯 **Accurate Usage Detection**:
  - Identifies `import ... from 'pkg'`, `require('pkg')`, `import('pkg')`, subpaths (`pkg/subpath`), and scoped packages (`@scope/pkg`).
  - Strict matching avoids partial name collisions (e.g. `react-query` is not confused with `react`).
- 💡 **Diet Categories**:
  - 🟢 **Keep**: Actively used and properly placed.
  - 🔴 **Possibly Unused**: Zero matching imports detected in scanned source code.
  - 🟡 **Review**: Lighter or native alternatives exist (e.g. `axios` -> `fetch`, `uuid` -> `crypto.randomUUID`, `moment` -> `Intl / date-fns`).
  - 🟣 **Move**: Tooling/build dependencies (e.g. `eslint`, `prettier`, `vite`, `typescript`) placed inside `dependencies` instead of `devDependencies`.
  - 🔵 **Optimize**: Libraries with modular/subpath optimization suggestions (e.g. `lodash`).
- 📊 **Dependency Diet Score (0–100)**: Heuristic scoring with health tiers (*Very Healthy*, *Pretty Healthy*, *Needs Attention*, *Needs a Diet*).
- 🔍 **Interactive Dashboard**: Search, status & type filters, column sorting, deep-dive modal with file-by-file code reference locations.
- 📄 **Exportable Plain-Text Report**: One-click download of a clean `.txt` summary for team reviews.
- 🚀 **1-Click Demo Projects**: Built-in sample codebase & sample `package.json` to test instantly without needing to prepare files.

---

## 🛠️ Tech Stack

- **React 19**
- **Vite 8**
- **Tailwind CSS 4**
- **Lucide React** (Icons)
- **JSZip** (In-browser ZIP decompression)

---

## 🔒 Privacy & Security

**Your source code never leaves your browser.**  
Dependency Diet does not execute any uploaded scripts (no `eval()` or dynamic execution). All files are read strictly as static text strings, filtered against ignored directories (`node_modules`, `.git`, `dist`, `build`, etc.), and scanned in-memory.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm or yarn

### Installation

```bash
# Clone or navigate to the repository directory
cd "Dependency Diet"

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📖 How It Works

```
User uploads ZIP / package.json
            │
            ▼
Extract ZIP in-browser (JSZip)
            │
            ▼
Parse package.json (dependencies, devDependencies, etc.)
            │
            ▼
Filter & read source code (.js, .jsx, .ts, .tsx, .mjs, .cjs)
(Ignores node_modules, dist, .git, build, cache)
            │
            ▼
Regex & pattern import detection (detectPackageUsage)
            │
            ▼
Rule evaluation & alternative suggestions
            │
            ▼
Calculate Dependency Diet Score (0–100)
            │
            ▼
Render interactive React dashboard & downloadable report
```

---

## ⚠️ Limitations & Best Practices

- **Static analysis is heuristic**: Dynamic imports with computed strings (e.g., `import(`./plugins/${name}`)`) or tools configured via CLI flags without direct source imports may not be detected.
- Always run your test suite and verify build output before deleting any package flagged as *Possibly Unused*.
