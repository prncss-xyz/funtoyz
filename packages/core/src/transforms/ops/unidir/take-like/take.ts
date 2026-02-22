import { Optic } from '../../../compose'
import { HasFlag } from '../../../compose/_flags'
import { none } from '../../../sources/sync/none'

export function take(n: number) {
	return function <T, S, E, G, F extends { UNIQUE: false }>(
		o: Optic<T, S, E, G, HasFlag<'READ', F>>,
	): Optic<T, S, E, G, F> {
		if (n === 0) return none() as never
		return {
			...o,
			emitter: (source, next, e, c) => {
				let i = 0
				return o.emitter!(
					source,
					(s) => {
						next(s)
						if (++i === n) c()
					},
					e,
					c,
				)
			},
		}
	}
}
