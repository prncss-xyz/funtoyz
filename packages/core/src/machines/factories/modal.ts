import { Init } from '../../functions/arguments/init'
import { AnyTag, PayloadOf, TypeIn } from '../../tags/types'
import { MachineFactory } from '../core'
import { baseMachine } from './base'

export function modalMachine<EventOut = never>() {
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
					send: (event: EventOut) => void,
				) => State
			}>
		},
		result?: {
			[S in TypeIn<State>]: (state: PayloadOf<State, S>) => Result
		},
	): MachineFactory<Props, EventIn, State, Result, EventOut> {
		return baseMachine<EventOut>()<EventIn, State, Props, Result>(
			init,
			(event: any, state, send) => {
				const s = (states as any)[state.type]
				const handler = s[event.type]
				if (!handler) return state
				return handler(event.payload, state.payload, send)
			},
			result
				? (state) => (result as any)[state.type](state.payload)
				: undefined,
		)
	}
}
