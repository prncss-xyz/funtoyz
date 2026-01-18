/**
 * Use to assert all cases are covered.
 */
export function exhaustive(v: never): never {
	throw new Error(`Unexpected value: ${v}`)
}

/**
 * Use to assert a codepath is never reached.
 */
export function forbidden(message?: string): never {
	throw new Error(message ?? 'Reached forbidden code')
}

export function asserted<U, V extends U>(
	predicate: (value: U) => value is V,
	message?: string,
): <T>(value: T & U) => T & V
export function asserted<T>(
	predicate: (value: T) => boolean,
	message?: string,
): (value: T) => T
export function asserted<T>(
	predicate: (value: T) => boolean,
	message?: string,
) {
	return function (value: T) {
		if (predicate(value)) return value
		forbidden(message ?? 'Assertion failed')
	}
}

export function assertion(
	condition: boolean,
	message?: string,
): asserts condition {
	if (condition === false) throw new Error(message ?? 'Assertion failed')
}
