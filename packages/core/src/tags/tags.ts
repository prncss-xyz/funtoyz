import { Equals } from '../types'
import { AnyTag, PAYLOAD, PayloadOf, Tag, TYPE, TypeIn } from './types'

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
