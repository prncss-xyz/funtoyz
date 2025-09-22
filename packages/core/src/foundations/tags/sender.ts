import { ValueUnion } from '../types'
import { AnyTag, PAYLOAD, PayloadOf, TYPE, TypeIn } from './core'

export type Send<T extends AnyTag> =
	| T
	| ValueUnion<{
			[K in TypeIn<T>]: undefined extends PayloadOf<T, K> ? K : never
	  }>

export function sender<T extends AnyTag>(t: Send<T>): T {
	return typeof t === 'string' ? ({ [PAYLOAD]: undefined, [TYPE]: t } as T) : t
}
