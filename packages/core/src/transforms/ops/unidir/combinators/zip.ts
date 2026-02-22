import { Optic } from '../../../compose'
import { Flags, HasFlag } from '../../../compose/_flags'
import { zipper } from './_utils'

// TODO: handle sync (runtime)
// TODO: we might want to invert 1 and 2 everywhere

export function zip<T1, S, E1, G1, F1 extends Flags & { UNIQUE: false }, V, T2>(
	o1: Optic<T1, S, E1, G1, HasFlag<'READ', F1>>,
	merge: (v2: T2, v1: T1) => V,
) {
	return function <E2, G2, F2 extends { UNIQUE: false }>(
		o2: Optic<T2, S, E2, G2, HasFlag<'READ', F2>>,
	): Optic<
		V,
		S,
		E1 | E2,
		G1 | G2,
		(F1['SYNC'] extends false ? { SYNC: false } : object) & {
			CONSTRUCT: false
			UNIQUE: false
			WRITE: false
		}
	> {
		return {
			emitter: (
				source: S,
				next: (value: V) => void,
				e: (error: E1 | E2) => void,
				c: () => void,
			) => {
				const { complete1, complete2, next1, next2 } = zipper(merge, next, c)

				const result2 = o2.emitter!(source, next2, e, complete2)
				const result1 = o1.emitter!(source, next1, e, complete1)

				return {
					abort: () => {
						result2?.abort?.()
						result1?.abort?.()
					},
					start: () => {
						result2?.start?.()
						result1?.start?.()
					},
				}
			},
			flags: {
				CONSTRUCT: false,
				SYNC: o1.flags.SYNC as never,
				UNIQUE: false,
				WRITE: false,
			},
			nothing: o2.nothing,
		}
	}
}
