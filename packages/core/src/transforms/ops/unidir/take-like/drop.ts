import { Optic } from '../../../compose'
import { Flags } from '../../../compose/_flags'

export function drop(n: number) {
	return function <T, S, E, G, F extends Flags>(
		o: Optic<T, S, E, G, F>,
	): Optic<T, S, E, G, F> {
		return {
			...o,
			emitter: o.emitter
				? (source, next, e, c) => {
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
					}
				: undefined,
		}
	}
}
