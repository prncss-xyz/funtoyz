import { Optic } from '../../compose'
import { flatEmit_ } from '../../compose/_composeEmit'
import { Flags } from '../../compose/_flags'
import { HasSameSync } from './_hasSameSync'

export function flatMap<A, T, E1, G1, F1 extends Flags>(
	f: (a: A) => Optic<T, any, E1, G1, F1>,
) {
	return function <S, E2, G2, F2 extends Flags>(
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
			emit: o.emit
				? flatEmit_(o.emit, (a, s, n, e, c) => f(a).emit!(s, n, e, c))
				: undefined,
			flags: {
				CONSTRUCT: false,
				SYNC: o.flags.SYNC,
				UNIQUE: false,
				WRITE: false,
			} as never,
			nothing: o.nothing,
		}
	}
}
