import { optional } from '.'
import { Nothing } from '../../../../tags/results'

export function queue<X>() {
	return optional<X, X[], Nothing>({
		get: (xs) => xs.at(0),
		remove: (xs) => (xs.length ? xs.slice(1) : xs),
		set: (x, xs) => [...xs, x],
	})
}
