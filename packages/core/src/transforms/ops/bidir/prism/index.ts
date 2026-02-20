import { fromInit } from '../../../../functions/arguments/init'
import { noop } from '../../../../functions/basics'
import { match } from '../../../../tags/match'
import { Result } from '../../../../tags/results'
import { compose } from '../../../compose'

export function prism<Part, Whole, EG>({
	get,
	set,
}: {
	get: (w: Whole) => Result<Part, EG>
	set: (p: Part) => Whole
}) {
	return compose<Whole, Part, never, EG, object>({
		flags: { EXISTS: false },
		getter: (w, next, error) =>
			match(get(w), { failure: (e) => error(fromInit(e, w)), success: next }),
		remover: (w, next) =>
			match(get(w), { failure: () => next(w), success: noop }),
		reviewer: (p, next) => next(set(p)),
	})
}
