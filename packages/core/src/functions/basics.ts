import { isFunction } from '../guards'
import { Modify } from './types'

/* c8 ignore next 1 */
export function noop() {}

export function id<T>(t: T) {
	return t
}

export function pipe2<P, Q, R>(f: (p: P) => Q, g: (q: Q) => R): (p: P) => R {
	if (f === id) return g as unknown as (p: P) => R
	if (g === id) return f as unknown as (p: P) => R
	return (p: P) => g(f(p))
}

export type SetState<T> = Modify<T> | T
export function setState<T>(next: SetState<T>, last: T): T {
	return isFunction(next) ? next(last) : next
}
