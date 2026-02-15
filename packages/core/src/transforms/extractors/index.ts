import { exhaustive } from '../../assertions'
import { pipe2 } from '../../functions/basics'
import { Modify } from '../../functions/types'
import { isFunction } from '../../guards'
import { result, Result } from '../../tags/results'
import { ISource } from '../compose'
import { Flags, HasFlag } from '../compose/_flags'
import { reduce, toArray } from '../compose/_methods'

function extract<R, Args extends any[]>(
	sync: boolean | undefined,
	action: (resolve: (r: R) => void, ...args: Args) => void,
) {
	if (sync === false)
		return function (...args: Args) {
			return new Promise<R>((resolve) => {
				action(resolve, ...args)
			})
		}
	return function (...args: Args): R {
		let res: R
		action((r) => (res = r), ...args)
		return res!
	}
}

export function view<T, S, F extends { SYNC: false }>(
	o: ISource<T, S, never, never, F>,
): (s: S) => Promise<T>
export function view<T, S, F extends Flags>(
	o: ISource<T, S, never, never, HasFlag<'SYNC', F>>,
): (s: S) => T
export function view<T, S, F extends Flags>(o: ISource<T, S, never, never, F>) {
	return extract<T, [S]>(o.flags.SYNC, (next, s) =>
		o.getter(s, next, exhaustive),
	)
}

export function preview<T, S, E, G, F extends { SYNC: false }>(
	o: ISource<T, S, E, G, F>,
): (s: S) => Promise<Result<T, G>>
export function preview<T, S, E, G, F extends Flags>(
	o: ISource<T, S, E, G, HasFlag<'SYNC', F>>,
): (s: S) => Result<T, G>
export function preview<T, S, E, G, F extends Flags>(
	o: ISource<T, S, E, G, F>,
) {
	return extract<Result<T, G>, [S]>(o.flags.SYNC, (next, s) =>
		o.getter(s, pipe2(result.success.of, next), pipe2(result.failure.of, next)),
	)
}

export function collect<T, S, G, F extends { SYNC: false }>(
	o: ISource<T, S, never, G, F>,
): (s: S) => Promise<T[]>
export function collect<T, S, G, F extends Flags>(
	o: ISource<T, S, never, G, HasFlag<'SYNC', F>>,
): (s: S) => T[]
export function collect<T, S, G, F extends Flags>(
	o: ISource<T, S, never, G, F>,
) {
	return extract<T[], [S]>(o.flags.SYNC, (next, s) =>
		reduce(toArray<T>(), o)(s, next, exhaustive),
	)
}

export function review<T, S, G, E, F extends { SYNC: false }>(
	o: ISource<T, S, G, E, F>,
): (t: T) => Promise<S>
export function review<T, S, G, E, F extends Flags>(
	o: ISource<T, S, G, E, HasFlag<'SYNC', F>>,
): (t: T) => S
export function review<T, S, G, E, F extends Flags>(
	o: ISource<T, S, G, E, HasFlag<'CONSTRUCT', F>>,
) {
	return extract<S, [T]>(o.flags.SYNC, (next, t) => o.reviewer(t, next))
}

export const REMOVE = Symbol('REMOVE')
type Update<T> = Modify<T> | T | typeof REMOVE

export function update<T, S, G, E, F extends { SYNC: false }>(
	o: ISource<T, S, G, E, F>,
): (t: Update<T>, s: S) => Promise<S>
export function update<T, S, G, E, F extends Flags>(
	o: ISource<T, S, G, E, HasFlag<'SYNC', F>>,
): (t: Update<T>, s: S) => S
export function update<T, S, G, E, F extends Flags>(
	o: ISource<T, S, G, E, HasFlag<'WRITE', F>>,
) {
	return extract<S, [Update<T>, S]>(o.flags.SYNC, (next, t, s) => {
		if (isFunction(t))
			return o.modifier(
				(v, n) => {
					console.log('modifier')
					return n(t(v))
				},
				next,
				s,
			)
		console.log('missed')
		if (t === REMOVE) return o.remover(s, next)
		return o.setter(t, next, s)
	})
}

export function over<T, S, G, E, F extends Flags>(
	o: ISource<T, S, G, E, HasFlag<'WRITE', F>>,
) {
	return extract<S, [Modify<T>, S]>(o.flags.SYNC, (next, t, s) => {
		return o.modifier(
			(v, n) => {
				console.log('modifier')
				return n(t(v))
			},
			next,
			s,
		)
	})
}
