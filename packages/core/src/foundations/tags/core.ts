import { Equals, Prettify, ValueUnion } from '../types'

export type Tag<Type extends PropertyKey, Payload> = {
	payload: Payload
	type: Type
}

export type AnyTag = Tag<any, any>

export type TypeIn<T extends AnyTag> = T['type']

export type PayloadOf<T extends AnyTag, Type extends TypeIn<T>> = (T & {
	type: Type
})['payload']

export type Tags<O, Context = unknown> = Prettify<
	ValueUnion<{ [K in keyof O]: Tag<K, Context & O[K]> }>
>

export type UnTags<T extends AnyTag> = {
	[K in T['type']]: PayloadOf<T, K>
}

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
					return v.type === type
				},
				of(payload: any) {
					return { payload, type }
				},
			}
		}
		return res
	}
}
