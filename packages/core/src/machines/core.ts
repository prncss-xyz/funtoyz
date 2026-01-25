import { Init } from '../functions/arguments'
import { noop } from '../functions/basics'

export type MachineFactory<
	Props,
	EventIn,
	State,
	Result,
	EventOut,
	Final,
	Finish extends boolean,
> = (props: Props) => Machine<EventIn, State, Result, EventOut, Final, Finish>

export class Exit<T> {
	value: T
	constructor(value: T) {
		this.value = value
	}
}

export function exit<T>(value: T) {
	return new Exit(value)
}

export interface Machine<
	EventIn,
	State = EventIn,
	Result = State,
	EventOut = never,
	Final = never,
	Finish extends boolean = false,
> {
	finish: Finish
	init: Init<State>
	reduce: (
		event: EventIn,
		state: State,
		send: (event: EventOut) => void,
	) => Exit<Final> | State
	result: (state: State) => Result
}

export type Reducer<Value, State = Value, Result = State> = Machine<
	Value,
	State,
	Result
>

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
