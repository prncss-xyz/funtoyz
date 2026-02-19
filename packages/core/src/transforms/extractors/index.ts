import { exhaustive } from '../../assertions'
import { pipe2 } from '../../functions/basics'
import { Modify } from '../../functions/types'
import { isFunction } from '../../guards'
import { result, Result } from '../../tags/results'
import { Optic } from '../compose'
import { Flags, HasFlag } from '../compose/_flags'
import { first, getModifier, reduce, toArray } from '../compose/_methods'

function extract_<R, Args extends any[]>(
	sync: boolean | undefined,
	action: (resolve: (r: R) => void, ...args: Args) => void,
	...args: Args
) {
	if (sync === false)
		return new Promise<R>((resolve) => {
			action(resolve, ...args)
		})
	let res: R
	action((r) => (res = r), ...args)
	return res! as R
}

function extract1<R, P>(
	sync: boolean | undefined,
	action: (resolve: (r: R) => void, p: P) => void,
) {
	return (p: P) => extract_(sync, action, p)
}

function extract2<R, P, Q>(
	sync: boolean | undefined,
	action: (resolve: (r: R) => void, p: P, q: Q) => void,
) {
	return (p: P) => (q: Q) => extract_(sync, action, p, q)
}

export function view<T, S, F extends { SYNC: false }>(
	o: Optic<T, S, never, never, F>,
): (s: S) => Promise<T>
export function view<T, S, F extends Flags>(
	o: Optic<T, S, never, never, HasFlag<'SYNC', F>>,
): (s: S) => T
export function view<T, S, F extends Flags>(o: Optic<T, S, never, never, F>) {
	return extract1<T, S>(o.flags.SYNC, (next, s) =>
		first(o)(s, next, exhaustive),
	)
}

export function preview<T, S, E extends G, G, F extends { SYNC: false }>(
	o: Optic<T, S, E, G, F>,
): (s: S) => Promise<Result<T, G>>
export function preview<T, S, E extends G, G, F extends Flags>(
	o: Optic<T, S, E, G, HasFlag<'SYNC', F>>,
): (s: S) => Result<T, G>
export function preview<T, S, E extends G, G, F extends Flags>(
	o: Optic<T, S, E, G, F>,
) {
	return extract1<Result<T, G>, S>(o.flags.SYNC, (next, s) =>
		first(o)(s, pipe2(result.success.of, next), pipe2(result.failure.of, next)),
	)
}

export function collect<T, S, G, F extends { SYNC: false }>(
	o: Optic<T, S, never, G, F>,
): (s: S) => Promise<T[]>
export function collect<T, S, G, F extends Flags>(
	o: Optic<T, S, never, G, HasFlag<'SYNC', F>>,
): (s: S) => T[]
export function collect<T, S, G, F extends Flags>(o: Optic<T, S, never, G, F>) {
	return extract1<T[], S>(o.flags.SYNC, (next, s) =>
		reduce(toArray<T>(), o)(s, next, exhaustive),
	)
}

export function review<T, S, G, E, F extends { SYNC: false }>(
	o: Optic<T, S, G, E, HasFlag<'CONSTRUCT' | 'WRITE', F>>,
): (t: T) => Promise<S>
export function review<T, S, G, E, F extends Flags>(
	o: Optic<T, S, G, E, HasFlag<'CONSTRUCT' | 'SYNC' | 'WRITE', F>>,
): (t: T) => S
export function review<T, S, G, E, F extends Flags>(
	o: Optic<T, S, G, E, HasFlag<'CONSTRUCT' | 'WRITE', F>>,
) {
	return extract1<S, T>(o.flags.SYNC, (next, t) => o.reviewer!(t, next))
}

export const REMOVE = Symbol('REMOVE')
type Update<T> = Modify<T> | T | typeof REMOVE

export function update<T, S, G, E, F extends { SYNC: false }>(
	o: Optic<T, S, G, E, HasFlag<'WRITE', F>>,
): (t: Update<T>) => (s: S) => Promise<S>
export function update<T, S, G, E, F extends Flags>(
	o: Optic<T, S, G, E, HasFlag<'SYNC' | 'WRITE', F>>,
): (t: Update<T>) => (s: S) => S
export function update<T, S, G, E, F extends Flags>(
	o: Optic<T, S, G, E, HasFlag<'WRITE', F>>,
) {
	return extract2<S, Update<T>, S>(o.flags.SYNC, (next, t, s) => {
		if (isFunction(t)) return getModifier(o)!((v, n) => n(t(v)), next, s)
		if (t === REMOVE) return o.remover!(s, next)
		if (o.setter) return o.setter(t, next, s)
		return getModifier(o)!((_, n) => n(t), next, s)
	})
}
