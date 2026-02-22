import { Optic } from '../../../compose'
import { Flags, HasFlag } from '../../../compose/_flags'
import { Emitter } from '../../../compose/_methods'

type EmitterResult = ReturnType<Emitter<any, any, any>>

export function concat<T1, S, E1, G1, F1 extends Flags & { UNIQUE: false }>(
	o1: Optic<T1, S, E1, G1, HasFlag<'READ', F1>>,
) {
	return function <T2, E2, G2, F2 extends { UNIQUE: false }>(
		o2: Optic<T2, S, E2, G2, HasFlag<'READ', F2>>,
	): Optic<
		T1 | T2,
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
				next: (value: T1 | T2) => void,
				e: (error: E1 | E2) => void,
				c: () => void,
			) => {
				let result1: EmitterResult
				let result2: EmitterResult | undefined

				result1 = o2.emitter!(source, next, e, () => {
					// When first completes, start second
					if (o1.emitter) {
						result2 = o1.emitter(source, next, e, c)
						result2?.start?.()
					} else {
						c()
					}
				})

				return {
					abort: () => {
						result1?.abort?.()
						result2?.abort?.()
					},
					start: () => {
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
			nothing: o1.nothing,
		}
	}
}
