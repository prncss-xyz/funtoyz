# Agent Instructions for Funtoyz Repo

This repository is a TypeScript monorepo using **pnpm** workspaces and **TurboRepo**.
It contains a website application (using **Waku** and **React 19**) and core packages.

## 1. Build, Lint, and Test Commands

**Package Manager:** Always use `pnpm`.

### Testing

- **Run all tests:** `pnpm -r check:tests` (runs `vitest` with coverage)
- **Run tests in watch mode:** `pnpm dev:tests`
- **Run a single test file:**
  ```bash
  pnpm vitest run packages/core/src/path/to/file.test.ts
  ```
- **Test Framework:** Vitest.

### Linting & Formatting

- **Check code quality:** `pnpm lint:eslint`
- **Check formatting:** `pnpm lint:style` (Prettier)
- **Fix lint issues:** `pnpm fix:eslint`
- **Fix formatting:** `pnpm fix:prettier`

## 2. Code Style & Guidelines

### General

- **Language:** TypeScript (ESM, `type: "module"` in package.json).
- **Frameworks:**
  - **Core:** `tsdown` for bundling libraries.
- **Structure:**
  - `apps/website`: The main website application.
  - `packages/core`: Core logic/utilities.
  - `packages/config`: Shared configurations.

### Code Conventions (Enforced by ESLint/Prettier)

- **Sorting:** Imports, exports, object keys, and types, are **strictly sorted** naturally.
  - _Plugin:_ `eslint-plugin-perfectionist`.
  - _Action:_ Run `pnpm fix:eslint` if you are unsure about sorting.
- **Imports:** Use named imports where possible.
- **Formatting:** Prettier handles all formatting (indentation, quotes, semicolons).
  - _Action:_ Run `pnpm fix:prettier` on changed files.
- **Tests**:
  - Write as few tests as necessary.
  - Vitest methods are part of the global scope, never import them.

### TypeScript Rules

- **Strictness:** High. Avoid `any`.
- **Erasable syntax only**: Never use enums, or parameter properties in classes.
- **Unused Variables:** Must be prefixed with `_` (e.g., `_req`, `_unused`) or they will trigger a warning.
- **No Explicit Any:** `off` (per config), but usage is discouraged unless necessary.

### Error Handling

- `no-else-return`: Avoid `else` after a `return`.
- `no-console`: Warning. Use a logger or remove console logs before committing.

### Maintenance Tools

- **Knip:** `pnpm knip` checks for unused files and dependencies.
- **Sherif:** `pnpm sherif` checks for monorepo health (e.g. mismatched versions).

## 3. Workflow for Agents

1. **Analyze:** Read existing code to match style.
2. **Edit:** Apply changes.
3. **Format/Fix:** ALWAYS run `pnpm fix:prettier` and `pnpm fix:eslint` on modified files.
4. **Verify:** Run relevant tests (or create new ones) using `pnpm vitest run ...`.
