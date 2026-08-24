import { fromInit } from '../../functions/arguments/init'
import { createTag } from '../../tags/createTag'
import { tag } from '../../tags/tag'
import { PAYLOAD, Tag, Tags, TYPE } from '../../tags/types'
import { Prettify } from '../../types'
import {
	dispatchMachine,
	InferMachineEventOut,
	InferMachineProps,
	InferMachineState,
	Machine,
	MachineHandlers,
} from '../dispatch'
import { EvIn, EvOut, MapResult, MS, Result } from './_types'

const EXIT = 'exit'
type Exit = typeof EXIT
const exit = createTag(EXIT)

// all props key that can be undefined are optional
type Props<M> = Tags<{
	[K in keyof M]: InferMachineProps<M[K]>
}>

type State<M> = Tags<{
	[K in keyof M]: InferMachineState<M[K]>
}>

type ExitPayload<M> =
	InferMachineEventOut<M> extends { [EXIT]: infer T } ? T : never

type MapExit<M, F> = {
	[K in keyof M as M[K] extends { [EXIT]: any } ? never : K]: (
		e: ExitPayload<M[K]>,
	) => Props<M> | Tag<Exit, F>
}

export function sumMachine<F>() {
	return function <M extends MS, const R extends MapResult<M> = {}>(
		machines: M,
		{
			exit: mapExit,
			result: mapResult,
		}: { exit: MapExit<M, F>; result?: MapResult<M> & R },
	) {
		function init(p: any) {
			return tag(p[TYPE], fromInit(machines[p[TYPE]]!.init, p[PAYLOAD])) as any
		}
		const eventTypes = new Set(
			Object.values(machines).flatMap((machine) =>
				Object.keys(machine.handlers),
			),
		)
		const handlers = Object.fromEntries(
			[...eventTypes].map((eventType) => [
				eventType,
				(payload: unknown, state: State<M>, send: (event: any) => void) => {
					let nextState: State<M> | undefined
					const type = state[TYPE]
					const machine = machines[type] as any
					const reduced = (dispatchMachine as any)(
						machine,
						{ type: eventType, payload },
						state[PAYLOAD] as any,
						(event: any) => {
							if (exit.is(event)) {
								const mapped = (mapExit as any)[type](exit.get(event))
								if (mapped[TYPE] === EXIT) send(mapped)
								else nextState = init(mapped)
							} else send(event)
						},
					)
					return nextState ?? (tag(type, reduced) as any)
				},
			]),
		) as MachineHandlers<
			EvIn<M>,
			State<M>,
			Prettify<Omit<EvOut<M>, Exit> & { [EXIT]: F }>
		>
		return {
			handlers,
			init,
			result: (state) => {
				const type = state[TYPE]
				const machine = machines[type] as any
				const result = machine.result
					? machine.result(state[PAYLOAD])
					: state[PAYLOAD]
				const mapper = mapResult?.[type] as
					| ((result: unknown) => unknown)
					| undefined
				return tag(type, mapper ? mapper(result) : result) as any
			},
		} as Machine<
			Props<M>,
			EvIn<M>,
			State<M>,
			Tags<Result<M, R>>,
			Prettify<Omit<EvOut<M>, Exit> & { [EXIT]: F }>
		>
	}
}
