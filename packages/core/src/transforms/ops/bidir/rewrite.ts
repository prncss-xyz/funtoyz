import { compo_, trush } from '../../compose_'

export function rewrite<Whole>(set: (next: Whole, last: Whole) => Whole) {
	return compo_<Whole, Whole, never, never, { optional: true }>({
		getter: trush,
		setter: (p, next, w) => next(set(p, w)),
	})
}
