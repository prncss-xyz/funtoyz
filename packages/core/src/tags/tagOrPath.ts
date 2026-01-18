import { tag } from './tag'
import { type AnyTag, PAYLOAD, TYPE } from './types'

export type PathFromTag<I extends AnyTag> =
	| PathFromTagOpt<I>
	| PathFromTagRec<I>
type PathFromTagOpt<I extends AnyTag> = I extends {
	[PAYLOAD]?: unknown
	[TYPE]: infer T
}
	? undefined extends I['payload']
		? [T]
		: never
	: never
type PathFromTagRec<I> = I extends { [PAYLOAD]?: infer P; [TYPE]: infer T }
	? [T, ...PathFromTagRec<P>]
	: [I]

export type TagOrPath<T extends AnyTag> = [T] | PathFromTag<T>

// this is not meant to be called directly, but rather used to make a function more convenient
export function tagOrPath<T extends AnyTag>(...args: TagOrPath<T>): T {
	return typeof args[0] === 'object' ? args[0] : (tag as any)(...args)
}
