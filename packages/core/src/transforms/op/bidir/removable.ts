import { Result, result } from '../../../tags/results'
import { _compo } from '../../core/compose'

export function removable<Part, Whole, E>({
	get,
	remove,
	set,
}: {
	get: (w: Whole) => Result<Part, E>
	remove: (w: Whole) => Whole
	set: (p: Part, w: Whole) => Whole
}) {
	return _compo<Part, Whole, E, never, { optional: true }, { removable: true }>(
		{
			getter: (w, next, err) => {
				const res = get(w)
				if (result.failure.is(res)) return err(result.failure.get(res))
				return next(result.success.get(res))
			},
			remover: (s, next) => next(remove(s)),
			setter: (p, next, w) => next(set(p, w)),
		},
	)
}
