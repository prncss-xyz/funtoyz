import { forbidden, type Machine, machineState } from '@funtoyz/core'
import { useState } from 'react'

export function useMachine<State, EventIn = State, Result = State>(
	machine: Machine<EventIn, State, Result, never>,
): {
	disabled: (event: EventIn) => boolean
	next: (event: EventIn) => Result
	result: Result
	send: (event: EventIn) => void
}
export function useMachine<State, EventOut, EventIn = State, Result = State>(
	machine: Machine<EventIn, State, Result, EventOut>,
	onSend: (event: EventOut) => void,
): {
	disabled: (event: EventIn) => boolean
	next: (event: EventIn) => Result
	result: Result
	send: (event: EventIn) => void
}
export function useMachine<
	State,
	EventIn = State,
	Result = State,
	EventOut = never,
>(
	machine: Machine<EventIn, State, Result, EventOut>,
	onSend?: (event: EventOut) => void,
) {
	onSend ??= (forbidden as never)
	const [state, setState] = useState(machine.init)
	return machineState(machine, state, setState, onSend)
}
