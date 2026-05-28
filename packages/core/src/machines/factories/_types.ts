import { Tags, FromTags } from '../../tags/types'
import { ValueEventIntersection, ValueUnion } from '../../types'
import {
	AnyMachine,
	InferMachineEventIn,
	InferMachineEventOut,
	InferMachineResult,
} from '../core'

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

export type EvIn<M> = Tags<
	ValueEventIntersection<{
		[K in keyof M]: FromTags<InferMachineEventIn<M[K]>>
	}>
>

export type EvOut<M> = ValueUnion<{
	[K in keyof M]: InferMachineEventOut<M[K]>
}>
