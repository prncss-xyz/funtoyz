import { Optic } from '../../../compose'
import { HasFlag } from '../../../compose/flags'

export function groupWith<T>(eq: (next: T, last: T) => unknown) {
	return function <S, E, G, F extends { UNIQUE: false }>(
		o: Optic<T, S, E, G, HasFlag<'READ', F>>,
	): Optic<T[], S, E, G, F> {
		return {
			emitter: (source, next, e, c) => {
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
							next(acc)
							acc = [value]
						}
						last = value
					},
					e,
					() => {
						if (acc.length > 0) next(acc)
						c()
					},
				)
			},
			flags: o.flags,
			nothing: o.nothing,
		}
	}
}
