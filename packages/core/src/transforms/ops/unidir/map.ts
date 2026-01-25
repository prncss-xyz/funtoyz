import { _compo } from '../../compose'

export function map<A, B>(fn: (w: A) => B) {
	return _compo<
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
