import { fromInit, Init } from '../../../../functions/arguments'
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
	return compose<Whole, Part, never, EG, { CONSTRUCT: false; EXISTS: false }>({
		flags: { CONSTRUCT: false, EXISTS: false },
		getter: (w, next, error) => {
			const res = get(w)
			if (res == undefined) return error(fromInit(err))
			return next(res)
		},
		remover: remove ? (s, next) => next(remove(s)) : undefined,
		setter: (p, next, w) => next(set(p, w)),
	})
}
