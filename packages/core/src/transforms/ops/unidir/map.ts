import { forbidden } from '../../../assertions'
import { compose } from '../../compose'
import { trush } from '../../compose/_methods'

export function map<A, B>(mapper: (w: A) => B) {
	return compose<A, B, never, never, { CONSTRUCT: false; WRITE: false }>({
		emitter: (e) => (s, next, error, complete) =>
			e(s, (s) => next(mapper(s)), error, complete),
		flags: { CONSTRUCT: false, WRITE: false },
		getter: (w, next) => next(mapper(w)),
		modifier: forbidden as never,
		remover: trush,
		reviewer: forbidden as never,
		setter: forbidden as never,
	})
}
