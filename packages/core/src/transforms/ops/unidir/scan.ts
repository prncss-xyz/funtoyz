import { fromInit } from '../../../functions/arguments'
import { id } from '../../../functions/basics'
import { compose } from '../../compose'
import { ReducerNonDest } from '../../compose/_methods'

// FIX: getter error typing

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
		emitter: (emit) => (source, next, e, c) => {
			const reduce = props.reduce
			const result = props.result ?? (id as never)
			let acc = fromInit(props.init)
			const { abort, start } = emit(
				source,
				(s) => {
					acc = reduce(s, acc)
					next(result(acc))
				},
				e,
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
