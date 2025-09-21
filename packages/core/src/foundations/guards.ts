/* c8 ignore start */
export function isFunction<T>(x: T): x is ((...args: any[]) => any) & T {
	return typeof x === 'function'
}

export function isNumber(u: unknown) {
	return typeof u === 'number'
}

export function isString(u: unknown) {
	return typeof u === 'string'
}

export function isBoolean(u: unknown) {
	return typeof u === 'boolean'
}

export function isUndefined(u: unknown) {
	return u === undefined
}

export function isNull(u: unknown) {
	return u === null
}

export function isNullish(u: unknown) {
	return u === null || u === undefined
}

export function isNonNullish(u: unknown) {
	return !isNullish(u)
}

export function isUnknown(u: unknown): u is unknown {
	return true
}
/* c8 ignore stop */
