import {
	forbidden,
	fromInit,
	isFunction,
	type Machine,
	machineOverState,
	PayloadOf,
	type Tags,
	TypeIn,
} from '@funtoyz/core'
import { useState } from 'react'

type Handlers<EventOut extends object> =
	| ((event: Tags<EventOut>) => void)
	| {
			[T in TypeIn<Tags<EventOut>>]: (
				event: PayloadOf<Tags<EventOut>, T>,
			) => void
	  }

function fromHandlers<EventOut extends object>(
	handlers?: Handlers<EventOut>,
): (event: Tags<EventOut>) => void {
	if (handlers === undefined) return forbidden as never
	if (isFunction(handlers)) return handlers
	return (event) => (handlers as any)[event.type](event.payload)
}

export function useMachine<State, EventIn extends object, Result = State>(
	machine: Machine<void, EventIn, State, Result>,
	param?: void,
): {
	disabled: (event: Tags<EventIn>) => boolean
	next: (event: Tags<EventIn>) => Result
	result: Result
	send: (event: Tags<EventIn>) => void
}
export function useMachine<Prop, State, EventIn extends object, Result = State>(
	machine: Machine<Prop, EventIn, State, Result>,
	param: Prop,
): {
	disabled: (event: Tags<EventIn>) => boolean
	next: (event: Tags<EventIn>) => Result
	result: Result
	send: (event: Tags<EventIn>) => void
}
export function useMachine<
	Prop,
	State,
	EventOut extends object,
	EventIn extends object,
	Result = State,
>(
	machine: Machine<Prop, EventIn, State, Result, EventOut>,
	param: Prop,
	onSend: Handlers<EventOut>,
): {
	disabled: (event: Tags<EventIn>) => boolean
	next: (event: Tags<EventIn>) => Result
	result: Result
	send: (event: Tags<EventIn>) => void
}
export function useMachine<
	Prop,
	State,
	EventIn extends object,
	Result,
	EventOut extends object,
>(
	machine: Machine<Prop, EventIn, State, Result, EventOut>,
	param: Prop,
	onSend?: Handlers<EventOut>,
) {
	const [state, setState] = useState(() => fromInit(machine.init, param))
	return machineOverState(machine, state, setState, fromHandlers(onSend))
}
