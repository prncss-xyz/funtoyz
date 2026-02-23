import { Reducer } from '.'

export function sumFold(): Reducer<number> {
	return {
		init: 0,
		reduce: (t, acc) => acc + t,
	}
}

export function productFold(): Reducer<number> {
	return {
		init: 1,
		reduce: (t, acc) => acc * t,
	}
}

export function lengthFold<I>(): Reducer<I, number> {
	return {
		init: 0,
		reduce: (_t, acc) => acc + 1,
	}
}

export function groupBy<P extends PropertyKey, T>(
	keyFn: (t: T) => P | undefined,
): Reducer<T, Record<P, T[]>> {
	return {
		init: () => ({}) as any,
		reduce: (t: T, groups) => {
			const key = keyFn(t)
			if (key !== undefined) {
				groups[key] ??= []
				groups[key].push(t)
			}
			return groups
		},
	}
}
