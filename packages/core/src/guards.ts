import { AnyFunction } from './types'

export function isFunction(u: unknown): u is AnyFunction {
	return typeof u === 'function'
}

export function isNullish(u: unknown): u is null | undefined {
	return u == null
}

export function isUnknown(_u: unknown): _u is unknown {
	return true
}

export function isPromise(u: unknown): u is Promise<unknown> {
	return typeof u === 'object' && u !== null && isFunction((u as any).then)
}

export function isArray(v: unknown): v is unknown[] {
	return Array.isArray(v)
}
