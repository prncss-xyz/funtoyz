import { Init } from '../functions/arguments'
import { id } from '../functions/basics'
import { AnyTag, PayloadOf, TypeIn } from '../tags/types'
import { Exit } from './core'

// Do not write tests for this
export function steps<EventOut = never, Final = never>() {
	return <E, State extends AnyTag, Props = void, Result = State>(
		init: Init<State, [Props]>,
		states: {
			[S in TypeIn<State>]: (
				event: E[S],
				state: PayloadOf<State, S>,
				send: (event: EventOut) => void,
			) => Exit<Final> | State
		},
		result?: {
			[S in TypeIn<State>]: (state: PayloadOf<State, S>) => Result
		},
	) => ({
		init,
		result: result ?? id,
		states,
	})
}
