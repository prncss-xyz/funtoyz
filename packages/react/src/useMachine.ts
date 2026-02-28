import { forbidden, type Machine, machineState } from '@funtoyz/core'
import { useState } from 'react'

export function useMachine<State, EventIn = State, Result = State>(
	machine: Machine<EventIn, State, Result>,
): {
	disabled: (event: EventIn) => boolean
	next: (event: EventIn) => Result
	result: Result
	send: (event: EventIn) => void
}
export function useMachine<State, EventOut, EventIn = State, Result = State>(
	machine: Machine<EventIn, State, Result, (e: EventOut) => void>,
	onSend: (event: EventOut) => void,
): {
	disabled: (event: EventIn) => boolean
	next: (event: EventIn) => Result
	result: Result
	send: (event: EventIn) => void
}
export function useMachine<State, EventIn, Result, EventOut>(
	machine: Machine<EventIn, State, Result, any>,
	onSend?: (event: EventOut) => void,
) {
	const [state, setState] = useState(machine.init)
	return machineState(machine, state, setState, onSend ?? (forbidden as never))
}
