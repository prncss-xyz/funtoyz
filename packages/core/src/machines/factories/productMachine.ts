import { fromInit } from '../../functions/arguments/init'
import { id } from '../../functions/basics'
import { Prettify, ValueIntersection } from '../../types'
import { Machine } from '../core'
import { baseMachine } from './base'

type MS<E> = Record<string, Machine<any, E, any, any, any, any>>

// all props key that can be undefined are optional
type Props<M extends MS<any>> = Prettify<
	{
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
>

type State<M extends MS<any>> = Prettify<{
	[K in keyof M]: M[K] extends Machine<any, any, infer T, any, any, any>
		? T
		: never
}>

type Result<M extends MS<any>> = Prettify<{
	[K in keyof M]: M[K] extends Machine<any, any, any, infer T, any, any>
		? T
		: never
}>

type CW<M extends MS<any>> = ValueIntersection<{
	[K in keyof M]: M[K] extends Machine<any, any, any, any, infer T, any>
		? T
		: never
}>

type CR<M extends MS<any>> = ValueIntersection<{
	[K in keyof M]: M[K] extends Machine<any, any, any, any, any, infer T>
		? T
		: never
}>

export function productMachine<E>() {
	return function <M extends MS<E>>(ms: M) {
		return baseMachine<CW<M>, CR<M>>()<E, State<M>, Props<M>, Result<M>>(
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
					res[k] = v.reduce(event, state[k], send)
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
}
