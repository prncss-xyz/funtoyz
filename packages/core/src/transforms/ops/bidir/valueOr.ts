import { forbidden } from '../../../assertions'
import { fromInit, Init } from '../../../functions/arguments'
import { pipe2 } from '../../../functions/basics'
import { IOptic } from '../../compose'
import { Flags } from '../../compose/_flags'
import { Emitter, Getter } from '../../compose/_methods'

// TODO: if there is both a getter and an emitter, preserve them

export function valueOr<U>(u: Init<U>) {
	return function <T, E1, G1, F1 extends Flags>(
		o1: IOptic<U, T, E1, G1, F1>,
	): IOptic<U, T, E1, never, F1> {
		if (o1.getter) {
			const getter: Getter<U, T, never> = (t, next) =>
				o1.getter!(t, next, () => next(fromInit(u)))
			return {
				...o1,
				getter,
				nothing: undefined,
			}
		}
		if (o1.emitter) {
			const emitter: Emitter<U, U, E1> = (emit) => (source, next, e, c) => {
				let clean = true
				return emit(
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
			const res = pipe2(o1.emitter, emitter)
			return {
				...o1,
				emitter: res,
				getter: undefined,
				nothing: undefined,
			}
		}
		forbidden('valueOr requires a getter or an emitter')
	}
}
