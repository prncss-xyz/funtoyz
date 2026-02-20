import { Init } from '../functions/arguments/init'
import { noop } from '../functions/basics'

export type MachineFactory<Props, EventIn, State, Result, EventOut> = (
	props: Props,
) => Machine<EventIn, State, Result, EventOut>

export interface Machine<
	EventIn,
	State = EventIn,
	Result = State,
	EventOut = never,
> {
	init: Init<State>
	reduce: (
		event: EventIn,
		state: State,
		send: (event: EventOut) => void,
	) => State
	result?: (state: State) => Result
}

export type MachineReducer<Value, State = Value, Result = State> = Machine<
	Value,
	State,
	Result
>

export function machineToReducer<EventIn, State = EventIn, Result = State>(
	m: Machine<EventIn, State, Result>,
) {
	return {
		init: m.init,
		reduce: (event: EventIn, state: State) => m.reduce(event, state, noop),
		result: m.result,
	}
}

export function canSend<EventIn, State, EventOut>(
	{
		reduce,
	}: {
		reduce: (
			event: EventIn,
			state: State,
			send: (event: EventOut) => void,
		) => void
	},
	state: State,
) {
	return (event: EventIn) => {
		let called = false
		return (
			!Object.is(
				state,
				reduce(event, state, () => (called = true)),
			) || called
		)
	}
}

export function getNext<EventIn, State, EventOut>(
	{
		reduce,
	}: {
		reduce: (
			event: EventIn,
			state: State,
			send: (event: EventOut) => void,
		) => void
	},
	state: State,
) {
	return (event: EventIn) => reduce(event, state, noop)
}
