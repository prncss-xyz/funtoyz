import { fromInit, Init } from '../functions/arguments'
import { AnyTag, PAYLOAD, PayloadOf, TypeIn } from '../tags/types'
import { Exit } from './core'

// Do not write tests for this

export function steps<Final = void>() {
	return <
			Event extends Record<TypeIn<State>, AnyTag>,
			State extends AnyTag,
			Props = void,
		>(flow: {
			init: Init<State, [Props]>
			states: {
				[S in TypeIn<State>]: Partial<{
					[E in TypeIn<Event[S]>]: (
						event: PayloadOf<Event[S], E>,
						state: PayloadOf<State, S>,
					) => Exit<Final> | State
				}>
			}
		}) =>
		<Result>(opts: {
			implementation: {
				[S in TypeIn<State>]: (props: {
					send: (e: Event[S]) => void
					state: PayloadOf<State, S>
				}) => Result
			}
		}) => ({
			getResult:
				(handlers: {
					onExit: (final: Final) => void
					setState: (state: State) => void
				}) =>
				(state: State) =>
					(opts.implementation as any)[state.type]((e: any) => {
						const next = (flow.states as any)[state.type][e.type]?.(
							e[PAYLOAD],
							state[PAYLOAD],
						)
						if (next instanceof Exit) return handlers.onExit(next.value)
						handlers.setState(next)
					}, state[PAYLOAD]),
			init: (props: Props) => fromInit(flow.init, props),
		})
}
