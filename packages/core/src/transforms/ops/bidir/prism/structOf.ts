import { toExhaustive } from '../../../../assertions'
import { fromInit } from '../../../../functions/arguments/init'
import { id } from '../../../../functions/basics'
import { Empty } from '../../../../objects/types'
import { Reducer } from '../../../../reduce'
import { Optic } from '../../../compose'
import { Emitter, EmitterReturn, Getter } from '../../../compose/_methods'
import { Flags, HasFlag } from '../../../compose/flags'
import { Traversal } from '../traversal'
import { toArray } from '../traversal/elems'

// TODO: when getter is trush, we can skip creating the new value, also needed for referential stability
// TODO: add a flag to know if we are changing value or just filtering

// in theory, optics could be an emitter instead of a getter, however, we don't think there is
// any significant use case, so this is not implemented
function getGetter_<V1, V2, ACC2, RES1, RES2, E = void>(
	read: { emitter: Emitter<V1, RES1, never> },
	write: Reducer<V2, ACC2, RES2>,
	o: { getter?: Getter<V2, V1, E> },
): Getter<RES2, RES1, E> | undefined {
	const getter = o.getter
	if (getter === undefined) return undefined
	const result = write.result ?? (id as never)
	const reduce = write.reduceDest ?? ((read as any).reduce as never)
	return (s, next, e) => {
		let done = false
		let acc = fromInit(write.init)
		let res: EmitterReturn | undefined
		res = read.emitter(
			s,
			(t) => {
				// TODO: should accept emitter
				getter(
					t,
					(t) => {
						if (!done) acc = reduce(t, acc)
					},
					(v) => {
						e(v)
						done = true
					},
				)
			},
			toExhaustive,
			() => {
				if (!done) {
					res!.abort()
					next(result(acc))
				}
			},
		)
		res.start()
	}
}

// TODO: fallback
// TODO: object/tuple
// TODO: opt, default
// TODO: validation
// TODO: recursive
// TODO: partsOf

// TODO: modifier
export function structOf<V1, V2, ACC1, ACC2, RES1, RES2>(
	write: Traversal<V1, ACC1, RES1>,
	read: Traversal<V2, ACC2, RES2>,
) {
	return function <E extends G, G, F extends Flags>(
		o: Optic<V1, V2, E, G, HasFlag<'READ' | 'UNIQUE', F>>,
	): Optic<
		RES1,
		RES2,
		E,
		G,
		(F['CONSTRUCT'] extends false
			? { CONSTRUCT: false; WRITE: false }
			: Empty) &
			(F['SYNC'] extends false ? { SYNC: false } : Empty)
	> {
		const reviewer = o.reviewer
			? getGetter_(write, read, { getter: o.reviewer })
			: undefined
		return {
			flags: {
				CONSTRUCT: o.flags.CONSTRUCT as never,
				SYNC: o.flags.SYNC as never,
				WRITE: o.flags.CONSTRUCT as never,
			},
			getter: getGetter_(read, write, o),
			reviewer: reviewer as never,
		}
	}
}

export function arrayOf<V1, V2>() {
	return structOf(toArray<V1>(), toArray<V2>())
}
