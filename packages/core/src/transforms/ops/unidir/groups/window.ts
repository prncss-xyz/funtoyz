import { NonEmptyArray } from '../../../../types'
import { Optic } from '../../../compose'
import { HasFlag } from '../../../compose/flags'

export function window<T>(n: number) {
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
							acc = acc.slice(1)
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
