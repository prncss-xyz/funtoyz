import { fromInit, Init } from '../../functions/arguments'
import { id } from '../../functions/basics'
import { Exit, MachineFactory } from '../core'

export function baseMachine<EventOut = never, Final = never>() {
	return function <EventIn, State, Props = void, Result = State>(
		init: Init<State, [Props]>,
		reduce: (
			event: EventIn,
			state: State,
			send: (event: EventOut) => void,
		) => Exit<Final> | Init<State, [State]>,
		result?: (state: State) => Result,
	): MachineFactory<Props, EventIn, State, Result, EventOut, Final> {
		return (props: Props) => ({
			init: fromInit(init, props),
			reduce: (event: any, state, send) =>
				fromInit(reduce(event, state, send), state),
			result: result ?? id<any>,
		})
	}
}
