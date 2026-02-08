import { noop } from '../../../functions/basics'
import { Empty } from '../../../objects/types'
import { compose } from '../../core'

export function iso<S, T>({
	get,
	set,
}: {
	get: (s: T) => S
	set: (t: S) => T
}) {
	const reviewer = (t: S, next: (s: T) => void) => next(set(t))
	return compose<T, S, never, never, Empty>({
		emitter: (e) => (s, next, error, complete) =>
			e(s, (s) => next(get(s)), error, complete),
		flags: {},
		getter: (s, next) => next(get(s)),
		modifier: (m, next, s) => m(get(s), (t) => next(set(t))),
		remover: noop,
		reviewer,
		setter: reviewer,
	})
}
