import { Init } from '../../functions/arguments/init'
import { AnyTag, PayloadOf, TypeIn } from '../../tags/types'
import { Machine } from '../core'
import { baseMachine } from './base'
import { fromSendable, Sendable } from './sendable'

export function modalMachine<CW = void, CR = void>() {
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
					send: CW,
				) => State
			}>
		},
		result?: {
			[S in TypeIn<State>]: (state: PayloadOf<State, S>, cr: CR) => Result
		},
	): Machine<Props, Sendable<EventIn>, State, Result, CW, CR> {
		return baseMachine<CW, CR>()<Sendable<EventIn>, State, Props, Result>(
			init,
			(event, state, send) => {
				const sendableEvent = fromSendable(event)
				const s = (states as any)[state.type]
				const handler = s[sendableEvent.type]
				if (!handler) return state
				return handler(sendableEvent.payload, state.payload, send)
			},
			result
				? (state) => (result as any)[state.type](state.payload)
				: undefined,
		)
	}
}
