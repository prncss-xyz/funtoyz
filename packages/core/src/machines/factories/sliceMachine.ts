import { fromInit } from '../../functions/arguments/init'
import { id } from '../../functions/basics'
import { Tags } from '../../tags/types'
import { Prettify } from '../../types'
import {
	dispatchMachine,
	InferMachineEventIn,
	InferMachineProps,
	InferMachineState,
	Machine,
	MachineHandlers,
} from '../dispatch'
import { EvOut, MapResult, MS, Result } from './_types'

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

type EvIn<M extends MS> = Prettify<{
	[K in keyof M]: Tags<InferMachineEventIn<M[K]>>
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
	const handlers = Object.fromEntries(
		Object.entries(ms).map(([key, machine]) => [
			key,
			(
				event: Tags<InferMachineEventIn<typeof machine>>,
				state: State<M>,
				send: any,
			) => ({
				...state,
				[key]: dispatchMachine(machine, event, state[key], send),
			}),
		]),
	) as unknown as MachineHandlers<EvIn<M>, State<M>, EvOut<M>>
	return {
		handlers,
		init: (p) => {
			const res = {} as any
			for (const [k, v] of Object.entries(ms)) res[k] = fromInit(v.init, p[k])
			return res
		},
		result: (state) => {
			const res = {} as any
			for (const [k, v] of Object.entries(ms)) {
				const res0 = v.result ? v.result(state[k]) : id
				res[k] = opts?.result?.[k] ? opts.result[k](res0) : res0
			}
			return res
		},
	} as Machine<Props<M>, EvIn<M>, State<M>, Result<M, R>, EvOut<M>>
}
