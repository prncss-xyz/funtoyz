import { AnyTag, PAYLOAD, Tag, TYPE } from './types'

export function createTag<Prop extends PropertyKey>(prop: Prop) {
	function of(t: void): {
		[PAYLOAD]: void
		[TYPE]: Prop
	}
	function of<P>(t: P): {
		[PAYLOAD]: P
		[TYPE]: Prop
	}
	function of<P>(t: P) {
		return { [PAYLOAD]: t, [TYPE]: prop }
	}
	return {
		chain<P, O extends AnyTag, W extends AnyTag>(
			v: O | Tag<Prop, P>,
			cb: (payload: P) => W,
		): Exclude<O, { [TYPE]: Prop }> | W {
			if (v[TYPE] === prop) return cb(v[PAYLOAD])
			return v as Exclude<O, { [TYPE]: Prop }>
		},
		get<P>(t: Tag<Prop, P>) {
			return t[PAYLOAD]
		},
		is<P>(
			v: Tag<Exclude<PropertyKey, Prop>, unknown> | Tag<Prop, P>,
		): v is { [PAYLOAD]: P; [TYPE]: Prop } {
			return v[TYPE] === prop
		},
		map<P, O extends AnyTag, Q>(
			v: O | Tag<Prop, P>,
			cb: (payload: P) => Q,
		): Exclude<O, { [TYPE]: Prop }> | { [PAYLOAD]: Q; [TYPE]: Prop } {
			if (v[TYPE] === prop)
				return { [PAYLOAD]: cb(v[PAYLOAD]), [TYPE]: prop } as Tag<Prop, Q>
			return v as O
		},
		of,
	}
}
