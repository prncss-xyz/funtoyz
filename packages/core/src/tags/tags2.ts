import { AnyTag, PAYLOAD, Tag, TYPE } from './types'

type TagTools<K extends string> = {
	get: <P>(v: Tag<K, P>) => P
	is: <P, U extends Tag<K, P>>(v: Tag<K, P> | U) => v is Tag<K, P>
	of: <P>(p: P) => Tag<K, P>
}

export type TT<K extends string> = {
	[T in K]: TagTools<T>
}

export function getTT<K extends string = string>(): TT<K> {
	const cache = {}
	return new Proxy(cache, {
		get(_, prop: string) {
			return {
				get<T extends AnyTag>(t: T) {
					return t[PAYLOAD]
				},
				is<T extends AnyTag>(t: T) {
					return t[TYPE] === prop
				},
				of<T>(t: T) {
					return { [PAYLOAD]: t, [TYPE]: prop }
				},
			}
		},
	}) as TT<K>
}

export const tt = getTT()
