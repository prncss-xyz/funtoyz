import { AnyTag, PAYLOAD, Tag, TYPE } from '../../tags/types'
import { Prettify } from '../../types'

export type Sendable<T> = Prettify<
	T | (T extends Tag<infer U, infer V> ? (V extends void ? U : never) : never)
>

export function fromSendable<T extends AnyTag>(event: Sendable<T>): T {
	return typeof event === 'object'
		? event
		: ({ [PAYLOAD]: undefined, [TYPE]: event } as unknown as T)
}
