import { Optic } from '../../../compose'
import { Flags } from '../../../compose/_flags'

export function dropWhile<T>(cond: (value: T) => unknown) {
	return function <S, E, G, F extends Flags>(
		o: Optic<T, S, E, G, F>,
	): Optic<T, S, E, G, F> {
		return {
			...o,
			emitter: o.emitter
				? (source, next, e, c) => {
						let closed: unknown = true
						return o.emitter!(
							source,
							(s) => {
								if (!closed) next(s)
								closed = closed && cond(s)
							},
							e,
							c,
						)
					}
				: undefined,
		}
	}
}
