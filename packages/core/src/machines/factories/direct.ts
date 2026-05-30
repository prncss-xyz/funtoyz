import { Init } from '../../functions/arguments/init'
import { Modify } from '../../functions/types'
import { isFunction } from '../../guards'
import { merge } from '../../objects/merge'
import { Empty } from '../../objects/types'
import { Tags } from '../../tags/types'
import { baseMachine } from './base'

// TODO: maybe do away with reversed mapped type to allow not typing event when void
export function directMachine<EventOut extends object = Empty>() {
	return function <
		T extends object,
		State extends object,
		Props = void,
		Result = State,
	>(
		init: Init<State, [Props]>,
		events: {
			[K in keyof T]: (
				event: T[K],
				state: State,
				send: (event: Tags<EventOut>) => void,
			) => Partial<State> | Modify<State> | null | undefined | void
		},
		result?: (state: State) => Result,
	) {
		return baseMachine<EventOut>()<T, State, Props, Result>(
			init,
			(ev: any, state, send) => {
				const res = (events as any)[ev.type](ev.payload, state, send)
				if (res == null) return state
				if (isFunction(res)) return res(state)
				return merge(state, res)
			},
			result,
		)
	}
}
