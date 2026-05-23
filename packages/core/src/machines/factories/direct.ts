import { Init } from '../../functions/arguments/init'
import { Tags } from '../../tags/types'
import { baseMachine } from './base'
import { fromSendable, Sendable } from './sendable'

export function directMachine<E = never>() {
	return function <T, State, Props = void, Result = State>(
		init: Init<State, [Props]>,
		events: {
			[K in keyof T]: (
				event: T[K],
				state: State,
				send: (event: E) => void,
			) => Init<State, [State]>
		},
		result?: (state: State) => Result,
	) {
		return baseMachine<E>()<Sendable<Tags<T>>, State, Props, Result>(
			init,
			(event: any, state, send) => {
				const ev = fromSendable(event)
				return (events as any)[ev.type](ev.payload, state, send)
			},
			result,
		)
	}
}
