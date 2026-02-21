import { compose } from '../../../compose'

export function map<A, B>(mapper: (w: A) => B) {
	return compose<A, B, never, never, { CONSTRUCT: false; WRITE: false }>({
		flags: { CONSTRUCT: false, WRITE: false },
		getter: (w, next) => next(mapper(w)),
	})
}
