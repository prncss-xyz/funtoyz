import { forbidden } from '../assertions'
import { fromInit, Init } from '../functions/arguments/init'
import { id, noop } from '../functions/basics'
import { Empty } from '../objects/types'
import { PublicKey, Tags } from '../tags/types'

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

export type MachineHandler<Payload, State, EventOut extends object> = (
	payload: Payload,
	state: State,
	send: (event: Tags<EventOut>) => void,
) => Init<State, [State]>

export type MachineHandlers<
	EventIn extends object,
	State,
	EventOut extends object,
> = Partial<{
	[K in keyof EventIn as PublicKey<K>]: MachineHandler<
		EventIn[K],
		State,
		EventOut
	>
}>

export interface Machine<
	Props,
	EventIn extends object,
	State,
	Result = State,
	EventOut extends object = Empty,
> {
	init: Init<State, [Props]>
	handlers: MachineHandlers<EventIn, State, EventOut>
	result?: (state: State) => Result
}

export function dispatchMachine<
	Props,
	EventIn extends object,
	State,
	Result,
	EventOut extends object,
>(
	machine: Machine<Props, EventIn, State, Result, EventOut>,
	event: Tags<EventIn>,
	state: State,
	send: (event: Tags<EventOut>) => void,
) {
	const handler = machine.handlers[event.type as keyof EventIn] as
		| MachineHandler<unknown, State, EventOut>
		| undefined
	return handler ? fromInit(handler(event.payload, state, send), state) : state
}

export function machineOverState<
	Props,
	EventIn extends object,
	State,
	Result = State,
	EventOut extends object = Empty,
>(
	machine: Machine<Props, EventIn, State, Result, EventOut>,
	state: State,
	setState: (state: State) => void,
	onSend?: (event: Tags<EventOut>) => void,
) {
	const onSend_ = onSend ?? (forbidden as never)
	const result = machine.result ?? (id as never)
	return {
		disabled: (event: Tags<EventIn>) => {
			let called = false
			return (
				Object.is(
					state,
					dispatchMachine(machine, event, state, () => (called = true)),
				) || called
			)
		},
		init: machine.init,
		next: (event: Tags<EventIn>) =>
			result(dispatchMachine(machine, event, state, noop)),
		result: result(state),
		send: (event: Tags<EventIn>) => {
			const calls: Tags<EventOut>[] = []
			setState(dispatchMachine(machine, event, state, (e) => calls.push(e)))
			if (calls.length > 0)
				void Promise.resolve().then(() => calls.forEach((call) => onSend_(call)))
		},
	}
}
