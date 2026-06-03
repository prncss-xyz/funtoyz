import { Init } from '../../functions/arguments/init'
import { Modify } from '../../functions/types'
import { isFunction } from '../../guards'
import { merge } from '../../objects/merge'
import { Empty } from '../../objects/types'
import { Tags } from '../../tags/types'
import { baseMachine } from './base'

export function directMachine<EventOut extends object = Empty>() {
	return function <T extends object, State, Props = void, Result = State>(
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
				if (typeof res === 'object' && typeof state === 'object')
					return merge(state, res)
				return res
			},
			result,
		)
	}
}
