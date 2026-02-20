import { fromInit, Init } from '../functions/arguments/init'
import { AnyTag, PAYLOAD, PayloadOf, TypeIn } from '../tags/types'

// Do not write tests for this
// TODO: exit handler, maybe other handlers

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
					) => State
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
						handlers.setState(next)
					}, state[PAYLOAD]),
			init: (props: Props) => fromInit(flow.init, props),
		})
}
