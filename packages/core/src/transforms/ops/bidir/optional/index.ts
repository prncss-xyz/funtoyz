import { forbidden } from '../../../../assertions'
import { fromInit, Init } from '../../../../functions/arguments'
import { noop } from '../../../../functions/basics'
import { nothing, Nothing } from '../../../../tags/results'
import { compose } from '../../../compose'

export function optional<Part, Whole, EG = Nothing>({
	err = nothing as never,
	get,
	remove,
	set,
}: {
	err?: Init<EG>
	get: (w: Whole) => null | Part | undefined
	remove?: (w: Whole) => Whole
	set: (p: Part, w: Whole) => Whole
}) {
	return compose<Whole, Part, EG, EG, { CONSTRUCT: false; EXISTS: false }>({
		emitter: (e) => (s, next, error, complete) =>
			e(
				s,
				(s) => {
					const res = get(s)
					if (res == undefined) return
					return next(res)
				},
				error,
				complete,
			),
		flags: { CONSTRUCT: false, EXISTS: false },
		getter: (w, next, error) => {
			const res = get(w)
			if (res == undefined) return error(fromInit(err))
			return next(res)
		},
		modifier: (m, next, t) => {
			const res = get(t)
			if (res == undefined) return next(t)
			return m(res, (s) => next(set(s, t)))
		},
		nothing: () => fromInit(err),
		remover: remove ? (s, next) => next(remove(s)) : noop,
		reviewer: forbidden as never,
		setter: (p, next, w) => next(set(p, w)),
	})
}
