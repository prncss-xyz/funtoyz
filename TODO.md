# TODO

## Prelude

Possibly add a map method to tags.

Figure out unique symbol issue.

## Machines

Sum, Slice, Map. Higher-order machines (undo-redo etc., see xstate)

## Transforms

Replace 'empty' with Nothing

Import all folds.

Exclude `packages/core/src/transforms/compose.ts` from exports.

Add relation utils.

On error, should `collect` return an empty array or emit an error (will depend on the use case, needs to be clarified).

Validation.

- change in protocol: close must be called after error

Errors should always be tags.

It would be great to unify sync and async extractors, however, this would require to wrap source in an object with a field indicating if the source is async.

Improve resolve. Possibly enhance using indexation utils.

Do notation.

Logic (microkanren)
