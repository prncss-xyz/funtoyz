import { Optic } from '../../compose'
import { Flags } from '../../compose/_flags'
import { reduce, Reducer } from '../../compose/_methods'

export function fold<Value, State, Result = State>(
	props: Reducer<Value, State, Result>,
): <S, E, F extends Flags>(
	o: Optic<Value, S, E, any, F>,
) => Optic<Result, S, E, E, Flags>
export function fold<Value, State, Result = State>(
	props: Reducer<Value, State, Result>,
) {
	return function <S, E, F extends Flags>(
		o: Optic<Value, S, E, any, F>,
	): Optic<
		Result,
		S,
		E,
		E,
		(F['SYNC'] extends false ? { SYNC: false } : never) & {
			CONSTRUCT: false
			WRITE: false
		}
	> {
		return {
			flags: {
				CONSTRUCT: false,
				SYNC: o.flags.SYNC,
				WRITE: false,
			} as never,
			getter: reduce(props, o),
		}
	}
}
