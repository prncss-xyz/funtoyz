import { Init } from '../../functions/arguments'
import { AnyTag, PayloadOf, TypeIn } from '../../tags/types'
import { Exit, MachineFactory } from '../core'
import { baseMachine } from './base'

export function modalMachine<EventOut = never, Final = never>() {
	return function <
		EventIn extends AnyTag,
		State extends AnyTag,
		Props = void,
		Result = State,
		Finish extends boolean = false,
	>(
		init: Init<State, [Props]>,
		states: {
			[S in TypeIn<State>]: Partial<{
				[E in TypeIn<EventIn>]: (
					event: PayloadOf<EventIn, E>,
					state: PayloadOf<State, S>,
					send: (event: EventOut) => void,
				) => Exit<Final> | State
			}>
		},
		result?: {
			[S in TypeIn<State>]: (state: PayloadOf<State, S>) => Result
		},
		finish?: Finish,
	): MachineFactory<Props, EventIn, State, Result, EventOut, Final, Finish> {
		return baseMachine<EventOut, Final>()<
			EventIn,
			State,
			Props,
			Result,
			Finish
		>(
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
			finish,
		)
	}
}
