import { ValueUnion } from '../types'
import { AnyTag, PayloadOf, TypeIn } from './core'

export type Send<T extends AnyTag> =
	| T
	| ValueUnion<{
			[K in TypeIn<T>]: undefined extends PayloadOf<T, K> ? K : never
	  }>

export function sender<T extends AnyTag>(t: Send<T>) {
	if (typeof t === 'string') {
		return { payload: undefined, type: t }
	}
	return t
}
