/* eslint-disable @typescript-eslint/no-empty-object-type */
import { exhaustive } from '../../../assertions'
import { fromInit } from '../../../functions/arguments'
import { id } from '../../../functions/basics'
import { Exit, Machine } from '../../../machines/core'
import { Nothing, nothing } from '../../../tags/results'
import { Optic } from '../../types'
import { sequence } from './sequence'

type Send<EventOut> = (event: EventOut) => void

// when EventOut is never, we don't need the send function
export function scan<EventIn, State, Result = State, Final = never>(
	machine: Machine<EventIn, State, Result, never, Final>,
): <S, E2G, E2F, F2>(
	o2: Optic<EventIn, S, E2G, E2F> & {
		TAGS: F2
	},
) => Optic<Final | Result, S, E2G | Nothing, E2F> & {
	LTAGS: {}
} & {
	TAGS: F2 & {
		getter: true
		optional: true
		traversable: true
	}
}
export function scan<
	EventIn,
	State,
	Result = State,
	EventOut = never,
	Final = never,
>(
	machine: Machine<EventIn, State, Result, EventOut, Final>,
	send: Send<EventOut>,
): <S, E2G, E2F, F2>(
	o2: Optic<EventIn, S, E2G, E2F> & {
		TAGS: F2
	},
) => Optic<Final | Result, S, E2G | Nothing, E2F> & {
	LTAGS: {}
} & {
	TAGS: F2 & {
		getter: true
		optional: true
		traversable: true
	}
}
export function scan<
	EventIn,
	State,
	Result = State,
	EventOut = never,
	Final = never,
>(
	machine: Machine<EventIn, State, Result, EventOut, Final>,
	send?: Send<EventOut>,
) {
	return scan_(machine, send ?? (exhaustive as never), true)
}

// when EventOut is never, we don't need the send function
export function fold<EventIn, State, Result = State, Final = never>(
	machine: Machine<EventIn, State, Result, never, Final>,
): <S, E2G, E2F, F2>(
	o2: Optic<EventIn, S, E2G, E2F> & {
		TAGS: F2
	},
) => Optic<Final | Result, S, E2G | Nothing, E2F> & {
	LTAGS: {}
} & {
	TAGS: F2 & {
		getter: true
		optional: true
		traversable: true
	}
}
export function fold<
	EventIn,
	State,
	Result = State,
	EventOut = never,
	Final = never,
>(
	machine: Machine<EventIn, State, Result, EventOut, Final>,
	send: Send<EventOut>,
): <S, E2G, E2F, F2>(
	o2: Optic<EventIn, S, E2G, E2F> & {
		TAGS: F2
	},
) => Optic<Final | Result, S, Nothing, E2F> & {
	LTAGS: {}
} & {
	TAGS: F2 & {
		getter: true
		optional: true
		traversable: true
	}
}
export function fold<
	EventIn,
	State,
	Result = State,
	EventOut = never,
	Final = never,
>(
	machine: Machine<EventIn, State, Result, EventOut, Final>,
	send?: Send<EventOut>,
) {
	return scan_(machine, send ?? (exhaustive as never), false)
}

function scan_<EventIn, State, Result, EventOut, Final, Finish extends boolean>(
	{
		finish,
		init,
		reduce,
		result,
	}: Machine<EventIn, State, Result, EventOut, Final, Finish>,
	send: Send<EventOut>,
	scan: boolean,
) {
	const result_ = result ?? (id as never)
	return sequence<
		Final | Result,
		EventIn,
		Finish extends true ? Nothing : never
	>((source) => {
		let state = fromInit(init)
		let calls: EventOut[] = []
		const send_ = (event: EventOut) => calls.push(event)
		return (n, e, c) => {
			const { start, unmount } = source(
				(v) => {
					const res = reduce(v, state, send_)
					if (res instanceof Exit) {
						n(res.value)
						c()
						return
					}
					state = res
					if (scan) n(result_(state))
					if (calls.length) {
						calls.forEach(send)
						calls = []
					}
				},
				(v) => {
					if (scan) return e(v)
					if (finish) return e(nothing() as never)
					n(result_(fromInit(init)))
					c()
				},
				() => {
					if (finish) {
						e(nothing() as never)
						return
					}
					if (!scan) n(result_(state))
					c()
				},
			)
			return {
				start: () => {
					if (scan) n(result_(state))
					start()
				},
				unmount,
			}
		}
	})
}
