import { Init } from '../../functions/arguments/init'
import { Empty } from '../../objects/types'
import { Tags } from '../../tags/types'
import { Machine } from '../core'
import { baseMachine } from './base'

export function modalMachine<E extends object = Empty>() {
	return function <
		EventIn extends object,
		State extends object,
		Props = void,
		Result = Tags<State>,
	>(
		init: Init<Tags<State>, [Props]>,
		states: {
			[S in keyof State]: Partial<{
				[E in keyof EventIn]: (
					event: EventIn[E],
					state: State[S],
					send: E,
				) => Tags<State> | null | undefined | void
			}>
		},
		result?: {
			[S in keyof State]: (state: State[S]) => Result
		},
	): Machine<Props, EventIn, Tags<State>, Result, E> {
		return baseMachine<E>()<EventIn, Tags<State>, Props, Result>(
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
