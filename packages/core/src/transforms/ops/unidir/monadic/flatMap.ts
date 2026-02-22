import { Optic } from '../../../compose'
import { flatEmitter_ } from '../../../compose/_composeEmitter'
import { Flags } from '../../../compose/_flags'
import { HasSameSync } from './_hasSameSync'

export function flatMap<A, T, E1, G1, F1 extends Flags & { UNIQUE: false }>(
	f: (a: A) => Optic<T, any, E1, G1, F1>,
) {
	return function <S, E2, G2, F2 extends Flags & { UNIQUE: false }>(
		o: Optic<A, S, E2, G2, HasSameSync<F2, F1>>,
	): Optic<
		T,
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
			emitter: flatEmitter_(o.emitter!, (a, s, n, e, c) =>
				f(a).emitter!(s, n, e, c),
			),
			flags: {
				CONSTRUCT: false,
				SYNC: o.flags.SYNC as never,
				UNIQUE: false,
				WRITE: false,
			},
			nothing: o.nothing,
		}
	}
}
