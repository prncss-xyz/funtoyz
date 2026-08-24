import { KeywiseIntersection, KeywiseUnion } from '../../types'
import {
	AnyMachine,
	InferMachineEventIn,
	InferMachineEventOut,
	InferMachineResult,
} from '../dispatch'

export type MS = Record<string, AnyMachine>

export type MapResult<M> = {
	[K in keyof M]?: (result: InferMachineResult<M[K]>) => unknown
}

export type Result<M, R extends {}> = {
	[K in keyof M]: K extends keyof R
		? NonNullable<R[K]> extends (result: InferMachineResult<M[K]>) => infer T
			? T
			: InferMachineResult<M[K]>
		: InferMachineResult<M[K]>
}

export type EvIn<M> = KeywiseIntersection<{
	[K in keyof M]: InferMachineEventIn<M[K]>
}>

export type EvOut<M> = KeywiseUnion<{
	[K in keyof M]: InferMachineEventOut<M[K]>
}>
