import { fromInit, Init } from '../../functions/arguments/init'
import { id } from '../../functions/basics'
import { Machine } from '../core'

export function baseMachine<CW = void, CR = void>() {
	return function <EventIn, State, Props = void, Result = State>(
		init: Init<State, [Props]>,
		reduce: (event: EventIn, state: State, send: CW) => Init<State, [State]>,
		result?: (state: State, cr: CR) => Result,
	): Machine<Props, EventIn, State, Result, CW, CR> {
		return {
			init,
			reduce: (event: any, state, send) =>
				fromInit(reduce(event, state, send), state),
			result: result ?? (id as never),
		}
	}
}
