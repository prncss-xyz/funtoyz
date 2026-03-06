import { forbidden } from '../assertions'
import { Init } from '../functions/arguments/init'
import { id, noop } from '../functions/basics'

export type MachineFactory<Props, EventIn, State, Result, CW, CR> = (
	props: Props,
) => Machine<EventIn, State, Result, CW, CR>

export interface Machine<
	EventIn,
	State = EventIn,
	Result = State,
	CW = void,
	CR = void,
> {
	init: Init<State>
	reduce: (event: EventIn, state: State, send: CW) => State
	result?: (state: State, cr: CR) => Result
}

export type MachineReducer<Value, State = Value, Result = State> = Machine<
	Value,
	State,
	Result
>

export function spicedMachine<
	EventIn,
	State = EventIn,
	Result = State,
	CWA = void,
	CR = void,
>(machine: Machine<EventIn, State, Result, (e: CWA) => void, CR>) {
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
		next: (event: EventIn, cr: CR) => (state: State) =>
			result(reduce(event, state, noop), cr),
		result: (cr: CR) => (state: State) => result(state, cr),
		send:
			(
				event: EventIn,
				setState: (s: State) => void,
				onSend: (e: CWA) => void,
			) =>
			(state: State) => {
				const calls: CWA[] = []
				setState(reduce(event, state, (e) => calls.push(e)))
				if (calls.length > 0)
					Promise.resolve().then(() => calls.forEach((c) => onSend(c)))
			},
	}
}

export function machineState<
	EventIn,
	State = EventIn,
	Result = State,
	EventOut = never,
>(
	machine: Machine<EventIn, State, Result, EventOut, void>,
	state: State,
	setState: (s: State) => void,
	onSend?: ((e: EventOut) => void)
) {
  const onSend_ = onSend ?? forbidden as never
	const reduce = machine.reduce
	const result = machine.result ?? (id as never)
	return {
		disabled: (event: EventIn) => {
			let called = false
			return (
				Object.is(
					state,
					reduce(event, state, (() => (called = true)) as any),
				) || called
			)
		},
		next: (event: EventIn) => result(reduce(event, state, noop as any)),
		result: result(state),
		send: (event: EventIn) => {
			const calls: EventOut[] = []
			setState(reduce(event, state, ((e: EventOut) => calls.push(e)) as any))
			if (calls.length > 0)
				Promise.resolve().then(() => calls.forEach((c) => onSend_(c)))
		},
	}
}
