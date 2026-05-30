import { fromInit } from '../../functions/arguments/init'
import { createTag } from '../../tags/createTag'
import { tag } from '../../tags/tag'
import { PAYLOAD, Tag, Tags, TYPE } from '../../tags/types'
import {
	InferMachineEventOut,
	InferMachineProps,
	InferMachineState,
} from '../core'
import { baseMachine } from './base'
import { EvIn, EvOut, MapResult, MS, Result } from './_types'
import { Prettify } from '../../types'

const EXIT = 'exit'
type Exit = typeof EXIT
const exit = createTag(EXIT)

// all props key that can be undefined are optional
type Props<M> = {
	[K in keyof M]: InferMachineProps<M[K]>
}

type State<M> = Tags<{
	[K in keyof M]: InferMachineState<M[K]>
}>

type ExitPayload<M> =
	InferMachineEventOut<M> extends { [EXIT]: infer T } ? T : never

type MapExit<M, F> = {
	[K in keyof M as M[K] extends { [EXIT]: any } ? never : K]: (
		e: ExitPayload<M[K]>,
	) => State<M> | Tag<Exit, F>
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
		return baseMachine<Prettify<Omit<EvOut<M>, Exit> & { [EXIT]: F }>>()<
			EvIn<M>,
			State<M>,
			Props<M>,
			Tags<Result<M, R>>
		>(
			init,
			(event: any, state, send: (e: any) => void) => {
				let ns = undefined
				const type = state[TYPE]
				const v = machines[type] as any
				const res = v.reduce(event, state[PAYLOAD], (event: any) => {
					if (exit.is(event)) {
						const res = (mapExit as any)[type](exit.get(event))
						if (res[TYPE] === EXIT) send(res)
						else ns = init(res)
					} else send(event)
				})
				return ns ?? (tag(type, res) as any)
			},
			(state) => {
				const type = state[TYPE]
				const v = machines[type] as any
				const result = v.result ? v.result(state[PAYLOAD]) : state[PAYLOAD]
				const mapper = mapResult?.[type] as
					| ((result: unknown) => unknown)
					| undefined
				return tag(type, mapper ? mapper(result) : result) as any
			},
		)
	}
}
