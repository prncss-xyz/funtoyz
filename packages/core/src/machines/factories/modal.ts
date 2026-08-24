import { Init } from '../../functions/arguments/init'
import { Empty } from '../../objects/types'
import { Tags } from '../../tags/types'
import { Machine, MachineHandlers } from '../dispatch'

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
				[K in keyof EventIn]: (
					event: EventIn[K],
					state: State[S],
					send: (event: Tags<E>) => void,
				) => Tags<State> | null | undefined | void
			}>
		},
		result?: {
			[S in keyof State]: (state: State[S]) => Result
		},
	): Machine<Props, EventIn, Tags<State>, Result, E> {
		const eventTypes = new Set(
			Object.values(states).flatMap((handlers) =>
				Object.keys(handlers as object),
			),
		)
		const handlers = Object.fromEntries(
			[...eventTypes].map((type) => [
				type,
				(
					payload: unknown,
					state: Tags<State>,
					send: (event: Tags<E>) => void,
				) => {
					const handler = (states as any)[state.type][type]
					return handler?.(payload, state.payload, send) ?? state
				},
			]),
		) as MachineHandlers<EventIn, Tags<State>, E>
		return {
			handlers,
			init,
			result: result
				? (state) => (result as any)[state.type](state.payload)
				: undefined,
		}
	}
}
