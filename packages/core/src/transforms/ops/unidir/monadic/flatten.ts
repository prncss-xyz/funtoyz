import { isoAssert } from '../../../../assertions'
import { Optic } from '../../../compose'
import { flatEmitter_ } from '../../../compose/_composeEmitter'
import { Flags } from '../../../compose/flags'
import { HasSameSync } from './_hasSameSync'

export function flatten() {
	function res<
		T,
		S,
		E1,
		G1,
		E2,
		G2,
		F1 extends Flags & { UNIQUE: false },
		F2 extends { UNIQUE: false },
	>(
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
			emitter: flatEmitter_(o.emitter!, (inner, s, n, e, c) => {
				isoAssert(inner.emitter !== undefined)
				return inner.emitter(s, n, e, c)
			}),
			flags: {
				CONSTRUCT: false,
				SYNC: o.flags.SYNC as never,
				UNIQUE: false,
				WRITE: false,
			},
			nothing: o.nothing,
		}
	}
	return res
}
