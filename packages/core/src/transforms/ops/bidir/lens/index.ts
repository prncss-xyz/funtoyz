import { compose } from '../../../compose'

export function lens<Part, Whole>({
	get,
	set,
}: {
	get: (w: Whole) => Part
	set: (p: Part, w: Whole) => Whole
}) {
	return compose<Whole, Part, never, never, { CONSTRUCT: false }>({
		flags: { CONSTRUCT: false },
		getter: (w, next) => next(get(w)),
		setter: (p, next, w) => next(set(p, w)),
	})
}
