import { fromInit } from '../../../functions/arguments/init'
import { id, noop } from '../../../functions/basics'
import { compose, Optic } from '../../compose'
import { Flags } from '../../compose/_flags'
import { ReducerNonDest } from '../../compose/_methods'

// we override type because the getter cannot have an error
export function scan<Event, State, Result = State>(
	props: ReducerNonDest<Event, State, Result>,
): <S, E2, G2, F2 extends Flags>(
	o2: Optic<Event, S, E2, G2, F2>,
) => Optic<
	Result,
	S,
	never,
	never,
	F2 & {
		CONSTRUCT: false
		WRITE: false
	}
>
export function scan<Event, State, Result = State>(
	props: ReducerNonDest<Event, State, Result>,
) {
	return compose<
		Event,
		Result,
		never,
		never,
		{ CONSTRUCT: false; WRITE: false }
	>({
		emitter: (emit) => (source, next, _e, c) => {
			const reduce = props.reduce
			const result = props.result ?? (id as never)
			let acc = fromInit(props.init)
			const { abort, start } = emit(
				source,
				(s) => {
					acc = reduce(s, acc)
					next(result(acc))
				},
				noop,
				c,
			)
			return {
				abort,
				start: () => {
					next(result(acc))
					start()
				},
			}
		},
		flags: { CONSTRUCT: false, WRITE: false },
	})
}
