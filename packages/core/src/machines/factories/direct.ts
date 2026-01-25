import { Init } from '../../functions/arguments'
import { Tags } from '../../tags/types'
import { Exit } from '../core'
import { baseMachine } from './base'

export function directMachine<EventOut = never, Final = never>() {
	return function <
		T,
		State,
		Props = void,
		Result = State,
		Finish extends boolean = false,
	>(
		init: Init<State, [Props]>,
		events: {
			[K in keyof T]: (
				event: T[K],
				state: State,
				send: (event: EventOut) => void,
			) => Exit<Final> | Init<State, [State]>
		},
		result?: (state: State) => Result,
		finish?: Finish,
	) {
		return baseMachine<EventOut, Final>()<
			Tags<T>,
			State,
			Props,
			Result,
			Finish
		>(
			init,
			(event: any, state, send) =>
				(events as any)[event.type](event, state, send),
			result,
			finish,
		)
	}
}
