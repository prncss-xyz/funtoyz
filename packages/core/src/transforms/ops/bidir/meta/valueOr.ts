import { isoAssert } from '../../../../assertions'
import { fromInit, Init } from '../../../../functions/arguments/init'
import { Optic } from '../../../compose'
import { Flags, HasFlag } from '../../../compose/_flags'
import { Emitter, Getter } from '../../../compose/_methods'

export function valueOr<U>(u: Init<U>) {
	return function <T, E1, G1, F1 extends Flags>(
		o1: Optic<U, T, E1, G1, HasFlag<'READ', F1>>,
	): Optic<U, T, E1, never, F1> {
		isoAssert(
			Boolean(o1.emitter || o1.getter),
			'valueOr requires a getter or an emitter',
		)
		const getter: Getter<U, T, never> | undefined = o1.getter
			? (t, next) => o1.getter!(t, next, () => next(fromInit(u)))
			: undefined
		let emitter: Emitter<U, T, E1> | undefined = undefined
		if (o1.emitter) {
			emitter = (source, next, e, c) => {
				let clean = true
				return o1.emitter!(
					source,
					(s) => {
						next(s)
						clean = false
					},
					e,
					() => {
						if (clean) next(fromInit(u))
						c()
					},
				)
			}
		}
		return {
			...o1,
			emitter,
			getter,
			nothing: undefined,
		}
	}
}
