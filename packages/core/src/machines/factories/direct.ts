import { Init } from '../../functions/arguments/init'
import { Tags } from '../../tags/types'
import { baseMachine } from './base'

export function directMachine<EventOut = void>() {
	return function <T, State, Props = void, Result = State>(
		init: Init<State, [Props]>,
		events: {
			[K in keyof T]: (
				event: T[K],
				state: State,
				send: (event: EventOut) => void,
			) => Init<State, [State]>
		},
		result?: (state: State) => Result,
	) {
		return baseMachine<EventOut>()<Tags<T>, State, Props, Result>(
			init,
			(event: any, state, send) =>
				(events as any)[event.type](event, state, send),
			result,
		)
	}
}
