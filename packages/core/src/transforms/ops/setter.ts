import { compose } from '../compose'

export function setter<Part, Whole>(set: (p: Part, w: Whole) => Whole) {
	return compose<
		Whole,
		Part,
		never,
		never,
		{
			CONSTRUCT: false
			READ: false
		}
	>({
		flags: { CONSTRUCT: false, READ: false },
		setter: (p, next, w) => next(set(p, w)),
	})
}
