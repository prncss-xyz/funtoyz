import { NonEmptyArray } from '../../../../types'
import { Optic } from '../../../compose'
import { Flags } from '../../../compose/_flags'

export function groupWith<T>(eq: (next: T, last: T) => unknown) {
	return function <S, E, G, F extends Flags>(
		o: Optic<T, S, E, G, F>,
	): Optic<NonEmptyArray<T>, S, E, G, F> {
		return {
			...o,
			emitter: o.emitter
				? (source, next, e, c) => {
						let last: T
						let acc: T[] = []
						return o.emitter!(
							source,
							(value) => {
								if (acc.length === 0) {
									acc.push(value)
								} else if (eq(value, last!)) {
									acc.push(value)
								} else {
									next(acc as NonEmptyArray<T>)
									acc = [value]
								}
								last = value
							},
							e,
							() => {
								if (acc.length > 0) next(acc as NonEmptyArray<T>)
								c()
							},
						)
					}
				: undefined,
		} as Optic<NonEmptyArray<T>, S, E, G, F>
	}
}
