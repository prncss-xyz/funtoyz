import { Reducer } from '.'
import { insert, insertSorted } from '../arrays'
import { compare } from '../functions/elementary'

export function maxFold(): Reducer<number> {
	return {
		init: -Infinity,
		reduce: (t, acc) => (t > acc ? t : acc),
	}
}

export function minFold(): Reducer<number> {
	return {
		init: Infinity,
		reduce: (t, acc) => (t < acc ? t : acc),
	}
}

export function sort<T>(cmp = compare<T>): Reducer<T, T[]> {
	return {
		init: () => [],
		reduce: insertSorted(cmp),
	}
}

export function shuffle<T>(): Reducer<T, T[]> {
	return {
		init: () => [],
		reduce(t, acc) {
			const i = Math.floor(Math.random() * (acc.length + 1))
			return insert(i, t)(acc)
		},
	}
}
