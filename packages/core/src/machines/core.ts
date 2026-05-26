import { forbidden } from '../assertions'
import { Init } from '../functions/arguments/init'
import { id, noop } from '../functions/basics'

export type AnyMachine = Machine<any, any, any, any, any>
export type InferMachineProps<M> =
	M extends Machine<infer P, any, any, any, any> ? P : never
export type InferMachineEventIn<M> =
	M extends Machine<any, infer E, any, any, any> ? E : never
export type InferMachineState<M> =
	M extends Machine<any, any, infer S, any, any> ? S : never
export type InferMachineResult<M> =
	M extends Machine<any, any, any, infer R, any> ? R : never
export type InferMachineEventOut<M> =
	M extends Machine<any, any, any, any, infer E> ? E : never

export interface Machine<
	Props,
	EventIn,
	State = EventIn,
	Result = State,
	E = never,
> {
	init: Init<State, [Props]>
	reduce: (event: EventIn, state: State, send: (e: E) => void) => State
	result?: (state: State) => Result
}

export type MachineReducer<Value, State = Value, Result = State> = Machine<
	Value,
	State,
	Result
>

export function spicedMachine<
	Props,
	EventIn,
	State = EventIn,
	Result = State,
	E = never,
>(machine: Machine<Props, EventIn, State, Result, E>) {
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
		init: machine.init,
		next: (event: EventIn) => (state: State) =>
			result(reduce(event, state, noop)),
		result: () => (state: State) => result(state),
		send:
			(event: EventIn, setState: (s: State) => void, onSend: (e: E) => void) =>
			(state: State) => {
				const calls: E[] = []
				setState(reduce(event, state, (e) => calls.push(e)))
				if (calls.length > 0)
					void Promise.resolve().then(() => calls.forEach((c) => onSend(c)))
			},
	}
}

export function machineState<
	Props,
	EventIn,
	State = EventIn,
	Result = State,
	EventOut = never,
>(
	machine: Machine<Props, EventIn, State, Result, EventOut>,
	state: State,
	setState: (s: State) => void,
	onSend?: (e: EventOut) => void,
) {
	const onSend_ = onSend ?? (forbidden as never)
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
		init: machine.init,
		next: (event: EventIn) => result(reduce(event, state, noop as any)),
		result: result(state),
		send: (event: EventIn) => {
			const calls: EventOut[] = []
			setState(reduce(event, state, ((e: EventOut) => calls.push(e)) as any))
			if (calls.length > 0)
				void Promise.resolve().then(() => calls.forEach((c) => onSend_(c)))
		},
	}
}
