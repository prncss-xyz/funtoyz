# Agents

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

FunToyz is a TypeScript functional programming library providing composable optics, state machines, discriminated unions (tags), and function utilities. It is structured as a pnpm monorepo with Turborepo orchestration.

## Commands

- `pnpm run verify` — full verification (lint + types + tests)
- `pnpm run check:tests` — run all tests with coverage (vitest)
- `pnpm run dev:tests` — watch mode tests
- `pnpm vitest run packages/core/src/tags/match.test.ts` — run a single test file
- `pnpm run lint` — eslint + prettier checks
- `pnpm run lint:eslint` — eslint only (zero warnings policy)
- `pnpm run lint:style` — prettier only
- `pnpm run fix:prettier` — auto-fix formatting
- `pnpm run fix:eslint` — auto-fix lint issues
- `pnpm run knip` — find unused files/exports
- `pnpm run sherif` — check dependency consistency

## Monorepo Layout

- `packages/core/` — main library (`@funtoyz/core`), all source and tests in `src/`
- `packages/config/` — shared eslint, prettier, and vitest configs (`@funtoyz/config`)
- `apps/demo/` — React + Vite demo app showcasing machines with `useMachine` hook

Build pipeline (turbo.json): `build` → `check:types` / `check:tests` → `check` → `pre-commit` → `verify`. Lint runs independently.

## Architecture

### Optics (transforms/)

The core abstraction is `Optic<T, S, E, G, F>` — a composable lens-like structure with:

- **T** (target/inner type), **S** (source/outer type), **E** (error), **G** (nothing/fallback), **F** (capability flags)
- Methods: `getter`, `reviewer`, `modifier`, `setter`, `remover`, `emit` — each optional depending on optic kind
- `compose(o1)(o2)` composes two optics, intersecting capability flags

Optic hierarchy (bidirectional, in `ops/bidir/`):

- **Iso** — lossless bidirectional (get + review)
- **Lens** — focus on a part (prop, index, nth)
- **Prism** — conditional focus
- **Optional** — maybe-focus (at, prop, stack, queue)
- **Traversal** — multiple focuses (elems, chars)
- **Meta** — combinators (join, valueOr)

Unidirectional operations (`ops/unidir/`): map, fold, scan, take — these drop write capabilities.

Sources (`sources/`): sync (iter, once, none, loop, unfold, until) and async (periodic) — entry points that produce optics from data.

Extractors (`extractors/`): `view`, `preview`, `collect`, `review`, `update` — consume optics to get/set values.

CPS style: getters and setters use continuation-passing style (`next` callbacks) rather than direct returns. This enables composition without intermediate allocations.

### Tags (tags/)

Discriminated unions with `tag(name, payload)`, factory creation via `tags<Union>()('a', 'b')`, pattern matching via `match()`, and built-in `result` (success/failure).

### Machines (machines/)

State machines following `Machine<EventIn, State, Result, EventOut>` with `init` + `reduce` + optional `result`. Factories: `baseMachine`, `directMachine`, `modalMachine`, `steps`.

### Functions (functions/)

- `pipe(value, f1, f2, ...)` — left-to-right application (value-first, like Ramda)
- `flow(f1, f2, ...)` — left-to-right composition (returns function, like fp-ts)
- `curry` — auto-currying with type safety
- `Init<T>` — lazy initializer pattern (function or value), resolved with `fromInit`

## Conventions

- Tests are colocated: `foo.ts` has `foo.test.ts` in the same directory
- ESLint flat config with zero max-warnings; perfectionist plugin enforces natural sorting of imports/object keys
- Conventional commits enforced via commitlint + husky
- `tsdown` for building, `tsc --noEmit` for type checking
- Vitest globals are enabled (no need to import `describe`/`it`/`expect`)
