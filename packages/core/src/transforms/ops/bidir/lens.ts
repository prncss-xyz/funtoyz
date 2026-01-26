// MAYBE: optimize for get === id or set === id

import { compo_ } from '../../compose_'
import { Modifier } from '../../types'

export function lens<Part, Whole>({
	get,
	modifier,
	remove,
	set,
}: {
	get: (w: Whole) => Part
	modifier?: Modifier<Part, Whole>
	remove?: (w: Whole) => Whole
	set: (p: Part, w: Whole) => Whole
}) {
	return compo_<Part, Whole, never, never, { optional: true }>({
		getter: (w, next) => next(get(w)),
		modifier,
		remover: remove ? (s, next) => next(remove(s)) : undefined,
		setter: (p, next, w) => next(set(p, w)),
	})
}
