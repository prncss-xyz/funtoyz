import { nothing, Nothing } from '../../../tags/results'
import { compo_ } from '../../compose_'
import { Modifier } from '../../types'

export function removableOpt<Part, Whole, EG = Nothing>({
	error,
	get,
	modifier,
	remove,
	set,
}: {
	error?: EG
	get: (w: Whole) => Part | undefined
	modifier?: Modifier<Part, Whole>
	remove: (w: Whole) => Whole
	set: (p: Part, w: Whole) => Whole
}) {
	return compo_<
		Part,
		Whole,
		EG,
		never,
		{ optional: true },
		{ removable: true }
	>({
		getter: (w, next, err) => {
			const res = get(w)
			if (res === undefined) return err(error ?? (nothing() as EG))
			return next(res)
		},
		modifier,
		remover: (s, next) => next(remove(s)),
		setter: (p, next, w) => next(set(p, w)),
	})
}
