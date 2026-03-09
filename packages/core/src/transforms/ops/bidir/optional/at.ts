import { optional } from '.'
import { remove, replace } from '../../../../arrays'
import { Nothing } from '../../../../tags/results'

export function at<X>(index: number) {
	return optional<X, X[], Nothing>({
		get: (xs) => xs.at(index),
		remove: (xs) => remove(index)(xs),
		set: (x: X, xs) => replace(x, index)(xs),
	})
}
