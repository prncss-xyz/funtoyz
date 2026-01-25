export function negate<T>(f: (v: T) => unknown) {
	return function (v: T) {
		return !f(v)
	}
}
