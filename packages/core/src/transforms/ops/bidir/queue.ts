import { Nothing } from '../../../tags/results'
import { removableOpt } from './removableOpt'

// defective
export function queue<X>() {
	return removableOpt<X, X[], Nothing>({
		get: (xs) => xs.at(0),
		remove: (xs) => (xs.length ? xs.slice(1) : xs),
		set: (x, xs) => [...xs, x],
	})
}
