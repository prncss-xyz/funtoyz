import { exhaustive } from '../../assertions'
import { pipe2 } from '../../functions/basics'
import { result, Result } from '../../tags/results'
import { ISource } from '../core'
import { Flags, HasFlag } from '../flags'
import { reduce, toArray } from '../methods'

export function view<T, S, F extends { SYNC: false }>(
	o: ISource<T, S, never, never, F>,
): (s: S) => Promise<T>
export function view<T, S, F extends Flags>(
	o: ISource<T, S, never, never, HasFlag<'SYNC', F>>,
): (s: S) => T
export function view<T, S, F extends Flags>(o: ISource<T, S, never, never, F>) {
	if (o.flags.SYNC === false)
		return function (s: S) {
			return new Promise<T>((resolve) => {
				o.getter(s, resolve, exhaustive)
			})
		}
	return function (s: S): T {
		let res: T
		o.getter(s, (t) => (res = t), exhaustive)
		return res!
	}
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
	if (o.flags.SYNC === false)
		return function (s: S) {
			return new Promise<Result<T, G>>((resolve) => {
				o.getter(
					s,
					pipe2(result.success.of, resolve),
					pipe2(result.failure.of, resolve),
				)
			})
		}
	return function (s: S): Result<T, G> {
		let res: Result<T, G>
		o.getter(
			s,
			(t) => (res = result.success.of(t)),
			(t) => (res = result.failure.of(t)),
		)
		return res!
	}
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
	if (o.flags.SYNC === false)
		return function (s: S) {
			return new Promise<T[]>((resolve) => {
				reduce(toArray<T>(), o)(s, resolve, exhaustive)
			})
		}
	return function (s: S): T[] {
		let res: T[]
		reduce(toArray<T>(), o)(s, (t) => (res = t), exhaustive)
		return res!
	}
}
