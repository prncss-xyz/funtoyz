import { NonEmptyArray } from '../../../../types'
import { Optic } from '../../../compose'
import { Flags } from '../../../compose/_flags'

export function slices<T>(n: number) {
	return function <S, E, G, F extends Flags>(
		o: Optic<T, S, E, G, F>,
	): Optic<NonEmptyArray<T>, S, E, G, F> {
		return {
			...o,
			emitter: o.emitter
				? (source, next, e, c) => {
						let acc: T[] = []
						return o.emitter!(
							source,
							(value) => {
								acc.push(value)
								if (acc.length === n) {
									next(acc as NonEmptyArray<T>)
									acc = []
								}
							},
							e,
							c,
						)
					}
				: undefined,
		} as Optic<NonEmptyArray<T>, S, E, G, F>
	}
}
