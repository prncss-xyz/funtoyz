import { NonEmptyArray } from '../../../../types'
import { Optic } from '../../../compose'
import { HasFlag } from '../../../compose/_flags'

export function slices<T>(n: number) {
	return function <S, E, G, F extends { UNIQUE: false }>(
		o: Optic<T, S, E, G, HasFlag<'READ', F>>,
	): Optic<NonEmptyArray<T>, S, E, G, F> {
		return {
			emitter: (source, next, e, c) => {
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
			},
			flags: o.flags,
			nothing: o.nothing,
		}
	}
}
