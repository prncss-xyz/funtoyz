# AGENTS

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FunToyz is a TypeScript functional programming library with React integration. It provides optics/transforms, state machines, discriminated unions (tags), and function composition utilities.

## Monorepo Structure

- **pnpm workspaces** + **TurboRepo** orchestration
- `packages/core` — main library (`@funtoyz/core`), built with `tsdown`
- `packages/config` — shared ESLint, TypeScript, Prettier configs
- `apps/demo` — React + Vite demo app

## Commands

```bash
# Development
pnpm dev              # Turbo watch all packages
pnpm dev:tests        # Vitest watch mode

# Testing
pnpm check:tests      # Run all tests with coverage
pnpm vitest run packages/core/src/path/to/file.test.ts  # Single test file

# Linting & Formatting (ALWAYS run after edits)
pnpm fix:eslint       # Auto-fix ESLint issues
pnpm fix:prettier     # Auto-format with Prettier

# Verification
pnpm verify           # Full lint + type check + tests
pnpm check:types      # Type checking only
pnpm knip             # Unused files/dependencies
pnpm sherif           # Monorepo health
```

## Code Conventions

- **ESM only** (`type: "module"` everywhere)
- **Erasable syntax only** — no enums, no parameter properties
- **Strict sorting** of imports, exports, object keys, types (eslint-plugin-perfectionist). Run `pnpm fix:eslint` if unsure
- **Unused variables** must be prefixed with `_`
- **Tests** are co-located (`*.test.ts` next to source). Vitest globals are available — never import `describe`, `it`, `expect`, etc.
- **Write as few tests as necessary**
- **Conventional Commits** enforced by commitlint (e.g. `fix:`, `feat:`, `refactor:`)

## Architecture

### Core Library Domains (`packages/core/src/`)

- **transforms/** — Optics framework (lenses, prisms, traversals, isomorphisms). Central type is `Optic<Focus, Whole, Error, Guard, Flags>`. Supports composable getters, setters, emitters, and reviewers. Includes sources (`iter`, `once`, `periodic`) and operations (`map`, `fold`, `scan`, `filter`, `take`)
- **machines/** — Functional state machines. `Machine<EventIn, State, Result, EventOut>` with `init`, `reduce`, and optional `result`. Factories: `base`, `direct`, `modal`
- **tags/** — Typed discriminated unions with `tag()` for construction, `tags()` for defining sets with `.of`, `.is`, `.get`, and pattern matching via `match`
- **functions/** — Composition (`pipe`, `flow`), currying (`curry2`, `curry2_1`), combinators, and primitives (`id`, `noop`)
- **objects/** — Collection utilities, shallow equality, merging, hashing
- **guards.ts / assertions.ts** — Type guards and assertion functions
- **brands.ts** — Branded type utilities
- **types.ts** — Utility types (`Prettify`, `Equals`, `UnionToIntersection`, etc.)

## Workflow

1. Read existing code to match style
2. Apply changes
3. Run `pnpm fix:prettier` and `pnpm fix:eslint` on modified files
4. Run relevant tests with `pnpm vitest run ...`
