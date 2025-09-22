import { Equals, Prettify, ValueUnion } from '../types'

export const TYPE = 'type'
export type Type = typeof TYPE
export const PAYLOAD = 'payload'
export type Payload = typeof PAYLOAD

export type Tag<Type extends PropertyKey, Payload> = {
	[PAYLOAD]: Payload
	[TYPE]: Type
}

export type AnyTag = Tag<any, any>

export type TypeIn<T extends AnyTag> = T[Type]

export type PayloadOf<T extends AnyTag, Type extends TypeIn<T>> = (T & {
	[TYPE]: Type
})[Payload]

export type Tags<O, Context = unknown> = Prettify<
	ValueUnion<{ [K in keyof O]: Tag<K, Context & O[K]> }>
>

function get(v: Tag<any, any>) {
	return v.payload
}

export function tags<Ta extends AnyTag>() {
	return function <const Type extends TypeIn<Ta>>(
		...ts: Type[]
	): {
		[K in Type]: {
			get: <P extends PayloadOf<Ta, K>>(v: Tag<K, P>) => P
			is: <
				P extends PayloadOf<Ta, K>,
				U extends Tag<Exclude<PropertyKey, K>, any>,
			>(
				v: Tag<K, P> | U,
			) => v is Tag<K, P>
			of: <P extends PayloadOf<Ta, K>>(
				v: (Equals<void, PayloadOf<Ta, K>> & void) | P,
			) => Tag<K, P>
		}
	} {
		const res: any = {}
		for (const type of ts) {
			res[type] = {
				get,
				is(v: AnyTag) {
					return v[TYPE] === type
				},
				of(payload: any) {
					return {
						[PAYLOAD]: payload,
						[TYPE]: type,
					}
				},
			}
		}
		return res
	}
}
