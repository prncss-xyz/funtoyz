import { forbidden } from '../../../../assertions'
import { compose } from '../../../compose'
import { trush } from '../../../compose/_methods'

export function lens<Part, Whole>({
	get,
	set,
}: {
	get: (w: Whole) => Part
	set: (p: Part, w: Whole) => Whole
}) {
	return compose<Whole, Part, never, never, { CONSTRUCT: false }>({
		emitter: (e) => (s, next, error, complete) =>
			e(s, (s) => next(get(s)), error, complete),
		flags: { CONSTRUCT: false },
		getter: (w, next) => next(get(w)),
		modifier: (m, next, t) => m(get(t), (s) => next(set(s, t))),
		remover: trush,
		reviewer: forbidden as never,
		setter: (p, next, w) => next(set(p, w)),
	})
}
