import { AnyFunction } from './types'

/* c8 ignore start */
export function isFunction(u: unknown): u is AnyFunction {
	return typeof u === 'function'
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
	return u == null
}

export function isUnknown(_u: unknown): _u is unknown {
	return true
}
/* c8 ignore stop */
