import { remove, replace } from '../../../arrays'
import { Nothing } from '../../../tags/results'
import { removableOpt } from './removableOpt'

export function at<X>(index: number) {
	return removableOpt<X, X[], Nothing>({
		get: (xs) => {
			return xs.at(index)
		},
		remove: (xs) => remove(index)(xs),
		set: (x: X, xs) => replace(x, index)(xs),
	})
}
