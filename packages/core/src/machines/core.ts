import { Init } from '../functions/arguments/init'
import { id, noop } from '../functions/basics'

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

export function spicedMachine<
	EventIn,
	State = EventIn,
	Result = State,
	EventOut = never,
>(
	machine: Machine<EventIn, State, Result, EventOut>,
	onSend: (e: EventOut) => void,
) {
	const reduce = machine.reduce
	const result = machine.result ?? (id as never)
	return {
		disabled: (event: EventIn) => (state: State) => {
			let called = false
			return (
				Object.is(
					state,
					reduce(event, state, () => (called = true)),
				) || called
			)
		},
		next: (event: EventIn) => (state: State) => {
			return result(reduce(event, state, noop))
		},
		result,
		send: (event: EventIn) => (state: State) => {
			const calls: EventOut[] = []
			const res = reduce(event, state, (e) => calls.push(e))
			if (calls.length > 0)
				Promise.resolve().then(() => calls.forEach((c) => onSend(c)))
			return res
		},
	}
}

export function machineState<
	EventIn,
	State = EventIn,
	Result = State,
	EventOut = never,
>(
	machine: Machine<EventIn, State, Result, EventOut>,
	state: State,
	setState: (s: State) => void,
	onSend: (e: EventOut) => void,
) {
	const reduce = machine.reduce
	const result = machine.result ?? (id as never)
	return {
		disabled: (event: EventIn) => {
			let called = false
			return (
				Object.is(
					state,
					reduce(event, state, () => (called = true)),
				) || called
			)
		},
		next: (event: EventIn) => {
			return result(reduce(event, state, noop))
		},
		result: result(state),
		send: (event: EventIn) => {
			const calls: EventOut[] = []
			setState(reduce(event, state, (e) => calls.push(e)))
			if (calls.length > 0)
				Promise.resolve().then(() => calls.forEach((c) => onSend(c)))
		},
	}
}
