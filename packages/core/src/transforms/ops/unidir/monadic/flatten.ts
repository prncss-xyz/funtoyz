import { Optic } from '../../../compose'
import { flatEmitter_ } from '../../../compose/_composeEmitter'
import { Flags } from '../../../compose/_flags'
import { HasSameSync } from './_hasSameSync'

export function flatten() {
	function res<T, S, E1, G1, E2, G2, F1 extends Flags, F2 extends Flags>(
		o: Optic<Optic<T, S, E1, G1, HasSameSync<F2, F1>>, S, E2, G2, F1>,
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
			emitter: o.emitter
				? flatEmitter_(o.emitter, (inner, s, n, e, c) =>
						inner.emitter!(s, n, e, c),
					)
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
	return res
}
