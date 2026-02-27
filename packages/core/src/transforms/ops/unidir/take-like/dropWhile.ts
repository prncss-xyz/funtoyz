import { Optic } from '../../../compose'
import { HasFlag } from '../../../compose/flags'

export function dropWhile<T>(cond: (value: T) => unknown) {
	return function <S, E, G, F extends { UNIQUE: false }>(
		o: Optic<T, S, E, G, HasFlag<'READ', F>>,
	): Optic<T, S, E, G, F> {
		return {
			...o,
			emitter: (source, next, e, c) => {
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
			},
		}
	}
}
