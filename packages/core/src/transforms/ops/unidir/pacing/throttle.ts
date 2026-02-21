import { Optic } from '../../../compose'

export function throttle(delay: number) {
	return function <T, S, E, G, F extends { SYNC: false }>(
		o: Optic<T, S, E, G, F>,
	): Optic<T, S, E, G, F> {
		return {
			...o,
			emitter: o.emitter
				? (source, next, error, complete) => {
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
					}
				: undefined,
		}
	}
}
