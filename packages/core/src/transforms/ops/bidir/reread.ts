import { compo_, trush } from '../../compose_'

export function reread<Whole>(over: (w: Whole) => Whole) {
	return compo_<Whole, Whole, never, never, { optional: true }>({
		getter: (w, next) => next(over(w)),
		setter: trush,
	})
}
