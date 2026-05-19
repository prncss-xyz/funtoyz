import { fromInit, Init } from '../../functions/arguments/init'
import { id } from '../../functions/basics'
import { Machine } from '../core'

export function baseMachine<CW = void>() {
	return function <EventIn, State, Props = void, Result = State>(
		init: Init<State, [Props]>,
		reduce: (event: EventIn, state: State, send: CW) => Init<State, [State]>,
		result?: (state: State) => Result,
	): Machine<Props, EventIn, State, Result, CW> {
		return {
			init,
			reduce: (event: any, state, send) =>
				fromInit(reduce(event, state, send), state),
			result: result ?? (id as never),
		}
	}
}
