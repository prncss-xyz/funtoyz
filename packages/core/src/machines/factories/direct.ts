import { Init } from '../../functions/arguments/init'
import { Tags } from '../../tags/types'
import { baseMachine } from './base'

// TODO: maybe do away with reversed mapped type to allow not typing event when void
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
		return baseMachine<E>()<Tags<T>, State, Props, Result>(
			init,
			(ev: any, state, send) => {
				return (events as any)[ev.type](ev.payload, state, send)
			},
			result,
		)
	}
}
