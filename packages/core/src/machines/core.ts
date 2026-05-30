import { forbidden } from '../assertions'
import { Init } from '../functions/arguments/init'
import { id, noop } from '../functions/basics'
import { Empty } from '../objects/types'
import { AnyTag, Tags } from '../tags/types'

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
	EventIn extends object,
	State,
	Result = State,
	EventOut extends object = Empty,
> {
	init: Init<State, [Props]>
	reduce: (
		event: Tags<EventIn>,
		state: State,
		send: (e: Tags<EventOut>) => void,
	) => State
	result?: (state: State) => Result
}

export function spicedMachine<
	Props,
	EventIn extends AnyTag,
	State,
	Result = State,
	EventOut = Empty,
>(machine: Machine<Props, EventIn, State, Result, Empty>) {
	const reduce = machine.reduce
	const result = machine.result ?? (id as never)

	return {
		disabled: (event: Tags<EventIn>) => (state: State) => {
			let called = false
			return (
				Object.is(
					state,
					reduce(event, state, () => (called = true)),
				) || called
			)
		},
		init: machine.init,
		next: (event: Tags<EventIn>) => (state: State) =>
			result(reduce(event, state, noop)),
		result: () => (state: State) => result(state),
		send:
			(
				event: Tags<EventIn>,
				setState: (s: State) => void,
				onSend: (e: EventOut) => void,
			) =>
			(state: State) => {
				const calls: EventOut[] = []
				setState(reduce(event, state, (e) => calls.push(e)))
				if (calls.length > 0)
					void Promise.resolve().then(() => calls.forEach((c) => onSend(c)))
			},
	}
}

export function machineOverState<
	Props,
	EventIn extends AnyTag,
	State = EventIn,
	Result = State,
	EventOut = Empty,
>(
	machine: Machine<Props, EventIn, State, Result, Tags<EventOut>>,
	state: State,
	setState: (s: State) => void,
	onSend?: (e: Tags<EventOut>) => void,
) {
	const onSend_ = onSend ?? (forbidden as never)
	const reduce = machine.reduce
	const result = machine.result ?? (id as never)
	return {
		disabled: (event: Tags<EventIn>) => {
			let called = false
			return (
				Object.is(
					state,
					reduce(event, state, (() => (called = true)) as any),
				) || called
			)
		},
		init: machine.init,
		next: (event: Tags<EventIn>) => result(reduce(event, state, noop as any)),
		result: result(state),
		send: (event: Tags<EventIn>) => {
			const calls: Tags<EventOut>[] = []
			setState(
				reduce(event, state, ((e: Tags<EventOut>) => calls.push(e)) as any),
			)
			if (calls.length > 0)
				void Promise.resolve().then(() => calls.forEach((c) => onSend_(c)))
		},
	}
}
