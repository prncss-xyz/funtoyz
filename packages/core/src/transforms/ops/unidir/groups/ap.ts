import { Optic } from '../../../compose'
import { Flags } from '../../../compose/_flags'

export function ap<T, Bs extends any[]>(
	...fns: { [K in keyof Bs]: (value: T) => Bs[K] }
) {
	return function <S, E, G, F extends Flags>(
		o: Optic<T, S, E, G, F>,
	): Optic<Bs[number], S, E, G, F> {
		return {
			...o,
			emitter: o.emitter
				? (source, next, e, c) => {
						return o.emitter!(
							source,
							(value) => {
								fns.forEach((fn) => next(fn(value)))
							},
							e,
							c,
						)
					}
				: undefined,
		} as Optic<Bs[number], S, E, G, F>
	}
}
