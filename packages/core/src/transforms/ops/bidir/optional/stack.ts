import { optional } from '.'
import { Nothing } from '../../../../tags/results'

export function stack<X>() {
	return optional<X, X[], Nothing>({
		get: (xs) => xs.at(-1),
		remove: (xs) => (xs.length ? xs.slice(0, -1) : xs),
		set: (x, xs) => [...xs, x],
	})
}
