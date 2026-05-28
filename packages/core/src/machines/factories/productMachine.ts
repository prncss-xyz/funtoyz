import { fromInit } from '../../functions/arguments/init'
import { id } from '../../functions/basics'
import { Tag } from '../../tags/types'
import { Prettify, ValueUnion } from '../../types'
import {
	AnyMachine,
	InferMachineEventIn,
	InferMachineEventOut,
	InferMachineProps,
	InferMachineResult,
	InferMachineState,
} from '../core'
import { baseMachine } from './base'

type MS = Record<string, AnyMachine>

// all props key that can be undefined are optional
type Props<M extends MS> = Prettify<
	{
		[K in keyof M]: InferMachineProps<M[K]> extends undefined
			? never
			: InferMachineProps<M[K]>
	} & {
		[K in keyof M]?: InferMachineProps<M[K]>
	}
>

type EvIn<M extends MS> = ValueUnion<{
	[K in keyof M]: Tag<K, InferMachineEventIn<M[K]>>
}>

type State<M extends MS> = Prettify<{
	[K in keyof M]: InferMachineState<M[K]>
}>

type Result<M extends MS> = Prettify<{
	[K in keyof M]: InferMachineResult<M[K]>
}>

type EvOut<M> = ValueUnion<{
	[K in keyof M]: InferMachineEventOut<M[K]>
}>

export function sliceMachine<M extends MS>(ms: M) {
	return baseMachine<EvOut<M>>()<EvIn<M>, State<M>, Props<M>, Result<M>>(
		(p) => {
			const res = {} as any
			for (const [k, v] of Object.entries(ms)) {
				res[k] = fromInit(v.init, p[k])
			}
			return res
		},
		(event: any, state, send: any) => {
			const res = {} as any
			for (const [k, v] of Object.entries(ms))
				res[k] =
					event.type === k ? v.reduce(event.payload, state[k], send) : state[k]
			return res
		},
		(state) => {
			const res = {} as any
			for (const [k, v] of Object.entries(ms)) {
				res[k] = v.result ? v.result(state[k]) : id
			}
			return res
		},
	)
}
