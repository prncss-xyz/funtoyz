import {
	AnyTag,
	forbidden,
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
	machine: Machine<EventIn, State, Result>,
): {
	disabled: (event: EventIn) => boolean
	next: (event: EventIn) => Result
	result: Result
	send: (event: EventIn) => void
}
export function useMachine<State, EventOut, EventIn = State, Result = State>(
	machine: Machine<EventIn, State, Result, EventOut>,
	onSend: Handlers<EventOut>,
): {
	disabled: (event: EventIn) => boolean
	next: (event: EventIn) => Result
	result: Result
	send: (event: EventIn) => void
}
export function useMachine<State, EventIn, Result, EventOut>(
	machine: Machine<EventIn, State, Result, EventOut>,
	onSend?: Handlers<EventOut>,
) {
	const [state, setState] = useState(machine.init)
	const h = fromHandlers(onSend)
	return machineState(machine as never, state, setState, h)
}
