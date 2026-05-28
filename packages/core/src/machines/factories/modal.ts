import { Init } from '../../functions/arguments/init'
import { AnyTag, PayloadOf, TypeIn } from '../../tags/types'
import { Machine } from '../core'
import { baseMachine } from './base'

export function modalMachine<E = never>() {
	return function <
		EventIn extends AnyTag,
		State extends AnyTag,
		Props = void,
		Result = State,
	>(
		init: Init<State, [Props]>,
		states: {
			[S in TypeIn<State>]: Partial<{
				[E in TypeIn<EventIn>]: (
					event: PayloadOf<EventIn, E>,
					state: PayloadOf<State, S>,
					send: E,
				) => State | null | undefined | void
			}>
		},
		result?: {
			[S in TypeIn<State>]: (state: PayloadOf<State, S>) => Result
		},
	): Machine<Props, EventIn, State, Result, E> {
		return baseMachine<E>()<EventIn, State, Props, Result>(
			init,
			(ev, state, send) => {
				const s = (states as any)[state.type]
				const handler = s[ev.type]
				if (!handler) return state
				return handler(ev.payload, state.payload, send) ?? state
			},
			result
				? (state) => (result as any)[state.type](state.payload)
				: undefined,
		)
	}
}
