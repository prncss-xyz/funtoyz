import { fromInit } from '../../../../functions/arguments'
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
	return compose<Whole, Part, EG, EG, { EXISTS: false }>({
		emitter: (e) => (s, next, err, complete) =>
			e(
				s,
				(s) =>
					match(get(s), {
						failure: err,
						success: next,
					}),
				err,
				complete,
			),
		flags: { EXISTS: false },
		getter: (w, next, error) =>
			match(get(w), { failure: (e) => error(fromInit(e, w)), success: next }),
		modifier: (m, next, t) =>
			match(get(t), {
				failure: () => next(t),
				success: (res) => m(res, (s) => next(set(s))),
			}),
		remover: (w, next) =>
			match(get(w), { failure: noop, success: () => next(w) }),
		reviewer: (p, next) => next(set(p)),
		setter: (p, next) => next(set(p)),
	})
}
