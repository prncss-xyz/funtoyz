import { canSend, exhaustive, getNext, type Machine } from '@funtoyz/core'
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
	const onSend = opts?.onSend ?? (exhaustive as never)
	const [state, setState] = useState(machine.init)
	function send(event: EventIn) {
		const events: EventOut[] = []
		const nextState = machine.reduce(event, state, (e) => events.push(e))
		setState(nextState)
		events.forEach(onSend)
	}
	const result = machine.result ? machine.result(state) : (state as never)
	return {
		canSend: canSend(machine, state),
		getNext: getNext(machine, state),
		result,
		send,
	}
}
