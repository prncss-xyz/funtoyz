import { Optic } from '../../../compose'
import { HasFlag } from '../../../compose/flags'

export function takeWhile<T>(cond: (value: T) => unknown) {
	return function <S, E, G, F extends { UNIQUE: false }>(
		o: Optic<T, S, E, G, HasFlag<'READ', F>>,
	): Optic<T, S, E, G, F> {
		return {
			...o,
			emitter: (source, next, e, c) => {
				return o.emitter!(
					source,
					(s) => {
						if (cond(s)) next(s)
						else c()
					},
					e,
					c,
				)
			},
		}
	}
}
