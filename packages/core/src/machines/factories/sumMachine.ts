import { fromInit } from '../../functions/arguments/init'
import { createTag } from '../../tags/createTag'
import { tag } from '../../tags/tag'
import { PAYLOAD, Tag, Tags, TYPE } from '../../tags/types'
import { ValueEventIntersection, ValueUnion } from '../../types'
import {
	AnyMachine,
	InferMachineEventIn,
	InferMachineEventOut,
	InferMachineProps,
	InferMachineResult,
	InferMachineState,
} from '../core'
import { baseMachine } from './base'

const EXIT = 'exit'
const exit = createTag(EXIT)

// all props key that can be undefined are optional
type Props<M> = Tags<{
	[K in keyof M]: InferMachineProps<M[K]>
}>

type State<M> = Tags<{
	[K in keyof M]: InferMachineState<M[K]>
}>

type EvIn<M> = ValueEventIntersection<{
	[K in keyof M]: InferMachineEventIn<M[K]>
}>

type EvOut<M> = ValueUnion<{
	[K in keyof M]: InferMachineEventOut<M[K]>
}>

type MapResult<M> = {
	[K in keyof M]?: (result: InferMachineResult<M[K]>) => unknown
}

type Result<M, R extends MapResult<M> = {}> = Tags<{
	[K in keyof M]: K extends keyof R
		? NonNullable<R[K]> extends (result: InferMachineResult<M[K]>) => infer T
			? T
			: InferMachineResult<M[K]>
		: InferMachineResult<M[K]>
}>

type ExitEvent<M> = Extract<InferMachineEventOut<M>, Tag<typeof EXIT, any>>

type ExitPayload<M> = ExitEvent<M> extends Tag<typeof EXIT, infer T> ? T : never

type MapMachine<M, F> = {
	[K in keyof M as ExitEvent<M[K]> extends never ? never : K]: (
		e: ExitPayload<M[K]>,
	) => State<M> | Tag<typeof EXIT, F>
}

export function sumMachine<F>() {
	return function <
		M extends Record<string, AnyMachine>,
		const R extends MapResult<M> = {},
	>(machines: M, mapMachine: MapMachine<M, F>, mapResult?: MapResult<M> & R) {
		function init(p: any) {
			return tag(p[TYPE], fromInit(machines[p[TYPE]]!.init, p[PAYLOAD])) as any
		}
		return baseMachine<
			Exclude<EvOut<M>, Tag<typeof EXIT, unknown>> | Tag<typeof EXIT, F>
		>()<EvIn<M>, State<M>, Props<M>, Result<M, R>>(
			init,
			(event: any, state, send: (e: any) => void) => {
				let ns = undefined
				const type = state[TYPE]
				const v = machines[type] as any
				const res = v.reduce(event, state[PAYLOAD], (event: any) => {
					if (exit.is(event)) {
						const res = (mapMachine as any)[type](exit.get(event))
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
