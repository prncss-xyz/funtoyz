import { compo_ } from '../../compose_'

export function map<A, B>(fn: (w: A) => B) {
	return compo_<
		B,
		A,
		never,
		never,
		{
			getter: true
			optional: true
			traversable: true
		}
	>({
		getter: (w, next) => next(fn(w)),
	})
}
