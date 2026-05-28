import { Init } from '../../functions/arguments/init'
import { Modify } from '../../functions/types'
import { isFunction } from '../../guards'
import { Tags } from '../../tags/types'
import { baseMachine } from './base'

// TODO: maybe do away with reversed mapped type to allow not typing event when void
export function directMachine<E = never>() {
	return function <T, State extends object, Props = void, Result = State>(
		init: Init<State, [Props]>,
		events: {
			[K in keyof T]: (
				event: T[K],
				state: State,
				send: (event: E) => void,
			) => Partial<State> | Modify<State> | null | undefined | void
		},
		result?: (state: State) => Result,
	) {
		return baseMachine<E>()<Tags<T>, State, Props, Result>(
			init,
			(ev: any, state, send) => {
				const res = (events as any)[ev.type](ev.payload, state, send)
				if (res == null) return state
				if (isFunction(res)) return res(state)
				// FIX: make it work with merge
				// return merge(res, state)
				return { ...state, ...res }
			},
			result,
		)
	}
}
