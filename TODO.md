# TODO

## Prelude

On error, should collect return an empty array or emit an error (will depend on the use case, needs to be clarified).

Possibly add a map to tags.

Figure out unique symbol issue.

## Machines

Sum, Product, Map. Higher-order machines (undo-redo etc., see xstate)

## Transforms

Extend scan and fold to use with machines.

Exclude `packages/core/src/transforms/compose.ts` from exports.

It would be great to unify sync and async extractors, however, this would require to wrap source in an object with a field indicating if the source is async.

Add relation utils.

Improve resolve. Possibly enhance using indexation utils.

Do notation.

Logic (microkanren)
