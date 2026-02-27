import { Optic } from '../../../compose'
import { HasFlag } from '../../../compose/flags'

export function drop(n: number) {
	return function <T, S, E, G, F extends { UNIQUE: false }>(
		o: Optic<T, S, E, G, HasFlag<'READ', F>>,
	): Optic<T, S, E, G, F> {
		return {
			...o,
			emitter: (source, next, e, c) => {
				let i = 0
				return o.emitter!(
					source,
					(s) => {
						if (i >= n) next(s)
						i++
					},
					e,
					c,
				)
			},
		}
	}
}
