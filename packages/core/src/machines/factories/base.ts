import { fromInit, Init } from '../../functions/arguments/init'
import { id } from '../../functions/basics'
import { MachineFactory } from '../core'

export function baseMachine<CW = void, CR = void>() {
	return function <EventIn, State, Props = void, Result = State>(
		init: Init<State, [Props]>,
		reduce: (event: EventIn, state: State, send: CW) => Init<State, [State]>,
		result?: (state: State, cr: CR) => Result,
	): MachineFactory<Props, EventIn, State, Result, CW, CR> {
		return (props: Props) => ({
			init: fromInit(init, props),
			reduce: (event: any, state, send) =>
				fromInit(reduce(event, state, send), state),
			result: result ?? (id as never),
		})
	}
}
