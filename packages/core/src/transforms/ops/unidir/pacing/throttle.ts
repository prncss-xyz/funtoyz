import { Optic } from '../../../compose'
import { HasFlag } from '../../../compose/flags'

export function throttle(delay: number) {
	return function <T, S, E, G, F extends { SYNC: false; UNIQUE: false }>(
		o: Optic<T, S, E, G, HasFlag<'READ', F>>,
	): Optic<T, S, E, G, F> {
		return {
			...o,
			emitter: (source, next, error, complete) => {
				let last = 0
				return o.emitter!(
					source,
					(value) => {
						const now = Date.now()
						if (now - last > delay) {
							last = now
							next(value)
						}
					},
					error,
					complete,
				)
			},
		}
	}
}
