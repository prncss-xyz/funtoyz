import { fromInit, Init } from '../../functions/arguments/init'
import { id } from '../../functions/basics'
import { Machine } from '../core'

export function baseMachine<E = never>() {
	return function <EventIn, State, Props = void, Result = State>(
		init: Init<State, [Props]>,
		reduce: (event: EventIn, state: State, send: (e: E) => void) => Init<State, [State]>,
		result?: (state: State) => Result,
	): Machine<Props, EventIn, State, Result, E> {
		return {
			init,
			reduce: (event: any, state, send) =>
				fromInit(reduce(event, state, send), state),
			result: result ?? (id as never),
		}
	}
}
