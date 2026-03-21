import { append, remove, replace } from '../../../../arrays'
import { Nothing } from '../../../../tags/results'
import { Compose } from '../../../compose/index'
import { optional } from './index'

// TODO: modifier

export function findOne<X, Y extends X>(
	p: (x: X) => x is Y,
): Compose<X[], Y, never, Nothing, { CONSTRUCT: false; EXISTS: false }>
export function findOne<X>(
	p: (x: X) => unknown,
): Compose<X[], X, never, Nothing, { CONSTRUCT: false; EXISTS: false }>
export function findOne<X>(p: (x: X) => unknown) {
	return optional<X, X[], Nothing>({
		get: (xs: X[]) => xs.find(p),
		remove: (xs: X[]) => {
			const index = xs.findIndex(p)
			if (index < 0) return xs
			return remove(index)(xs)
		},
		set: (x: X, xs: X[]) => {
			const index = xs.findIndex(p)
			if (index < 0) return append(x)(xs)
			return replace(x, index)(xs)
		},
	})
}
