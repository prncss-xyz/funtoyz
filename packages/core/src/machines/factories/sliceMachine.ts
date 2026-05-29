import { fromInit } from '../../functions/arguments/init'
import { id } from '../../functions/basics'
import { Tag } from '../../tags/types'
import { Prettify, ValueUnion } from '../../types'
import {
	InferMachineEventIn,
	InferMachineProps,
	InferMachineState,
} from '../core'
import { EvOut, MapResult, MS, Result } from './_types'
import { baseMachine } from './base'

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

export function sliceMachine<
	M extends MS,
	E extends { [K in keyof M]: (e: EvOut<M>) => void },
	const R extends MapResult<M> = {},
>(
	ms: M,
	opts?: {
		events?: E
		result?: MapResult<M> & R
	},
) {
	return baseMachine<EvOut<M>>()<EvIn<M>, State<M>, Props<M>, Result<M, R>>(
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
				const res0 = v.result ? v.result(state[k]) : id
				res[k] = opts?.result?.[k] ? opts.result[k](res0) : res0
			}
			return res
		},
	)
}
