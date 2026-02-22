import { Optic } from '../../../compose'
import { HasFlag } from '../../../compose/_flags'

export function ap<T, Bs extends any[]>(
	...fns: { [K in keyof Bs]: (value: T) => Bs[K] }
) {
	return function <S, E, G, F extends { UNIQUE: false }>(
		o: Optic<T, S, E, G, HasFlag<'READ', F>>,
	): Optic<Bs[number], S, E, G, F> {
		return {
			emitter: (source, next, e, c) => {
				return o.emitter!(
					source,
					(value) => {
						fns.forEach((fn) => next(fn(value)))
					},
					e,
					c,
				)
			},
			flags: o.flags,
			nothing: o.nothing,
		}
	}
}
