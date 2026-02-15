import { noop } from '../../../../functions/basics'
import { Empty } from '../../../../objects/types'
import { compose } from '../../../compose'

export function iso<T, S>({
	get,
	set,
}: {
	get: (t: T) => S
	set: (s: S) => T
}) {
	const reviewer = (s: S, next: (t: T) => void) => next(set(s))
	return compose<T, S, never, never, Empty>({
		emitter: (e) => (s, next, error, complete) =>
			e(s, (s) => next(get(s)), error, complete),
		flags: {},
		getter: (t, next) => next(get(t)),
		modifier: (m, next, t) => m(get(t), (s) => next(set(s))),
		remover: noop,
		reviewer,
		setter: reviewer,
	})
}
