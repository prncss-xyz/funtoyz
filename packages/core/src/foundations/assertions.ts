import { Result, result } from './results'
import { AnyTag } from './tags'

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

function successful_<T>(value: Result<T, AnyTag>, message?: string) {
	if (result.success.is(value)) return result.success.get(value)
	forbidden(message ?? 'Unexpected failure')
}

export function successful(message?: string): <T>(value: Result<T, AnyTag>) => T
export function successful<T>(value: Result<T, AnyTag>, message?: string): T
export function successful(...args: any[]): any {
	switch (args.length) {
		case 1:
			if (typeof args[0] === 'string')
				return function (a0: any) {
					return successful_(a0, args[0])
				}
			return successful_(args[0])
		case 2:
			return successful_(args[0], args[1])
		/* c8 ignore next 2 */
		default:
			return forbidden()
	}
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
