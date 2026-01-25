import { Result, result } from '../../../tags/results'
import { _compo } from '../../core/compose'

export function optional<Part, Whole, E>({
	get,
	set,
}: {
	get: (w: Whole) => Result<Part, E>
	set: (p: Part, w: Whole) => Whole
}) {
	return _compo<Part, Whole, E, never, { optional: true }>({
		getter: (w, next, err) => {
			const res = get(w)
			if (result.failure.is(res)) return err(result.failure.get(res))
			return next(result.success.get(res))
		},
		remover: (w, next) => result.failure.is(get(w)) && next(w),
		setter: (p, next, w) => next(set(p, w)),
	})
}
