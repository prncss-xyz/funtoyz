# TODO

## Prelude

Possibly add a map method to tags.

Figure out unique symbol issue.

## Machines

Sum, Slice, Map. Higher-order machines (undo-redo etc., see x-state)

## Transforms

Errors should always be tags.

`discard` optic (negative `when`), mostly useful with type guards. (then remove negate)

Import all folds.

Exclude `packages/core/src/transforms/compose.ts` from exports.

Add relation utils.

On error, should `collect` return an empty array or emit an error (will depend on the use case, needs to be clarified)?

Validation:

- change in protocol: close must be called after error

It would be great to unify sync and async extractors, however, this would require to wrap source in an object with a field indicating if the source is async.

Improve resolve optic. Possibly enhance using indexation utils.

Do notation.

Logic (microkanren)
