import { fromInit, Init } from '../../functions/arguments'
import { id } from '../../functions/basics'
import { Exit, Machine, MachineFactory } from '../core'

export function baseMachine<EventOut = never, Final = never>() {
	return function <
		EventIn,
		State,
		Props = void,
		Result = State,
		Finish extends boolean = false,
	>(
		init: Init<State, [Props]>,
		reduce: (
			event: EventIn,
			state: State,
			send: (event: EventOut) => void,
		) => Exit<Final> | Init<State, [State]>,
		result?: (state: State) => Result,
		finish?: Finish,
	): MachineFactory<Props, EventIn, State, Result, EventOut, Final, Finish> {
		return (props: Props) => ({
			finish: finish ?? (false as never),
			init: fromInit(init, props),
			reduce: (event: any, state, send) =>
				fromInit(reduce(event, state, send), state),
			result: result ?? id<any>,
		})
	}
}

export function reducer<State, EventIn = State, Result = State>(
	init: Init<State, []>,
	reduce: (event: EventIn, state: State) => State,
	result?: (state: State) => Result,
): Machine<EventIn, State, Result, never, never, false> {
	return {
		finish: false,
		init,
		reduce: reduce as any,
		result: result ?? (id as never),
	}
}
