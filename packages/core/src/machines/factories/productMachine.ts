import { fromInit } from '../../functions/arguments/init'
import { id } from '../../functions/basics'
import { Tag } from '../../tags/types'
import { ValueIntersection, ValueUnion } from '../../types'
import { AnyMachine, Machine } from '../core'
import { baseMachine } from './base'

type MS = Record<string, AnyMachine>

// all props key that can be undefined are optional
type Props<M extends MS> = {
	[K in keyof M]: M[K] extends Machine<infer T, any, any, any, any, any>
		? T extends undefined
			? never
			: T
		: never
} & {
	[K in keyof M]?: M[K] extends Machine<infer T, any, any, any, any, any>
		? T
		: never
}

type EventIn<M extends MS> = ValueUnion<{
	[K in keyof M]: M[K] extends Machine<any, infer T, any, any, any, any>
		? Tag<K, T>
		: never
}>

type State<M extends MS> = {
	[K in keyof M]: M[K] extends Machine<any, any, infer T, any, any, any>
		? T
		: never
}

type Result<M extends MS> = {
	[K in keyof M]: M[K] extends Machine<any, any, any, infer T, any, any>
		? T
		: never
}

type CW<M extends MS> = ValueIntersection<{
	[K in keyof M]: M[K] extends Machine<any, any, any, any, infer T, any>
		? T
		: never
}>

type CR<M extends MS> = ValueIntersection<{
	[K in keyof M]: M[K] extends Machine<any, any, any, any, any, infer T>
		? T
		: never
}>

export function productMachine<M extends MS>(ms: M) {
	return baseMachine<CW<M>, CR<M>>()<EventIn<M>, State<M>, Props<M>, Result<M>>(
		(p) => {
			const res = {} as any
			for (const [k, v] of Object.entries(ms)) {
				res[k] = fromInit(v.init, p[k])
			}
			return res
		},
		(event: any, state, send) => {
			const res = {} as any
			for (const [k, v] of Object.entries(ms))
				res[k] = v.reduce(event[k], state[k], send)
			return res
		},
		(state, cr) => {
			const res = {} as any
			for (const [k, v] of Object.entries(ms)) {
				res[k] = v.result ? v.result(state[k], cr) : id
			}
			return res
		},
	)
}
