import { AnyFunction } from './types'

/* c8 ignore start */
export function isFunction(u: unknown): u is AnyFunction {
	return typeof u === 'function'
}

export function isNullish(u: unknown) {
	return u == null
}

export function isUnknown(_u: unknown): _u is unknown {
	return true
}

export function isPromise(u: unknown): u is Promise<unknown> {
	return typeof u === 'object' && u !== null && isFunction((u as any).then)
}

/* c8 ignore stop */
