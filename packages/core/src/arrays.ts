function cmp0<T>(a: T, b: T): number {
	return a < b ? -1 : a > b ? 1 : 0
}

// this provides better type inference
export function insertSorted<T>(t: T) {
	return insertCmp(cmp0)(t)
}

export function insertCmp<T>(cmp = cmp0<T>) {
	return function (t: T) {
		return function (acc: T[]) {
			for (let i = 0; i < acc.length; i++) {
				const v = acc[i]!
				const r = cmp(v, t)
				if (r < 0) continue
				if (r === 0) return acc
				if (r > 0) return acc.slice(0, i).concat([t], acc.slice(i))
			}
			return acc.concat(t)
		}
	}
}

export function symmetricDiff<X>(a: X[], b: X[]) {
	return [
		a.filter((x) => !b.includes(x)),
		b.filter((x) => !a.includes(x)),
	] as const
}

export function insert<T>(index: number, x: T) {
	return function (xs: T[]) {
		if (index < 0) index += xs.length
		if (index < 0) return xs
		if (index > xs.length) return xs
		return [...xs.slice(0, index), x, ...xs.slice(index)]
	}
}

export function replace<T>(x: T, index: number) {
	return function (xs: T[]) {
		if (index < 0) index += xs.length
		if (index < 0) return xs
		if (index >= xs.length) return xs
		if (Object.is(xs[index], x)) return xs
		return [...xs.slice(0, index), x, ...xs.slice(index + 1)]
	}
}

export function remove<T>(index: number) {
	return function (xs: T[]) {
		if (index < 0) index += xs.length
		if (index < 0) return xs
		if (index >= xs.length) return xs
		return [...xs.slice(0, index), ...xs.slice(index + 1)]
	}
}
