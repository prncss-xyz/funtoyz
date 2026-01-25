import { Nothing } from '../../../tags/results'
import { removableOpt } from './removableOpt'

// defective
// aka append
// can represent a stack
export function stack<X>() {
	return removableOpt<X, X[], Nothing>({
		get: (xs) => xs.at(-1),
		remove: (xs) => (xs.length ? xs.slice(0, -1) : xs),
		set: (x, xs) => [...xs, x],
	})
}
