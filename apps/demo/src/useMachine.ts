import { canSend, exhaustive, Exit, getNext, type Machine } from '@funtoyz/core'
import { useState } from 'react'

export function useMachine<
	State,
	EventIn = State,
	Result = State,
	EventOut = never,
	Final = never,
	Finish extends boolean = false,
>(
	machine: Machine<EventIn, State, Result, EventOut, Final, Finish>,
	...args: [EventOut] extends [never]
		? [Final] extends [never]
			? [
					opts?: {
						onExit?: (exit: Exit<Final>) => void
						onSend?: (event: EventOut) => void
					},
				]
			: [
					opts: {
						onExit: (exit: Exit<Final>) => void
						onSend?: (event: EventOut) => void
					},
				]
		: [Final] extends [never]
			? [
					opts: {
						onExit?: (exit: Exit<Final>) => void
						onSend: (event: EventOut) => void
					},
				]
			: [
					opts: {
						onExit: (exit: Exit<Final>) => void
						onSend: (event: EventOut) => void
					},
				]
) {
	const opts = args[0]
	const onSend = opts?.onSend ?? (exhaustive as never)
	const onExit = opts?.onExit ?? (exhaustive as never)
	const [state, setState] = useState(machine.init)
	function send(event: EventIn) {
		const events: EventOut[] = []
		const nextState = machine.reduce(event, state, (e) => events.push(e))
		if (nextState instanceof Exit) {
			onExit(nextState)
		} else setState(nextState)
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
