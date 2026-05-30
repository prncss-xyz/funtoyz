import { fromInit, Init } from '../../functions/arguments/init'
import { id } from '../../functions/basics'
import { Empty } from '../../objects/types'
import { Tags } from '../../tags/types'
import { Machine } from '../core'

// TODO: machine from reducer
// TODO: machine for simple value
export function baseMachine<EventOut extends object = Empty>() {
	return function <EventIn extends object, State, Props = void, Result = State>(
		init: Init<State, [Props]>,
		reduce: (
			event: Tags<EventIn>,
			state: State,
			send: (e: Tags<EventOut>) => void,
		) => Init<State, [State]>,
		result?: (state: State) => Result,
	): Machine<Props, EventIn, State, Result, EventOut> {
		return {
			init,
			reduce: (event: any, state, send) =>
				fromInit(reduce(event, state, send), state),
			result: result ?? (id as never),
		}
	}
}
