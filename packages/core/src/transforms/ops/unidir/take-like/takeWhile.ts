import { Optic } from '../../../compose'
import { Flags } from '../../../compose/_flags'

export function takeWhile<T>(cond: (value: T) => unknown) {
	return function <S, E, G, F extends Flags>(
		o: Optic<T, S, E, G, F>,
	): Optic<T, S, E, G, F> {
		return {
			...o,
			emitter: o.emitter
				? (source, next, e, c) => {
						return o.emitter!(
							source,
							(s) => {
								if (cond(s)) next(s)
								else c()
							},
							e,
							c,
						)
					}
				: undefined,
		}
	}
}
