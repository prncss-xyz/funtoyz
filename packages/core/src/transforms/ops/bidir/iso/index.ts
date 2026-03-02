import { Empty } from '../../../../objects/types'
import { compose } from '../../../compose'

// TODO: add a setter for referential transparency

export function iso<T, S>({
	get,
	set,
}: {
	get: (t: T) => S
	set: (s: S) => T
}) {
	return compose<T, S, never, never, Empty>({
		flags: {},
		getter: (t, next) => next(get(t)),
		reviewer: (s: S, next: (t: T) => void) => next(set(s)),
	})
}
