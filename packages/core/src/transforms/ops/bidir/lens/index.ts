import { forbidden } from '../../../../assertions'
import { noop } from '../../../../functions/basics'
import { compose } from '../../../core'
import { Modifier } from '../../../methods'

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
	return compose<Whole, Part, never, never, { CONSTRUCT: false }>({
		emitter: (e) => (s, next, error, complete) =>
			e(s, (s) => next(get(s)), error, complete),
		flags: { CONSTRUCT: false },
		getter: (w, next) => next(get(w)),
		modifier: modifier
			? modifier
			: (m, next, t) => m(get(t), (s) => next(set(s, t))),
		remover: remove ? (s, next) => next(remove(s)) : noop,
		reviewer: forbidden as never,
		setter: (p, next, w) => next(set(p, w)),
	})
}
