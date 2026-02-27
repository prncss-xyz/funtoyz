import { Reducer } from '../../../../reduce'
import { Optic } from '../../../compose'
import { reduce } from '../../../compose/_methods'
import { Flags } from '../../../compose/flags'

export function fold<Value, State, Result = State>(
	props: Reducer<Value, State, Result>,
) {
	return function <S, E, G, F extends Flags & { UNIQUE: false }>(
		o: Optic<Value, S, E, G, F>,
	): Optic<
		Result,
		S,
		never,
		never,
		(F['SYNC'] extends false ? { SYNC: false } : object) & {
			CONSTRUCT: false
			WRITE: false
		}
	> {
		return {
			flags: {
				CONSTRUCT: false,
				SYNC: o.flags.SYNC as never,
				WRITE: false,
			},
			getter: reduce(props, o),
		}
	}
}
