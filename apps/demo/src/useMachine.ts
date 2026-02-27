import { exhaustive, type Machine, machineState } from '@funtoyz/core'
import { useState } from 'react'

export function useMachine<
	State,
	EventIn = State,
	Result = State,
	EventOut = never,
>(
	machine: Machine<EventIn, State, Result, EventOut>,
	...args: [EventOut] extends [never]
		? [
				opts?: {
					onSend?: (event: EventOut) => void
				},
			]
		: [
				opts: {
					onSend?: (event: EventOut) => void
				},
			]
) {
	const opts = args[0]
	const impl = opts?.onSend ?? (exhaustive as never)
	const [state, setState] = useState(machine.init)
	return machineState(machine, state, setState, impl)
}
