import {
	AnyTag,
	forbidden,
	fromInit,
	isFunction,
	type Machine,
	machineState,
	PayloadOf,
	TypeIn,
} from '@funtoyz/core'
import { useState } from 'react'

type Handlers<EventOut> =
	| ((e: EventOut) => void)
	| (EventOut extends AnyTag
			? { [T in TypeIn<EventOut>]: (event: PayloadOf<EventOut, T>) => void }
			: never)

function fromHandlers<EventOut>(
	handlers?: Handlers<EventOut>,
): (event: EventOut) => void {
	if (handlers === undefined) return forbidden as never
	if (isFunction(handlers)) return handlers
	return function (event: EventOut) {
		;(handlers as any)[(event as any).type]((event as any).payload)
	}
}

export function useMachine<State, EventIn = State, Result = State>(
	machine: Machine<void, EventIn, State, Result>,
	param?: void,
): {
	disabled: (event: EventIn) => boolean
	next: (event: EventIn) => Result
	result: Result
	send: (event: EventIn) => void
}
export function useMachine<Prop, State, EventIn = State, Result = State>(
	machine: Machine<Prop, EventIn, State, Result>,
	param: Prop,
): {
	disabled: (event: EventIn) => boolean
	next: (event: EventIn) => Result
	result: Result
	send: (event: EventIn) => void
}
export function useMachine<
	Prop,
	State,
	EventOut,
	EventIn = State,
	Result = State,
>(
	machine: Machine<Prop, EventIn, State, Result, EventOut>,
	param: Prop,
	onSend: Handlers<EventOut>,
): {
	disabled: (event: EventIn) => boolean
	next: (event: EventIn) => Result
	result: Result
	send: (event: EventIn) => void
}
export function useMachine<Prop, State, EventIn, Result, EventOut>(
	machine: Machine<Prop, EventIn, State, Result, EventOut>,
	param: Prop,
	onSend?: Handlers<EventOut>,
) {
	const [state, setState] = useState(() => fromInit(machine.init, param))
	const h = fromHandlers(onSend)
	return machineState(machine as never, state, setState, h)
}
