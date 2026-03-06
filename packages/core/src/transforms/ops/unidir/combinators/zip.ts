import { Focus, fromFocus, Optic } from '../../../compose'
import { Flags, HasFlag } from '../../../compose/flags'
import { HasSameSync } from '../monadic/_hasSameSync'
import { zipper } from './_zipper'

// TODO: handle sync (runtime)
// TODO: we might want to invert 1 and 2 everywhere

export function zip<T1, S, E1, G1, F1 extends Flags & { UNIQUE: false }, T0>(
	f1:
		| Focus<T1, S, E1, G1, HasFlag<'READ', F1>>
		| Optic<T1, S, E1, G1, HasFlag<'READ', F1>>,
) {
	return function <E0, G0, F0 extends { UNIQUE: false }>(
		o2: Optic<T0, S, E0, G0, HasFlag<'READ', HasSameSync<F0, F1>>>,
	): Optic<
		[T0, T1],
		S,
		E0 | E1,
		G0 | G1,
		(F1['SYNC'] extends false ? { SYNC: false } : {}) & {
			CONSTRUCT: false
			UNIQUE: false
			WRITE: false
		}
	> {
		const o1 = fromFocus(f1)
		return {
			emitter: (source, next, e, c) => {
				const {
					complete0: complete2,
					complete1,
					next0: next2,
					next1,
				} = zipper(next, c)

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
