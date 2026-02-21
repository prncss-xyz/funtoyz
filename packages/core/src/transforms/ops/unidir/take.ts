import { Nothing } from '../../../tags/results'
import { Optic } from '../../compose'
import { Flags } from '../../compose/_flags'
import { none } from '../../sources/sync/none'

export function take(n: number) {
	return function <T, S, E, G, F extends Flags>(
		o: Optic<T, S, E, G, F>,
	): Optic<T, S, E, G | Nothing, F> {
		if (n === 0) return none() as never
		return {
			...o,
			emitter: o.emitter
				? (source, next, e, c) => {
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
					}
				: undefined,
		}
	}
}
