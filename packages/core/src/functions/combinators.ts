export function negate<T, U extends T>(
	f: (v: T) => v is U,
): (v: T) => v is Exclude<T, U>
export function negate<T>(f: (v: T) => boolean): (v: T) => boolean
export function negate<T>(f: (v: T) => boolean) {
	return function (v: T) {
		return !f(v)
	}
}
